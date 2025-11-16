# Integration Test Coverage Matrix

> **Last Updated**: 2025-11-16
> **Status**: Active
> **E2E Test Files**: 10 | **Integration Test Files**: 1

## Overview

This document provides a comprehensive view of test coverage across the Next.js Boilerplate project, categorized by feature, browser, environment, and authentication provider.

## Quick Stats

- **Total E2E Tests**: 95 tests (52 passing, 42 failing, 1 skipped)
- **Total Integration Tests**: ~5 tests
- **E2E Test Suites**: 10 files
- **Integration Test Suites**: 1 file
- **Supported Browsers**: Chromium ✅, Firefox ✅ (CI), Webkit ⚠️ (Optional)
- **Auth Providers**: Clerk, Cloudflare, Cognito (stub), Test ✅

---

## 1. Feature Coverage Matrix

| Feature Area | Unit Tests | Integration Tests | E2E Tests | Coverage Status | Notes |
|--------------|-----------|-------------------|-----------|-----------------|-------|
| **Authentication** | | | | | |
| └─ Test Adapter | ❌ None | ⚠️ Partial | ✅ Complete | 85% | Full E2E flow tested |
| └─ Clerk Provider | ❌ None | ❌ Missing | ⚠️ Manual | 40% | Requires Clerk keys |
| └─ Cloudflare Access | ❌ None | ❌ Missing | ❌ Missing | 20% | Basic implementation only |
| └─ AWS Cognito | ❌ None | ❌ Missing | ❌ Missing | 10% | Stub implementation |
| **Database** | | | | | |
| └─ PGlite (Dev) | ❌ None | ⚠️ Partial | ✅ Complete | 75% | Counter example works |
| └─ PostgreSQL | ❌ None | ❌ Missing | ❌ Missing | 30% | Production only |
| └─ Schema/Migrations | ❌ None | ❌ Missing | ⚠️ Implicit | 40% | Tested via features |
| **I18n (next-intl)** | | | | | |
| └─ Locale Routing | ❌ None | ❌ Missing | ✅ Complete | 70% | en/fr tested |
| └─ Translation Loading | ❌ None | ❌ Missing | ⚠️ Partial | 50% | Basic checks only |
| └─ RTL Support | ❌ None | ❌ Missing | ❌ Missing | 0% | Not implemented |
| **Middleware** | | | | | |
| └─ Auth Protection | ❌ None | ❌ Missing | ✅ Complete | 80% | Dashboard protection works |
| └─ Arcjet Shield/Bot | ❌ None | ❌ Missing | ❌ Missing | 20% | Requires API key |
| └─ I18n Routing | ❌ None | ❌ Missing | ⚠️ Implicit | 60% | Works via navigation |
| **Error Monitoring** | | | | | |
| └─ Sentry Integration | ❌ None | ❌ Missing | ❌ Missing | 10% | Config only |
| └─ Spotlight (Dev) | ❌ None | ❌ Missing | ❌ Missing | 10% | Manual testing |
| **Analytics** | | | | | |
| └─ PostHog Events | ❌ None | ❌ Missing | ❌ Missing | 10% | Integration only |
| **Logging** | | | | | |
| └─ LogTape | ❌ None | ❌ Missing | ❌ Missing | 20% | Config + basic usage |
| └─ Better Stack | ❌ None | ❌ Missing | ❌ Missing | 10% | Production only |
| **UI Components** | | | | | |
| └─ Templates | ❌ None | ❌ Missing | ⚠️ Partial | 50% | Visual regression |
| └─ Marketing Components | ❌ None | ❌ Missing | ⚠️ Partial | 40% | Navigation tested |
| └─ Counter (Example) | ❌ None | ✅ Complete | ✅ Complete | 90% | Full coverage |
| **Build & Deploy** | | | | | |
| └─ Production Build | ❌ None | ❌ Missing | ⚠️ CI Only | 50% | GitHub Actions |
| └─ Bundle Size | ❌ None | ❌ Missing | ⚠️ CI Only | 40% | Manual checks |
| └─ Type Checking | ❌ None | ❌ Missing | ✅ CI | 80% | Automated |

### Coverage Legend
- ✅ **Complete**: Full coverage with passing tests
- ⚠️ **Partial**: Some coverage but gaps exist
- ❌ **Missing**: No tests or minimal coverage
- 📝 **Planned**: Tests planned but not implemented

---

## 2. E2E Test Suite Breakdown

### Auth.Navigation.e2e.ts
**Status**: ✅ All Passing (11/11 tests)
**Last Fixed**: 2025-11-16
**Coverage**:
- Sign-in page rendering and form elements
- Sign-up page rendering and form elements
- Navigation between auth pages
- Dashboard protection (redirect to sign-in)
- Post-authentication access
- User profile access
- Full auth flow (signup → signin → dashboard → profile → signout)
- Locale support (en, fr)

