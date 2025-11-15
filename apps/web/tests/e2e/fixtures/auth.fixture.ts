import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import { DashboardPage, HomePage, SignInPage, SignUpPage } from '../pages';

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
   */
  authenticatedPage: async ({ page }, use) => {
    // TODO: Implement actual authentication once auth provider is configured
    // For now, this is a placeholder
    // In a real scenario, you would:
    // 1. Sign in via API or UI
    // 2. Store cookies/tokens
    // 3. Inject them into the page context

    // Example implementation:
    // const signInPage = new SignInPage(page);
    // await signInPage.visit();
    // await signInPage.signIn('test@example.com', 'password123');
    // await page.waitForURL(/.*\/dashboard/);

    await use(page);
  },
});

export { expect } from '@playwright/test';
