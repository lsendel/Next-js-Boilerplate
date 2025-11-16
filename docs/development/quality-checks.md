# Automated Quality Checks

This document describes the automated quality checks enforced by Lefthook git hooks and GitHub Actions CI.

## Overview

Quality checks run at three stages:

1. **Pre-commit** (7 checks) - Fast checks on staged files before commit
2. **Pre-push** (4 checks) - Comprehensive validation before pushing
3. **CI/CD** (3 jobs) - Full quality gate on pull requests and main branch

## Pre-commit Checks

These run automatically when you `git commit`. They execute in parallel for speed.

### 1. Lint and Auto-fix

**What it does:** Runs ESLint on staged JavaScript/TypeScript files and automatically fixes issues.

**Files checked:** `*.{js,jsx,ts,tsx}`

**Command:** `npx eslint --fix --no-warn-ignored {staged_files}`

**Auto-fixes:**
- Code formatting (via Prettier integration)
- Import sorting
- Unused variables
- Simple rule violations

**Manual fix required for:**
- Logic errors
- Complex lint rules
- Type errors

**Example failure:**
```bash
❌ Lint failed:
  src/components/MyComponent.tsx
    45:12  error  'React' is defined but never used  no-unused-vars
```

**How to fix:**
```bash
npm run lint:fix  # Fix all files
```

### 2. Type Checking

**What it does:** Runs TypeScript compiler to check for type errors.

**Files checked:** `*.{ts,tsx}`

**Command:** `npm run check:types`

**Common failures:**
- Type mismatches
- Missing properties
- Incorrect function signatures
- Import errors

**Example failure:**
```bash
❌ Type check failed:
  src/components/MyComponent.tsx:45:12 - error TS2339:
  Property 'firstName' does not exist on type 'User'.
```

**How to fix:**
```bash
npm run check:types  # See all errors
# Fix the type errors manually
```

### 3. i18n Translation Check

**What it does:** Validates translation files are complete and consistent.

**Files checked:** `src/locales/**/*.json`

**Command:** `npm run check:i18n`

**Checks:**
- All locale files have same keys as `en.json`
- No missing translations
- No extra keys
- Valid JSON format

**Example failure:**
```bash
❌ i18n check failed:
  Missing keys in fr.json: ['dashboard.newFeature']
  Extra keys in es.json: ['oldKey']
```

**How to fix:**
```bash
# Only edit en.json - other locales auto-sync via Crowdin
vim src/locales/en.json
```

### 4. Secret Scanning

**What it does:** Prevents committing secrets, API keys, and credentials.

**Files checked:** All staged files

**Detects:**
- API keys, passwords, tokens in code (20+ chars)
- AWS access keys (`AKIA[0-9A-Z]{16}`)
- Private keys (`-----BEGIN PRIVATE KEY-----`)
- `.env.local` file (should never be committed)

**Example failure:**
```bash
❌ Potential secret detected in staged files!
  src/config.ts:12: const API_KEY = "sk_live_abc123..."

Please remove secrets and use environment variables instead.

💡 Tip: Use environment variables and .env.local (which is gitignored)
```

**How to fix:**
```bash
# Move secret to .env.local
echo 'API_KEY=sk_live_abc123...' >> .env.local

# Use environment variable in code
const API_KEY = process.env.API_KEY;

# Unstage the file with secrets
git restore --staged src/config.ts
```

### 5. Schema + Migrations Consistency

**What it does:** Ensures database schema changes include migrations.

**Files checked:** `src/server/db/models/**/*.ts`

**Validates:**
- If schema files are staged, migrations must also be staged
- Prevents schema drift

**Example failure:**
```bash
❌ Schema changed but migrations not staged

Run the following commands:
  npm run db:generate
  git add migrations/
```

**How to fix:**
```bash
npm run db:generate    # Generate migration from schema
git add migrations/    # Stage the migration files
```

### 6. File Size Check

**What it does:** Prevents committing large files (images, binaries).

**Files checked:** All staged files

**Limit:** 1 MB (1,048,576 bytes)

**Example failure:**
```bash
❌ File too large: public/images/hero.png (2.5MB)

💡 Tip: Use Git LFS for large files or compress images
```

**How to fix:**
```bash
# Compress images
npm install -g sharp-cli
sharp -i public/images/hero.png -o public/images/hero-compressed.png resize 1920

# Or use Git LFS
git lfs install
git lfs track "*.png"
```

