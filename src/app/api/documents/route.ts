import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET documents for a project
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const category = searchParams.get('category');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const where: any = { projectId };
    if (category) {
      where.category = category;
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        user: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const transformedDocuments = documents.map(doc => ({
      id: doc.id,
      name: doc.name,
      url: doc.url,
      size: formatFileSize(doc.size),
      type: doc.type,
      category: doc.category,
      status: doc.status,
      description: doc.description,
      uploadedAt: doc.uploadedAt.toISOString(),
      uploadedBy: doc.user.fullName,
      reviewedAt: doc.reviewedAt?.toISOString() || null,
    }));

    return NextResponse.json(transformedDocuments);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST upload document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, userId, name, url, size, type, category, description } = body;

    if (!projectId || !userId || !name || !url || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const document = await prisma.document.create({
      data: {
        projectId,
        userId,
        name,
        url,
        size: size || 0,
        type: type || 'application/octet-stream',
        category,
        description,
        status: 'pending',
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId,
        userId,
        type: 'document_upload',
        title: 'Document uploaded',
        details: `${name} uploaded for review`,
      },
    });

    // Create notification for admin/team
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        teamMembers: true,
      },
    });

    if (project) {
      for (const member of project.teamMembers) {
        await prisma.notification.create({
          data: {
            userId: member.userId,
            type: 'document_uploaded',
            title: 'New Document',
            message: `A new document "${name}" has been uploaded to ${project.title}`,
            actionUrl: `/portal/project/${projectId}`,
            actionText: 'View Document',
          },
        });
      }
    }

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
}

// PATCH update document status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, status, reviewedBy } = body;

    if (!documentId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const document = await prisma.document.update({
      where: { id: documentId },
      data: {
        status,
        reviewedAt: status !== 'pending' ? new Date() : null,
        reviewedBy: reviewedBy || null,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}

function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}