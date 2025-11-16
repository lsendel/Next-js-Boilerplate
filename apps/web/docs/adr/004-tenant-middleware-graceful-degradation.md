# ADR-004: Graceful Degradation for Tenant Middleware

## Status
Accepted

## Date
2025-01-15

## Context

Middleware executes on EVERY request, including during app startup when database migrations may not have run yet. This creates a timing problem:

1. **App starts** → Middleware initializes
2. **First request** → Middleware queries tenant tables
3. **Tables don't exist** → PostgreSQL error `42P01`
4. **App crashes** → "relation 'tenants' does not exist"

### The Problem

Tenant middleware needs to query database tables:
```typescript
const tenant = await db.query.tenants.findFirst({
  where: eq(tenants.slug, slug)
});
```

But migrations run AFTER middleware initializes:
```bash
npm run dev
  ├─ pglite-server starts
  ├─ Middleware initializes (queries tenant tables)
  ├─ Migrations run (creates tenant tables)  ❌ TOO LATE!
  └─ Error: relation "tenants" does not exist
```

### Impact

- ✅ Production: Works fine (tables exist)
- ❌ Fresh development: Crashes on first run
- ❌ CI builds: Fails during build
- ❌ Resets: `rm -rf local.db && npm run dev` → crash

## Decision

Implement **graceful degradation** by catching PostgreSQL error code `42P01` (relation does not exist) and falling back to a default tenant.

### Implementation

```typescript
const getTenantBySlug = async (slug: string) => {
  try {
    const result = await db.query.tenants.findFirst({
      where: eq(tenants.slug, slug)
    });
    return result ? mapTenantRecord(result) : null;
  } catch (error: any) {
    // Gracefully handle missing tenant tables
    if (error.code === '42P01' || error.cause?.code === '42P01') {
      // PostgreSQL error: "relation does not exist"
      return null; // Fall back to default tenant
    }
    throw error; // Re-throw other errors
  }
};
```

### Why Check Both `error.code` and `error.cause.code`?

Different PostgreSQL drivers wrap errors differently:
- `pg` library: `error.code = '42P01'`
- `node-postgres` with Drizzle: `error.cause.code = '42P01'`

Checking both ensures compatibility.

### Fallback Behavior

When tenant tables don't exist:
```typescript
const createDefaultTenant = (): TenantRecord => ({
  slug: DEFAULT_TENANT_SLUG,        // 'default'
  defaultLocale: routing.defaultLocale, // 'en'
  status: 'active',
});
```

App continues working with default tenant until migrations create tables.

## Implementation

### Files Changed

**`src/middleware/utils/tenant.ts:102-112` (getTenantBySlug)**
```typescript
} catch (error: any) {
  if (error.code === '42P01' || error.cause?.code === '42P01') {
    return null;
  }
  throw error;
}
```

**`src/middleware/utils/tenant.ts:139-149` (getTenantByDomain)**
```typescript
} catch (error: any) {
  if (error.code === '42P01' || error.cause?.code === '42P01') {
    return null;
  }
  throw error;
}
```

### Workflow After Fix

```
App starts → Middleware queries tenants table
              ↓ (table doesn't exist)
            Catch 42P01 error
              ↓
            Return null
              ↓
            Use default tenant
              ↓
          App works! ✅
              ↓
      Migrations run (creates tables)
              ↓
      Next request uses real tenant data
```

## Consequences

### Positive

✅ **No startup crashes**: App works even without tenant tables
✅ **Fresh installs work**: `npm run dev` succeeds on first run
✅ **CI friendly**: Builds don't fail during migration timing
✅ **Reset friendly**: `rm -rf local.db` workflow works
✅ **Progressive enhancement**: Starts simple, adds features as tables exist
✅ **No breaking changes**: Production unaffected (tables always exist)

### Negative

⚠️ **Silent failures**: Database errors for missing tables don't surface
⚠️ **Debugging complexity**: Need to know about graceful degradation
⚠️ **Default tenant assumptions**: Code must handle `DEFAULT_TENANT_SLUG`
⚠️ **Partial functionality**: Some features unavailable until migrations run

### Trade-offs

**Error Visibility**

Could log a warning:
```typescript
if (error.code === '42P01' || error.cause?.code === '42P01') {
  logger.warn('Tenant table does not exist, using default tenant');
  return null;
}
```

Decided against it because:
- Expected during normal startup
- Would spam logs unnecessarily
- Development experience suffers with noise

**Alternative: Check Table Existence**

Could check if tables exist before querying:
```typescript
const tableExists = await checkTableExists('tenants');
if (!tableExists) return createDefaultTenant();
```

Rejected because:
- Extra database query on every request
- Performance overhead
- Try/catch is idiomatic PostgreSQL pattern

## Related

### Files

- `src/middleware/utils/tenant.ts:85-150` - Tenant resolution with error handling
- `src/shared/constants/tenant.ts` - DEFAULT_TENANT_SLUG constant
- `src/middleware.ts:126` - Tenant resolution call site

### ADRs

- ADR-002: Middleware Execution Order (tenant resolution runs first)
- ADR-003: PGlite for Local Development (why migrations timing matters)
- ADR-006: Middleware Matcher Excludes API Routes

### PostgreSQL Error Codes

- `42P01` - Undefined Table ([PostgreSQL Documentation](https://www.postgresql.org/docs/current/errcodes-appendix.html))

## Compliance

- [x] Error handling implemented
- [x] Both error.code and error.cause.code checked
- [x] Default tenant fallback works
- [x] Tested with fresh database
- [x] Tested with missing tables
- [ ] Warning logs (deferred - would spam logs)
- [ ] Graceful degradation documentation

## Future Work

### Environment-Specific Logging

Log warnings only in development:
```typescript
if (error.code === '42P01' || error.cause?.code === '42P01') {
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Tenant table not yet created, using default');
  }
  return null;
}
```

### Health Check Endpoint

Add `/api/health` that reports tenant table status:
```json
{
  "status": "ok",
  "database": "connected",
  "tenantTablesExist": true
}
```

### Startup Validation

Optionally fail fast in production if tables don't exist:
```typescript
if (process.env.NODE_ENV === 'production' && error.code === '42P01') {
  throw new Error('Critical: Tenant tables missing in production');
}
```

## References

- [PostgreSQL Error Codes](https://www.postgresql.org/docs/current/errcodes-appendix.html)
- [Node.js Error Handling Best Practices](https://nodejs.org/en/docs/guides/error-handling/)
- [Graceful Degradation Pattern](https://en.wikipedia.org/wiki/Fault_tolerance)
