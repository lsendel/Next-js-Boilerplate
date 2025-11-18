import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import { DashboardPage, HomePage, SignInPage, SignUpPage } from '../pages';
import { cleanupTestAuth } from '../helpers';

/**
 * Authentication Fixtures
 *
 * Provides pre-authenticated contexts and page objects for testing
 */

type AuthFixtures = {
  homePage: HomePage;
  signInPage: SignInPage;
  signUpPage: SignUpPage;
  dashboardPage: DashboardPage;
  authenticatedPage: Page;
};

/**
 * Extended test with authentication fixtures
 */
export const test = base.extend<AuthFixtures>({
  /**
   * Home Page Object instance
   */
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  /**
   * Sign-In Page Object instance
   */
  signInPage: async ({ page }, use) => {
    const signInPage = new SignInPage(page);
    await use(signInPage);
  },

  /**
   * Sign-Up Page Object instance
   */
  signUpPage: async ({ page }, use) => {
    const signUpPage = new SignUpPage(page);
    await use(signUpPage);
  },

  /**
   * Dashboard Page Object instance
   */
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  /**
   * Pre-authenticated page context
   * Use this when tests need to start already signed in
   *
   * This fixture creates a unique user for each test and signs them in.
   * Test isolation is ensured by cleaning up before creating the session.
   */
  authenticatedPage: async ({ page }, use) => {
    // Clean up any existing auth state before creating new session
    await cleanupTestAuth(page);

    // Create unique credentials for this test
    const timestamp = Date.now();
    const email = `test-user-${timestamp}@example.com`;
    const password = 'TestPassword123!';

    // Sign up the user
    await page.goto('/sign-up');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    const confirmPasswordInput = page.locator('input[name="confirm-password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await emailInput.fill(email);
    await passwordInput.fill(password);

    // Fill confirm password if it exists
    const hasConfirmPassword = await confirmPasswordInput.isVisible().catch(() => false);
    if (hasConfirmPassword) {
      await confirmPasswordInput.fill(password);
    }

    await submitButton.click();

    // Wait for redirect to dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Wait for critical dashboard elements to be fully rendered
    // This ensures React hydration is complete before tests run
    const mainNav = page.getByRole('navigation', { name: /main/i }).or(page.locator('nav').first());
    await mainNav.waitFor({ state: 'visible', timeout: 5000 });

    // Wait a bit more for any async data loading
    await page.waitForTimeout(500);

    // Provide the authenticated page to the test
    await use(page);

    // Cleanup after test completes
    await cleanupTestAuth(page);
  },
});

export { expect } from '@playwright/test';
