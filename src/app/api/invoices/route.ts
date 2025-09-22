import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET invoices for a project or user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const userId = searchParams.get('userId');

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (userId) where.userId = userId;

    const invoices = await prisma.invoice.findMany({
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
        changeOrders: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const transformedInvoices = invoices.map(invoice => ({
      id: invoice.id,
      projectId: invoice.projectId,
      projectName: invoice.project?.title || 'N/A',
      invoiceNumber: invoice.invoiceNumber,
      quoteId: invoice.quoteId,
      items: JSON.parse(invoice.items),
      subtotal: invoice.subtotal,
      taxRate: invoice.taxRate,
      taxAmount: invoice.taxAmount,
      discount: invoice.discount,
      total: invoice.total,
      status: invoice.status,
      dueDate: invoice.dueDate?.toISOString() || null,
      paidAt: invoice.paidAt?.toISOString() || null,
      paymentMethod: invoice.paymentMethod,
      stripeId: invoice.stripeId,
      notes: invoice.notes,
      terms: invoice.terms,
      createdAt: invoice.createdAt.toISOString(),
      changeOrders: invoice.changeOrders,
      client: {
        name: invoice.user.fullName,
        company: invoice.user.company,
      },
    }));

    return NextResponse.json(transformedInvoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

// POST create invoice (convert from quote or create new)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quoteId, projectId, userId, items, subtotal, taxRate = 0.0875, discount = 0, notes, terms, dueDate } = body;

    // If converting from quote
    if (quoteId) {
      const quote = await prisma.quote.findUnique({
        where: { id: quoteId },
      });

      if (!quote) {
        return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
      }

      // Generate invoice number
      const count = await prisma.invoice.count();
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

      const invoice = await prisma.invoice.create({
        data: {
          projectId: quote.projectId,
          userId: quote.userId,
          invoiceNumber,
          quoteId,
          items: quote.items,
          subtotal: quote.subtotal,
          taxRate: quote.taxRate,
          taxAmount: quote.taxAmount,
          discount: quote.discount,
          total: quote.total,
          status: 'sent',
          dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          notes: quote.notes,
          terms: quote.terms,
        },
      });

      // Update quote status
      await prisma.quote.update({
        where: { id: quoteId },
        data: {
          status: 'converted',
          convertedAt: new Date(),
          invoiceId: invoice.id,
        },
      });

      // Create activity
      if (quote.projectId) {
        await prisma.activity.create({
          data: {
            projectId: quote.projectId,
            userId: quote.userId,
            type: 'invoice_created',
            title: 'Invoice created',
            details: `Quote ${quote.quoteNumber} converted to invoice ${invoiceNumber}`,
          },
        });
      }

      return NextResponse.json(invoice, { status: 201 });
    }

    // Create new invoice directly
    if (!userId || !items || !subtotal) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate invoice number
    const count = await prisma.invoice.count();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const taxAmount = (subtotal - discount) * taxRate;
    const total = subtotal - discount + taxAmount;

    const invoice = await prisma.invoice.create({
      data: {
        projectId,
        userId,
        invoiceNumber,
        items: JSON.stringify(items),
        subtotal,
        taxRate,
        taxAmount,
        discount,
        total,
        status: 'draft',
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        notes,
        terms,
      },
    });

    // Create activity
    if (projectId) {
      await prisma.activity.create({
        data: {
          projectId,
          userId,
          type: 'invoice_created',
          title: 'Invoice created',
          details: `Invoice ${invoiceNumber} created`,
        },
      });
    }

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}

// PATCH update invoice status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceId, status, paymentMethod, stripeId } = body;

    if (!invoiceId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updateData: any = { status };
    if (status === 'paid') {
      updateData.paidAt = new Date();
      if (paymentMethod) updateData.paymentMethod = paymentMethod;
      if (stripeId) updateData.stripeId = stripeId;
    }

    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: updateData,
    });

    // Create activity
    if (invoice.projectId && status === 'paid') {
      await prisma.activity.create({
        data: {
          projectId: invoice.projectId,
          userId: invoice.userId,
          type: 'payment_received',
          title: 'Payment received',
          details: `Invoice ${invoice.invoiceNumber} paid`,
        },
      });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}