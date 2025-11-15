import type { Page } from '@playwright/test';

/**
 * Test Helpers
 *
 * Common utility functions for E2E tests
 */

/**
 * Generate unique email for testing
 */
export function generateTestEmail(prefix = 'test'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${prefix}-${timestamp}-${random}@example.com`;
}

/**
 * Generate strong password for testing
 */
export function generateTestPassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';

  // Ensure at least one of each required character type
  password += 'A'; // Uppercase
  password += 'a'; // Lowercase
  password += '1'; // Number
  password += '!'; // Special

  // Fill remaining length
  for (let i = password.length; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Generate test user data
 */
export function generateTestUser() {
  return {
    email: generateTestEmail(),
    password: generateTestPassword(),
    firstName: `Test${Math.random().toString(36).substring(7)}`,
    lastName: `User${Math.random().toString(36).substring(7)}`,
  };
}

/**
 * Wait for network to be idle
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  try {
    await page.waitForLoadState('networkidle', { timeout });
  }
  catch {
    // Network idle timeout is acceptable
  }
}

/**
 * Clear browser storage
 */
export async function clearStorage(page: Page): Promise<void> {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Set localStorage item
 */
export async function setLocalStorage(page: Page, key: string, value: string): Promise<void> {
  await page.evaluate(
    ({ k, v }) => {
      localStorage.setItem(k, v);
    },
    { k: key, v: value },
  );
}

/**
 * Get localStorage item
 */
export async function getLocalStorage(page: Page, key: string): Promise<string | null> {
  return page.evaluate((k) => {
    return localStorage.getItem(k);
  }, key);
}

/**
 * Wait for element to disappear
 */
export async function waitForElementToDisappear(
  page: Page,
  selector: string,
  timeout = 5000,
): Promise<void> {
  await page.waitForSelector(selector, { state: 'hidden', timeout });
}

/**
 * Take screenshot on failure
 */
export async function screenshotOnFailure(page: Page, testName: string): Promise<void> {
  const timestamp = Date.now();
  const filename = `failure-${testName}-${timestamp}.png`;
  await page.screenshot({ path: `test-results/${filename}`, fullPage: true });
}

/**
 * Mock API response
 */
export async function mockApiResponse(
  page: Page,
  url: string | RegExp,
  response: object,
  status = 200,
): Promise<void> {
  await page.route(url, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

/**
 * Intercept API request
 */
export async function interceptApiRequest(
  page: Page,
  url: string | RegExp,
): Promise<Promise<any>> {
  return new Promise((resolve) => {
    page.route(url, async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();
      resolve(postData);
      await route.continue();
    });
  });
}

/**
 * Wait for API response
 */
export async function waitForApiResponse(
  page: Page,
  url: string | RegExp,
  timeout = 10000,
): Promise<any> {
  const response = await page.waitForResponse(url, { timeout });
  return response.json();
}

/**
 * Retry action until success or max attempts
 */
export async function retryAction<T>(
  action: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 1000,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await action();
    }
    catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}

/**
 * Check if running in CI environment
 */
export function isCI(): boolean {
  return !!process.env.CI;
}

/**
 * Get test timeout based on environment
 */
export function getTestTimeout(): number {
  return isCI() ? 30000 : 60000;
}
