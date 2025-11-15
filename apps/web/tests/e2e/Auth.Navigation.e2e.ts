import { expect, test } from '@playwright/test';

/**
 * Authentication Navigation & Page Content Tests
 * Validates all auth pages render correctly with proper content
 */

test.describe('Authentication Navigation & Page Content', () => {
  test.beforeEach(async ({ page }) => {
    // Start from homepage
    await page.goto('/');
  });

  test.describe('Sign-In Page', () => {
    test('should render sign-in page with form elements', async ({ page }) => {
      // Navigate to sign-in
      await page.goto('/sign-in');

      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Take screenshot for visual inspection
      await page.screenshot({ path: 'test-results/signin-page.png', fullPage: true });

      // Check page title
      await expect(page).toHaveTitle(/Sign.?In/i);

      // Check for sign-in form elements
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"], input[name="password"]');
      const submitButton = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Sign In"), button:has-text("Login")');

      // Verify elements are visible
      await expect(emailInput).toBeVisible({ timeout: 10000 });
      await expect(passwordInput).toBeVisible({ timeout: 10000 });
      await expect(submitButton).toBeVisible({ timeout: 10000 });

      // Check for heading
      const heading = page.locator('h1, h2').filter({ hasText: /sign.?in/i }).first();
      await expect(heading).toBeVisible();

      // Check URL
      expect(page.url()).toContain('/sign-in');

      // Verify page is not empty
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();
      expect(bodyText!.length).toBeGreaterThan(50);
    });

    test('should have link to sign-up page', async ({ page }) => {
      await page.goto('/sign-in');
      await page.waitForLoadState('networkidle');

      // Look for sign-up link
      const signUpLink = page.locator('a[href*="sign-up"], a:has-text("Sign up"), a:has-text("Register"), a:has-text("Create account")');
      await expect(signUpLink.first()).toBeVisible({ timeout: 10000 });

      // Click and verify navigation
      await signUpLink.first().click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/sign-up');
    });
  });

  test.describe('Sign-Up Page', () => {
    test('should render sign-up page with form elements', async ({ page }) => {
      // Navigate to sign-up
      await page.goto('/sign-up');

      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Take screenshot
      await page.screenshot({ path: 'test-results/signup-page.png', fullPage: true });

      // Check page title
      await expect(page).toHaveTitle(/Sign.?Up|Register/i);

      // Check for sign-up form elements
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
      const submitButton = page.locator('button[type="submit"], button:has-text("Sign up"), button:has-text("Sign Up"), button:has-text("Register"), button:has-text("Create account")');

      // Verify elements are visible
      await expect(emailInput).toBeVisible({ timeout: 10000 });
      await expect(passwordInput).toBeVisible({ timeout: 10000 });
      await expect(submitButton).toBeVisible({ timeout: 10000 });

      // Check for heading
      const heading = page.locator('h1, h2').filter({ hasText: /sign.?up|register|create/i }).first();
      await expect(heading).toBeVisible();

      // Check URL
      expect(page.url()).toContain('/sign-up');

      // Verify page is not empty
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();
      expect(bodyText!.length).toBeGreaterThan(50);
    });

    test('should have link to sign-in page', async ({ page }) => {
      await page.goto('/sign-up');
      await page.waitForLoadState('networkidle');

      // Look for sign-in link
      const signInLink = page.locator('a[href*="sign-in"], a:has-text("Sign in"), a:has-text("Login"), a:has-text("Already have an account")');
      await expect(signInLink.first()).toBeVisible({ timeout: 10000 });

      // Click and verify navigation
      await signInLink.first().click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/sign-in');
    });
  });

  test.describe('Dashboard Page (Protected)', () => {
    test('should redirect unauthenticated users to sign-in', async ({ page }) => {
      // Try to access dashboard without authentication
      await page.goto('/dashboard');

      // Wait for redirect
      await page.waitForLoadState('networkidle');

      // Should be redirected to sign-in
      expect(page.url()).toContain('/sign-in');
    });

    test('should be accessible after sign-in', async ({ page }) => {
      // First, sign up/sign in
      await page.goto('/sign-in');
      await page.waitForLoadState('networkidle');

      // Fill in credentials (test mode accepts any credentials)
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"], input[name="password"]');
      const submitButton = page.locator('button[type="submit"], button:has-text("Sign in")').first();

      await emailInput.fill(`test-${Date.now()}@example.com`);
      await passwordInput.fill('TestPassword123!');
      await submitButton.click();

      // Wait for navigation
      await page.waitForLoadState('networkidle');

      // Should be redirected to dashboard or should be able to navigate there
      if (!page.url().includes('/dashboard')) {
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
      }

      // Verify we're on dashboard
      expect(page.url()).toContain('/dashboard');

      // Take screenshot
      await page.screenshot({ path: 'test-results/dashboard-page.png', fullPage: true });

      // Verify page is not empty
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();
      expect(bodyText!.length).toBeGreaterThan(50);

      // Check for dashboard-specific content
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });
  });

  test.describe('User Profile Page', () => {
    test('should be accessible after authentication', async ({ page }) => {
      // Sign in first
      await page.goto('/sign-in');
      await page.waitForLoadState('networkidle');

      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"], input[name="password"]');
      const submitButton = page.locator('button[type="submit"]').first();

      await emailInput.fill(`test-profile-${Date.now()}@example.com`);
      await passwordInput.fill('TestPassword123!');
      await submitButton.click();
      await page.waitForLoadState('networkidle');

      // Navigate to user profile
      await page.goto('/dashboard/user-profile');
      await page.waitForLoadState('networkidle');

      // Take screenshot
      await page.screenshot({ path: 'test-results/user-profile-page.png', fullPage: true });

      // Verify we're on user profile page
      expect(page.url()).toContain('/user-profile');

      // Verify page is not empty
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();
      expect(bodyText!.length).toBeGreaterThan(50);
    });
  });

  test.describe('Navigation Flow', () => {
    test('should navigate through all public pages', async ({ page }) => {
      // Homepage
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      let bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();
      expect(bodyText!.length).toBeGreaterThan(50);

      // About page
      await page.goto('/about');
      await page.waitForLoadState('networkidle');
      bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();

      // Features page
      await page.goto('/features');
      await page.waitForLoadState('networkidle');
      bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();

      // Portfolio page
      await page.goto('/portfolio');
      await page.waitForLoadState('networkidle');
      bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();

      // Pricing page
      await page.goto('/pricing');
      await page.waitForLoadState('networkidle');
      bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();

      // Contact page
      await page.goto('/contact');
      await page.waitForLoadState('networkidle');
      bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();
    });

    test('should navigate through full auth flow', async ({ page }) => {
      // 1. Start at homepage
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/');

      // 2. Go to sign-up
      await page.goto('/sign-up');
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/sign-up');

      const bodyText1 = await page.locator('body').textContent();
      expect(bodyText1).toBeTruthy();
      expect(bodyText1!.length).toBeGreaterThan(50);

      // 3. Navigate to sign-in from sign-up
      const signInLink = page.locator('a[href*="sign-in"]').first();
      if (await signInLink.isVisible()) {
        await signInLink.click();
        await page.waitForLoadState('networkidle');
      } else {
        await page.goto('/sign-in');
      }

      expect(page.url()).toContain('/sign-in');

      const bodyText2 = await page.locator('body').textContent();
      expect(bodyText2).toBeTruthy();
      expect(bodyText2!.length).toBeGreaterThan(50);

      // 4. Sign in
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"], input[name="password"]');
      const submitButton = page.locator('button[type="submit"]').first();

      await emailInput.fill(`test-navigation-${Date.now()}@example.com`);
      await passwordInput.fill('TestPassword123!');
      await submitButton.click();
      await page.waitForLoadState('networkidle');

      // 5. Should be on dashboard or redirect there
      if (!page.url().includes('/dashboard')) {
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
      }

      expect(page.url()).toContain('/dashboard');

      const bodyText3 = await page.locator('body').textContent();
      expect(bodyText3).toBeTruthy();
      expect(bodyText3!.length).toBeGreaterThan(50);

      // 6. Visit user profile
      await page.goto('/dashboard/user-profile');
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/user-profile');

      const bodyText4 = await page.locator('body').textContent();
      expect(bodyText4).toBeTruthy();
      expect(bodyText4!.length).toBeGreaterThan(50);

      // 7. Sign out
      const signOutButton = page.locator('button:has-text("Sign out"), button:has-text("Logout"), a:has-text("Sign out")');
      if (await signOutButton.isVisible()) {
        await signOutButton.first().click();
        await page.waitForLoadState('networkidle');

        // Should be redirected to homepage or sign-in
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/(sign-in)?$/);
      }
    });
  });

  test.describe('Locale Support', () => {
    test('should render sign-in page in English', async ({ page }) => {
      await page.goto('/en/sign-in');
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/en/sign-in');

      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();
      expect(bodyText!.length).toBeGreaterThan(50);
    });

    test('should render sign-in page in French', async ({ page }) => {
      await page.goto('/fr/sign-in');
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/fr/sign-in');

      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();
      expect(bodyText!.length).toBeGreaterThan(50);
    });
  });
});