**Test Scenarios**:
```
✓ Sign-In Page → should render sign-in page with form elements
✓ Sign-In Page → should have link to sign-up page
✓ Sign-Up Page → should render sign-up page with form elements
✓ Sign-Up Page → should have link to sign-in page
✓ Dashboard Page → should redirect unauthenticated users to sign-in
✓ Dashboard Page → should be accessible after sign-in
✓ User Profile Page → should be accessible after authentication
✓ Navigation Flow → should navigate through all public pages
✓ Navigation Flow → should navigate through full auth flow
✓ Locale Support → should render sign-in page in English
✓ Locale Support → should render sign-in page in French
```

### Auth.SignIn.e2e.ts
**Status**: ⚠️ Some Failures
**Coverage**:
- Sign-in form validation
- Successful sign-in flow
- Error handling
- Session persistence

### Auth.SignUp.e2e.ts
**Status**: ⚠️ Some Failures
**Coverage**:
- Sign-up form validation
- Password confirmation
- Account creation flow
- Duplicate email handling

### Dashboard.e2e.ts
**Status**: ⚠️ Some Failures
**Coverage**:
- Dashboard page rendering
- Protected route access
- User-specific content

### Counter.e2e.ts
**Status**: ✅ Mostly Passing
**Coverage**:
- Counter increment/decrement
- Database persistence
- Real-time updates

### I18n.e2e.ts
**Status**: ⚠️ Some Failures
**Coverage**:
- Locale switching
- Translation rendering
- Locale persistence

### Visual.e2e.ts
**Status**: ⚠️ Visual Diffs Expected
**Coverage**:
- Screenshot comparisons
- Visual regression testing

### Sanity.check.e2e.ts
**Status**: ✅ Basic Checks
**Coverage**:
- Homepage loads
- Basic navigation works
- No critical errors

### Auth.TestAdapter.example.e2e.ts
**Status**: ⚠️ Example Only
**Coverage**:
- Test adapter usage examples
- Reference implementation

### TenantRouting.e2e.ts
**Status**: Unknown
**Coverage**:
- Multi-tenant routing (if implemented)

---

## 3. Browser Coverage Matrix

| Test Suite | Chromium (Local) | Firefox (CI) | Webkit (Optional) | Notes |
|------------|------------------|--------------|-------------------|-------|
| Auth.Navigation | ✅ Passing | ✅ Passing | ⚠️ Not tested | Full coverage |
| Auth.SignIn | ⚠️ Partial | ✅ CI | ⚠️ Not tested | Some failures |
| Auth.SignUp | ⚠️ Partial | ✅ CI | ⚠️ Not tested | Some failures |
| Dashboard | ⚠️ Partial | ✅ CI | ⚠️ Not tested | Some failures |
| Counter | ✅ Passing | ✅ CI | ⚠️ Not tested | Works well |
| I18n | ⚠️ Partial | ✅ CI | ⚠️ Not tested | Locale switching |
| Visual | ⚠️ Expected diffs | ⚠️ CI | ❌ Not tested | Chromium primary |
| Sanity | ✅ Passing | ✅ CI | ⚠️ Optional | Basic checks |
| TestAdapter | ⚠️ Example | ⚠️ Example | ❌ Not tested | Reference only |
| TenantRouting | ❓ Unknown | ❓ Unknown | ❌ Not tested | Needs investigation |

### Browser Test Execution
- **Local Development**: Chromium only (fastest feedback)
- **CI (Pull Requests)**: Chromium + Firefox (cross-browser validation)
- **CI (Production)**: Chromium + Firefox + Webkit (full coverage)

---

## 4. Environment Coverage Matrix

| Feature | Local Dev (PGlite) | CI/CD | Production (PostgreSQL) | Notes |
|---------|-------------------|-------|------------------------|-------|
| **Database** | | | | |
| └─ PGlite | ✅ Full support | ✅ Full support | ❌ N/A | Dev/test only |
| └─ PostgreSQL | ⚠️ Manual setup | ✅ Test DB | ✅ Production | Requires `DATABASE_URL` |
| **Authentication** | | | | |
| └─ Test Adapter | ✅ Default | ✅ Default | ❌ Not for prod | E2E testing |
| └─ Clerk | ✅ Keyless mode | ⚠️ Test keys | ✅ Prod keys | Real auth |
| └─ Cloudflare | ⚠️ Manual config | ⚠️ Manual | ✅ Production | Requires domain |
| └─ Cognito | ❌ Stub only | ❌ Stub only | ❌ Not implemented | Future |
| **Monitoring** | | | | |
| └─ Sentry | ✅ Spotlight | ⚠️ DSN required | ✅ Cloud | Error tracking |
| └─ PostHog | ⚠️ Optional | ❌ Not configured | ✅ Production | Analytics |
| └─ Logging | ✅ Console | ✅ Console | ✅ Better Stack | LogTape |
| **Security** | | | | |
| └─ Arcjet | ⚠️ Optional | ❌ Requires key | ✅ Production | Shield/bot detect |

