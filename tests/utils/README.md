# Test Utilities

This directory contains reusable test utilities for database testing and test data generation.

## Files

### `db-test-helpers.ts`

Database test helper functions for seeding and cleaning up test data in integration and E2E tests.

#### Functions

**`seedTestUser(data?: Partial<NewUser>): Promise<User>`**

Seeds a test user into the database with unique email generation using `Date.now()`.

```typescript
import { seedTestUser } from '@/tests/utils/db-test-helpers';

// Create a test user with default values
const user = await seedTestUser();

// Create a test user with custom values
const customUser = await seedTestUser({
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  authProvider: 'clerk',
});
```

**`cleanupTestUsers(): Promise<{ sessionsDeleted: number; usersDeleted: number }>`**

Deletes all sessions and users from the database. Use in test cleanup/teardown.

```typescript
import { cleanupTestUsers } from '@/tests/utils/db-test-helpers';

afterEach(async () => {
  await cleanupTestUsers();
});
```

**`generateTestUser(overrides?: Partial<NewUser>): NewUser`**

Generates test user data without inserting into the database. Useful for validation testing.

```typescript
import { generateTestUser } from '@/tests/utils/db-test-helpers';

const userData = generateTestUser({
  email: 'test@example.com',
  authProvider: 'clerk',
});
// Use userData for testing without database insertion
```

**`seedMultipleTestUsers(count: number, dataFactory?: (index: number) => Partial<NewUser>): Promise<User[]>`**

Seeds multiple test users into the database.

```typescript
import { seedMultipleTestUsers } from '@/tests/utils/db-test-helpers';

// Create 5 users with default values
const users = await seedMultipleTestUsers(5);

// Create 5 users with custom data
const customUsers = await seedMultipleTestUsers(5, (index) => ({
  firstName: `User${index}`,
  email: `user${index}@example.com`,
}));
```

**`findTestUserByEmail(email: string): Promise<User | null>`**

Finds a test user by email address.

```typescript
import { findTestUserByEmail } from '@/tests/utils/db-test-helpers';

const user = await findTestUserByEmail('test@example.com');
```

**`deleteTestUser(userId: number): Promise<boolean>`**

Deletes a specific test user and their sessions.

```typescript
import { deleteTestUser } from '@/tests/utils/db-test-helpers';

const deleted = await deleteTestUser(123);
```

---

### `test-factories.ts`

Faker-based test factories for generating realistic test data.

#### UserFactory

**`UserFactory.build(overrides?: Partial<NewUser>): NewUser`**

Builds a user object with faker-generated data.

```typescript
import { UserFactory } from '@/tests/utils/test-factories';

const user = UserFactory.build();

// With custom values
const customUser = UserFactory.build({
  email: 'specific@example.com',
  firstName: 'John',
});
```

**`UserFactory.buildClerkUser(overrides?: Partial<NewUser>): NewUser`**

Builds a Clerk-authenticated user with appropriate defaults.

```typescript
import { UserFactory } from '@/tests/utils/test-factories';

const clerkUser = UserFactory.buildClerkUser({
  email: 'clerk-user@example.com',
});

// Properties set automatically:
// - authProvider: 'clerk'
// - externalId: 'clerk_<random>'
// - passwordHash: null
// - emailVerified: true
// - isEmailVerified: true
```

**`UserFactory.buildCloudflareUser(overrides?: Partial<NewUser>): NewUser`**

Builds a Cloudflare Access authenticated user.

```typescript
import { UserFactory } from '@/tests/utils/test-factories';

const cfUser = UserFactory.buildCloudflareUser();
// authProvider: 'cloudflare', externalId: 'cf_<random>'
```

**`UserFactory.buildCognitoUser(overrides?: Partial<NewUser>): NewUser`**

Builds a Cognito authenticated user.

```typescript
import { UserFactory } from '@/tests/utils/test-factories';

const cognitoUser = UserFactory.buildCognitoUser();
// authProvider: 'cognito', externalId: 'cognito_<random>'
```

