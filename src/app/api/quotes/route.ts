import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET quotes for a project or user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const userId = searchParams.get('userId');

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (userId) where.userId = userId;

    const quotes = await prisma.quote.findMany({
      where,
      include: {
        project: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            fullName: true,
            company: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const transformedQuotes = quotes.map(quote => ({
      id: quote.id,
      projectId: quote.projectId,
      projectName: quote.project?.title || 'N/A',
      quoteNumber: quote.quoteNumber,
      items: JSON.parse(quote.items),
      subtotal: quote.subtotal,
      taxRate: quote.taxRate,
      taxAmount: quote.taxAmount,
      discount: quote.discount,
      total: quote.total,
      status: quote.status,
      validUntil: quote.validUntil?.toISOString() || null,
      acceptedAt: quote.acceptedAt?.toISOString() || null,
      convertedAt: quote.convertedAt?.toISOString() || null,
      invoiceId: quote.invoiceId,
      notes: quote.notes,
      terms: quote.terms,
      createdAt: quote.createdAt.toISOString(),
      client: {
        name: quote.user.fullName,
        company: quote.user.company,
      },
    }));

    return NextResponse.json(transformedQuotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

// POST create new quote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, userId, items, subtotal, taxRate = 0.0875, discount = 0, notes, terms, validUntil } = body;

    if (!userId || !items || !subtotal) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate quote number
    const count = await prisma.quote.count();
    const quoteNumber = `Q-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const taxAmount = (subtotal - discount) * taxRate;
    const total = subtotal - discount + taxAmount;

    const quote = await prisma.quote.create({
      data: {
        projectId,
        userId,
        quoteNumber,
        items: JSON.stringify(items),
        subtotal,
        taxRate,
        taxAmount,
        discount,
        total,
        status: 'draft',
        notes,
        terms,
        validUntil: validUntil ? new Date(validUntil) : null,
      },
    });

    // Create activity if project exists
    if (projectId) {
      await prisma.activity.create({
        data: {
          projectId,
          userId,
          type: 'quote_created',
          title: 'Quote created',
          details: `Quote ${quoteNumber} created`,
        },
      });
    }

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
}

// PATCH update quote status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { quoteId, status } = body;

    if (!quoteId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updateData: any = { status };
    if (status === 'accepted') {
      updateData.acceptedAt = new Date();
    }

    const quote = await prisma.quote.update({
      where: { id: quoteId },
      data: updateData,
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Error updating quote:', error);
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}