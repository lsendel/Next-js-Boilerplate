# Schema Deployment Lifecycle - Implementation Checklist

> **Reference:** See `SCHEMA_DEPLOYMENT_SIMPLIFIED_PLAN.md` for full rationale and approach.

This document provides a step-by-step implementation guide with checkboxes to track progress.

---

## Phase 1: CI/CD Enhancements (Est. 2 hours)

### ✅ Task 1.1: Add Migration Validation Scripts (10 min)

**Priority:** HIGH | **Effort:** LOW

- [ ] Add validation scripts to `package.json`:
  ```bash
  npm pkg set scripts.db:validate="drizzle-kit check --config drizzle.config.ts --dialect postgresql"
  npm pkg set scripts.db:check-drift="npm run db:validate"
  npm pkg set scripts.db:info="drizzle-kit introspect --config drizzle.config.ts"
  ```

- [ ] Test locally:
  ```bash
  npm run db:validate
  ```

- [ ] Commit changes:
  ```bash
  git add package.json
  git commit -m "feat(db): add validation and drift detection scripts"
  ```

**Success Criteria:**
- ✓ Scripts run without errors
- ✓ `db:validate` returns exit code 0
- ✓ Commands documented in README

---

### ✅ Task 1.2: Create Schema Validation Workflow (30 min)

**Priority:** HIGH | **Effort:** MEDIUM

- [ ] Create `.github/workflows/schema-check.yml`:
  - Copy content from `SCHEMA_DEPLOYMENT_SIMPLIFIED_PLAN.md` Phase 1, Task 1.1
  - Customize for project structure

- [ ] Add workflow to CI triggers:
  - Trigger on PR with paths: `src/server/db/models/**`, `migrations/**`, `drizzle.config.ts`

- [ ] Test workflow:
  - Create test PR with schema change
  - Verify workflow runs and passes
  - Intentionally skip `db:generate` to test failure case

- [ ] Document in `CONTRIBUTING.md`:
  - Mention schema validation requirement
  - Link to migration guide

**Success Criteria:**
- ✓ Workflow file created and committed
- ✓ Workflow triggers on schema changes
- ✓ Workflow fails when migrations missing
- ✓ Workflow passes when migrations present

**Files Modified:**
- `.github/workflows/schema-check.yml` (new)
- `CONTRIBUTING.md` (update)

---

### ✅ Task 1.3: Add Pre-commit Hook (15 min)

**Priority:** MEDIUM | **Effort:** LOW

- [ ] Update `.lefthook.yml` with schema-check command:
  - Add `schema-check` under `pre-commit.commands`
  - Configure glob pattern for `src/server/db/models/**/*.ts`

- [ ] Test hook locally:
  ```bash
  # Edit schema without running db:generate
  # Try to commit - should fail

  # Run db:generate
  # Stage migrations
  # Try to commit - should pass
  ```

- [ ] Document hook behavior in `docs/DATABASE.md`

**Success Criteria:**
- ✓ Hook prevents commits when schema/migrations mismatch
- ✓ Hook allows commits when both are staged
- ✓ Developers can bypass with `--no-verify` if needed
- ✓ Hook documented

**Files Modified:**
- `.lefthook.yml` (update)
- `docs/DATABASE.md` (update)

---

### ✅ Task 1.4: Create Observability Wrapper (45 min)

**Priority:** MEDIUM | **Effort:** MEDIUM

- [ ] Create `scripts/db/` directory:
  ```bash
  mkdir -p scripts/db
  ```

- [ ] Create `scripts/db/migrate-with-telemetry.sh`:
  - Copy script from `SCHEMA_DEPLOYMENT_SIMPLIFIED_PLAN.md`
  - Make executable: `chmod +x scripts/db/migrate-with-telemetry.sh`
  - Test locally (without GRAFANA_LOKI_URL set)

