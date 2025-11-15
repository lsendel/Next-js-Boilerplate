/**
 * User Service Tests
 *
 * Co-located test file for user.service.ts
 * Tests all business logic, validation, and security features
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UserService, ValidationError, ConflictError, SecurityError, NotFoundError, UnauthorizedError } from './user.service';
import * as userRepo from '@/server/db/repositories/user.repository';
import * as sessionRepo from '@/server/db/repositories/session.repository';

// Test data
let userService: UserService;
let testUserIds: number[] = [];

describe('UserService', () => {
  beforeEach(() => {
    userService = new UserService();
  });

  afterEach(async () => {
    // Clean up test users
    for (const id of testUserIds) {
      await userRepo.permanentlyDeleteUser(id);
    }
    testUserIds = [];
    vi.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        email: `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`,
        password: 'StrongPass123!@#',
        firstName: 'Test',
        lastName: 'User',
      };

      const result = await userService.registerUser(userData);
      testUserIds.push(result.user.id);

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userData.email.toLowerCase());
      expect(result.user.firstName).toBe('Test');
      expect(result.user.lastName).toBe('User');
      expect(result.user.isEmailVerified).toBe(false);
      expect(result.user.isActive).toBe(true);
      expect(result.session).toBeDefined();
      expect(result.session.sessionToken).toBeTypeOf('string');
    });

    it('should normalize email to lowercase', async () => {
      const userData = {
        email: `TEST-${Date.now()}@EXAMPLE.COM`,
        password: 'StrongPass123!@#',
      };

      const result = await userService.registerUser(userData);
      testUserIds.push(result.user.id);

      expect(result.user.email).toBe(userData.email.toLowerCase());
    });

    it('should throw ValidationError for invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'StrongPass123!@#',
      };

      await expect(userService.registerUser(userData)).rejects.toThrow(
        'Invalid email format',
      );
    });

    it('should throw ConflictError if email already exists', async () => {
      const email = `duplicate-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
      const userData = {
        email,
        password: 'StrongPass123!@#',
      };

      const result = await userService.registerUser(userData);
      testUserIds.push(result.user.id);

      await expect(userService.registerUser(userData)).rejects.toThrow(
        'Email already registered',
      );
    });

    it('should throw ValidationError for weak password', async () => {
      const userData = {
        email: `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`,
        password: 'weak',
      };

      await expect(userService.registerUser(userData)).rejects.toThrow(
        'Password requirements not met',
      );
    });

    it('should hash password before storing', async () => {
      const userData = {
        email: `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`,
        password: 'StrongPass123!@#',
      };

      const result = await userService.registerUser(userData);
      testUserIds.push(result.user.id);

      // Password should be hashed, not plain text
      expect(result.user.passwordHash).toBeDefined();
      expect(result.user.passwordHash).not.toBe(userData.password);
      expect(result.user.passwordHash?.length).toBeGreaterThan(30);
    });

    it('should set displayName from firstName and lastName', async () => {
      const userData = {
        email: `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`,
        password: 'StrongPass123!@#',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = await userService.registerUser(userData);
      testUserIds.push(result.user.id);

      expect(result.user.displayName).toBe('John Doe');
    });

    it('should set displayName from firstName if no lastName', async () => {
      const userData = {
        email: `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`,
        password: 'StrongPass123!@#',
        firstName: 'John',
      };

      const result = await userService.registerUser(userData);
      testUserIds.push(result.user.id);

      expect(result.user.displayName).toBe('John');
    });

    it('should set displayName from email username if no name provided', async () => {
      const userData = {
        email: `johndoe-${Date.now()}@example.com`,
        password: 'StrongPass123!@#',
      };

      const result = await userService.registerUser(userData);
      testUserIds.push(result.user.id);

      expect(result.user.displayName).toContain('johndoe');
    });

    it('should create session with 30-day expiration', async () => {
      const userData = {
        email: `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`,
        password: 'StrongPass123!@#',
      };

      const result = await userService.registerUser(userData);
      testUserIds.push(result.user.id);

      const expiresAt = result.session.expiresAt.getTime();
      const now = Date.now();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;

      expect(expiresAt).toBeGreaterThan(now);
      expect(expiresAt).toBeLessThanOrEqual(now + thirtyDays + 1000); // +1s tolerance
    });
  });

  describe('authenticateUser', () => {
    let testUser: {
      email: string;
      password: string;
      userId: number;
    };

    beforeEach(async () => {
      // Create a test user for authentication tests
      const email = `auth-test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
      const password = 'StrongPass123!@#';
      const result = await userService.registerUser({ email, password });
      testUser = {
        email,
        password,
        userId: result.user.id,
      };
      testUserIds.push(result.user.id);
    });

    it('should authenticate user with correct credentials', async () => {
      const result = await userService.authenticateUser({
        email: testUser.email,
        password: testUser.password,
      });

      expect(result.user).toBeDefined();
      expect(result.user.id).toBe(testUser.userId);
      expect(result.session).toBeDefined();
      expect(result.session.userId).toBe(testUser.userId);
    });

    it('should normalize email to lowercase for authentication', async () => {
      const result = await userService.authenticateUser({
        email: testUser.email.toUpperCase(),
        password: testUser.password,
      });

      expect(result.user.email).toBe(testUser.email.toLowerCase());
    });

    it('should throw UnauthorizedError for non-existent email', async () => {
      await expect(
        userService.authenticateUser({
          email: 'nonexistent@example.com',
          password: 'password',
        }),
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw UnauthorizedError for wrong password', async () => {
      await expect(
        userService.authenticateUser({
          email: testUser.email,
          password: 'WrongPassword123!',
        }),
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw UnauthorizedError for inactive account', async () => {
      await userRepo.deactivateUser(testUser.userId);

      await expect(
        userService.authenticateUser({
          email: testUser.email,
          password: testUser.password,
        }),
      ).rejects.toThrow('Account is deactivated');
    });

    it('should update last login timestamp on successful auth', async () => {
      const userBefore = await userRepo.findUserById(testUser.userId);
      const lastLoginBefore = userBefore?.lastLoginAt;

      await userService.authenticateUser({
        email: testUser.email,
        password: testUser.password,
      });

      const userAfter = await userRepo.findUserById(testUser.userId);
      expect(userAfter?.lastLoginAt).not.toBeNull();
      if (lastLoginBefore) {
        expect(userAfter?.lastLoginAt?.getTime()).toBeGreaterThan(
          lastLoginBefore.getTime(),
        );
      }
    });

    it('should store client info in session', async () => {
      const result = await userService.authenticateUser({
        email: testUser.email,
        password: testUser.password,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        deviceFingerprint: 'device-123',
      });

      expect(result.session.ipAddress).toBe('192.168.1.1');
      expect(result.session.userAgent).toBe('Mozilla/5.0');
      expect(result.session.deviceFingerprint).toBe('device-123');
    });
  });

  describe('updateProfile', () => {
    let testUserId: number;

    beforeEach(async () => {
      const result = await userService.registerUser({
        email: `profile-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`,
        password: 'StrongPass123!@#',
        firstName: 'Original',
        lastName: 'Name',
      });
      testUserId = result.user.id;
      testUserIds.push(testUserId);
    });

    it('should update user profile fields', async () => {
      const updatedUser = await userService.updateProfile(testUserId, {
        firstName: 'Updated',
        lastName: 'NewName',
        displayName: 'Updated NewName',
      });

      expect(updatedUser.firstName).toBe('Updated');
      expect(updatedUser.lastName).toBe('NewName');
      expect(updatedUser.displayName).toBe('Updated NewName');
    });

    it('should throw NotFoundError for non-existent user', async () => {
      await expect(
        userService.updateProfile(999999, { firstName: 'Test' }),
      ).rejects.toThrow('User not found');
    });

    it('should allow partial updates', async () => {
      const updatedUser = await userService.updateProfile(testUserId, {
        firstName: 'OnlyFirstName',
      });

      expect(updatedUser.firstName).toBe('OnlyFirstName');
      expect(updatedUser.lastName).toBe('Name'); // Unchanged
    });

    it('should update avatarUrl', async () => {
      const updatedUser = await userService.updateProfile(testUserId, {
        avatarUrl: 'https://example.com/avatar.jpg',
      });

      expect(updatedUser.avatarUrl).toBe('https://example.com/avatar.jpg');
    });
  });

  describe('changePassword', () => {
    let testUser: {
      email: string;
      password: string;
      userId: number;
    };

    beforeEach(async () => {
      const email = `password-${Date.now()}@example.com`;
      // Use a unique password unlikely to be breached
      const password = `OldPass${Date.now()}!SecureTest#${Math.random().toString(36).substring(7)}`;
      const result = await userService.registerUser({ email, password });
      testUser = {
        email,
        password,
        userId: result.user.id,
      };
      testUserIds.push(result.user.id);
    });

    it('should change password with correct old password', async () => {
      const newPassword = `NewPass${Date.now()}!SecureTest#${Math.random().toString(36).substring(7)}`;
      await userService.changePassword(testUser.userId, {
        oldPassword: testUser.password,
        newPassword,
      });

      // Verify new password works
      const result = await userService.authenticateUser({
        email: testUser.email,
        password: newPassword,
      });

      expect(result.user.id).toBe(testUser.userId);
    });

    it('should throw UnauthorizedError for incorrect old password', async () => {
      const newPassword = `NewPass${Date.now()}!SecureTest#${Math.random().toString(36).substring(7)}`;
      await expect(
        userService.changePassword(testUser.userId, {
          oldPassword: 'WrongOldPassword',
          newPassword,
        }),
      ).rejects.toThrow('Current password is incorrect');
    });

    it('should throw ValidationError for weak new password', async () => {
      await expect(
        userService.changePassword(testUser.userId, {
          oldPassword: testUser.password,
          newPassword: 'weak',
        }),
      ).rejects.toThrow('Password requirements not met');
    });

    it('should throw NotFoundError for non-existent user', async () => {
      await expect(
        userService.changePassword(999999, {
          oldPassword: 'password',
          newPassword: 'NewPassword123!',
        }),
      ).rejects.toThrow('User not found');
    });

    it('should invalidate all existing sessions after password change', async () => {
      // Create multiple sessions
      await sessionRepo.createSession({
        userId: testUser.userId,
        sessionToken: 'session-1',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      await sessionRepo.createSession({
        userId: testUser.userId,
        sessionToken: 'session-2',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      await userService.changePassword(testUser.userId, {
        oldPassword: testUser.password,
        newPassword: 'NewStrongPass456!@#',
      });

      // Verify sessions are invalidated
      const foundSession1 = await sessionRepo.findSessionByToken('session-1');
      const foundSession2 = await sessionRepo.findSessionByToken('session-2');

      expect(foundSession1).toBeNull();
      expect(foundSession2).toBeNull();
    });
  });

  describe('requestPasswordReset', () => {
    let testUser: {
      email: string;
      userId: number;
    };

    beforeEach(async () => {
      const email = `reset-${Date.now()}@example.com`;
      const result = await userService.registerUser({
        email,
        password: 'StrongPass123!@#',
      });
      testUser = {
        email,
        userId: result.user.id,
      };
      testUserIds.push(result.user.id);
    });

    it('should return token for existing user', async () => {
      const result = await userService.requestPasswordReset(testUser.email);

      expect(result.token).toBeDefined();
      expect(result.token).not.toBe('dummy');
      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(result.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it('should return dummy token for non-existent email (prevent enumeration)', async () => {
      const result = await userService.requestPasswordReset(
        'nonexistent@example.com',
      );

      expect(result.token).toBe('dummy');
      expect(result.expiresAt).toBeInstanceOf(Date);
    });

    it('should normalize email to lowercase', async () => {
      const result = await userService.requestPasswordReset(
        testUser.email.toUpperCase(),
      );

      // Should still find user and return real token
      expect(result.token).not.toBe('dummy');
    });

    it('should set token expiration to 15 minutes', async () => {
      const result = await userService.requestPasswordReset(testUser.email);

      const now = Date.now();
      const fifteenMinutes = 15 * 60 * 1000;
      const expiresAt = result.expiresAt.getTime();

      expect(expiresAt).toBeGreaterThan(now);
      expect(expiresAt).toBeLessThanOrEqual(now + fifteenMinutes + 1000); // +1s tolerance
    });
  });

  describe('getUserById', () => {
    let testUserId: number;

    beforeEach(async () => {
      const result = await userService.registerUser({
        email: `getuser-${Date.now()}@example.com`,
        password: 'StrongPass123!@#',
      });
      testUserId = result.user.id;
      testUserIds.push(testUserId);
    });

    it('should return user by ID', async () => {
      const user = await userService.getUserById(testUserId);

      expect(user).toBeDefined();
      expect(user.id).toBe(testUserId);
    });

    it('should throw NotFoundError for non-existent user', async () => {
      await expect(userService.getUserById(999999)).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw NotFoundError for soft-deleted user', async () => {
      await userRepo.deleteUser(testUserId);

      await expect(userService.getUserById(testUserId)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('deactivateAccount', () => {
    let testUserId: number;

    beforeEach(async () => {
      const result = await userService.registerUser({
        email: `deactivate-${Date.now()}@example.com`,
        password: 'StrongPass123!@#',
      });
      testUserId = result.user.id;
      testUserIds.push(testUserId);

      // Create a session
      await sessionRepo.createSession({
        userId: testUserId,
        sessionToken: 'test-session',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    });

    it('should deactivate user account', async () => {
      await userService.deactivateAccount(testUserId);

      const user = await userRepo.findUserById(testUserId);
      expect(user?.isActive).toBe(false);
    });

    it('should delete all user sessions on deactivation', async () => {
      await userService.deactivateAccount(testUserId);

      const session = await sessionRepo.findSessionByToken('test-session');
      expect(session).toBeNull();
    });
  });

  describe('deleteAccount', () => {
    let testUserId: number;

    beforeEach(async () => {
      const result = await userService.registerUser({
        email: `delete-${Date.now()}@example.com`,
        password: 'StrongPass123!@#',
      });
      testUserId = result.user.id;
      testUserIds.push(testUserId);

      // Create a session
      await sessionRepo.createSession({
        userId: testUserId,
        sessionToken: 'test-session-delete',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    });

    it('should soft delete user account', async () => {
      await userService.deleteAccount(testUserId);

      const user = await userRepo.findUserById(testUserId);
      expect(user).toBeNull(); // Not found due to soft delete
    });

    it('should delete all user sessions on account deletion', async () => {
      await userService.deleteAccount(testUserId);

      const session = await sessionRepo.findSessionByToken(
        'test-session-delete',
      );
      expect(session).toBeNull();
    });
  });

  describe('Error Classes', () => {
    it('should have correct error types', () => {
      expect(new ValidationError('test')).toBeInstanceOf(Error);
      expect(new ConflictError('test').statusCode).toBe(409);
      expect(new SecurityError('test').statusCode).toBe(403);
      expect(new NotFoundError('test').statusCode).toBe(404);
      expect(new UnauthorizedError('test').statusCode).toBe(401);
    });
  });
});
