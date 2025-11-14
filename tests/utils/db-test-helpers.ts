/**
 * Database Test Helpers
 *
 * Utility functions for seeding and cleaning up test data in the database.
 * These helpers are designed for integration and E2E tests.
 */

import { eq } from 'drizzle-orm';
import { db } from '@/server/db/DB';
import { sessions, users } from '@/server/db/models/Schema';
import type { NewUser, User } from '@/server/db/repositories/user.repository';

/**
 * Seeds a test user into the database
 *
 * @param data - Partial user data to override defaults
 * @returns The created user record
 *
 * @example
 * ```typescript
 * const user = await seedTestUser({
 *   email: 'custom@example.com',
 *   firstName: 'John',
 * });
 * ```
 */
export async function seedTestUser(data?: Partial<NewUser>): Promise<User> {
  const timestamp = Date.now();
  const uniqueEmail = data?.email || `test-user-${timestamp}@example.com`;

  const defaultUserData: NewUser = {
    email: uniqueEmail,
    firstName: 'Test',
    lastName: 'User',
    displayName: 'Test User',
    authProvider: 'local',
    isActive: true,
    isEmailVerified: false,
    ...data,
  };

  const result = await db.insert(users).values(defaultUserData).returning();

  if (!result[0]) {
    throw new Error('Failed to seed test user');
  }

  return result[0];
}

/**
 * Cleans up all test users and their associated sessions
 *
 * This function performs a hard delete of all sessions and users.
 * Use this in test cleanup/teardown to ensure a clean state.
 *
 * @returns Object with counts of deleted records
 *
 * @example
 * ```typescript
 * afterEach(async () => {
 *   await cleanupTestUsers();
 * });
 * ```
 */
export async function cleanupTestUsers(): Promise<{
  sessionsDeleted: number;
  usersDeleted: number;
}> {
  // Delete all sessions first (due to foreign key constraints)
  const deletedSessions = await db.delete(sessions).returning();

  // Delete all users
  const deletedUsers = await db.delete(users).returning();

  return {
    sessionsDeleted: deletedSessions.length,
    usersDeleted: deletedUsers.length,
  };
}

/**
 * Generates test user data without inserting into the database
 *
 * Useful for testing validation logic or preparing data for bulk inserts.
 *
 * @param overrides - Partial user data to override defaults
 * @returns User data object ready for insertion
 *
 * @example
 * ```typescript
 * const userData = generateTestUser({
 *   email: 'test@example.com',
 *   authProvider: 'clerk',
 * });
 * // Use userData for testing without database insertion
 * ```
 */
export function generateTestUser(overrides?: Partial<NewUser>): NewUser {
  const timestamp = Date.now();
  const uniqueEmail = overrides?.email || `test-user-${timestamp}@example.com`;

  return {
    email: uniqueEmail,
    firstName: 'Test',
    lastName: 'User',
    displayName: 'Test User',
    authProvider: 'local',
    isActive: true,
    isEmailVerified: false,
    ...overrides,
  };
}

/**
 * Seeds multiple test users into the database
 *
 * @param count - Number of users to seed
 * @param dataFactory - Optional function to generate custom data for each user
 * @returns Array of created user records
 *
 * @example
 * ```typescript
 * const users = await seedMultipleTestUsers(5, (index) => ({
 *   firstName: `User${index}`,
 *   email: `user${index}@example.com`,
 * }));
 * ```
 */
export async function seedMultipleTestUsers(
  count: number,
  dataFactory?: (index: number) => Partial<NewUser>,
): Promise<User[]> {
  const usersToInsert = Array.from({ length: count }, (_, index) => {
    const customData = dataFactory ? dataFactory(index) : {};
    return generateTestUser(customData);
  });

  const result = await db.insert(users).values(usersToInsert).returning();

  return result;
}

/**
 * Finds a test user by email
 *
 * @param email - Email address to search for
 * @returns The user record or null if not found
 */
export async function findTestUserByEmail(email: string): Promise<User | null> {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

  return result[0] || null;
}

/**
 * Deletes a specific test user and their sessions
 *
 * @param userId - ID of the user to delete
 * @returns True if the user was deleted, false otherwise
 */
export async function deleteTestUser(userId: number): Promise<boolean> {
  // Delete user's sessions first
  await db.delete(sessions).where(eq(sessions.userId, userId));

  // Delete user
  const result = await db.delete(users).where(eq(users.id, userId)).returning();

  return result.length > 0;
}
