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
import { authService } from './auth';

// Mock admin data
const mockAdminUsers: AdminUser[] = [
  {
    id: 'admin-1',
    email: 'admin@pennkraft.com',
    name: 'Admin User',
    role: 'super_admin',
    permissions: [
      {
        id: 'perm-1',
        name: 'Full Access',
        resource: 'clients',
        actions: ['read', 'write', 'delete', 'approve']
      }
    ],
    createdAt: new Date('2024-01-01').toISOString(),
    lastLogin: new Date().toISOString()
  }
];

const mockBusinessMetrics: BusinessMetrics = {
  totalRevenue: 2450000,
  monthlyRevenue: 285000,
  quarterlyRevenue: 742000,
  yearlyRevenue: 2450000,
  revenueGrowth: 18.5,
  totalProjects: 156,
  activeProjects: 23,
  completedProjects: 133,
  pendingEstimates: 12,
  conversionRate: 68.2,
  averageProjectValue: 15705,
  totalClients: 89,
  activeClients: 34,
  newClients: 8,
  clientRetentionRate: 82.4
};

const mockRevenueData: RevenueData[] = [
  { date: '2024-01', amount: 185000, projectType: 'painting', clientId: 'client-1' },
  { date: '2024-02', amount: 220000, projectType: 'tile', clientId: 'client-2' },
  { date: '2024-03', amount: 195000, projectType: 'flooring', clientId: 'client-3' },
  { date: '2024-04', amount: 265000, projectType: 'storefront', clientId: 'client-4' },
  { date: '2024-05', amount: 285000, projectType: 'glass', clientId: 'client-5' },
  { date: '2024-06', amount: 310000, projectType: 'painting', clientId: 'client-6' },
];

const mockProjectAnalytics: ProjectAnalytics[] = [
  {
    id: 'proj-1',
    title: 'Downtown Office Complex',
    client: 'Metro Development',
    value: 125000,
    profitMargin: 22.5,
    daysToComplete: 45,
    status: 'on-track',
    completion: 68
  },
  {
    id: 'proj-2',
    title: 'Retail Store Renovation',
    client: 'Fashion Forward LLC',
    value: 85000,
    profitMargin: 18.2,
    daysToComplete: 30,
    status: 'delayed',
    completion: 45
  }
];

const mockEstimateAnalytics: EstimateAnalytics[] = [
  {
    id: 'est-1',
    clientName: 'City Plaza Management',
    projectType: 'storefront',
    value: 95000,
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    daysInReview: 3,
    priority: 'high',
    complexity: 'moderate',
    winProbability: 75
  }
];

const mockClientAnalytics: ClientAnalytics[] = [
  {
    id: 'client-1',
    name: 'Metro Development',
    company: 'Metro Development Corp',
    totalProjects: 12,
    totalValue: 850000,
    averageProjectValue: 70833,
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    acquisition: '2023-03-15',
    retention: 95
  }
];

const mockNotifications: AdminNotification[] = [
  {
    id: 'notif-1',
    type: 'urgent',
    title: 'Project Deadline Approaching',
    message: 'Downtown Office Complex due in 3 days',
    createdAt: new Date().toISOString(),
    read: false,
    actionUrl: '/admin/projects/proj-1',
    actionText: 'View Project'
  },
  {
    id: 'notif-2',
    type: 'warning',
    title: 'Estimate Needs Review',
    message: 'High-value estimate pending approval',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: '/admin/estimates/est-1',
    actionText: 'Review Estimate'
  }
];

