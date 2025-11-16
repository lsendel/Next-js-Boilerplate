# Test Gap Analysis

> **Last Updated**: 2025-11-16
> **Purpose**: Identify and prioritize missing test coverage
> **Related**: [Integration Test Matrix](./integration-test-matrix.md)

## Executive Summary

**Overall Test Health**: 🟡 **Moderate**

- ✅ **Strengths**: Strong E2E coverage for Test Auth adapter, Counter example fully tested
- ⚠️ **Concerns**: 44% E2E test failure rate (42/95 failing), minimal integration tests
- ❌ **Critical Gaps**: No unit tests, limited auth provider coverage, untested monitoring stack

### Priority Breakdown
- **P0 (Critical)**: 3 gaps - Fix failing tests, add auth provider tests, integration test coverage
- **P1 (High)**: 6 gaps - Middleware, monitoring, security, error handling
- **P2 (Medium)**: 5 gaps - Webkit support, visual regression, multi-locale
- **P3 (Low)**: 4 gaps - Unit tests, performance, accessibility, documentation

---

## P0: Critical Gaps (Must Fix)

### 1. Failing E2E Tests
**Status**: 🔴 **Blocker**
**Impact**: High - Prevents confident deploys
**Effort**: Varies (1-5 days total)

**Details**:
- 42 out of 95 E2E tests currently failing (44% failure rate)
- Affects: Auth.SignIn, Auth.SignUp, Dashboard, I18n, Visual, TenantRouting

**Root Causes** (suspected):
1. Test environment inconsistencies
2. Timing issues (race conditions)
3. Stale selectors (UI changes not reflected in tests)
4. Environment variable misconfigurations
5. Database state pollution between tests

**Recommendation**:
```bash
# Phase 1: Triage (1 day)
- Run each failing test in isolation
- Identify patterns in failures
- Categorize by root cause

# Phase 2: Fix (2-3 days)
- Address timing/race conditions
- Update selectors
- Fix environment setup
- Add test isolation/cleanup

# Phase 3: Stabilize (1 day)
- Add retries for genuinely flaky tests
- Improve error messages
- Document known issues
```

**Success Criteria**:
- [ ] <10% test failure rate (goal: 95% passing)
- [ ] All auth flow tests passing
- [ ] CI pipeline green on main branch

---

### 2. Auth Provider Test Coverage Disparity
**Status**: 🔴 **Critical**
**Impact**: High - Risk deploying untested auth providers
**Effort**: 3-4 days

**Details**:
- **Test Adapter**: ✅ 95% coverage (full E2E suite)
- **Clerk**: ⚠️ 40% coverage (manual testing only)
- **Cloudflare**: ⚠️ 20% coverage (basic implementation)
- **Cognito**: ❌ 10% coverage (stub only)

**Recommendation**:
Create E2E test suites for each auth provider:

```typescript
// tests/e2e/Auth.Clerk.e2e.ts
describe('Clerk Authentication', () => {
  test('should sign in with Clerk', async ({ page }) => {
    // Use Clerk's test user accounts
    // Or mock Clerk API responses
  });
});

// tests/e2e/Auth.Cloudflare.e2e.ts
describe('Cloudflare Access Authentication', () => {
  test('should validate JWT token', async ({ page }) => {
    // Mock CF Access headers
  });
});
```

**Options**:
1. **Full E2E** (Recommended): Test against real providers using test accounts
2. **Mocked E2E**: Mock auth provider APIs for faster, isolated tests
3. **Integration Only**: Test adapter integration points without full flows

**Success Criteria**:
- [ ] Clerk E2E suite (sign-in, sign-up, sign-out, protected routes)
- [ ] Cloudflare E2E suite (JWT validation, user info, sign-out)
- [ ] Cognito implementation completed with tests
- [ ] CI tests all providers (conditional based on env vars)

---

### 3. Integration Test Coverage
**Status**: 🔴 **Critical**
**Impact**: High - API routes untested
**Effort**: 2-3 days

**Details**:
- Currently: 1 integration test file (Counter.spec.ts)
- Missing: Auth APIs, middleware, error handling, database operations

**Gaps**:
```
Missing Integration Tests:
├── API Routes
│   ├── /api/test-auth/signin ❌
│   ├── /api/test-auth/signup ❌
│   ├── /api/test-auth/signout ❌
│   ├── /api/test-auth/user ❌
│   └── /api/counter ✅ (exists)
├── Middleware Stack
│   ├── Auth protection ❌
│   ├── I18n routing ❌
│   └── Arcjet integration ❌
├── Database
│   ├── Schema validation ❌
│   ├── Migrations ❌
│   └── CRUD operations ⚠️ (partial via Counter)
└── Error Handling
    ├── API error responses ❌
    ├── Error boundaries ❌
    └── Sentry integration ❌
```