### 7. Commit Message Validation

**What it does:** Enforces Conventional Commits format.

**Format:** `type(scope): description`

**Valid types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semi-colons
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance tasks

**Example failure:**
```bash
❌ Commit message validation failed:
  "updated homepage"

Expected format: type(scope): description
Example: feat(homepage): add hero section
```

**How to fix:**
```bash
# Use interactive commit helper
npm run commit

# Or write proper message
git commit -m "feat(homepage): add hero section with CTA"
```

## Pre-push Checks

These run automatically when you `git push`. More comprehensive than pre-commit.

### 1. Unit Tests

**What it does:** Runs all unit and UI tests.

**Command:** `npm run test`

**Coverage:**
- All `*.test.ts` files (Vitest Node environment)
- All `*.test.tsx` files (Vitest Browser environment)

**Example failure:**
```bash
❌ Test suite failed:
  FAIL src/components/Counter.test.tsx
    ✓ renders initial count
    ✗ increments on button click
      Expected: 1
      Received: 0
```

**How to fix:**
```bash
npm run test        # Run all tests
npm run test -- --ui  # Interactive UI mode
```

### 2. Circular Dependencies

**What it does:** Detects circular imports that can cause runtime errors.

**Command:** `npm run check:circular`

**Example failure:**
```bash
❌ Circular dependencies detected:

[HIGH] Cycle with 3 files:
  → libs/auth/utils.ts
  → libs/auth/session.ts
  → libs/auth/middleware.ts
```

**How to fix:**
```bash
# Run analysis
npm run check:circular

# View detailed report
cat docs/architecture/dependency-analysis.md

# Refactor to break cycle - common strategies:
# 1. Extract shared code to new file
# 2. Use dependency injection
# 3. Move types to separate file
```

### 3. Unused Dependencies

**What it does:** Finds unused npm packages and dead code.

**Command:** `npm run check:deps`

**Uses:** Knip - detects unused dependencies, files, exports

**Example output:**
```bash
⚠️  Unused dependencies:
  - @types/lodash (not imported anywhere)

⚠️  Unused files:
  - src/utils/old-helper.ts (not imported)
```

**How to fix:**
```bash
npm run check:deps

# Remove unused dependencies
pnpm remove @types/lodash

# Remove or fix unused files
rm src/utils/old-helper.ts
```

**Note:** This check uses `continue-on-error: true` in CI because Knip can be noisy. Review warnings but don't block pushes.

### 4. Build Verification

**What it does:** Ensures project builds successfully.

**Command:** `npm run build-local`

**Validates:**
- Next.js compilation succeeds
- No TypeScript errors
- No runtime errors during build
- Static generation works

**Example failure:**
```bash
❌ Build failed:
  Type error: Property 'user' is missing in type '{}'
  but required in type 'DashboardProps'.

  src/app/[locale]/(auth)/dashboard/page.tsx:45:12
```

**How to fix:**
```bash
npm run build-local  # Local build with in-memory DB
# Fix the errors shown
```

## Skipping Hooks

Sometimes you need to skip hooks. Use these methods carefully.

### Skip All Hooks

```bash
# Skip all pre-commit and pre-push hooks
LEFTHOOK=0 git commit -m "message"
LEFTHOOK=0 git push
```

**When to use:**
- Emergency hotfixes (must still pass CI)
- Work in progress commits on feature branch
- Debugging git hook issues

### Skip Specific Hook

```bash
# Skip only lint check
LEFTHOOK_EXCLUDE=lint git commit -m "message"

# Skip multiple checks
LEFTHOOK_EXCLUDE=lint,check-types git commit -m "message"
```

**Available hooks to skip:**
- `lint`
- `check-types`
- `check-i18n`
- `check-secrets`
- `schema-check`
- `check-file-size`
- `test`
- `check-circular`
- `check-deps`
- `build-check`

### Using --no-verify (Not Recommended)

```bash
git commit --no-verify -m "message"
git push --no-verify
```

**Warning:** This bypasses ALL git hooks including commit message validation and security checks. Only use in emergencies.

## CI/CD Integration

GitHub Actions runs quality checks on every pull request and push to main.

### Workflow: Quality Checks

**File:** `.github/workflows/quality-checks.yml`

**Triggers:**
- Pull requests (opened, synchronized, reopened)
- Pushes to `main` branch

