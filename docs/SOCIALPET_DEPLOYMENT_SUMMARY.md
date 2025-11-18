# SocialPet Cloudflare Deployment - Configuration Summary

**Date**: January 17, 2025
**Status**: ✅ Ready for Deployment
**Domain**: socialpet.io

---

## What Was Configured

This document summarizes all the configuration changes made to deploy the Next.js boilerplate to Cloudflare for the SocialPet project.

---

## 🌍 Environments Configured

Your project now has **4 complete environments**, all configured and ready to deploy:

| Environment | Domain | Purpose | Git Branch | Auto Deploy |
|-------------|--------|---------|------------|-------------|
| **Development** | https://dev.socialpet.io | Feature development & testing | `dev` | ✅ Yes |
| **Test** | https://tst.socialpet.io | Integration & E2E testing | Any/Test | ⚡ Manual |
| **Staging** | https://stg.socialpet.io | Pre-production QA | `staging` | ✅ Yes |
| **Production** | https://socialpet.io<br>https://www.socialpet.io | Live application | `main` | ⚠️ Requires approval |

---

## 📝 Files Modified

### 1. Wrangler Configuration

**File**: `apps/web/wrangler.jsonc`

**Changes**:
- Updated project name from `next-boilerplate` to `socialpet`
- Configured all 4 environments (dev, test, staging, production)
- Set up D1 database bindings for each environment
- Configured custom domains:
  - Production: `socialpet.io` + `www.socialpet.io`
  - Staging: `stg.socialpet.io`
  - Development: `dev.socialpet.io`
  - Test: `tst.socialpet.io`
- Added environment-specific variables

**Database Configuration**:
```jsonc
Production:  socialpet-db-production
Staging:     socialpet-db-staging
Development: socialpet-db-dev
Test:        socialpet-db-test
```

### 2. Environment Promotion Workflow

**File**: `.github/workflows/environment-promotion.yml`

**Changes**:
- Updated project name to `socialpet`
- Updated health check URLs to use socialpet.io domains
- Updated smoke test URLs
- Updated deployment verification logic

**URL Mapping**:
```yaml
Production:  https://socialpet.io
Staging:     https://stg.socialpet.io
Development: https://dev.socialpet.io
```

### 3. Rollback Workflow

**File**: `.github/workflows/rollback.yml`

**Changes**:
- Updated project name to `socialpet`
- Updated health check URLs
- Updated version verification URLs
- Updated deployment URLs

---

## 📁 New Files Created

### Documentation

1. **`docs/CLOUDFLARE_SOCIALPET_SETUP.md`** (Complete setup guide)
   - Step-by-step Cloudflare configuration
   - D1 database creation instructions
   - Custom domain setup
   - DNS configuration
   - GitHub secrets setup
   - Deployment procedures
   - Troubleshooting guide

2. **`docs/DEPLOYMENT_CHECKLIST_SOCIALPET.md`** (Interactive checklist)
   - 26 sections with ~150 individual checks
   - Pre-deployment requirements
   - Configuration steps
   - Deployment procedures
   - Post-deployment verification
   - Ongoing maintenance tasks

3. **`docs/SOCIALPET_DEPLOYMENT_SUMMARY.md`** (This file)
   - Configuration overview
   - Quick start guide
   - File changes summary

### Scripts

4. **`scripts/setup-d1-databases.sh`** (Automated D1 setup)
   - Automatically creates all 4 D1 databases
   - Updates wrangler.jsonc with database IDs
   - Creates backup before modification
   - Provides next steps guidance

---

## 🗄️ Database Architecture

### D1 Databases

Your project uses **4 separate D1 databases** (one per environment):

```
socialpet-db-production  → Production data (socialpet.io)
socialpet-db-staging     → Staging data (stg.socialpet.io)
socialpet-db-dev         → Development data (dev.socialpet.io)
socialpet-db-test        → Test data (tst.socialpet.io)
```

**Why separate databases?**
- ✅ Data isolation between environments
- ✅ Safe testing without affecting production
- ✅ Independent schema migrations
- ✅ Easier rollback and recovery

