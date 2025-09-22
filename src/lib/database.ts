import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Singleton pattern for Prisma Client
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Database helper functions
export const db = {
  // User functions
  async createUser(data: {
    email: string
    password: string
    fullName: string
    company?: string
    phone?: string
    role?: string // 'CUSTOMER' | 'ADMIN' for SQLite
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    })
  },

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    })
  },

  async validatePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword)
  },

  // Project functions
  async createProject(data: {
    userId: string
    title: string
    description?: string
    type: string // 'PAINTING' | 'TILE' | 'FLOORING' | 'DRYWALL' | 'GLASS' | 'OTHER'
    estimatedValue?: number
    startDate?: Date
    endDate?: Date
  }) {
    return prisma.project.create({
      data,
      include: {
        user: true,
        estimates: true,
      },
    })
  },

  async getProjectsByUser(userId: string) {
    return prisma.project.findMany({
      where: { userId },
      include: {
        estimates: true,
        media: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  // Estimate functions
  async createEstimate(data: {
    projectId?: string
    userId: string
    title: string
    description?: string
    items: any[]
    subtotal: number
    taxRate?: number
    taxAmount: number
    total: number
    validUntil?: Date
  }) {
    return prisma.estimate.create({
      data: {
        ...data,
        items: JSON.stringify(data.items), // Convert to string for SQLite
      },
      include: {
        project: true,
        user: true,
      },
    })
  },

  async updateEstimateStatus(id: string, status: string) { // 'DRAFT' | 'SENT' | 'VIEWED' | 'ACCEPTED' | 'REJECTED'
    return prisma.estimate.update({
      where: { id },
      data: { status },
    })
  },

  // Media functions
  async createMedia(data: {
    userId?: string
    projectId?: string
    type: string // 'IMAGE' | 'VIDEO'
    url: string
    thumbnailUrl?: string
    title: string
    description?: string
    category?: string
    isPublic?: boolean
    isProtected?: boolean
    metadata?: any
  }) {
    return prisma.media.create({
      data: {
        ...data,
        isPublic: data.isPublic ? 1 : 0,  // Convert boolean to integer for SQLite
        isProtected: data.isProtected !== false ? 1 : 0,  // Default true, convert to integer
        metadata: JSON.stringify(data.metadata || {}), // Convert to string for SQLite
      },
    })
  },

  async getPublicMedia() {
    return prisma.media.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getMediaByProject(projectId: string) {
    return prisma.media.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    })
  },

  // Notification functions
  async createNotification(data: {
    userId: string
    type: string // 'INFO' | 'SUCCESS' | 'WARNING' | 'URGENT'
    title: string
    message: string
    actionUrl?: string
    actionText?: string
  }) {
    return prisma.notification.create({
      data,
    })
  },

  async markNotificationAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    })
  },

  async getUnreadNotifications(userId: string) {
    return prisma.notification.findMany({
      where: {
        userId,
        isRead: false,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  // Activity log functions
  async logActivity(data: {
    userId: string
    action: string
    entityType?: string
    entityId?: string
    metadata?: any
    ipAddress?: string
    userAgent?: string
  }) {
    return prisma.activityLog.create({
      data: {
        ...data,
        metadata: JSON.stringify(data.metadata || {}), // Convert to string for SQLite
      },
    })
  },

  async getRecentActivity(userId: string, limit = 10) {
    return prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  },

  // Dashboard metrics
  async getDashboardMetrics() {
    const [
      totalProjects,
      activeProjects,
      completedProjects,
      totalEstimates,
      pendingEstimates,
      totalCustomers,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.project.count({ where: { status: 'COMPLETED' } }),
      prisma.estimate.count(),
      prisma.estimate.count({
        where: {
          OR: [{ status: 'DRAFT' }, { status: 'SENT' }],
        },
      }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
    ])

    const projectValues = await prisma.project.aggregate({
      _sum: {
        estimatedValue: true,
        actualValue: true,
      },
    })

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [newCustomers30d, newProjects30d] = await Promise.all([
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.project.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
    ])

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalEstimates,
      pendingEstimates,
      totalCustomers,
      totalEstimatedValue: projectValues._sum.estimatedValue || 0,
      totalActualValue: projectValues._sum.actualValue || 0,
      newCustomers30d,
      newProjects30d,
    }
  },
}

export default db