- [ ] Add convenience scripts to `package.json`:
  ```bash
  npm pkg set scripts.db:migrate:staging="ENVIRONMENT=staging ./scripts/db/migrate-with-telemetry.sh"
  npm pkg set scripts.db:migrate:prod="ENVIRONMENT=production ./scripts/db/migrate-with-telemetry.sh"
  ```

- [ ] Test wrapper script:
  ```bash
  ENVIRONMENT=test ./scripts/db/migrate-with-telemetry.sh
  ```

- [ ] Document telemetry setup in `docs/OBSERVABILITY.md`:
  - How to set GRAFANA_LOKI_URL
  - Migration event format
  - Example Loki queries

**Success Criteria:**
- ✓ Script runs migrations successfully
- ✓ Logs migration start/end times
- ✓ Sends telemetry when GRAFANA_LOKI_URL is set
- ✓ Gracefully skips telemetry when URL not set
- ✓ Exit codes preserved (0 = success, 1 = failure)

**Files Created:**
- `scripts/db/migrate-with-telemetry.sh`
- `docs/OBSERVABILITY.md` (update/create)

---

### ✅ Task 1.5: Document Rollback Procedures (30 min)

**Priority:** HIGH | **Effort:** LOW

- [ ] Create `scripts/db/rollback-guide.md`:
  - Copy from `SCHEMA_DEPLOYMENT_SIMPLIFIED_PLAN.md` Phase 1, Task 1.4
  - Customize decision tree for project

- [ ] Create `scripts/db/rollback.sh`:
  - Copy Neon rollback script
  - Make executable: `chmod +x scripts/db/rollback.sh`
  - Add comments for usage

- [ ] Create `scripts/db/backup.sh` (optional):
  ```bash
  #!/bin/bash
  # Simple pg_dump backup script
  set -euo pipefail

  BACKUP_DIR="backups"
  mkdir -p "$BACKUP_DIR"

  TIMESTAMP=$(date +%Y%m%d-%H%M%S)
  BACKUP_FILE="$BACKUP_DIR/db-backup-$TIMESTAMP.sql.gz"

  pg_dump "${DATABASE_URL}" | gzip > "$BACKUP_FILE"
  echo "✅ Backup created: $BACKUP_FILE"
  ```

- [ ] Add backup script to package.json:
  ```bash
  npm pkg set scripts.db:backup="./scripts/db/backup.sh"
  ```

- [ ] Update `DEPLOYMENT_GUIDE.md`:
  - Add rollback procedures section
  - Link to `scripts/db/rollback-guide.md`

**Success Criteria:**
- ✓ Rollback guide documents all 4 options
- ✓ Decision tree helps choose correct method
- ✓ Scripts are executable and tested (dry-run)
- ✓ Documented in deployment guide

**Files Created:**
- `scripts/db/rollback-guide.md`
- `scripts/db/rollback.sh`
- `scripts/db/backup.sh` (optional)

**Files Modified:**
- `DEPLOYMENT_GUIDE.md` (update)

---

## Phase 2: Environment-Specific Workflows (Est. 1.5 hours)

### ✅ Task 2.1: Staging Deploy Workflow (45 min)

**Priority:** HIGH | **Effort:** MEDIUM

- [ ] Create `.github/workflows/deploy-staging.yml`:
  - Copy workflow from `SCHEMA_DEPLOYMENT_SIMPLIFIED_PLAN.md`
  - Customize for deployment platform (Vercel/AWS/etc.)

- [ ] Configure GitHub environment:
  - Go to Settings → Environments → New environment: `staging`
  - Add secret: `DATABASE_URL_STAGING`
  - Add secret: `GRAFANA_LOKI_URL` (if using)
  - Add protection rules if needed

- [ ] Update workflow to use correct deploy command:
  - Replace Vercel example with actual deploy command
  - Ensure DATABASE_URL is passed correctly

- [ ] Test workflow:
  - Push to `main` branch (or trigger manually)
  - Verify migrations run before deploy
  - Check telemetry logs (if configured)

