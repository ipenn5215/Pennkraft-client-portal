import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET single project with all details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            company: true,
            phone: true,
          },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                fullName: true,
                role: true,
              },
            },
          },
        },
        milestones: {
          orderBy: { order: 'asc' },
        },
        teamMembers: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
                phone: true,
                role: true,
              },
            },
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

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Transform the data to match frontend expectations
    const transformedProject = {
      id: project.id,
      name: project.title,
      description: project.description,
      type: project.type,
      status: project.status,
      statusLabel: getStatusLabel(project.status),
      progress: project.progress,
      startDate: project.startDate?.toISOString().split('T')[0] || '',
      dueDate: project.dueDate?.toISOString().split('T')[0] || '',
      budget: project.estimatedValue ? `$${project.estimatedValue.toLocaleString()}` : '$0',
      spent: project.actualValue ? `$${project.actualValue.toLocaleString()}` : '$0',
      client: {
        name: project.user.fullName,
        email: project.user.email,
        company: project.user.company,
        phone: project.user.phone,
      },
      documents: project.documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        url: doc.url,
        size: formatFileSize(doc.size),
        type: doc.type,
        category: doc.category,
        status: doc.status,
        uploadedAt: doc.uploadedAt.toISOString(),
        uploadedBy: doc.user.fullName,
      })),
      messages: project.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        isRead: msg.isRead === 1,
        priority: msg.priority,
        createdAt: msg.createdAt.toISOString(),
        user: {
          name: msg.user.fullName,
          role: msg.user.role,
        },
      })),
      milestones: project.milestones.map(milestone => ({
        id: milestone.id,
        title: milestone.title,
        description: milestone.description,
        status: milestone.status,
        dueDate: milestone.dueDate?.toISOString().split('T')[0] || '',
        completedAt: milestone.completedAt?.toISOString() || null,
      })),
      teamMembers: project.teamMembers.map(tm => ({
        id: tm.id,
        name: tm.user.fullName,
        role: tm.role,
        email: tm.user.email,
        phone: tm.user.phone,
      })),
      activities: project.activities.map(activity => ({
        id: activity.id,
        type: activity.type,
        title: activity.title,
        details: activity.details,
        createdAt: activity.createdAt.toISOString(),
      })),
      quotes: project.quotes,
      invoices: project.invoices,
      changeOrders: project.changeOrders,
    };

    return NextResponse.json(transformedProject);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PATCH update project
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, progress, actualValue } = body;

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (actualValue !== undefined) updateData.actualValue = actualValue;

    const project = await prisma.project.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

function getStatusLabel(status: string): string {
  const statusMap: { [key: string]: string } = {
    'active': 'In Progress',
    'review': 'Under Review',
    'pending': 'Pending Approval',
    'completed': 'Completed',
  };
  return statusMap[status] || status;
}

function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}