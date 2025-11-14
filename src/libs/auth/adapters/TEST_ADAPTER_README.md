# Test Authentication Adapter

A simple, form-based authentication adapter for E2E testing purposes.

## WARNING

**DO NOT USE IN PRODUCTION!** This adapter stores passwords in plain text in memory and is designed exclusively for E2E testing environments.

## Features

- Simple email/password authentication
- In-memory user storage (cleared on server restart)
- Session management with HTTP cookies
- Form validation (email format, password length)
- Duplicate email detection
- Sign in, sign up, and sign out flows
- User profile page

## Activation

Set the following environment variable:

```bash
NEXT_PUBLIC_AUTH_PROVIDER=test
```

Or in your `.env` file:

```env
NEXT_PUBLIC_AUTH_PROVIDER=test
```

## Usage in E2E Tests

### Playwright Example

```typescript
import { test, expect } from '@playwright/test';

test('should sign up and sign in', async ({ page }) => {
  // Sign up
  await page.goto('/sign-up');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.fill('input[name="confirm-password"]', 'password123');
  await page.click('button[type="submit"]');

  // Should redirect to dashboard
  await expect(page).toHaveURL(/\/dashboard/);

  // Sign out
  await page.click('text=Sign Out');

  // Sign in
  await page.goto('/sign-in');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Should redirect to dashboard
  await expect(page).toHaveURL(/\/dashboard/);
});
```

## Form Elements

### Sign In Form

- **Email input**: `input[name="email"]` with label "Email"
- **Password input**: `input[name="password"]` with label "Password"
- **Submit button**: `button[type="submit"]` with text "Sign In"
- **Sign up link**: Link with text "Sign up"
- **Error messages**: `div[role="alert"]`

### Sign Up Form

- **Email input**: `input[name="email"]` with label "Email"
- **Password input**: `input[name="password"]` with label "Password"
- **Confirm password input**: `input[name="confirm-password"]` with label "Confirm Password"
- **Submit button**: `button[type="submit"]` with text "Sign Up"
- **Sign in link**: Link with text "Sign in"
- **Error messages**: `div[role="alert"]`

## Validation Rules

- **Email**: Must be a valid email format (contains @)
- **Password**: Minimum 8 characters
- **Sign Up**: Passwords must match
- **Sign Up**: Email must not already exist

## API Routes

The adapter uses the following API routes:

- `POST /api/test-auth/signin` - Set session cookie
- `POST /api/test-auth/signout` - Clear session cookie
- `GET /api/auth/user` - Get current user (shared with other adapters)

## Implementation Details

### User Storage

Users are stored in an in-memory `Map<string, TestUser>`:

```typescript
interface TestUser {
  id: string;
  email: string;
  password: string; // Plain text - NEVER do this in production!
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
}
```

### Session Storage

Sessions are stored in an in-memory `Map<string, string>` (sessionId -> userId):

```typescript
const sessions = new Map<string, string>();
```

### Cookie Management

Session cookies are named `test-auth-session` and have the following properties:

- **httpOnly**: true
- **secure**: true (in production)
- **sameSite**: 'lax'
- **maxAge**: 7 days
- **path**: '/'

## Limitations

1. **No persistence**: All data is cleared on server restart
2. **No password hashing**: Passwords stored in plain text
3. **No rate limiting**: No protection against brute force attacks
4. **No session expiration**: Sessions last until manual sign out or server restart
5. **Single server only**: Not suitable for multi-server deployments
6. **No security features**: No 2FA, no password reset, no email verification

## When to Use

- ✅ E2E testing in CI/CD pipelines
- ✅ Local development testing
- ✅ Playwright or Cypress tests
- ❌ Production environments
- ❌ Staging environments with real data
- ❌ Any environment with sensitive data

## Switching Back to Production Auth

To switch back to your production auth provider:

```bash
# For Clerk
NEXT_PUBLIC_AUTH_PROVIDER=clerk

# For Cloudflare Access
NEXT_PUBLIC_AUTH_PROVIDER=cloudflare

# For AWS Cognito
NEXT_PUBLIC_AUTH_PROVIDER=cognito
```

## Cleanup

The test adapter automatically cleans up on server restart. For long-running test suites, you may want to manually clear the storage between tests by restarting the dev server.