---

## 5. Auth Provider Test Coverage

| Test Scenario | Test Adapter | Clerk | Cloudflare | Cognito | Notes |
|---------------|-------------|-------|------------|---------|-------|
| **Sign In** | ✅ Full | ⚠️ Manual | ⚠️ Manual | ❌ Stub | Test adapter automated |
| **Sign Up** | ✅ Full | ⚠️ Manual | ⚠️ Manual | ❌ Stub | Test adapter automated |
| **Sign Out** | ✅ Full | ⚠️ Manual | ⚠️ Manual | ❌ Stub | Test adapter automated |
| **Protected Routes** | ✅ Full | ✅ Works | ✅ Works | ❌ Stub | All adapters support |
| **User Profile** | ✅ Full | ✅ Works | ✅ Works | ❌ Stub | Basic rendering |
| **Session Management** | ✅ Cookie | ✅ Clerk SDK | ✅ JWT | ❌ Stub | Different mechanisms |
| **Multi-locale Support** | ✅ Tested | ⚠️ Partial | ⚠️ Partial | ❌ None | en/fr validated |
| **Error Handling** | ✅ Tested | ⚠️ Partial | ⚠️ Minimal | ❌ None | Test adapter only |
| **MFA** | ❌ Not supported | ✅ Available | ⚠️ Possible | ❌ Stub | Clerk best support |
| **Social Login** | ❌ Not supported | ✅ Available | ⚠️ Limited | ❌ Stub | Clerk best support |

### How to Switch Auth Providers
```bash
# .env.local
NEXT_PUBLIC_AUTH_PROVIDER=test       # Default for E2E tests
NEXT_PUBLIC_AUTH_PROVIDER=clerk      # Production (recommended)
NEXT_PUBLIC_AUTH_PROVIDER=cloudflare # If using Cloudflare Access
NEXT_PUBLIC_AUTH_PROVIDER=cognito    # Not implemented yet
```

---

## 6. Integration Test Coverage

### Current Integration Tests
**Location**: `apps/web/tests/integration/`

#### Counter.spec.ts
**Status**: ✅ Passing
**Coverage**:
- Counter API endpoint (`/api/counter`)
- Database read/write operations
- Schema validation with Zod
- Error handling

**Test Scenarios**:
```typescript
✓ GET /api/counter → should return current count
✓ POST /api/counter → should increment count
✓ POST /api/counter → should persist to database
✓ POST /api/counter → should validate request body
✓ GET /api/counter → should handle database errors
```

### Missing Integration Tests

**High Priority**:
- [ ] Auth API routes (`/api/test-auth/*`)
- [ ] Middleware integration (auth + i18n + arcjet)
- [ ] Database migrations and schema changes
- [ ] I18n translation loading and fallbacks
- [ ] Error boundary and error tracking

**Medium Priority**:
- [ ] API route error handling
- [ ] CORS and security headers
- [ ] Session management across requests
- [ ] Multi-locale API responses

**Low Priority**:
- [ ] Analytics event tracking
- [ ] Logging integration
- [ ] Performance monitoring hooks

---

## 7. Test Gaps & Recommendations

### Critical Gaps (P0)
1. **Auth Provider Parity**: Only Test Adapter has full E2E coverage
   - **Recommendation**: Create E2E test suites for Clerk and Cloudflare
   - **Effort**: 3-4 days

2. **Integration Test Coverage**: Only 1 integration test file
   - **Recommendation**: Add integration tests for all API routes
   - **Effort**: 2-3 days

3. **Failing E2E Tests**: 42/95 tests failing
   - **Recommendation**: Investigate and fix root causes
   - **Effort**: Varies by issue

### High Priority Gaps (P1)
4. **Middleware Testing**: No direct middleware tests
   - **Recommendation**: Add integration tests for middleware stack
   - **Effort**: 1-2 days

5. **Monitoring Integration**: Sentry/PostHog not tested
   - **Recommendation**: Add smoke tests for error tracking and analytics
   - **Effort**: 1 day

6. **Security Testing**: Arcjet features untested
   - **Recommendation**: Add tests for bot detection and rate limiting
   - **Effort**: 1-2 days

### Medium Priority Gaps (P2)
7. **Webkit Browser Coverage**: Only Chromium + Firefox tested
   - **Recommendation**: Add Webkit to CI matrix
   - **Effort**: 0.5 days

