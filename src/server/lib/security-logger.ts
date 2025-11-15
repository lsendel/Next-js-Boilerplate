/**
 * Centralized Security Logger
 *
 * Provides consistent security event logging across the application.
 * All security-related events should use this logger for audit trail.
 */

import { logger } from '@/libs/Logger';

/**
 * Security event logger with structured logging for audit trails
 */
export const securityLogger = {
  /**
   * Log successful authentication
   */
  logAuthSuccess: (userId: number, email: string, ip: string) => {
    logger.info('Authentication successful', {
      userId,
      email,
      ip,
      event: 'auth_success',
    });
  },

  /**
   * Log failed authentication attempt
   */
  logAuthFailure: (email: string, ip: string, reason: string) => {
    logger.warn('Authentication failed', {
      email,
      ip,
      reason,
      event: 'auth_failure',
    });
  },

  /**
   * Log password change event
   */
  logPasswordChanged: (userId: number, email: string, ip: string) => {
    logger.info('Password changed', {
      userId,
      email,
      ip,
      event: 'password_change',
    });
  },

  /**
   * Log password reset request
   */
  logPasswordResetRequest: (email: string, ip: string) => {
    logger.info('Password reset requested', {
      email,
      ip,
      event: 'password_reset_request',
    });
  },

  /**
   * Log suspicious activity for security monitoring
   */
  logSuspiciousActivity: (
    message: string,
    ip: string,
    details: Record<string, unknown>,
  ) => {
    logger.warn('Suspicious activity detected', {
      message,
      ip,
      details,
      event: 'suspicious_activity',
    });
  },

  /**
   * Log account lockout event
   */
  logAccountLockout: (userId: number, email: string, ip: string) => {
    logger.warn('Account locked due to failed login attempts', {
      userId,
      email,
      ip,
      event: 'account_lockout',
    });
  },

  /**
   * Log user registration
   */
  logUserRegistration: (userId: number, email: string, ip: string) => {
    logger.info('New user registered', {
      userId,
      email,
      ip,
      event: 'user_registration',
    });
  },

  /**
   * Log generic security error
   */
  error: (message: string, metadata: Record<string, unknown>) => {
    logger.error(message, { ...metadata, event: 'security_error' });
  },

  /**
   * Log generic security warning
   */
  warn: (message: string, metadata: Record<string, unknown>) => {
    logger.warn(message, { ...metadata, event: 'security_warning' });
  },

  /**
   * Log generic security info
   */
  info: (message: string, metadata: Record<string, unknown>) => {
    logger.info(message, { ...metadata, event: 'security_info' });
  },
} as const;
