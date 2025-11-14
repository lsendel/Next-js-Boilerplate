import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Home Page Object
 *
 * Represents the home/landing page of the application
 */
export class HomePage extends BasePage {
  // Locators
  readonly signInLink: Locator;
  readonly signUpLink: Locator;
  readonly hero: Locator;
  readonly features: Locator;
  readonly footer: Locator;
  readonly navigation: Locator;
  readonly localeSwitcher: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.signInLink = page.getByRole('link', { name: /sign in/i });
    this.signUpLink = page.getByRole('link', { name: /sign up/i });
    this.hero = page.locator('[class*="hero"]').first();
    this.features = page.locator('[class*="features"]').first();
    this.footer = page.locator('footer');
    this.navigation = page.locator('nav').first();
    this.localeSwitcher = page.locator('select[name="locale"]');
  }

  /**
   * Navigate to home page
   */
  async visit(locale = 'en'): Promise<void> {
    await this.goto(`/${locale}`);
  }

  /**
   * Click sign-in link
   */
  async clickSignIn(): Promise<void> {
    await this.click(this.signInLink);
  }

  /**
   * Click sign-up link
   */
  async clickSignUp(): Promise<void> {
    await this.click(this.signUpLink);
  }

  /**
   * Switch locale
   */
  async switchLocale(locale: string): Promise<void> {
    await this.localeSwitcher.selectOption(locale);
    await this.waitForPageLoad();
  }

  /**
   * Assert home page is loaded
   */
  async assertLoaded(): Promise<void> {
    await this.assertVisible(this.hero, 'Hero section should be visible');
    await this.assertVisible(this.navigation, 'Navigation should be visible');
  }

  /**
   * Get current locale from URL
   */
  getCurrentLocale(): string {
    const url = this.getCurrentURL();
    const match = url.match(/\/(en|fr)(\/|$)/);
    return match && match[1] ? match[1] : 'en';
  }
}