**`UserFactory.buildMultiple(count: number, overrides?: Partial<NewUser>): NewUser[]`**

Builds multiple user objects.

```typescript
import { UserFactory } from '@/tests/utils/test-factories';

const users = UserFactory.buildMultiple(5);

// With common properties
const clerkUsers = UserFactory.buildMultiple(5, {
  authProvider: 'clerk',
});
```

**`UserFactory.buildUnverified(overrides?: Partial<NewUser>): NewUser`**

Builds an unverified user (common for testing email verification flows).

```typescript
import { UserFactory } from '@/tests/utils/test-factories';

const unverifiedUser = UserFactory.buildUnverified();
// emailVerified: false, isEmailVerified: false
```

**`UserFactory.buildInactive(overrides?: Partial<NewUser>): NewUser`**

Builds an inactive user (useful for testing account suspension).

```typescript
import { UserFactory } from '@/tests/utils/test-factories';

const inactiveUser = UserFactory.buildInactive();
// isActive: false
```

#### SessionFactory

**`SessionFactory.build(userId: number, overrides?): Session`**

Builds a session object with faker-generated data.

```typescript
import { SessionFactory } from '@/tests/utils/test-factories';

const session = SessionFactory.build(123, {
  sessionToken: 'custom-token',
});
```

**`SessionFactory.buildExpired(userId: number, overrides?): Session`**

Builds an expired session object.

```typescript
import { SessionFactory } from '@/tests/utils/test-factories';

const expiredSession = SessionFactory.buildExpired(123);
// expiresAt is set to yesterday
```

## Usage Examples

### Integration Test Example

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { seedTestUser, cleanupTestUsers } from '@/tests/utils/db-test-helpers';
import { findUserByEmail } from '@/server/db/repositories/user.repository';

describe('User Repository', () => {
  beforeEach(async () => {
    await cleanupTestUsers();
  });

  it('should find user by email', async () => {
    const testUser = await seedTestUser({
      email: 'test@example.com',
      firstName: 'Test',
    });

    const foundUser = await findUserByEmail('test@example.com');

    expect(foundUser).toBeDefined();
    expect(foundUser?.id).toBe(testUser.id);
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';
import { seedTestUser, cleanupTestUsers } from '@/tests/utils/db-test-helpers';

test.describe('User Dashboard', () => {
  test.beforeEach(async () => {
    await cleanupTestUsers();
  });

  test('should display user profile', async ({ page }) => {
    const user = await seedTestUser({
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
    });

    // Navigate to dashboard
    await page.goto('/dashboard');

    // Verify user info is displayed
    await expect(page.getByText('John Doe')).toBeVisible();
  });
});
```

### Factory Usage Example

```typescript
import { describe, it, expect } from 'vitest';
import { UserFactory } from '@/tests/utils/test-factories';
import { validateUserData } from '@/server/validators/user.validator';

describe('User Validation', () => {
  it('should validate user data', () => {
    const userData = UserFactory.build();

    const result = validateUserData(userData);

    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const userData = UserFactory.build({
      email: 'invalid-email',
    });

    const result = validateUserData(userData);

    expect(result.success).toBe(false);
  });
});
```

## Dependencies

- `drizzle-orm` - Database ORM
- `@faker-js/faker` - Test data generation
- Database models from `@/server/db/models/Schema`
- User repository types from `@/server/db/repositories/user.repository`

## Best Practices

1. **Always cleanup after tests**: Use `cleanupTestUsers()` in `beforeEach` or `afterEach` hooks
2. **Use factories for validation tests**: When you don't need database insertion
3. **Use seed helpers for integration tests**: When you need actual database records
4. **Unique emails**: `seedTestUser()` automatically generates unique emails using timestamps
5. **Type safety**: All functions are fully typed with TypeScript for IDE autocomplete
