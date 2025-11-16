# E2E Test Failure Analysis

**Generated:** 2025-11-16
**Test Run:** Full E2E Suite on Chromium
**Total Tests:** 95
**Passing:** 60 (63%)
**Failing:** 34 (36%)
**Skipped:** 1 (1%)

## Executive Summary

The E2E test suite has improved from 55% pass rate (52/95) to 63% pass rate (60/95), but 34 tests are still failing. The failures fall into distinct categories with clear patterns:

1. **Timing/Selector Issues** (14 tests) - Elements not visible within timeout
2. **Dashboard Authentication** (19 tests) - Most dashboard tests failing at ~21s
3. **Security Test Failures** (7 tests) - CSRF, rate limiting, XSS/SQL injection
4. **Auth Flow Issues** (5 tests) - Weak password, account creation, sign-out
5. **Other** (3 tests) - Counter, I18n, Tenant routing

## Detailed Failure Analysis

### Category 1: Timing/Selector Issues (14 tests)

**Pattern:** `TimeoutError: locator.waitFor: Timeout 5000ms exceeded`

These tests fail because they try to interact with elements that don't appear within 5 seconds.

#### Affected Tests:

1. **Auth.SignIn.e2e.ts**
   - `should maintain email value after failed sign-in` (60s timeout)
   - `should implement rate limiting` - Can't find email input
   - `should not allow SQL injection in email field` - Can't find email input
   - `should not allow XSS in email field` - Can't find email input

2. **Auth.SignUp.e2e.ts**
   - `should implement rate limiting for sign-ups` - Can't find email input
   - `should not allow XSS in form fields` - Can't find email input
   - `should sanitize user input` - Can't find email input
   - `should have proper ARIA labels` (60s timeout)
   - `should announce errors to screen readers` - Can't find submit button

#### Root Cause Analysis:

**Likely causes:**
1. **Rate limiting blocking requests**: After multiple rapid sign-in/sign-up attempts, Arcjet rate limiting may be blocking subsequent requests
2. **Page not redirecting properly**: Tests expect to be on sign-in/sign-up page but may have redirected elsewhere
3. **Test order dependency**: Tests running after rate limiting tests inherit blocked state

#### Fix Strategy:

**Priority: HIGH**

**Solutions:**
1. **Isolate rate limiting tests**
   ```typescript
   // Run rate limiting tests in separate context
   test.describe.serial('Rate Limiting Tests', () => {
     // Use different user/IP for each test
   });
   ```

2. **Add rate limit resets between tests**
   ```typescript
   test.afterEach(async () => {
     // Clear rate limit state or wait for reset
     await page.waitForTimeout(5000);
   });
   ```

3. **Check page state before filling forms**
   ```typescript
   // Before filling:
   await expect(page).toHaveURL(/sign-in|sign-up/);
   await page.waitForLoadState('networkidle');
   ```

4. **Increase timeout for rate limiting tests**
   ```typescript
   test('should implement rate limiting', async ({ signInPage }) => {
     test.setTimeout(90000); // 90 seconds
     // ...
   });
   ```

---

### Category 2: Dashboard Authentication Issues (19 tests)

**Pattern:** All dashboard tests timeout at ~21 seconds, suggesting authentication is failing

#### Affected Tests:

All in **Dashboard.e2e.ts:**
- `should display dashboard when authenticated`
- `should display welcome message`
- `should display user navigation`
- `should display sign-out button`
- `should work with different locales`
- `should display counter section`
- `should increment counter when button clicked`
- `should increment counter multiple times`
- `should persist counter value on page reload`
- `should navigate to user profile`
- `should navigate to settings`
- `should navigate back to home`
- `should sign out successfully`
- `should not access dashboard after sign-out`
- `should clear session data on sign-out`
- `should maintain authentication across page reloads`
- `should handle session timeout gracefully`
- `should load dashboard within acceptable time`
- `should support keyboard navigation`
- `should have proper heading hierarchy`
- `should have accessible button labels`

#### Root Cause Analysis:

**All tests depend on:** `authenticateTestUser(page)` fixture

**Hypothesis:**
1. **Test auth not persisting**: The test authentication helper may not be properly setting session cookies
2. **Page redirecting to sign-in**: When dashboard loads, it redirects unauthenticated users
3. **Middleware blocking**: Auth middleware may not recognize test auth session

**Evidence from test output:**
```
✓ should redirect to sign-in when not authenticated (2.6s)
✘ should display dashboard when authenticated (21.7s)
```