8. **Visual Regression**: Visual.e2e.ts has expected diffs
   - **Recommendation**: Update baselines and automate comparisons
   - **Effort**: 1 day

9. **Multi-locale Coverage**: Only en/fr tested in navigation
   - **Recommendation**: Expand i18n tests to all features
   - **Effort**: 1 day

### Low Priority Gaps (P3)
10. **Unit Tests**: No unit tests for components/utilities
    - **Recommendation**: Add unit tests for complex logic
    - **Effort**: Ongoing

11. **Performance Tests**: No performance regression tests
    - **Recommendation**: Add Lighthouse CI or similar
    - **Effort**: 1-2 days

12. **Accessibility Tests**: No automated a11y tests
    - **Recommendation**: Add axe-core to E2E tests
    - **Effort**: 1 day

---

## 8. Testing Best Practices

### E2E Tests
- Use `test-auth` provider for E2E tests (fast, no external dependencies)
- Wait for `networkidle` after navigation
- Use `.first()` when multiple elements match selector
- Take screenshots for debugging (`test-results/*.png`)
- Group related tests in `describe` blocks

### Integration Tests
- Test API routes in isolation
- Mock external services (Clerk, Sentry, PostHog)
- Validate request/response schemas
- Test error cases explicitly

### CI/CD
- Run Chromium locally, Chromium + Firefox in CI
- Use retries for flaky tests (max 2 retries)
- Fail fast on critical tests (auth, database)
- Generate coverage reports

---

## 9. Running Tests

### E2E Tests
```bash
# Run all E2E tests (Chromium)
npm run test:e2e

# Run specific test file
npx playwright test tests/e2e/Auth.Navigation.e2e.ts

# Run with UI mode (debugging)
npx playwright test --ui

# Run specific browser
npx playwright test --project=firefox

# Update visual baselines
npx playwright test tests/e2e/Visual.e2e.ts --update-snapshots
```

### Integration Tests
```bash
# Run all integration tests
npm run test:integration

# Run with coverage
npm run test:integration -- --coverage

# Run specific test file
npx vitest tests/integration/Counter.spec.ts
```

### Unit Tests
```bash
# Run all unit tests
npm run test

# Run in watch mode
npm run test -- --watch

# Run with coverage
npm run test -- --coverage
```

---

## 10. Continuous Improvement

### Automated Test Metrics
Track these metrics over time:
- **Test Pass Rate**: Currently 55% (52/95 passing)
- **Code Coverage**: Target 80%+ for critical paths
- **Test Execution Time**: Keep E2E suite under 5 minutes
- **Flaky Test Rate**: Target <5%

### Monthly Review
- Review and update this matrix
- Address top 3 test gaps
- Refactor slow/flaky tests
- Update browser compatibility matrix

### Integration with CI
- **Pull Requests**: Run all tests, block merge on failures
- **Main Branch**: Run extended test suite (all browsers)
- **Nightly**: Run performance and visual regression tests
- **Release**: Full test suite + manual smoke tests

---

## Appendix

### Related Documentation
- [Sprint 4 P1 Implementation Plan](../sprint4-p1-implementation-plan.md)
- [Test Gap Analysis](./test-gaps.md) *(to be created)*
- [E2E Test Authoring Guide](../../README.md#testing) *(in main README)*

### Test File Locations
```
apps/web/
├── tests/
│   ├── e2e/                    # E2E tests (Playwright)
│   │   ├── Auth.Navigation.e2e.ts  ✅ 11 passing
│   │   ├── Auth.SignIn.e2e.ts      ⚠️  Some failing
│   │   ├── Auth.SignUp.e2e.ts      ⚠️  Some failing
│   │   ├── Counter.e2e.ts          ✅ Passing
│   │   ├── Dashboard.e2e.ts        ⚠️  Some failing
│   │   ├── I18n.e2e.ts             ⚠️  Some failing
│   │   ├── Sanity.check.e2e.ts     ✅ Basic checks
│   │   ├── TenantRouting.e2e.ts    ❓ Unknown
│   │   ├── Visual.e2e.ts           ⚠️  Visual diffs
│   │   └── Auth.TestAdapter.example.e2e.ts
│   ├── integration/            # Integration tests (Vitest)
│   │   └── Counter.spec.ts         ✅ Passing
│   └── fixtures/               # Test fixtures
└── src/                        # Source code (no unit tests yet)
```

### Glossary
- **E2E**: End-to-end tests simulating real user interactions
- **Integration**: Tests covering API routes and module integration
- **Unit**: Tests for individual functions/components (not yet implemented)
- **Smoke**: Basic tests ensuring critical paths work
- **Visual Regression**: Screenshot comparison tests
- **CI**: Continuous Integration (GitHub Actions)
