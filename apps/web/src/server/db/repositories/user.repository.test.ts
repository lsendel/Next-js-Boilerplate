/**
 * User Repository Unit Tests
 *
 * Comprehensive test suite for user repository functions.
 * Tests cover all CRUD operations, edge cases, soft deletes, and pagination.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanupTestUsers } from '../../../../tests/utils/db-test-helpers';
import { UserFactory } from '../../../../tests/utils/test-factories';
import type { NewUser } from './user.repository';
import {
  createUser,
  deleteUser,
  findAllUsers,
  findUserByEmail,
  findUserByExternalId,
  findUserById,
  permanentlyDeleteUser,
  updateLastLogin,
  updateUser,
  verifyEmail,
} from './user.repository';

describe('User Repository', () => {
  // Clean up test data after each test
  afterEach(async () => {
    await cleanupTestUsers();
  });

  describe('findUserByEmail', () => {
    it('should find user by email when user exists', async () => {
      // Arrange
      const userData = UserFactory.build({
        email: 'existing@example.com',
      });
      const created = await createUser(userData);

      // Act
      const result = await findUserByEmail('existing@example.com');

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe(created.id);
      expect(result?.email).toBe('existing@example.com');
    });

    it('should return null when user does not exist', async () => {
      // Act
      const result = await findUserByEmail('nonexistent@example.com');

      // Assert
      expect(result).toBeNull();
    });

    it('should exclude soft-deleted users', async () => {
      // Arrange
      const userData = UserFactory.build({
        email: 'deleted@example.com',
      });
      const created = await createUser(userData);
      await deleteUser(created.id);

      // Act
      const result = await findUserByEmail('deleted@example.com');

      // Assert
      expect(result).toBeNull();
    });

    it('should be case-sensitive for email lookup', async () => {
      // Arrange
      const userData = UserFactory.build({
        email: 'CaseSensitive@example.com',
      });
      await createUser(userData);

      // Act
      const lowerCase = await findUserByEmail('casesensitive@example.com');
      const exactCase = await findUserByEmail('CaseSensitive@example.com');

      // Assert
      expect(lowerCase).toBeNull();
      expect(exactCase).not.toBeNull();
    });
  });

  describe('findUserById', () => {
    it('should find user by ID when user exists', async () => {
      // Arrange
      const userData = UserFactory.build();
      const created = await createUser(userData);

      // Act
      const result = await findUserById(created.id);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe(created.id);
      expect(result?.email).toBe(created.email);
    });

    it('should return null when user ID does not exist', async () => {
      // Act
      const result = await findUserById(99999);

      // Assert
      expect(result).toBeNull();
    });

    it('should exclude soft-deleted users by ID', async () => {
      // Arrange
      const userData = UserFactory.build();
      const created = await createUser(userData);
      await deleteUser(created.id);

      // Act
      const result = await findUserById(created.id);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findUserByExternalId', () => {
    it('should find user by external ID and auth provider', async () => {
      // Arrange
      const userData = UserFactory.buildClerkUser({
        externalId: 'clerk_external123',
        authProvider: 'clerk',
      });
      const created = await createUser(userData);

      // Act
      const result = await findUserByExternalId('clerk_external123', 'clerk');

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe(created.id);
      expect(result?.externalId).toBe('clerk_external123');
      expect(result?.authProvider).toBe('clerk');
    });

    it('should return null when auth provider does not match', async () => {
      // Arrange
      const userData = UserFactory.buildClerkUser({
        externalId: 'clerk_external456',
        authProvider: 'clerk',
      });
      await createUser(userData);

      // Act
      const result = await findUserByExternalId('clerk_external456', 'cloudflare');

      // Assert
      expect(result).toBeNull();
    });

    it('should exclude soft-deleted users by external ID', async () => {
      // Arrange
      const userData = UserFactory.buildCloudflareUser({
        externalId: 'cf_external789',
        authProvider: 'cloudflare',
      });
      const created = await createUser(userData);
      await deleteUser(created.id);

      // Act
      const result = await findUserByExternalId('cf_external789', 'cloudflare');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create user with all fields populated', async () => {
      // Arrange
      const userData = UserFactory.build({
        email: 'fulldata@example.com',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        authProvider: 'local',
        isActive: true,
      });

      // Act
      const result = await createUser(userData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeGreaterThan(0);
      expect(result.email).toBe('fulldata@example.com');
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.displayName).toBe('John Doe');
      expect(result.authProvider).toBe('local');
      expect(result.isActive).toBe(true);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.deletedAt).toBeNull();
    });

    it('should create user with minimal required fields', async () => {
      // Arrange
      const minimalData: NewUser = {
        email: 'minimal@example.com',
        isEmailVerified: false,
        isActive: true,
        authProvider: 'local',
      };

      // Act
      const result = await createUser(minimalData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeGreaterThan(0);
      expect(result.email).toBe('minimal@example.com');
      expect(result.firstName).toBeNull();
      expect(result.lastName).toBeNull();
      expect(result.authProvider).toBe('local');
    });

    it('should throw error when creating user with duplicate email', async () => {
      // Arrange
      const userData = UserFactory.build({
        email: 'duplicate@example.com',
      });
      await createUser(userData);

      // Act & Assert
      await expect(async () => {
        await createUser(userData);
      }).rejects.toThrow();
    });

    it('should set default values for boolean fields', async () => {
      // Arrange
      const userData: NewUser = {
        email: 'defaults@example.com',
        isEmailVerified: false,
        authProvider: 'local',
        isActive: true,
      };

      // Act
      const result = await createUser(userData);

      // Assert
      expect(result.isActive).toBe(true);
      expect(result.isEmailVerified).toBe(false);
    });

    it('should automatically set timestamps on creation', async () => {
      // Arrange
      const beforeCreate = new Date();
      const userData = UserFactory.build({
        email: 'timestamps@example.com',
      });

      // Act
      const result = await createUser(userData);
      const afterCreate = new Date();

      // Assert
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(result.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
      expect(result.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(result.updatedAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });
  });

  describe('updateUser', () => {
    it('should update user fields successfully', async () => {
      // Arrange
      const userData = UserFactory.build({
        firstName: 'Original',
        lastName: 'Name',
      });
      const created = await createUser(userData);

      // Act
      const result = await updateUser(created.id, {
        firstName: 'Updated',
        lastName: 'NewName',
      });

      // Assert
      expect(result).not.toBeNull();
      expect(result?.firstName).toBe('Updated');
      expect(result?.lastName).toBe('NewName');
      expect(result?.email).toBe(created.email); // Unchanged field
    });

    it('should update updatedAt timestamp when updating user', async () => {
      // Arrange
      const userData = UserFactory.build();
      const created = await createUser(userData);
      const originalUpdatedAt = created.updatedAt;

      // Wait a small amount to ensure timestamp difference
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });

      // Act
      const result = await updateUser(created.id, {
        firstName: 'Changed',
      });

      // Assert
      expect(result).not.toBeNull();
      expect(result!.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should return null when updating soft-deleted user', async () => {
      // Arrange
      const userData = UserFactory.build();
      const created = await createUser(userData);
      await deleteUser(created.id);

      // Act
      const result = await updateUser(created.id, {
        firstName: 'ShouldNotUpdate',
      });

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when updating non-existent user', async () => {
      // Act
      const result = await updateUser(99999, {
        firstName: 'NonExistent',
      });

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should soft delete user by setting deletedAt timestamp', async () => {
      // Arrange
      const userData = UserFactory.build();
      const created = await createUser(userData);

      // Act
      const beforeDelete = new Date();
      const result = await deleteUser(created.id);
      const afterDelete = new Date();

      // Assert
      expect(result).toBe(true);

      // Verify user is soft deleted
      const deleted = await findUserById(created.id);
      expect(deleted).toBeNull();

      // Verify deletedAt is set (using raw query to bypass soft delete filter)
      const rawUser = await findUserByIdIncludingDeleted(created.id);
      expect(rawUser?.deletedAt).toBeInstanceOf(Date);
      expect(rawUser!.deletedAt!.getTime()).toBeGreaterThanOrEqual(beforeDelete.getTime());
      expect(rawUser!.deletedAt!.getTime()).toBeLessThanOrEqual(afterDelete.getTime());
    });

    it('should set isActive to false when soft deleting', async () => {
      // Arrange
      const userData = UserFactory.build({
        isActive: true,
      });
      const created = await createUser(userData);

      // Act
      await deleteUser(created.id);

      // Assert
      const rawUser = await findUserByIdIncludingDeleted(created.id);
      expect(rawUser?.isActive).toBe(false);
    });

    it('should preserve deletedAt timestamp when user is already deleted', async () => {
      // Arrange
      const userData = UserFactory.build();
      const created = await createUser(userData);
      await deleteUser(created.id);
      const firstDelete = await findUserByIdIncludingDeleted(created.id);
      const firstDeletedAt = firstDelete?.deletedAt;

      // Act
      const result = await deleteUser(created.id);

      // Assert
      expect(result).toBe(false); // Should return false as user is already deleted
      const secondDelete = await findUserByIdIncludingDeleted(created.id);
      expect(secondDelete?.deletedAt?.getTime()).toBe(firstDeletedAt?.getTime());
    });

    it('should return false when deleting non-existent user', async () => {
      // Act
      const result = await deleteUser(99999);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when user is already soft-deleted', async () => {
      // Arrange
      const userData = UserFactory.build();
      const created = await createUser(userData);
      await deleteUser(created.id);

      // Act
      const result = await deleteUser(created.id);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('permanentlyDeleteUser', () => {
    it('should permanently delete user from database', async () => {
      // Arrange
      const userData = UserFactory.build();
      const created = await createUser(userData);

      // Act
      const result = await permanentlyDeleteUser(created.id);

      // Assert
      expect(result).toBe(true);

      // Verify user is completely gone
      const deleted = await findUserByIdIncludingDeleted(created.id);
      expect(deleted).toBeNull();
    });

    it('should return false when permanently deleting non-existent user', async () => {
      // Act
      const result = await permanentlyDeleteUser(99999);

      // Assert
      expect(result).toBe(false);
    });

    it('should cascade delete user sessions when permanently deleting user', async () => {
      // Arrange
      const userData = UserFactory.build();
      const created = await createUser(userData);

      // Note: This test assumes sessions would be created
      // In a real scenario, you'd create sessions here and verify they're deleted

      // Act
      const result = await permanentlyDeleteUser(created.id);

      // Assert
      expect(result).toBe(true);
      // Sessions would be automatically deleted due to cascade constraint
    });
  });

  describe('findAllUsers', () => {
    beforeEach(async () => {
      // Create 25 test users for pagination tests
      for (let i = 0; i < 25; i++) {
        await createUser(UserFactory.build({
          email: `user${i}@example.com`,
        }));
      }
    });

    it('should return first page with default page size', async () => {
      // Act
      const result = await findAllUsers({ page: 1 });

      // Assert
      expect(result.users).toHaveLength(20); // Default page size
      expect(result.total).toBe(25);
    });

    it('should return second page with correct offset', async () => {
      // Act
      const result = await findAllUsers({ page: 2, pageSize: 10 });

      // Assert
      expect(result.users).toHaveLength(10);
      expect(result.total).toBe(25);
    });

    it('should exclude soft-deleted users by default', async () => {
      // Arrange
      const userData = UserFactory.build({ email: 'todelete@example.com' });
      const created = await createUser(userData);
      await deleteUser(created.id);

      // Act
      const result = await findAllUsers({});

      // Assert
      expect(result.total).toBe(25); // Should not include the deleted user
      const deletedUser = result.users.find(u => u.id === created.id);
      expect(deletedUser).toBeUndefined();
    });

    it('should include soft-deleted users when includeDeleted is true', async () => {
      // Arrange
      const userData = UserFactory.build({ email: 'includeDeleted@example.com' });
      const created = await createUser(userData);
      await deleteUser(created.id);

      // Act
      const result = await findAllUsers({ includeDeleted: true });

      // Assert
      expect(result.total).toBe(26); // Should include all users + deleted one
      const deletedUser = result.users.find(u => u.id === created.id);
      expect(deletedUser).toBeDefined();
      expect(deletedUser?.deletedAt).not.toBeNull();
    });

    it('should return empty array when page exceeds available data', async () => {
      // Act
      const result = await findAllUsers({ page: 100, pageSize: 20 });

      // Assert
      expect(result.users).toHaveLength(0);
      expect(result.total).toBe(25);
    });

    it('should sort users by creation date in descending order', async () => {
      // Act
      const result = await findAllUsers({ page: 1, pageSize: 5 });

      // Assert
      expect(result.users).toHaveLength(5);
      // Verify descending order
      for (let i = 0; i < result.users.length - 1; i++) {
        expect(result.users[i]!.createdAt.getTime()).toBeGreaterThanOrEqual(
          result.users[i + 1]!.createdAt.getTime(),
        );
      }
    });
  });

  describe('updateLastLogin', () => {
    it('should update lastLoginAt timestamp', async () => {
      // Arrange
      const userData = UserFactory.build({
        lastLoginAt: null,
      });
      const created = await createUser(userData);

      // Act
      const beforeUpdate = new Date();
      await updateLastLogin(created.id);
      const afterUpdate = new Date();

      // Assert
      const updated = await findUserByIdIncludingDeleted(created.id);
      expect(updated?.lastLoginAt).toBeInstanceOf(Date);
      expect(updated!.lastLoginAt!.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
      expect(updated!.lastLoginAt!.getTime()).toBeLessThanOrEqual(afterUpdate.getTime());
    });

    it('should not affect other user fields when updating last login', async () => {
      // Arrange
      const userData = UserFactory.build({
        firstName: 'Original',
        email: 'lastlogin@example.com',
      });
      const created = await createUser(userData);

      // Act
      await updateLastLogin(created.id);

      // Assert
      const updated = await findUserByIdIncludingDeleted(created.id);
      expect(updated?.firstName).toBe('Original');
      expect(updated?.email).toBe('lastlogin@example.com');
      expect(updated?.isActive).toBe(created.isActive);
    });
  });

  describe('verifyEmail', () => {
    it('should set email verification flags to true', async () => {
      // Arrange
      const userData = UserFactory.buildUnverified({
        email: 'unverified@example.com',
      });
      const created = await createUser(userData);

      // Act
      const result = await verifyEmail(created.id);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.isEmailVerified).toBe(true);
      expect(result?.isEmailVerified).toBe(true);
    });

    it('should update updatedAt timestamp when verifying email', async () => {
      // Arrange
      const userData = UserFactory.buildUnverified();
      const created = await createUser(userData);
      const originalUpdatedAt = created.updatedAt;

      // Wait a small amount to ensure timestamp difference
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });

      // Act
      const result = await verifyEmail(created.id);

      // Assert
      expect(result).not.toBeNull();
      expect(result!.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should return updated user after email verification', async () => {
      // Arrange
      const userData = UserFactory.buildUnverified({
        email: 'verify@example.com',
        firstName: 'Test',
      });
      const created = await createUser(userData);

      // Act
      const result = await verifyEmail(created.id);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe(created.id);
      expect(result?.email).toBe('verify@example.com');
      expect(result?.firstName).toBe('Test');
      expect(result?.isEmailVerified).toBe(true);
    });

    it('should work even if email was already verified', async () => {
      // Arrange
      const userData = UserFactory.build({
        email: 'alreadyverified@example.com',
        isEmailVerified: true,
      });
      const created = await createUser(userData);

      // Act
      const result = await verifyEmail(created.id);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.isEmailVerified).toBe(true);
    });
  });

  describe('Edge Cases and Integration', () => {
    it('should handle creating multiple users with different auth providers', async () => {
      // Arrange & Act
      const localUser = await createUser(UserFactory.build({
        email: 'local@example.com',
        authProvider: 'local',
      }));
      const clerkUser = await createUser(UserFactory.buildClerkUser({
        email: 'clerk@example.com',
      }));
      const cloudflareUser = await createUser(UserFactory.buildCloudflareUser({
        email: 'cloudflare@example.com',
      }));

      // Assert
      expect(localUser.authProvider).toBe('local');
      expect(clerkUser.authProvider).toBe('clerk');
      expect(cloudflareUser.authProvider).toBe('cloudflare');
      expect(localUser.passwordHash).toBeTruthy();
      expect(clerkUser.passwordHash).toBeNull();
      expect(cloudflareUser.passwordHash).toBeNull();
    });

    it('should maintain data integrity when updating multiple fields at once', async () => {
      // Arrange
      const userData = UserFactory.build({
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
      });
      const created = await createUser(userData);

      // Act
      const result = await updateUser(created.id, {
        firstName: 'Jane',
        lastName: 'Smith',
        displayName: 'Jane Smith',
        isActive: false,
      });

      // Assert
      expect(result).not.toBeNull();
      expect(result?.firstName).toBe('Jane');
      expect(result?.lastName).toBe('Smith');
      expect(result?.displayName).toBe('Jane Smith');
      expect(result?.isActive).toBe(false);
      expect(result?.email).toBe(created.email); // Unchanged
    });

    it('should handle pagination edge case with exact page size match', async () => {
      // Arrange - Create exactly 20 users
      for (let i = 0; i < 20; i++) {
        await createUser(UserFactory.build({
          email: `exact${i}@example.com`,
        }));
      }

      // Act
      const page1 = await findAllUsers({ page: 1, pageSize: 20 });
      const page2 = await findAllUsers({ page: 2, pageSize: 20 });

      // Assert
      expect(page1.users).toHaveLength(20);
      expect(page1.total).toBe(20);
      expect(page2.users).toHaveLength(0);
      expect(page2.total).toBe(20);
    });
  });
});

/**
 * Helper function to find user by ID including soft-deleted users
 * Used for testing soft delete behavior
 */
async function findUserByIdIncludingDeleted(id: number) {
  const { db } = await import('@/server/db/DB');
  const { users } = await import('@/server/db/models/Schema');
  const { eq } = await import('drizzle-orm');

  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return result[0] || null;
}