**Recommendation**:
```typescript
// tests/integration/api/auth.spec.ts
describe('Auth API Routes', () => {
  test('POST /api/test-auth/signup creates user', async () => {
    const response = await fetch('/api/test-auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      })
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      success: true,
      user: { email: 'test@example.com' }
    });
  });
});

// tests/integration/middleware/auth.spec.ts
describe('Auth Middleware', () => {
  test('redirects unauthenticated users from /dashboard', async () => {
    // Test middleware behavior
  });
});
```

**Success Criteria**:
- [ ] Integration tests for all API routes
- [ ] Middleware integration tests
- [ ] Database integration tests
- [ ] 80%+ coverage for API layer

---

## P1: High Priority Gaps

### 4. Middleware Testing
**Status**: 🟡 **High Priority**
**Impact**: Medium-High - Core functionality untested
**Effort**: 1-2 days

**Details**:
The middleware stack has 3 layers, all untested:
1. Arcjet (bot detection, Shield WAF)
2. Auth protection (Clerk/Cloudflare/Test)
3. I18n routing (next-intl)

**Recommendation**:
```typescript
// tests/integration/middleware.spec.ts
describe('Middleware Stack', () => {
  describe('Arcjet', () => {
    test('blocks known bots');
    test('allows legitimate traffic');
    test('applies Shield WAF rules');
  });

  describe('Auth Protection', () => {
    test('redirects to sign-in for protected routes');
    test('allows access with valid session');
    test('preserves return URL');
  });

  describe('I18n Routing', () => {
    test('redirects / to /en');
    test('preserves locale in navigation');
    test('handles locale switching');
  });
});
```

**Success Criteria**:
- [ ] Middleware integration tests created
- [ ] All 3 layers tested in isolation
- [ ] Combined middleware stack tested

---

### 5. Monitoring & Error Tracking
**Status**: 🟡 **High Priority**
**Impact**: Medium - Production observability at risk
**Effort**: 1 day

**Details**:
Monitoring stack is configured but untested:
- Sentry: Error tracking and performance monitoring
- PostHog: Analytics and feature flags
- LogTape: Structured logging
- Better Stack: Log aggregation

**Recommendation**:
```typescript
// tests/integration/monitoring/sentry.spec.ts
describe('Sentry Integration', () => {
  test('captures unhandled exceptions');
  test('sends error context (user, breadcrumbs)');
  test('filters sensitive data');
});

// tests/integration/monitoring/posthog.spec.ts
describe('PostHog Integration', () => {
  test('tracks page views');
  test('sends custom events');
  test('identifies users');
});

// tests/integration/logging/logtape.spec.ts
describe('LogTape', () => {
  test('logs at correct levels');
  test('includes structured context');
  test('ships to Better Stack in production');
});
```

**Success Criteria**:
- [ ] Sentry error capture tested
- [ ] PostHog event tracking tested
- [ ] LogTape logging tested
- [ ] CI verifies monitoring integrations

---

### 6. Security Features (Arcjet)
**Status**: 🟡 **High Priority**
**Impact**: Medium - Security features unverified
**Effort**: 1-2 days

**Details**:
Arcjet provides:
- Shield WAF (SQL injection, XSS protection)
- Bot detection
- Rate limiting (not yet implemented)

None of these are tested.

**Recommendation**:
```typescript
// tests/integration/security/arcjet.spec.ts
describe('Arcjet Security', () => {
  describe('Shield WAF', () => {
    test('blocks SQL injection attempts');
    test('blocks XSS attempts');
    test('allows safe requests');
  });

  describe('Bot Detection', () => {
    test('blocks automated scrapers');
    test('allows search engine crawlers');
    test('challenges suspicious requests');
  });
});
```

**Success Criteria**:
- [ ] Shield WAF protection verified
- [ ] Bot detection tested
- [ ] Security headers validated

---

### 7. Error Handling
**Status**: 🟡 **High Priority**
**Impact**: Medium - User experience at risk
**Effort**: 1 day

**Details**:
Error handling exists but is untested:
- API error responses
- Error boundaries
- 404/500 pages
- Client-side error recovery

**Recommendation**:
```typescript
// tests/integration/error-handling.spec.ts
describe('Error Handling', () => {
  test('API returns 400 for invalid input');
  test('API returns 401 for unauthenticated requests');
  test('API returns 500 for server errors');
  test('Error boundary catches component errors');
  test('404 page renders for missing routes');
});
```

