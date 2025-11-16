# ADR-005: Test Auth Adapter Design

## Status
Accepted

## Date
2024-12-01

## Context

E2E tests need authentication to test protected routes (dashboard, user profile). Using real authentication providers (Clerk, Cloudflare) in tests creates problems:

### Problems with Real Auth Providers

**Clerk:**
- ❌ Requires API keys (test mode or production)
- ❌ External API dependency (flaky tests if network issues)
- ❌ Rate limiting in test environments
- ❌ Complex UI interactions (CAPTCHA, email verification)
- ❌ Can't run fully offline or in air-gapped CI
- ❌ Slower (network round trips)

**Cloudflare Access:**
- ❌ Requires Cloudflare Zero Trust setup
- ❌ Can't run locally without Cloudflare tunnel
- ❌ Complex JWT validation
- ❌ External dependencies

**AWS Cognito:**
- ❌ Requires AWS account and user pool setup
- ❌ Complex OAuth flows
- ❌ External service dependency

### Requirements for Testing

1. **Fast**: No network calls, instant sign-in
2. **Simple**: No complex UI flows
3. **Offline**: Works without internet
4. **No external deps**: No API keys required
5. **Predictable**: Same behavior every time
6. **Isolated**: Each test gets clean state
7. **Multi-provider compatible**: Works with adapter pattern

## Decision

Create a **Test Auth Adapter** that implements `IAuthAdapter` with:

1. **Simple form-based auth** (email + password)
2. **In-memory storage** for users and sessions
3. **No external dependencies**
4. **No hashing** (plaintext passwords - test mode only!)
5. **Auto-creates users** on sign-in (Clerk test mode behavior)

### Architecture

```
NEXT_PUBLIC_AUTH_PROVIDER=test
         ↓
   AuthFactory creates TestAdapter
         ↓
TestAdapter stores data in memory:
  - Map<userId, User>
  - Map<sessionId, userId>
         ↓
Sign-in via API: POST /api/test-auth/signin
         ↓
Session cookie set (same as production)
         ↓
Middleware validates session
         ↓
Protected routes accessible
```

## Implementation

### Test Adapter

```typescript
// src/libs/auth/adapters/TestAdapter.tsx
export class TestAdapter implements IAuthAdapter {
  async getCurrentUser(): Promise<AuthUser | null> {
    const sessionCookie = cookies().get(SESSION_COOKIE);
    if (!sessionCookie) return null;

    const userId = sessions.get(sessionCookie.value);
    if (!userId) return null;

    return users.get(userId) ?? null;
  }

  // ... other IAuthAdapter methods
}
```

### In-Memory Storage

```typescript
// src/libs/auth/adapters/TestAdapter.server.ts
export const users = new Map<string, TestUser>();
export const sessions = new Map<string, string>(); // sessionId → userId

export const SESSION_COOKIE = '__test_session';
```

### Sign-In API Route

```typescript
// src/app/api/test-auth/signin/route.ts
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Find or create user (auto-create like Clerk test mode)
  let user = findUserByEmail(email);
  if (!user) {
    user = createUser({ email, password });
  } else if (user.password !== password) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  // Create session
  const sessionId = `session_${Date.now()}_${Math.random()}`;
  sessions.set(sessionId, user.id);

  // Set session cookie
  const response = NextResponse.json({ success: true, user });
  response.cookies.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
```

### UI Components

```typescript
// Simple form (no external UI library)
export function TestSignInForm() {
  return (
    <form action="/api/test-auth/signin" method="POST">
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

### Usage in Tests

```typescript
// tests/e2e/Auth.e2e.ts
test('user can sign in and access dashboard', async ({ page }) => {
  await page.goto('/sign-in');

  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Dashboard')).toBeVisible();
});
```

## Consequences

### Positive

✅ **Fast tests**: No network calls, instant auth (~50ms vs ~2s)
✅ **No API keys**: Works with zero configuration
✅ **Offline**: Runs without internet
✅ **Simple UI**: Plain HTML form, easy to test
✅ **Predictable**: Deterministic behavior
✅ **Isolated**: In-memory storage, no shared state
✅ **CI friendly**: No external dependencies
✅ **Production parity**: Same middleware/cookie flow as real auth

### Negative

⚠️ **Insecure**: NEVER use in production (plaintext passwords!)
⚠️ **Limited features**: No OAuth, MFA, email verification
⚠️ **In-memory only**: Data lost on server restart
⚠️ **Not suitable for load testing**: No persistent storage
⚠️ **Manual cleanup**: Tests must clear state between runs

### Trade-offs

**Security vs Speed**

Plaintext passwords acceptable because:
- Only used in E2E tests
- Never exposed to network
- Clearly marked as test-only
- Environment variable prevents accidental production use

**Feature Completeness vs Simplicity**

Test adapter is minimal:
- No password reset
- No email verification
- No social auth
- No MFA

This is intentional - tests focus on app logic, not auth features.

## Related

### Files

- `src/libs/auth/adapters/TestAdapter.tsx` - Main adapter
- `src/libs/auth/adapters/TestAdapter.server.ts` - Storage
- `src/libs/auth/adapters/TEST_ADAPTER_README.md` - Documentation
- `src/app/api/test-auth/signin/route.ts` - Sign-in endpoint
- `tests/e2e/Auth.e2e.ts` - E2E tests using test adapter

### ADRs

- ADR-001: Multi-Provider Auth Architecture (adapter pattern)
- ADR-007: Session Cookies Must Be Set on Response Object

### Security

**CRITICAL: DO NOT USE IN PRODUCTION**

```typescript
// Validation in middleware
if (process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PUBLIC_AUTH_PROVIDER === 'test') {
  throw new Error('TestAdapter cannot be used in production!');
}
```

## Compliance

- [x] TestAdapter implements IAuthAdapter
- [x] In-memory storage for users/sessions
- [x] Auto-creates users on sign-in
- [x] Session cookie handling
- [x] E2E tests pass
- [x] Documentation (TEST_ADAPTER_README.md)
- [x] Production validation (throws error if used in prod)
- [ ] Integration tests for adapter
- [ ] State cleanup utilities

## Future Work

### Test Data Factories

```typescript
// tests/utils/test-auth.ts
export function createTestUser(overrides?: Partial<TestUser>) {
  return {
    id: `user_${Date.now()}`,
    email: `test-${Date.now()}@example.com`,
    ...overrides,
  };
}
```

### Cleanup Utilities

```typescript
// tests/utils/test-auth.ts
export function clearAllSessions() {
  sessions.clear();
}

export function clearAllUsers() {
  users.clear();
}
```

### Seeding

```typescript
// tests/utils/test-auth.ts
export function seedTestUsers(count: number) {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(createTestUser({ email: `user${i}@test.com` }));
  }
  return users;
}
```

## References

- [Test Double Pattern](https://martinfowler.com/bliki/TestDouble.html)
- [In-Memory Testing](https://kentcdodds.com/blog/unit-vs-integration-vs-e2e-tests)
- Adapter Pattern (ADR-001)
