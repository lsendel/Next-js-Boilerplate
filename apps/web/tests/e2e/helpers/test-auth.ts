import type { Page } from '@playwright/test';

/**
 * Test Authentication Helpers
 *
 * Utilities for managing test authentication state between tests
 */

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

/**
 * Reset test auth storage
 *
 * Clears all users from the in-memory test auth storage.
 * This should be called between tests to ensure clean state.
 *
 * @param page - Playwright Page object
 * @returns Promise that resolves when storage is cleared
 */
export async function resetTestAuthStorage(page: Page): Promise<void> {
  const response = await page.request.post(`${BASE_URL}/api/test-auth/reset`);

  if (!response.ok()) {
    const text = await response.text();
    console.warn(`Failed to reset test auth storage: ${response.status()} - ${text}`);
  }
}

/**
 * Clear all cookies for the current context
 *
 * This ensures no session cookies persist between tests.
 *
 * @param page - Playwright Page object
 * @returns Promise that resolves when cookies are cleared
 */
export async function clearAllCookies(page: Page): Promise<void> {
  await page.context().clearCookies();
}

/**
 * Full test auth cleanup
 *
 * Performs both storage reset and cookie clearing.
 * Recommended to call this in test.afterEach() or test.beforeEach().
 *
 * @param page - Playwright Page object
 * @returns Promise that resolves when cleanup is complete
 */
export async function cleanupTestAuth(page: Page): Promise<void> {
  await Promise.all([
    resetTestAuthStorage(page),
    clearAllCookies(page),
  ]);
}