export const adminService = {
  // Authentication
  async loginAdmin(email: string, password: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const admin = mockAdminUsers.find(u => u.email === email);
    if (!admin || password !== 'admin123') {
      throw new Error('Invalid credentials');
    }

    const token = `admin-token-${admin.id}`;
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(admin));

    return { admin, token };
  },

  getCurrentAdmin(): AdminUser | null {
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
    return !!localStorage.getItem('admin_token');
  },

  async logoutAdmin() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },

  // Dashboard Data
  async getDashboardData(): Promise<AdminDashboardData> {
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      metrics: mockBusinessMetrics,
      recentProjects: mockProjectAnalytics,
      pendingEstimates: mockEstimateAnalytics,
      topClients: mockClientAnalytics,
      notifications: mockNotifications,
      revenueChart: mockRevenueData,
      alerts: {
        overdue: 3,
        atRisk: 5,
        newEstimates: 8,
        needsApproval: 4
      }
    };
  },

  // Client Management
  async getClients(filter?: AdminFilter): Promise<CRMClient[]> {
    await new Promise(resolve => setTimeout(resolve, 600));

    // Mock client data
    return [
      {
        id: 'client-1',
        name: 'John Smith',
        email: 'john.smith@metrodev.com',
        phone: '(555) 123-4567',
        company: 'Metro Development Corp',
        address: '123 Business Ave, City, ST 12345',
        industry: 'Real Estate Development',
        size: 'large',
        source: 'referral',
        createdAt: '2023-03-15T10:00:00Z',
        lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        lifetime_value: 850000,
        projects: [],
        communications: [],
        notes: [],
        tags: ['high-value', 'repeat-customer']
      }
    ];
  },

  async getClientById(id: string): Promise<CRMClient | null> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const clients = await this.getClients();
    return clients.find(c => c.id === id) || null;
  },

  async updateClient(id: string, updates: Partial<CRMClient>): Promise<CRMClient> {
    await new Promise(resolve => setTimeout(resolve, 600));
    // Mock update
    const client = await this.getClientById(id);
    if (!client) throw new Error('Client not found');
    return { ...client, ...updates };
  },

  // Project Management
  async getProjects(filter?: AdminFilter): Promise<AdminProject[]> {
    await new Promise(resolve => setTimeout(resolve, 700));

    return [
      {
        id: 'proj-1',
        title: 'Downtown Office Complex',
        description: 'Complete renovation of 50,000 sq ft office space',
        clientId: 'client-1',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: new Date().toISOString(),
        estimateAmount: 125000,
        documents: [],
        notes: [],
        profitMargin: 22.5,
        resourcesAllocated: ['team-1', 'team-2'],
        estimatedHours: 800,
        actualHours: 540,
        priority: 'high',
        assignedTo: 'admin-1',
        tags: ['commercial', 'high-value'],
        riskLevel: 'medium',
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ];
  },

  // Estimate Management
  async getEstimates(filter?: AdminFilter): Promise<AdminEstimate[]> {
    await new Promise(resolve => setTimeout(resolve, 600));

    return [
      {
        id: 'est-1',
        clientId: 'client-1',
        projectType: 'storefront',
        scope: 'commercial',
        prevailingWage: true,
        description: 'New storefront installation with custom glass work',
        location: 'Downtown Plaza, Main St',
        timeline: '4-6 weeks',
        budget: '$80,000 - $120,000',
        documents: [],
        status: 'reviewing',
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedValue: 95000,
        winProbability: 75,
        competitorCount: 2,
        assignedTo: 'admin-1',
        priority: 'high',
        complexity: 'moderate',
        approvalStatus: 'pending',
        internalNotes: 'Client has expressed urgency. Competitor pricing is aggressive.'
      }
    ];
  },

  async approveEstimate(id: string, approvalData: any): Promise<AdminEstimate> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const estimates = await this.getEstimates();
    const estimate = estimates.find(e => e.id === id);
    if (!estimate) throw new Error('Estimate not found');

    return {
      ...estimate,
      approvalStatus: 'approved',
      approvedBy: 'admin-1',
      approvedAt: new Date().toISOString(),
      ...approvalData
    };
  },

  // Building List
  async getBuildings(): Promise<Building[]> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
      {
        id: 'building-1',
        name: 'Downtown Office Complex - Building A',
        address: '123 Business Ave, City, ST',
        projectId: 'proj-1',
        client: 'Metro Development',
        trades: [
          {
            id: 'trade-1',
            trade: 'drywall',
            contractor: 'ABC Drywall',
            startDate: '2024-02-01',
            endDate: '2024-02-15',
            status: 'completed',
            progress: 100,
            value: 25000,
            dependencies: []
          },
          {
            id: 'trade-2',
            trade: 'painting',
            contractor: 'Quality Paint Co',
            startDate: '2024-02-16',
            endDate: '2024-03-01',
            status: 'in_progress',
            progress: 65,
            value: 35000,
            dependencies: ['trade-1']
          }
        ],
        totalValue: 125000,
        startDate: '2024-01-15',
        expectedCompletion: '2024-04-01',
        status: 'in_progress',
        progress: 68,
        criticalPath: [],
        milestones: [
          {
            id: 'milestone-1',
            name: 'Phase 1 Completion',
            date: '2024-03-01',
            status: 'current',
            description: 'All painting and drywall work completed',
            dependencies: ['trade-1', 'trade-2']
          }
        ],
        risks: [
          {
            id: 'risk-1',
            description: 'Weather delays for exterior work',
            probability: 'medium',
            impact: 'medium',
            category: 'schedule',
            mitigation: 'Schedule indoor work during poor weather',
            owner: 'admin-1',
            status: 'monitoring'
          }
        ]
      }
    ];
  },

  // Analytics
  async getAnalytics(dateRange: { start: string; end: string }) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      revenue: mockRevenueData,
      projectCompletion: [
        { month: 'Jan', completed: 12, target: 15 },
        { month: 'Feb', completed: 18, target: 20 },
        { month: 'Mar', completed: 22, target: 25 },
        { month: 'Apr', completed: 19, target: 20 },
        { month: 'May', completed: 25, target: 25 }
      ],
      clientAcquisition: [
        { month: 'Jan', new: 3, retained: 28 },
        { month: 'Feb', new: 5, retained: 31 },
        { month: 'Mar', new: 2, retained: 33 },
        { month: 'Apr', new: 4, retained: 35 },
        { month: 'May', new: 6, retained: 39 }
      ],
      profitMargins: [
        { project: 'Office Complex', margin: 22.5 },
        { project: 'Retail Store', margin: 18.2 },
        { project: 'Restaurant', margin: 25.1 },
        { project: 'Warehouse', margin: 19.8 }
      ]
    };
  },

  // Bulk Operations
  async executeBulkOperation(operation: Omit<BulkOperation, 'id' | 'status' | 'createdAt'>): Promise<BulkOperation> {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const result: BulkOperation = {
      ...operation,
      id: `bulk-${Date.now()}`,
      status: 'completed',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      results: {
        success: operation.targetIds.length - 1,
        failed: 1,
        errors: ['One operation failed due to invalid data']
      }
    };

    return result;
  },

  // Activity Log
  async getActivityLog(): Promise<AdminActivity[]> {
    await new Promise(resolve => setTimeout(resolve, 400));

    return [
      {
        id: 'activity-1',
        adminId: 'admin-1',
        adminName: 'Admin User',
        action: 'approved_estimate',
        resource: 'estimate',
        resourceId: 'est-1',
        description: 'Approved estimate for Downtown Plaza project',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        metadata: { estimateValue: 95000 }
      },
      {
        id: 'activity-2',
        adminId: 'admin-1',
        adminName: 'Admin User',
        action: 'updated_project',
        resource: 'project',
        resourceId: 'proj-1',
        description: 'Updated project status to in-progress',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        metadata: { previousStatus: 'pending', newStatus: 'in-progress' }
      }
    ];
  },

  // Notifications
  async markNotificationRead(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Mock implementation
  },

  async getUnreadNotificationCount(): Promise<number> {
    const notifications = mockNotifications;
    return notifications.filter(n => !n.read).length;
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