**Success Criteria**:
- [ ] All API error codes tested
- [ ] Error boundaries tested
- [ ] Error pages render correctly

---

### 8. Database Operations
**Status**: 🟡 **High Priority**
**Impact**: Medium - Data integrity at risk
**Effort**: 1-2 days

**Details**:
Database operations partially tested via Counter example:
- ✅ Basic CRUD (Counter)
- ❌ Migrations
- ❌ Schema validation
- ❌ Complex queries
- ❌ Transactions
- ❌ Connection pooling

**Recommendation**:
```typescript
// tests/integration/database.spec.ts
describe('Database Operations', () => {
  test('schema matches migrations');
  test('foreign keys enforced');
  test('unique constraints work');
  test('transactions rollback on error');
  test('connection pool handles concurrency');
});
```

**Success Criteria**:
- [ ] Migration tests
- [ ] Schema validation tests
- [ ] Transaction tests
- [ ] Concurrency tests

---

### 9. Build & Bundle Validation
**Status**: 🟡 **High Priority**
**Impact**: Medium - Production bundles untested
**Effort**: 1 day

**Details**:
Build process tested in CI but not comprehensively:
- ✅ Build succeeds
- ❌ Bundle size limits
- ❌ Code splitting
- ❌ Tree shaking
- ❌ Critical CSS

**Recommendation**:
```typescript
// tests/integration/build.spec.ts
describe('Production Build', () => {
  test('bundle size under limits');
  test('routes properly code-split');
  test('unused code tree-shaken');
  test('critical CSS inlined');
  test('source maps generated');
});
```

**Success Criteria**:
- [ ] Bundle size tracking
- [ ] Code splitting verified
- [ ] Build performance monitored

---

## P2: Medium Priority Gaps

### 10. Webkit Browser Support
**Status**: 🟢 **Nice to Have**
**Impact**: Low-Medium - Safari compatibility unknown
**Effort**: 0.5 days

**Details**:
Current browser coverage:
- ✅ Chromium (local + CI)
- ✅ Firefox (CI only)
- ❌ Webkit/Safari (not tested)

**Recommendation**:
Add Webkit to CI matrix:
```yaml
# .github/workflows/e2e-tests.yml
strategy:
  matrix:
    browser: [chromium, firefox, webkit]
```

**Success Criteria**:
- [ ] Webkit added to CI
- [ ] Safari-specific bugs identified and fixed

---

### 11. Visual Regression Testing
**Status**: 🟢 **Nice to Have**
**Impact**: Low-Medium - UI changes untracked
**Effort**: 1 day

**Details**:
Visual.e2e.ts exists but has expected diffs (not baseline).

**Recommendation**:
1. Update baselines
2. Automate visual diff checks in CI
3. Use Percy, Chromatic, or Playwright screenshots

**Success Criteria**:
- [ ] Visual baselines updated
- [ ] CI fails on unexpected visual changes
- [ ] Tool integrated (Percy/Chromatic/Playwright)

---

### 12. Multi-locale Expansion
**Status**: 🟢 **Nice to Have**
**Impact**: Low - Limited locale coverage
**Effort**: 1 day

**Details**:
Currently testing en/fr locales in navigation tests only. Other features untested across locales.

**Recommendation**:
Expand i18n tests to:
- Auth pages in all locales
- Error messages in all locales
- Date/time formatting
- RTL support (if added)

**Success Criteria**:
- [ ] All features tested in en + fr
- [ ] RTL support added and tested (if applicable)

---

### 13. Performance Testing
**Status**: 🟢 **Nice to Have**
**Impact**: Low - Performance regressions undetected
**Effort**: 1-2 days

**Details**:
No performance tests currently exist.

**Recommendation**:
```typescript
// tests/performance/lighthouse.spec.ts
test('homepage Lighthouse score > 90', async () => {
  const report = await lighthouse('http://localhost:3000');
  expect(report.performance).toBeGreaterThan(90);
});
```

**Success Criteria**:
- [ ] Lighthouse CI integrated
- [ ] Core Web Vitals tracked
- [ ] Bundle size monitoring

---

### 14. Accessibility Testing
**Status**: 🟢 **Nice to Have**
**Impact**: Low - a11y compliance unknown
**Effort**: 1 day

**Details**:
No automated accessibility tests.

**Recommendation**:
```typescript
// Add to E2E tests
import { injectAxe, checkA11y } from 'axe-playwright';

test('homepage is accessible', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page);
});
```

