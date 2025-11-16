# ADR-006: Middleware Matcher Excludes API Routes

## Status
Accepted

## Date
2025-01-15

## Context

Next.js middleware runs on EVERY request by default, including API routes. This causes problems when middleware logic (tenant resolution, i18n routing) rewrites paths:

### The Problem

**Before Fix:**
```typescript
// Middleware matcher: '/(.*)'
// Every request goes through middleware, including /api

POST /api/test-auth/signin
  ↓
Middleware i18n routing
  ↓
Rewrites to: /en/api/test-auth/signin
  ↓
404 Not Found ❌
```

API routes were being rewritten with locale prefixes, breaking all API calls.

### Impact

- ✅ Regular pages: Work fine with i18n (`/about` → `/en/about`)
- ❌ API routes: Return 404 (`/api/signin` → `/en/api/signin` → 404)
- ❌ Sign-in: API calls fail, can't authenticate
- ❌ Sign-up: Same issue
- ❌ All POST requests: Can't reach API handlers

### Root Cause

i18n middleware (next-intl) rewrites paths to add locale:
```typescript
const handleI18nRouting = createMiddleware(routing);
// Automatically adds /:locale prefix to ALL paths
```

This is correct for pages (`/dashboard` → `/en/dashboard`), but breaks API routes.

## Decision

**Exclude `/api` routes from middleware matcher pattern.**

### Implementation

```typescript
// src/middleware.ts
export const config = {
  matcher: '/((?!api|_next|_vercel|monitoring|.*\\..*).*)',
  runtime: 'nodejs',
};
```

### Pattern Breakdown

```regexp
/((?!api|_next|_vercel|monitoring|.*\\..*).*)'
  │  │                                  │
  │  │                                  └─ Match any path
  │  └─ Negative lookahead: exclude these patterns
  └─ Root path
```

**Excluded patterns:**
- `api` - API routes (`/api/*`)
- `_next` - Next.js internal routes (`/_next/static/*`)
- `_vercel` - Vercel internal routes (`/_vercel/*`)
- `monitoring` - Sentry Spotlight (`/monitoring/*`)
- `.*\\..*` - Files with extensions (`favicon.ico`, `robots.txt`)

### Before vs After

**Before:**
```
GET /api/test-auth/signin
  ↓ Middleware runs
  ↓ i18n rewrites to /en/api/test-auth/signin
  ↓ 404 Not Found ❌
```

**After:**
```
GET /api/test-auth/signin
  ↓ Middleware skipped (excluded by matcher)
  ↓ Direct to API route handler
  ↓ 200 OK ✅
```

## Implementation

### Middleware Configuration

```typescript
// src/middleware.ts
export const config = {
  // Match all pathnames EXCEPT:
  // - Starting with /api
  // - Starting with /_next (Next.js internals)
  // - Starting with /_vercel (Vercel internals)
  // - Starting with /monitoring (Sentry Spotlight)
  // - Containing a dot (static files like .ico, .png)
  matcher: '/((?!api|_next|_vercel|monitoring|.*\\..*).*)',
  runtime: 'nodejs',
};
```

### Testing the Pattern

```typescript
// Test cases
const shouldMatch = [
  '/',
  '/dashboard',
  '/en/dashboard',
  '/sign-in',
  '/about',
];

const shouldNotMatch = [
  '/api/signin',
  '/api/test-auth/signin',
  '/_next/static/chunks/main.js',
  '/_vercel/insights/script.js',
  '/monitoring',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];
```

## Consequences

### Positive

✅ **API routes work**: No locale rewriting
✅ **Authentication fixed**: `/api/test-auth/signin` accessible
✅ **Performance**: Skip middleware for static files
✅ **Correct behavior**: i18n only applies to pages
✅ **Vercel compatible**: `/_vercel` routes excluded
✅ **Sentry Spotlight**: `/monitoring` accessible

### Negative

⚠️ **No middleware for API routes**: Auth middleware doesn't run on API routes
⚠️ **Manual protection**: API routes must validate auth themselves
⚠️ **Pattern complexity**: Regex harder to understand
⚠️ **Documentation needed**: Must document why API excluded

### Trade-offs

**API Route Protection**

API routes excluded from auth middleware, so they must validate auth manually:

```typescript
// src/app/api/protected/route.ts
import { getCurrentUser } from '@/libs/auth';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Protected logic
}
```

This is actually better because:
- API routes have different auth requirements than pages
- More explicit and testable
- Avoids redirect loops (API should return 401, not redirect)

**Alternative: Conditional Middleware**

Could check path in middleware:
```typescript
export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  // ... rest of middleware
}
```

Rejected because:
- Middleware still executes (performance overhead)
- Matcher is idiomatic Next.js approach
- Better separation of concerns

## Related

### Files

- `src/middleware.ts:214-220` - Middleware config
- `src/libs/I18nRouting.ts` - i18n routing config
- `src/app/api/test-auth/signin/route.ts` - Example API route

### ADRs

- ADR-002: Middleware Execution Order (explains full middleware flow)
- ADR-007: Session Cookies Must Be Set on Response Object (related to API routes)

### Issues

- ~~Sign-in returns 404~~ (Fixed by excluding /api from matcher)
- ~~API routes return 404~~ (Fixed)

## Compliance

- [x] Matcher pattern excludes /api routes
- [x] Matcher excludes /_next internals
- [x] Matcher excludes static files
- [x] API routes accessible
- [x] E2E tests pass
- [x] Documentation updated
- [ ] API route auth validation guidelines
- [ ] Integration tests for matcher pattern

## Future Work

### API Route Auth Middleware

Create utility for API route auth validation:

```typescript
// src/libs/auth/api.ts
export async function requireAuth(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    throw new ApiError('Unauthorized', 401);
  }
  return user;
}

// Usage
export async function GET(request: NextRequest) {
  const user = await requireAuth(request);
  // Protected logic
}
```

### Pattern Testing

Add tests to ensure matcher pattern works correctly:

```typescript
// tests/middleware.test.ts
describe('Middleware Matcher', () => {
  it('should exclude /api routes', () => {
    expect(matchesPattern('/api/signin')).toBe(false);
  });

  it('should include page routes', () => {
    expect(matchesPattern('/dashboard')).toBe(true);
  });
});
```

### Documentation

Document in CLAUDE.md:

```markdown
## API Route Authentication

Middleware does NOT run on `/api` routes. API routes must validate auth manually:

\`\`\`typescript
import { getCurrentUser } from '@/libs/auth';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // ... protected logic
}
\`\`\`
```

## References

- [Next.js Middleware Matcher](https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher)
- [Regular Expression Lookahead](https://www.regular-expressions.info/lookaround.html)
- [next-intl Middleware](https://next-intl-docs.vercel.app/docs/routing/middleware)