**Jobs:**

#### 1. Code Quality & Security (15 min timeout)

**Steps:**
1. Checkout code (full history)
2. Setup Node.js 20 + pnpm 10
3. Install dependencies (with pnpm cache)
4. Lint (`pnpm run lint`)
5. Type check (`pnpm run check:types`)
6. i18n check (`pnpm run check:i18n`)
7. Circular dependencies (`pnpm run check:circular`)
8. Unused dependencies (`pnpm run check:deps`, continue-on-error)
9. Unit tests (`pnpm run test`)
10. Build verification (`pnpm run build-local`)

**On failure:** Comments on PR with error message

#### 2. Security Scan (10 min timeout)

**Steps:**
1. Checkout code
2. Trivy vulnerability scanner
   - Scans filesystem for vulnerabilities
   - Reports CRITICAL and HIGH severity
   - Uploads SARIF to GitHub Security tab
3. npm audit
   - Checks for vulnerable dependencies
   - Audit level: high
   - Continue on error (informational)

**Reports:** Available in GitHub Security > Code scanning alerts

#### 3. Dependency Review (PR only)

**Steps:**
1. Checkout code
2. Dependency Review Action
   - Compares dependencies with base branch
   - Checks for new vulnerabilities
   - Fails on moderate+ severity

**When it runs:** Only on pull requests (requires base comparison)

### Viewing CI Results

**Pull Request:**
- Checks appear at bottom of PR
- Click "Details" to see full logs
- Must pass before merge (if required)

**Security Tab:**
- Navigate to repository > Security > Code scanning
- View Trivy vulnerability reports
- See historical trends

**Actions Tab:**
- Navigate to repository > Actions
- View all workflow runs
- Download logs and artifacts

## Troubleshooting

### Hook is not running

**Problem:** Git commit succeeds without running hooks

**Diagnosis:**
```bash
# Check if Lefthook is installed
lefthook version

# Check hook configuration
cat .git/hooks/pre-commit
```

**Fix:**
```bash
# Reinstall Lefthook hooks
npx lefthook install

# Or install globally
pnpm install -g lefthook
lefthook install
```

### Hook runs too slow

**Problem:** Pre-commit takes >30 seconds

**Diagnosis:**
```bash
# Check which hook is slow
LEFTHOOK_VERBOSE=1 git commit -m "test"
```

**Fix:**
```bash
# Skip slow checks for WIP commits
LEFTHOOK_EXCLUDE=check-types,test git commit -m "wip: work in progress"

# Run comprehensive checks before push instead
git push  # Pre-push runs all checks
```

### Type check fails but tsc passes

**Problem:** `npm run check:types` fails but `tsc` in IDE shows no errors

**Cause:** Different TypeScript versions or tsconfig.json

**Fix:**
```bash
# Clear TypeScript cache
rm -rf .next node_modules/.cache

# Reinstall dependencies
pnpm install

# Ensure using project TypeScript
npx tsc --version
```

### Secret scanner false positive

**Problem:** Hook blocks commit for non-secret string

**Options:**

1. **Refactor code** (preferred):
```typescript
// Before: Triggers scanner
const example = "token=abc123456789012345678901234567890"

// After: Doesn't trigger
const example = buildString('token', '=', someValue)
```

2. **Skip check** (temporary):
```bash
LEFTHOOK_EXCLUDE=check-secrets git commit -m "message"
```

3. **Update pattern** (if common issue):
Edit `lefthook.yml` check-secrets pattern to exclude false positives

### CI passes but pre-push fails

**Problem:** Local pre-push fails but CI is green

**Cause:** Different Node versions, cache issues, or env differences

**Fix:**
```bash
# Match CI environment
node -v  # Should be 20.x

# Clear all caches
npm run clean
rm -rf node_modules
pnpm install

# Run CI checks locally
npm run ci:full
```

### Build fails only in CI

**Problem:** `npm run build-local` works locally but CI build fails

**Common causes:**

1. **Environment variables:**
```bash
# CI needs explicit env vars
# Check .github/workflows/quality-checks.yml
env:
  SKIP_ENV_VALIDATION: true
```

2. **Database connection:**
```bash
# Ensure CI uses in-memory DB
npm run build-local  # Not npm run build
```