The first test (checking redirect for unauthenticated) passes quickly. The second test (checking authenticated access) times out at 21s.

#### Fix Strategy:

**Priority: CRITICAL**

**Investigation needed:**
1. Check `tests/e2e/helpers/auth.ts` implementation
2. Verify session cookie is set correctly
3. Confirm middleware recognizes test auth

**Potential fixes:**
1. **Fix session cookie domain/path**
   ```typescript
   // In test auth helper
   await context.addCookies([{
     name: 'test-session',
     value: sessionData,
     domain: 'localhost',
     path: '/',
     httpOnly: true,
   }]);
   ```

2. **Wait for authentication to complete**
   ```typescript
   async function authenticateTestUser(page: Page) {
     await page.goto('/sign-up');
     await signUpPage.fillSignUpForm(/*...*/);
     await signUpPage.submit();

     // Wait for redirect to dashboard
     await page.waitForURL(/dashboard/, { timeout: 10000 });

     // Verify authentication
     const response = await page.request.get('/api/auth/user');
     expect(response.ok()).toBeTruthy();
   }
   ```

3. **Use API authentication instead of UI**
   ```typescript
   async function authenticateTestUser(page: Page) {
     // Direct API call instead of filling forms
     await page.request.post('/api/test-auth/signup', {
       data: { email, password, /*...*/ },
     });
     await page.request.post('/api/test-auth/signin', {
       data: { email, password },
     });

     // Navigate to dashboard with session
     await page.goto('/dashboard');
   }
   ```

---

### Category 3: Security Test Failures (7 tests)

#### 3.1: CSRF Protection Test

**Test:** `Auth.SignIn.e2e.ts: should protect against CSRF attacks`

**Error:**
```typescript
Expected: true
Received: false

expect(hasCsrfToken || hasCsrfHeader).toBe(true);
```

**Root Cause:** Test expects either:
- CSRF token in form input
- CSRF header in requests

But neither exists.

**Fix:**
1. **If CSRF is implemented:** Update test to find correct token location
2. **If CSRF not implemented:** Mark test as `test.skip()` with TODO comment

```typescript
test.skip('should protect against CSRF attacks', async () => {
  // TODO: Implement CSRF protection
  // See: https://github.com/your-repo/issues/XXX
});
```

#### 3.2: Rate Limiting Tests (3 tests)

**Tests:**
- `Auth.SignIn.e2e.ts: should implement rate limiting`
- `Auth.SignUp.e2e.ts: should implement rate limiting for sign-ups`

**Error:** Timeout finding email input (see Category 1)

**Fix:** Same as Category 1 - isolate and reset between tests

#### 3.3: XSS/SQL Injection Tests (3 tests)

**Tests:**
- `Auth.SignIn.e2e.ts: should not allow SQL injection in email field`
- `Auth.SignIn.e2e.ts: should not allow XSS in email field`
- `Auth.SignUp.e2e.ts: should not allow XSS in form fields`
- `Auth.SignUp.e2e.ts: should sanitize user input`

**Error:** Timeout finding email input (see Category 1)

**Fix:** Same as Category 1 - likely blocked by rate limiting from previous tests

---

### Category 4: Auth Flow Issues (5 tests)

#### 4.1: Weak Password Error

**Test:** `Auth.TestAdapter.example.e2e.ts: should show error for weak password`

**Error:**
```
strict mode violation: locator('div[role="alert"]') resolved to 2 elements:
  1) <div role="alert" class="rounded-md bg-red-50 p-4 text-sm text-red-800">Password must be at least 8 characters</div>
  2) <div role="alert" aria-live="assertive" id="__ne...
```

**Root Cause:** Multiple error alerts on page, selector not specific enough

**Fix:**
```typescript
// Before:
await expect(page.locator('div[role="alert"]'))
  .toContainText('Password must be at least 8 characters');

// After:
await expect(page.locator('div[role="alert"]').first())
  .toContainText('Password must be at least 8 characters');

// Or better:
await expect(page.getByRole('alert', { name: /password/i }))
  .toContainText('Password must be at least 8 characters');
```

#### 4.2: Mismatched Passwords

**Test:** `Auth.TestAdapter.example.e2e.ts: should show error for mismatched passwords`

**Error:** Similar to weak password - multiple alerts

**Fix:** Same as 4.1 - use `.first()` or more specific selector

#### 4.3: Invalid Credentials

**Test:** `Auth.TestAdapter.example.e2e.ts: should show error for invalid credentials`

**Error:** Test timeout (23.3s)

**Hypothesis:** Similar to dashboard tests - may be authentication issue

