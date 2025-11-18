# SocialPet Deployment - Complete Index

**Your complete guide to all deployment automation, workflows, and documentation**

---

## 🚀 Quick Links

| What do you want to do? | Go here |
|-------------------------|---------|
| **First-time setup** | [Getting Started Guide](docs/GETTING_STARTED_DEPLOYMENT.md) |
| **Verify prerequisites** | Run `./scripts/verify-setup.sh` |
| **Automated setup** | Run `./scripts/setup-complete-deployment.sh` |
| **Deploy to production** | [Daily Workflow](#daily-workflow) |
| **Rollback deployment** | [Rollback Guide](#rollback-guide) |
| **Quick commands** | [Quick Reference](docs/CI_CD_QUICK_REFERENCE.md) |
| **Troubleshooting** | [Troubleshooting](#troubleshooting) |

---

## 📁 Project Structure

```
/
├── .github/workflows/
│   ├── CI-optimized.yml                    # Main CI workflow
│   ├── environment-promotion.yml           # Deployment pipeline ⭐
│   └── rollback.yml                        # Rollback workflow ⭐
│
├── scripts/
│   ├── verify-setup.sh                     # Prerequisites checker ⭐
│   ├── setup-complete-deployment.sh        # Master setup wizard ⭐
│   ├── setup-git-branches.sh               # Git branches automation
│   ├── setup-github-environments.sh        # GitHub environments automation
│   ├── setup-d1-databases.sh               # D1 databases automation
│   └── README.md                           # Scripts documentation
│
├── docs/
│   ├── GETTING_STARTED_DEPLOYMENT.md       # Complete getting started guide ⭐
│   ├── CI_CD_COMPLETE_GUIDE.md             # In-depth CI/CD documentation
│   ├── CI_CD_QUICK_REFERENCE.md            # Command cheat sheet
│   ├── CI_CD_WORKFLOW_DIAGRAM.md           # Visual workflow diagrams
│   ├── CLOUDFLARE_SOCIALPET_SETUP.md       # Cloudflare setup guide
│   ├── DEPLOYMENT_CHECKLIST_SOCIALPET.md   # Interactive checklist
│   └── SOCIALPET_DEPLOYMENT_SUMMARY.md     # Configuration summary
│
├── apps/web/
│   ├── wrangler.jsonc                      # Cloudflare configuration
│   └── src/app/[locale]/api/
│       ├── health/route.ts                 # Health check endpoint
│       └── version/route.ts                # Version tracking endpoint
│
└── DEPLOYMENT_INDEX.md                     # This file

⭐ = Start here
```

---

## 📚 Documentation Guide

### For First-Time Setup

**Start here**: [Getting Started Guide](docs/GETTING_STARTED_DEPLOYMENT.md)

This comprehensive guide walks you through:
1. Prerequisites and tool installation
2. Automated setup process
3. Step-by-step manual setup (if needed)
4. First deployment to all environments
5. Verification and troubleshooting

**Time**: 30-60 minutes for complete setup

### For Understanding the System

**Read**: [CI/CD Complete Guide](docs/CI_CD_COMPLETE_GUIDE.md)

This 18,000+ word guide covers:
- Architecture and design decisions
- Environment promotion strategy
- Version control and semantic versioning
- Quality gates implementation
- Rollback procedures
- Monitoring and observability
- Best practices and recommendations

**Time**: 2-3 hours to read thoroughly

### For Daily Operations

**Use**: [CI/CD Quick Reference](docs/CI_CD_QUICK_REFERENCE.md)

Quick command reference for:
- Deployment commands
- Health checks
- Database operations
- Rollback procedures
- Common troubleshooting

**Time**: 2-minute lookup

### For Visual Learners

**See**: [CI/CD Workflow Diagram](docs/CI_CD_WORKFLOW_DIAGRAM.md)

Visual diagrams showing:
- Environment promotion flow
- Deployment pipeline stages
- Quality gates process
- Rollback procedure
- Version control strategy

**Time**: 10 minutes to review

### For Cloudflare Setup

**Follow**: [Cloudflare SocialPet Setup](docs/CLOUDFLARE_SOCIALPET_SETUP.md)

Step-by-step Cloudflare configuration:
- D1 database creation
- Custom domain setup
- DNS configuration
- SSL certificate setup
- Pages project configuration

**Time**: 30 minutes

### For Tracking Progress

**Print**: [Deployment Checklist](docs/DEPLOYMENT_CHECKLIST_SOCIALPET.md)

Interactive checklist with ~150 items:
- Pre-deployment requirements
- Configuration steps
- Deployment procedures
- Post-deployment verification
- Ongoing maintenance

**Time**: Use throughout setup process

### For Configuration Summary

**Reference**: [SocialPet Deployment Summary](docs/SOCIALPET_DEPLOYMENT_SUMMARY.md)

Quick overview of:
- Environment configuration
- Database architecture
- Deployment commands
- File changes made
- Next steps

**Time**: 5-minute review

---

## 🛠️ Automation Scripts

### Verification Script

**Script**: `scripts/verify-setup.sh`
**Purpose**: Check if all prerequisites are met
**Run**: `./scripts/verify-setup.sh`

**Checks**:
- ✓ Required tools (git, gh, wrangler, pnpm, node)
- ✓ Authentication status (GitHub, Cloudflare)
- ✓ Git repository configuration
- ✓ Project files and permissions

**Output**: Color-coded pass/fail with fix suggestions

---

### Complete Setup Wizard

**Script**: `scripts/setup-complete-deployment.sh`
**Purpose**: Automate entire deployment setup
**Run**: `./scripts/setup-complete-deployment.sh`

**Actions**:
1. Creates git branches (dev, staging, main)
2. Creates GitHub environments with protection
3. Creates 4 D1 databases
4. Updates wrangler.jsonc with database IDs
5. Configures GitHub secrets (interactive)
6. Verifies complete setup

**Time**: 10-15 minutes (interactive)

---

### Individual Scripts

#### Git Branches Setup

**Script**: `scripts/setup-git-branches.sh`
**Purpose**: Create and configure git branches
**Run**: `./scripts/setup-git-branches.sh`

**Creates**:
- `dev` branch for development
- `staging` branch for pre-production
- `main` branch for production (if not exists)

---

#### GitHub Environments Setup

**Script**: `scripts/setup-github-environments.sh`
**Purpose**: Create GitHub environments via API
**Run**: `./scripts/setup-github-environments.sh`

**Creates**:
- `dev` environment (auto-deploy from dev)
- `test` environment (manual deployment)
- `staging` environment (auto-deploy from staging)
- `production` environment (approval required)

**Configures**:
- Deployment branch policies
- Production wait timer (5 minutes)
- Required reviewers (interactive)

---

#### D1 Databases Setup

**Script**: `scripts/setup-d1-databases.sh`
**Purpose**: Create Cloudflare D1 databases
**Run**: `./scripts/setup-d1-databases.sh`

**Creates**:
- `socialpet-db-dev`
- `socialpet-db-test`
- `socialpet-db-staging`
- `socialpet-db-production`

**Automates**:
- Database creation
- ID extraction
- wrangler.jsonc update
- Backup creation

---

## ⚙️ Workflows

### Environment Promotion Pipeline

**File**: `.github/workflows/environment-promotion.yml`
**Triggers**: Push to dev/staging/main branches, manual dispatch
**Purpose**: Automated deployment with quality gates

**Stages**:
1. **Prepare**: Version calculation, deployment record
2. **Quality Gates**: Lint, type-check, i18n validation
3. **Security Scan**: Dependency audit, secret scanning
4. **Integration Tests**: Database integration tests
5. **Build**: Next.js build with OpenNext
6. **Deploy**: Cloudflare Pages deployment + D1 migrations
7. **Verify**: Health checks + smoke tests
8. **Notify**: Status updates + failure alerts

**Version Scheme**:
- Production: `1.2.3`
- Staging: `1.2.3-rc.5`
- Development: `1.2.3-dev.123+abc1234`

---

### Rollback Workflow

**File**: `.github/workflows/rollback.yml`
**Triggers**: Manual dispatch only
**Purpose**: Quick rollback with safety measures

**Steps**:
1. Pre-rollback database backup
2. Version verification
3. Deployment rollback
4. Post-rollback health checks
5. Incident documentation (GitHub issue)

**Safety Features**:
- Requires explicit confirmation
- Creates backup before rollback
- Verifies rollback success
- Creates audit trail

---

## 🌍 Environments

| Environment | Domain | Branch | Auto-Deploy | Database |
|-------------|--------|--------|-------------|----------|
| **Development** | https://dev.socialpet.io | `dev` | ✅ Yes | `socialpet-db-dev` |
| **Test** | https://tst.socialpet.io | Any | ⚡ Manual | `socialpet-db-test` |
| **Staging** | https://stg.socialpet.io | `staging` | ✅ Yes | `socialpet-db-staging` |
| **Production** | https://socialpet.io<br>https://www.socialpet.io | `main` | ❌ Requires approval | `socialpet-db-production` |

---

## 📋 Daily Workflow

### Deploy to Development

```bash
# 1. Make changes on dev branch
git checkout dev
git add .
git commit -m "feat: add new feature"

# 2. Push to deploy automatically
git push origin dev

# 3. Monitor deployment
gh run watch

# 4. Verify
curl https://dev.socialpet.io/api/health
```

---

### Deploy to Staging

```bash
# 1. Switch to staging
git checkout staging

# 2. Merge from dev
git merge dev

# 3. Push to deploy automatically
git push origin staging

# 4. Verify
curl https://stg.socialpet.io/api/health
```

---

### Deploy to Production

```bash
# 1. Switch to main
git checkout main

# 2. Merge from staging
git merge staging

# 3. Push to trigger approval workflow
git push origin main

# 4. Approve in GitHub UI
# Actions → Environment Promotion → Review deployments

# 5. Verify after approval
curl https://socialpet.io/api/health
```

---

## 🔄 Rollback Guide

### Quick Rollback (Previous Version)

```bash
gh workflow run rollback.yml \
  -f environment=production \
  -f reason="Critical bug in payment processing"
```

---

### Rollback to Specific Version

```bash
gh workflow run rollback.yml \
  -f environment=production \
  -f target_version=1.2.2 \
  -f reason="Regression in checkout flow"
```

---

### Rollback with Database (DANGEROUS)

```bash
gh workflow run rollback.yml \
  -f environment=production \
  -f target_version=1.2.2 \
  -f rollback_database=true \
  -f reason="Database migration issue"
```

⚠️ **Warning**: Database rollbacks are destructive and may cause data loss!

---

## 🔍 Health Checks

### Check All Environments

```bash
for env in dev.socialpet.io tst.socialpet.io stg.socialpet.io socialpet.io; do
  echo "=== $env ==="
  curl -s "https://$env/api/health" | jq
  echo ""
done
```

---

### Check Specific Environment

```bash
# Health check
curl https://socialpet.io/api/health

# Version check
curl https://socialpet.io/api/version
```

---

### Expected Health Response

```json
{
  "status": "ok",
  "timestamp": "2025-01-17T12:00:00Z",
  "uptime": 3600,
  "version": "1.2.3",
  "environment": "production",
  "responseTime": "15ms"
}
```

---

## 🗄️ Database Operations

### List Databases

```bash
wrangler d1 list | grep socialpet
```

---

### Execute Query

```bash
# Development
wrangler d1 execute socialpet-db-dev --remote --command "SELECT * FROM users LIMIT 5"

# Production
wrangler d1 execute socialpet-db-production --remote --command "SELECT COUNT(*) FROM users"
```

---

### Apply Migrations

```bash
cd apps/web

# Development
pnpm d1:migrate

# Test
npx wrangler d1 migrations apply socialpet-db-test --remote --env test

# Staging
pnpm d1:migrate:stage

# Production
pnpm d1:migrate:prod
```

---

## 🚨 Troubleshooting

### Quick Diagnostics

```bash
# 1. Verify setup
./scripts/verify-setup.sh

# 2. Check GitHub workflows
gh run list --limit 5

# 3. View latest workflow logs
gh run view --log

# 4. Check GitHub secrets
gh secret list

# 5. Check Cloudflare authentication
wrangler whoami

# 6. List D1 databases
wrangler d1 list
```

---

### Common Issues

#### Deployment Fails

**Check**:
1. GitHub secrets configured? (`gh secret list`)
2. D1 database IDs updated in `wrangler.jsonc`?
3. Tests passing locally? (`pnpm test`)
4. Lint errors? (`pnpm lint`)

**Fix**:
```bash
# View detailed logs
gh run view <run-id> --log

# Re-run failed jobs
gh run rerun <run-id>
```

---

#### Domain Not Working

**Check**:
1. DNS configured correctly? (`dig CNAME dev.socialpet.io`)
2. SSL certificate issued? (can take 5-15 minutes)
3. Domain added to Cloudflare Pages project?

**Fix**:
- Wait for SSL provisioning
- Check Cloudflare Pages → Custom domains
- Verify DNS records in Cloudflare Dashboard

---

#### Database Connection Fails

**Check**:
```bash
# Test connectivity
wrangler d1 execute socialpet-db-dev --remote --command "SELECT 1"
```

**Fix**:
- Verify database exists: `wrangler d1 list`
- Check database binding in `wrangler.jsonc`
- Verify environment variables in Cloudflare Pages

---

## 🎯 Next Steps

After successful setup:

1. **Configure Monitoring** (optional)
   - Add Sentry DSN: `gh secret set SENTRY_DSN`
   - Add PostHog keys for analytics

2. **Set Up Team Access**
   - Add collaborators to GitHub repo
   - Configure production reviewers

3. **Create Backups**
   - Set up automated database backups
   - Store in Cloudflare R2 or S3

4. **Add Alerts**
   - Configure Cloudflare notifications
   - Set up error alerts in Sentry

5. **Document Custom Workflows**
   - Add team-specific procedures
   - Document any customizations

---

## 📞 Getting Help

### Documentation

All guides include troubleshooting sections:
- [Getting Started](docs/GETTING_STARTED_DEPLOYMENT.md)
- [Complete Guide](docs/CI_CD_COMPLETE_GUIDE.md)
- [Quick Reference](docs/CI_CD_QUICK_REFERENCE.md)

### Support

- **Cloudflare**: https://community.cloudflare.com/
- **GitHub**: Create an issue in the repository
- **Scripts**: Check `scripts/README.md`

---

## ✅ Summary

You have:

- ✅ **4 Complete Environments** (dev, test, staging, production)
- ✅ **Automated CI/CD Pipeline** (quality gates, versioning, rollback)
- ✅ **4 Automation Scripts** (complete setup + individual components)
- ✅ **2 GitHub Workflows** (deployment + rollback)
- ✅ **8 Documentation Files** (getting started + in-depth guides)
- ✅ **2 API Endpoints** (health + version monitoring)
- ✅ **4 D1 Databases** (one per environment)

**Everything is production-ready!** 🚀

---

**Last Updated**: November 17, 2025
**Status**: ✅ Complete and ready for deployment
