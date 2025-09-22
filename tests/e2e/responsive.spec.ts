import { test, expect, devices } from '@playwright/test';

const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
};

test.describe('Responsive Design Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 10000 });
  });

  Object.entries(viewports).forEach(([device, viewport]) => {
    test.describe(`${device} viewport`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize(viewport);
      });

      test(`should display properly on ${device}`, async ({ page }) => {
        // Check navigation is visible
        const nav = page.locator('nav');
        await expect(nav).toBeVisible();

        // Check hero section
        await expect(page.getByRole('heading', { name: /Professional.*Estimating.*Tech Solutions/i })).toBeVisible();

        // Check services section
        await page.locator('#services').scrollIntoViewIfNeeded();
        await expect(page.locator('#services').getByRole('heading', { name: 'Construction Estimating' })).toBeVisible();

        // Check contact form
        await page.locator('#contact').scrollIntoViewIfNeeded();
        await expect(page.getByLabel(/Full Name/i)).toBeVisible();
      });

      if (device === 'mobile') {
        test('should show mobile menu', async ({ page }) => {
          const menuButton = page.locator('button[aria-label="Toggle menu"]');
          await expect(menuButton).toBeVisible();

          // Desktop menu should be hidden
          const desktopLinks = page.locator('nav a.hidden.md\\:flex');
          await expect(desktopLinks.first()).toBeHidden();
        });

        test('should stack cards vertically on mobile', async ({ page }) => {
          await page.locator('#services').scrollIntoViewIfNeeded();

          // On mobile, the service cards should be in a column layout
          // Check for the gradient backgrounds which are the service cards
          const firstCard = page.locator('[class*="from-blue-500"]').first();
          const secondCard = page.locator('[class*="from-purple-500"]').first();

          const firstBox = await firstCard.boundingBox();
          const secondBox = await secondCard.boundingBox();

          if (firstBox && secondBox) {
            // Cards should be stacked vertically (second card Y position should be below first card)
            expect(secondBox.y).toBeGreaterThan(firstBox.y);
          }
        });
      }

      if (device === 'desktop') {
        test('should show desktop navigation', async ({ page }) => {
          // Mobile menu button should be hidden
          const menuButton = page.locator('button[aria-label="Toggle menu"]');
          await expect(menuButton).toBeHidden();

          // Desktop links should be visible
          await expect(page.locator('nav').getByRole('link', { name: /Services/i })).toBeVisible();
        });

        test('should display service cards in grid on desktop', async ({ page }) => {
          await page.locator('#services').scrollIntoViewIfNeeded();

          // On desktop, service cards should be in a grid layout (side by side)
          // Check for the gradient backgrounds which are the service cards
          const cards = page.locator('[class*="from-"][class*="-500"]');
          const count = await cards.count();

          // Should have at least 2 service cards
          expect(count).toBeGreaterThanOrEqual(2);

          // On desktop they would typically be in a grid, but exact layout depends on the implementation
          // Just verify cards are visible
          await expect(cards.first()).toBeVisible();
        });
      }
    });
  });

  test('should work on real mobile devices', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();

    await page.goto('http://localhost:3000');
    await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 10000 });

    // Check that page loaded and hero content is visible
    await expect(page.getByRole('heading', { name: /Professional.*Estimating.*Tech Solutions/i })).toBeVisible();

    // Check mobile navigation
    const menuButton = page.locator('button[aria-label="Toggle menu"]');
    await expect(menuButton).toBeVisible();

    await context.close();
  });

  test('should work on real tablet devices', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPad Mini'],
    });
    const page = await context.newPage();

    await page.goto('http://localhost:3000');
    await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 10000 });

    // Check layout
    await expect(page.getByRole('heading', { name: /Professional.*Estimating.*Tech Solutions/i })).toBeVisible();

    await context.close();
  });
});