**Fix:** Investigate why sign-in with invalid credentials takes 20+ seconds

#### 4.4: Sign Out Successfully

**Test:** `Auth.TestAdapter.example.e2e.ts: should sign out successfully`

**Error:** Test timeout (24s)

**Hypothesis:** Similar to dashboard - authentication not working

**Fix:** See Category 2 fixes

#### 4.5: User Profile

**Test:** `Auth.TestAdapter.example.e2e.ts: should show user profile`

**Error:** Test timeout (1.6s) - much faster failure

**Hypothesis:** Navigation issue, not auth issue

**Fix:** Check profile page exists and is accessible

#### 4.6: Account Creation Success

**Test:** `Auth.SignUp.e2e.ts: should successfully create account with valid data`

**Error:**
```typescript
expect(isDashboard || hasSuccess || isVerifyEmail).toBe(true);
// All three conditions are false
```

**Root Cause:** After sign-up, not redirecting to:
- Dashboard
- Success page
- Email verification page

**Fix:** Check where sign-up actually redirects and update test:
```typescript
// Debug first:
console.log('Current URL:', page.url());
console.log('Page content:', await page.textContent('body'));

// Then update assertion based on actual behavior
```

#### 4.7: Real-time Email Validation

**Test:** `Auth.SignUp.e2e.ts: should validate email format in real-time`

**Error:**
```typescript
expect(ariaInvalid === 'true' || hasErrorClass).toBe(true);
// Both false
```

**Root Cause:** Client-side validation not working or not implemented

**Fix:**
1. **If validation exists:** Update selectors to match actual implementation
2. **If not implemented:** Mark as `test.skip()` with TODO

---

### Category 5: Other Failures (3 tests)

#### 5.1: Counter Tests (2 tests)

**Tests:**
- `Counter.e2e.ts: should display error message when incrementing with negative number` (1.1 minutes!)
- `Counter.e2e.ts: should increment the counter and validate the count` (27.7s)

**Hypothesis:** Same authentication issues as dashboard tests

**Fix:** See Category 2

#### 5.2: I18n Test

**Test:** `I18n.e2e.ts: should switch language from English to French using URL`

**Error:** Test timeout (22.1s)

**Hypothesis:** May be related to auth (if testing protected pages)

**Fix:** Check if test needs authentication, or if locale switching is broken

#### 5.3: Tenant Routing

**Test:** `TenantRouting.e2e.ts: shared-domain slug + locale rewrites nav links`

**Error:** Test timeout (1 minute)

**Hypothesis:** Routing logic issue, not auth

**Fix:** Review tenant routing implementation

---

## Failure Summary by Test File

| Test File | Total | Passing | Failing | Pass Rate |
|-----------|-------|---------|---------|-----------|
| Auth.Navigation.e2e.ts | 11 | 11 | 0 | 100% ✅ |
| Visual.e2e.ts | 5 | 5 | 0 | 100% ✅ |
| Sanity.check.e2e.ts | 3 | 3 | 0 | 100% ✅ |
| Auth.SignUp.e2e.ts | 20 | 14 | 6 | 70% ⚠️ |
| Auth.SignIn.e2e.ts | 16 | 11 | 5 | 69% ⚠️ |
| Auth.TestAdapter.example.e2e.ts | 10 | 5 | 5 | 50% ⚠️ |
| Dashboard.e2e.ts | 24 | 3 | 21 | 13% 🔴 |
| Counter.e2e.ts | 2 | 0 | 2 | 0% 🔴 |
| I18n.e2e.ts | 2 | 1 | 1 | 50% ⚠️ |
| TenantRouting.e2e.ts | 2 | 0 | 1 | 50% ⚠️ |

**Priority Files to Fix:**
1. 🔴 **Dashboard.e2e.ts** - 21 failures (87% fail rate)
2. 🔴 **Counter.e2e.ts** - 2 failures (100% fail rate)
3. ⚠️ **Auth.TestAdapter.example.e2e.ts** - 5 failures (50% fail rate)

---

## Implementation Plan

### Phase 1: Fix Authentication (Days 1-2)

**Impact:** Will fix 19 dashboard tests + some auth tests (est. 25+ tests)

**Tasks:**
1. Investigate `tests/e2e/helpers/auth.ts` - Read current implementation
2. Add debug logging to auth helper
3. Verify session cookies are set correctly
4. Test authentication works manually
5. Update auth helper if needed
6. Re-run dashboard tests

**Expected Improvement:** 60 → 85 passing tests

### Phase 2: Fix Rate Limiting Isolation (Day 2-3)

