# Getting Started: Complete Deployment Guide

**Complete guide to deploy SocialPet to Cloudflare from scratch**

This guide walks you through the entire deployment process, from initial setup to production deployment.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start (5-Minute Setup)](#quick-start)
4. [Step-by-Step Setup](#step-by-step-setup)
5. [First Deployment](#first-deployment)
6. [Verification](#verification)
7. [Daily Workflow](#daily-workflow)
8. [Troubleshooting](#troubleshooting)

---

## Overview

### What You'll Set Up

By the end of this guide, you'll have:

- ✅ **4 Complete Environments**:
  - Development: https://dev.socialpet.io
  - Test: https://tst.socialpet.io
  - Staging: https://stg.socialpet.io
  - Production: https://socialpet.io + https://www.socialpet.io

- ✅ **Automated CI/CD Pipeline**:
  - Environment promotion (dev → staging → production)
  - Semantic versioning
  - Quality gates (lint, tests, security)
  - Rollback capability

- ✅ **Infrastructure**:
  - 4 Cloudflare D1 databases
  - GitHub environments with protection rules
  - Git branch strategy (dev, staging, main)
  - Custom domains with SSL

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Repository                        │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │   dev    │ -> │ staging  │ -> │   main   │              │
│  └──────────┘    └──────────┘    └──────────┘              │
│       ↓               ↓               ↓                      │
│  Auto-deploy     Auto-deploy    Approval Required           │
└──────│──────────────│──────────────│──────────────────────┘
       │              │              │
       ↓              ↓              ↓
┌──────────────┬──────────────┬──────────────────┐
│     Dev      │   Staging    │   Production     │
│ Environment  │ Environment  │  Environment     │
├──────────────┼──────────────┼──────────────────┤
│ D1 Database  │ D1 Database  │  D1 Database     │
│ dev.*.io     │ stg.*.io     │  socialpet.io    │
└──────────────┴──────────────┴──────────────────┘
```

---

## Prerequisites

### Required Accounts

1. **GitHub Account** (free)
   - Repository admin access
   - https://github.com

2. **Cloudflare Account** (free tier works)
   - Domain added: socialpet.io
   - https://dash.cloudflare.com

### Required Tools

Install these before starting:

```bash
# 1. Node.js 20+ (check with: node --version)
# Download from: https://nodejs.org/

# 2. pnpm (package manager)
npm install -g pnpm

# 3. GitHub CLI
# macOS:
brew install gh

# Linux:
sudo apt install gh

# Windows:
winget install --id GitHub.cli

# 4. Wrangler (Cloudflare CLI)
npm install -g wrangler

# 5. Git (should already be installed)
git --version  # Should be 2.0+
```

### Verify Prerequisites

Run the verification script to check if you're ready:

```bash
./scripts/verify-setup.sh
```

This will check:
- ✓ All required tools installed
- ✓ Correct versions
- ✓ Authentication status
- ✓ Project files present

---

## Quick Start

### 🚀 5-Minute Automated Setup

If all prerequisites are met, run this single command:

```bash
./scripts/setup-complete-deployment.sh
```

This wizard will:
1. Create git branches (dev, staging, main)
2. Create GitHub environments with protection
3. Create 4 D1 databases on Cloudflare
4. Update wrangler.jsonc with database IDs
5. Configure GitHub secrets
6. Verify everything

**Then skip to [First Deployment](#first-deployment)**.

---

## Step-by-Step Setup

If you prefer manual control or the automated setup fails, follow these steps:

### Step 1: Authenticate

```bash
# Authenticate with GitHub
gh auth login
# Follow the prompts

# Authenticate with Cloudflare
wrangler login
# Opens browser for authentication
```

Verify authentication:
```bash
gh auth status
wrangler whoami
```

### Step 2: Install Dependencies

```bash
# Install project dependencies
pnpm install
```

### Step 3: Create Git Branches

```bash
./scripts/setup-git-branches.sh
```

This creates:
- `dev` - Development branch
- `staging` - Staging branch
- `main` - Production branch

### Step 4: Create GitHub Environments

```bash
./scripts/setup-github-environments.sh
```

This creates environments with:
- `dev` - Auto-deploy from dev branch
- `test` - Manual deployment
- `staging` - Auto-deploy from staging branch
- `production` - Approval required, deploys from main

### Step 5: Create D1 Databases

```bash
./scripts/setup-d1-databases.sh
```

This creates 4 databases and updates `apps/web/wrangler.jsonc` automatically.

### Step 6: Configure GitHub Secrets

Add required secrets to your GitHub repository:

```bash
# Add Cloudflare API token
gh secret set CLOUDFLARE_API_TOKEN

# Add Cloudflare Account ID
gh secret set CLOUDFLARE_ACCOUNT_ID
```

**Get these values**:
- **API Token**: https://dash.cloudflare.com/profile/api-tokens
  - Click "Create Token"
  - Use "Edit Cloudflare Workers" template
  - Copy the token

- **Account ID**: Run `wrangler whoami` or find in Cloudflare Dashboard → Overview

### Step 7: Configure Cloudflare Pages

1. Go to https://dash.cloudflare.com
2. Navigate to **Workers & Pages** → **Create application** → **Pages**
3. Connect your GitHub repository
4. Configure:
   - **Project name**: `socialpet`
   - **Framework preset**: Next.js
   - **Build command**: `pnpm build` (leave as is)
   - **Build output directory**: `.next` (leave as is)
   - **Root directory**: `apps/web`

5. Click **Save and Deploy** (this first deploy can fail - it's okay)

### Step 8: Add Custom Domains

In Cloudflare Pages → Your Project → Custom domains:

1. Add: `socialpet.io` (production)
2. Add: `www.socialpet.io` (production)
3. Add: `stg.socialpet.io` (staging)
4. Add: `dev.socialpet.io` (development)
5. Add: `tst.socialpet.io` (test)

Wait for SSL certificates to be issued (~5 minutes).

### Step 9: Apply Database Migrations

```bash
cd apps/web

# Development database
pnpm d1:migrate

# Test database
npx wrangler d1 migrations apply socialpet-db-test --remote --env test

# Staging database
pnpm d1:migrate:stage

# Production database
pnpm d1:migrate:prod
```

---

## First Deployment

### Deploy to Development

```bash
# Switch to dev branch
git checkout dev

# Make a small change (optional)
echo "# Deployed" >> README.md
git add README.md
git commit -m "chore: trigger first deployment"

# Push to trigger deployment
git push origin dev
```

### Monitor Deployment

```bash
# Watch the deployment in real-time
gh run watch

# Or view in GitHub UI
# Actions → Environment Promotion Pipeline
```

### Verify Deployment

```bash
# Check health endpoint
curl https://dev.socialpet.io/api/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-01-17T12:00:00Z",
  "uptime": 3600,
  "version": "1.0.0-dev.1+abc1234",
  "environment": "dev",
  "responseTime": "15ms"
}
```

### Deploy to Staging

```bash
# Switch to staging branch
git checkout staging

# Merge from dev
git merge dev

# Push to trigger deployment
git push origin staging

# Monitor
gh run watch

# Verify
curl https://stg.socialpet.io/api/health
```

### Deploy to Production

```bash
# Switch to main branch
git checkout main

# Merge from staging
git merge staging

# Push to trigger approval workflow
git push origin main

# This will require manual approval in GitHub UI
```

**Approve Production Deployment**:
1. Go to GitHub → Actions → Environment Promotion Pipeline
2. Click on the running workflow
3. Click "Review deployments"
4. Select "production"
5. Click "Approve and deploy"

After approval, the deployment proceeds automatically.

**Verify Production**:
```bash
curl https://socialpet.io/api/health
curl https://www.socialpet.io/api/health  # Should redirect
```

---

## Verification

### Check All Environments

Run this script to check all environments:

```bash
for env in dev.socialpet.io tst.socialpet.io stg.socialpet.io socialpet.io; do
  echo "Checking $env..."
  curl -s "https://$env/api/health" | jq '.status, .version'
  echo ""
done
```

### Check Databases

```bash
# List all databases
wrangler d1 list | grep socialpet

# Test connectivity
wrangler d1 execute socialpet-db-dev --remote --command "SELECT 1"
wrangler d1 execute socialpet-db-test --remote --command "SELECT 1"
wrangler d1 execute socialpet-db-staging --remote --command "SELECT 1"
wrangler d1 execute socialpet-db-production --remote --command "SELECT 1"
```

### Check GitHub Environments

```bash
# List environments
gh api /repos/:owner/:repo/environments --jq '.environments[].name'

# Should show:
# dev
# test
# staging
# production
```

### Check Git Branches

```bash
git branch -a

# Should show:
# * main
#   dev
#   staging
#   remotes/origin/dev
#   remotes/origin/main
#   remotes/origin/staging
```

---

## Daily Workflow

### Feature Development

```bash
# 1. Start from dev branch
git checkout dev
git pull origin dev

# 2. Create feature branch
git checkout -b feature/new-feature

# 3. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 4. Push feature branch
git push origin feature/new-feature

# 5. Create pull request to dev
gh pr create --base dev --title "Add new feature"

# 6. After PR approval, merge to dev
# Merging to dev automatically deploys to dev.socialpet.io
```

### Promoting to Staging

```bash
# 1. Switch to staging
git checkout staging
git pull origin staging

# 2. Merge from dev
git merge dev

# 3. Push to deploy
git push origin staging
# Automatically deploys to stg.socialpet.io

# 4. Run tests on staging
E2E_BASE_URL=https://stg.socialpet.io pnpm test:e2e
```

### Promoting to Production

```bash
# 1. Switch to main
git checkout main
git pull origin main

# 2. Merge from staging
git merge staging

# 3. Push to trigger approval workflow
git push origin main

# 4. Approve in GitHub UI (requires reviewer)

# 5. After deployment, verify
curl https://socialpet.io/api/health
```

### Rollback Production

If issues are found after production deployment:

```bash
# Rollback to previous version
gh workflow run rollback.yml \
  -f environment=production \
  -f reason="Critical bug in payment processing"

# Or rollback to specific version
gh workflow run rollback.yml \
  -f environment=production \
  -f target_version=1.2.2 \
  -f reason="Regression in checkout flow"
```

---

## Troubleshooting

### Common Issues

#### 1. "Wrangler not found"

**Solution**:
```bash
npm install -g wrangler
wrangler --version
```

#### 2. "GitHub CLI not authenticated"

**Solution**:
```bash
gh auth login
gh auth status
```

#### 3. "D1 database creation failed"

**Solution**:
```bash
# Verify Wrangler authentication
wrangler whoami

# Try creating manually
wrangler d1 create socialpet-db-dev

# Then run setup script again
./scripts/setup-d1-databases.sh
```

#### 4. "Custom domain not working"

**Possible causes**:
- SSL certificate still provisioning (wait 5-15 minutes)
- DNS not configured correctly
- Domain not added to Cloudflare Pages project

**Solution**:
```bash
# Check DNS
dig CNAME dev.socialpet.io +short

# Should point to your Cloudflare Pages URL
```

#### 5. "Deployment fails in CI"

**Check**:
```bash
# View logs
gh run list
gh run view <run-id>

# Common issues:
# - Missing GitHub secrets
# - Database ID not updated in wrangler.jsonc
# - Type errors or lint failures
```

#### 6. "GitHub environment creation failed"

**Solution**:
```bash
# Verify you have admin access
gh api /repos/:owner/:repo --jq '.permissions'

# Manually create in GitHub UI:
# Settings → Environments → New environment
```

### Getting Help

**Documentation**:
- [Complete CI/CD Guide](./CI_CD_COMPLETE_GUIDE.md) - In-depth documentation
- [Quick Reference](./CI_CD_QUICK_REFERENCE.md) - Command cheat sheet
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST_SOCIALPET.md) - Step-by-step checklist
- [Scripts README](../scripts/README.md) - Automation scripts guide

**Cloudflare Support**:
- Dashboard → Support → Contact Support
- Community: https://community.cloudflare.com/

**GitHub Issues**:
- Create an issue in the repository
- Include error messages and steps to reproduce

---

## Next Steps

After successful deployment:

### 1. Configure Monitoring (Optional)

Add monitoring secrets for enhanced observability:

```bash
# Sentry (error tracking)
gh secret set SENTRY_DSN
gh secret set SENTRY_AUTH_TOKEN

# PostHog (analytics)
gh secret set NEXT_PUBLIC_POSTHOG_KEY
gh secret set NEXT_PUBLIC_POSTHOG_HOST
```

### 2. Set Up Alerts (Optional)

Configure Cloudflare notifications:
- Dashboard → Notifications → Add
- Monitor deployment failures, error rates, etc.

### 3. Configure Backups (Recommended)

Set up automated database backups:
```bash
# Create backup script
./scripts/backup-databases.sh

# Schedule with cron or GitHub Actions
```

### 4. Add Team Members

Invite team members to GitHub repository:
- Settings → Collaborators → Add people
- Assign appropriate roles

### 5. Configure Production Reviewers

Add required reviewers for production deployments:
- GitHub → Settings → Environments → production
- Add required reviewers (1-2 people recommended)

---

## Summary

You now have a complete, production-ready deployment system:

✅ **4 Environments**: dev, test, staging, production
✅ **Automated CI/CD**: Quality gates, version control, rollback
✅ **Infrastructure**: D1 databases, custom domains, SSL
✅ **Workflow**: Git-based deployment with approvals
✅ **Monitoring**: Health checks, version tracking

### Quick Command Reference

```bash
# Verify setup
./scripts/verify-setup.sh

# Complete setup (first time)
./scripts/setup-complete-deployment.sh

# Deploy to dev
git push origin dev

# Deploy to staging
git checkout staging && git merge dev && git push origin staging

# Deploy to production (requires approval)
git checkout main && git merge staging && git push origin main

# Rollback production
gh workflow run rollback.yml -f environment=production -f reason="..."

# Check health
curl https://socialpet.io/api/health

# View logs
gh run list
gh run watch
```

---

**Status**: ✅ Complete deployment guide ready!

For questions or issues, see the [Troubleshooting](#troubleshooting) section or check the complete documentation.

Happy deploying! 🚀
