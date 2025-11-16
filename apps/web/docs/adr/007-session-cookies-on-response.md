# ADR-007: Session Cookies Must Be Set on Response Object

## Status
Accepted

## Date
2025-01-15

## Context

During E2E testing of the authentication flow, we discovered that users could successfully sign in (API returned 200 + session data), but subsequent requests to protected routes failed because the browser didn't receive the session cookie.

### The Problem
Initial implementation attempted to set cookies using Next.js's `cookies()` helper:

```typescript
// ❌ WRONG - Server-side only, doesn't send to browser
const cookieStore = await cookies();
cookieStore.set(SESSION_COOKIE, sessionId, {
  httpOnly: true,
  sameSite: 'lax',
  // ...
});
return NextResponse.json({ success: true });
```

This approach has a critical flaw: **the `cookies()` helper is for reading cookies server-side in subsequent requests, NOT for setting cookies in API responses.**

### Test Results Before Fix
- Sign-in API: ✅ Returns 200 OK
- Session created: ✅ Stored in memory
- Cookie sent to browser: ❌ **Missing Set-Cookie header**
- Dashboard access: ❌ ERR_ABORTED (redirects to sign-in)
- E2E tests: 8/11 passing (73%)

### Investigation
1. Checked browser DevTools → No Set-Cookie header in API response
2. Checked server logs → Session created successfully
3. Checked middleware → No session cookie in subsequent requests
4. **Root cause:** Cookies set via `cookies().set()` aren't included in HTTP response

### Next.js Cookie Behavior (App Router)
- `cookies()` from `next/headers` → Server-side reading/writing (RSC, Server Actions)
- `response.cookies.set()` → Sets HTTP Set-Cookie header for client

## Decision

**Always set session cookies on the `NextResponse` object**, not the `cookies()` helper.

### Correct Implementation
```typescript
// ✅ CORRECT - Sets Set-Cookie header in HTTP response
const response = NextResponse.json({
  success: true,
  user: { id, email, ... }
});

response.cookies.set(SESSION_COOKIE, sessionId, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
});

return response;
```

### When to Use Each API

| Use Case | API | Example |
|----------|-----|---------|
| **Set cookie in API route** | `response.cookies.set()` | POST /api/auth/signin |
| **Read cookie in API route** | `request.cookies.get()` | GET /api/user |
| **Read cookie in Server Component** | `cookies().get()` | Server Component |
| **Set cookie in Server Action** | `cookies().set()` | Form submission |

## Implementation

### Files Changed
- `src/app/api/test-auth/signin/route.ts:67-90`

### Before
```typescript
const cookieStore = await cookies();
cookieStore.set(SESSION_COOKIE, sessionId, { ... });

return NextResponse.json({ success: true, user });
```

### After
```typescript
const response = NextResponse.json({ success: true, user });
response.cookies.set(SESSION_COOKIE, sessionId, { ... });
return response;
```

## Consequences

### Positive
- ✅ Session cookies properly sent to browser
- ✅ E2E tests now pass authentication flow
- ✅ Dashboard accessible after sign-in
- ✅ Pattern applicable to all future API routes
- ✅ Clear distinction between server-side and client-side cookie handling

### Negative
- ⚠️ Easy to forget - developers might use `cookies().set()` by habit
- ⚠️ Not well-documented in Next.js docs (common gotcha)
- ⚠️ Must remember this pattern for:
  - Sign-up API
  - Session refresh API
  - OAuth callback handlers
  - Any API that sets authentication cookies

### Mitigation
1. Document this pattern in `CLAUDE.md`
2. Add ESLint rule to warn about `cookies().set()` in API routes
3. Create code snippet for VS Code
4. Add to PR review checklist

## Related

### Issues
- Sprint 4: E2E test failures (8/11 passing)
- Dashboard navigation: ERR_ABORTED

### Files
- `src/app/api/test-auth/signin/route.ts:82-88`
- `src/app/api/test-auth/signup/route.ts` (needs same fix)
- `src/libs/auth/adapters/TestAdapter.server.ts`

### Tests
- `tests/e2e/Auth.Navigation.e2e.ts:132` - Dashboard access after sign-in
- `tests/e2e/Auth.Navigation.e2e.ts:173` - User profile after auth
- `tests/e2e/Auth.Navigation.e2e.ts:244` - Full auth flow

### Documentation
- Next.js App Router: [Cookies](https://nextjs.org/docs/app/api-reference/functions/cookies)
- MDN: [Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)

## Compliance
- [x] Unit tests added
- [x] E2E tests updated
- [x] Sign-in API fixed
- [x] Documentation updated (this ADR)
- [ ] Sign-up API needs same fix
- [ ] ESLint rule to prevent future issues
- [ ] Code snippet for VS Code

## Future Work
1. Apply same fix to sign-up API
2. Create TypeScript utility function:
   ```typescript
   function createAuthResponse<T>(data: T, sessionId: string): NextResponse {
     const response = NextResponse.json(data);
     response.cookies.set(SESSION_COOKIE, sessionId, COOKIE_OPTIONS);
     return response;
   }
   ```
3. Add to shared auth utilities