- [ ] Add smoke tests (optional):
  - Create basic health check endpoint
  - Add curl check to workflow

**Success Criteria:**
- ✓ Workflow deploys to staging automatically on main push
- ✓ Migrations run before deployment
- ✓ Deployment fails if migrations fail
- ✓ Telemetry events sent (if configured)
- ✓ Drift detection runs post-deploy

**Files Created:**
- `.github/workflows/deploy-staging.yml`

**Secrets Required:**
- `DATABASE_URL_STAGING`
- `GRAFANA_LOKI_URL` (optional)
- Platform-specific secrets (VERCEL_TOKEN, AWS credentials, etc.)

---

### ✅ Task 2.2: Production Deploy Workflow (45 min)

**Priority:** HIGH | **Effort:** MEDIUM

- [ ] Create `.github/workflows/deploy-production.yml`:
  - Copy workflow from `SCHEMA_DEPLOYMENT_SIMPLIFIED_PLAN.md`
  - Add manual approval requirement
  - Add pre-deploy snapshot creation

- [ ] Configure GitHub environment:
  - Go to Settings → Environments → New environment: `production`
  - Add required reviewers (at least 1)
  - Add deployment branch: `main` only
  - Add secrets: `DATABASE_URL_PROD`, `NEON_API_KEY`, etc.

- [ ] Add Neon snapshot creation (if using Neon):
  - Install Neon CLI in workflow
  - Create branch before migration
  - Document branch ID in step summary

- [ ] Add canary deployment logic (optional):
  - Deploy with feature flag or traffic split
  - Monitor metrics for 5 minutes
  - Full rollout or rollback based on metrics

- [ ] Create deployment checklist in PR template:
  ```markdown
  ## Production Deployment Checklist
  - [ ] Schema changes reviewed
  - [ ] Migrations tested in staging
  - [ ] Rollback plan documented
  - [ ] On-call engineer notified
  ```

**Success Criteria:**
- ✓ Workflow requires manual approval
- ✓ Pre-deploy snapshot created
- ✓ Migrations run with timeout protection
- ✓ Canary deployment optional but available
- ✓ Post-deploy drift detection runs
- ✓ Deployment summary includes all steps

**Files Created:**
- `.github/workflows/deploy-production.yml`
- `.github/PULL_REQUEST_TEMPLATE.md` (update)

**Secrets Required:**
- `DATABASE_URL_PROD`
- `NEON_API_KEY` + `NEON_PROJECT_ID`
- `GRAFANA_LOKI_URL`
- Platform-specific secrets

---

## Phase 3: Developer Experience (Est. 30 min)

### ✅ Task 3.1: Add Helper Scripts (15 min)

**Priority:** LOW | **Effort:** LOW

- [ ] Add convenience scripts to `package.json`:
  ```bash
  npm pkg set scripts.db:status="echo '📊 Migration Status:' && drizzle-kit introspect"
  npm pkg set scripts.db:history="psql \$DATABASE_URL -c 'SELECT * FROM _drizzle_migrations ORDER BY id DESC LIMIT 10'"
  npm pkg set scripts.db:reset:local="rm -rf local.db && npm run db:migrate"
  npm pkg set scripts.db:snapshot="pg_dump \$DATABASE_URL | gzip > backups/snapshot-\$(date +%Y%m%d-%H%M%S).sql.gz"
  ```

- [ ] Create `backups/.gitkeep`:
  ```bash
  mkdir -p backups
  touch backups/.gitkeep
  ```

- [ ] Update `.gitignore`:
  ```bash
  echo "backups/*.sql.gz" >> .gitignore
  ```

- [ ] Test each script:
  ```bash
  npm run db:status
  npm run db:history
  npm run db:reset:local
  npm run db:snapshot
  ```

**Success Criteria:**
- ✓ All scripts work without errors
- ✓ Scripts documented in package.json
- ✓ Backups directory created and ignored

