import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET messages for a project
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            fullName: true,
            role: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const transformedMessages = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      isRead: msg.isRead === 1,
      priority: msg.priority,
      attachments: msg.attachments ? JSON.parse(msg.attachments) : [],
      emailSent: msg.emailSent === 1,
      parentId: msg.parentId,
      createdAt: msg.createdAt.toISOString(),
      user: {
        name: msg.user.fullName,
        role: msg.user.role,
        email: msg.user.email,
      },
    }));

    return NextResponse.json(transformedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST send message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, userId, content, priority = 'normal', attachments, parentId } = body;

    if (!projectId || !userId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        projectId,
        userId,
        content,
        priority,
        attachments: attachments ? JSON.stringify(attachments) : null,
        parentId,
        emailSent: priority === 'high' ? 1 : 0,
      },
      include: {
        user: {
          select: {
            fullName: true,
            role: true,
            email: true,
          },
        },
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId,
        userId,
        type: 'message_sent',
        title: 'New message',
        details: `Message sent by ${message.user.fullName}`,
      },
    });

    // Create notification for project participants
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        user: true,
        teamMembers: true,
      },
    });

    if (project) {
      // Notify client if message is from team
      if (message.user.role !== 'CUSTOMER') {
        await prisma.notification.create({
          data: {
            userId: project.userId,
            type: 'message_received',
            title: 'New Message',
            message: `You have a new message from ${message.user.fullName}`,
            actionUrl: `/portal/project/${projectId}`,
            actionText: 'View Message',
          },
        });
      }

      // Notify team if message is from client
      if (message.user.role === 'CUSTOMER') {
        for (const member of project.teamMembers) {
          await prisma.notification.create({
            data: {
              userId: member.userId,
              type: 'message_received',
              title: 'Client Message',
              message: `New message from ${message.user.fullName} on ${project.title}`,
              actionUrl: `/admin/projects/${projectId}`,
              actionText: 'View Message',
            },
          });
        }
      }
    }

    // TODO: Send email notification if priority is high
    if (priority === 'high' && message.emailSent) {
      // Email sending logic would go here
      console.log('High priority message - email notification would be sent');
    }

    return NextResponse.json({
      id: message.id,
      content: message.content,
      isRead: false,
      priority: message.priority,
      attachments: attachments || [],
      emailSent: message.emailSent === 1,
      parentId: message.parentId,
      createdAt: message.createdAt.toISOString(),
      user: {
        name: message.user.fullName,
        role: message.user.role,
        email: message.user.email,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

// PATCH mark messages as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageIds } = body;

    if (!messageIds || !Array.isArray(messageIds)) {
      return NextResponse.json({ error: 'Message IDs required' }, { status: 400 });
    }

    await prisma.message.updateMany({
      where: {
        id: { in: messageIds },
      },
      data: { isRead: 1 },
    });

    return NextResponse.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error updating messages:', error);
    return NextResponse.json({ error: 'Failed to update messages' }, { status: 500 });
  }
}