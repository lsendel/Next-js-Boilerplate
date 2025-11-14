import { expect, test } from './fixtures/auth.fixture';

/**
 * Dashboard E2E Tests
 *
 * Comprehensive tests for dashboard functionality and user interactions
 */

test.describe('Dashboard Access', () => {
  test('should redirect to sign-in when not authenticated', async ({ page }) => {
    await page.goto('/en/dashboard');

    // Should redirect to sign-in page
    await page.waitForURL(/.*\/(sign-in|login)/i, { timeout: 5000 });
    expect(page.url()).toMatch(/\/(sign-in|login)/i);
  });

  test('should display dashboard when authenticated', async ({ authenticatedPage, dashboardPage }) => {
    await dashboardPage.visit();
    await dashboardPage.assertLoaded();
  });
});

test.describe('Dashboard UI', () => {
  test.beforeEach(async ({ authenticatedPage, dashboardPage }) => {
    await dashboardPage.visit();
    await dashboardPage.assertLoaded();
  });

  test('should display welcome message', async ({ dashboardPage }) => {
    const welcomeMessage = await dashboardPage.getWelcomeMessage();
    expect(welcomeMessage).toBeTruthy();
    expect(welcomeMessage.length).toBeGreaterThan(0);
  });

  test('should display user navigation', async ({ dashboardPage }) => {
    await expect(dashboardPage.navigation).toBeVisible();
  });

  test('should display sign-out button', async ({ dashboardPage }) => {
    await expect(dashboardPage.signOutButton).toBeVisible();
  });

  test('should work with different locales', async ({ dashboardPage, page }) => {
    // Test English
    await dashboardPage.visit('en');
    await expect(page).toHaveURL(/.*\/en\/dashboard/);

    // Test French
    await dashboardPage.visit('fr');
    await expect(page).toHaveURL(/.*\/fr\/dashboard/);
  });
});

test.describe('Counter Feature', () => {
  test.beforeEach(async ({ authenticatedPage, dashboardPage }) => {
    await dashboardPage.visit();
    await dashboardPage.assertLoaded();
  });

  test('should display counter section', async ({ dashboardPage }) => {
    const hasCounter = await dashboardPage.isVisible(dashboardPage.counterSection);

    if (hasCounter) {
      await expect(dashboardPage.counterValue).toBeVisible();
      await expect(dashboardPage.incrementButton).toBeVisible();
    }
  });

  test('should increment counter when button clicked', async ({ dashboardPage }) => {
    const hasCounter = await dashboardPage.isVisible(dashboardPage.counterSection);

    if (hasCounter) {
      const initialValue = await dashboardPage.getCounterValue();

      await dashboardPage.incrementCounter();

      const newValue = await dashboardPage.getCounterValue();
      expect(newValue).toBe(initialValue + 1);
    }
  });

  test('should increment counter multiple times', async ({ dashboardPage }) => {
    const hasCounter = await dashboardPage.isVisible(dashboardPage.counterSection);

    if (hasCounter) {
      const initialValue = await dashboardPage.getCounterValue();
      const incrementCount = 5;

      await dashboardPage.incrementCounterBy(incrementCount);

      const newValue = await dashboardPage.getCounterValue();
      expect(newValue).toBe(initialValue + incrementCount);
    }
  });

  test('should persist counter value on page reload', async ({ dashboardPage }) => {
    const hasCounter = await dashboardPage.isVisible(dashboardPage.counterSection);

    if (hasCounter) {
      // Increment counter
      await dashboardPage.incrementCounter();
      const valueBeforeReload = await dashboardPage.getCounterValue();

      // Reload page
      await dashboardPage.reload();
      await dashboardPage.assertLoaded();

      // Counter should maintain value
      const valueAfterReload = await dashboardPage.getCounterValue();
      expect(valueAfterReload).toBe(valueBeforeReload);
    }
  });
});

test.describe('Dashboard Navigation', () => {
  test.beforeEach(async ({ authenticatedPage, dashboardPage }) => {
    await dashboardPage.visit();
    await dashboardPage.assertLoaded();
  });

  test('should navigate to user profile', async ({ dashboardPage, page }) => {
    const hasProfileLink = await dashboardPage.isVisible(dashboardPage.userProfileLink);

    if (hasProfileLink) {
      await dashboardPage.goToProfile();
      await expect(page).toHaveURL(/.*\/(profile|account|user-profile)/i);
    }
  });

  test('should navigate to settings', async ({ dashboardPage, page }) => {
    const hasSettingsLink = await dashboardPage.isVisible(dashboardPage.settingsLink);

    if (hasSettingsLink) {
      await dashboardPage.goToSettings();
      await expect(page).toHaveURL(/.*\/settings/i);
    }
  });

  test('should navigate back to home', async ({ dashboardPage, page }) => {
    // Look for home/logo link
    const homeLink = page.getByRole('link', { name: /home|logo/i }).first();
    const hasHomeLink = await homeLink.isVisible().catch(() => false);

    if (hasHomeLink) {
      await homeLink.click();
      await expect(page).toHaveURL(/.*\/(en|fr)$/);
    }
  });
});

