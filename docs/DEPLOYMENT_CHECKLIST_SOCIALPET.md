# SocialPet Cloudflare Deployment Checklist

**Step-by-step checklist for deploying SocialPet to Cloudflare**

Use this checklist to ensure you complete all steps needed for a successful deployment.

---

## Pre-Deployment Checklist

### 1. Prerequisites

- [ ] Cloudflare account created
- [ ] Domain `socialpet.io` added to Cloudflare account
- [ ] Node.js 20+ installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] GitHub repository created and code pushed
- [ ] Wrangler CLI installed (`npm install -g wrangler`)

### 2. Local Development Setup

- [ ] Clone repository: `git clone <repo-url>`
- [ ] Install dependencies: `pnpm install`
- [ ] Copy environment file: `cp apps/web/.env apps/web/.env.local`
- [ ] Run locally: `pnpm dev`
- [ ] Verify app runs at `http://localhost:3000`

---

## Cloudflare Setup

### 3. Wrangler Authentication

- [ ] Login to Cloudflare: `npx wrangler login`
- [ ] Verify authentication: `npx wrangler whoami`
- [ ] Note your Account ID (shown in `whoami` output)
- [ ] Save Account ID for later: `_______________________________`

### 4. Create Cloudflare Pages Project

- [ ] Go to Cloudflare Dashboard → Workers & Pages
- [ ] Click "Create application" → "Pages" → "Connect to Git"
- [ ] Select your repository
- [ ] Configure build settings:
  - [ ] Framework preset: Next.js
  - [ ] Build command: `pnpm build`
  - [ ] Build output directory: `.next`
  - [ ] Root directory: `apps/web`
  - [ ] Node.js version: `20`
- [ ] Click "Save and Deploy"
- [ ] Wait for initial deployment (may fail - that's OK, we'll configure it properly)

### 5. Create D1 Databases

**Option A: Automated Script (Recommended)**

- [ ] Run setup script: `./scripts/setup-d1-databases.sh`
- [ ] Follow prompts to create all 4 databases
- [ ] Verify `apps/web/wrangler.jsonc` was updated with database IDs
- [ ] Skip to step 6

**Option B: Manual Creation**

- [ ] Create dev database: `npx wrangler d1 create socialpet-db-dev`
- [ ] Save dev database ID: `_______________________________`
- [ ] Create test database: `npx wrangler d1 create socialpet-db-test`
- [ ] Save test database ID: `_______________________________`
- [ ] Create staging database: `npx wrangler d1 create socialpet-db-staging`
- [ ] Save staging database ID: `_______________________________`
- [ ] Create production database: `npx wrangler d1 create socialpet-db-production`
- [ ] Save production database ID: `_______________________________`
- [ ] Update `apps/web/wrangler.jsonc` with all database IDs

### 6. Apply Database Migrations

- [ ] Navigate to web app: `cd apps/web`
- [ ] Apply dev migrations: `pnpm d1:migrate`
- [ ] Apply test migrations: `npx wrangler d1 migrations apply socialpet-db-test --remote --env test`
- [ ] Apply staging migrations: `pnpm d1:migrate:stage`
- [ ] Apply production migrations: `pnpm d1:migrate:prod`
- [ ] Verify migrations: `npx wrangler d1 execute socialpet-db-dev --remote --command "SELECT 1"`

---

## Domain Configuration

### 7. Configure Custom Domains

- [ ] Go to Cloudflare Dashboard → Workers & Pages → socialpet → Custom domains
- [ ] Add development domain:
  - [ ] Click "Set up a custom domain"
  - [ ] Enter: `dev.socialpet.io`
  - [ ] Wait for SSL certificate (< 5 min)
- [ ] Add test domain:
  - [ ] Enter: `tst.socialpet.io`
  - [ ] Wait for SSL certificate
- [ ] Add staging domain:
  - [ ] Enter: `stg.socialpet.io`
  - [ ] Wait for SSL certificate
- [ ] Add production primary domain:
  - [ ] Enter: `socialpet.io`
  - [ ] Wait for SSL certificate
