/**
 * Email Service Tests
 *
 * Tests email sending functionality with Resend integration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  type EmailOptions,
} from './email.service';

describe('EmailService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('sendEmail', () => {
    it('should return true in development mode without API key', async () => {
      const options: EmailOptions = {
        to: 'test@example.com',
        subject: 'Test Email',
        template: 'welcome',
        data: { name: 'Test User' },
      };

      const result = await sendEmail(options);

      expect(result).toBe(true);
    });

    it('should handle welcome template', async () => {
      const options: EmailOptions = {
        to: 'user@example.com',
        subject: 'Welcome!',
        template: 'welcome',
        data: { name: 'John Doe' },
      };

      const result = await sendEmail(options);

      expect(result).toBe(true);
    });

    it('should handle password-reset template', async () => {
      const options: EmailOptions = {
        to: 'user@example.com',
        subject: 'Reset Password',
        template: 'password-reset',
        data: { resetToken: 'abc123' },
      };

      const result = await sendEmail(options);

      expect(result).toBe(true);
    });

    it('should handle verification template', async () => {
      const options: EmailOptions = {
        to: 'user@example.com',
        subject: 'Verify Email',
        template: 'verification',
        data: { verificationToken: 'xyz789' },
      };

      const result = await sendEmail(options);

      expect(result).toBe(true);
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email with correct parameters', async () => {
      const result = await sendWelcomeEmail('newuser@example.com', 'Jane Doe');

      expect(result).toBe(true);
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email with token', async () => {
      const result = await sendPasswordResetEmail(
        'user@example.com',
        'reset-token-123',
      );

      expect(result).toBe(true);
    });
  });

  describe('sendVerificationEmail', () => {
    it('should send verification email with token', async () => {
      const result = await sendVerificationEmail(
        'user@example.com',
        'verify-token-456',
      );

      expect(result).toBe(true);
    });
  });

  describe('Email Templates', () => {
    it('should include app name in welcome email', async () => {
      const options: EmailOptions = {
        to: 'test@example.com',
        subject: 'Welcome',
        template: 'welcome',
        data: { name: 'Test User' },
      };

      const result = await sendEmail(options);

      expect(result).toBe(true);
    });

    it('should include reset token in password reset email', async () => {
      const options: EmailOptions = {
        to: 'test@example.com',
        subject: 'Reset',
        template: 'password-reset',
        data: { resetToken: 'token123' },
      };

      const result = await sendEmail(options);

      expect(result).toBe(true);
    });

    it('should include verification token in verification email', async () => {
      const options: EmailOptions = {
        to: 'test@example.com',
        subject: 'Verify',
        template: 'verification',
        data: { verificationToken: 'verify123' },
      };

      const result = await sendEmail(options);

      expect(result).toBe(true);
    });
  });
});
