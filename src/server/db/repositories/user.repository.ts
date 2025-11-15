/**
 * User Repository
 *
 * Data access layer for user operations
 */

import { and, count, desc, eq, isNull } from 'drizzle-orm';
import { db } from '@/server/db/DB';
import { users } from '@/server/db/models/Schema';

/**
 * User type based on database schema
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

/**
 * Find user by email address
 *
 * @param email - User's email address (case-sensitive)
 * @returns User object if found, null if not found
 *
 * @remarks
 * - Excludes soft-deleted users (where deletedAt IS NOT NULL)
 * - Email matching is case-sensitive
 * - Returns the first matching user (email should be unique)
 * - Query is limited to 1 result for performance optimization
 *
 * @throws Database connection errors if unable to query
 *
 * @example
 * ```typescript
 * const user = await findUserByEmail('john@example.com');
 * if (user) {
 *   console.log(`Found user: ${user.firstName} ${user.lastName}`);
 * } else {
 *   console.log('User not found');
 * }
 * ```
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), isNull(users.deletedAt)))
    .limit(1);

  return result[0] || null;
}

/**
 * Find user by internal database ID
 *
 * @param id - Internal database user ID (integer primary key)
 * @returns User object if found, null if not found or soft-deleted
 *
 * @remarks
 * - Excludes soft-deleted users (where deletedAt IS NOT NULL)
 * - Use this for internal lookups by primary key
 * - For auth provider lookups, use findUserByExternalId instead
 * - Query is limited to 1 result for performance optimization
 *
 * @throws Database connection errors if unable to query
 *
 * @example
 * ```typescript
 * const user = await findUserById(123);
 * if (user) {
 *   console.log(`User ID ${id}: ${user.email}`);
 * } else {
 *   console.log('User not found or has been deleted');
 * }
 * ```
 */
export async function findUserById(id: number): Promise<User | null> {
  const result = await db
    .select()
    .from(users)
    .where(and(eq(users.id, id), isNull(users.deletedAt)))
    .limit(1);

  return result[0] || null;
}

/**
 * Find user by external authentication provider ID
 *
 * @param externalId - Unique user identifier from the auth provider (e.g., Clerk user ID, Cognito sub)
 * @param authProvider - Auth provider name (e.g., 'clerk', 'cloudflare', 'cognito')
 * @returns User object if found, null if not found or soft-deleted
 *
 * @remarks
 * - Excludes soft-deleted users (where deletedAt IS NOT NULL)
 * - Both externalId AND authProvider must match for a user to be found
 * - The same externalId can exist across different auth providers
 * - This is the primary method for syncing auth provider users with database users
 * - Query is limited to 1 result for performance optimization
 *
 * @throws Database connection errors if unable to query
 *
 * @example
 * ```typescript
 * // Find user synced from Clerk
 * const user = await findUserByExternalId('user_2abc123xyz', 'clerk');
 * if (user) {
 *   console.log(`Found ${user.email} from ${user.authProvider}`);
 * }
 *
 * // Find user from Cloudflare Access
 * const cfUser = await findUserByExternalId('abc123', 'cloudflare');
 * ```
 */
export async function findUserByExternalId(
  externalId: string,
  authProvider: string,
): Promise<User | null> {
  const result = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.externalId, externalId),
        eq(users.authProvider, authProvider),
        isNull(users.deletedAt),
      ),
    )
    .limit(1);

  return result[0] || null;
}

/**
 * Create a new user in the database
 *
 * @param data - User data conforming to the NewUser type (all required fields must be present)
 * @returns Newly created user object with generated ID and timestamps
 *
 * @remarks
 * - The database will auto-generate: id, createdAt, updatedAt
 * - Email should be unique (database constraint may throw if duplicate)
 * - externalId + authProvider combination should be unique per provider
 * - The user is created in active state (isActive = true) by default
 * - Returns the complete user object including auto-generated fields
 *
 * @throws Database constraint errors if email or externalId+authProvider already exists
 * @throws Database connection errors if unable to insert
 *
 * @example
 * ```typescript
 * const newUser = await createUser({
 *   email: 'jane@example.com',
 *   externalId: 'user_abc123',
 *   authProvider: 'clerk',
 *   firstName: 'Jane',
 *   lastName: 'Doe',
 *   isEmailVerified: true,
 *   isActive: true,
 * });
 * console.log(`Created user with ID: ${newUser.id}`);
 * ```
 */
export async function createUser(data: NewUser): Promise<User> {
  const result = await db.insert(users).values(data).returning();

  if (!result[0]) {
    throw new Error('Failed to create user - no result returned from database');
  }

  return result[0];
}