- [ ] Add production www domain:
  - [ ] Enter: `www.socialpet.io`
  - [ ] Wait for SSL certificate

### 8. Configure WWW Redirect

- [ ] Go to Cloudflare Dashboard → Rules → Page Rules
- [ ] Click "Create Page Rule"
- [ ] URL: `www.socialpet.io/*`
- [ ] Setting: "Forwarding URL" (301 - Permanent Redirect)
- [ ] Destination: `https://socialpet.io/$1`
- [ ] Save Page Rule

### 9. Verify DNS Records

- [ ] Go to Cloudflare Dashboard → DNS → Records
- [ ] Verify these CNAME records exist:
  - [ ] `dev.socialpet.io` → `socialpet.pages.dev`
  - [ ] `tst.socialpet.io` → `socialpet.pages.dev`
  - [ ] `stg.socialpet.io` → `socialpet.pages.dev`
  - [ ] `socialpet.io` → `socialpet.pages.dev`
  - [ ] `www.socialpet.io` → `socialpet.pages.dev`

---

## GitHub Configuration

### 10. Create Cloudflare API Token

- [ ] Go to Cloudflare Dashboard → My Profile → API Tokens
- [ ] Click "Create Token"
- [ ] Use template: "Edit Cloudflare Workers"
- [ ] Configure permissions:
  - [ ] Account → Cloudflare Pages → Edit
  - [ ] Account → D1 → Edit
  - [ ] Zone → DNS → Edit
