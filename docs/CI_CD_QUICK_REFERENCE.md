# CI/CD Quick Reference

**Quick reference for common CI/CD operations**. For complete documentation, see [CI_CD_COMPLETE_GUIDE.md](./CI_CD_COMPLETE_GUIDE.md).

## Quick Links

- 📚 [Complete CI/CD Guide](./CI_CD_COMPLETE_GUIDE.md)
- 🌍 [Environment Configuration](./CI_ENVIRONMENTS.md)
- 🚀 [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- 📊 [Observability Guide](./ops/observability.md)

---

## Common Operations

### Deploy to Environment

**Development (automatic)**
```bash
git push origin dev
```

**Staging (automatic)**
```bash
git push origin staging
```

**Production (requires approval)**
```bash
git push origin main
# Then approve deployment in GitHub UI
```

**Manual Deployment**
```bash
gh workflow run environment-promotion.yml \
  -f environment=production \
  -f version=1.2.3
```

---

### Rollback Deployment

**Quick Rollback (to previous version)**
```bash
gh workflow run rollback.yml \
  -f environment=production \
  -f reason="Critical bug in checkout flow"
```

**Rollback to Specific Version**
```bash
gh workflow run rollback.yml \
  -f environment=production \
  -f target_version=1.2.2 \
  -f reason="Regression in payment processing"
```

**Emergency Manual Rollback**
```bash
# List recent deployments
npx wrangler pages deployment list

# Rollback to specific deployment
npx wrangler pages deployment rollback \
  --project-name=next-boilerplate \
  --deployment-id=<deployment-id>
```

---

## Environment URLs

| Environment | URL | Database |
|-------------|-----|----------|
| Development | https://environment-dev.1pet.com | D1 (dev) |
| Staging | https://environment-stage.1pet.com | D1 (staging) |
| Production | https://environment.1pet.com | D1 (production) |

---

## Health Checks

```bash
# Development
curl https://environment-dev.1pet.com/api/health

# Staging
curl https://environment-stage.1pet.com/api/health

# Production
curl https://environment.1pet.com/api/health
```

**Expected Response:**
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

## Version Checks

```bash
# Check deployed version
curl https://environment.1pet.com/api/version

# Response
{
  "version": "1.2.3",
  "environment": "production",
  "buildTime": "2025-01-17T11:30:00Z",
  "gitCommit": "abc1234",
  "status": "ok"
}
```

---

## Workflow Status

```bash
# List recent deployments
gh run list --workflow=environment-promotion.yml --limit 5

# View specific deployment
gh run view <run-id> --log

# Cancel deployment
gh run cancel <run-id>

# Re-run failed deployment
gh run rerun <run-id>
```

---

## Database Operations

**Generate Migration**
```bash
# 1. Edit schema
vim apps/web/src/models/Schema.ts
vim apps/web/src/models/SchemaD1.ts

# 2. Generate migration
pnpm --filter web db:generate        # PostgreSQL
pnpm --filter web db:d1:generate     # D1
```

**Apply Migration**
```bash
# Local (PostgreSQL)
pnpm --filter web db:migrate

# Dev (D1)
pnpm --filter web d1:migrate

# Staging (D1)
pnpm --filter web d1:migrate:stage

# Production (D1)
pnpm --filter web d1:migrate:prod
```

**Backup Database**
```bash
# Export D1 database
ENV="production"  # or "staging", "dev"

npx wrangler d1 export next-boilerplate-db \
  --remote \
  --output backup-$(date +%Y%m%d-%H%M%S).sql
```

---

## Monitoring & Logs

**Sentry (Errors)**
- Dev: Disabled
- Staging: https://sentry.io (project: yourproject-staging)
- Production: https://sentry.io (project: yourproject)

**PostHog (Analytics)**
- Dev: Disabled
- Staging: Disabled
- Production: https://posthog.com

**Cloudflare Analytics**
- Dashboard: https://dash.cloudflare.com
- Workers Logs: `npx wrangler tail`

**Better Stack (Logs)**
- Dashboard: https://logs.betterstack.com

---

## Quality Checks (Local)

**Before Committing**
```bash
# Run all checks
pnpm --filter web ci:check

# Individual checks
pnpm --filter web lint
pnpm --filter web check:types
pnpm --filter web check:i18n
pnpm --filter web test
```

**Fix Common Issues**
```bash
# Auto-fix linting
pnpm --filter web lint:fix

# Update test snapshots
pnpm --filter web test -- -u

# Clear build cache
pnpm --filter web clean
```

---

## Common Troubleshooting

### Deployment Stuck

```bash
# Check status
gh run list --workflow=environment-promotion.yml --status=in_progress

# Cancel stuck deployment
gh run cancel <run-id>

# Retry
gh workflow run environment-promotion.yml -f environment=staging
```

### Health Check Failing

```bash
# 1. Check deployment status
npx wrangler pages deployment list

# 2. Check application logs
npx wrangler tail

# 3. Test health endpoint
curl -v https://environment.1pet.com/api/health

# 4. Clear Cloudflare cache
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone}/purge_cache" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -d '{"purge_everything":true}'
```

### Database Migration Failed

```bash
# Check migration status locally
pnpm --filter web db:status

# Test migration locally
DATABASE_URL=postgresql://localhost:5432/test \
  pnpm --filter web db:migrate

# If failed, rollback and fix
# Edit migration file in apps/web/migrations/
# Or regenerate after fixing schema
```

### Version Mismatch

```bash
# Force cache clear
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone}/purge_cache" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -d '{"purge_everything":true}'

# Redeploy specific version
gh workflow run environment-promotion.yml \
  -f environment=production \
  -f version=1.2.3
```

---

## Version Patterns

| Environment | Pattern | Example |
|-------------|---------|---------|
| Production | `MAJOR.MINOR.PATCH` | `1.2.3` |
| Staging | `MAJOR.MINOR.PATCH-rc.N` | `1.2.3-rc.5` |
| Development | `MAJOR.MINOR.PATCH-dev.N+hash` | `1.2.3-dev.123+abc1234` |

---

## Quality Gates

All environments run:
- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ i18n validation
- ✅ Unit tests (Vitest)
- ✅ Integration tests

Staging & Production additionally run:
- ✅ Security scanning (pnpm audit + TruffleHog)
- ✅ E2E tests (Playwright)

Production only:
- ✅ OWASP dependency check
- ✅ Manual approval required

---

## Emergency Contacts

**Incident Response:**
1. Create incident channel
2. Alert on-call team
3. Follow [emergency procedures](./CI_CD_COMPLETE_GUIDE.md#emergency-procedures)
4. Document in incident issue

**Escalation:**
- Level 1: Team lead
- Level 2: Engineering manager
- Level 3: CTO

---

## Useful Resources

- 📚 [Complete CI/CD Guide](./CI_CD_COMPLETE_GUIDE.md)
- 🔐 [Security Guide](./AUTH_SECURITY_IMPROVEMENTS.md)
- 🗄️ [Database Migrations](../apps/web/README.md#database)
- 📊 [Monitoring Setup](./ops/observability.md)
- 🌐 [Cloudflare Guide](../CLOUDFLARE_MIGRATION_GUIDE.md)

---

## GitHub CLI Setup

```bash
# Install GitHub CLI
brew install gh

# Authenticate
gh auth login

# Set default repo (run from project root)
gh repo set-default

# Test
gh run list --limit 5
```

---

## Pre-Deployment Checklist

**Before deploying to production:**

- [ ] All tests passing in staging
- [ ] Manual QA completed
- [ ] Database migrations tested
- [ ] Monitoring dashboards ready
- [ ] On-call team notified
- [ ] Rollback plan documented
- [ ] Feature flags configured (if applicable)
- [ ] Dependencies updated and audited
- [ ] Performance metrics baseline captured
- [ ] Deployment window scheduled

---

## Post-Deployment Checklist

**After production deployment:**

- [ ] Health check returns 200
- [ ] Version API shows correct version
- [ ] Error rates normal (Sentry)
- [ ] Performance metrics normal (PostHog)
- [ ] Database migrations applied successfully
- [ ] Critical user flows tested
- [ ] Monitoring alerts configured
- [ ] Deployment documented
- [ ] Team notified
- [ ] Monitor for 15-30 minutes

---

## Keyboard Shortcuts (GitHub Actions UI)

- `?` - Show keyboard shortcuts
- `Shift + /` - Focus search
- `.` - Open in github.dev editor
- `g` + `a` - Go to Actions tab
- `r` - Re-run workflow

---

**For detailed information, see the [Complete CI/CD Guide](./CI_CD_COMPLETE_GUIDE.md).**