/**
 * Update an existing user's information
 *
 * @param id - Internal database user ID to update
 * @param data - Partial user data to update (only provided fields will be updated)
 * @returns Updated user object if found, null if user not found or soft-deleted
 *
 * @remarks
 * - Only updates non-deleted users (where deletedAt IS NULL)
 * - Automatically sets updatedAt to current timestamp
 * - Partial updates are supported - only provided fields are modified
 * - Returns null if the user doesn't exist or has been soft-deleted
 * - Be careful updating email - ensure uniqueness before calling
 * - Cannot update a soft-deleted user (use reactivateUser first)
 *
 * @throws Database constraint errors if updated data violates constraints (e.g., duplicate email)
 * @throws Database connection errors if unable to update
 *
 * @example
 * ```typescript
 * // Update user's name
 * const updated = await updateUser(123, {
 *   firstName: 'John',
 *   lastName: 'Smith',
 * });
 *
 * if (updated) {
 *   console.log(`Updated user: ${updated.firstName} ${updated.lastName}`);
 * } else {
 *   console.log('User not found or has been deleted');
 * }
 * ```
 */
export async function updateUser(
  id: number,
  data: Partial<NewUser>,
): Promise<User | null> {
  const result = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(users.id, id), isNull(users.deletedAt)))
    .returning();

  return result[0] || null;
}

/**
 * Soft delete a user (sets deletedAt timestamp without removing data)
 *
 * @param id - Internal database user ID to soft delete
 * @returns true if user was successfully soft deleted, false if user not found or already deleted
 *
 * @remarks
 * - This is a SOFT DELETE - data remains in the database for audit/recovery purposes
 * - Sets deletedAt to current timestamp
 * - Sets isActive to false
 * - User will be excluded from most queries (those filtering on deletedAt IS NULL)
 * - Cannot soft delete an already soft-deleted user (returns false)
 * - Use permanentlyDeleteUser() for hard deletion (irreversible)
 * - Use reactivateUser() to restore a soft-deleted user
 *
 * @throws Database connection errors if unable to update
 *
 * @example
 * ```typescript
 * const deleted = await deleteUser(123);
 * if (deleted) {
 *   console.log('User successfully soft deleted');
 * } else {
 *   console.log('User not found or already deleted');
 * }
 *
 * // User data is still in database but marked as deleted
 * const user = await findUserById(123); // Returns null
 * ```
 */
export async function deleteUser(id: number): Promise<boolean> {
  const result = await db
    .update(users)
    .set({
      deletedAt: new Date(),
      isActive: false,
    })
    .where(and(eq(users.id, id), isNull(users.deletedAt)))
    .returning();

  return result.length > 0;
}

/**
 * Permanently delete user from database (hard delete - irreversible)
 *
 * @param id - Internal database user ID to permanently delete
 * @returns true if user was deleted, false if user not found
 *
 * @remarks
 * - ⚠️ WARNING: This is a HARD DELETE - data is permanently removed and CANNOT be recovered
 * - Deletes the row from the database completely
 * - Works on both active and soft-deleted users
 * - Consider using deleteUser() (soft delete) instead for audit trail
 * - May fail if user has foreign key constraints (e.g., related records in other tables)
 * - Use this only for GDPR "right to be forgotten" requests or similar legal requirements
 * - Consider archiving user data before permanent deletion for compliance
 *
 * @throws Database foreign key constraint errors if user has related records
 * @throws Database connection errors if unable to delete
 *
 * @example
 * ```typescript
 * // Only use for GDPR requests or similar requirements
 * const confirmed = confirm('Are you sure? This cannot be undone!');
 * if (confirmed) {
 *   const deleted = await permanentlyDeleteUser(123);
 *   if (deleted) {
 *     console.log('User permanently deleted from database');
 *   } else {
 *     console.log('User not found');
 *   }
 * }
 * ```
 */
export async function permanentlyDeleteUser(id: number): Promise<boolean> {
  const result = await db.delete(users).where(eq(users.id, id)).returning();

  return result.length > 0;
}

/**
 * Find all users with pagination support
 *
 * @param params - Query parameters object
 * @param params.page - Page number (1-indexed, defaults to 1)
 * @param params.pageSize - Number of users per page (defaults to 20)
 * @param params.includeDeleted - If true, includes soft-deleted users (defaults to false)
 * @returns Object containing array of users and total count
 *
 * @remarks
 * - By default, excludes soft-deleted users (where deletedAt IS NOT NULL)
 * - Users are ordered by createdAt DESC (newest first)
 * - Page numbers are 1-indexed (page 1 is the first page)
 * - Returns both the paginated results and total count for building pagination UI
 * - Total count respects the includeDeleted parameter
 * - If page number exceeds available pages, returns empty array
 * - Performance: Total count query runs separately from data query
 *
 * @throws Database connection errors if unable to query
 *
 * @example
 * ```typescript
 * // Get first page with defaults (20 users)
 * const result = await findAllUsers({});
 * console.log(`Showing ${result.users.length} of ${result.total} users`);
 *
 * // Get second page with custom page size
 * const page2 = await findAllUsers({ page: 2, pageSize: 50 });
 *
 * // Include soft-deleted users
 * const allUsers = await findAllUsers({ includeDeleted: true });
 *
 * // Calculate total pages
 * const { users, total } = await findAllUsers({ page: 1, pageSize: 25 });
 * const totalPages = Math.ceil(total / 25);
 * ```
 */
export async function findAllUsers(params: {
  page?: number;
  pageSize?: number;
  includeDeleted?: boolean;
}): Promise<{ users: User[]; total: number }> {
  const page = params.page || 1;
  const pageSize = params.pageSize || 20;
  const offset = (page - 1) * pageSize;

  // Build where clause
  const whereClause = params.includeDeleted ? undefined : isNull(users.deletedAt);

  // Get total count
  const totalResult = await db
    .select({ count: count() })
    .from(users)
    .where(whereClause);

  // Get paginated results
  const userResults = await db
    .select()
    .from(users)
    .where(whereClause)
    .orderBy(desc(users.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    users: userResults,
    total: totalResult[0]?.count || 0,
  };
}

/**
 * Update user's last login timestamp to current time
 *
 * @param id - Internal database user ID
 * @returns void (no return value)
 *
 * @remarks
 * - Sets lastLoginAt to current timestamp
 * - Does NOT update the updatedAt field (to avoid unnecessary update noise)
 * - Works on both active and soft-deleted users (no deletedAt check)
 * - Call this after successful authentication to track user activity
 * - Silently succeeds even if user doesn't exist (no error thrown)
 * - Does not return whether the update was successful
 *
 * @throws Database connection errors if unable to update
 *
 * @example
 * ```typescript
 * // Update last login after successful authentication
 * const user = await findUserByEmail('john@example.com');
 * if (user) {
 *   await updateLastLogin(user.id);
 *   console.log('Last login timestamp updated');
 * }
 *
 * // In authentication middleware
 * async function onUserLogin(userId: number) {
 *   await updateLastLogin(userId);
 *   // Continue with login flow...
 * }
 * ```
 */
export async function updateLastLogin(id: number): Promise<void> {
  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, id));
}

/**
 * Mark user's email address as verified
 *
 * @param id - Internal database user ID
 * @returns Updated user object if found, null if user not found
 *
 * @remarks
 * - Sets isEmailVerified to true
 * - Sets isEmailVerified to true (for compatibility with different auth providers)
 * - Updates the updatedAt timestamp
 * - Works on both active and soft-deleted users (no deletedAt check)
 * - Call this after user clicks email verification link or confirms email
 * - Both email verification flags are set for redundancy/compatibility
 * - Does not check if email was already verified (safe to call multiple times)
 *
 * @throws Database connection errors if unable to update
 *
 * @example
 * ```typescript
 * // After user clicks verification link in email
 * const user = await verifyEmail(userId);
 * if (user) {
 *   console.log(`Email verified for ${user.email}`);
 *   // Send welcome email or redirect to dashboard
 * } else {
 *   console.log('User not found');
 * }
 *
 * // Check verification status
 * const user = await findUserById(123);
 * if (!user.isEmailVerified) {
 *   await verifyEmail(user.id);
 * }
 * ```
 */
export async function verifyEmail(id: number): Promise<User | null> {
  const result = await db
    .update(users)
    .set({
      isEmailVerified: true,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  return result[0] || null;
}

/**
 * Update user's password hash
 */
export async function updatePassword(
  id: number,
  passwordHash: string,
): Promise<User | null> {
  const result = await db
    .update(users)
    .set({
      passwordHash,
      passwordChangedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(users.id, id), isNull(users.deletedAt)))
    .returning();

  return result[0] || null;
}

/**
 * Check if user exists by email
 */
export async function userExists(email: string): Promise<boolean> {
  const result = await db
    .select({ count: count() })
    .from(users)
    .where(and(eq(users.email, email), isNull(users.deletedAt)));

  return (result[0]?.count || 0) > 0;
}

/**
 * Mark user as inactive
 */
export async function deactivateUser(id: number): Promise<User | null> {
  const result = await db
    .update(users)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(and(eq(users.id, id), isNull(users.deletedAt)))
    .returning();

  return result[0] || null;
}
