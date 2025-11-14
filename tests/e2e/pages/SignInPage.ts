import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Sign-In Page Object
 *
 * Represents the sign-in/login page
 */
export class SignInPage extends BasePage {
  // Locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly signUpLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly csrfToken: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.submitButton = page.getByRole('button', { name: /sign in|log in/i });
    this.errorMessage = page.locator('[role="alert"]').first();
    this.signUpLink = page.getByRole('link', { name: /sign up|create account/i });
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
    this.csrfToken = page.locator('input[name="csrf_token"]');
  }

  /**
   * Navigate to sign-in page
   */
  async visit(locale = 'en'): Promise<void> {
    await this.goto(`/${locale}/sign-in`);
  }

  /**
   * Fill in sign-in form
   */
  async fillSignInForm(email: string, password: string): Promise<void> {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
  }

  /**
   * Submit sign-in form
   */
  async submit(): Promise<void> {
    await this.click(this.submitButton);
  }

  /**
   * Sign in with credentials
   */
  async signIn(email: string, password: string): Promise<void> {
    await this.fillSignInForm(email, password);
    await this.submit();
  }

  /**
   * Click sign-up link
   */
  async clickSignUp(): Promise<void> {
    await this.click(this.signUpLink);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  /**
   * Assert error message is displayed
   */
  async assertErrorMessage(expectedMessage: string | RegExp): Promise<void> {
    await this.assertVisible(this.errorMessage, 'Error message should be visible');
    await this.assertHasText(this.errorMessage, expectedMessage);
  }

  /**
   * Assert sign-in page is loaded
   */
  async assertLoaded(): Promise<void> {
    await this.assertVisible(this.emailInput, 'Email input should be visible');
    await this.assertVisible(this.passwordInput, 'Password input should be visible');
    await this.assertVisible(this.submitButton, 'Submit button should be visible');
  }

  /**
   * Check if CSRF token is present
   */
  async hasCsrfToken(): Promise<boolean> {
    return this.isVisible(this.csrfToken);
  }
}
