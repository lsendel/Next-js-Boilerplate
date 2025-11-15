import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Dashboard Page Object
 *
 * Represents the user dashboard page
 */
export class DashboardPage extends BasePage {
  // Locators
  readonly welcomeMessage: Locator;
  readonly userEmail: Locator;
  readonly navigation: Locator;
  readonly signOutButton: Locator;
  readonly userProfileLink: Locator;
  readonly settingsLink: Locator;
  readonly counterSection: Locator;
  readonly counterValue: Locator;
  readonly incrementButton: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.welcomeMessage = page.getByText(/welcome|hello/i).first();
    this.userEmail = page.locator('[data-testid="user-email"]');
    this.navigation = page.locator('nav');
    this.signOutButton = page.getByRole('button', { name: /sign out|log out/i });
    this.userProfileLink = page.getByRole('link', { name: /profile|account/i });
    this.settingsLink = page.getByRole('link', { name: /settings/i });
    this.counterSection = page.locator('[data-testid="counter"]');
    this.counterValue = page.locator('[data-testid="counter-value"]');
    this.incrementButton = page.getByRole('button', { name: /increment/i });
  }

  /**
   * Navigate to dashboard page
   */
  async visit(locale = 'en'): Promise<void> {
    await this.goto(`/${locale}/dashboard`);
  }

  /**
   * Click sign-out button
   */
  async signOut(): Promise<void> {
    await this.click(this.signOutButton);
  }

  /**
   * Navigate to user profile
   */
  async goToProfile(): Promise<void> {
    await this.click(this.userProfileLink);
  }

  /**
   * Navigate to settings
   */
  async goToSettings(): Promise<void> {
    await this.click(this.settingsLink);
  }

  /**
   * Get current counter value
   */
  async getCounterValue(): Promise<number> {
    const text = await this.getText(this.counterValue);
    return Number.parseInt(text, 10);
  }

  /**
   * Increment counter
   */
  async incrementCounter(): Promise<void> {
    await this.click(this.incrementButton);
    // Wait for counter to update
    await this.page.waitForTimeout(500);
  }

  /**
   * Increment counter multiple times
   */
  async incrementCounterBy(times: number): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.incrementCounter();
    }
  }

  /**
   * Get welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    return this.getText(this.welcomeMessage);
  }

  /**
   * Get user email from dashboard
   */
  async getUserEmail(): Promise<string> {
    return this.getText(this.userEmail);
  }

  /**
   * Assert dashboard is loaded
   */
  async assertLoaded(): Promise<void> {
    await this.assertVisible(this.navigation, 'Navigation should be visible');
    await this.assertVisible(this.welcomeMessage, 'Welcome message should be visible');
  }

  /**
   * Assert user is signed in
   */
  async assertSignedIn(email?: string): Promise<void> {
    await this.assertLoaded();
    await this.assertVisible(this.signOutButton, 'Sign out button should be visible');

    if (email) {
      const displayedEmail = await this.getUserEmail();
      if (!displayedEmail.includes(email)) {
        throw new Error(`Expected email ${email}, but got ${displayedEmail}`);
      }
    }
  }

  /**
   * Assert counter value
   */
  async assertCounterValue(expectedValue: number): Promise<void> {
    const actualValue = await this.getCounterValue();
    if (actualValue !== expectedValue) {
      throw new Error(`Expected counter value ${expectedValue}, but got ${actualValue}`);
    }
  }
}
