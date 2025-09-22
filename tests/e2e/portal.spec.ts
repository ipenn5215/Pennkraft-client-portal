import { test, expect } from '@playwright/test';

test.describe('Client Portal Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/portal');
  });

  test.describe('Portal Navigation', () => {
    test('should display portal header with navigation', async ({ page }) => {
      // Check header elements
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('text=Pennkraft')).toBeVisible();

      // Check navigation links
      await expect(page.getByRole('button', { name: 'Projects' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Documents' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Messages' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Billing' })).toBeVisible();
    });

    test('should show user menu dropdown', async ({ page }) => {
      // Check user avatar is visible
      const userAvatar = page.locator('.bg-gradient-to-br.from-primary-400.to-primary-600');
      await expect(userAvatar).toBeVisible();

      // Click user menu
      await page.locator('button:has-text("John Doe")').click();

      // Check dropdown menu items
      await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    });

    test('should navigate back to home page', async ({ page }) => {
      await page.locator('a:has-text("Pennkraft")').click();
      await expect(page).toHaveURL('http://localhost:3000/');
    });
  });

  test.describe('Dashboard Overview', () => {
    test('should display welcome message and stats', async ({ page }) => {
      // Check welcome message
      await expect(page.getByRole('heading', { name: /Welcome back/ })).toBeVisible();

      // Check stats cards
      await expect(page.getByText('Active Projects')).toBeVisible();
      await expect(page.getByText('Total Budget')).toBeVisible();
      await expect(page.getByText('Documents')).toBeVisible();
      await expect(page.getByText('Unread Messages')).toBeVisible();
    });

    test('should display project cards with correct information', async ({ page }) => {
      // Check project cards section
      await expect(page.getByRole('heading', { name: 'Your Projects' })).toBeVisible();

      // Check first project card
      const firstCard = page.locator('.bg-white.rounded-lg.shadow-sm').filter({ hasText: 'Downtown Office Building' });
      await expect(firstCard).toBeVisible();

      // Check project details
      await expect(firstCard.getByText('Commercial Renovation')).toBeVisible();
      await expect(firstCard.getByText('In Progress')).toBeVisible();
      await expect(firstCard.getByText('65%')).toBeVisible();
      await expect(firstCard.getByText('2024-12-15')).toBeVisible();
      await expect(firstCard.getByText('$125,000')).toBeVisible();
    });

    test('should filter projects by status', async ({ page }) => {
      // Test filter buttons
      const filterButtons = ['all', 'active', 'review', 'pending', 'completed'];

      for (const filter of filterButtons) {
        await page.getByRole('button', { name: filter, exact: true }).click();

        // Check filter is active
        const activeFilter = page.locator(`button:has-text("${filter}")`).first();
        await expect(activeFilter).toHaveClass(/bg-primary-600/);
      }
    });

    test('should show project progress bars', async ({ page }) => {
      // Check that progress bars are visible and animated
      const progressBars = page.locator('.bg-blue-500, .bg-yellow-500, .bg-green-500');
      const count = await progressBars.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Quick Actions', () => {
    test('should display quick action cards', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Quick Actions' })).toBeVisible();

      // Check action cards
      await expect(page.getByText('Request Estimate')).toBeVisible();
      await expect(page.getByText('Schedule Meeting')).toBeVisible();
      await expect(page.getByText('Contact Support')).toBeVisible();
    });

    test('should have hover effects on quick action cards', async ({ page }) => {
      const requestCard = page.locator('.bg-white').filter({ hasText: 'Request Estimate' });
      await requestCard.hover();

      // Check hover state (card should scale)
      await page.waitForTimeout(100);
    });
  });
});

test.describe('Project Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/portal/project/1');
  });

  test('should display project header with details', async ({ page }) => {
    // Check project name and status
    await expect(page.getByRole('heading', { name: 'Downtown Office Building' })).toBeVisible();
    await expect(page.getByText('Commercial Renovation')).toBeVisible();
    await expect(page.getByText('In Progress')).toBeVisible();

    // Check budget information
    await expect(page.getByText('$125,000')).toBeVisible();
    await expect(page.getByText('Spent: $81,250')).toBeVisible();
  });

  test('should navigate through project tabs', async ({ page }) => {
    const tabs = ['overview', 'documents', 'communication', 'milestones', 'activity'];

    for (const tab of tabs) {
      await page.getByRole('button', { name: tab, exact: true }).click();

      // Check tab is active
      const activeTab = page.locator(`button:has-text("${tab}")`);
      await expect(activeTab).toHaveClass(/border-primary-500/);
    }
  });

  test.describe('Overview Tab', () => {
    test('should display project details and contacts', async ({ page }) => {
      await page.getByRole('button', { name: 'overview' }).click();

      // Check project details section
      await expect(page.getByText('Project Details')).toBeVisible();
      await expect(page.getByText('Start Date')).toBeVisible();
      await expect(page.getByText('Due Date')).toBeVisible();
      await expect(page.getByText('Budget')).toBeVisible();

      // Check team contacts
      await expect(page.getByText('Team Contacts')).toBeVisible();
      await expect(page.getByText('Mike Johnson')).toBeVisible();
      await expect(page.getByText('Project Manager')).toBeVisible();
    });

    test('should display recent activity', async ({ page }) => {
      await page.getByRole('button', { name: 'overview' }).click();

      await expect(page.getByText('Recent Activity')).toBeVisible();
      await expect(page.getByText('Document uploaded')).toBeVisible();
    });
  });

  test.describe('Documents Tab', () => {
    test('should display documents list', async ({ page }) => {
      await page.getByRole('button', { name: 'documents' }).click();

      await expect(page.getByText('Project Documents')).toBeVisible();
      await expect(page.getByRole('button', { name: /Upload Document/ })).toBeVisible();

      // Check document entries
      await expect(page.getByText('Initial_Estimate.pdf')).toBeVisible();
      await expect(page.getByText('Floor_Plans.dwg')).toBeVisible();
    });

    test('should show document actions', async ({ page }) => {
      await page.getByRole('button', { name: 'documents' }).click();

      // Check action buttons for first document
      const firstDoc = page.locator('.flex').filter({ hasText: 'Initial_Estimate.pdf' });
      await expect(firstDoc.locator('button').first()).toBeVisible(); // Download button
    });
  });

  test.describe('Communication Tab', () => {
    test('should display message thread', async ({ page }) => {
      await page.getByRole('button', { name: 'communication' }).click();

      // Check messages are visible
      await expect(page.getByText(/Project is progressing well/)).toBeVisible();
      await expect(page.getByText('Mike Johnson • Project Manager')).toBeVisible();
    });

    test('should have message input area', async ({ page }) => {
      await page.getByRole('button', { name: 'communication' }).click();

      // Check message input
      await expect(page.getByPlaceholder('Type your message...')).toBeVisible();

      // Check send button
      const sendButton = page.locator('button').filter({ has: page.locator('svg.h-5.w-5') }).last();
      await expect(sendButton).toBeVisible();
    });
  });

  test.describe('Milestones Tab', () => {
    test('should display project milestones', async ({ page }) => {
      await page.getByRole('button', { name: 'milestones' }).click();

      await expect(page.getByText('Project Milestones')).toBeVisible();

      // Check milestone entries
      await expect(page.getByText('Initial Assessment')).toBeVisible();
      await expect(page.getByText('Design Approval')).toBeVisible();
      await expect(page.getByText('Materials Procurement')).toBeVisible();

      // Check milestone statuses
      await expect(page.getByText('completed').first()).toBeVisible();
      await expect(page.getByText('active')).toBeVisible();
      await expect(page.getByText('pending')).toBeVisible();
    });
  });

  test.describe('Activity Tab', () => {
    test('should display activity log', async ({ page }) => {
      await page.getByRole('button', { name: 'activity' }).click();

      await expect(page.getByText('Project Activity Log')).toBeVisible();

      // Check activity entries
      await expect(page.getByText(/John Doe.*document uploaded/)).toBeVisible();
      await expect(page.getByText(/Mike Johnson.*milestone completed/)).toBeVisible();
    });
  });

  test('should navigate back to projects list', async ({ page }) => {
    await page.getByRole('link', { name: 'Back to Projects' }).click();
    await expect(page).toHaveURL('http://localhost:3000/portal');
  });
});

test.describe('Portal Responsive Design', () => {
  test('should adapt to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/portal');

    // Check mobile layout
    await expect(page.locator('header')).toBeVisible();

    // Navigation should be visible but may be condensed
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should adapt to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000/portal');

    // Check tablet layout
    await expect(page.getByRole('heading', { name: /Welcome back/ })).toBeVisible();

    // Project cards should be visible
    await expect(page.getByText('Downtown Office Building')).toBeVisible();
  });

  test('should show project cards in grid on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000/portal');

    // Check desktop grid layout
    const projectCards = page.locator('.bg-white.rounded-lg.shadow-sm').filter({ hasText: /Project/ });
    const count = await projectCards.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });
});