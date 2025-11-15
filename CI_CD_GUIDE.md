# CI/CD Guide - Best Practices 2025

**Complete guide to Continuous Integration and Continuous Deployment**

**Last Updated:** November 15, 2025
**Version:** 2.0
**Status:** Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Git Branching Strategy](#git-branching-strategy)
3. [Environment Strategy](#environment-strategy)
4. [CI/CD Pipeline Architecture](#cicd-pipeline-architecture)
5. [Development Workflow](#development-workflow)
6. [Pull Request Process](#pull-request-process)
7. [Automated Testing Strategy](#automated-testing-strategy)
8. [Deployment Pipeline](#deployment-pipeline)
9. [Environment Promotion](#environment-promotion)
10. [Rollback Strategy](#rollback-strategy)
11. [Security & Compliance](#security--compliance)
12. [Monitoring & Observability](#monitoring--observability)
13. [Best Practices 2025](#best-practices-2025)
14. [Troubleshooting](#troubleshooting)

---

## Overview

### CI/CD Philosophy (2025 Standards)

Modern CI/CD emphasizes:

- **Trunk-Based Development** - Short-lived feature branches (< 2 days)
- **Automated Everything** - Tests, security scans, deployments
- **Progressive Delivery** - Feature flags, canary deployments, gradual rollouts
- **Shift Left Security** - Security scanning in every PR
- **Observable Pipelines** - Full visibility into every stage
- **Fast Feedback** - CI runs in < 10 minutes
- **Zero-Downtime Deployments** - Blue-green or rolling updates

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Developer Workflow                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Feature Branch → PR → Code Review → Tests → Merge to Main      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CI Pipeline (main)                         │
│  ┌────────┐  ┌────────┐  ┌─────────┐  ┌────────┐  ┌─────────┐ │
│  │ Lint   │→ │ Test   │→ │ Build   │→ │ Scan   │→ │ Package │ │
│  └────────┘  └────────┘  └─────────┘  └────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CD Pipeline (Environments)                    │
│                                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  Development │ → │   Staging    │ → │  Production  │      │
│  │  (Auto)      │    │  (Auto)      │    │  (Manual)    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│       │                    │                    │                │
│       ▼                    ▼                    ▼                │
│  Smoke Tests         Integration Tests    Canary → Full         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Git Branching Strategy

### Trunk-Based Development (Recommended for 2025)

Modern teams use **trunk-based development** with short-lived feature branches.

```
main (protected)
  ├── feature/add-user-auth (1-2 days)
  ├── feature/improve-performance (1-2 days)
  ├── hotfix/fix-login-bug (< 1 day)
  └── release/v2.0.0 (only for coordinated releases)
```

### Branch Types

#### 1. `main` (Production Branch)

- **Protected:** Requires PR approval
- **Always deployable:** Every commit is production-ready
- **Auto-deploy to production:** After approval
- **Never commit directly:** Always via PR

**Protection Rules:**
```yaml
# .github/branch-protection.yml
main:
  required_status_checks:
    - lint
    - test
    - build
    - security-scan
    - e2e-tests
  required_approving_review_count: 2
  dismiss_stale_reviews: true
  require_code_owner_reviews: true
  require_signed_commits: true
  enforce_admins: false  # Allow emergency hotfixes with override
```

#### 2. Feature Branches

- **Naming:** `feature/description` or `feat/TICKET-123-description`
- **Lifespan:** 1-2 days maximum
- **Base:** Always from `main`
- **Merge:** Via PR to `main`

**Examples:**
```bash
feature/add-oauth-login
feature/improve-bundle-size
feat/JIRA-123-user-profile
```

#### 3. Hotfix Branches

- **Naming:** `hotfix/description` or `fix/TICKET-123-description`
- **Lifespan:** < 1 day
- **Priority:** Urgent production fixes
- **Fast-track:** Can bypass some checks with approval

**Examples:**
```bash
hotfix/fix-authentication-loop
fix/URGENT-payment-processing
```

#### 4. Release Branches (Optional)

Only for coordinated releases with multiple features:

- **Naming:** `release/v2.0.0`
- **Use case:** Marketing launches, major versions
- **Process:** Stabilize → QA → Deploy → Tag → Delete

### Branch Naming Conventions (2025 Standard)

```bash
# Feature development
feature/TICKET-ID-short-description
feat/add-dark-mode

# Bug fixes
fix/TICKET-ID-short-description
bugfix/login-redirect-loop

# Hotfixes (production)
hotfix/critical-security-issue

# Releases
release/v2.0.0

# Experiments (with feature flags)
experiment/new-checkout-flow

# Documentation
docs/update-deployment-guide

# Performance improvements
perf/reduce-bundle-size

# Refactoring
refactor/auth-module
```

---

## Environment Strategy

### Three-Tier Environment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        DEVELOPMENT                               │
│  Purpose: Developer testing, rapid iteration                     │
│  Branch: feature/* branches                                      │
│  Deploy: On PR creation (preview)                                │
│  Database: Ephemeral (PGlite) or dev database                   │
│  Auth: Test mode or dev keys                                     │
│  Monitoring: Minimal (errors only)                               │
│  Cost: Free tier / minimal                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         STAGING                                  │
│  Purpose: Pre-production testing, QA validation                  │
│  Branch: main (auto-deploy)                                      │
│  Deploy: Automatic on merge to main                              │
│  Database: Persistent, separate from production                  │
│  Auth: Staging keys (separate from production)                   │
│  Monitoring: Full (mirrors production)                           │
│  Cost: ~50% of production                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (Manual approval)
┌─────────────────────────────────────────────────────────────────┐
│                        PRODUCTION                                │
│  Purpose: Live users                                             │
│  Branch: main (manual promote from staging)                      │
│  Deploy: Manual approval + automated deployment                  │
│  Database: Production (HA, backups, replicas)                   │
│  Auth: Production keys (rotated every 90 days)                   │
│  Monitoring: Full observability + alerting                       │
│  Cost: Full scale                                                │
└─────────────────────────────────────────────────────────────────┘
```

### Environment Configuration

| Aspect | Development | Staging | Production |
|--------|-------------|---------|------------|
| **Database** | PGlite/Dev DB | Persistent PostgreSQL | HA PostgreSQL |
| **Auth** | Test keys | Staging keys | Production keys |
| **Secrets** | `.env.local` | GitHub Secrets (staging) | Secrets Manager |
| **Source Maps** | Enabled | Enabled | Uploaded to Sentry |
| **Logging** | Console | BetterStack | BetterStack + alerts |
| **Monitoring** | Dev Sentry | Full Sentry | Full stack + PagerDuty |
| **Auto-deploy** | On PR | On merge to main | Manual approval |
| **Rollback** | N/A | Automatic | Manual + canary |

---

## CI/CD Pipeline Architecture

### Continuous Integration (CI) Pipeline

Runs on **every PR** and **every push to main**:

```yaml
┌─────────────────────────────────────────────────────────────────┐
│                     CI Pipeline Stages                           │
└─────────────────────────────────────────────────────────────────┘

Stage 1: Code Quality (Parallel, ~2 min)
  ├─ ESLint (code standards)
  ├─ TypeScript (type checking)
  ├─ Prettier (formatting)
  └─ Commitlint (commit message format)

Stage 2: Unit Tests (Parallel, ~3 min)
  ├─ Vitest (unit tests)
  ├─ Storybook tests (component tests)
  └─ Coverage report → Codecov

Stage 3: Build (Sequential, ~2 min)
  ├─ Next.js build
  ├─ Bundle analysis
  └─ Size limit check

Stage 4: Security Scanning (Parallel, ~2 min)
  ├─ npm audit (dependencies)
  ├─ Snyk/Dependabot (vulnerability scan)
  ├─ CodeQL (code scanning)
  └─ Secrets detection (GitGuardian)

Stage 5: Integration Tests (Sequential, ~3 min)
  ├─ E2E tests (Playwright - Chromium only for PR)
  └─ API tests

Total: ~8-10 minutes
```

### Continuous Deployment (CD) Pipeline

Runs **after CI passes** on main branch:

```yaml
┌─────────────────────────────────────────────────────────────────┐
│                     CD Pipeline Stages                           │
└─────────────────────────────────────────────────────────────────┘

Stage 1: Package (~2 min)
  ├─ Docker build
  ├─ Container security scan (Trivy)
  └─ Push to registry (ECR/GCR/Docker Hub)

Stage 2: Deploy to Staging (Auto, ~3 min)
  ├─ Deploy to staging environment
  ├─ Run database migrations
  ├─ Smoke tests
  └─ Integration tests

Stage 3: Staging Validation (~5 min)
  ├─ E2E tests (full suite - Chromium + Firefox)
  ├─ Performance tests (Lighthouse)
  ├─ Accessibility tests
  └─ Visual regression tests

Stage 4: Production Approval (Manual)
  ├─ Slack notification to team
  ├─ Review staging deployment
  └─ Manual approval button

Stage 5: Deploy to Production (~5 min)
  ├─ Canary deployment (10% traffic)
  ├─ Monitor canary (5 min)
  ├─ Gradual rollout (10% → 50% → 100%)
  ├─ Database migrations (if any)
  └─ Full deployment

Stage 6: Post-Deployment (~2 min)
  ├─ Smoke tests on production
  ├─ Health checks
  ├─ Create deployment tag
  ├─ Notify team (Slack)
  └─ Create Sentry release

Total: ~15-20 minutes (excluding approval wait time)
```

---

## Development Workflow

### Day-to-Day Developer Flow

#### 1. Start New Feature

```bash
# Pull latest main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/JIRA-123-add-user-profile

# Optional: Create draft PR immediately (recommended)
gh pr create --draft --title "WIP: Add user profile page" \
  --body "**Status:** 🚧 Work in Progress

## Description
Adding user profile page with avatar upload.

## Tasks
- [ ] Create profile page component
- [ ] Add avatar upload
- [ ] Write tests
- [ ] Update documentation
"
```

**Why draft PR immediately?**
- Triggers CI checks early
- Shows team what you're working on
- Prevents merge conflicts early
- Gets early feedback

#### 2. Develop with Fast Feedback

```bash
# Run tests in watch mode
npm run test -- --watch

# Run dev server
npm run dev

# Run type checking
npm run check:types -- --watch
```

#### 3. Commit Often (Atomic Commits)

```bash
# Use conventional commits
npm run commit

# Or manually with conventional format
git commit -m "feat(profile): add user profile page component

- Created ProfilePage component
- Added responsive layout
- Integrated with auth context

Refs: JIRA-123"
```

**Commit Format (Conventional Commits):**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `perf`: Performance improvement
- `refactor`: Code refactoring
- `test`: Add/update tests
- `docs`: Documentation
- `chore`: Build/tooling changes
- `ci`: CI/CD changes
- `style`: Code style changes

#### 4. Push and Create PR

```bash
# Push to remote
git push origin feature/JIRA-123-add-user-profile

# Convert draft to ready (if draft)
gh pr ready

# Or create new PR
gh pr create --title "feat: Add user profile page" \
  --body "## Description
Complete user profile page with avatar upload.

## Changes
- Added ProfilePage component
- Integrated avatar upload with S3
- Added profile update API endpoint
- Added E2E tests

## Testing
- ✅ Unit tests passing
- ✅ E2E tests passing
- ✅ Tested in Safari, Chrome, Firefox

## Screenshots
![Profile Page](./screenshots/profile.png)

Closes JIRA-123"
```

#### 5. Address PR Feedback

```bash
# Make changes based on review
git add .
git commit -m "fix(profile): address PR feedback

- Fixed accessibility issues
- Added loading states
- Improved error handling"

git push origin feature/JIRA-123-add-user-profile
# CI automatically re-runs
```

#### 6. Merge to Main

After approval:

```bash
# Use GitHub's "Squash and merge" button
# Or via CLI:
gh pr merge --squash --delete-branch
```

**Merge Strategy:**
- **Squash merge** (recommended): Keeps main history clean
- All commits squashed into one
- Commit message becomes PR title + description
- Branch automatically deleted

---

## Pull Request Process

### PR Template

Every PR should include (create `.github/pull_request_template.md`):

```markdown
## Description
<!-- Clear description of what this PR does -->

## Type of Change
- [ ] 🎉 New feature
- [ ] 🐛 Bug fix
- [ ] ⚡ Performance improvement
- [ ] ♻️ Refactoring
- [ ] 📝 Documentation
- [ ] 🔧 Configuration change

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed
- [ ] Tested in multiple browsers

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally
- [ ] Bundle size impact checked

## Screenshots (if applicable)
<!-- Add screenshots for UI changes -->

## Related Issues
Closes #123
Refs #456
```

### PR Review Checklist (for Reviewers)

#### Code Quality
- [ ] Code is readable and maintainable
- [ ] Follows project conventions
- [ ] No unnecessary complexity
- [ ] Error handling is appropriate
- [ ] No hardcoded values (use env vars)

#### Security
- [ ] No secrets in code
- [ ] Input validation present
- [ ] XSS/SQL injection prevented
- [ ] Authentication/authorization correct
- [ ] HTTPS used for external calls

#### Performance
- [ ] No N+1 queries
- [ ] Appropriate caching
- [ ] Bundle size acceptable
- [ ] Images optimized
- [ ] No memory leaks

#### Testing
- [ ] Tests cover new code
- [ ] Edge cases tested
- [ ] Error cases tested
- [ ] Tests are maintainable

#### Documentation
- [ ] Code comments explain "why"
- [ ] README updated if needed
- [ ] API docs updated
- [ ] Migration guide if breaking change

### PR Approval Requirements

**For Regular PRs:**
- ✅ 1 approval from team member
- ✅ All CI checks passing
- ✅ No unresolved conversations
- ✅ Branch up-to-date with main

**For High-Risk PRs:**
- ✅ 2 approvals (one from senior/lead)
- ✅ All CI checks passing
- ✅ Security scan passed
- ✅ Performance testing completed
- ✅ Deployment plan documented

**High-Risk Categories:**
- Authentication/authorization changes
- Payment processing
- Database schema migrations
- Security-related code
- Third-party integrations
- Infrastructure changes

---

## Automated Testing Strategy

### Testing Pyramid (2025 Standard)

```
                    ╱╲
                   ╱  ╲
                  ╱ E2E╲          ~10% - Full user flows
                 ╱──────╲         (Slow, expensive, brittle)
                ╱        ╲
               ╱Integration╲      ~20% - API/DB/Service tests
              ╱────────────╲      (Medium speed, medium cost)
             ╱              ╲
            ╱  Unit Tests    ╲    ~70% - Pure functions, components
           ╱──────────────────╲   (Fast, cheap, reliable)
```

### 1. Pre-Commit Checks (Instant Feedback)

Using **Lefthook** (configured in `lefthook.yml`):

```yaml
# Runs on git commit
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{js,ts,jsx,tsx}"
      run: npm run lint:fix {staged_files}

    types:
      glob: "*.{ts,tsx}"
      run: npm run check:types

    format:
      glob: "*.{js,ts,jsx,tsx,json,md}"
      run: npx prettier --write {staged_files}

# Runs on git push
pre-push:
  commands:
    test:
      run: npm run test
```

### 2. PR Checks (CI Pipeline)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run check:types
      - run: npm run check:i18n
      - run: npm run check:deps

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test -- --coverage
      - uses: codecov/codecov-action@v4
        with:
          files: ./coverage/coverage-final.json

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      # Bundle size check
      - uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          skip_step: install

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
        env:
          CI: true

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Dependency vulnerabilities
      - run: npm audit --production --audit-level=moderate

      # Code scanning
      - uses: github/codeql-action/init@v3
        with:
          languages: javascript, typescript
      - uses: github/codeql-action/analyze@v3

      # Secrets scanning
      - uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD
```

### 3. Staging Tests (Post-Deploy)

```yaml
# .github/workflows/staging-tests.yml
name: Staging Tests

on:
  deployment_status:

jobs:
  smoke-tests:
    if: github.event.deployment_status.state == 'success' && github.event.deployment_status.environment == 'staging'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Basic health checks
      - name: Check homepage
        run: |
          STATUS=$(curl -o /dev/null -s -w "%{http_code}" ${{ secrets.STAGING_URL }})
          if [ $STATUS -ne 200 ]; then
            echo "Homepage returned $STATUS"
            exit 1
          fi

      # E2E tests against staging
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}
          CI: true

      # Performance tests
      - name: Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: ${{ secrets.STAGING_URL }}
          uploadArtifacts: true
          temporaryPublicStorage: true
          runs: 3

      # Accessibility tests
      - name: Accessibility
        run: npx @axe-core/cli ${{ secrets.STAGING_URL }}
```

### Test Coverage Requirements

```javascript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      statements: 80,  // Minimum 80% statement coverage
      branches: 75,    // Minimum 75% branch coverage
      functions: 80,   // Minimum 80% function coverage
      lines: 80,       // Minimum 80% line coverage
      exclude: [
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/node_modules/**',
        '**/dist/**',
        '**/.next/**',
      ],
    },
  },
});
```

**Coverage Gates:**
- ❌ **PR blocked** if coverage drops by > 1%
- ⚠️ **Warning** if new code has < 80% coverage
- ✅ **Pass** if coverage maintained or improved

---

## Deployment Pipeline

### GitHub Actions Workflow Structure

```
.github/workflows/
├── ci.yml                    # PR checks (lint, test, build, security)
├── reusable-test.yml         # Reusable test workflow
├── reusable-security-scan.yml # Reusable security workflow
├── reusable-deploy.yml       # Reusable deploy workflow
├── deploy-cloudflare.yml     # Cloudflare-specific deployment
├── deploy-aws.yml            # AWS ECS deployment
├── deploy-gcp.yml            # GCP Cloud Run deployment
└── deploy-azure.yml          # Azure App Service deployment
```

### Reusable Workflows (DRY Principle)

**`.github/workflows/reusable-test.yml`:**

```yaml
name: Reusable Test Workflow

on:
  workflow_call:
    inputs:
      node-version:
        required: false
        type: string
        default: '22'
      coverage:
        required: false
        type: boolean
        default: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Type check
        run: npm run check:types

      - name: Unit tests
        run: npm run test ${{ inputs.coverage && '-- --coverage' || '' }}

      - name: Upload coverage
        if: inputs.coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/coverage-final.json
```

### Environment-Specific Deployments

#### Development (Preview) Deployment

```yaml
# Triggered on PR creation
name: Deploy Preview

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  deploy-preview:
    runs-on: ubuntu-latest
    environment:
      name: preview-pr-${{ github.event.pull_request.number }}
      url: ${{ steps.deploy.outputs.url }}
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Cloudflare Pages (Preview)
        id: deploy
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: nextjs-boilerplate
          directory: .next
          branch: ${{ github.head_ref }}
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🚀 **Preview deployed!**

              🔗 **URL:** ${{ steps.deploy.outputs.url }}

              📦 **Commit:** ${context.sha.substring(0, 7)}

              ⏱️ **Build time:** ${{ steps.deploy.outputs.build_time }}

              Please test before merging.`
            })
```

#### Staging Deployment

```yaml
# Triggered on merge to main
name: Deploy to Staging

on:
  push:
    branches: [main]

jobs:
  test:
    uses: ./.github/workflows/reusable-test.yml
    with:
      coverage: true

  security:
    uses: ./.github/workflows/reusable-security-scan.yml

  deploy-staging:
    needs: [test, security]
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.your-domain.com
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to staging
        uses: ./.github/workflows/reusable-deploy.yml
        with:
          environment: staging
          database_url: ${{ secrets.STAGING_DATABASE_URL }}

      - name: Run smoke tests
        run: |
          curl -f https://staging.your-domain.com/api/health || exit 1

      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "✅ Staging deployment successful",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Staging Deployed* 🚀\n\n*Commit:* ${{ github.sha }}\n*Author:* ${{ github.actor }}\n*URL:* https://staging.your-domain.com"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

#### Production Deployment

```yaml
# Manual trigger or automatic after staging tests pass
name: Deploy to Production

on:
  workflow_dispatch:
    inputs:
      deployment-type:
        description: 'Deployment type'
        required: true
        type: choice
        options:
          - canary
          - full
          - rollback

jobs:
  production-approval:
    runs-on: ubuntu-latest
    environment:
      name: production-approval
    steps:
      - name: Request approval
        run: echo "Waiting for production approval"

  deploy-production:
    needs: production-approval
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://your-domain.com
    steps:
      - uses: actions/checkout@v4

      - name: Create Sentry release
        run: |
          npx sentry-cli releases new ${{ github.sha }}
          npx sentry-cli releases set-commits ${{ github.sha }} --auto
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}

      - name: Deploy with canary
        if: inputs.deployment-type == 'canary'
        run: |
          # Deploy to 10% of traffic
          # Monitor for 5 minutes
          # Gradually increase to 100%

      - name: Deploy full
        if: inputs.deployment-type == 'full'
        run: |
          # Deploy to 100% of traffic

      - name: Finalize Sentry release
        run: |
          npx sentry-cli releases finalize ${{ github.sha }}
          npx sentry-cli releases deploys ${{ github.sha }} new -e production

      - name: Tag release
        run: |
          git tag -a "v$(date +'%Y.%m.%d')-${{ github.run_number }}" \
            -m "Production release"
          git push origin --tags

      - name: Notify team
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "🎉 Production deployment successful!",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Production Deployed* 🎉\n\n*Version:* v$(date +'%Y.%m.%d')-${{ github.run_number }}\n*Commit:* ${{ github.sha }}\n*Author:* ${{ github.actor }}\n*Type:* ${{ inputs.deployment-type }}"
                  }
                },
                {
                  "type": "actions",
                  "elements": [
                    {
                      "type": "button",
                      "text": {
                        "type": "plain_text",
                        "text": "View Deployment"
                      },
                      "url": "https://your-domain.com"
                    }
                  ]
                }
              ]
            }
```

---

## Environment Promotion

### Promotion Strategy

```
Feature Branch (PR Preview)
          ↓ [Merge to main]
     Main Branch
          ↓ [Auto-deploy]
      Staging
          ↓ [All tests pass]
[Manual approval required]
          ↓
      Production
   [Canary → Full rollout]
```

### Automated Promotion Workflow

```yaml
name: Environment Promotion

on:
  workflow_run:
    workflows: ["Deploy to Staging"]
    types: [completed]

jobs:
  staging-tests-passed:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest
    steps:
      - name: Check staging health
        run: |
          # Wait for staging to stabilize
          sleep 60

          # Run health checks
          curl -f https://staging.your-domain.com/api/health

          # Check error rates in Sentry
          # Check performance in monitoring

      - name: Request production approval
        uses: trstringer/manual-approval@v1
        with:
          secret: ${{ github.token }}
          approvers: devops-team,senior-devs
          minimum-approvals: 2
          issue-title: "Deploy to Production?"
          issue-body: |
            ## Production Deployment Request

            **Staging URL:** https://staging.your-domain.com
            **Commit:** ${{ github.sha }}
            **Author:** ${{ github.actor }}

            ### Pre-Deployment Checklist
            - [ ] Staging tests passed
            - [ ] No errors in Sentry (last 1 hour)
            - [ ] Performance acceptable (Lighthouse > 90)
            - [ ] Database migrations tested
            - [ ] Rollback plan ready

            ### Deployment Plan
            1. Canary deployment (10% traffic)
            2. Monitor for 5 minutes
            3. Gradual rollout (10% → 50% → 100%)
            4. Total time: ~15 minutes

            **Approve to deploy to production.**

      - name: Trigger production deployment
        if: success()
        uses: actions/github-script@v7
        with:
          script: |
            await github.rest.actions.createWorkflowDispatch({
              owner: context.repo.owner,
              repo: context.repo.repo,
              workflow_id: 'deploy-production.yml',
              ref: 'main',
              inputs: {
                'deployment-type': 'canary'
              }
            })
```

### Deployment Gates

**Before Staging:**
- ✅ All CI checks passed
- ✅ Code review approved
- ✅ Branch up-to-date with main
- ✅ No blocking bugs in main

**Before Production:**
- ✅ Staging deployment successful
- ✅ Staging tests passed (smoke + E2E)
- ✅ No errors in Sentry (last 1 hour)
- ✅ Performance acceptable
- ✅ Manual approval (2+ approvers)
- ✅ Deployment window (optional: 9am-5pm weekdays)

---

## Rollback Strategy

### Automatic Rollback Triggers

```yaml
# .github/workflows/auto-rollback.yml
name: Auto Rollback

on:
  deployment_status:

jobs:
  monitor-deployment:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - name: Monitor for 5 minutes
        run: |
          END_TIME=$(($(date +%s) + 300))
          while [ $(date +%s) -lt $END_TIME ]; do
            # Check error rate
            ERROR_RATE=$(curl -s "$SENTRY_API/stats" | jq '.error_rate')
            if (( $(echo "$ERROR_RATE > 5" | bc -l) )); then
              echo "Error rate too high: $ERROR_RATE%"
              exit 1
            fi

            # Check response time
            AVG_RESPONSE=$(curl -s "$MONITORING_API/metrics" | jq '.avg_response_time')
            if (( $(echo "$AVG_RESPONSE > 2000" | bc -l) )); then
              echo "Response time too high: ${AVG_RESPONSE}ms"
              exit 1
            fi

            sleep 30
          done

      - name: Rollback on failure
        if: failure()
        run: |
          # Rollback to previous version
          # Implementation depends on platform
```

### Manual Rollback Process

#### Quick Rollback (< 5 minutes)

```bash
# 1. Identify last good deployment
gh deployment list --env production

# 2. Trigger rollback workflow
gh workflow run deploy-production.yml \
  --ref main \
  --field deployment-type=rollback \
  --field rollback-to=v2024.11.14-123

# 3. Monitor rollback
watch -n 5 'curl -s https://your-domain.com/api/health'
```

#### Platform-Specific Rollback

**Cloudflare Pages:**
```bash
# Rollback via CLI
wrangler pages deployment list
wrangler pages deployment rollback <deployment-id>

# Or via dashboard
# Cloudflare Dashboard → Pages → Deployments → Rollback
```

**AWS ECS:**
```bash
# Get previous task definition
aws ecs describe-services \
  --cluster nextjs-production \
  --services nextjs-service

# Update to previous task definition
aws ecs update-service \
  --cluster nextjs-production \
  --service nextjs-service \
  --task-definition nextjs-app:123  # Previous version
```

**GCP Cloud Run:**
```bash
# List revisions
gcloud run revisions list --service nextjs-app

# Route traffic to previous revision
gcloud run services update-traffic nextjs-app \
  --to-revisions=nextjs-app-00123=100
```

### Database Rollback (Migrations)

```yaml
# Always use reversible migrations
# Example migration file structure:

# migrations/2024-11-15-add-user-profile.sql
-- Up migration
ALTER TABLE users ADD COLUMN profile_data JSONB;

# migrations/2024-11-15-add-user-profile-down.sql
-- Down migration
ALTER TABLE users DROP COLUMN profile_data;
```

**Rollback database:**
```bash
# Rollback last migration
npm run db:migrate:rollback

# Rollback specific migration
npm run db:migrate:rollback -- --to=2024-11-14-previous-migration
```

---

## Security & Compliance

### Security Scanning Layers

#### 1. Pre-Commit (Local)

```yaml
# lefthook.yml
pre-commit:
  commands:
    secrets-scan:
      run: |
        # Scan for secrets
        npx secretlint **/*

        # Check for AWS keys, API tokens, etc.
        git diff --cached | grep -E "(AWS_SECRET|API_KEY|PASSWORD)" && exit 1 || exit 0
```

#### 2. PR Checks (CI)

```yaml
# .github/workflows/security.yml
name: Security Scan

on: [pull_request, push]

jobs:
  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # npm audit
      - run: npm audit --production --audit-level=moderate

      # Snyk scan
      - uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

      # Dependabot alerts check
      - uses: dependabot/fetch-metadata@v1

  code-scan:
    runs-on: ubuntu-latest
    steps:
      # CodeQL (GitHub Advanced Security)
      - uses: github/codeql-action/init@v3
        with:
          languages: javascript, typescript
          queries: security-and-quality

      - uses: github/codeql-action/autobuild@v3
      - uses: github/codeql-action/analyze@v3

  secrets-scan:
    runs-on: ubuntu-latest
    steps:
      # TruffleHog (secrets detection)
      - uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD
          extra_args: --only-verified

  container-scan:
    runs-on: ubuntu-latest
    steps:
      # Trivy (container vulnerabilities)
      - uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ env.IMAGE_NAME }}
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'

      - uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'
```

### Compliance Requirements (2025)

#### SBOM Generation (Software Bill of Materials)

```yaml
# Required for compliance (Executive Order 14028)
- name: Generate SBOM
  run: |
    npx @cyclonedx/cyclonedx-npm --output-file sbom.json

- name: Upload SBOM
  uses: actions/upload-artifact@v4
  with:
    name: sbom
    path: sbom.json
```

#### License Compliance

```yaml
- name: Check licenses
  run: |
    npx license-checker --production \
      --onlyAllow "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC" \
      --failOn "GPL;AGPL"
```

#### Audit Logging

All deployments logged with:
- Who deployed
- What was deployed (commit SHA)
- When deployed (timestamp)
- Where deployed (environment)
- Approval chain

```yaml
- name: Log deployment
  run: |
    curl -X POST ${{ secrets.AUDIT_LOG_API }} \
      -H "Content-Type: application/json" \
      -d '{
        "event": "deployment",
        "environment": "production",
        "actor": "${{ github.actor }}",
        "commit": "${{ github.sha }}",
        "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
        "approvers": ["user1", "user2"]
      }'
```

---

## Monitoring & Observability

### Deployment Monitoring

#### Real-Time Metrics

```yaml
# Monitor during deployment
- name: Monitor deployment metrics
  run: |
    # Check error rate
    ERROR_RATE=$(curl "$SENTRY_API/stats?interval=5m" | jq '.error_rate')
    echo "Error rate: $ERROR_RATE%"

    # Check response time
    P95_LATENCY=$(curl "$MONITORING_API/p95" | jq '.latency')
    echo "P95 latency: ${P95_LATENCY}ms"

    # Check success rate
    SUCCESS_RATE=$(curl "$API_URL/api/health" -w "%{http_code}" -o /dev/null -s)
    echo "Health check: $SUCCESS_RATE"

    # Fail if metrics degraded
    if (( $(echo "$ERROR_RATE > 1" | bc -l) )); then
      echo "Error rate too high!"
      exit 1
    fi
```

#### Deployment Annotations

```yaml
# Add deployment markers to monitoring tools
- name: Create Sentry release
  run: |
    sentry-cli releases new ${{ github.sha }}
    sentry-cli releases set-commits ${{ github.sha }} --auto
    sentry-cli releases deploys ${{ github.sha }} new -e production

- name: Annotate Grafana
  run: |
    curl -X POST "$GRAFANA_URL/api/annotations" \
      -H "Authorization: Bearer $GRAFANA_API_KEY" \
      -d '{
        "text": "Deployment: ${{ github.sha }}",
        "tags": ["deployment", "production"],
        "time": '$(date +%s)'000'
      }'
```

### Post-Deployment Verification

```yaml
- name: Run smoke tests
  run: |
    # Health check
    curl -f ${{ secrets.APP_URL }}/api/health || exit 1

    # Critical user flows
    npm run test:smoke -- --grep "@critical"

    # Performance check
    npx lighthouse ${{ secrets.APP_URL }} \
      --only-categories=performance \
      --chrome-flags="--headless" \
      --output=json \
      --output-path=./lighthouse.json

    SCORE=$(cat lighthouse.json | jq '.categories.performance.score * 100')
    if (( $(echo "$SCORE < 90" | bc -l) )); then
      echo "Performance degraded: $SCORE"
      exit 1
    fi
```

---

## Best Practices 2025

### 1. Trunk-Based Development

✅ **DO:**
- Small, frequent commits to main
- Feature branches < 2 days
- Feature flags for incomplete features
- Continuous integration

❌ **DON'T:**
- Long-lived feature branches (> 2 days)
- Gitflow (main, develop, release branches)
- Manual cherry-picking
- Batching deployments

### 2. Shift-Left Security

✅ **DO:**
- Security scans in every PR
- Automated dependency updates (Dependabot)
- Pre-commit secret scanning
- SBOM generation

❌ **DON'T:**
- Security as final gate only
- Manual security reviews
- Ignoring security warnings
- Secrets in code

### 3. Progressive Delivery

✅ **DO:**
- Canary deployments (10% → 100%)
- Feature flags for A/B testing
- Gradual rollouts
- Automatic rollback on errors

❌ **DON'T:**
- Big bang deployments
- All users at once
- No rollback plan
- Deploy on Fridays (unless necessary)

### 4. Observable Deployments

✅ **DO:**
- Deployment markers in Sentry/Grafana
- Real-time monitoring during deploy
- Automated health checks
- Slack notifications

❌ **DON'T:**
- Deploy and hope
- No monitoring
- Manual verification only
- Silent deployments

### 5. Fast Feedback

✅ **DO:**
- CI runs in < 10 minutes
- Parallel test execution
- Cached dependencies
- Fail fast on errors

❌ **DON'T:**
- Slow CI (> 15 minutes)
- Sequential tests
- No caching
- Run all tests always

### 6. Deployment Automation

✅ **DO:**
- Fully automated staging deploys
- One-click production deploys
- Automated rollbacks
- Infrastructure as Code

❌ **DON'T:**
- Manual deployments
- SSH into servers
- Manual rollbacks
- Snowflake servers

### 7. Quality Gates

✅ **DO:**
- Required status checks
- Minimum test coverage (80%)
- Bundle size limits
- Performance budgets

❌ **DON'T:**
- Merge without approval
- Skip tests
- Ignore performance
- No size limits

### 8. Documentation as Code

✅ **DO:**
- README in every directory
- Architecture Decision Records (ADRs)
- Inline code comments
- API documentation (OpenAPI)

❌ **DON'T:**
- Separate documentation
- Outdated docs
- No comments
- Undocumented APIs

### 9. Immutable Infrastructure

✅ **DO:**
- Container-based deployments
- Versioned images
- No server modifications
- Infrastructure as Code

❌ **DON'T:**
- Mutable servers
- Manual server changes
- Unversioned deployments
- Configuration drift

### 10. Continuous Improvement

✅ **DO:**
- Regular retrospectives
- Metrics-driven decisions
- Experiment and iterate
- Learn from incidents

❌ **DON'T:**
- "It works, don't touch it"
- Ignore metrics
- Fear of change
- Blame culture

---

## Troubleshooting

### Common Issues

#### 1. CI Failing on Main

**Symptoms:** Build passes on PR but fails on main

**Causes:**
- Merge conflicts resolved incorrectly
- Environment-specific variables missing
- Flaky tests

**Solutions:**
```bash
# Ensure branch is up-to-date before merge
git checkout feature/my-feature
git pull origin main
git push

# If already merged, revert and fix
git revert <bad-commit-sha>
git push origin main
```

#### 2. Deployment Stuck

**Symptoms:** Deployment in "pending" state

**Causes:**
- Waiting for manual approval
- Resource limits reached
- Network issues

**Solutions:**
```bash
# Check GitHub Actions status
gh run list --limit 5

# View specific run
gh run view <run-id>

# Cancel stuck run
gh run cancel <run-id>

# Re-run deployment
gh workflow run deploy-production.yml
```

#### 3. Tests Pass Locally, Fail in CI

**Symptoms:** Tests work on your machine, fail in CI

**Causes:**
- Time zone differences
- Environment variables missing
- Dependency version mismatch

**Solutions:**
```bash
# Run tests in CI-like environment locally
docker run -it node:22 bash
git clone <your-repo>
npm ci  # Use exact lock file versions
CI=true npm test

# Check environment variables
# Add DEBUG=true to CI workflow to see env vars
```

#### 4. Slow CI Pipeline

**Symptoms:** CI takes > 15 minutes

**Solutions:**
```yaml
# Parallelize jobs
jobs:
  lint:
    runs-on: ubuntu-latest
  test:
    runs-on: ubuntu-latest
  e2e:
    runs-on: ubuntu-latest
# All run in parallel

# Cache dependencies
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

# Use faster runners (GitHub-hosted or self-hosted)
runs-on: ubuntu-latest-8-cores  # Larger runner
```

#### 5. Deployment Rollback Needed

**Symptoms:** Production deployment causing issues

**Immediate Actions:**
```bash
# 1. Trigger rollback workflow
gh workflow run deploy-production.yml \
  --field deployment-type=rollback

# 2. Or manual rollback (platform-specific)
# See "Rollback Strategy" section above

# 3. Notify team
# Post in #incidents Slack channel

# 4. Create incident report
# Document what happened, root cause, fix
```

---

## Quick Reference

### Daily Commands

```bash
# Start new feature
git checkout main && git pull && git checkout -b feature/my-feature

# Commit changes
npm run commit  # Interactive conventional commits

# Push and create PR
git push -u origin feature/my-feature
gh pr create --draft

# Merge PR (after approval)
gh pr merge --squash --delete-branch

# Deploy to production (manual trigger)
gh workflow run deploy-production.yml --field deployment-type=canary

# Check deployment status
gh run list --workflow=deploy-production.yml --limit 5

# Rollback
gh workflow run deploy-production.yml --field deployment-type=rollback
```

### Branch Protection Rules Setup

```bash
# Via GitHub CLI
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["lint","test","build","security-scan"]}' \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field enforce_admins=false \
  --field required_linear_history=true
```

### Environment Secrets Setup

```bash
# Add secrets to GitHub
gh secret set DATABASE_URL --env production
gh secret set CLERK_SECRET_KEY --env production
gh secret set ARCJET_KEY --env production

# List secrets
gh secret list --env production
```

---

## Additional Resources

- **GitHub Actions Documentation:** https://docs.github.com/en/actions
- **Trunk-Based Development:** https://trunkbaseddevelopment.com/
- **Conventional Commits:** https://www.conventionalcommits.org/
- **Semantic Versioning:** https://semver.org/
- **The Twelve-Factor App:** https://12factor.net/

---

**Last Updated:** November 15, 2025
**Maintained By:** DevOps Team
**Status:** ✅ Production Ready

All CI/CD pipelines configured and operational!