- [ ] Account Resources: Include → Your account
- [ ] Zone Resources: Include → socialpet.io
- [ ] Click "Continue to summary"
- [ ] Click "Create Token"
- [ ] **Copy token immediately** (you won't see it again!)
- [ ] Save token securely: `_______________________________`

### 11. Configure GitHub Secrets

- [ ] Go to GitHub repository → Settings → Secrets and variables → Actions
- [ ] Click "New repository secret"
- [ ] Add `CLOUDFLARE_API_TOKEN`:
  - [ ] Name: `CLOUDFLARE_API_TOKEN`
  - [ ] Secret: (paste token from step 10)
  - [ ] Click "Add secret"
- [ ] Add `CLOUDFLARE_ACCOUNT_ID`:
  - [ ] Name: `CLOUDFLARE_ACCOUNT_ID`
  - [ ] Secret: (paste account ID from step 3)
  - [ ] Click "Add secret"

**Optional: Add monitoring secrets**
- [ ] `SENTRY_DSN` (if using Sentry)
- [ ] `SENTRY_AUTH_TOKEN` (if using Sentry)
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` (if using PostHog)
- [ ] `NEXT_PUBLIC_POSTHOG_HOST` (if using PostHog)
- [ ] `CODECOV_TOKEN` (if using Codecov)

### 12. Setup GitHub Environments

- [ ] Go to Settings → Environments
- [ ] Create `dev` environment:
  - [ ] Name: `dev`
  - [ ] Protection rules: None
  - [ ] Deployment branches: Only `dev`
- [ ] Create `test` environment:
  - [ ] Name: `test`
  - [ ] Protection rules: None
  - [ ] Deployment branches: All branches
- [ ] Create `staging` environment:
  - [ ] Name: `staging`
  - [ ] Protection rules: None (or optional reviewers)
  - [ ] Deployment branches: Only `staging`
- [ ] Create `production` environment:
  - [ ] Name: `production`
  - [ ] Protection rules:
    - [ ] Required reviewers: 1-2 people
    - [ ] Wait timer: 5 minutes
  - [ ] Deployment branches: Only `main`

---

## Deployment

### 13. Create Git Branches

- [ ] Create dev branch: `git checkout -b dev`
- [ ] Create staging branch: `git checkout -b staging`
- [ ] Return to main: `git checkout main`
- [ ] Push all branches:
  - [ ] `git push origin dev`
  - [ ] `git push origin staging`
  - [ ] `git push origin main`

### 14. Deploy to Development

- [ ] Verify dev branch is current: `git checkout dev`
- [ ] Make a commit (if needed): `git commit --allow-empty -m "trigger dev deployment"`
- [ ] Push to trigger deployment: `git push origin dev`
- [ ] Go to GitHub → Actions
- [ ] Verify "Environment Promotion Pipeline" workflow started
- [ ] Wait for workflow to complete (~10-15 minutes)
- [ ] Check for success status

### 15. Verify Development Deployment

- [ ] Test health endpoint: `curl https://dev.socialpet.io/api/health`
  - [ ] Expected: `{"status":"ok",...}`
- [ ] Test version endpoint: `curl https://dev.socialpet.io/api/version`
  - [ ] Expected: `{"version":"1.0.0-dev.1+...",...}`
- [ ] Visit in browser: https://dev.socialpet.io
  - [ ] Homepage loads correctly
  - [ ] Navigation works
  - [ ] No console errors

### 16. Deploy to Test Environment

- [ ] Trigger test deployment: `gh workflow run environment-promotion.yml -f environment=test`
- [ ] Wait for completion
- [ ] Test health: `curl https://tst.socialpet.io/api/health`
- [ ] Visit: https://tst.socialpet.io

### 17. Deploy to Staging

- [ ] Checkout staging: `git checkout staging`
- [ ] Merge dev: `git merge dev`
- [ ] Push: `git push origin staging`
- [ ] Monitor workflow in GitHub Actions
- [ ] Wait for completion

### 18. Verify Staging Deployment

- [ ] Test health: `curl https://stg.socialpet.io/api/health`
- [ ] Test version: `curl https://stg.socialpet.io/api/version`
- [ ] Visit: https://stg.socialpet.io
- [ ] Perform QA testing:
  - [ ] Test all critical user flows
  - [ ] Test authentication
  - [ ] Test database operations
  - [ ] Check monitoring (Sentry, PostHog)
- [ ] Run E2E tests: `E2E_BASE_URL=https://stg.socialpet.io pnpm test:e2e`

### 19. Deploy to Production

**⚠️ Important: This requires manual approval**

- [ ] Checkout main: `git checkout main`
- [ ] Merge staging: `git merge staging`
- [ ] Review changes: `git diff main~1 main`
- [ ] Push: `git push origin main`
- [ ] Go to GitHub → Actions
- [ ] Find "Environment Promotion Pipeline" workflow
- [ ] Click on the running workflow
- [ ] Click "Review deployments"
- [ ] Review deployment details
- [ ] Click "Approve and deploy"
- [ ] Wait for deployment completion (~15 minutes)

### 20. Verify Production Deployment

- [ ] Test primary domain: `curl https://socialpet.io/api/health`
- [ ] Test www domain: `curl https://www.socialpet.io/api/health`
- [ ] Verify www redirects to primary: `curl -I https://www.socialpet.io`
  - [ ] Should show 301 redirect to socialpet.io
- [ ] Test version: `curl https://socialpet.io/api/version`
- [ ] Visit: https://socialpet.io
- [ ] Visit: https://www.socialpet.io (should redirect)
- [ ] Test critical flows:
  - [ ] Homepage loads
  - [ ] Authentication works
  - [ ] Key features functional
  - [ ] Mobile responsive
  - [ ] No console errors

---

## Post-Deployment

### 21. Monitor Deployments

- [ ] Check Cloudflare Analytics:
  - [ ] Dashboard → Analytics & Logs → Web Analytics
  - [ ] Verify traffic is being recorded
- [ ] Check Sentry (if configured):
  - [ ] No new errors
  - [ ] Performance metrics normal
- [ ] Check PostHog (if configured):
  - [ ] Events being recorded
  - [ ] User sessions visible
- [ ] Check Cloudflare Pages logs:
  - [ ] `npx wrangler pages deployment tail`
  - [ ] No errors in logs

### 22. Performance Checks

- [ ] Run Lighthouse audit:
  - [ ] Open Chrome DevTools
  - [ ] Go to Lighthouse tab
  - [ ] Run audit
  - [ ] Verify scores > 90
- [ ] Test load time from different locations:
  - [ ] Use tools.pingdom.com
  - [ ] Test from multiple regions
- [ ] Check Core Web Vitals:
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1

### 23. Security Checks

- [ ] Verify HTTPS is enforced (no HTTP access)
- [ ] Check SSL certificate is valid
- [ ] Verify security headers:
  ```bash
  curl -I https://socialpet.io
  ```
  - [ ] `Strict-Transport-Security` present
  - [ ] `X-Content-Type-Options` present
  - [ ] `X-Frame-Options` or `Content-Security-Policy` present
- [ ] Test for common vulnerabilities:
  - [ ] XSS prevention
  - [ ] CSRF protection
  - [ ] SQL injection protection

### 24. Backup & Recovery

- [ ] Document rollback procedure
- [ ] Test rollback on dev environment:
  ```bash
  gh workflow run rollback.yml \
    -f environment=dev \
    -f reason="Testing rollback procedure"
  ```
- [ ] Verify rollback works correctly
- [ ] Schedule automated database backups (if not already configured)
- [ ] Test database restore procedure

### 25. Documentation

- [ ] Update README with production URL
- [ ] Document environment URLs
- [ ] Add deployment instructions for team
- [ ] Create runbook for common operations
- [ ] Document monitoring and alerting setup

---

## Ongoing Operations

### 26. Regular Maintenance

**Weekly:**
- [ ] Review Sentry errors
- [ ] Check performance metrics
- [ ] Review security alerts
- [ ] Update dependencies (if needed)

**Monthly:**
- [ ] Review and rotate secrets
- [ ] Check database size and optimize
- [ ] Review and update documentation
- [ ] Audit access permissions

**Quarterly:**
- [ ] Perform load testing
- [ ] Review and update security policies
- [ ] Disaster recovery drill
- [ ] Review costs and optimize

---

## Troubleshooting Quick Reference

**Deployment fails:**
```bash
# Check workflow logs
gh run list --workflow=environment-promotion.yml --limit 1
gh run view <run-id> --log

# Verify secrets are set
gh secret list

# Test local build
pnpm --filter web build
```

**Health check fails:**
```bash
# Test directly
curl -v https://dev.socialpet.io/api/health

# Check Cloudflare logs
npx wrangler pages deployment tail

# Verify deployment succeeded
npx wrangler pages deployment list
```

**Database connection fails:**
```bash
# Verify database exists
npx wrangler d1 list

# Test connection
npx wrangler d1 execute socialpet-db-dev --remote --command "SELECT 1"

# Check migrations
npx wrangler d1 migrations list socialpet-db-dev --remote
```

**Domain not working:**
```bash
# Check DNS
dig dev.socialpet.io
dig CNAME dev.socialpet.io

# Verify SSL certificate
curl -I https://dev.socialpet.io

# Check custom domains in dashboard
# Cloudflare → Workers & Pages → socialpet → Custom domains
```

---

## Emergency Contacts

**Cloudflare Support:**
- Dashboard → Support → Contact Support
- Community: https://community.cloudflare.com/

**Project Team:**
- Lead: _______________________________
- DevOps: _______________________________
- On-call: _______________________________

---

## Checklist Summary

Total steps: 26 sections, ~150 individual checks

### Critical Path (Minimum for deployment):
1. ✅ Prerequisites (steps 1-2)
2. ✅ Cloudflare Setup (steps 3-6)
3. ✅ Domain Configuration (steps 7-9)
4. ✅ GitHub Configuration (steps 10-12)
5. ✅ Deployment (steps 13-20)

### Recommended (For production-ready):
6. ✅ Post-Deployment Monitoring (steps 21-22)
7. ✅ Security Checks (step 23)
8. ✅ Backup & Recovery (step 24)

### Optional (Best practices):
9. ✅ Documentation (step 25)
10. ✅ Ongoing Operations (step 26)

---

**Print this checklist and check off items as you complete them!**

For detailed instructions on any step, see:
- [Complete Setup Guide](./CLOUDFLARE_SOCIALPET_SETUP.md)
- [CI/CD Guide](./CI_CD_COMPLETE_GUIDE.md)
- [Quick Reference](./CI_CD_QUICK_REFERENCE.md)
