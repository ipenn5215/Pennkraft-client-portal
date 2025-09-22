import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.activity.deleteMany();
  await prisma.changeOrder.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.message.deleteMany();
  await prisma.document.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.media.deleteMany();
  await prisma.estimate.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@pennkraft.com',
      password: adminPassword,
      fullName: 'Admin User',
      company: 'Pennkraft Estimating',
      phone: '(555) 000-0001',
      role: 'ADMIN',
    },
  });

  // Create team members
  const teamPassword = await bcrypt.hash('team123', 10);
  const projectManager = await prisma.user.create({
    data: {
      email: 'mike@pennkraft.com',
      password: teamPassword,
      fullName: 'Mike Johnson',
      company: 'Pennkraft Estimating',
      phone: '(555) 000-0002',
      role: 'TEAM',
    },
  });

  const estimator = await prisma.user.create({
    data: {
      email: 'sarah@pennkraft.com',
      password: teamPassword,
      fullName: 'Sarah Chen',
      company: 'Pennkraft Estimating',
      phone: '(555) 000-0003',
      role: 'TEAM',
    },
  });

  // Create client users
  const clientPassword = await bcrypt.hash('client123', 10);
  const client1 = await prisma.user.create({
    data: {
      email: 'john@abc.com',
      password: clientPassword,
      fullName: 'John Doe',
      company: 'ABC Construction',
      phone: '(555) 123-4567',
      role: 'CUSTOMER',
    },
  });

  const client2 = await prisma.user.create({
    data: {
      email: 'jane@xyz.com',
      password: clientPassword,
      fullName: 'Jane Smith',
      company: 'XYZ Developers',
      phone: '(555) 234-5678',
      role: 'CUSTOMER',
    },
  });

  const client3 = await prisma.user.create({
    data: {
      email: 'robert@greenview.com',
      password: clientPassword,
      fullName: 'Robert Williams',
      company: 'GreenView Properties',
      phone: '(555) 345-6789',
      role: 'CUSTOMER',
    },
  });

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      userId: client1.id,
      title: 'Downtown Office Building',
      description: 'Complete renovation of 5-story office building including painting, flooring, and drywall work',
      type: 'Commercial Renovation',
      status: 'active',
      progress: 65,
      estimatedValue: 125000,
      actualValue: 81250,
      startDate: new Date('2024-09-01'),
      dueDate: new Date('2024-12-15'),
      endDate: new Date('2024-12-15'),
    },
  });

  const project2 = await prisma.project.create({
    data: {
      userId: client2.id,
      title: 'Residential Complex',
      description: 'New construction of 20-unit residential complex with modern finishes',
      type: 'New Construction',
      status: 'review',
      progress: 40,
      estimatedValue: 450000,
      actualValue: 180000,
      startDate: new Date('2024-08-15'),
      dueDate: new Date('2025-02-28'),
      endDate: new Date('2025-02-28'),
    },
  });

  const project3 = await prisma.project.create({
    data: {
      userId: client3.id,
      title: 'Historic Building Restoration',
      description: 'Restoration of historic building facade and interior spaces',
      type: 'Restoration',
      status: 'pending',
      progress: 10,
      estimatedValue: 280000,
      startDate: new Date('2025-01-15'),
      dueDate: new Date('2025-06-30'),
      endDate: new Date('2025-06-30'),
    },
  });

  const project4 = await prisma.project.create({
    data: {
      userId: client1.id,
      title: 'Warehouse Conversion',
      description: 'Converting warehouse space into modern loft apartments',
      type: 'Conversion',
      status: 'completed',
      progress: 100,
      estimatedValue: 320000,
      actualValue: 315000,
      startDate: new Date('2024-01-15'),
      dueDate: new Date('2024-08-30'),
      endDate: new Date('2024-08-25'),
    },
  });

  // Add team members to projects
  await prisma.teamMember.createMany({
    data: [
      { projectId: project1.id, userId: projectManager.id, role: 'Project Manager' },
      { projectId: project1.id, userId: estimator.id, role: 'Senior Estimator' },
      { projectId: project2.id, userId: projectManager.id, role: 'Project Manager' },
      { projectId: project2.id, userId: estimator.id, role: 'Senior Estimator' },
      { projectId: project3.id, userId: projectManager.id, role: 'Project Manager' },
      { projectId: project4.id, userId: projectManager.id, role: 'Project Manager' },
    ],
  });

  // Add milestones
  await prisma.milestone.createMany({
    data: [
      {
        projectId: project1.id,
        title: 'Initial Assessment',
        description: 'Complete initial site assessment and measurements',
        status: 'completed',
        order: 1,
        completedAt: new Date('2024-09-10'),
      },
      {
        projectId: project1.id,
        title: 'Design Approval',
        description: 'Finalize and approve renovation designs',
        status: 'completed',
        order: 2,
        completedAt: new Date('2024-09-20'),
      },
      {
        projectId: project1.id,
        title: 'Materials Procurement',
        description: 'Order and receive all necessary materials',
        status: 'active',
        order: 3,
        dueDate: new Date('2024-10-30'),
      },
      {
        projectId: project1.id,
        title: 'Construction Phase',
        description: 'Complete main construction work',
        status: 'pending',
        order: 4,
        dueDate: new Date('2024-11-30'),
      },
      {
        projectId: project1.id,
        title: 'Final Inspection',
        description: 'Final walkthrough and sign-off',
        status: 'pending',
        order: 5,
        dueDate: new Date('2024-12-10'),
      },
    ],
  });

  // Add documents
  await prisma.document.createMany({
    data: [
      {
        projectId: project1.id,
        userId: client1.id,
        name: 'Initial_Estimate.pdf',
        url: '/documents/Initial_Estimate.pdf',
        size: 524288,
        type: 'application/pdf',
        category: 'deliverable',
        status: 'approved',
        description: 'Initial project estimate and scope',
        reviewedAt: new Date('2024-09-05'),
        reviewedBy: admin.id,
      },
      {
        projectId: project1.id,
        userId: client1.id,
        name: 'Floor_Plans.dwg',
        url: '/documents/Floor_Plans.dwg',
        size: 2097152,
        type: 'application/dwg',
        category: 'client-upload',
        status: 'reviewed',
        description: 'Building floor plans for renovation',
        reviewedAt: new Date('2024-09-08'),
        reviewedBy: projectManager.id,
      },
      {
        projectId: project1.id,
        userId: admin.id,
        name: 'Material_Specifications.pdf',
        url: '/documents/Material_Specifications.pdf',
        size: 1048576,
        type: 'application/pdf',
        category: 'deliverable',
        status: 'pending',
        description: 'Detailed material specifications',
      },
      {
        projectId: project2.id,
        userId: client2.id,
        name: 'Site_Survey.pdf',
        url: '/documents/Site_Survey.pdf',
        size: 3145728,
        type: 'application/pdf',
        category: 'client-upload',
        status: 'approved',
        description: 'Complete site survey documentation',
        reviewedAt: new Date('2024-08-20'),
        reviewedBy: estimator.id,
      },
    ],
  });

  // Add messages
  await prisma.message.createMany({
    data: [
      {
        projectId: project1.id,
        userId: projectManager.id,
        content: 'Project is progressing well. We\'ve completed the initial assessment and are moving forward with material procurement.',
        isRead: 1,
        priority: 'normal',
      },
      {
        projectId: project1.id,
        userId: client1.id,
        content: 'Great to hear! When can we expect the materials to arrive?',
        isRead: 1,
        priority: 'normal',
      },
      {
        projectId: project1.id,
        userId: projectManager.id,
        content: 'Materials are scheduled to arrive by end of next week. We\'ll begin construction phase immediately after.',
        isRead: 0,
        priority: 'normal',
      },
      {
        projectId: project2.id,
        userId: client2.id,
        content: 'We need an urgent status update on the residential complex project.',
        isRead: 0,
        priority: 'high',
        emailSent: 1,
      },
    ],
  });

  // Add quotes
  const quote1 = await prisma.quote.create({
    data: {
      projectId: project1.id,
      userId: client1.id,
      quoteNumber: 'Q-2024-001',
      items: JSON.stringify([
        { description: 'Interior Painting', quantity: 5000, unit: 'sq ft', price: 3.5, total: 17500 },
        { description: 'Flooring Installation', quantity: 3500, unit: 'sq ft', price: 8.5, total: 29750 },
        { description: 'Drywall Repair', quantity: 2000, unit: 'sq ft', price: 5.5, total: 11000 },
      ]),
      subtotal: 58250,
      taxAmount: 5096.88,
      discount: 0,
      total: 63346.88,
      status: 'accepted',
      validUntil: new Date('2024-10-01'),
      acceptedAt: new Date('2024-09-01'),
      notes: 'Price valid for 30 days',
      terms: 'Payment due within 30 days of invoice',
    },
  });

  // Add invoices
  const invoice1 = await prisma.invoice.create({
    data: {
      projectId: project1.id,
      userId: client1.id,
      invoiceNumber: 'INV-2024-001',
      quoteId: quote1.id,
      items: JSON.stringify([
        { description: 'Interior Painting', quantity: 5000, unit: 'sq ft', price: 3.5, total: 17500 },
        { description: 'Flooring Installation', quantity: 3500, unit: 'sq ft', price: 8.5, total: 29750 },
        { description: 'Drywall Repair', quantity: 2000, unit: 'sq ft', price: 5.5, total: 11000 },
      ]),
      subtotal: 58250,
      taxAmount: 5096.88,
      discount: 0,
      total: 63346.88,
      status: 'paid',
      dueDate: new Date('2024-10-31'),
      paidAt: new Date('2024-10-15'),
      paymentMethod: 'credit_card',
      notes: 'Thank you for your business',
      terms: 'Payment due within 30 days of invoice',
    },
  });

  // Add change order
  await prisma.changeOrder.create({
    data: {
      projectId: project1.id,
      invoiceId: invoice1.id,
      userId: client1.id,
      orderNumber: 'CO-2024-001',
      description: 'Additional painting work for conference rooms',
      items: JSON.stringify([
        { description: 'Conference Room Painting', quantity: 800, unit: 'sq ft', price: 4, total: 3200 },
      ]),
      amount: 3200,
      status: 'approved',
      approvedBy: client1.id,
      approvedAt: new Date('2024-10-20'),
      notes: 'Approved for immediate execution',
    },
  });

  // Add activities
  await prisma.activity.createMany({
    data: [
      {
        projectId: project1.id,
        userId: client1.id,
        type: 'document_upload',
        title: 'Document uploaded',
        details: 'Floor_Plans.dwg uploaded for review',
      },
      {
        projectId: project1.id,
        userId: projectManager.id,
        type: 'milestone_complete',
        title: 'Milestone completed',
        details: 'Initial Assessment completed',
      },
      {
        projectId: project1.id,
        userId: client1.id,
        type: 'message_sent',
        title: 'New message',
        details: 'Client sent a message',
      },
      {
        projectId: project1.id,
        userId: admin.id,
        type: 'quote_accepted',
        title: 'Quote accepted',
        details: 'Quote Q-2024-001 was accepted',
      },
      {
        projectId: project1.id,
        userId: client1.id,
        type: 'payment_received',
        title: 'Payment received',
        details: 'Invoice INV-2024-001 paid in full',
      },
    ],
  });

  // Add notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: client1.id,
        type: 'project_update',
        title: 'Project Update',
        message: 'Your project "Downtown Office Building" has been updated',
        actionUrl: '/portal/project/1',
        actionText: 'View Project',
        isRead: 0,
      },
      {
        userId: client1.id,
        type: 'document_reviewed',
        title: 'Document Reviewed',
        message: 'Your document "Floor_Plans.dwg" has been reviewed',
        actionUrl: '/portal/project/1',
        actionText: 'View Document',
        isRead: 0,
      },
      {
        userId: client2.id,
        type: 'message_received',
        title: 'New Message',
        message: 'You have a new message from your project manager',
        actionUrl: '/portal/project/2',
        actionText: 'View Message',
        isRead: 0,
      },
    ],
  });

  console.log('Database seeded successfully!');
  console.log('\nLogin credentials:');
  console.log('Admin: admin@pennkraft.com / admin123');
  console.log('Team: mike@pennkraft.com / team123');
  console.log('Client: john@abc.com / client123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });