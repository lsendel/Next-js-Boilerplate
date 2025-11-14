/**
 * Test Factories
 *
 * Factory functions for generating realistic test data using Faker.
 * These factories provide consistent, type-safe test data generation.
 */

import { faker } from '@faker-js/faker';
import type { NewUser } from '@/server/db/repositories/user.repository';

/**
 * User Factory
 *
 * Generates realistic user data for testing purposes.
 */
export const UserFactory = {
  /**
   * Builds a user object with faker-generated data
   *
   * @param overrides - Partial user data to override faker defaults
   * @returns User data object
   *
   * @example
   * ```typescript
   * const user = UserFactory.build({
   *   email: 'specific@example.com',
   *   firstName: 'John',
   * });
   * ```
   */
  build(overrides?: Partial<NewUser>): NewUser {
    const firstName = overrides?.firstName || faker.person.firstName();
    const lastName = overrides?.lastName || faker.person.lastName();

    return {
      email: faker.internet.email({ firstName, lastName }),
      passwordHash: overrides?.passwordHash || faker.internet.password({ length: 60 }),
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      avatarUrl: faker.image.avatar(),
      authProvider: 'local',
      externalId: null,
      isActive: true,
      isEmailVerified: faker.datatype.boolean(),
      lastLoginAt: faker.date.recent({ days: 30 }),
      passwordChangedAt: faker.date.past({ years: 1 }),
      ...overrides,
    };
  },

  /**
   * Builds a Clerk-authenticated user object
   *
   * @param overrides - Partial user data to override defaults
   * @returns User data object configured for Clerk authentication
   *
   * @example
   * ```typescript
   * const clerkUser = UserFactory.buildClerkUser({
   *   email: 'clerk-user@example.com',
   * });
   * ```
   */
  buildClerkUser(overrides?: Partial<NewUser>): NewUser {
    const firstName = overrides?.firstName || faker.person.firstName();
    const lastName = overrides?.lastName || faker.person.lastName();

    return {
      email: faker.internet.email({ firstName, lastName }),
      passwordHash: null, // Clerk users don't have local passwords
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      avatarUrl: faker.image.avatar(),
      authProvider: 'clerk',
      externalId: `clerk_${faker.string.alphanumeric({ length: 20 })}`,
      isActive: true,
      isEmailVerified: true,
      lastLoginAt: faker.date.recent({ days: 7 }),
      passwordChangedAt: null,
      ...overrides,
    };
  },

  /**
   * Builds a Cloudflare Access authenticated user object
   *
   * @param overrides - Partial user data to override defaults
   * @returns User data object configured for Cloudflare authentication
   *
   * @example
   * ```typescript
   * const cloudflareUser = UserFactory.buildCloudflareUser({
   *   email: 'cf-user@example.com',
   * });
   * ```
   */
  buildCloudflareUser(overrides?: Partial<NewUser>): NewUser {
    const firstName = overrides?.firstName || faker.person.firstName();
    const lastName = overrides?.lastName || faker.person.lastName();

    return {
      email: faker.internet.email({ firstName, lastName }),
      passwordHash: null, // Cloudflare users don't have local passwords
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      avatarUrl: faker.image.avatar(),
      authProvider: 'cloudflare',
      externalId: `cf_${faker.string.alphanumeric({ length: 20 })}`,
      isActive: true,
      isEmailVerified: true,
      lastLoginAt: faker.date.recent({ days: 7 }),
      passwordChangedAt: null,
      ...overrides,
    };
  },

  /**
   * Builds a Cognito authenticated user object
   *
   * @param overrides - Partial user data to override defaults
   * @returns User data object configured for Cognito authentication
   *
   * @example
   * ```typescript
   * const cognitoUser = UserFactory.buildCognitoUser({
   *   email: 'cognito-user@example.com',
   * });
   * ```
   */
  buildCognitoUser(overrides?: Partial<NewUser>): NewUser {
    const firstName = overrides?.firstName || faker.person.firstName();
    const lastName = overrides?.lastName || faker.person.lastName();

    return {
      email: faker.internet.email({ firstName, lastName }),
      passwordHash: null, // Cognito users don't have local passwords
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      avatarUrl: faker.image.avatar(),
      authProvider: 'cognito',
      externalId: `cognito_${faker.string.alphanumeric({ length: 20 })}`,
      isActive: true,
      isEmailVerified: true,
      lastLoginAt: faker.date.recent({ days: 7 }),
      passwordChangedAt: null,
      ...overrides,
    };
  },

  /**
   * Builds multiple user objects
   *
   * @param count - Number of users to generate
   * @param overrides - Partial user data to apply to all users
   * @returns Array of user data objects
   *
   * @example
   * ```typescript
   * const users = UserFactory.buildMultiple(5, {
   *   authProvider: 'clerk',
   * });
   * ```
   */
  buildMultiple(count: number, overrides?: Partial<NewUser>): NewUser[] {
    return Array.from({ length: count }, () => this.build(overrides));
  },

  /**
   * Builds an unverified user object (common for testing email verification flows)
   *
   * @param overrides - Partial user data to override defaults
   * @returns User data object with unverified email
   *
   * @example
   * ```typescript
   * const unverifiedUser = UserFactory.buildUnverified({
   *   email: 'unverified@example.com',
   * });
   * ```
   */
  buildUnverified(overrides?: Partial<NewUser>): NewUser {
    return this.build({
      isEmailVerified: false,
      ...overrides,
    });
  },

  /**
   * Builds an inactive user object (useful for testing account suspension)
   *
   * @param overrides - Partial user data to override defaults
   * @returns User data object marked as inactive
   *
   * @example
   * ```typescript
   * const inactiveUser = UserFactory.buildInactive({
   *   email: 'inactive@example.com',
   * });
   * ```
   */
  buildInactive(overrides?: Partial<NewUser>): NewUser {
    return this.build({
      isActive: false,
      ...overrides,
    });
  },
};

/**
 * Session Factory
 *
 * Generates realistic session data for testing purposes.
 */
export const SessionFactory = {
  /**
   * Builds a session object with faker-generated data
   *
   * @param userId - User ID for the session
   * @param overrides - Partial session data to override defaults
   * @returns Session data object
   *
   * @example
   * ```typescript
   * const session = SessionFactory.build(123, {
   *   sessionToken: 'custom-token',
   * });
   * ```
   */
  build(
    userId: number,
    overrides?: {
      sessionToken?: string;
      deviceFingerprint?: string | null;
      ipAddress?: string | null;
      userAgent?: string | null;
      expiresAt?: Date;
      lastActivityAt?: Date;
    },
  ) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    return {
      userId,
      sessionToken: faker.string.alphanumeric({ length: 64 }),
      deviceFingerprint: faker.string.alphanumeric({ length: 32 }),
      ipAddress: faker.internet.ipv4(),
      userAgent: faker.internet.userAgent(),
      expiresAt,
      lastActivityAt: now,
      ...overrides,
    };
  },

  /**
   * Builds an expired session object
   *
   * @param userId - User ID for the session
   * @param overrides - Partial session data to override defaults
   * @returns Expired session data object
   */
  buildExpired(
    userId: number,
    overrides?: {
      sessionToken?: string;
      deviceFingerprint?: string | null;
      ipAddress?: string | null;
      userAgent?: string | null;
    },
  ) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return this.build(userId, {
      expiresAt: yesterday,
      ...overrides,
    });
  },
};
