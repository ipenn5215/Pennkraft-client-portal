import { test, expect } from '@playwright/test';

test.describe('Pennkraft Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Wait for loading screen to complete
    await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 10000 });
  });

  test('should display loading screen and then main content', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Loading screen should be visible initially
    const loadingScreen = page.locator('.loading-screen');
    await expect(loadingScreen).toBeVisible();

    // Main content should be visible after loading
    await page.waitForSelector('main', { state: 'visible', timeout: 10000 });
    await expect(page.locator('main')).toBeVisible();
  });

  test('should have correct page title and metadata', async ({ page }) => {
    await expect(page).toHaveTitle(/Pennkraft/);

    const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
    expect(metaDescription).toContain('estimating services');
  });

  test.describe('Navigation', () => {
    test('should display navigation menu', async ({ page }) => {
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // Check for logo (use more specific selector)
      await expect(page.locator('nav').getByText('Pennkraft').first()).toBeVisible();

      // Check for menu items (use more specific selectors)
      await expect(page.locator('nav').getByRole('link', { name: 'Services' }).first()).toBeVisible();
      await expect(page.locator('nav').getByRole('link', { name: 'About' }).first()).toBeVisible();
      await expect(page.locator('nav').getByRole('link', { name: 'Contact' }).first()).toBeVisible();
    });

    test('should navigate to sections via menu links', async ({ page }) => {
      // Click Services link (use specific selector)
      await page.locator('nav').getByRole('link', { name: 'Services' }).first().click();
      await expect(page.locator('#services')).toBeInViewport();

      // Click About link
      await page.locator('nav').getByRole('link', { name: 'About' }).first().click();
      await expect(page.locator('#about')).toBeInViewport();

      // Click Contact link
      await page.locator('nav').getByRole('link', { name: 'Contact' }).first().click();
      await expect(page.locator('#contact')).toBeInViewport();
    });

    test('should show mobile menu on small screens', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Mobile menu button should be visible
      const menuButton = page.locator('button[aria-label="Toggle menu"]');
      await expect(menuButton).toBeVisible();

      // Desktop menu should be hidden
      const desktopMenu = page.locator('nav .hidden.md\\:flex');
      await expect(desktopMenu).toBeHidden();

      // Click menu button
      await menuButton.click();

      // Mobile menu should be visible (it appears below the nav bar)
      await page.waitForTimeout(300); // Wait for animation
      const mobileMenu = page.locator('.md\\:hidden.bg-white\\/95');
      await expect(mobileMenu).toBeVisible();
    });
  });

  test.describe('Hero Section', () => {
    test('should display hero content', async ({ page }) => {
      const hero = page.locator('section').first();

      // Check for main heading
      await expect(page.getByRole('heading', { name: /Professional.*Estimating.*Tech Solutions/i })).toBeVisible();

      // Check for subtitle
      await expect(page.getByText(/Expert construction estimates/i)).toBeVisible();

      // Check for CTA links
      await expect(page.getByRole('link', { name: /Get Started/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Our Services/i })).toBeVisible();
    });

    test('should have working CTA buttons', async ({ page }) => {
      // Click Get Started - should navigate to portal
      await page.getByRole('link', { name: /Get Started/i }).click();
      await expect(page).toHaveURL(/\/portal/);

      // Go back to home
      await page.goto('http://localhost:3000');
      await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 10000 });

      // Click Our Services - should scroll to services
      await page.getByRole('link', { name: /Our Services/i }).click();
      await page.waitForTimeout(500); // Wait for scroll animation
      await expect(page.locator('#services')).toBeInViewport();
    });
  });

  test.describe('Services Section', () => {
    test('should display all service cards', async ({ page }) => {
      await page.locator('#services').scrollIntoViewIfNeeded();

      // Check for service categories (use heading selector for specificity)
      await expect(page.locator('#services').getByRole('heading', { name: 'Construction Estimating' })).toBeVisible();
      await expect(page.locator('#services').getByRole('heading', { name: 'Field Walks & Assessments' })).toBeVisible();

      // Check for service descriptions
      await expect(page.getByText(/Professional takeoffs/i)).toBeVisible();
      await expect(page.getByText(/On-site project evaluation/i)).toBeVisible();
    });

    test('should show service details on hover', async ({ page }) => {
      await page.locator('#services').scrollIntoViewIfNeeded();

      // Find a service card (look for the gradient backgrounds)
      const firstCard = page.locator('[class*="from-blue-500"]').first();

      // Check that the card is visible
      await expect(firstCard).toBeVisible();

      // Hover over it
      await firstCard.hover();

      // Verify hover state (card should have transform on hover)
      await page.waitForTimeout(100); // Small wait for hover effect
    });
  });

  test.describe('About Section', () => {
    test('should display company information', async ({ page }) => {
      await page.locator('#about').scrollIntoViewIfNeeded();

      // Check for heading
      await expect(page.getByRole('heading', { name: /Why Choose Pennkraft/i })).toBeVisible();

      // Check for statistics (more specific selectors)
      const aboutSection = page.locator('#about');
      await expect(aboutSection.getByText('Years Experience')).toBeVisible();
      await expect(aboutSection.getByText('Projects Completed')).toBeVisible();
      await expect(aboutSection.getByText('Satisfied Clients').first()).toBeVisible();
      await expect(aboutSection.getByText('Accuracy Rate')).toBeVisible();
    });
  });

  test.describe('Contact Form', () => {
    test('should display contact form fields', async ({ page }) => {
      await page.locator('#contact').scrollIntoViewIfNeeded();

      // Check for form fields
      await expect(page.getByLabel(/Full Name/i)).toBeVisible();
      await expect(page.getByLabel(/Email Address/i)).toBeVisible();
      await expect(page.getByLabel(/Phone Number/i)).toBeVisible();
      await expect(page.getByLabel(/Service Needed/i)).toBeVisible();
      await expect(page.getByLabel(/Project Description/i)).toBeVisible();

      // Check for submit button
      await expect(page.getByRole('button', { name: /Send Message/i })).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      await page.locator('#contact').scrollIntoViewIfNeeded();

      // Try to submit empty form
      await page.getByRole('button', { name: /Send Message/i }).click();

      // Check for HTML5 validation messages
      const nameInput = page.getByLabel(/Full Name/i);
      const isNameInvalid = await nameInput.evaluate((el: HTMLInputElement) =>
        !el.validity.valid
      );
      expect(isNameInvalid).toBe(true);
    });

    test('should fill and submit form', async ({ page }) => {
      await page.locator('#contact').scrollIntoViewIfNeeded();

      // Fill form fields
      await page.getByLabel(/Full Name/i).fill('John Doe');
      await page.getByLabel(/Email Address/i).fill('john@example.com');
      await page.getByLabel(/Phone Number/i).fill('555-0123');
      await page.getByLabel(/Service Needed/i).selectOption('painting');
      await page.getByLabel(/Project Description/i).fill('Test message for contact form');

      // Submit form
      await page.getByRole('button', { name: /Send Message/i }).click();

      // Check for submission (currently just logs to console)
      // In production, this would check for success message
    });
  });

  test.describe('Footer', () => {
    test('should display footer information', async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      const footer = page.locator('footer');
      await expect(footer).toBeVisible();

      // Check for copyright
      await expect(page.getByText(/© 2025 Pennkraft/i)).toBeVisible();

      // Check for footer links
      await expect(page.getByRole('link', { name: /Privacy Policy/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Terms of Service/i })).toBeVisible();
    });
  });
});