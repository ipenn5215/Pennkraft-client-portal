import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET all projects for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const projects = await prisma.project.findMany({
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
        teamMembers: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform the data to match frontend expectations
    const transformedProjects = projects.map(project => ({
      id: project.id,
      name: project.title,
      type: project.type,
      status: project.status,
      statusLabel: getStatusLabel(project.status),
      progress: project.progress,
      dueDate: project.dueDate?.toISOString().split('T')[0] || '',
      budget: project.estimatedValue ? `$${project.estimatedValue.toLocaleString()}` : '$0',
      spent: project.actualValue ? `$${project.actualValue.toLocaleString()}` : '$0',
      documentsCount: project.documents.length,
      unreadMessagesCount: project.messages.length,
      completedMilestonesCount: project.milestones.length,
      teamMembers: project.teamMembers.map(tm => ({
        name: tm.user.fullName,
        role: tm.role,
        email: tm.user.email,
      })),
    }));

    return NextResponse.json(transformedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, description, type, estimatedValue, dueDate } = body;

    if (!userId || !title || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        userId,
        title,
        description,
        type,
        status: 'pending',
        estimatedValue: estimatedValue ? parseFloat(estimatedValue) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        startDate: new Date(),
      },
    });

    // Create initial activity
    await prisma.activity.create({
      data: {
        projectId: project.id,
        userId,
        type: 'project_created',
        title: 'Project created',
        details: `New project "${title}" was created`,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
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