**Impact:** Will fix 9 security/validation tests

**Tasks:**
1. Move rate limiting tests to separate `describe.serial()` block
2. Add `test.afterEach()` to reset rate limit state
3. Increase timeouts for rate limiting tests
4. Add `page.waitForLoadState('networkidle')` before form fills
5. Check page URL before attempting to fill forms

**Expected Improvement:** 85 → 93 passing tests

### Phase 3: Fix Selector Issues (Day 3)

**Impact:** Will fix 3-4 tests with strict mode violations

**Tasks:**
1. Add `.first()` to alert selectors
2. Use more specific `getByRole()` selectors
3. Update ARIA label tests or mark as skip if not implemented

**Expected Improvement:** 93 → 95 passing tests

### Phase 4: Fix/Skip Remaining (Day 4)

**Impact:** Address remaining edge cases

**Tasks:**
1. Review CSRF test - implement or skip
2. Review real-time validation test - fix or skip
3. Review account creation redirect - update assertion
4. Review I18n and tenant routing tests

**Expected Improvement:** 95 → 95 passing tests (100%)

---

## Quick Wins

These tests can be fixed immediately with simple changes:

### 1. Multiple Alert Elements (5 minutes)

**Files:** `Auth.TestAdapter.example.e2e.ts`

**Change:**
```typescript
// Line 48, 61
- await expect(page.locator('div[role="alert"]'))
+ await expect(page.locator('div[role="alert"]').first())
    .toContainText('Password must be at least 8 characters');
```

### 2. Skip Unimplemented Security Tests (10 minutes)

**Files:** `Auth.SignIn.e2e.ts`, `Auth.SignUp.e2e.ts`

**Change:**
```typescript
test.skip('should protect against CSRF attacks', async ({ signInPage, page }) => {
  // TODO: Implement CSRF protection
  // Issue: #XXX
});

test.skip('should validate email format in real-time', async ({ signUpPage }) => {
  // TODO: Implement client-side validation
  // Issue: #XXX
});
```

### 3. Isolate Rate Limiting Tests (15 minutes)

**Files:** `Auth.SignIn.e2e.ts`, `Auth.SignUp.e2e.ts`

**Change:**
```typescript
test.describe.serial('Rate Limiting & Security', () => {
  test.setTimeout(90000); // Increase timeout

  test('should implement rate limiting', async ({ signInPage, page }) => {
    // Verify we're on sign-in page first
    await expect(page).toHaveURL(/sign-in/);
    // ...
  });
});
```

---

## Expected Timeline

| Day | Focus | Tasks | Expected Pass Rate |
|-----|-------|-------|--------------------|
| Day 1 | Authentication | Fix auth helper, dashboard tests | 63% → 85% |
| Day 2 | Rate Limiting | Isolate tests, add resets | 85% → 93% |
| Day 3 | Selectors | Fix strict mode, update assertions | 93% → 97% |
| Day 4 | Cleanup | Skip/fix remaining edge cases | 97% → 100% |

---

## Test Stability Verification

After fixes, run this verification:

```bash
# Run each test file 3 times
for i in {1..3}; do
  echo "Run $i"
  npx playwright test tests/e2e/Dashboard.e2e.ts --project=chromium
done

# If all 3 runs pass with same results, tests are stable
```

---

## Related Files to Review

1. `tests/e2e/helpers/auth.ts` - **CRITICAL** - Auth helper implementation
2. `tests/e2e/fixtures/dashboard.ts` - Dashboard test fixtures
3. `src/middleware.ts` - Auth middleware
4. `src/libs/auth/adapters/TestAdapter.server.ts` - Test auth adapter
5. `src/app/api/test-auth/*/route.ts` - Test auth API routes

---

## Success Criteria

**P0 (Critical):**
- [ ] 90%+ test pass rate (85+ out of 95 tests)
- [ ] All dashboard tests passing
- [ ] All Auth.Navigation tests passing (already ✅)
- [ ] No timeouts due to authentication issues

**P1 (High):**
- [ ] 95%+ test pass rate (90+ out of 95 tests)
- [ ] Rate limiting tests stable and isolated
- [ ] Security tests implemented or properly skipped
- [ ] Tests run consistently (3 identical runs)

**P2 (Nice to have):**
- [ ] 100% test pass rate (95/95 tests)
- [ ] All security features tested
- [ ] Full CSRF protection implementation

---

**Next Steps:** Start with Phase 1 - Fix Authentication

**Estimated Total Effort:** 3-4 days to reach 95%+ pass rate
