/**
 * Auth Service
 *
 * Handles authentication-specific business logic
 * Session management, security checks, token validation
 */

import { randomBytes } from 'node:crypto';
import * as sessionRepo from '@/server/db/repositories/session.repository';
import * as userRepo from '@/server/db/repositories/user.repository';
import { logger } from '@/libs/Logger';
import { checkAuthRateLimit } from '@/libs/auth/security/rate-limit';
import type { NewSession, Session } from '@/server/db/repositories/session.repository';
import type { User } from '@/server/db/repositories/user.repository';
import type { RateLimitResult } from '@/libs/auth/security/rate-limit';

// Security logger instance - wraps standard logger with security-specific methods
const securityLogger = {
  logAuthSuccess: (userId: number, email: string, ip: string) => {
    logger.info('Authentication successful', { userId, email, ip, event: 'auth_success' });
  },
  logAuthFailure: (email: string, ip: string, reason: string) => {
    logger.warn('Authentication failed', { email, ip, reason, event: 'auth_failure' });
  },
  logPasswordChanged: (userId: number, email: string, ip: string) => {
    logger.info('Password changed', { userId, email, ip, event: 'password_change' });
  },
  logPasswordResetRequest: (email: string, ip: string) => {
    logger.info('Password reset requested', { email, ip, event: 'password_reset_request' });
  },
  logSuspiciousActivity: (message: string, ip: string, details: Record<string, unknown>) => {
    logger.warn('Suspicious activity detected', { message, ip, details, event: 'suspicious_activity' });
  },
};

/**
 * Client information for session tracking
 */
export type ClientInfo = {
  ipAddress?: string;
  userAgent?: string;
  deviceFingerprint?: string;
};

/**
 * Auth Service Class
 *
 * Handles all authentication-related operations
 */
export class AuthService {
  /**
   * Create a new session for a user
   *
   * @param userId - User ID
   * @param clientInfo - Client information for tracking
   * @returns Created session
   */
  async createSession(
    userId: number,
    clientInfo: ClientInfo = {},
  ): Promise<Session> {
    const sessionData: NewSession = {
      userId,
      sessionToken: this.generateSessionToken(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
      deviceFingerprint: clientInfo.deviceFingerprint,
    };

    return await sessionRepo.createSession(sessionData);
  }

  /**
   * Validate a session token
   *
   * Checks if session exists, is not expired, and user is active
   *
   * @param token - Session token
   * @returns User if session is valid, null otherwise
   */
  async validateSession(token: string): Promise<User | null> {
    // 1. Find session
    const session = await sessionRepo.findSessionByToken(token);

    if (!session) {
      return null;
    }

    // 2. Check if session is expired
    if (session.expiresAt < new Date()) {
      // Clean up expired session
      await sessionRepo.deleteSession(session.id);
      return null;
    }

    // 3. Get user
    const user = await userRepo.findUserById(session.userId);

    if (!user || !user.isActive) {
      return null;
    }

    // 4. Update last activity
    await sessionRepo.updateActivity(session.id);

    return user;
  }

  /**
   * Refresh a session (extend expiration)
   *
   * @param token - Current session token
   * @returns New session with extended expiration
   */
  async refreshSession(token: string): Promise<Session | null> {
    const session = await sessionRepo.findSessionByToken(token);

    if (!session) {
      return null;
    }

    // Check if session is still valid
    if (session.expiresAt < new Date()) {
      await sessionRepo.deleteSession(session.id);
      return null;
    }

    // Extend expiration by 30 days
    const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return await sessionRepo.extendSession(session.id, newExpiresAt);
  }

  /**
   * Destroy a session (logout)
   *
   * @param token - Session token to destroy
   * @returns True if session was destroyed
   */
  async destroySession(token: string): Promise<boolean> {
    return await sessionRepo.deleteSessionByToken(token);
  }

  /**
   * Destroy all sessions for a user
   *
   * Useful for "logout from all devices"
   *
   * @param userId - User ID
   * @returns Number of sessions destroyed
   */
  async destroyAllSessions(userId: number): Promise<number> {
    return await sessionRepo.deleteSessionsByUserId(userId);
  }

  /**
   * Get all active sessions for a user
   *
   * @param userId - User ID
   * @returns List of active sessions
   */
  async getUserSessions(userId: number): Promise<Session[]> {
    return await sessionRepo.getActiveSessions(userId);
  }

  /**
   * Destroy all sessions except the current one
   *
   * @param userId - User ID
   * @param currentSessionId - Current session to keep
   * @returns Number of sessions destroyed
   */
  async destroyOtherSessions(
    userId: number,
    currentSessionId: number,
  ): Promise<number> {
    return await sessionRepo.deleteAllButCurrent(userId, currentSessionId);
  }

  /**
   * Check rate limit for authentication operations
   *
   * @param identifier - IP address or user identifier
   * @param action - Type of action (signIn, signUp, etc.)
   * @returns Rate limit status
   */
  async checkRateLimit(
    identifier: string,
    action: 'signIn' | 'signUp' | 'passwordReset' | 'mfaVerify' | 'oauthCallback',
  ): Promise<RateLimitResult> {
    return await checkAuthRateLimit(identifier, action);
  }

  /**
   * Record a failed login attempt
   *
   * @param email - Email attempted
   * @param ip - IP address
   */
  async recordFailedLogin(email: string, ip: string): Promise<void> {
    await securityLogger.logAuthFailure(email, ip, 'Invalid credentials');

    // In a production system, you might want to:
    // - Increment failed attempt counter in database
    // - Trigger account lockout after X failed attempts
    // - Send security alert email to user
  }

  /**
   * Check if account is locked
   *
   * @param email - Email to check
   * @returns True if account is locked
   */
  async checkAccountLocked(email: string): Promise<boolean> {
    const user = await userRepo.findUserByEmail(email);

    if (!user) {
      return false;
    }

    // Check if user is inactive (could be locked)
    if (!user.isActive) {
      return true;
    }

    // TODO: Implement actual account locking mechanism
    // This could involve:
    // - Checking failed_login_attempts table
    // - Checking lockout_until timestamp
    // - Automatic unlocking after timeout

    return false;
  }

  /**
   * Clean up expired sessions
   *
   * Should be run periodically (e.g., via cron job)
   *
   * @returns Number of sessions deleted
   */
  async cleanupExpiredSessions(): Promise<number> {
    return await sessionRepo.deleteExpiredSessions();
  }

  /**
   * Get session by token
   *
   * @param token - Session token
   * @returns Session if found
   */
  async getSession(token: string): Promise<Session | null> {
    return await sessionRepo.findSessionByToken(token);
  }

  /**
   * Check if a session is valid (exists and not expired)
   *
   * @param token - Session token
   * @returns True if valid
   */
  async isSessionValid(token: string): Promise<boolean> {
    return await sessionRepo.isSessionValid(token);
  }

  /**
   * Generate a secure session token
   */
  private generateSessionToken(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Get statistics about sessions
   *
   * @returns Session statistics
   */
  async getSessionStats(): Promise<{
    total: number;
    active: number;
  }> {
    const total = await sessionRepo.getSessionCount();
    const active = await sessionRepo.getActiveSessionCount();

    return { total, active };
  }
}

/**
 * Create a singleton instance of AuthService
 */
export const authService = new AuthService();
