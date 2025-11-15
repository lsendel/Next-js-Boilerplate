/**
 * User Service
 *
 * Business logic layer for user operations
 * Orchestrates repositories and implements domain rules
 */

import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import * as userRepo from '@/server/db/repositories/user.repository';
import * as sessionRepo from '@/server/db/repositories/session.repository';
import {
  checkPasswordBreach,
  validatePasswordStrength,
} from '@/libs/auth/security/password-breach';
import { logger } from '@/libs/Logger';
import { db } from '@/libs/DB';
import { passwordResetTokens } from '@/server/db/models/Schema';
import type { NewUser, User } from '@/server/db/repositories/user.repository';
import type { NewSession, Session } from '@/server/db/repositories/session.repository';

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
 * Hash password using bcrypt with 12 rounds (OWASP recommended)
 *
 * @param password - Plain text password
 * @returns Hashed password
 */
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12; // OWASP recommendation
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Verify password against hash using bcrypt
 *
 * @param password - Plain text password to verify
 * @param hash - Hashed password to compare against
 * @returns True if password matches
 */
const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate password reset token with expiration
 *
 * @returns Token and expiration date
 */
const generatePasswordResetToken = (): { token: string; expiresAt: Date } => {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  return { token, expiresAt };
};

/**
 * Custom error classes for better error handling
 */
export class UserServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = 'UserServiceError';
  }
}

export class ConflictError extends UserServiceError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
  }
}

export class ValidationError extends UserServiceError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class SecurityError extends UserServiceError {
  constructor(message: string) {
    super(message, 'SECURITY_ERROR', 403);
  }
}

export class NotFoundError extends UserServiceError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
  }
}

export class UnauthorizedError extends UserServiceError {
  constructor(message: string) {
    super(message, 'UNAUTHORIZED', 401);
  }
}

/**
 * Input types for service methods
 */
export type RegisterUserInput = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export type UpdateProfileInput = {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
};

export type ChangePasswordInput = {
  oldPassword: string;
  newPassword: string;
};

export type AuthenticateUserInput = {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
  deviceFingerprint?: string;
};

/**
 * User Service Class
 *
 * Handles all user-related business logic
 */
export class UserService {
  /**
   * Register a new user
   *
   * This method:
   * 1. Validates input
   * 2. Checks if user exists
   * 3. Validates password strength
   * 4. Checks password against breach database
   * 5. Hashes password
   * 6. Creates user
   * 7. Logs security event
   *
   * @param data - Registration data
   * @param ipAddress - Client IP for logging
   * @returns Created user and session
   */
  async registerUser(
    data: RegisterUserInput,
    ipAddress?: string,
  ): Promise<{ user: User; session: Session }> {
    // 1. Validate email format
    // eslint-disable-next-line regexp/no-super-linear-backtracking
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new ValidationError('Invalid email format');
    }

    // 2. Check if user already exists
    const exists = await userRepo.userExists(data.email.toLowerCase());
    if (exists) {
      throw new ConflictError('Email already registered');
    }

    // 3. Validate password strength
    const passwordCheck = validatePasswordStrength(data.password);
    if (!passwordCheck.valid) {
      throw new ValidationError(
        `Password requirements not met: ${passwordCheck.feedback.join(', ')}`,
      );
    }

    // 4. Check password against breach database
    const breachResult = await checkPasswordBreach(data.password);
    if (breachResult.breached) {
      // Log security event
      await securityLogger.logSuspiciousActivity(
        'User attempted to register with breached password',
        ipAddress || 'unknown',
        { email: data.email, occurrences: breachResult.occurrences },
      );

      throw new SecurityError(
        `This password has been found in ${breachResult.occurrences} data breaches. Please choose a different password.`,
      );
    }

    // 5. Hash password
    const passwordHash = await hashPassword(data.password);

    // 6. Create user
    const userData: NewUser = {
      email: data.email.toLowerCase(),
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: data.firstName && data.lastName
        ? `${data.firstName} ${data.lastName}`
        : data.firstName || data.email.split('@')[0],
      authProvider: 'local',
      isActive: true,
      isEmailVerified: false,
    };

    const user = await userRepo.createUser(userData);

    // 7. Create initial session
    const sessionData: NewSession = {
      userId: user.id,
      sessionToken: this.generateSessionToken(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      ipAddress,
    };

    const session = await sessionRepo.createSession(sessionData);

    // 8. Log success
    await securityLogger.logAuthSuccess(
      user.id,
      user.email,
      ipAddress || 'unknown',
    );

    return { user, session };
  }

