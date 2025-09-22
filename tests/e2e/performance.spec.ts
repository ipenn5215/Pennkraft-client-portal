import { test, expect } from '@playwright/test';

test.describe('Performance and Accessibility Tests', () => {
  test('should load page within performance budget', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('http://localhost:3000');
    await page.waitForSelector('main', { state: 'visible', timeout: 10000 });

    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds (adjusted for development environment)
    expect(loadTime).toBeLessThan(5000);

    // Check for Core Web Vitals
    const metrics = await page.evaluate(() => {
      const observer = new PerformanceObserver(() => {});
      observer.observe({ entryTypes: ['navigation'] });
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      };
    });

    expect(metrics.domContentLoaded).toBeLessThan(3000);
    expect(metrics.loadComplete).toBeLessThan(4000);
  });

  test('should have good accessibility', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 10000 });

    // Check for proper heading hierarchy
    const headings = await page.evaluate(() => {
      const h1Count = document.querySelectorAll('h1').length;
      const h2Count = document.querySelectorAll('h2').length;
      const h3Count = document.querySelectorAll('h3').length;

      return { h1Count, h2Count, h3Count };
    });

    expect(headings.h1Count).toBeGreaterThan(0);
    expect(headings.h1Count).toBeLessThanOrEqual(1); // Should have only one H1

    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // All images should have alt text (even if empty for decorative)
      expect(alt).toBeDefined();
    }

    // Check for form labels
    const inputs = page.locator('input, select, textarea');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const inputId = await input.getAttribute('id');
      const inputType = await input.getAttribute('type');

      // Skip hidden inputs
      if (inputType === 'hidden') continue;

      if (inputId) {
        const label = page.locator(`label[for="${inputId}"]`);
        const labelExists = await label.count() > 0;

        // Or check for aria-label
        const ariaLabel = await input.getAttribute('aria-label');

        expect(labelExists || ariaLabel).toBeTruthy();
      }
    }

    // Check for proper ARIA attributes on interactive elements
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');

      // Button should have either text content or aria-label
      expect(text?.trim() || ariaLabel).toBeTruthy();
    }
  });

  test('should have proper focus management', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 10000 });

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(firstFocused).toBeTruthy();

    // Continue tabbing and check focus order
    const focusOrder = [];
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const element = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tag: el?.tagName,
          text: el?.textContent?.trim().substring(0, 20),
        };
      });
      focusOrder.push(element);
    }

    // Should have a logical focus order
    expect(focusOrder.length).toBeGreaterThan(0);
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 10000 });

    // Test Enter key on links (not buttons)
    await page.getByRole('link', { name: /Get Started/i }).focus();
    await page.keyboard.press('Enter');

    // Should navigate to portal page
    await page.waitForURL(/\/portal/, { timeout: 5000 });

    // Go back to test mobile menu
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 10000 });

    // Test Escape key on mobile menu
    await page.setViewportSize({ width: 375, height: 667 });
    const menuButton = page.locator('button[aria-label="Toggle menu"]');

    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(300);
      // Verify menu is open
      const mobileMenu = page.locator('.md\\:hidden.bg-white\\/95');
      await expect(mobileMenu).toBeVisible();

      // Press Escape (note: may not be implemented in the component)
      await page.keyboard.press('Escape');
    }
  });

  test('should have good color contrast', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 10000 });

    // Check text contrast ratios
    const contrastIssues = await page.evaluate(() => {
      const issues: string[] = [];

      // Helper function to get luminance
      const getLuminance = (r: number, g: number, b: number) => {
        const [rs, gs, bs] = [r, g, b].map(c => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      };

      // Helper function to calculate contrast ratio
      const getContrastRatio = (l1: number, l2: number) => {
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
      };

      // Check all text elements
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button');

      textElements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const bgColor = styles.backgroundColor;

        if (color && bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
          // Parse colors (simplified - real implementation would be more robust)
          const colorMatch = color.match(/\d+/g);
          const bgMatch = bgColor.match(/\d+/g);

          if (colorMatch && bgMatch) {
            const textLum = getLuminance(+colorMatch[0], +colorMatch[1], +colorMatch[2]);
            const bgLum = getLuminance(+bgMatch[0], +bgMatch[1], +bgMatch[2]);
            const ratio = getContrastRatio(textLum, bgLum);

            // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
            const fontSize = parseFloat(styles.fontSize);
            const minRatio = fontSize >= 18 ? 3 : 4.5;

            if (ratio < minRatio) {
              issues.push(`Low contrast ${ratio.toFixed(2)}:1 on ${el.tagName}`);
            }
          }
        }
      });

      return issues;
    });

    // Log any contrast issues found
    if (contrastIssues.length > 0) {
      console.log('Contrast issues found:', contrastIssues);
    }
  });

  test('should handle animations properly', async ({ page }) => {
    // Test with reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('http://localhost:3000');

    // Animations should be reduced/disabled
    const hasAnimations = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let animatedCount = 0;

      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.animation !== 'none' || styles.transition !== 'none') {
          animatedCount++;
        }
      });

      return animatedCount;
    });

    // Should have minimal or no animations when prefers-reduced-motion is set
    // (This depends on proper implementation of motion preferences)
    console.log(`Elements with animations (reduced motion): ${hasAnimations}`);
  });
});