import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// Helper functions for common database operations

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      projects: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      notifications: {
        where: { isRead: 0 },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });
}

export async function getProjectById(id: string) {
  return await prisma.project.findUnique({
    where: { id },
    include: {
      user: true,
      documents: {
        orderBy: { createdAt: 'desc' },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
        },
      },
      milestones: {
        orderBy: { order: 'asc' },
      },
      teamMembers: {
        include: {
          user: true,
        },
      },
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      quotes: {
        orderBy: { createdAt: 'desc' },
      },
      invoices: {
        orderBy: { createdAt: 'desc' },
      },
      changeOrders: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

export async function getUserProjects(userId: string) {
  return await prisma.project.findMany({
    where: { userId },
    include: {
      documents: {
        select: { id: true },
      },
      messages: {
        where: { isRead: 0 },
        select: { id: true },
      },
      milestones: {
        where: { status: 'completed' },
        select: { id: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createActivity(
  projectId: string,
  userId: string,
  type: string,
  title: string,
  details?: string,
  metadata?: any
) {
  return await prisma.activity.create({
    data: {
      projectId,
      userId,
      type,
      title,
      details,
      metadata: metadata ? JSON.stringify(metadata) : undefined,
    },
  });
}

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  actionUrl?: string,
  actionText?: string
) {
  return await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      actionUrl,
      actionText,
    },
  });
}

export async function markNotificationsAsRead(userId: string, ids: string[]) {
  return await prisma.notification.updateMany({
    where: {
      userId,
      id: { in: ids },
    },
    data: { isRead: 1 },
  });
}

export async function getUnreadMessageCount(userId: string) {
  return await prisma.message.count({
    where: {
      project: { userId },
      isRead: 0,
    },
  });
}