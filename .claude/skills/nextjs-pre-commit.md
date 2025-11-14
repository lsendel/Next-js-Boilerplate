---
name: nextjs-pre-commit
description: Quick quality gate before committing - lint, types, tests, formatting
tools:
  - Bash
---

# Next.js Pre-Commit Quality Gate

Fast quality checks before committing code.

## Quick Checks (< 30 seconds):

### 1. Linting
```bash
npm run lint
```
- Must pass with 0 errors
- Warnings are acceptable (but should be addressed)

### 2. Type Checking
```bash
npm run check:types
```
- Must have 0 TypeScript errors
- No compilation issues

### 3. Unit Tests
```bash
npm run test -- --run --silent
```
- Run only unit/component tests (fast)
- Skip E2E tests (run in CI)

### 4. Dependency Check
```bash
npm run check:deps
```
- No unused dependencies
- No unreachable code

### 5. i18n Validation
```bash
npm run check:i18n
```
- All translations complete
- No missing keys

## Optional (if time permits):

### 6. Build Check
```bash
npm run build-local
```
- Verifies production build works
- Catches build-time errors

## Git Integration:

This project uses **Lefthook** for Git hooks:
- Located: `.lefthook.yml`
- Runs automatically on `git commit`

### Manual Pre-Commit Check:
```bash
# Run all checks
lefthook run pre-commit

# Or run this skill to simulate pre-commit checks
```

## Output Format:
```
🚀 Pre-Commit Quality Gate
==========================

✅ 1/5 Lint check passed
✅ 2/5 Type check passed
✅ 3/5 Tests passed (45 tests, 2.3s)
✅ 4/5 Dependencies check passed
✅ 5/5 i18n validation passed

🎉 All checks passed! Ready to commit.

Next steps:
  git add .
  git commit -m "feat: add new feature"
```

Or if issues found:
```
🚀 Pre-Commit Quality Gate
==========================

❌ 1/5 Lint check failed (3 errors)
✅ 2/5 Type check passed
❌ 3/5 Tests failed (2/45 tests)
✅ 4/5 Dependencies check passed
✅ 5/5 i18n validation passed

🛑 Cannot commit. Fix issues first.

Errors to fix:
1. src/components/Header.tsx:23 - Missing alt text
2. src/lib/utils.ts:45 - Type error
3. Test failed: Login flow

Fix commands:
  npm run lint:fix    # Auto-fix lint issues
  npm run test        # Re-run tests
```

## Time Budget:
- Lint: ~3s
- Types: ~5s
- Tests: ~10s
- Dependencies: ~5s
- i18n: ~2s
**Total: ~25s**

## Skip Strategy (if needed):
```bash
# Skip pre-commit hooks (not recommended)
git commit --no-verify

# Or fix issues:
npm run lint:fix
```

## Integration with CI:
These same checks run in GitHub Actions:
- On every PR
- On main branch push
- With additional E2E tests and coverage reports