### Migration Strategy

Migrations flow through environments:
```
1. Create migration → 2. Test in dev → 3. Apply to staging → 4. Apply to production
```

**Commands** (after creating migration):
```bash
pnpm --filter web db:d1:generate          # Generate migration
pnpm --filter web d1:migrate              # Dev
npx wrangler d1 migrations apply socialpet-db-test --remote --env test  # Test
pnpm --filter web d1:migrate:stage        # Staging
pnpm --filter web d1:migrate:prod         # Production
```

---

## 🚀 Deployment Flow

### Automatic Deployments

```
git push origin dev      →  Deploys to dev.socialpet.io (automatic)
git push origin staging  →  Deploys to stg.socialpet.io (automatic)
git push origin main     →  Triggers production approval workflow
```

### Manual Deployments

```bash
# Deploy specific environment
gh workflow run environment-promotion.yml -f environment=dev
gh workflow run environment-promotion.yml -f environment=staging

# Deploy specific version to production
gh workflow run environment-promotion.yml \
  -f environment=production \
  -f version=1.2.3
```

### Quality Gates

**All deployments must pass**:
- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ i18n validation
- ✅ Security scanning (pnpm audit + TruffleHog)
- ✅ Unit tests (Vitest)
- ✅ Integration tests (PostgreSQL)
- ✅ E2E tests (Playwright - staging/production only)

### Deployment Process

1. **Prepare**: Calculate version, create deployment record
2. **Quality Gates**: Run all checks in parallel
3. **Security Scan**: Dependency audit + secret scanning
4. **Integration Tests**: Database integration tests
5. **Build**: Build Next.js application
6. **Deploy**: Deploy to Cloudflare + apply D1 migrations
7. **Verify**: Health checks + smoke tests
8. **Notify**: Update status + alert on failures

---

## 🔄 Rollback Capability

### Quick Rollback

```bash
# Rollback production to previous version
gh workflow run rollback.yml \
  -f environment=production \
  -f reason="Critical bug in payment processing"

# Rollback to specific version
gh workflow run rollback.yml \
  -f environment=production \
  -f target_version=1.2.2 \
  -f reason="Regression in checkout flow"
```

### Rollback Features

- ✅ Automatic pre-rollback database backup
- ✅ Post-rollback verification
- ✅ Complete audit trail (GitHub issue created)
- ✅ Version verification
- ✅ Health check validation

---

## 🔒 Security Configuration

### Secrets Required

**GitHub Repository Secrets**:
```
CLOUDFLARE_API_TOKEN      → From Cloudflare API Tokens
CLOUDFLARE_ACCOUNT_ID     → From `wrangler whoami`
```

**Optional (for monitoring)**:
```
SENTRY_DSN                → Error tracking
SENTRY_AUTH_TOKEN         → Source map upload
NEXT_PUBLIC_POSTHOG_KEY   → Analytics
NEXT_PUBLIC_POSTHOG_HOST  → Analytics host
CODECOV_TOKEN             → Code coverage
```

### Environment Protection

**Production Environment**:
- ✅ Required reviewers (1-2 people)
- ✅ Wait timer (5 minutes)
- ✅ Deployment branches (only `main`)

**Other Environments**:
- No protection (can be added if needed)

---

## 📊 Monitoring & Observability

### Health Endpoints

**Health Check**:
```bash
curl https://socialpet.io/api/health

Response:
{
  "status": "ok",
  "timestamp": "2025-01-17T12:00:00Z",
  "uptime": 3600,
  "version": "1.2.3",
  "environment": "production",
  "responseTime": "15ms"
}
```

**Version Check**:
```bash
curl https://socialpet.io/api/version

Response:
{
  "version": "1.2.3",
  "environment": "production",
  "buildTime": "2025-01-17T11:30:00Z",
  "gitCommit": "abc1234",
  "status": "ok"
}
```

### Monitoring Tools

**Configured** (when you add secrets):
- Sentry: Error tracking and performance monitoring
- PostHog: Product analytics and user behavior
- Better Stack: Centralized logging
- Cloudflare Analytics: Edge analytics

