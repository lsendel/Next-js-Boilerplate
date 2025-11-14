# CI/CD Pipeline Documentation

## Overview

This project includes a comprehensive, modular CI/CD pipeline built with GitHub Actions following 2025 best practices. The pipeline includes automated testing, security scanning, performance monitoring, and deployment to multiple cloud providers.

## Table of Contents

1. [Pipeline Architecture](#pipeline-architecture)
2. [Workflows](#workflows)
3. [Configuration](#configuration)
4. [Security Scanning](#security-scanning)
5. [Testing Strategy](#testing-strategy)
6. [Deployment](#deployment)
7. [Secrets Management](#secrets-management)
8. [Troubleshooting](#troubleshooting)

## Pipeline Architecture

The CI/CD system is composed of:

- **Main CI Workflow** (`.github/workflows/CI.yml`) - Orchestrates all checks
- **Reusable Workflows** - Modular, composable workflow components
- **Configuration** (`.github/ci-config.yml`) - Centralized pipeline settings
- **Deployment Workflows** - Cloud-specific deployment automation

### Key Features

- ✅ Parallel execution for maximum speed
- ✅ Concurrency control to prevent conflicts
- ✅ Matrix testing across Node.js versions
- ✅ Comprehensive security scanning
- ✅ Performance budgets enforcement
- ✅ Automated PR comments with results
- ✅ Artifact retention management
- ✅ Scheduled security scans

## Workflows

### 1. Main CI Workflow

**File:** `.github/workflows/CI.yml`

**Triggers:**
- Push to `main` branch
- Pull requests to `main`
- Daily at 2 AM UTC (security scans)

**Jobs:**

#### Build Job
- Runs on Node.js 22.x and 24.x
- Caches dependencies and build output
- Timeout: 10 minutes

#### Static Analysis
- Linting (ESLint)
- Type checking (TypeScript)
- Dependency validation
- i18n validation
- Commit message validation (PRs only)

#### Unit Tests
- Runs with coverage
- Uses Playwright for browser testing
- Uploads coverage to Codecov

#### Storybook Tests
- Component testing
- Visual regression with Chromatic

#### E2E Tests
- Full application testing
- Multi-browser support
- Visual regression testing

#### CodeQL Security Analysis
- JavaScript/TypeScript code scanning
- Security and quality queries
- SARIF report upload

#### Dependency Security Scan
- Snyk vulnerability scanning
- High severity threshold
- Automated SARIF upload

#### Secret Scanning
- TruffleHog integration
- Verified secrets only
- Full git history scan

#### Docker Security
- Multi-stage build validation
- Trivy container scanning
- Security report upload

#### Integration Tests
- Real PostgreSQL database
- Real Redis cache
- Database migrations
- API testing

#### Lighthouse Performance
- Performance scoring
- Accessibility checks
- SEO validation
- Best practices audit

#### Bundle Analysis
- Next.js bundle size tracking
- Comparison with base branch
- PR-only execution

#### PR Summary
- Automated result comments
- Comprehensive status report
- Quick overview of all checks

### 2. Reusable Security Scan Workflow

**File:** `.github/workflows/reusable-security-scan.yml`

**Purpose:** Modular security scanning for reuse across pipelines

**Scan Types:**
- `codeql` - Static code analysis
- `dependencies` - Vulnerability scanning
- `secrets` - Secret detection
- `container` - Docker image scanning

**Usage Example:**
```yaml
jobs:
  security:
    uses: ./.github/workflows/reusable-security-scan.yml
    with:
      scan-type: codeql
      severity-threshold: high
    secrets:
      SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 3. Reusable Test Workflow

**File:** `.github/workflows/reusable-test.yml`

**Purpose:** Unified testing across all test types

**Test Types:**
- `unit` - Unit tests with coverage
- `integration` - Integration tests with real services
- `e2e` - End-to-end tests
- `performance` - Lighthouse performance tests

**Usage Example:**
```yaml
jobs:
  test:
    uses: ./.github/workflows/reusable-test.yml
    with:
      test-type: integration
      node-version: 22.x
      upload-coverage: true
```

### 4. Reusable Deployment Workflow

**File:** `.github/workflows/reusable-deploy.yml`

**Purpose:** Cloud-agnostic deployment orchestration

**Cloud Providers:**
- AWS (ECS/ECR)
- Azure (App Service)
- GCP (Cloud Run)
- Cloudflare (Pages)

**Phases:**
1. Pre-deployment (validation, backup)
2. Deployment (cloud-specific)
3. Post-deployment (migrations, smoke tests)

**Usage Example:**
```yaml
jobs:
  deploy:
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: production
      cloud-provider: aws
      run-migrations: true
      create-backup: true
    secrets:
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### 5. Cloud-Specific Deployment Workflows

#### AWS Deployment
**File:** `.github/workflows/deploy-aws.yml`

- ECR image building
- ECS task updates
- RDS backup automation
- CloudFront invalidation

#### Azure Deployment
**File:** `.github/workflows/deploy-azure.yml`

- Container Registry push
- App Service deployment
- PostgreSQL backups
- Blob storage integration

#### GCP Deployment
**File:** `.github/workflows/deploy-gcp.yml`

- GCR image push
- Cloud Run deployment
- Cloud SQL backups
- Cloud Storage export

#### Cloudflare Deployment
**File:** `.github/workflows/deploy-cloudflare.yml`

- Pages deployment
- Workers deployment
- D1 database backups
- R2 storage integration

## Configuration

### Pipeline Configuration File

**File:** `.github/ci-config.yml`

This YAML file contains all configurable pipeline settings:

```yaml
security:
  codeql:
    enabled: true
    languages: [javascript, typescript]

testing:
  unit:
    coverage_threshold: 80

  performance:
    lighthouse_thresholds:
      performance: 90
      accessibility: 95

deployment:
  production:
    auto_deploy: false
    require_approval: true
```

### Customization

To customize the pipeline:

1. Edit `.github/ci-config.yml` with your preferences
2. Update thresholds and budgets
3. Enable/disable specific checks
4. Configure notification settings

## Security Scanning

### CodeQL Analysis

**What it does:** Scans code for security vulnerabilities and code quality issues

**Configuration:**
- Languages: JavaScript, TypeScript
- Queries: Security + Quality
- Runs on: All pushes and PRs

**View Results:**
- GitHub Security tab
- Pull request checks

### Dependency Scanning (Snyk)

**What it does:** Scans npm dependencies for known vulnerabilities

**Configuration:**
- Severity threshold: HIGH
- Scans all packages
- Continues on error (non-blocking)

**Setup Required:**
1. Sign up at [snyk.io](https://snyk.io)
2. Generate API token
3. Add to repository secrets as `SNYK_TOKEN`

### Secret Scanning (TruffleHog)

**What it does:** Scans git history for accidentally committed secrets

**Configuration:**
- Verified secrets only
- Full history scan
- Blocks on findings

### Container Scanning (Trivy)

**What it does:** Scans Docker images for OS and library vulnerabilities

**Configuration:**
- Severity: CRITICAL, HIGH, MEDIUM
- SARIF report generation
- Runs on every build

## Testing Strategy

### Unit Tests

**Command:** `npm run test`

**Coverage:**
- Minimum threshold: 80%
- Excludes: tests, stories, e2e
- Uploads to Codecov

**Runner:** Vitest with Playwright browser mode

### Integration Tests

**Command:** `npm run test:integration`

**Services Required:**
- PostgreSQL 16
- Redis 7

**What it tests:**
- Database operations
- Cache functionality
- API endpoints
- Authentication flows

**Configuration:** `vitest.integration.config.ts`

### E2E Tests

**Command:** `npm run test:e2e`

**Browsers:**
- Chromium
- Firefox
- WebKit

**Features:**
- Visual regression (Chromatic)
- Multi-browser support
- Screenshot comparison

**Runner:** Playwright

### Performance Tests

**Tool:** Lighthouse CI

**Metrics:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

**Pages Tested:**
- Homepage
- Localized pages (/en)

## Deployment

### Automatic Deployment

**Staging:**
- Triggers: Push to `main`
- Auto-deploy: Yes
- Approval: Not required

**Production:**
- Triggers: Push to `production` branch OR manual dispatch
- Auto-deploy: No
- Approval: Required

### Manual Deployment

```bash
# Using GitHub CLI
gh workflow run deploy-aws.yml -f environment=production

# Or via GitHub UI
Actions → Deploy to AWS → Run workflow → Select environment
```

### Environment Variables

Each deployment requires environment-specific secrets:

**Common Secrets:**
- `DATABASE_URL` - Database connection string
- `NEXT_PUBLIC_APP_URL` - Application URL

**Cloud-Specific Secrets:** See [Secrets Management](#secrets-management)

### Database Migrations

Migrations run automatically after deployment:

**AWS:** ECS run-task
**Azure:** SSH command
**GCP:** Cloud Run Jobs
**Cloudflare:** Wrangler CLI

**Manual Migration:**
```bash
npm run db:migrate
```

### Database Backups

Backups are created:
- Before each deployment
- After successful deployment
- Daily via scheduled workflows

**Retention:** 30 days (configurable)

## Secrets Management

### Required Secrets

Add these to GitHub repository settings (Settings → Secrets and variables → Actions):

#### General
```
CODECOV_TOKEN          # Codecov integration
SNYK_TOKEN             # Snyk security scanning
CLERK_SECRET_KEY       # Clerk authentication
CHROMATIC_PROJECT_TOKEN # Chromatic visual testing
CROWDIN_PROJECT_ID     # Crowdin i18n
CROWDIN_PERSONAL_TOKEN # Crowdin API access
```

#### AWS
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_ACCOUNT_ID
AWS_REGION
ECR_REPOSITORY
ECS_CLUSTER
ECS_SERVICE
RDS_INSTANCE_ID
CLOUDFRONT_DISTRIBUTION_ID
```

#### Azure
```
AZURE_CREDENTIALS      # Service principal JSON
AZURE_RESOURCE_GROUP
AZURE_APP_NAME
AZURE_POSTGRES_SERVER
AZURE_STORAGE_ACCOUNT
```

#### GCP
```
GCP_PROJECT_ID
GCP_SA_KEY             # Service account JSON
GCP_REGION
GCP_SQL_INSTANCE
GCP_BACKUP_BUCKET
```

#### Cloudflare
```
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_R2_BUCKET
```

### Environment Configuration

Use GitHub Environments for environment-specific settings:

1. Go to Settings → Environments
2. Create `staging` and `production` environments
3. Add protection rules for production
4. Configure environment-specific secrets

## Troubleshooting

### Common Issues

#### 1. Build Failures

**Symptom:** Build job fails with timeout

**Solution:**
```yaml
# Increase timeout in CI.yml
timeout-minutes: 15 # Default is 10
```

#### 2. Test Failures in CI but not locally

**Symptom:** Tests pass locally but fail in CI

**Possible causes:**
- Environment variables missing
- Service dependencies not available
- Race conditions

**Solution:**
```bash
# Run tests with CI environment variables
CI=true npm run test
```

#### 3. Deployment Failures

**Symptom:** Deployment succeeds but app doesn't work

**Check:**
- Environment variables in cloud provider
- Database migrations ran successfully
- Health check endpoint returns 200

**Debug:**
```bash
# Check deployment logs
gh run view --log-failed

# Check cloud provider logs
# AWS
aws logs tail /ecs/nextjs-boilerplate --follow

# GCP
gcloud logging read "resource.type=cloud_run_revision"
```

#### 4. Security Scan False Positives

**Symptom:** Security scan blocks PR with false positive

**Solution:**
```yaml
# In CI.yml, make scan non-blocking
continue-on-error: true
```

Then review manually and create exception if needed.

#### 5. Lighthouse Failures

**Symptom:** Lighthouse scores below threshold

**Common issues:**
- Large bundle size
- Unoptimized images
- Missing meta tags

**Solution:**
```bash
# Run Lighthouse locally
npm run build
npm run start
npx lighthouse http://localhost:3000 --view
```

### Getting Help

- **CI/CD Issues:** Check [GitHub Actions logs](https://github.com/ixartz/Next-js-Boilerplate/actions)
- **Security Issues:** Review [Security tab](https://github.com/ixartz/Next-js-Boilerplate/security)
- **Deployment Issues:** Check cloud provider console logs

## Best Practices

### 1. Keep Workflows Fast
- Use caching aggressively
- Run jobs in parallel when possible
- Set appropriate timeouts

### 2. Security First
- Never commit secrets
- Use GitHub Secrets for sensitive data
- Enable secret scanning
- Review security scan results

### 3. Test Thoroughly
- Write tests for new features
- Maintain high coverage
- Test across browsers
- Monitor performance

### 4. Monitor Deployments
- Set up health checks
- Configure alerting
- Monitor error rates
- Track performance metrics

### 5. Document Changes
- Update this doc when modifying workflows
- Use conventional commit messages
- Add comments to complex workflow steps

## Performance Optimization

### Cache Strategy

The pipeline uses multiple cache layers:

1. **npm dependencies** - actions/setup-node cache
2. **Next.js build** - .next/cache directory
3. **Docker layers** - GitHub Actions cache
4. **Test artifacts** - Between jobs

### Parallel Execution

Jobs run in parallel when possible:

```
Build (22.x, 24.x) ────┐
                       ├──→ Integration Tests
Static Analysis ───────┤
                       ├──→ E2E Tests
Security Scans ────────┤
                       └──→ Performance Tests
```

### Conditional Execution

Some jobs run only when needed:

- Bundle analysis: PR only
- Lighthouse: When frontend changes
- Deployment: main/production branches only

## Metrics and Reporting

### Coverage Reports

- **Location:** Codecov dashboard
- **Threshold:** 80% minimum
- **Trend:** Track over time

### Security Reports

- **Location:** GitHub Security tab
- **Alerts:** Dependabot, CodeQL
- **Review:** Weekly

### Performance Reports

- **Location:** Lighthouse CI
- **Metrics:** Core Web Vitals
- **Budget:** Enforced on each PR

### Bundle Size

- **Tool:** @next/bundle-analyzer
- **Comparison:** Base branch vs PR
- **Alert:** >10% increase

## Continuous Improvement

### Regular Reviews

- Monthly: Review pipeline performance
- Quarterly: Update dependencies
- Yearly: Audit security configuration

### Metrics to Track

- Build time trends
- Test execution time
- Deployment frequency
- Failure rates
- MTTR (Mean Time To Recovery)

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [OWASP Security Guidelines](https://owasp.org/)