**Files Modified:**
- `package.json`
- `.gitignore`
- `backups/.gitkeep` (new)

---

### ✅ Task 3.2: Update Developer Documentation (15 min)

**Priority:** MEDIUM | **Effort:** LOW

- [ ] Create `docs/DATABASE.md`:
  - Copy template from `SCHEMA_DEPLOYMENT_SIMPLIFIED_PLAN.md`
  - Add project-specific details
  - Include examples with actual table names

- [ ] Update `README.md`:
  - Add link to `docs/DATABASE.md` in "Development" section
  - Mention `npm run db:generate` + `npm run db:migrate` workflow

- [ ] Update `CONTRIBUTING.md`:
  - Add section on schema changes
  - Link to migration workflow
  - Mention pre-commit hook behavior

- [ ] Create quick reference card:
  ```markdown
  # Database Quick Reference

  | Command | Purpose |
  |---------|---------|
  | `npm run db:generate` | Generate migration from schema changes |
  | `npm run db:migrate` | Apply migrations locally |
  | `npm run db:validate` | Check for drift |
  | `npm run db:status` | Show migration status |
  | `npm run db:reset:local` | Wipe and re-migrate local DB |
  ```

**Success Criteria:**
- ✓ Documentation covers all common tasks
- ✓ Examples use actual project tables
- ✓ Links between docs are correct
- ✓ Quick reference easily accessible

**Files Created:**
- `docs/DATABASE.md`

**Files Modified:**
- `README.md`
- `CONTRIBUTING.md`

---

## Phase 4: Monitoring & Observability (Optional, Est. 2 hours)

### ✅ Task 4.1: Set Up Grafana Dashboards (60 min)

**Priority:** LOW | **Effort:** HIGH

- [ ] Create Grafana dashboard for migrations:
  - Migration success/failure rate
  - Migration duration over time
  - Migrations by environment
  - Drift detection alerts

- [ ] Add Loki queries for migration events:
  ```logql
  {service="database-migrations", environment="production"} |= "Migration"
  ```

- [ ] Set up alerts:
  - Migration failure in production
  - Drift detected
  - Migration duration > 5 minutes

**Success Criteria:**
- ✓ Dashboard shows real-time migration metrics
- ✓ Alerts fire correctly
- ✓ Historical data available for review

---

### ✅ Task 4.2: Integrate with Incident Management (30 min)

**Priority:** LOW | **Effort:** MEDIUM

- [ ] Configure PagerDuty/OpsGenie webhook:
  - Create integration in incident management tool
  - Add webhook URL to GitHub secrets
  - Update `migrate-with-telemetry.sh` to call webhook on failure

- [ ] Create runbook for migration failures:
  - Diagnosis steps
  - Common causes
  - Resolution procedures
  - Escalation path

- [ ] Test incident flow:
  - Trigger test migration failure
  - Verify alert sent
  - Follow runbook to resolve

**Success Criteria:**
- ✓ Alerts sent to on-call engineer
- ✓ Runbook easy to follow
- ✓ Incident resolved within SLA

---

## Implementation Timeline

### Sprint 1 (Week 1): Foundation
**Goal:** Basic validation in CI

- **Day 1 (2h):**
  - ✅ Task 1.1: Validation scripts
  - ✅ Task 1.2: Schema validation workflow

- **Day 2 (1h):**
  - ✅ Task 1.3: Pre-commit hook
  - Test on feature branch

- **Day 3 (2h):**
  - ✅ Task 1.4: Observability wrapper
  - ✅ Task 1.5: Rollback documentation

- **Day 4 (1h):**
  - ✅ Task 3.1: Helper scripts
  - ✅ Task 3.2: Developer docs

- **Day 5 (2h):**
  - Team review session
  - Fix any issues found
  - Merge to main

**Deliverables:**
- ✓ Schema validation in CI
- ✓ Pre-commit hook preventing errors
- ✓ Documented rollback procedures
- ✓ Developer documentation

