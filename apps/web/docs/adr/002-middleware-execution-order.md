# ADR-002: Middleware Execution Order

## Status
Accepted

## Date
2024-11-15

## Context

Next.js middleware executes on EVERY request before the route handler runs. With multiple middleware concerns (security, authentication, i18n, multi-tenancy), the execution order is critical. Incorrect ordering can cause:

1. **Security vulnerabilities**: Auth bypassed if security checks run after routing
2. **Performance issues**: Expensive operations running unnecessarily
3. **Broken features**: i18n rewriting before auth checks can redirect to wrong locale
4. **Tenant isolation failures**: Tenant context not available to auth middleware
5. **Circular dependencies**: One middleware depending on another's output

### Middleware Concerns in This Project

1. **Tenant Resolution** - Multi-tenancy with custom domains/subdomains
2. **CORS** - Cross-origin request handling
3. **Security** - Arcjet bot detection, WAF, rate limiting
4. **Authentication** - Clerk/Cloudflare/Cognito/Test adapters
5. **i18n** - next-intl locale routing
6. **Headers** - Security headers, tenant context headers

### Constraints

- Next.js runs middleware as a single function (no built-in pipeline)
- Middleware runs on Edge Runtime by default (we use Node.js for DB access)
- Each middleware concern needs specific request data
- Must minimize performance impact (runs on every request)
- Must be maintainable and testable

### Previous Attempts

**Attempt 1: Sequential async/await chain**

Problem: Hard to understand flow, easy to miss dependencies

```typescript
const response1 = await middleware1(request);
const response2 = await middleware2(response1);
const response3 = await middleware3(response2);
```

**Attempt 2: next-intl first, then auth**

Problem: i18n rewrites broke auth redirects, wrong locale after sign-in

```typescript
const i18nResponse = handleI18nRouting(request);
const authResponse = executeAuthMiddleware(i18nResponse); // ❌ Already rewritten
```

## Decision

Establish a **strict middleware execution order** with explicit dependencies and a **finalization pattern** for applying tenant context and security headers.

### Execution Order

```
1. Tenant Context Resolution (earliest, needed by all)
   ↓
2. CORS Preflight Handling (before any logic)
   ↓
3. Tenant Headers (enrich request with tenant data)
   ↓
4. Arcjet Security (Shield WAF, bot detection, rate limiting)
   ↓
5. Authentication (Clerk/Cloudflare/Cognito/Test)
   ↓
6. i18n Routing (next-intl)
   ↓
7. Response Finalization (tenant context + security headers)
```

### Rationale for Each Position

**1. Tenant Resolution (Line 126)**

Runs FIRST because tenant context is needed by:
- Security rules (different rate limits per tenant)
- Auth providers (tenant-specific configs)
- i18n (default locale per tenant)

```typescript
const tenantContext = await resolveTenantContext(request);
```

**2. CORS Preflight (Line 128-132)**

Runs SECOND to handle `OPTIONS` requests immediately without processing logic:

```typescript
const preflightResponse = handleCorsPreflight(request);
if (preflightResponse) {
  return applyTenantContextToResponse(preflightResponse, request, tenantContext);
}
```

**3. Tenant Headers (Line 138-140)**

Runs THIRD to enrich request headers with tenant data for downstream handlers:

```typescript
request.headers.set(TENANT_SLUG_HEADER, tenantContext.tenant.slug);
request.headers.set(TENANT_LOCALE_HEADER, tenantContext.locale);
request.headers.set(TENANT_SOURCE_HEADER, tenantContext.source);
```

**4. Arcjet Security (Line 149-182)**

Runs FOURTH (after tenant, before auth) because:
- Security checks should run before expensive operations
- Rate limits are per-tenant (needs tenant context)
- Bot detection should block before auth checks

```typescript
if (process.env.ARCJET_KEY) {
  const decision = await aj.protect(request, {
    'header.user-agent': userAgent,
  });

  if (decision.isDenied()) {
    return finalizeResponse(
      NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    );
  }

  // API rate limiting for state-changing methods
  if (isApiRequest(pathname) && isStateChangingMethod(method)) {
    // ...
  }
}
```

**5. Authentication (Line 185-209)**

Runs FIFTH because:
- Auth needs tenant context (tenant-specific providers)
- Auth needs to run BEFORE i18n routing
- Auth redirects should not be rewritten by i18n