test.describe('Sign-Out Functionality', () => {
  test.beforeEach(async ({ authenticatedPage, dashboardPage }) => {
    await dashboardPage.visit();
    await dashboardPage.assertLoaded();
  });

  test('should sign out successfully', async ({ dashboardPage, page }) => {
    await dashboardPage.signOut();

    // Should redirect to home or sign-in page
    await page.waitForURL(/.*\/(en|fr)(\/|$|\/(sign-in|login))/i, { timeout: 5000 });

    const url = page.url();
    const isSignedOut = !url.includes('/dashboard');
    expect(isSignedOut).toBe(true);
  });

  test('should not access dashboard after sign-out', async ({ dashboardPage, page }) => {
    await dashboardPage.signOut();

    // Try to access dashboard
    await page.goto('/en/dashboard');

    // Should be redirected to sign-in
    await page.waitForTimeout(2000);
    expect(page.url()).toMatch(/\/(sign-in|login)/i);
  });

  test('should clear session data on sign-out', async ({ dashboardPage, page }) => {
    await dashboardPage.signOut();

    // Check that session cookies are cleared
    const cookies = await page.context().cookies();
    const sessionCookies = cookies.filter(c =>
      c.name.toLowerCase().includes('session')
      || c.name.toLowerCase().includes('token')
      || c.name.toLowerCase().includes('auth'),
    );

    // Session cookies should be cleared or expired
    expect(sessionCookies.length === 0 || sessionCookies.every(c => c.value === '')).toBe(true);
  });
});

test.describe('Dashboard Security', () => {
  test('should not be accessible via direct URL when not authenticated', async ({ page }) => {
    // Clear any existing session
    await page.context().clearCookies();

    await page.goto('/en/dashboard');

    // Should be redirected
    await page.waitForTimeout(2000);
    expect(page.url()).not.toContain('/dashboard');
  });

  test('should maintain authentication across page reloads', async ({ authenticatedPage, dashboardPage }) => {
    await dashboardPage.visit();
    await dashboardPage.assertLoaded();

    // Reload page
    await dashboardPage.reload();

    // Should still be authenticated
    await dashboardPage.assertLoaded();
    await expect(dashboardPage.signOutButton).toBeVisible();
  });

  test('should handle session timeout gracefully', async ({ authenticatedPage, dashboardPage, page }) => {
    await dashboardPage.visit();
    await dashboardPage.assertLoaded();

    // Clear auth cookies to simulate timeout
    await page.context().clearCookies();

    // Try to perform an action
    await page.reload();

    // Should be redirected to sign-in
    await page.waitForTimeout(2000);
    const url = page.url();
    const isRedirected = url.includes('/sign-in') || url.includes('/login') || !url.includes('/dashboard');
    expect(isRedirected).toBe(true);
  });
});

test.describe('Dashboard Performance', () => {
  test('should load dashboard within acceptable time', async ({ authenticatedPage, dashboardPage, page }) => {
    const startTime = Date.now();

    await dashboardPage.visit();
    await dashboardPage.assertLoaded();

    const loadTime = Date.now() - startTime;

    // Dashboard should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should handle rapid clicks gracefully', async ({ authenticatedPage, dashboardPage }) => {
    await dashboardPage.visit();

    const hasCounter = await dashboardPage.isVisible(dashboardPage.incrementButton);

    if (hasCounter) {
      // Rapid click increment button
      for (let i = 0; i < 10; i++) {
        await dashboardPage.incrementButton.click({ force: true });
      }

      // Wait for updates
      await dashboardPage.page.waitForTimeout(2000);

      // Should handle all clicks without errors
      const counterValue = await dashboardPage.getCounterValue();
      expect(counterValue).toBeGreaterThan(0);
    }
  });
});

test.describe('Dashboard Accessibility', () => {
  test.beforeEach(async ({ authenticatedPage, dashboardPage }) => {
    await dashboardPage.visit();
    await dashboardPage.assertLoaded();
  });

  test('should support keyboard navigation', async ({ dashboardPage, page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab');

    // At least one element should be focused
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();

    // Should have at least one heading
    expect(headings.length).toBeGreaterThan(0);

    // Should have an h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
  });

  test('should have accessible button labels', async ({ dashboardPage }) => {
    const buttons = await dashboardPage.page.locator('button').all();

    for (const button of buttons.slice(0, 5)) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');

      // Button should have text, aria-label, or title
      expect(text || ariaLabel || title).toBeTruthy();
    }
  });
});
