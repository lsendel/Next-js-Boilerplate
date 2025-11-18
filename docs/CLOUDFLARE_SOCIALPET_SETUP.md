# Cloudflare Deployment Setup for SocialPet.io

**Complete guide to deploying SocialPet to Cloudflare Pages with custom domains**

This guide will walk you through setting up all four environments:
- **Development**: `dev.socialpet.io`
- **Test**: `tst.socialpet.io` (for integration tests)
- **Staging**: `stg.socialpet.io`
- **Production**: `socialpet.io` and `www.socialpet.io`

---

## Prerequisites

- [x] Cloudflare account (free tier works)
- [x] Domain `socialpet.io` added to Cloudflare
- [x] Wrangler CLI installed
- [x] GitHub repository with CI/CD workflows
- [x] Node.js 20+ and pnpm installed

---

## Table of Contents

1. [Initial Cloudflare Setup](#initial-cloudflare-setup)
2. [Create D1 Databases](#create-d1-databases)
3. [Create Cloudflare Pages Project](#create-cloudflare-pages-project)
4. [Configure Custom Domains](#configure-custom-domains)
5. [Setup GitHub Secrets](#setup-github-secrets)
6. [Deploy to Each Environment](#deploy-to-each-environment)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)

---

## Initial Cloudflare Setup

### 1. Login to Wrangler

```bash
# From project root
cd apps/web

# Login to Cloudflare
npx wrangler login

# Verify login
npx wrangler whoami
```

### 2. Get Your Account ID

```bash
# Display account information
npx wrangler whoami

# Or get it from Cloudflare Dashboard:
# https://dash.cloudflare.com → Click on your domain → Overview (right sidebar)
```

**Save your Account ID** - you'll need it for:
- GitHub Secrets
- Wrangler configuration
- CI/CD workflows

---

## Create D1 Databases

You need to create **4 separate D1 databases** (one per environment):

### 1. Development Database

```bash
npx wrangler d1 create socialpet-db-dev
```

**Output:**
```
✅ Successfully created DB 'socialpet-db-dev'

[[d1_databases]]
binding = "DB"
database_name = "socialpet-db-dev"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Copy the `database_id`** and update `apps/web/wrangler.jsonc`:

```jsonc
"env": {
  "dev": {
    "d1_databases": [
      {
        "binding": "DB",
        "database_name": "socialpet-db-dev",
        "database_id": "PASTE_DEV_DATABASE_ID_HERE",  // ← Paste here
        "migrations_dir": "./migrations-d1"
      }
    ]
  }
}
```

### 2. Test Database

```bash
npx wrangler d1 create socialpet-db-test
```

Update `apps/web/wrangler.jsonc`:
```jsonc
"test": {
  "d1_databases": [
    {
      "database_id": "PASTE_TEST_DATABASE_ID_HERE"
    }
  ]
}
```

### 3. Staging Database

```bash
npx wrangler d1 create socialpet-db-staging
```

Update `apps/web/wrangler.jsonc`:
```jsonc
"staging": {
  "d1_databases": [
    {
      "database_id": "PASTE_STAGING_DATABASE_ID_HERE"
    }
  ]
}
```

### 4. Production Database

```bash
npx wrangler d1 create socialpet-db-production
```

Update `apps/web/wrangler.jsonc`:
```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "socialpet-db-production",
    "database_id": "PASTE_PRODUCTION_DATABASE_ID_HERE",
    "migrations_dir": "./migrations-d1"
  }
]
```

### 5. Apply Initial Migrations

After updating all database IDs, apply migrations to each database:

```bash
# Development
pnpm --filter web d1:migrate

# Test (using wrangler directly)
npx wrangler d1 migrations apply socialpet-db-test --remote --env test

# Staging
pnpm --filter web d1:migrate:stage

# Production (only when ready)
pnpm --filter web d1:migrate:prod
```

---

## Create Cloudflare Pages Project

### 1. Create Pages Project

```bash
# Login to Cloudflare Dashboard
# Go to: Workers & Pages → Create application → Pages → Connect to Git

# OR create via Wrangler:
npx wrangler pages project create socialpet
```

**Project Settings:**
- **Production branch**: `main`
- **Build command**: `pnpm build`
- **Build output directory**: `.next`
- **Root directory**: `apps/web`

### 2. Configure Build Settings

In Cloudflare Dashboard:
- Go to **Workers & Pages** → **socialpet** → **Settings** → **Builds & deployments**

**Build configuration:**
```
Framework preset: Next.js
Build command: pnpm build
Build output directory: .next
Root directory (advanced): apps/web
Node.js version: 20
```

**Environment variables (all environments):**
```
NODE_ENV=production
NEXT_PUBLIC_AUTH_PROVIDER=cloudflare
```

---

## Configure Custom Domains

You need to configure **4 custom domains** for the Pages project.

### 1. Access Custom Domains Settings

```
Cloudflare Dashboard → Workers & Pages → socialpet → Custom domains
```

### 2. Add Development Domain

Click **Set up a custom domain**:
- Domain: `dev.socialpet.io`
- Click **Continue**
- Cloudflare automatically creates DNS records
- Wait for SSL certificate (usually < 5 minutes)

### 3. Add Test Domain

Repeat for test environment:
- Domain: `tst.socialpet.io`
- Click **Continue**

### 4. Add Staging Domain

Repeat for staging:
- Domain: `stg.socialpet.io`
- Click **Continue**

### 5. Add Production Domains

Add both production domains:
1. Primary: `socialpet.io`
2. WWW: `www.socialpet.io`

**Important**: Configure redirect from `www.socialpet.io` to `socialpet.io`:

```
Cloudflare Dashboard → DNS → Rules → Page Rules → Create Page Rule
URL: www.socialpet.io/*
Setting: Forwarding URL (301 - Permanent Redirect)
Destination: https://socialpet.io/$1
```

### 6. Verify DNS Records

Go to **DNS** → **Records** and verify these records exist:

```
Type    Name               Target
CNAME   dev.socialpet.io   socialpet.pages.dev
CNAME   tst.socialpet.io   socialpet.pages.dev
CNAME   stg.socialpet.io   socialpet.pages.dev
CNAME   socialpet.io       socialpet.pages.dev
CNAME   www.socialpet.io   socialpet.pages.dev
```

**Note**: Cloudflare automatically creates these when you add custom domains to Pages.

---

## Setup GitHub Secrets

### 1. Create API Token

Go to Cloudflare Dashboard:
```
My Profile → API Tokens → Create Token → Edit Cloudflare Workers
```

**Token Settings:**
- **Permissions**:
  - Account → Cloudflare Pages → Edit
  - Account → D1 → Edit
  - Zone → DNS → Edit (for custom domains)
- **Account Resources**: Include → Your account
- **Zone Resources**: Include → socialpet.io

**Create token and save it** - you won't see it again!

### 2. Add GitHub Secrets

Go to your GitHub repository:
```
Settings → Secrets and variables → Actions → New repository secret
```

**Add these secrets:**

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `CLOUDFLARE_API_TOKEN` | Your API token | From step above |
| `CLOUDFLARE_ACCOUNT_ID` | Your account ID | From `wrangler whoami` |

**Optional secrets (for monitoring):**

| Secret Name | Example Value |
|-------------|---------------|
| `SENTRY_DSN` | `https://...@sentry.io/...` |
| `SENTRY_AUTH_TOKEN` | Your Sentry auth token |
| `NEXT_PUBLIC_POSTHOG_KEY` | `phc_...` |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://app.posthog.com` |
| `CODECOV_TOKEN` | Your Codecov token |

### 3. Setup GitHub Environments

Create GitHub environments with protection rules:

```
Settings → Environments → New environment
```

**Create these environments:**

#### Development (`dev`)
- **Protection rules**: None
- **Deployment branches**: Only `dev`

#### Test (`test`)
- **Protection rules**: None
- **Deployment branches**: All branches (for PR testing)

#### Staging (`staging`)
- **Protection rules**: None (or optional reviewers)
- **Deployment branches**: Only `staging`

#### Production (`production`)
- **Protection rules**:
  - [x] Required reviewers (1-2 people)
  - [x] Wait timer: 5 minutes
- **Deployment branches**: Only `main`

---

## Deploy to Each Environment

### 1. Deploy Development

```bash
# Create dev branch if it doesn't exist
git checkout -b dev

# Push to trigger deployment
git push origin dev

# Or deploy manually
gh workflow run environment-promotion.yml -f environment=dev
```

**Verify**:
```bash
# Check deployment status
gh run list --workflow=environment-promotion.yml --limit 1

# Test endpoint
curl https://dev.socialpet.io/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "version": "1.0.0-dev.1+abc1234",
  "environment": "development",
  "uptime": 60
}
```

### 2. Deploy Test Environment

The test environment is used for running integration tests:

```bash
# Deploy test environment
gh workflow run environment-promotion.yml -f environment=test

# Or build and deploy locally
pnpm --filter web build
npx wrangler pages deploy .open-next --project-name=socialpet --branch=test
```

**Configure for E2E Tests:**

Update `apps/web/playwright.config.ts` if needed:
```typescript
use: {
  baseURL: process.env.E2E_BASE_URL || 'https://tst.socialpet.io',
}
```

**Run E2E tests against test environment:**
```bash
E2E_BASE_URL=https://tst.socialpet.io pnpm --filter web test:e2e
```

### 3. Deploy Staging

```bash
# Create staging branch if it doesn't exist
git checkout -b staging

# Merge dev into staging
git merge dev

# Push to trigger deployment
git push origin staging

# Or deploy manually
gh workflow run environment-promotion.yml -f environment=staging
```

**Verify**:
```bash
curl https://stg.socialpet.io/api/health
curl https://stg.socialpet.io/api/version
```

### 4. Deploy Production

**⚠️ Important**: Production deployments require manual approval.

```bash
# From main branch
git checkout main

# Merge staging into main
git merge staging

# Push (triggers workflow, requires approval)
git push origin main

# Approve deployment in GitHub UI:
# Actions → Environment Promotion Pipeline → Review deployments
```

**Verify**:
```bash
# Check both domains
curl https://socialpet.io/api/health
curl https://www.socialpet.io/api/health

# Verify version
curl https://socialpet.io/api/version
```

---

## Verification

### 1. Health Check All Environments

Create a simple script to check all environments:

```bash
#!/bin/bash
# File: scripts/check-all-environments.sh

ENVIRONMENTS=(
  "dev:https://dev.socialpet.io"
  "test:https://tst.socialpet.io"
  "staging:https://stg.socialpet.io"
  "production:https://socialpet.io"
)

for env in "${ENVIRONMENTS[@]}"; do
  NAME="${env%%:*}"
  URL="${env##*:}"

  echo "Checking $NAME ($URL)..."

  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL/api/health")

  if [ "$STATUS" == "200" ]; then
    VERSION=$(curl -s "$URL/api/version" | jq -r '.version')
    echo "✅ $NAME is healthy (version: $VERSION)"
  else
    echo "❌ $NAME returned status $STATUS"
  fi

  echo ""
done
```

**Run**:
```bash
chmod +x scripts/check-all-environments.sh
./scripts/check-all-environments.sh
```

### 2. Test Database Connectivity

```bash
# Test D1 database for each environment
npx wrangler d1 execute socialpet-db-dev --remote --command "SELECT 1"
npx wrangler d1 execute socialpet-db-test --remote --command "SELECT 1"
npx wrangler d1 execute socialpet-db-staging --remote --command "SELECT 1"
npx wrangler d1 execute socialpet-db-production --remote --command "SELECT 1"
```

### 3. Test Custom Domains

```bash
# Check SSL certificates
for domain in dev.socialpet.io tst.socialpet.io stg.socialpet.io socialpet.io www.socialpet.io; do
  echo "Testing $domain..."
  curl -I "https://$domain" | grep -i "HTTP\|location"
  echo ""
done
```

### 4. Monitor Deployments

```bash
# View recent deployments
npx wrangler pages deployment list

# View logs for specific deployment
npx wrangler pages deployment tail

# Or view in dashboard:
# https://dash.cloudflare.com → Workers & Pages → socialpet → View details
```

---

## Package.json Scripts

Add these convenience scripts to `apps/web/package.json`:

```json
{
  "scripts": {
    "deploy:dev": "wrangler pages deploy .open-next --project-name=socialpet --branch=dev",
    "deploy:test": "wrangler pages deploy .open-next --project-name=socialpet --branch=test",
    "deploy:staging": "wrangler pages deploy .open-next --project-name=socialpet --branch=staging",
    "deploy:prod": "wrangler pages deploy .open-next --project-name=socialpet --branch=main",

    "db:migrate:dev": "wrangler d1 migrations apply socialpet-db-dev --remote --env dev",
    "db:migrate:test": "wrangler d1 migrations apply socialpet-db-test --remote --env test",
    "db:migrate:staging": "wrangler d1 migrations apply socialpet-db-staging --remote --env staging",
    "db:migrate:prod": "wrangler d1 migrations apply socialpet-db-production --remote",

    "logs:dev": "wrangler pages deployment tail --project-name=socialpet --environment=dev",
    "logs:staging": "wrangler pages deployment tail --project-name=socialpet --environment=staging",
    "logs:prod": "wrangler pages deployment tail --project-name=socialpet --environment=production"
  }
}
```

**Usage:**
```bash
# Deploy to dev
pnpm deploy:dev

# View production logs
pnpm logs:prod

# Migrate test database
pnpm db:migrate:test
```

---

## Troubleshooting

### Issue: "Database not found"

**Symptoms**: Deployment succeeds but app shows database errors

**Solution**:
1. Verify database ID in `wrangler.jsonc` matches the one created
2. Run migrations for that environment
3. Check database binding name is "DB"

```bash
# List all databases
npx wrangler d1 list

# Get database info
npx wrangler d1 info socialpet-db-dev
```

### Issue: "Custom domain not working"

**Symptoms**: Domain shows "Site not found" or doesn't resolve

**Solution**:
1. Check DNS records are created in Cloudflare DNS
2. Wait for SSL certificate (can take up to 24 hours)
3. Verify domain is added to Pages project

```bash
# Check DNS
dig dev.socialpet.io
dig CNAME dev.socialpet.io

# Force SSL certificate generation
# Go to: SSL/TLS → Edge Certificates → Always Use HTTPS
```

### Issue: "Deployment fails in CI/CD"

**Symptoms**: GitHub Actions workflow fails on deployment step

**Solution**:
1. Verify secrets are set correctly in GitHub
2. Check API token has correct permissions
3. Ensure project name matches in workflow files

```bash
# Test deployment locally
npx wrangler pages deploy .open-next \
  --project-name=socialpet \
  --branch=dev

# Check if token works
export CLOUDFLARE_API_TOKEN=your_token
npx wrangler whoami
```

### Issue: "Migration fails"

**Symptoms**: "Migration already applied" or migration errors

**Solution**:
```bash
# Check migration status
npx wrangler d1 migrations list socialpet-db-dev --remote

# Force apply specific migration
npx wrangler d1 execute socialpet-db-dev --remote \
  --file=./migrations-d1/0001_migration.sql
```

### Issue: "Environment variables not working"

**Symptoms**: App can't read environment variables

**Solution**:
1. Environment variables in Cloudflare Pages are build-time only
2. Runtime variables must be in `wrangler.jsonc` under `vars`
3. Secrets must use `wrangler secret put`

```bash
# Set runtime secret (for Workers, not Pages)
npx wrangler secret put MY_SECRET

# For Pages, use dashboard:
# Workers & Pages → socialpet → Settings → Environment variables
```

---

## Environment URLs Reference

| Environment | URL | Purpose | Branch |
|-------------|-----|---------|--------|
| Development | https://dev.socialpet.io | Feature development | `dev` |
| Test | https://tst.socialpet.io | Integration & E2E tests | Any/Test branch |
| Staging | https://stg.socialpet.io | Pre-production QA | `staging` |
| Production | https://socialpet.io | Live application | `main` |
| Production (WWW) | https://www.socialpet.io | Redirects to socialpet.io | `main` |

---

## Next Steps

After completing this setup:

1. **Configure Monitoring**:
   - Setup Sentry for error tracking
   - Configure PostHog for analytics
   - Enable Cloudflare Web Analytics

2. **Setup CI/CD**:
   - Test deployment workflows
   - Configure environment protection rules
   - Setup automated testing

3. **Security**:
   - Enable Cloudflare WAF
   - Configure rate limiting with Arcjet
   - Setup DDoS protection

4. **Performance**:
   - Enable Cloudflare caching
   - Configure Cache Rules
   - Setup image optimization

5. **Backup Strategy**:
   - Schedule automated D1 backups
   - Test restore procedures
   - Document recovery process

---

## Quick Reference

```bash
# Login to Cloudflare
npx wrangler login

# Create database
npx wrangler d1 create socialpet-db-{env}

# Apply migrations
pnpm db:migrate:{env}

# Deploy to environment
gh workflow run environment-promotion.yml -f environment={env}

# Check deployment
curl https://{env}.socialpet.io/api/health

# View logs
npx wrangler pages deployment tail

# Rollback
gh workflow run rollback.yml -f environment={env}
```

---

## Support

- **Cloudflare Docs**: https://developers.cloudflare.com/pages/
- **Wrangler Docs**: https://developers.cloudflare.com/workers/wrangler/
- **D1 Docs**: https://developers.cloudflare.com/d1/
- **Issues**: Create an issue in the repository

---

**Status**: ✅ Ready for deployment

Your SocialPet application is now configured for deployment to Cloudflare with:
- 4 environments (dev, test, staging, production)
- Custom domains on socialpet.io
- Automated CI/CD pipelines
- Database migrations
- Monitoring and logging

Happy deploying! 🚀