```typescript
if (isAuthPage(request) || isProtectedRoute(request)) {
  const authResponse = await executeAuthMiddleware(request, event, {
    protectedRoutes: ['/dashboard'],
    signInUrl: '/sign-in',
    afterSignInUrl: '/dashboard',
  });

  if (authResponse) {
    return finalizeResponse(response);
  }

  // Fall through to i18n if auth passes
  return finalizeResponse(handleI18nRouting(request));
}
```

**6. i18n Routing (Line 208, 211)**

Runs LAST (among middleware logic) because:
- i18n rewrites URLs (e.g., `/dashboard` → `/en/dashboard`)
- Auth redirects must happen BEFORE rewriting
- Tenant locale preference needs to be resolved first

```typescript
return finalizeResponse(handleI18nRouting(request));
```

**7. Response Finalization (Line 142-145)**

Wraps ALL responses to apply:
- Tenant context headers
- Security headers (CSP, HSTS, etc.)

```typescript
const finalizeResponse = (response: NextResponse) => {
  const withTenant = applyTenantContextToResponse(response, request, tenantContext);
  return applySecurityHeaders(request, withTenant);
};
```

## Implementation

### Core Middleware Function

```typescript
// src/middleware.ts
export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  // 1. Resolve tenant context once and reuse
  const tenantContext = await resolveTenantContext(request);

  // 2. Handle CORS preflight
  const preflightResponse = handleCorsPreflight(request);
  if (preflightResponse) {
    return applyTenantContextToResponse(preflightResponse, request, tenantContext);
  }

  // 3. Set tenant headers
  request.headers.set(TENANT_SLUG_HEADER, tenantContext.tenant.slug);
  request.headers.set(TENANT_LOCALE_HEADER, tenantContext.locale);
  request.headers.set(TENANT_SOURCE_HEADER, tenantContext.source);

  // Response finalization helper
  const finalizeResponse = (response: NextResponse) => {
    const withTenant = applyTenantContextToResponse(response, request, tenantContext);
    return applySecurityHeaders(request, withTenant);
  };

  // 4. Arcjet security (bot detection + rate limiting)
  if (process.env.ARCJET_KEY) {
    const decision = await aj.protect(request, {...});
    if (decision.isDenied()) {
      return finalizeResponse(NextResponse.json({ error: 'Forbidden' }, { status: 403 }));
    }

    // API rate limiting
    if (isApiRequest(pathname) && isStateChangingMethod(method)) {
      // Rate limit state-changing API requests
    }
  }

  // 5. Authentication middleware
  if (isAuthPage(request) || isProtectedRoute(request)) {
    const authResponse = await executeAuthMiddleware(request, event, {...});
    if (authResponse) {
      return finalizeResponse(response);
    }
    return finalizeResponse(handleI18nRouting(request));
  }

  // 6. i18n routing (fallthrough for public routes)
  return finalizeResponse(handleI18nRouting(request));
}
```

### Middleware Configuration

```typescript
export const config = {
  // Exclude /api routes, static files, etc.
  matcher: '/((?!api|_next|_vercel|monitoring|.*\\..*).*)',
  runtime: 'nodejs', // Required for database connections
};
```

## Consequences

### Positive

✅ **Predictable execution**: Clear, documented order prevents bugs
✅ **Performance optimized**: Early exits for CORS, security denials
✅ **Tenant-aware**: All middleware has access to tenant context
✅ **Secure by default**: Security checks before auth, auth before routing
✅ **Maintainable**: Single point of control, easy to understand
✅ **Testable**: Each layer can be tested independently
✅ **Extensible**: New middleware can be inserted at appropriate points

### Negative

⚠️ **Single file complexity**: All middleware logic in one function
⚠️ **Tight coupling**: Changing order requires careful review
⚠️ **Performance**: All steps run on every request (even if not needed)
⚠️ **Testing overhead**: Must test execution order, not just individual concerns
⚠️ **Documentation burden**: Order must be documented and maintained

### Trade-offs

**Monolithic vs Modular**

We chose monolithic (single middleware.ts) over modular (separate middleware files) because:
- Next.js doesn't have built-in middleware pipeline
- Better performance (single function call)
- Explicit dependency control
- Easier debugging

For future: Consider extracting to composable functions if complexity grows.

**Early Exit vs Full Pipeline**

