/**
 * Example E2E test using the Test Authentication Adapter
 *
 * To run this test:
 * 1. Set NEXT_PUBLIC_AUTH_PROVIDER=test in your .env file
 * 2. Restart the dev server: npm run dev
 * 3. Run the test: npm run test:e2e
 *
 * NOTE: This test is named .example.e2e.ts so it won't run by default.
 * Rename to .e2e.ts to include it in your test suite.
 */

import { expect, test } from '@playwright/test';

test.describe('Test Adapter Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Start fresh on each test
    // Note: In-memory storage is cleared on server restart
    await page.goto('/');
  });

  test('should sign up a new user', async ({ page }) => {
    const timestamp = Date.now();
    const email = `test-${timestamp}@example.com`;

    // Navigate to sign up page
    await page.goto('/sign-up');

    // Fill in the form
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'testpassword123');
    await page.fill('input[name="confirm-password"]', 'testpassword123');

    // Submit the form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard after successful sign up
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should show error for weak password', async ({ page }) => {
    await page.goto('/sign-up');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'weak'); // Less than 8 characters
    await page.fill('input[name="confirm-password"]', 'weak');

    await page.click('button[type="submit"]');

    // Should show error message
    const errorAlert = page.locator('div[role="alert"]');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('Password must be at least 8 characters');
  });

  test('should show error for mismatched passwords', async ({ page }) => {
    await page.goto('/sign-up');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'testpassword123');
    await page.fill('input[name="confirm-password"]', 'different123');

    await page.click('button[type="submit"]');

    // Should show error message
    const errorAlert = page.locator('div[role="alert"]');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('Passwords do not match');
  });

  test('should sign in with existing user', async ({ page }) => {
    const timestamp = Date.now();
    const email = `test-${timestamp}@example.com`;
    const password = 'testpassword123';

    // First, sign up
    await page.goto('/sign-up');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirm-password"]', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Sign out
    await page.click('text=Sign Out');

    // Now sign in
    await page.goto('/sign-in');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/sign-in');

    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error message
    const errorAlert = page.locator('div[role="alert"]');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('Invalid email or password');
  });

  test('should protect dashboard route', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard');

    // Should redirect to sign in page
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('should sign out successfully', async ({ page }) => {
    const timestamp = Date.now();
    const email = `test-${timestamp}@example.com`;

    // Sign up
    await page.goto('/sign-up');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'testpassword123');
    await page.fill('input[name="confirm-password"]', 'testpassword123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Sign out
    await page.click('text=Sign Out');

    // Should redirect to home page
    await expect(page).toHaveURL('/');

    // Trying to access dashboard should redirect to sign in
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('should navigate between sign in and sign up', async ({ page }) => {
    // Start at sign in page
    await page.goto('/sign-in');

    // Click sign up link
    await page.click('text=Sign up');
    await expect(page).toHaveURL(/\/sign-up/);

    // Click sign in link
    await page.click('text=Sign in');
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('should show user profile', async ({ page }) => {
    const timestamp = Date.now();
    const email = `test-${timestamp}@example.com`;

    // Sign up
    await page.goto('/sign-up');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'testpassword123');
    await page.fill('input[name="confirm-password"]', 'testpassword123');
    await page.click('button[type="submit"]');

    // Navigate to user profile
    await page.goto('/dashboard/user-profile');

    // Check that email is displayed
    await expect(page.locator('text=' + email)).toBeVisible();
  });
});
