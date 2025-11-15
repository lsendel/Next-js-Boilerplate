import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Sign-Up Page Object
 *
 * Represents the sign-up/registration page
 */
export class SignUpPage extends BasePage {
  // Locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly signInLink: Locator;
  readonly termsCheckbox: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/^password/i).first();
    this.confirmPasswordInput = page.getByLabel(/confirm password/i);
    this.firstNameInput = page.getByLabel(/first name/i);
    this.lastNameInput = page.getByLabel(/last name/i);
    this.submitButton = page.getByRole('button', { name: /sign up|create account|register/i });
    this.errorMessage = page.locator('[role="alert"][class*="error"]').first();
    this.successMessage = page.locator('[role="alert"][class*="success"]').first();
    this.signInLink = page.getByRole('link', { name: /sign in|log in/i });
    this.termsCheckbox = page.getByLabel(/terms|privacy/i);
  }

  /**
   * Navigate to sign-up page
   */
  async visit(locale = 'en'): Promise<void> {
    await this.goto(`/${locale}/sign-up`);
  }

  /**
   * Fill in sign-up form
   */
  async fillSignUpForm(data: {
    email: string;
    password: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
  }): Promise<void> {
    await this.fill(this.emailInput, data.email);
    await this.fill(this.passwordInput, data.password);

    if (data.confirmPassword && await this.isVisible(this.confirmPasswordInput)) {
      await this.fill(this.confirmPasswordInput, data.confirmPassword);
    }

    if (data.firstName && await this.isVisible(this.firstNameInput)) {
      await this.fill(this.firstNameInput, data.firstName);
    }

    if (data.lastName && await this.isVisible(this.lastNameInput)) {
      await this.fill(this.lastNameInput, data.lastName);
    }
  }

  /**
   * Accept terms and conditions
   */
  async acceptTerms(): Promise<void> {
    if (await this.isVisible(this.termsCheckbox)) {
      await this.click(this.termsCheckbox);
    }
  }

  /**
   * Submit sign-up form
   */
  async submit(): Promise<void> {
    await this.click(this.submitButton);
  }

  /**
   * Sign up with full data
   */
  async signUp(data: {
    email: string;
    password: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
    acceptTerms?: boolean;
  }): Promise<void> {
    await this.fillSignUpForm(data);

    if (data.acceptTerms) {
      await this.acceptTerms();
    }

    await this.submit();
  }

  /**
   * Click sign-in link
   */
  async clickSignIn(): Promise<void> {
    await this.click(this.signInLink);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    return this.getText(this.successMessage);
  }

  /**
   * Assert error message is displayed
   */
  async assertErrorMessage(expectedMessage: string | RegExp): Promise<void> {
    await this.assertVisible(this.errorMessage, 'Error message should be visible');
    await this.assertHasText(this.errorMessage, expectedMessage);
  }

  /**
   * Assert success message is displayed
   */
  async assertSuccessMessage(expectedMessage: string | RegExp): Promise<void> {
    await this.assertVisible(this.successMessage, 'Success message should be visible');
    await this.assertHasText(this.successMessage, expectedMessage);
  }

  /**
   * Assert sign-up page is loaded
   */
  async assertLoaded(): Promise<void> {
    await this.assertVisible(this.emailInput, 'Email input should be visible');
    await this.assertVisible(this.passwordInput, 'Password input should be visible');
    await this.assertVisible(this.submitButton, 'Submit button should be visible');
  }
}