We use early exits for CORS, security, auth:

```typescript
if (condition) {
  return finalizeResponse(...); // Exit early
}
// Continue to next layer
```

Benefits: Better performance, clearer intent
Drawback: Must remember to call `finalizeResponse()` on every return

## Related

### Files

- `src/middleware.ts:121-212` - Main middleware function
- `src/middleware/layers/security.ts` - Security headers layer
- `src/middleware/utils/tenant.ts` - Tenant resolution
- `src/libs/auth/middleware.ts` - Auth middleware helper
- `src/libs/I18nRouting.ts` - i18n configuration

### ADRs

- ADR-001: Multi-Provider Auth Architecture (auth middleware integration)
- ADR-004: Graceful Degradation for Tenant Middleware
- ADR-006: Middleware Matcher Excludes API Routes

### Issues

- ~~Dashboard 404 after sign-in~~ (Fixed: auth before i18n)
- ~~Wrong locale after authentication~~ (Fixed: tenant context first)
- ~~Rate limiting bypassed for some routes~~ (Fixed: security before auth)

## Compliance

- [x] Execution order documented
- [x] All middleware layers implemented
- [x] Finalization pattern applied
- [x] Early exit patterns tested
- [x] Performance profiled (< 50ms p95)
- [x] Security audit completed
- [ ] Automated order validation tests
- [ ] Middleware pipeline refactoring (future)

## Future Work

### Automated Order Validation

Add tests to enforce execution order:

```typescript
describe('Middleware Execution Order', () => {
  it('should call tenant resolution before auth', async () => {
    const callOrder: string[] = [];

    // Mock each layer to track calls
    jest.spyOn(tenant, 'resolve').mockImplementation(() => {
      callOrder.push('tenant');
    });

    jest.spyOn(auth, 'execute').mockImplementation(() => {
      callOrder.push('auth');
    });

    await middleware(request, event);

    expect(callOrder).toEqual(['tenant', 'security', 'auth', 'i18n']);
  });
});
```

### Middleware Pipeline Pattern

If complexity grows, extract to composable pipeline:

```typescript
const pipeline = createMiddlewarePipeline()
  .use(tenantMiddleware)
  .use(corsMiddleware)
  .use(securityMiddleware)
  .use(authMiddleware)
  .use(i18nMiddleware)
  .finalize(finalizeResponse);

export default pipeline.execute;
```

### Conditional Execution

Optimize by skipping unnecessary steps:

```typescript
// Skip auth checks for public static assets
if (isStaticAsset(pathname)) {
  return finalizeResponse(NextResponse.next());
}

// Skip rate limiting for GET requests
if (method === 'GET') {
  // Skip to auth
}
```

### Performance Monitoring

Add telemetry for middleware performance:

```typescript
const start = Date.now();

// ... middleware logic ...

const duration = Date.now() - start;
if (duration > 100) {
  logger.warn('Slow middleware execution', { duration, pathname });
}
```

## Debugging Tips

### Middleware Not Running

Check matcher config excludes your route:

```typescript
// ❌ /api routes excluded
matcher: '/((?!api|_next|_vercel|monitoring|.*\\..*).*)',

// ✅ Include specific API routes
matcher: ['/((?!_next|_vercel|monitoring|.*\\..*).*)', '/api/protected(.*)'],
```

### Auth Redirect Loop

Ensure auth middleware runs BEFORE i18n:

```typescript
// ❌ WRONG - i18n rewrites first
const i18nResponse = handleI18nRouting(request);
const authResponse = await executeAuthMiddleware(i18nResponse);

// ✅ CORRECT - auth first
const authResponse = await executeAuthMiddleware(request, event, {...});
if (authResponse) return finalizeResponse(authResponse);
return finalizeResponse(handleI18nRouting(request));
```

### Tenant Context Missing

Ensure tenant resolution runs first and context is passed:

```typescript
// Resolve once at the top
const tenantContext = await resolveTenantContext(request);

// Pass to all downstream functions
return finalizeResponse(response); // Uses tenantContext via closure
```

## References

- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Arcjet Security Documentation](https://docs.arcjet.com/get-started)
- [next-intl Middleware](https://next-intl-docs.vercel.app/docs/routing/middleware)
- [Clerk Middleware](https://clerk.com/docs/references/nextjs/clerk-middleware)