3. **Secrets in code:**
```bash
# Check for hardcoded URLs, keys
grep -r "localhost:3000" src/
grep -r "sk_test_" src/
```

## Best Practices

### 1. Commit Frequently

Small, focused commits are easier to validate:

```bash
# Good: Focused commits
git add src/components/Button.tsx
git commit -m "feat(ui): add loading state to Button"

git add src/components/Button.test.tsx
git commit -m "test(ui): add Button loading state tests"

# Avoid: Large commits
git add .
git commit -m "fix: various changes"
```

### 2. Run Checks Before Committing

Catch issues early:

```bash
# Run checks manually
npm run lint:fix      # Fix lint issues
npm run check:types   # Verify types
npm run test          # Run tests

# Then commit
git commit -m "feat: add new feature"
```

### 3. Use Commit Helper

For consistent commit messages:

```bash
npm run commit
# Interactive prompts for type, scope, description
```

### 4. Review Hook Output

Don't ignore warnings:

```bash
# Pay attention to output
git commit -m "message"
# ✓ No secrets detected
# ⚠️  TypeScript has 2 errors (but allowed)
# Review and fix warnings
```

### 5. Keep Hooks Updated

Update Lefthook configuration as project evolves:

```bash
# Edit lefthook.yml to add new checks
vim lefthook.yml

# Reinstall hooks
lefthook install
```

## Configuration Files

### Lefthook Configuration

**File:** `apps/web/lefthook.yml`

**Structure:**
```yaml
commit-msg:           # Commit message validation
  commands:
    commitlint: ...

pre-commit:           # Fast checks on staged files
  parallel: true
  commands:
    lint: ...
    check-types: ...
    check-secrets: ...

pre-push:             # Comprehensive checks before push
  commands:
    test: ...
    build-check: ...

post-checkout:        # Helpful reminders
  commands:
    check-dependencies: ...

post-merge:           # After git pull
  commands:
    check-dependencies: ...
```

**Customization:**
- Add new checks to `commands:`
- Adjust `glob:` patterns to filter files
- Set `priority:` to control execution order
- Use `stage_fixed: true` to auto-stage fixes

### GitHub Actions Workflow

**File:** `.github/workflows/quality-checks.yml`

**Jobs:**
- `quality`: Lint, test, build
- `security`: Trivy, npm audit
- `dependency-review`: Check new dependencies

**Customization:**
- Adjust `timeout-minutes` if checks run longer
- Modify `fail-on-severity` for stricter security
- Add `env:` variables for configuration

### Commitlint Configuration

**File:** `.commitlintrc.json` or `commitlint.config.js`

**Rules:**
- Enforces Conventional Commits format
- Validates commit message structure
- Customizable types and scopes

## Related Documentation

- [Testing Strategy](../testing/integration-test-matrix.md) - Test coverage matrix
- [Dependency Analysis](../architecture/dependency-analysis.md) - Circular dependency report
- [Contributing Guidelines](../../CONTRIBUTING.md) - How to contribute
- [Sprint 4 P1 Plan](../sprint4-p1-implementation-plan.md) - Implementation plan

## FAQ

### Can I disable hooks permanently?

No. Hooks are required for code quality. If a check is too restrictive, discuss with the team to adjust the rules.

### What happens if I skip hooks and push?

CI will still run all checks. If CI fails, your PR cannot be merged. Hooks save time by catching issues locally.

### How do I add a new quality check?

1. Add check to `lefthook.yml` under appropriate stage (pre-commit/pre-push)
2. Add corresponding step to `.github/workflows/quality-checks.yml`
3. Document in this file
4. Test locally: `LEFTHOOK_VERBOSE=1 git commit -m "test"`

### Why are some checks continue-on-error?

Tools like Knip can have false positives. We show warnings but don't block commits. Review manually.

### How do I test hooks without committing?

```bash
# Run specific hook manually
lefthook run pre-commit

# Run with verbose output
LEFTHOOK_VERBOSE=1 lefthook run pre-commit

# Test specific command
lefthook run pre-commit --commands lint
```

### Can I run CI checks locally?

Yes:
```bash
npm run ci:local    # Quick: lint, types, test
npm run ci:full     # Full: includes coverage and E2E
npm run ci:check    # All quality checks
npm run ci:build    # Includes build verification
```

---

**Last Updated:** 2025-11-16
**Maintained By:** Development Team
**Questions?** Open an issue or ask in team chat
