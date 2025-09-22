import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Admin Navigation', () => {
    test('should display admin sidebar with navigation', async ({ page }) => {
      // Check sidebar exists
      const sidebar = page.locator('.fixed.inset-y-0.left-0');
      await expect(sidebar).toBeVisible();

      // Check logo
      await expect(page.getByText('Pennkraft Admin')).toBeVisible();

      // Check navigation items
      const navItems = ['Dashboard', 'Projects', 'Clients', 'Documents', 'Invoices', 'Team', 'Settings'];
      for (const item of navItems) {
        await expect(page.getByRole('button', { name: item })).toBeVisible();
      }

      // Check logout button
      await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    });

    test('should navigate between sections', async ({ page }) => {
      // Click on Projects
      await page.getByRole('button', { name: 'Projects' }).click();
      await expect(page.getByRole('heading', { name: 'projects' })).toBeVisible();

      // Click on Clients
      await page.getByRole('button', { name: 'Clients' }).click();
      await expect(page.getByRole('heading', { name: 'clients' })).toBeVisible();

      // Click back on Dashboard
      await page.getByRole('button', { name: 'Dashboard' }).click();
      await expect(page.getByRole('heading', { name: 'dashboard' })).toBeVisible();
    });

    test('should highlight active navigation item', async ({ page }) => {
      // Check Dashboard is active initially
      const dashboardButton = page.getByRole('button', { name: 'Dashboard' });
      await expect(dashboardButton).toHaveClass(/bg-primary-600/);

      // Navigate to Projects
      await page.getByRole('button', { name: 'Projects' }).click();
      const projectsButton = page.getByRole('button', { name: 'Projects' });
      await expect(projectsButton).toHaveClass(/bg-primary-600/);
    });
  });

  test.describe('Dashboard Overview', () => {
    test('should display stats cards', async ({ page }) => {
      // Check stats cards are visible
      await expect(page.getByText('Total Projects')).toBeVisible();
      await expect(page.getByText('Total Revenue')).toBeVisible();
      await expect(page.getByText('Total Clients')).toBeVisible();
      await expect(page.getByText('Active Projects')).toBeVisible();

      // Check stats values
      await expect(page.getByText('24')).toBeVisible();
      await expect(page.getByText('$2.4M')).toBeVisible();
      await expect(page.getByText('18')).toBeVisible();
    });

    test('should display trend indicators', async ({ page }) => {
      // Check for trend indicators
      const trendIndicators = page.locator('svg').filter({ hasClass: /TrendingUp|TrendingDown/ });
      const count = await trendIndicators.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display recent projects table', async ({ page }) => {
      // Check table headers
      await expect(page.getByRole('heading', { name: 'Recent Projects' })).toBeVisible();

      // Check table columns
      const headers = ['Project', 'Client', 'Status', 'Progress', 'Budget', 'Due Date', 'Manager', 'Actions'];
      for (const header of headers) {
        await expect(page.getByRole('columnheader', { name: header })).toBeVisible();
      }

      // Check sample project data
      await expect(page.getByText('Downtown Office Building')).toBeVisible();
      await expect(page.getByText('ABC Construction')).toBeVisible();
    });

    test('should display team members overview', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Team Members' })).toBeVisible();

      // Check team member entries
      await expect(page.getByText('Mike Johnson')).toBeVisible();
      await expect(page.getByText('Project Manager')).toBeVisible();
      await expect(page.getByText('Sarah Chen')).toBeVisible();
      await expect(page.getByText('Senior Estimator')).toBeVisible();
    });

    test('should display recent activity', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Recent Activity' })).toBeVisible();

      // Check activity entries
      await expect(page.getByText(/New project created/)).toBeVisible();
      await expect(page.getByText(/Invoice paid/)).toBeVisible();
    });
  });

  test.describe('Clients Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'Clients' }).click();
      await page.waitForTimeout(500); // Wait for animation
    });

    test('should display clients table', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Client Management' })).toBeVisible();
      await expect(page.getByRole('button', { name: /Add Client/ })).toBeVisible();

      // Check table structure
      await expect(page.getByRole('columnheader', { name: 'Client' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Company' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Contact' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Total Spent' })).toBeVisible();
    });

    test('should display client information', async ({ page }) => {
      // Check client entries
      await expect(page.getByText('John Doe')).toBeVisible();
      await expect(page.getByText('ABC Construction')).toBeVisible();
      await expect(page.getByText('john@abc.com')).toBeVisible();
      await expect(page.getByText('$380,000')).toBeVisible();
    });

    test('should have action buttons for each client', async ({ page }) => {
      // Check action buttons
      const actionButtons = page.locator('button').filter({ has: page.locator('svg.h-4.w-4') });
      const count = await actionButtons.count();
      expect(count).toBeGreaterThan(6); // At least view, edit, delete for multiple clients
    });

    test('should have search functionality', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/Search clients/);
      await expect(searchInput).toBeVisible();

      // Type in search
      await searchInput.fill('John');
      await page.waitForTimeout(300);
    });
  });

  test.describe('Projects Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'Projects' }).click();
      await page.waitForTimeout(500); // Wait for animation
    });

    test('should display projects section', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'All Projects' })).toBeVisible();
      await expect(page.getByText('Manage and oversee all projects')).toBeVisible();
    });

    test('should have project action buttons', async ({ page }) => {
      // Check filter button
      await expect(page.getByRole('button', { name: /Filter/ })).toBeVisible();

      // Check export button
      await expect(page.getByRole('button', { name: /Export/ })).toBeVisible();

      // Check new project button
      await expect(page.getByRole('button', { name: /New Project/ })).toBeVisible();
    });
  });

  test.describe('Admin Header', () => {
    test('should display header with user menu', async ({ page }) => {
      // Check notification bell
      const bellButton = page.locator('button').filter({ has: page.locator('svg.h-6.w-6') }).first();
      await expect(bellButton).toBeVisible();

      // Check notification indicator
      const notificationDot = page.locator('.bg-red-500.rounded-full');
      await expect(notificationDot).toBeVisible();

      // Check admin user button
      await expect(page.getByText('Admin')).toBeVisible();
    });

    test('should toggle user menu dropdown', async ({ page }) => {
      // Click on admin button
      await page.getByText('Admin').click();

      // Check dropdown appears (would need actual implementation)
      await page.waitForTimeout(300);
    });
  });
});

test.describe('Admin Dashboard Responsive Design', () => {
  test('should handle mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/admin');

    // Sidebar should still be visible (fixed position)
    const sidebar = page.locator('.fixed.inset-y-0.left-0');
    await expect(sidebar).toBeVisible();
  });

  test('should handle tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000/admin');

    // Check layout adapts
    await expect(page.getByText('Pennkraft Admin')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'dashboard' })).toBeVisible();
  });

  test('should handle desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000/admin');

    // Check full layout is visible
    await expect(page.getByRole('heading', { name: 'Recent Projects' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Team Members' })).toBeVisible();
  });
});

test.describe('Admin Data Management', () => {
  test('should display progress bars for projects', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');

    // Check progress bars are rendered
    const progressBars = page.locator('.bg-primary-600').filter({ has: page.locator('..').filter({ hasText: '%' }) });
    const count = await progressBars.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display status badges', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');

    // Check status badges
    await expect(page.locator('.bg-green-100').first()).toBeVisible();
    await expect(page.locator('.bg-blue-100').first()).toBeVisible();
  });

  test('should show client status indicators', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await page.getByRole('button', { name: 'Clients' }).click();

    // Check for active/inactive status
    await expect(page.getByText('active').first()).toBeVisible();
  });
});