  /**
   * Authenticate user with email and password
   *
   * @param data - Authentication credentials
   * @returns User and session if successful
   */
  async authenticateUser(
    data: AuthenticateUserInput,
  ): Promise<{ user: User; session: Session }> {
    // 1. Find user
    const user = await userRepo.findUserByEmail(data.email.toLowerCase());

    if (!user || !user.passwordHash) {
      // Log failed attempt
      await securityLogger.logAuthFailure(
        data.email,
        data.ipAddress || 'unknown',
        'Invalid credentials',
      );

      throw new UnauthorizedError('Invalid email or password');
    }

    // 2. Check if account is active
    if (!user.isActive) {
      await securityLogger.logAuthFailure(
        data.email,
        data.ipAddress || 'unknown',
        'Account deactivated',
      );

      throw new UnauthorizedError('Account is deactivated');
    }

    // 3. Verify password
    const isValid = await verifyPassword(data.password, user.passwordHash);

    if (!isValid) {
      await securityLogger.logAuthFailure(
        data.email,
        data.ipAddress || 'unknown',
        'Invalid password',
      );

      throw new UnauthorizedError('Invalid email or password');
    }

    // 4. Update last login
    await userRepo.updateLastLogin(user.id);

    // 5. Create new session
    const sessionData: NewSession = {
      userId: user.id,
      sessionToken: this.generateSessionToken(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      deviceFingerprint: data.deviceFingerprint,
    };

    const session = await sessionRepo.createSession(sessionData);

    // 6. Log success
    await securityLogger.logAuthSuccess(
      user.id,
      user.email,
      data.ipAddress || 'unknown',
    );

    return { user, session };
  }

  /**
   * Update user profile
   *
   * @param userId - User ID
   * @param data - Profile data to update
   * @returns Updated user
   */
  async updateProfile(
    userId: number,
    data: UpdateProfileInput,
  ): Promise<User> {
    const user = await userRepo.findUserById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const updated = await userRepo.updateUser(userId, data);

    if (!updated) {
      throw new Error('Failed to update user');
    }

    return updated;
  }

  /**
   * Change user password
   *
   * @param userId - User ID
   * @param data - Old and new passwords
   * @param ipAddress - Client IP for logging
   */
  async changePassword(
    userId: number,
    data: ChangePasswordInput,
    ipAddress?: string,
  ): Promise<void> {
    // 1. Find user
    const user = await userRepo.findUserById(userId);

    if (!user || !user.passwordHash) {
      throw new NotFoundError('User not found');
    }

    // 2. Verify old password
    const isValid = await verifyPassword(data.oldPassword, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // 3. Validate new password
    const passwordCheck = validatePasswordStrength(data.newPassword);
    if (!passwordCheck.valid) {
      throw new ValidationError(
        `Password requirements not met: ${passwordCheck.feedback.join(', ')}`,
      );
    }

    // 4. Check new password against breaches
    const breachResult = await checkPasswordBreach(data.newPassword);
    if (breachResult.breached) {
      throw new SecurityError(
        `This password has been found in ${breachResult.occurrences} data breaches. Please choose a different password.`,
      );
    }

    // 5. Hash new password
    const passwordHash = await hashPassword(data.newPassword);

    // 6. Update password
    await userRepo.updatePassword(userId, passwordHash);

    // 7. Invalidate all existing sessions except current one
    await sessionRepo.deleteSessionsByUserId(userId);

    // 8. Log event
    await securityLogger.logPasswordChanged(
      userId,
      user.email,
      ipAddress || 'unknown',
    );
  }

  /**
   * Request password reset
   *
   * @param email - User email
   * @param ipAddress - Client IP for logging
   * @returns Reset token (should be sent via email, not returned to client)
   */
  async requestPasswordReset(
    email: string,
    ipAddress?: string,
  ): Promise<{ token: string; expiresAt: Date }> {
    const user = await userRepo.findUserByEmail(email.toLowerCase());

    // Always return success to prevent email enumeration
    if (!user) {
      // Still log the attempt
      await securityLogger.logPasswordResetRequest(
        email,
        ipAddress || 'unknown',
      );

      // Return dummy token to prevent timing attacks
      return {
        token: 'dummy',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      };
    }

    // Generate reset token
    const { token, expiresAt } = generatePasswordResetToken();

    // Hash token before storing in database
    const hashedToken = await bcrypt.hash(token, 10);

    // Store hashed token in database
    await db.insert(passwordResetTokens).values({
      userId: user.id,
      token: hashedToken,
      expiresAt,
    });

    await securityLogger.logPasswordResetRequest(
      email,
      ipAddress || 'unknown',
    );

    return { token, expiresAt };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: number): Promise<User> {
    const user = await userRepo.findUserById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  /**
   * Deactivate user account
   */
  async deactivateAccount(userId: number): Promise<void> {
    await userRepo.deactivateUser(userId);
    await sessionRepo.deleteSessionsByUserId(userId);
  }

  /**
   * Delete user account (soft delete)
   */
  async deleteAccount(userId: number): Promise<void> {
    await userRepo.deleteUser(userId);
    await sessionRepo.deleteSessionsByUserId(userId);
  }

  /**
   * Generate a secure session token
   */
  private generateSessionToken(): string {
    return randomBytes(32).toString('hex');
  }
}

/**
 * Create a singleton instance of UserService
 */
export const userService = new UserService();
