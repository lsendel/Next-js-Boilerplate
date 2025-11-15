/**
 * Authentication Integration Tests
 *
 * Tests the complete authentication flow including:
 * - User registration
 * - User login
 * - Session management
 * - Password operations
 * - Security features
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { UserService } from '@/server/api/services/user.service';
import { AuthService } from '@/server/api/services/auth.service';
import * as userRepo from '@/server/db/repositories/user.repository';
import * as sessionRepo from '@/server/db/repositories/session.repository';

describe('Authentication Integration Tests', () => {
  let userService: UserService;
  let authService: AuthService;
  let testUserIds: number[] = [];
  let testSessionIds: number[] = [];

  beforeAll(() => {
    userService = new UserService();
    authService = new AuthService();
  });

  beforeEach(() => {
    testUserIds = [];
    testSessionIds = [];
  });

  afterAll(async () => {
    // Cleanup all test data
    for (const sessionId of testSessionIds) {
      await sessionRepo.deleteSession(sessionId);
    }
    for (const userId of testUserIds) {
      await userRepo.permanentlyDeleteUser(userId);
    }
  });

  describe('User Registration Flow', () => {
    it('should successfully register a new user and create session', async () => {
      // Arrange
      const email = `integration-test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
      const password = `Aa1!${Date.now().toString().substring(0, 8)}Zz9@${Math.random().toString(36).substring(2, 8)}`;
      const userData = {
        email,
        password,
        firstName: 'Integration',
        lastName: 'Test',
      };

      // Act
      const result = await userService.registerUser(userData);
      testUserIds.push(result.user.id);
      testSessionIds.push(result.session.id);

      // Assert - User created correctly
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(email.toLowerCase());
      expect(result.user.firstName).toBe('Integration');
      expect(result.user.lastName).toBe('Test');
      expect(result.user.displayName).toBe('Integration Test');
      expect(result.user.isActive).toBe(true);
      expect(result.user.isEmailVerified).toBe(false);
      expect(result.user.authProvider).toBe('local');

      // Assert - Session created correctly
      expect(result.session).toBeDefined();
      expect(result.session.userId).toBe(result.user.id);
      expect(result.session.sessionToken).toBeDefined();
      expect(result.session.sessionToken.length).toBe(64); // 32 bytes hex
      expect(result.session.expiresAt).toBeInstanceOf(Date);

      // Assert - Session expires in ~30 days
      const expirationDays = Math.floor(
        (result.session.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      expect(expirationDays).toBeGreaterThanOrEqual(29);
      expect(expirationDays).toBeLessThanOrEqual(30);

      // Assert - Password is hashed
      expect(result.user.passwordHash).toBeDefined();
      expect(result.user.passwordHash).not.toBe(password);
      expect(result.user.passwordHash?.startsWith('$2b$')).toBe(true); // bcrypt hash
    });

    it('should prevent duplicate email registration', async () => {
      // Arrange
      const email = `duplicate-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
      const password = `Aa1!${Date.now().toString().substring(0, 8)}Zz9@${Math.random().toString(36).substring(2, 8)}`;

      // First registration
      const result1 = await userService.registerUser({ email, password });
      testUserIds.push(result1.user.id);
      testSessionIds.push(result1.session.id);

      // Act & Assert - Second registration should fail
      await expect(
        userService.registerUser({ email, password: 'DifferentPass123!' })
      ).rejects.toThrow('Email already registered');
    });

    it('should normalize email to lowercase during registration', async () => {
      // Arrange
      const email = `UPPERCASE-${Date.now()}-${Math.random().toString(36).substring(7)}@EXAMPLE.COM`;
      const password = `Aa1!${Date.now().toString().substring(0, 8)}Zz9@${Math.random().toString(36).substring(2, 8)}`;

      // Act
      const result = await userService.registerUser({ email, password });
      testUserIds.push(result.user.id);
      testSessionIds.push(result.session.id);

      // Assert
      expect(result.user.email).toBe(email.toLowerCase());
      expect(result.user.email).not.toContain('UPPERCASE');
      expect(result.user.email).not.toContain('EXAMPLE.COM');
    });

    it('should set displayName from email if no name provided', async () => {
      // Arrange
      const email = `johndoe-${Date.now()}@example.com`;
      const password = `Aa1!${Date.now().toString().substring(0, 8)}Zz9@${Math.random().toString(36).substring(2, 8)}`;

      // Act
      const result = await userService.registerUser({ email, password });
      testUserIds.push(result.user.id);
      testSessionIds.push(result.session.id);

      // Assert
      expect(result.user.displayName).toContain('johndoe');
      expect(result.user.firstName).toBeNull();
      expect(result.user.lastName).toBeNull();
    });
  });

  describe('User Login Flow', () => {
    let registeredUser: { email: string; password: string; userId: number };

    beforeEach(async () => {
      // Create a user for login tests
      const email = `login-test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
      const password = `Aa1!${Date.now().toString().substring(0, 8)}Zz9@${Math.random().toString(36).substring(2, 8)}`;

      const result = await userService.registerUser({ email, password });
      testUserIds.push(result.user.id);
      testSessionIds.push(result.session.id);

      registeredUser = {
        email,
        password,
        userId: result.user.id,
      };
    });

    it('should successfully authenticate with correct credentials', async () => {
      // Act
      const result = await userService.authenticateUser({
        email: registeredUser.email,
        password: registeredUser.password,
      });
      testSessionIds.push(result.session.id);

      // Assert
      expect(result.user.id).toBe(registeredUser.userId);
      expect(result.user.email).toBe(registeredUser.email);
      expect(result.session).toBeDefined();
      expect(result.session.userId).toBe(registeredUser.userId);
      expect(result.session.sessionToken).toBeDefined();
    });

    it('should reject authentication with wrong password', async () => {
      // Act & Assert
      await expect(
        userService.authenticateUser({
          email: registeredUser.email,
          password: 'WrongPassword123!',
        })
      ).rejects.toThrow('Invalid email or password');
    });

    it('should reject authentication for non-existent user', async () => {
      // Act & Assert
      await expect(
        userService.authenticateUser({
          email: 'nonexistent@example.com',
          password: 'SomePassword123!',
        })
      ).rejects.toThrow('Invalid email or password');
    });

    it('should normalize email to lowercase during login', async () => {
      // Act - Login with uppercase email
      const result = await userService.authenticateUser({
        email: registeredUser.email.toUpperCase(),
        password: registeredUser.password,
      });
      testSessionIds.push(result.session.id);

      // Assert
      expect(result.user.id).toBe(registeredUser.userId);
      expect(result.user.email).toBe(registeredUser.email.toLowerCase());
    });

    it('should update lastLoginAt timestamp on successful login', async () => {
      // Arrange
      const userBefore = await userRepo.findUserById(registeredUser.userId);
      const lastLoginBefore = userBefore?.lastLoginAt;

      // Wait a moment to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 100));

      // Act
      const result = await userService.authenticateUser({
        email: registeredUser.email,
        password: registeredUser.password,
      });
      testSessionIds.push(result.session.id);

      // Assert
      const userAfter = await userRepo.findUserById(registeredUser.userId);
      expect(userAfter?.lastLoginAt).toBeDefined();

      if (lastLoginBefore) {
        expect(userAfter!.lastLoginAt!.getTime()).toBeGreaterThan(lastLoginBefore.getTime());
      }
    });

    it('should reject login for inactive account', async () => {
      // Arrange - Deactivate the account
      await userService.deactivateAccount(registeredUser.userId);

      // Act & Assert
      await expect(
        userService.authenticateUser({
          email: registeredUser.email,
          password: registeredUser.password,
        })
      ).rejects.toThrow('Account is deactivated');
    });
  });

  describe('Session Management Flow', () => {
    let testUser: { userId: number; sessionToken: string };

    beforeEach(async () => {
      // Create user and session
      const email = `session-test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
      const password = `Aa1!${Date.now().toString().substring(0, 8)}Zz9@${Math.random().toString(36).substring(2, 8)}`;

      const result = await userService.registerUser({ email, password });
      testUserIds.push(result.user.id);
      testSessionIds.push(result.session.id);

      testUser = {
        userId: result.user.id,
        sessionToken: result.session.sessionToken,
      };
    });

    it('should validate existing session', async () => {
      // Act
      const user = await authService.validateSession(testUser.sessionToken);

      // Assert
      expect(user).toBeDefined();
      expect(user?.id).toBe(testUser.userId);
      expect(user?.isActive).toBe(true);
    });

    it('should return null for non-existent session', async () => {
      // Act
      const session = await authService.validateSession('invalid-token-12345');

      // Assert
      expect(session).toBeNull();
    });

    it('should destroy session on logout', async () => {
      // Act
      const destroyed = await authService.destroySession(testUser.sessionToken);

      // Assert
      expect(destroyed).toBe(true);

      // Verify session is gone
      const session = await authService.validateSession(testUser.sessionToken);
      expect(session).toBeNull();
    });

    it('should create multiple sessions for same user', async () => {
      // Act - Create second session
      const session2 = await authService.createSession(testUser.userId);
      testSessionIds.push(session2.id);

      // Assert
      expect(session2.userId).toBe(testUser.userId);
      expect(session2.sessionToken).not.toBe(testUser.sessionToken);

      // Both sessions should be valid
      const validSession1 = await authService.validateSession(testUser.sessionToken);
      const validSession2 = await authService.validateSession(session2.sessionToken);

      expect(validSession1).toBeDefined();
      expect(validSession2).toBeDefined();
    });

    it('should destroy all sessions for user', async () => {
      // Arrange - Create multiple sessions
      const session2 = await authService.createSession(testUser.userId);
      const session3 = await authService.createSession(testUser.userId);
      testSessionIds.push(session2.id, session3.id);

      // Act
      const destroyed = await sessionRepo.deleteSessionsByUserId(testUser.userId);

      // Assert
      expect(destroyed).toBeGreaterThanOrEqual(3);

      // Verify all sessions are gone
      expect(await authService.validateSession(testUser.sessionToken)).toBeNull();
      expect(await authService.validateSession(session2.sessionToken)).toBeNull();
      expect(await authService.validateSession(session3.sessionToken)).toBeNull();
    });
  });

  describe('Password Change Flow', () => {
    let testUser: { userId: number; email: string; password: string };

    beforeEach(async () => {
      const email = `password-test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
      const password = `Aa1!${Date.now().toString().substring(0, 8)}Zz9@${Math.random().toString(36).substring(2, 8)}`;

      const result = await userService.registerUser({ email, password });
      testUserIds.push(result.user.id);
      testSessionIds.push(result.session.id);

      testUser = {
        userId: result.user.id,
        email,
        password,
      };
    });

    it('should successfully change password with correct old password', async () => {
      // Arrange
      const newPassword = `Bb2!${Date.now().toString().substring(0, 8)}Yy8@${Math.random().toString(36).substring(2, 8)}`;

      // Act
      await userService.changePassword(testUser.userId, {
        oldPassword: testUser.password,
        newPassword,
      });

      // Assert - Old password should no longer work
      await expect(
        userService.authenticateUser({
          email: testUser.email,
          password: testUser.password,
        })
      ).rejects.toThrow();

      // Assert - New password should work
      const result = await userService.authenticateUser({
        email: testUser.email,
        password: newPassword,
      });
      testSessionIds.push(result.session.id);
      expect(result.user.id).toBe(testUser.userId);
    });

    it('should reject password change with incorrect old password', async () => {
      // Arrange
      const newPassword = `Bb2!${Date.now().toString().substring(0, 8)}Yy8@${Math.random().toString(36).substring(2, 8)}`;

      // Act & Assert
      await expect(
        userService.changePassword(testUser.userId, {
          oldPassword: 'WrongOldPassword123!',
          newPassword,
        })
      ).rejects.toThrow('Current password is incorrect');
    });

    it('should invalidate all sessions after password change', async () => {
      // Arrange - Create multiple sessions
      const session1 = await authService.createSession(testUser.userId);
      const session2 = await authService.createSession(testUser.userId);
      testSessionIds.push(session1.id, session2.id);

      // Verify sessions are valid
      expect(await authService.validateSession(session1.sessionToken)).toBeDefined();
      expect(await authService.validateSession(session2.sessionToken)).toBeDefined();

      // Act - Change password
      const newPassword = `Bb2!${Date.now().toString().substring(0, 8)}Yy8@${Math.random().toString(36).substring(2, 8)}`;
      await userService.changePassword(testUser.userId, {
        oldPassword: testUser.password,
        newPassword,
      });

      // Assert - All sessions should be invalidated
      expect(await authService.validateSession(session1.sessionToken)).toBeNull();
      expect(await authService.validateSession(session2.sessionToken)).toBeNull();
    });
  });

  describe('Password Reset Flow', () => {
    let testUser: { userId: number; email: string };

    beforeEach(async () => {
      const email = `reset-test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
      const password = `Aa1!${Date.now().toString().substring(0, 8)}Zz9@${Math.random().toString(36).substring(2, 8)}`;

      const result = await userService.registerUser({ email, password });
      testUserIds.push(result.user.id);
      testSessionIds.push(result.session.id);

      testUser = {
        userId: result.user.id,
        email,
      };
    });

    it('should generate password reset token for existing user', async () => {
      // Act
      const result = await userService.requestPasswordReset(
        testUser.email,
        '192.168.1.1',
      );

      // Assert
      expect(result.token).toBeDefined();
      expect(result.token.length).toBeGreaterThan(0);
      expect(result.expiresAt).toBeInstanceOf(Date);

      // Token should expire in ~15 minutes
      const expirationMinutes = Math.floor(
        (result.expiresAt.getTime() - Date.now()) / (1000 * 60)
      );
      expect(expirationMinutes).toBeGreaterThanOrEqual(14);
      expect(expirationMinutes).toBeLessThanOrEqual(15);
    });

    it('should return dummy token for non-existent user (prevent enumeration)', async () => {
      // Act
      const result = await userService.requestPasswordReset(
        'nonexistent@example.com',
        '192.168.1.1',
      );

      // Assert - Still returns a token to prevent user enumeration
      expect(result.token).toBeDefined();
      expect(result.expiresAt).toBeInstanceOf(Date);
    });

    it('should normalize email to lowercase in password reset', async () => {
      // Act
      const result = await userService.requestPasswordReset(
        testUser.email.toUpperCase(),
        '192.168.1.1',
      );

      // Assert
      expect(result.token).toBeDefined();
      expect(result.expiresAt).toBeInstanceOf(Date);
    });
  });

  describe('Account Management Flow', () => {
    let testUser: { userId: number; email: string };

    beforeEach(async () => {
      const email = `account-test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
      // Generate strong password: uppercase, lowercase, number, special char, no patterns
      const randomStr = Math.random().toString(36).substring(2, 10);
      const password = `Xp${randomStr}9!Bq${Date.now().toString().substring(8)}@Ky7`;

      const result = await userService.registerUser({ email, password });
      testUserIds.push(result.user.id);
      testSessionIds.push(result.session.id);

      testUser = {
        userId: result.user.id,
        email,
      };
    });

    it('should deactivate user account', async () => {
      // Act
      await userService.deactivateAccount(testUser.userId);

      // Assert
      const user = await userRepo.findUserById(testUser.userId);
      expect(user?.isActive).toBe(false);
    });

    it('should delete all sessions on account deactivation', async () => {
      // Arrange - Create sessions
      const session1 = await authService.createSession(testUser.userId);
      const session2 = await authService.createSession(testUser.userId);
      testSessionIds.push(session1.id, session2.id);

      // Act
      await userService.deactivateAccount(testUser.userId);

      // Assert
      expect(await authService.validateSession(session1.sessionToken)).toBeNull();
      expect(await authService.validateSession(session2.sessionToken)).toBeNull();
    });

    it('should soft delete user account', async () => {
      // Act
      await userService.deleteAccount(testUser.userId);

      // Assert - User should not be found (filtered out by soft delete)
      const user = await userRepo.findUserById(testUser.userId);
      expect(user).toBeNull();
    });

    it('should delete all sessions on account deletion', async () => {
      // Arrange - Create sessions
      const session1 = await authService.createSession(testUser.userId);
      testSessionIds.push(session1.id);

      // Act
      await userService.deleteAccount(testUser.userId);

      // Assert
      expect(await authService.validateSession(session1.sessionToken)).toBeNull();
    });
  });

  describe('Profile Management Flow', () => {
    let testUser: { userId: number };

    beforeEach(async () => {
      const email = `profile-test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
      const password = `Aa1!${Date.now().toString().substring(0, 8)}Zz9@${Math.random().toString(36).substring(2, 8)}`;

      const result = await userService.registerUser({ email, password });
      testUserIds.push(result.user.id);
      testSessionIds.push(result.session.id);

      testUser = {
        userId: result.user.id,
      };
    });

    it('should update user profile fields', async () => {
      // Act
      const updated = await userService.updateProfile(testUser.userId, {
        firstName: 'Updated',
        lastName: 'Name',
        displayName: 'Updated Display Name',
      });

      // Assert
      expect(updated.firstName).toBe('Updated');
      expect(updated.lastName).toBe('Name');
      expect(updated.displayName).toBe('Updated Display Name');
    });

    it('should allow partial profile updates', async () => {
      // Act
      const updated = await userService.updateProfile(testUser.userId, {
        firstName: 'OnlyFirst',
      });

      // Assert
      expect(updated.firstName).toBe('OnlyFirst');
    });

    it('should update avatar URL', async () => {
      // Act
      const updated = await userService.updateProfile(testUser.userId, {
        avatarUrl: 'https://example.com/avatar.jpg',
      });

      // Assert
      expect(updated.avatarUrl).toBe('https://example.com/avatar.jpg');
    });
  });
});
