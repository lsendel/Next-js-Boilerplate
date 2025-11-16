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
    // Import test data generator dynamically
    const { generateUserCredentials } = await import('../test-data/generators');

    // Generate unique test user credentials
    const testUser = generateUserCredentials();

    // Authenticate via Test Auth API endpoints
    // This is faster than UI-based auth and more reliable

    // Step 1: Sign up the test user
    const signupResponse = await page.request.post('/api/test-auth/signup', {
      data: {
        email: testUser.email,
        password: testUser.password,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
      },
    });

    if (!signupResponse.ok()) {
      throw new Error(`Signup failed: ${signupResponse.status()} - ${await signupResponse.text()}`);
    }

    // Step 2: Sign in to get session cookie
    const signinResponse = await page.request.post('/api/test-auth/signin', {
      data: {
        email: testUser.email,
        password: testUser.password,
      },
    });

    if (!signinResponse.ok()) {
      throw new Error(`Sign-in failed: ${signinResponse.status()} - ${await signinResponse.text()}`);
    }

    // Step 3: Verify authentication by checking user endpoint
    const userResponse = await page.request.get('/api/test-auth/user');

    if (!userResponse.ok()) {
      throw new Error(`Authentication verification failed: ${userResponse.status()}`);
    }

    const userData = await userResponse.json();

    if (userData.email !== testUser.email) {
      throw new Error(`Authentication mismatch: expected ${testUser.email}, got ${userData.email}`);
    }

    // Session cookie is now set in the page context
    // Tests can proceed with authenticated state
    await use(page);
  },
});

export { expect } from '@playwright/test';