**Success Criteria**:
- [ ] axe-core integrated
- [ ] WCAG 2.1 AA compliance verified
- [ ] Keyboard navigation tested

---

## P3: Low Priority Gaps

### 15. Unit Tests
**Status**: 🟢 **Future Work**
**Impact**: Low - Logic complexity manageable
**Effort**: Ongoing

**Details**:
Zero unit tests currently exist. Not critical due to:
- Low business logic complexity
- Strong E2E coverage for Test Adapter
- Framework-provided components

**Recommendation**:
Add unit tests as complexity grows:
- Utility functions
- Custom hooks
- Complex components
- Business logic

**Success Criteria**:
- [ ] Unit test framework ready (Vitest already configured)
- [ ] Add unit tests for new complex logic

---

### 16. Storybook Component Tests
**Status**: 🟢 **Future Work**
**Impact**: Low - Component library small
**Effort**: Ongoing

**Details**:
Storybook configured but no test runner integration.

**Recommendation**:
```bash
npm install --save-dev @storybook/test-runner
npm run storybook:test
```

**Success Criteria**:
- [ ] Storybook test runner configured
- [ ] Stories include interaction tests

---

### 17. API Contract Testing
**Status**: 🟢 **Future Work**
**Impact**: Low - Internal APIs only
**Effort**: 1-2 days

**Details**:
API contract testing could prevent breaking changes to API routes.

**Recommendation**:
Use OpenAPI + Pact or similar for API contract validation.

**Success Criteria**:
- [ ] API schemas defined (OpenAPI)
- [ ] Contract tests in place

---

### 18. Test Documentation
**Status**: 🟢 **Future Work**
**Impact**: Low - Team size small
**Effort**: 1 day

**Details**:
Test authoring guide, best practices, and troubleshooting docs missing.

**Recommendation**:
Create comprehensive testing guide covering:
- How to write E2E tests
- How to write integration tests
- Debugging flaky tests
- Running tests locally
- CI/CD integration

**Success Criteria**:
- [ ] Testing guide created
- [ ] Examples for common scenarios
- [ ] Troubleshooting FAQ

---

## Mitigation Strategies

### For Failing Tests (P0.1)
1. **Isolate**: Run each test independently to identify true failures
2. **Stabilize**: Add explicit waits, improve selectors
3. **Document**: Create known issues list
4. **Monitor**: Track flaky test rate in CI

### For Coverage Gaps (P0.2, P0.3)
1. **Prioritize**: Focus on critical paths first (auth, data)
2. **Automate**: Generate test templates from code
3. **Integrate**: Make tests part of feature development
4. **Review**: Weekly test coverage reviews

### For Monitoring Gaps (P1.5)
1. **Smoke Tests**: Basic health checks first
2. **Synthetic Monitoring**: Use Checkly for production
3. **Alerts**: Set up error rate alerts
4. **Dashboards**: Create test metrics dashboard

---

## Action Plan

### Week 1: Fix Critical Gaps
- **Days 1-2**: Fix failing E2E tests
- **Days 3-4**: Add auth provider test suites
- **Day 5**: Create integration test framework

### Week 2: High Priority Gaps
- **Days 1-2**: Middleware and security tests
- **Days 3-4**: Monitoring and error handling tests
- **Day 5**: Database and build validation tests

### Week 3: Medium Priority Gaps
- **Days 1-2**: Webkit support, visual regression
- **Days 3-4**: Multi-locale, performance tests
- **Day 5**: Accessibility tests, documentation

---

## Success Metrics

| Metric | Current | Target (1 month) | Target (3 months) |
|--------|---------|------------------|-------------------|
| E2E Pass Rate | 55% | 90% | 95% |
| Integration Test Coverage | 10% | 60% | 80% |
| Code Coverage | Unknown | 50% | 70% |
| Flaky Test Rate | Unknown | <10% | <5% |
| Build Time | ~2 min | <2 min | <90 sec |
| Test Execution Time | ~5 min | <5 min | <3 min |

---

## Conclusion

The test suite has a **solid foundation** with the Test Adapter E2E tests and Counter integration tests, but critical gaps exist:

1. **Immediate Action**: Fix 42 failing E2E tests
2. **Short Term**: Add auth provider and integration test coverage
3. **Medium Term**: Expand to monitoring, security, and performance tests
4. **Long Term**: Maintain high coverage as features grow

**Recommended Starting Point**: Fix failing tests first (P0.1), then tackle auth provider parity (P0.2) and integration tests (P0.3).
