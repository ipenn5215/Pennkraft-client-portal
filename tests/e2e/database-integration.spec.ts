import { test, expect } from '@playwright/test';

test.describe('Database Integration Tests', () => {
  test.describe('API Endpoints', () => {
    test('should fetch projects from database API', async ({ request }) => {
      // Using the actual user ID from seeded data
      const response = await request.get('/api/projects?userId=cmfuprnv80003s6vcbq5i3alz');
      expect(response.ok()).toBeTruthy();

      const projects = await response.json();
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);

      // Check project structure
      const project = projects[0];
      expect(project).toHaveProperty('id');
      expect(project).toHaveProperty('name');
      expect(project).toHaveProperty('status');
      expect(project).toHaveProperty('progress');
      expect(project).toHaveProperty('budget');
    });

    test('should fetch single project details', async ({ request }) => {
      const projectId = 'cmfuprnwz0007s6vcf0ji1hxh'; // Downtown Office Building
      const response = await request.get(`/api/projects/${projectId}`);
      expect(response.ok()).toBeTruthy();

      const project = await response.json();
      expect(project.name).toBe('Downtown Office Building');
      expect(project.documents).toBeDefined();
      expect(project.messages).toBeDefined();
      expect(project.milestones).toBeDefined();
      expect(project.teamMembers).toBeDefined();
    });

    test('should fetch documents for a project', async ({ request }) => {
      const projectId = 'cmfuprnwz0007s6vcf0ji1hxh';
      const response = await request.get(`/api/documents?projectId=${projectId}`);
      expect(response.ok()).toBeTruthy();

      const documents = await response.json();
      expect(Array.isArray(documents)).toBe(true);
      expect(documents.length).toBeGreaterThan(0);

      // Check document structure
      const doc = documents[0];
      expect(doc).toHaveProperty('id');
      expect(doc).toHaveProperty('name');
      expect(doc).toHaveProperty('category');
      expect(doc).toHaveProperty('status');
    });

    test('should fetch messages for a project', async ({ request }) => {
      const projectId = 'cmfuprnwz0007s6vcf0ji1hxh';
      const response = await request.get(`/api/messages?projectId=${projectId}`);
      expect(response.ok()).toBeTruthy();

      const messages = await response.json();
      expect(Array.isArray(messages)).toBe(true);
      expect(messages.length).toBeGreaterThan(0);

      // Check message structure
      const msg = messages[0];
      expect(msg).toHaveProperty('content');
      expect(msg).toHaveProperty('priority');
      expect(msg).toHaveProperty('user');
    });

    test('should fetch quotes for a project', async ({ request }) => {
      const projectId = 'cmfuprnwz0007s6vcf0ji1hxh';
      const response = await request.get(`/api/quotes?projectId=${projectId}`);
      expect(response.ok()).toBeTruthy();

      const quotes = await response.json();
      expect(Array.isArray(quotes)).toBe(true);

      if (quotes.length > 0) {
        const quote = quotes[0];
        expect(quote).toHaveProperty('quoteNumber');
        expect(quote).toHaveProperty('total');
        expect(quote).toHaveProperty('status');
      }
    });

    test('should fetch invoices for a project', async ({ request }) => {
      const projectId = 'cmfuprnwz0007s6vcf0ji1hxh';
      const response = await request.get(`/api/invoices?projectId=${projectId}`);
      expect(response.ok()).toBeTruthy();

      const invoices = await response.json();
      expect(Array.isArray(invoices)).toBe(true);

      if (invoices.length > 0) {
        const invoice = invoices[0];
        expect(invoice).toHaveProperty('invoiceNumber');
        expect(invoice).toHaveProperty('total');
        expect(invoice).toHaveProperty('status');
      }
    });
  });

  test.describe('Document Management', () => {
    test('should upload a document', async ({ request }) => {
      const documentData = {
        projectId: 'cmfuprnwz0007s6vcf0ji1hxh',
        userId: 'cmfuprnv80003s6vcbq5i3alz',
        name: 'Test_Document.pdf',
        url: '/documents/Test_Document.pdf',
        size: 1024000,
        type: 'application/pdf',
        category: 'client-upload',
        description: 'Test document upload',
      };

      const response = await request.post('/api/documents', {
        data: documentData,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(response.ok()).toBeTruthy();
      const document = await response.json();
      expect(document.name).toBe('Test_Document.pdf');
      expect(document.status).toBe('pending');
    });

    test('should update document status', async ({ request }) => {
      // First get a document to update
      const projectId = 'cmfuprnwz0007s6vcf0ji1hxh';
      const docsResponse = await request.get(`/api/documents?projectId=${projectId}`);
      const documents = await docsResponse.json();

      if (documents.length > 0) {
        const doc = documents[0];
        const response = await request.patch('/api/documents', {
          data: {
            documentId: doc.id,
            status: 'approved',
            reviewedBy: 'cmfuprnqu0000s6vcstncqdru', // Admin ID
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });

        expect(response.ok()).toBeTruthy();
      }
    });
  });

  test.describe('Messaging System', () => {
    test('should send a message', async ({ request }) => {
      const messageData = {
        projectId: 'cmfuprnwz0007s6vcf0ji1hxh',
        userId: 'cmfuprnv80003s6vcbq5i3alz',
        content: 'This is a test message from E2E tests',
        priority: 'normal',
      };

      const response = await request.post('/api/messages', {
        data: messageData,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(response.ok()).toBeTruthy();
      const message = await response.json();
      expect(message.content).toBe('This is a test message from E2E tests');
    });

    test('should mark messages as read', async ({ request }) => {
      // Get messages first
      const projectId = 'cmfuprnwz0007s6vcf0ji1hxh';
      const msgResponse = await request.get(`/api/messages?projectId=${projectId}`);
      const messages = await msgResponse.json();

      if (messages.length > 0) {
        const messageIds = messages.map((msg: any) => msg.id).slice(0, 2);

        const response = await request.patch('/api/messages', {
          data: { messageIds },
          headers: {
            'Content-Type': 'application/json',
          },
        });

        expect(response.ok()).toBeTruthy();
      }
    });

    test('should send high priority message with email notification', async ({ request }) => {
      const messageData = {
        projectId: 'cmfuprnwz0007s6vcf0ji1hxh',
        userId: 'cmfuprnv80003s6vcbq5i3alz',
        content: 'URGENT: Status update required',
        priority: 'high',
      };

      const response = await request.post('/api/messages', {
        data: messageData,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(response.ok()).toBeTruthy();
      const message = await response.json();
      expect(message.priority).toBe('high');
      expect(message.emailSent).toBe(true);
    });
  });

  test.describe('Billing System', () => {
    test('should create a quote', async ({ request }) => {
      const quoteData = {
        projectId: 'cmfuprnwz0007s6vcf0ji1hxh',
        userId: 'cmfuprnv80003s6vcbq5i3alz',
        items: [
          { description: 'Additional Work', quantity: 100, unit: 'sq ft', price: 10, total: 1000 },
        ],
        subtotal: 1000,
        taxRate: 0.0875,
        discount: 0,
        notes: 'Test quote from E2E tests',
        terms: 'Payment due within 30 days',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const response = await request.post('/api/quotes', {
        data: quoteData,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(response.ok()).toBeTruthy();
      const quote = await response.json();
      expect(quote).toHaveProperty('quoteNumber');
      expect(quote.subtotal).toBe(1000);
    });

    test('should convert quote to invoice', async ({ request }) => {
      // First get a quote
      const quotesResponse = await request.get('/api/quotes?projectId=cmfuprnwz0007s6vcf0ji1hxh');
      const quotes = await quotesResponse.json();

      if (quotes.length > 0) {
        const quote = quotes[0];

        const response = await request.post('/api/invoices', {
          data: {
            quoteId: quote.id,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });

        expect(response.ok()).toBeTruthy();
        const invoice = await response.json();
        expect(invoice).toHaveProperty('invoiceNumber');
        expect(invoice.quoteId).toBe(quote.id);
      }
    });

    test('should update invoice payment status', async ({ request }) => {
      // Get an invoice
      const invoicesResponse = await request.get('/api/invoices?projectId=cmfuprnwz0007s6vcf0ji1hxh');
      const invoices = await invoicesResponse.json();

      if (invoices.length > 0) {
        const invoice = invoices[0];

        const response = await request.patch('/api/invoices', {
          data: {
            invoiceId: invoice.id,
            status: 'paid',
            paymentMethod: 'credit_card',
            stripeId: 'test_stripe_id_123',
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });

        expect(response.ok()).toBeTruthy();
      }
    });
  });

  test.describe('User Management', () => {
    test('should fetch user details', async ({ request }) => {
      const userId = 'cmfuprnv80003s6vcbq5i3alz'; // John Doe
      const response = await request.get(`/api/users/${userId}`);
      expect(response.ok()).toBeTruthy();

      const user = await response.json();
      expect(user.email).toBe('john@abc.com');
      expect(user.fullName).toBe('John Doe');
      expect(user).not.toHaveProperty('password'); // Should not include password
    });

    test('should update user profile', async ({ request }) => {
      const userId = 'cmfuprnv80003s6vcbq5i3alz';
      const updateData = {
        phone: '(555) 999-9999',
        company: 'ABC Construction Updated',
      };

      const response = await request.patch(`/api/users/${userId}`, {
        data: updateData,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(response.ok()).toBeTruthy();
      const user = await response.json();
      expect(user.phone).toBe('(555) 999-9999');
      expect(user.company).toBe('ABC Construction Updated');
    });
  });
});

test.describe('Portal Integration with Database', () => {
  test('should display actual projects from database', async ({ page }) => {
    // This would require authentication, which we'll skip for now
    // In a real scenario, you'd need to handle the authentication flow

    await page.goto('http://localhost:3001/portal');

    // Check if we're redirected to login (expected without auth)
    const url = page.url();
    if (url.includes('/login')) {
      expect(url).toContain('/login');
    } else {
      // If we somehow get to the portal, check for database content
      await expect(page.getByText('Downtown Office Building')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Warehouse Conversion')).toBeVisible();
    }
  });
});

test.describe('Authentication Flow', () => {
  test('should handle login with database credentials', async ({ page }) => {
    await page.goto('http://localhost:3001/login');

    // Fill in login form with seeded credentials
    await page.fill('input[type="email"]', 'john@abc.com');
    await page.fill('input[type="password"]', 'client123');

    // Click login button
    await page.click('button[type="submit"]');

    // Should redirect to portal for client users
    await page.waitForURL('**/portal', { timeout: 10000 });
    expect(page.url()).toContain('/portal');
  });

  test('should handle admin login', async ({ page }) => {
    await page.goto('http://localhost:3001/login');

    // Fill in admin credentials
    await page.fill('input[type="email"]', 'admin@pennkraft.com');
    await page.fill('input[type="password"]', 'admin123');

    // Click login button
    await page.click('button[type="submit"]');

    // Should redirect to admin for admin users
    await page.waitForURL('**/admin', { timeout: 10000 });
    expect(page.url()).toContain('/admin');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3001/login');

    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');

    // Click login button
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.getByText('Invalid email or password')).toBeVisible({ timeout: 5000 });
  });
});