---

## 📋 Quick Start Guide

### First-Time Setup

1. **Run the automated setup script**:
   ```bash
   ./scripts/setup-d1-databases.sh
   ```
   This creates all 4 D1 databases and updates wrangler.jsonc

2. **Configure GitHub Secrets**:
   - Go to GitHub → Settings → Secrets and variables → Actions
   - Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`

3. **Setup GitHub Environments**:
   - Create environments: `dev`, `test`, `staging`, `production`
   - Configure protection rules (production requires approval)

4. **Configure Cloudflare Pages**:
   - Create project named `socialpet`
   - Add custom domains:
     - dev.socialpet.io
     - tst.socialpet.io
     - stg.socialpet.io
     - socialpet.io
     - www.socialpet.io

5. **Deploy**:
   ```bash
   git push origin dev       # Deploy to dev
   git push origin staging   # Deploy to staging
   git push origin main      # Trigger production approval
   ```

For detailed step-by-step instructions, see:
- **[Complete Setup Guide](./CLOUDFLARE_SOCIALPET_SETUP.md)**
- **[Interactive Checklist](./DEPLOYMENT_CHECKLIST_SOCIALPET.md)**

---

## 🎯 What's Different from Default Boilerplate?

### Domain Changes

| Before | After |
|--------|-------|
| `environment.1pet.com` | `socialpet.io` |
| `environment-stage.1pet.com` | `stg.socialpet.io` |
| `environment-dev.1pet.com` | `dev.socialpet.io` |
| (none) | `tst.socialpet.io` (new test env) |
| (none) | `www.socialpet.io` (www variant) |

### Project Name Changes

| Before | After |
|--------|-------|
| `next-boilerplate` | `socialpet` |
| `next-boilerplate-db` | `socialpet-db-{env}` |

### Environment Additions

- **New**: Test environment (`tst.socialpet.io`) for integration testing
- **New**: WWW domain variant with 301 redirect

---

## 📦 Deployment Commands Reference

### Development

```bash
# Deploy to dev
git push origin dev

# Or manually
gh workflow run environment-promotion.yml -f environment=dev

# Check status
curl https://dev.socialpet.io/api/health
```

### Test Environment

```bash
# Deploy for testing
gh workflow run environment-promotion.yml -f environment=test

# Run E2E tests
E2E_BASE_URL=https://tst.socialpet.io pnpm test:e2e
```

### Staging

```bash
# Deploy to staging
git push origin staging

# Verify
curl https://stg.socialpet.io/api/health
curl https://stg.socialpet.io/api/version
```

### Production

```bash
# Trigger production deployment (requires approval)
git push origin main

# Approve in GitHub UI
# Actions → Environment Promotion Pipeline → Review deployments

# Verify after approval
curl https://socialpet.io/api/health
curl https://www.socialpet.io/api/health  # Should redirect
```

### Rollback

```bash
# Rollback any environment
gh workflow run rollback.yml \
  -f environment=production \
  -f reason="Brief description of issue"

# Rollback to specific version
gh workflow run rollback.yml \
  -f environment=production \
  -f target_version=1.2.2 \
  -f reason="Rollback reason"
```

---

## 🔍 Verification Commands

### Check All Environments

```bash
# Quick health check script
for env in dev.socialpet.io tst.socialpet.io stg.socialpet.io socialpet.io; do
  echo "Checking $env..."
  curl -s "https://$env/api/health" | jq '.status, .version'
  echo ""
done
```

### Check Databases

```bash
# Verify all databases exist
npx wrangler d1 list | grep socialpet

# Test connectivity
npx wrangler d1 execute socialpet-db-dev --remote --command "SELECT 1"
npx wrangler d1 execute socialpet-db-test --remote --command "SELECT 1"
npx wrangler d1 execute socialpet-db-staging --remote --command "SELECT 1"
npx wrangler d1 execute socialpet-db-production --remote --command "SELECT 1"
```

### Check Custom Domains

```bash
# Check DNS
for domain in dev tst stg ''; do
  [ -z "$domain" ] && subdomain="socialpet.io" || subdomain="${domain}.socialpet.io"
  dig CNAME "$subdomain" +short
