import { prisma, db } from './database';
import bcrypt from 'bcryptjs';
import {
  AdminUser,
  BusinessMetrics,
  AdminDashboardData,
  CRMClient,
  AdminProject,
  AdminEstimate,
  Building,
  BulkOperation,
  AdminActivity,
  AdminFilter,
  ProjectAnalytics,
  ClientAnalytics,
  EstimateAnalytics,
  AdminNotification,
  RevenueData
} from '@/types/admin';

// Generate a simple JWT-like token
const generateToken = (userId: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  return Buffer.from(`${userId}.${timestamp}.${randomString}`).toString('base64');
};

export const adminService = {
  // Authentication
  async loginAdmin(email: string, password: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user || user.role !== 'ADMIN') {
        throw new Error('Invalid admin credentials');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid admin credentials');
      }

      const adminUser: AdminUser = {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: 'super_admin',
        permissions: [
          {
            id: 'perm-1',
            name: 'Full Access',
            resource: 'all',
            actions: ['read', 'write', 'delete', 'approve']
          }
        ],
        createdAt: user.createdAt.toISOString(),
        lastLogin: new Date().toISOString()
      };

      const token = generateToken(user.id);

      // Store in localStorage (client-side)
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(adminUser));
      }

      // Log activity
      await db.logActivity({
        userId: user.id,
        action: 'admin_login',
        metadata: { timestamp: new Date().toISOString() }
      });

      return { admin: adminUser, token };
    } catch (error) {
      console.error('Admin login error:', error);
      throw new Error('Invalid credentials');
    }
  },

  getCurrentAdmin(): AdminUser | null {
    if (typeof window === 'undefined') return null;

    try {
      const adminData = localStorage.getItem('admin_user');
      const token = localStorage.getItem('admin_token');

      if (!adminData || !token) return null;
      return JSON.parse(adminData);
    } catch {
      return null;
    }
  },

  isAdminAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('admin_token');
  },

  async logoutAdmin() {
    if (typeof window !== 'undefined') {
      const admin = this.getCurrentAdmin();
      if (admin) {
        await db.logActivity({
          userId: admin.id,
          action: 'admin_logout',
          metadata: { timestamp: new Date().toISOString() }
        });
      }
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
  },

  // Dashboard Data
  async getDashboardData(): Promise<AdminDashboardData> {
    try {
      // Get real metrics from database
      const metrics = await db.getDashboardMetrics();

      // Get recent projects
      const projects = await prisma.project.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: {
          user: true,
          estimates: true
        }
      });

      const projectAnalytics: ProjectAnalytics[] = projects.map(p => ({
        id: p.id,
        title: p.title,
        client: p.user.fullName || p.user.email,
        value: Number(p.estimatedValue) || 0,
        profitMargin: 20, // Calculate from estimates
        daysToComplete: p.startDate && p.endDate
          ? Math.ceil((p.endDate.getTime() - p.startDate.getTime()) / (1000 * 60 * 60 * 24))
          : 0,
        status: p.status === 'IN_PROGRESS' ? 'on-track' :
                p.status === 'COMPLETED' ? 'completed' : 'delayed',
        completion: p.status === 'COMPLETED' ? 100 :
                   p.status === 'IN_PROGRESS' ? 50 : 0
      }));

      // Get pending estimates
      const pendingEstimates = await prisma.estimate.findMany({
        where: { status: { in: ['DRAFT', 'SENT'] } },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          project: true
        }
      });

      const estimateAnalytics: EstimateAnalytics[] = pendingEstimates.map(e => ({
        id: e.id,
        clientName: e.user.fullName || e.user.email,
        projectType: e.project?.type || 'other',
        value: Number(e.total),
        submittedAt: e.createdAt.toISOString(),
        daysInReview: Math.ceil((Date.now() - e.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
        priority: Number(e.total) > 50000 ? 'high' : 'medium',
        complexity: 'moderate',
        winProbability: 75
      }));

      // Get top clients
      const topClients = await prisma.user.findMany({
        where: { role: 'CUSTOMER' },
        take: 5,
        include: {
          projects: {
            select: {
              estimatedValue: true,
              actualValue: true
            }
          }
        },
        orderBy: {
          projects: {
            _count: 'desc'
          }
        }
      });

      const clientAnalytics: ClientAnalytics[] = topClients.map(c => {
        const totalValue = c.projects.reduce((sum, p) =>
          sum + (Number(p.actualValue) || Number(p.estimatedValue) || 0), 0
        );

        return {
          id: c.id,
          name: c.fullName,
          company: c.company || 'N/A',
          totalProjects: c.projects.length,
          totalValue,
          averageProjectValue: c.projects.length > 0 ? totalValue / c.projects.length : 0,
          lastActivity: c.updatedAt.toISOString(),
          status: 'active',
          acquisition: c.createdAt.toISOString(),
          retention: 90
        };
      });

      // Get notifications
      const notifications = await prisma.notification.findMany({
        where: {
          userId: this.getCurrentAdmin()?.id,
          isRead: 0
        },
        take: 10,
        orderBy: { createdAt: 'desc' }
      });

      const adminNotifications: AdminNotification[] = notifications.map(n => ({
        id: n.id,
        type: n.type.toLowerCase() as any,
        title: n.title,
        message: n.message,
        createdAt: n.createdAt.toISOString(),
        read: n.isRead === 1,
        actionUrl: n.actionUrl || undefined,
        actionText: n.actionText || undefined
      }));

      // Generate revenue data (simplified)
      const revenueData: RevenueData[] = [];
      const currentDate = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() - i);
        revenueData.push({
          date: date.toISOString().slice(0, 7),
          amount: Math.floor(Math.random() * 100000) + 150000,
          projectType: 'painting',
          clientId: 'client-1'
        });
      }

      const businessMetrics: BusinessMetrics = {
        totalRevenue: Number(metrics.totalEstimatedValue),
        monthlyRevenue: Number(metrics.totalEstimatedValue) / 12,
        quarterlyRevenue: Number(metrics.totalEstimatedValue) / 4,
        yearlyRevenue: Number(metrics.totalEstimatedValue),
        revenueGrowth: 18.5,
        totalProjects: metrics.totalProjects,
        activeProjects: metrics.activeProjects,
        completedProjects: metrics.completedProjects,
        pendingEstimates: metrics.pendingEstimates,
        conversionRate: 68.2,
        averageProjectValue: metrics.totalProjects > 0
          ? Number(metrics.totalEstimatedValue) / metrics.totalProjects
          : 0,
        totalClients: metrics.totalCustomers,
        activeClients: metrics.newCustomers30d,
        newClients: metrics.newCustomers30d,
        clientRetentionRate: 82.4
      };

      return {
        metrics: businessMetrics,
        recentProjects: projectAnalytics,
        pendingEstimates: estimateAnalytics,
        topClients: clientAnalytics,
        notifications: adminNotifications,
        revenueChart: revenueData,
        alerts: {
          overdue: 3,
          atRisk: 5,
          newEstimates: pendingEstimates.length,
          needsApproval: 4
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  // Client Management
  async getClients(filter?: AdminFilter): Promise<CRMClient[]> {
    try {
      const clients = await prisma.user.findMany({
        where: { role: 'CUSTOMER' },
        include: {
          projects: {
            include: {
              estimates: true,
              media: true
            }
          },
          notifications: true
        },
        orderBy: { createdAt: 'desc' }
      });

      return clients.map(client => {
        const totalValue = client.projects.reduce((sum, p) =>
          sum + (Number(p.actualValue) || Number(p.estimatedValue) || 0), 0
        );

        return {
          id: client.id,
          name: client.fullName,
          email: client.email,
          phone: client.phone || '',
          company: client.company || '',
          address: '',
          industry: 'Construction',
          size: 'medium',
          source: 'direct',
          createdAt: client.createdAt.toISOString(),
          lastContact: client.updatedAt.toISOString(),
          nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active' as const,
          lifetime_value: totalValue,
          projects: [],
          communications: [],
          notes: [],
          tags: []
        };
      });
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  },

  async getClientById(id: string): Promise<CRMClient | null> {
    try {
      const client = await prisma.user.findUnique({
        where: { id, role: 'CUSTOMER' },
        include: {
          projects: {
            include: {
              estimates: true,
              media: true
            }
          },
          notifications: true
        }
      });

      if (!client) return null;

      const totalValue = client.projects.reduce((sum, p) =>
        sum + (Number(p.actualValue) || Number(p.estimatedValue) || 0), 0
      );

      return {
        id: client.id,
        name: client.fullName,
        email: client.email,
        phone: client.phone || '',
        company: client.company || '',
        address: '',
        industry: 'Construction',
        size: 'medium',
        source: 'direct',
        createdAt: client.createdAt.toISOString(),
        lastContact: client.updatedAt.toISOString(),
        nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active' as const,
        lifetime_value: totalValue,
        projects: [],
        communications: [],
        notes: [],
        tags: []
      };
    } catch (error) {
      console.error('Error fetching client:', error);
      return null;
    }
  },

  async updateClient(id: string, updates: Partial<CRMClient>): Promise<CRMClient> {
    try {
      const updated = await prisma.user.update({
        where: { id },
        data: {
          fullName: updates.name,
          email: updates.email,
          phone: updates.phone,
          company: updates.company
        }
      });

      const client = await this.getClientById(id);
      if (!client) throw new Error('Client not found');
      return client;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  // Use mock data for complex features not yet in database
  async getProjects(filter?: AdminFilter): Promise<AdminProject[]> {
    // Return empty or use existing project data
    const projects = await prisma.project.findMany({
      include: {
        user: true,
        estimates: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return projects.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description || '',
      clientId: p.userId,
      status: p.status.toLowerCase() as any,
      dueDate: p.endDate?.toISOString() || new Date().toISOString(),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      estimateAmount: Number(p.estimatedValue) || 0,
      documents: [],
      notes: [],
      profitMargin: 20,
      resourcesAllocated: [],
      estimatedHours: 100,
      actualHours: 50,
      priority: 'medium' as const,
      assignedTo: 'admin-1',
      tags: [p.type],
      riskLevel: 'low' as const,
      lastActivity: p.updatedAt.toISOString()
    }));
  },

  async getEstimates(filter?: AdminFilter): Promise<AdminEstimate[]> {
    const estimates = await prisma.estimate.findMany({
      include: {
        user: true,
        project: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return estimates.map(e => ({
      id: e.id,
      clientId: e.userId,
      projectType: e.project?.type || 'other',
      scope: 'commercial',
      prevailingWage: false,
      description: e.description || '',
      location: 'TBD',
      timeline: '4-6 weeks',
      budget: `$${Number(e.total).toLocaleString()}`,
      documents: [],
      status: e.status.toLowerCase() as any,
      submittedAt: e.createdAt.toISOString(),
      estimatedValue: Number(e.total),
      winProbability: 75,
      competitorCount: 2,
      assignedTo: 'admin-1',
      priority: Number(e.total) > 50000 ? 'high' as const : 'medium' as const,
      complexity: 'moderate' as const,
      approvalStatus: 'pending' as const,
      internalNotes: ''
    }));
  },

  // Placeholder implementations for other methods
  async getBuildings(): Promise<Building[]> {
    return [];
  },

  async getAnalytics(dateRange: { start: string; end: string }) {
    return {
      revenue: [],
      projectCompletion: [],
      clientAcquisition: [],
      profitMargins: []
    };
  },

  async executeBulkOperation(operation: Omit<BulkOperation, 'id' | 'status' | 'createdAt'>): Promise<BulkOperation> {
    return {
      ...operation,
      id: `bulk-${Date.now()}`,
      status: 'completed',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      results: {
        success: operation.targetIds.length,
        failed: 0,
        errors: []
      }
    };
  },

  async getActivityLog(): Promise<AdminActivity[]> {
    const logs = await prisma.activityLog.findMany({
      include: {
        user: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return logs.map(log => ({
      id: log.id,
      adminId: log.userId,
      adminName: log.user.fullName,
      action: log.action,
      resource: log.entityType || 'system',
      resourceId: log.entityId || '',
      description: log.action,
      timestamp: log.createdAt.toISOString(),
      metadata: typeof log.metadata === 'string' ? JSON.parse(log.metadata) : log.metadata
    }));
  },

  async markNotificationRead(id: string): Promise<void> {
    await prisma.notification.update({
      where: { id },
      data: { isRead: 1 }
    });
  },

  async getUnreadNotificationCount(): Promise<number> {
    const admin = this.getCurrentAdmin();
    if (!admin) return 0;

    const count = await prisma.notification.count({
      where: {
        userId: admin.id,
        isRead: 0
      }
    });

    return count;
  },

  async approveEstimate(id: string, approvalData: any): Promise<AdminEstimate> {
    await prisma.estimate.update({
      where: { id },
      data: { status: 'ACCEPTED' }
    });

    const estimates = await this.getEstimates();
    const estimate = estimates.find(e => e.id === id);
    if (!estimate) throw new Error('Estimate not found');

    return estimate;
  }
};

// Export utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'completed': 'text-green-600 bg-green-100',
    'in-progress': 'text-blue-600 bg-blue-100',
    'pending': 'text-yellow-600 bg-yellow-100',
    'delayed': 'text-red-600 bg-red-100',
    'cancelled': 'text-gray-600 bg-gray-100',
    'on-track': 'text-green-600 bg-green-100',
    'at-risk': 'text-orange-600 bg-orange-100',
    'active': 'text-green-600 bg-green-100',
    'inactive': 'text-gray-600 bg-gray-100',
    'high': 'text-red-600 bg-red-100',
    'medium': 'text-yellow-600 bg-yellow-100',
    'low': 'text-green-600 bg-green-100',
  };

  return colors[status] || 'text-gray-600 bg-gray-100';
};

export const getPriorityIcon = (priority: string): string => {
  const icons: Record<string, string> = {
    'urgent': '🔴',
    'high': '🟠',
    'medium': '🟡',
    'low': '🟢',
  };

  return icons[priority] || '⚪';
};