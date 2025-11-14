---
name: ui-test-suite
description: Run comprehensive UI tests with Vitest (unit/component) and Playwright (E2E)
tools:
  - Bash
  - Read
---

# UI Test Suite Skill

Run all UI tests across the testing pyramid.

## Test Layers:

### 1. Unit Tests (Vitest)
**Run**: `npm run test`
- **Location**: Colocated `*.test.ts` files
- **Tests**: Pure functions, utilities, business logic
- **Environment**: Node.js

### 2. Component Tests (Vitest Browser Mode)
**Run**: `npm run test` (included)
- **Location**: `*.test.tsx` files
- **Tests**: React components, hooks, user interactions
- **Environment**: Real browser (Playwright)
- **Framework**: `vitest-browser-react`

### 3. Integration Tests (Vitest)
**Run**: `npm run test:integration`
- **Location**: `tests/integration/*.spec.ts`
- **Tests**: Database operations, API routes, server actions

### 4. E2E Tests (Playwright)
**Run**: `npm run test:e2e`
- **Location**: `tests/e2e/*.e2e.ts`
- **Tests**: Full user flows, critical paths
- **Browsers**: Chromium locally, Chromium + Firefox in CI

### 5. Storybook Tests
**Run**: `npm run storybook:test`
- **Location**: `*.stories.tsx` files
- **Tests**: Visual regression, component states, accessibility
- **Framework**: Storybook + Vitest

## Execution Strategy:

### Quick Check (Pre-commit)
```bash
npm run test -- --run --silent
```

### Full Test Suite
```bash
npm run test
npm run test:integration
npm run test:e2e
```

### With Coverage
```bash
npm run test -- --coverage
```

### Watch Mode (Development)
```bash
npm run test -- --watch
```

## Output Format:
```
🧪 Test Suite Results
=====================

✅ Unit Tests: X/Y passed
✅ Component Tests: X/Y passed
✅ Integration Tests: X/Y passed
✅ E2E Tests: X/Y passed
✅ Storybook Tests: X/Y passed

📊 Coverage: Z%
  - Statements: A%
  - Branches: B%
  - Functions: C%
  - Lines: D%

❌ Failed Tests:
  1. [file] test name - reason
  2. [file] test name - reason

⚡ Performance:
  - Total time: Xs
  - Slowest test: test-name (Ys)
```

## Analysis:
1. **Identify missing tests** for critical flows:
   - Authentication (sign-in, sign-out, sign-up)
   - Dashboard protected routes
   - Form submissions
   - Error states
   - Loading states

2. **Check test quality**:
   - Tests with multiple assertions (split needed)
   - Missing edge case coverage
   - Flaky tests (inconsistent pass/fail)
   - Tests without proper cleanup

3. **Coverage gaps**:
   - Files with < 80% coverage
   - Untested error handlers
   - Missing boundary conditions

4. **Suggest new tests** based on recent changes

## Test Best Practices Check:
- [ ] Tests are isolated (no shared state)
- [ ] Proper use of `waitFor` for async operations
- [ ] Accessibility testing with `toBeAccessible()`
- [ ] Error cases are tested
- [ ] Loading states are tested
- [ ] Mobile viewports are tested (E2E)
- [ ] i18n scenarios are covered
