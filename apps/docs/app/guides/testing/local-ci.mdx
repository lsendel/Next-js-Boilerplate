# Local Testing Guide

**How to test CI/CD pipeline locally before pushing**

**Last Updated:** November 15, 2025

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Test Application Locally](#test-application-locally)
3. [Test CI Checks Locally](#test-ci-checks-locally)
4. [Test Deployments Locally](#test-deployments-locally)
5. [Test with Docker](#test-with-docker)
6. [Simulate Full CI/CD Pipeline](#simulate-full-cicd-pipeline)
7. [Pre-Commit Hooks](#pre-commit-hooks)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Run All Checks (Same as CI)

```bash
# This runs the exact same checks as CI
npm run ci:local
```

If you don't have this script, add it to `package.json`:

```json
{
  "scripts": {
    "ci:local": "npm run lint && npm run check:types && npm run test && npm run build-local"
  }
}
```

**Expected time:** 3-5 minutes (much faster than CI!)

---

## Test Application Locally

### 1. Development Server

```bash
# Start dev server with PGlite (no Docker needed)
npm run dev

# Open browser
open http://localhost:3000

# Test features:
# - Homepage loads
# - Can navigate to /sign-in
# - Can access /dashboard (if authenticated)
# - No console errors
# - Hot reload works
```

**What this tests:**
- ✅ Application builds correctly
- ✅ Database connections work
- ✅ Routes are configured
- ✅ No runtime errors

### 2. Production Build

```bash
# Build exactly as CI does
npm run build-local

# Start production server
npm start

# Open browser
open http://localhost:3000

# Test:
# - Production optimizations applied
# - Bundle size acceptable
# - No build warnings
```

**What this tests:**
- ✅ Production build succeeds
- ✅ Sprint 3 optimizations working
- ✅ No build-time errors
- ✅ Static pages generated

### 3. Production Build with Real Database

```bash
# Set up real database (if needed)
export DATABASE_URL="postgresql://user:password@localhost:5432/testdb"

# Run migrations
npm run db:migrate

# Build
npm run build

# Start
npm start
```

**What this tests:**
- ✅ Database schema is correct
- ✅ Migrations run successfully
- ✅ Production environment works

---

## Test CI Checks Locally

### All CI Checks in Order

Run these commands in sequence (same order as CI):

#### Stage 1: Code Quality (~30 seconds)

```bash
# ESLint
npm run lint

# TypeScript
npm run check:types

# i18n completeness
npm run check:i18n

# Unused dependencies
npm run check:deps
```

**Fix issues:**
```bash
# Auto-fix linting
npm run lint:fix

# Check what deps are unused
npm run check:deps
# Then manually remove if safe
```

#### Stage 2: Unit Tests (~1 minute)

```bash
# Run all tests
npm run test

# With coverage
npm run test -- --coverage

# Watch mode (for development)
npm run test -- --watch
```

**Coverage requirements:**
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

**View coverage report:**
```bash
npm run test -- --coverage
open coverage/index.html
```

#### Stage 3: Build (~1 minute)

```bash
# Build application
npm run build-local

# Check output
ls -lh .next/static/chunks/

# Verify bundle size
npm run build-stats
```

**Bundle size limits:**
- First Load JS: < 550 KB (currently 521.1 KB ✅)
- Each page: < 100 KB

#### Stage 4: Security Scanning (~1 minute)

```bash
# Dependency vulnerabilities
npm audit --production

# Check for secrets (install git-secrets first)
git secrets --scan

# Or use gitleaks
docker run -v $(pwd):/path zricethezav/gitleaks:latest detect --source="/path" -v

# License compliance
npx license-checker --production --onlyAllow "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC"
```

**Fix vulnerabilities:**
```bash
# Auto-fix (be careful!)
npm audit fix

# Or update specific package
npm update <package-name>
```

#### Stage 5: E2E Tests (~2 minutes)

```bash
# Install browsers (first time only)
npx playwright install --with-deps chromium

# Run E2E tests
npm run test:e2e

# Run with UI (debugging)
npm run test:e2e -- --ui

# Run specific test
npm run test:e2e -- tests/e2e/Auth.SignIn.e2e.ts
```

**View test report:**
```bash
npx playwright show-report
```

---

## Test Deployments Locally

### Option 1: Docker (Recommended)

Build and run exactly as in production:

```bash
# Build Docker image
docker build -t nextjs-app:local .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXT_PUBLIC_APP_URL="http://localhost:3000" \
  -e CLERK_SECRET_KEY="sk_test_..." \
  -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..." \
  nextjs-app:local

# Test
curl http://localhost:3000
open http://localhost:3000
```

**What this tests:**
- ✅ Docker build succeeds
- ✅ Container starts correctly
- ✅ Environment variables work
- ✅ Production runtime works

### Option 2: Platform CLI Tools

#### Cloudflare Pages (Wrangler)

```bash
# Install wrangler
npm install -g wrangler

# Login
wrangler login

# Build
npm run build

# Test locally with Wrangler
wrangler pages dev .next

# Preview will be at http://localhost:8788
```

**What this tests:**
- ✅ Cloudflare Pages compatibility
- ✅ Edge runtime works
- ✅ Static assets served correctly

#### AWS (SAM Local)

```bash
# Install SAM CLI
brew install aws-sam-cli

# Build Docker image
docker build -t nextjs-app:local .

# Run locally (simulates Lambda/Fargate)
sam local start-api --docker-image nextjs-app:local
```

#### GCP (Cloud Run Emulator)

```bash
# Build Docker image
docker build -t nextjs-app:local .

# Run locally
docker run -p 8080:3000 \
  -e PORT=3000 \
  nextjs-app:local

# Test
curl http://localhost:8080
```

---

## Test with Docker

### Full Docker Compose Stack

Create `docker-compose.dev.yml`:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/nextjs
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=nextjs
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Run stack:**

```bash
# Start services
docker-compose -f docker-compose.dev.yml up

# Run migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Test
open http://localhost:3000

# Stop
docker-compose -f docker-compose.dev.yml down
```

**What this tests:**
- ✅ Multi-container setup
- ✅ Database connectivity
- ✅ Production environment
- ✅ Docker networking

---

## Simulate Full CI/CD Pipeline

### Option 1: Act (GitHub Actions Locally)

```bash
# Install act
brew install act

# List workflows
act -l

# Run CI workflow
act -j test

# Run specific job
act -j lint

# Run with secrets
act -j deploy -s GITHUB_TOKEN=ghp_xxx

# Dry run (see what would happen)
act -n
```

**What this tests:**
- ✅ GitHub Actions workflows
- ✅ CI pipeline steps
- ✅ Job dependencies
- ✅ Secrets handling

**Limitations:**
- Some actions may not work locally
- Slower than running commands directly
- Needs Docker

### Option 2: Custom CI Script

Create `.ci/test-local.sh`:

```bash
#!/bin/bash
set -e

echo "🧪 Running CI Pipeline Locally..."

echo "📝 Stage 1: Linting..."
npm run lint
npm run check:types
npm run check:i18n

echo "🧪 Stage 2: Unit Tests..."
npm run test -- --coverage

echo "🏗️  Stage 3: Build..."
npm run build-local

echo "🔒 Stage 4: Security..."
npm audit --production --audit-level=moderate
npx license-checker --production --onlyAllow "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC" --summary

echo "🎭 Stage 5: E2E Tests..."
npm run test:e2e

echo "✅ All CI checks passed!"
echo "Ready to push to GitHub."
```

**Run it:**

```bash
chmod +x .ci/test-local.sh
./.ci/test-local.sh
```

---

## Pre-Commit Hooks

Pre-commit hooks run automatically when you commit. Test them manually:

### Test Lefthook Hooks

```bash
# Run all pre-commit hooks
npx lefthook run pre-commit

# Run specific hook
npx lefthook run pre-commit lint

# Run pre-push hooks
npx lefthook run pre-push
```

### Test Individual Hooks

```bash
# Lint staged files
git add .
npm run lint -- --fix $(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx|js|jsx)$')

# Type check
npm run check:types

# Format
npx prettier --write $(git diff --cached --name-only --diff-filter=ACM)

# Run tests
npm run test
```

### Skip Hooks (Emergency Only)

```bash
# Skip pre-commit hooks
git commit --no-verify -m "emergency fix"

# Skip pre-push hooks
git push --no-verify
```

**⚠️ Warning:** Only use `--no-verify` for emergencies. CI will still catch issues.

---

## Troubleshooting

### Tests Pass Locally but Fail in CI

**Common causes:**

1. **Environment differences**
   ```bash
   # Run with CI environment variable
   CI=true npm test

   # Check Node version matches
   node --version  # Should be 22.x
   ```

2. **Time zone issues**
   ```bash
   # Run with UTC timezone
   TZ=UTC npm test
   ```

3. **Dependency versions**
   ```bash
   # Use exact versions from lock file
   rm -rf node_modules
   npm ci  # Use ci instead of install
   ```

4. **File system case sensitivity**
   ```bash
   # Check for import case mismatches
   # CI (Linux) is case-sensitive, macOS is not
   ```

### Build Fails Locally

**Solutions:**

1. **Clear build cache**
   ```bash
   npm run clean
   rm -rf .next node_modules package-lock.json
   npm install
   npm run build-local
   ```

2. **Check environment variables**
   ```bash
   # Verify .env.local exists
   cat .env.local

   # Or set manually
   export DATABASE_URL="postgresql://..."
   npm run build
   ```

3. **Check for syntax errors**
   ```bash
   npm run check:types
   ```

### Docker Build Fails

**Solutions:**

1. **Check Docker is running**
   ```bash
   docker info
   ```

2. **Clear Docker cache**
   ```bash
   docker system prune -a
   docker build --no-cache -t nextjs-app:local .
   ```

3. **Check Dockerfile**
   ```bash
   # Verify Dockerfile exists
   cat Dockerfile
   ```

### E2E Tests Fail

**Solutions:**

1. **Install browsers**
   ```bash
   npx playwright install --with-deps chromium
   ```

2. **Run with UI for debugging**
   ```bash
   npm run test:e2e -- --ui
   ```

3. **Check if app is running**
   ```bash
   # Start dev server first
   npm run dev

   # Then run E2E in another terminal
   npm run test:e2e
   ```

4. **View test artifacts**
   ```bash
   # Screenshots and videos in:
   ls -la playwright-report/
   npx playwright show-report
   ```

---

## Testing Checklist

Use this before pushing to GitHub:

### Quick Check (2-3 minutes)
- [ ] `npm run lint` - No linting errors
- [ ] `npm run check:types` - No TypeScript errors
- [ ] `npm run test` - All tests pass
- [ ] `npm run build-local` - Build succeeds

### Full Check (5-7 minutes)
- [ ] All quick checks pass
- [ ] `npm run test -- --coverage` - Coverage > 80%
- [ ] `npm audit --production` - No vulnerabilities
- [ ] `npm run test:e2e` - E2E tests pass
- [ ] `docker build -t test .` - Docker build succeeds

### Before Production Deploy (10-15 minutes)
- [ ] All full checks pass
- [ ] Test with production database
- [ ] Run Docker container locally
- [ ] Manual smoke testing
- [ ] Check bundle size < 550 KB
- [ ] Lighthouse score > 90

---

## Useful Commands Reference

```bash
# Development
npm run dev                    # Start dev server
npm run dev:spotlight          # Start with Sentry Spotlight

# Testing
npm run test                   # Run unit tests
npm run test -- --watch        # Watch mode
npm run test -- --coverage     # With coverage
npm run test:e2e               # E2E tests
npm run test:e2e -- --ui       # E2E with UI

# Quality Checks
npm run lint                   # Check linting
npm run lint:fix              # Fix linting
npm run check:types           # TypeScript check
npm run check:i18n            # i18n completeness
npm run check:deps            # Unused dependencies

# Building
npm run build-local           # Build with temp DB
npm run build                 # Build with real DB
npm run build-stats           # Build + bundle analysis

# Database
npm run db:generate           # Generate migration
npm run db:migrate            # Run migrations
npm run db:studio             # Open Drizzle Studio

# Docker
docker build -t test .        # Build image
docker run -p 3000:3000 test  # Run container

# CI Simulation
npx act -j test               # Run GitHub Actions locally
./.ci/test-local.sh          # Custom CI script

# Pre-commit
npx lefthook run pre-commit   # Run pre-commit hooks
npx lefthook run pre-push     # Run pre-push hooks

# Cleanup
npm run clean                 # Remove build artifacts
rm -rf node_modules           # Remove dependencies
npm ci                        # Clean install
```

---

## Performance Tips

### Speed Up Tests

```bash
# Run tests in parallel (default)
npm run test

# Limit workers for faster start
npm run test -- --max-workers=2

# Run only changed tests
npm run test -- --changed

# Run specific file
npm run test -- src/components/Hello.test.tsx
```

### Speed Up Build

```bash
# Use caching
export NEXT_BUILD_CACHE_DIR=.next/cache

# Disable source maps (faster)
export GENERATE_SOURCEMAP=false
npm run build

# Analyze only when needed
npm run build-stats  # Only when checking bundle size
```

### Cache Dependencies

```bash
# Create .npmrc
echo "cache=~/.npm" >> .npmrc

# Or set globally
npm config set cache ~/.npm
```

---

## Best Practices

1. **Always test locally before pushing**
   - Saves CI/CD minutes
   - Faster feedback
   - Prevents failed CI runs

2. **Use pre-commit hooks**
   - Catch issues immediately
   - No formatting debates
   - Consistent code style

3. **Run full test suite before PR**
   - Including E2E tests
   - With coverage check
   - Build verification

4. **Test Docker build weekly**
   - Catches container issues early
   - Verifies Dockerfile is current
   - Ensures production parity

5. **Keep CI and local in sync**
   - Same Node version
   - Same commands
   - Same environment variables

---

## Need Help?

- **CI/CD Pipeline:** See [CI_CD_GUIDE.md](./CI_CD_GUIDE.md)
- **Deployment:** See [DEPLOYMENT_README.md](./DEPLOYMENT_README.md)
- **Issues:** Check GitHub Actions logs

---

**Last Updated:** November 15, 2025

Ready to test! Run `npm run ci:local` to get started. 🚀
