/**
 * Email Service
 *
 * Handles email sending functionality
 */

import { logger } from '@/libs/Logger';

export type EmailTemplate = 'welcome' | 'password-reset' | 'verification';

export type EmailOptions = {
  to: string;
  subject: string;
  template: EmailTemplate;
  data: Record<string, unknown>;
};

/**
 * Generate HTML content for email templates
 */
function generateEmailHtml(template: EmailTemplate, data: Record<string, unknown>): string {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Next.js Boilerplate';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  switch (template) {
    case 'welcome':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome to ${appName}!</h1>
          <p>Hi ${data.name},</p>
          <p>Thank you for signing up. We're excited to have you on board!</p>
          <p>Get started by exploring your dashboard:</p>
          <a href="${appUrl}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The ${appName} Team</p>
        </div>
      `;
    case 'password-reset':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Password Reset Request</h1>
          <p>Hi there,</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <a href="${appUrl}/reset-password?token=${data.resetToken}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>This link will expire in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The ${appName} Team</p>
        </div>
      `;
    case 'verification':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Verify Your Email</h1>
          <p>Hi there,</p>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${appUrl}/verify?token=${data.verificationToken}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
          <p>If you didn't create an account, please ignore this email.</p>
          <p>Best regards,<br>The ${appName} Team</p>
        </div>
      `;
    default:
      return `<p>${JSON.stringify(data)}</p>`;
  }
}

/**
 * Send an email using the configured provider (Resend)
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const { to, subject, template, data } = options;

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@example.com';

  // Development mode: just log the email
  if (!apiKey || process.env.NODE_ENV === 'development') {
    logger.info('Email would be sent (development mode)', {
      template,
      to,
      subject,
      from: fromEmail,
      data,
    });
    return true;
  }

  try {
    // Dynamic import of Resend (optional dependency)
    let Resend;
    try {
      // @ts-expect-error - Optional dependency, install with: npm install resend
      const resendModule = await import('resend');
      Resend = resendModule.Resend;
    } catch {
      logger.warn('Resend package not installed. Email will be logged only.', {
        template,
        to,
        subject,
      });
      return true;
    }

    const resend = new Resend(apiKey);
    const htmlContent = generateEmailHtml(template, data);

    await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html: htmlContent,
    });

    logger.info('Email sent successfully', { template, to, subject });
    return true;
  } catch (error) {
    logger.error('Failed to send email', { template, to, subject, error });
    return false;
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(
  email: string,
  name: string,
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'Welcome to Our Platform!',
    template: 'welcome',
    data: { name },
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'Reset Your Password',
    template: 'password-reset',
    data: { resetToken },
  });
}

/**
 * Send email verification
 */
export async function sendVerificationEmail(
  email: string,
  verificationToken: string,
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'Verify Your Email',
    template: 'verification',
    data: { verificationToken },
  });
}