done

# Check SSL certificates
for domain in dev tst stg '' www; do
  [ -z "$domain" ] && subdomain="socialpet.io" || subdomain="${domain}.socialpet.io"
  echo "Testing $subdomain..."
  curl -I "https://$subdomain" 2>&1 | grep -i "HTTP\|location"
  echo ""
done
```

---

## 🚨 Important Notes

### Before First Deployment

1. ⚠️ **Update D1 database IDs** in `apps/web/wrangler.jsonc`:
   - Run `./scripts/setup-d1-databases.sh` to automate this
   - Or manually update each `YOUR_*_D1_DATABASE_ID` placeholder

2. ⚠️ **Configure GitHub Secrets**:
   - `CLOUDFLARE_API_TOKEN` (required)
   - `CLOUDFLARE_ACCOUNT_ID` (required)

3. ⚠️ **Create GitHub Environments**:
   - `dev`, `test`, `staging`, `production`
   - Configure protection rules

4. ⚠️ **Add custom domains in Cloudflare Pages**:
   - All 5 domains must be added to the Pages project
   - Wait for SSL certificates to be issued

### Domain Configuration

- **WWW redirect**: Configure page rule to redirect www → apex domain
- **SSL certificates**: May take up to 24 hours (usually < 5 minutes)
- **DNS propagation**: Can take up to 48 hours (usually instant with Cloudflare)

### Database Migrations

- Always test migrations in dev before staging/production
- Migrations are forward-only (no built-in rollback)
- Backup database before applying production migrations
- Consider backward-compatible migrations

---

## 📚 Documentation Index

| Document | Purpose |
|----------|---------|
| [CLOUDFLARE_SOCIALPET_SETUP.md](./CLOUDFLARE_SOCIALPET_SETUP.md) | Complete setup guide with detailed instructions |
| [DEPLOYMENT_CHECKLIST_SOCIALPET.md](./DEPLOYMENT_CHECKLIST_SOCIALPET.md) | Interactive checklist (print and check off) |
| [CI_CD_COMPLETE_GUIDE.md](./CI_CD_COMPLETE_GUIDE.md) | Complete CI/CD documentation |
| [CI_CD_QUICK_REFERENCE.md](./CI_CD_QUICK_REFERENCE.md) | Quick command reference |
| [CI_CD_WORKFLOW_DIAGRAM.md](./CI_CD_WORKFLOW_DIAGRAM.md) | Visual workflow diagrams |
| [CLOUDFLARE_MIGRATION_GUIDE.md](../CLOUDFLARE_MIGRATION_GUIDE.md) | Cloudflare migration guide (general) |
| [SOCIALPET_DEPLOYMENT_SUMMARY.md](./SOCIALPET_DEPLOYMENT_SUMMARY.md) | This file |

---

## ✅ Next Steps

1. **Read the setup guide**:
   - [CLOUDFLARE_SOCIALPET_SETUP.md](./CLOUDFLARE_SOCIALPET_SETUP.md)

2. **Run the setup script**:
   ```bash
   ./scripts/setup-d1-databases.sh
   ```

3. **Follow the checklist**:
   - [DEPLOYMENT_CHECKLIST_SOCIALPET.md](./DEPLOYMENT_CHECKLIST_SOCIALPET.md)

4. **Deploy to dev**:
   ```bash
   git push origin dev
   ```

5. **Verify and celebrate!** 🎉

---

## 🆘 Getting Help

**Documentation**:
- See the documentation index above
- All guides include troubleshooting sections

**Cloudflare Support**:
- Dashboard → Support → Contact Support
- Community: https://community.cloudflare.com/

**GitHub Issues**:
- Create an issue in the repository
- Include environment, error message, and steps to reproduce

---

**Status**: ✅ All configuration complete and ready for deployment!

Your Next.js application is now fully configured for deployment to Cloudflare with the socialpet.io domain across all four environments.

Happy deploying! 🚀