---

### Sprint 2 (Week 2): Production-Ready
**Goal:** Automated staging/prod deploys

- **Day 1 (4h):**
  - ✅ Task 2.1: Staging workflow
  - Test end-to-end with real staging environment

- **Day 2 (4h):**
  - ✅ Task 2.2: Production workflow
  - Dry-run with production approval

- **Day 3-4 (8h):**
  - ✅ Task 4.1-4.2: Observability (optional)
  - Or use time for polish and testing

- **Day 5 (2h):**
  - Production deployment dry-run
  - Team retrospective

**Deliverables:**
- ✓ Automated staging deploys
- ✓ Manual-approval production deploys
- ✓ Migration telemetry (if opted in)
- ✓ Complete documentation

---

## Success Criteria

### Week 1 Checklist
- [ ] All Phase 1 tasks complete
- [ ] CI passes on test PR
- [ ] Pre-commit hook prevents errors
- [ ] Team trained on new workflow
- [ ] Documentation reviewed

### Week 2 Checklist
- [ ] All Phase 2 tasks complete
- [ ] Staging deploy tested end-to-end
- [ ] Production deploy dry-run successful
- [ ] Observability configured (optional)
- [ ] Rollback procedure tested

### Month 1 Metrics
- [ ] 100% of PRs pass schema validation
- [ ] 0 merge conflicts in migrations/
- [ ] 100% migration success rate in CI
- [ ] < 1 minute average migration time
- [ ] Team velocity unchanged or improved

---

## Risk Mitigation

### Risk: Migration breaks production
**Mitigation:**
- Pre-deploy snapshot (Neon branch)
- Canary deployment option
- Documented rollback procedures
- Approval gate before production deploy

### Risk: Developers forget to run db:generate
**Mitigation:**
- Pre-commit hook prevents commits
- CI workflow fails on missing migrations
- Clear error messages with fix instructions

### Risk: Drift introduced by manual changes
**Mitigation:**
- Post-deploy drift detection
- Alerts on drift found
- Regular drift detection drills

### Risk: Migration takes too long
**Mitigation:**
- Timeout protection (5 min max)
- Fail fast on timeout
- Investigate slow migrations in staging first

---

## Appendix: Commands Reference

### Daily Development
```bash
# Make schema change
vim src/server/db/models/Schema.ts

# Generate migration
npm run db:generate

# Apply locally
npm run db:migrate

# Commit
git add src/server/db/models/ migrations/
git commit -m "feat(db): add user preferences table"
```

### Debugging
```bash
# Check current status
npm run db:status

# View migration history
npm run db:history

# Check for drift
npm run db:validate

# Reset local database
npm run db:reset:local
```

### Deployment
```bash
# Staging (automatic on main push)
git push origin main

# Production (manual workflow dispatch)
# Go to GitHub Actions → Deploy to Production → Run workflow
```

### Emergency Rollback
```bash
# Neon branch rollback
./scripts/db/rollback.sh production

# Or forward-fix migration
npm run db:generate  # After reverting schema change
git commit -m "revert: rollback migration X"
```

---

## Next Steps

**Start Today (30 min):**
1. Add validation scripts: ✅ Task 1.1
2. Test locally: `npm run db:validate`
3. Create feature branch for implementation

**This Week (6-8 hours):**
1. Complete Phase 1 (all validation tasks)
2. Test on feature branch
3. Team review

**Next Week (6-8 hours):**
1. Complete Phase 2 (deploy workflows)
2. Dry-run production deploy
3. Go live

**Month 1 (Ongoing):**
1. Monitor success metrics
2. Iterate based on feedback
3. Add observability (Phase 4) if needed

---

**Status:** Ready to implement
**Blockers:** None
**Dependencies:** None (all tools already installed)
**Owner:** Database team lead + DevOps
**Timeline:** 2 weeks for full implementation
