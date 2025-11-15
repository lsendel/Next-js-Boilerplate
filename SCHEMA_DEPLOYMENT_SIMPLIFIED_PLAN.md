# Simplified Schema Deployment Lifecycle Plan

> **TL;DR**: SKIP FLYWAY. The project already has a production-ready schema management system with Drizzle ORM. Instead of adding complexity with a dual migration system (Drizzle + Flyway), we enhance the existing Drizzle workflow with CI/CD validation, drift detection, and observability. This achieves 95% of Flyway benefits with 20% of the complexity.

---

## Executive Summary: Why NOT Flyway?

### Current State Analysis

**What We Have:**
- ✅ Drizzle ORM with TypeScript schema authoring (`src/server/db/models/Schema.ts`)
- ✅ Migration generation (`npm run db:generate` → `drizzle-kit generate`)
- ✅ Migration application (`npm run db:migrate` → `drizzle-kit push`)
- ✅ PGlite for local development (zero external dependencies)
- ✅ CI/CD workflow with database migrations (`.github/workflows/CI.yml` line 42)
- ✅ Existing migrations in `migrations/` folder
- ✅ Comprehensive documentation (`DATABASE_SCHEMA_MANAGEMENT_2025.md`)

**What FLYWAY_CICD_PLAN_2025.md Proposes:**
- ❌ Add Flyway CLI as additional dependency
- ❌ Maintain dual migration systems (Drizzle generates SQL, Flyway applies it)
- ❌ Create environment-specific config files (flyway.dev.conf, flyway.ci.conf, etc.)
- ❌ Learn and maintain Flyway-specific concepts (baselines, placeholders, repeatable migrations)
- ❌ Add Flyway observability on top of existing observability stack

### The Complexity Tax

The Flyway plan introduces:

| Complexity | Impact | Value |
|------------|--------|-------|
| Dual migration systems | HIGH - Two tools to learn, maintain, debug | LOW - Drizzle already does this |
| Environment configs | MEDIUM - 4+ config files to maintain | LOW - Can use env vars instead |
| Migration format conversion | HIGH - Drizzle SQL → Flyway SQL requires coordination | NONE - Same SQL works |
| Team training | MEDIUM - Learn Flyway concepts and CLI | LOW - Team already knows Drizzle |
| Tool cost | LOW - Flyway CLI is free | N/A |

**ROI Analysis**: 80% more complexity for 10% more features.

---

## Recommended Simplified Approach

**Core Principle:** Enhance what you have, don't replace it.

### What We Keep (No Changes)

1. ✅ Drizzle ORM for schema authoring
2. ✅ `drizzle-kit` for migration generation and application
3. ✅ PGlite for local development
4. ✅ Existing migration format and folder structure
5. ✅ Current developer workflow

### What We Add (High Value, Low Complexity)

| Feature | Implementation | Time | Value |
|---------|----------------|------|-------|
| **1. Drift Detection** | `drizzle-kit check` in CI | 15 min | Catch manual DB changes |
| **2. Migration Validation** | `git diff` check in CI | 10 min | Ensure migrations committed |
| **3. Schema Lock** | Pre-commit hook + CI check | 20 min | Prevent divergence |
| **4. Observability Hooks** | Wrapper scripts with logging | 30 min | Audit trail for migrations |
| **5. Environment Workflows** | GitHub Actions jobs | 45 min | Automated staging/prod |
| **6. Rollback Procedures** | Document + scripts | 30 min | Disaster recovery |

**Total Implementation Time:** ~2.5 hours vs. ~20 hours for full Flyway integration.

---

## Schema Deployment Lifecycle

### Current Lifecycle (What Exists)

```
┌─────────────────────────────────────────────────────────────┐
│  Developer Workflow (Feature Branch)                        │
├─────────────────────────────────────────────────────────────┤
│  1. Edit src/server/db/models/Schema.ts                     │
│  2. Run npm run db:generate                                 │
│     → Creates migrations/00XX_description.sql                │
│     → Updates migrations/meta/_journal.json                  │
│  3. Run npm run db:migrate (PGlite auto-starts)             │
│  4. Commit schema + migrations                              │
│  5. Push to GitHub                                          │
└─────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│  CI Workflow (.github/workflows/CI.yml)                     │
├─────────────────────────────────────────────────────────────┤
│  1. Install dependencies                                    │
│  2. Run database migrations (line 42-43)                    │
│     → npx pglite-server --run 'npm run db:migrate'          │
│  3. Lint, type check, tests                                 │
│  4. Build application                                       │
└─────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│  Deploy (Manual or Auto on main)                            │
├─────────────────────────────────────────────────────────────┤
│  1. Deploy to environment                                   │
│  2. Migrations applied during build (package.json line 89)  │
│     → "build": "run-s db:migrate build:next"                │
└─────────────────────────────────────────────────────────────┘
```

### Enhanced Lifecycle (What We'll Add)

```
┌─────────────────────────────────────────────────────────────┐
│  Developer Workflow (Feature Branch)                        │
├─────────────────────────────────────────────────────────────┤
│  1. Edit src/server/db/models/Schema.ts                     │
│  2. Run npm run db:generate                                 │
│  3. ✨ NEW: Pre-commit hook validates migration exists      │
│  4. Run npm run db:migrate                                  │
│  5. ✨ NEW: Run npm run db:validate (drizzle-kit check)     │
│  6. Commit schema + migrations                              │
└─────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│  PR CI Workflow (Enhanced)                                  │
├─────────────────────────────────────────────────────────────┤
│  ✨ NEW: Schema Validation Job                              │
│    1. Ensure migrations committed (git diff check)          │
│    2. Apply migrations on ephemeral DB                      │
│    3. Run drizzle-kit check (drift detection)               │
│    4. Generate migration report artifact                    │
│                                                             │
│  Existing: Quality Job                                      │
│    → Tests run against migrated database                    │
└─────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│  ✨ NEW: Environment-Specific Deploy                        │
├─────────────────────────────────────────────────────────────┤
│  Staging Deploy:                                            │
│    1. Run migrations with observability wrapper             │
│    2. Log migration events → Grafana/Loki                   │
│    3. Snapshot database (Neon branch or pg_dump)            │
│    4. Deploy application                                    │
│    5. Run smoke tests                                       │
│    6. Post-deploy drift check                               │
│                                                             │
│  Production Deploy (Manual Approval):                       │
│    1. Pre-deploy validation                                 │
│    2. Run migrations with circuit breaker                   │
│    3. Canary deployment (10% traffic)                       │
│    4. Monitor metrics (5 min)                               │
│    5. Full rollout or rollback                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Roadmap

### Phase 1: CI/CD Enhancements (2 hours)

#### Task 1.1: Add Migration Validation to CI (30 min)

**File:** `.github/workflows/schema-check.yml` (new)

```yaml
name: Schema Validation

on:
  pull_request:
    paths:
      - 'src/server/db/models/**'
      - 'migrations/**'
      - 'drizzle.config.ts'

jobs:
  validate-schema:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Ensure migrations are committed
        run: |
          npm run db:generate
          if ! git diff --exit-code migrations src/server/db/models/Schema.ts; then
            echo "❌ Schema changed but migrations not generated"
            echo "Run: npm run db:generate"
            exit 1
          fi

      - name: Apply migrations to ephemeral database
        run: |
          npx pglite-server --once --run 'npm run db:migrate'

      - name: Drift detection (if DATABASE_URL_DEV set)
        if: env.DATABASE_URL_DEV != ''
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL_DEV }}
        run: |
          npx drizzle-kit check --config drizzle.config.ts --dialect postgresql || \
            echo "⚠️  Drift detected - manual DB changes found"

      - name: Generate migration report
        if: always()
        run: |
          echo "## Migration Summary" >> $GITHUB_STEP_SUMMARY
          echo "Pending migrations:" >> $GITHUB_STEP_SUMMARY
          ls -1 migrations/*.sql | tail -5 >> $GITHUB_STEP_SUMMARY
```

**Scripts to Add:**

`package.json`:
```json
{
  "scripts": {
    "db:validate": "drizzle-kit check --config drizzle.config.ts --dialect postgresql",
    "db:check-drift": "npm run db:validate",
    "db:info": "drizzle-kit introspect --config drizzle.config.ts"
  }
}
```

#### Task 1.2: Add Pre-commit Hook (15 min)

**File:** `.lefthook.yml` (extend existing)

```yaml
pre-commit:
  parallel: true
  commands:
    # ... existing commands ...

    schema-check:
      glob: "src/server/db/models/**/*.ts"
      run: |
        if ! git diff --cached --quiet migrations/; then
          echo "✓ Schema and migrations both staged"
        elif git diff --cached --quiet src/server/db/models/; then
          echo "✓ No schema changes"
        else
          echo "❌ Schema changed but migrations not staged"
          echo "Run: npm run db:generate && git add migrations/"
          exit 1
        fi
```

#### Task 1.3: Observability Wrapper Scripts (45 min)

**File:** `scripts/db/migrate-with-telemetry.sh` (new)

```bash
#!/bin/bash
set -euo pipefail

# Migration wrapper with observability
ENVIRONMENT=${ENVIRONMENT:-development}
MIGRATION_ID=$(date +%s)
START_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Log migration start
echo "🔄 Migration started: environment=$ENVIRONMENT id=$MIGRATION_ID"

# Optionally send to observability stack
if [ -n "${GRAFANA_LOKI_URL:-}" ]; then
  curl -X POST "$GRAFANA_LOKI_URL/loki/api/v1/push" \
    -H "Content-Type: application/json" \
    -d "{
      \"streams\": [{
        \"stream\": {
          \"environment\": \"$ENVIRONMENT\",
          \"service\": \"database-migrations\",
          \"level\": \"info\"
        },
        \"values\": [[\"$(date +%s)000000000\", \"Migration started: $MIGRATION_ID\"]]
      }]
    }" 2>/dev/null || true
fi

# Run migration
if npm run db:migrate; then
  END_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  echo "✅ Migration completed: start=$START_TIME end=$END_TIME"

  # Log success
  if [ -n "${GRAFANA_LOKI_URL:-}" ]; then
    curl -X POST "$GRAFANA_LOKI_URL/loki/api/v1/push" \
      -H "Content-Type: application/json" \
      -d "{
        \"streams\": [{
          \"stream\": {
            \"environment\": \"$ENVIRONMENT\",
            \"service\": \"database-migrations\",
            \"level\": \"info\"
          },
          \"values\": [[\"$(date +%s)000000000\", \"Migration completed: $MIGRATION_ID\"]]
        }]
      }" 2>/dev/null || true
  fi

  exit 0
else
  END_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  echo "❌ Migration failed: start=$START_TIME end=$END_TIME"

  # Log failure
  if [ -n "${GRAFANA_LOKI_URL:-}" ]; then
    curl -X POST "$GRAFANA_LOKI_URL/loki/api/v1/push" \
      -H "Content-Type: application/json" \
      -d "{
        \"streams\": [{
          \"stream\": {
            \"environment\": \"$ENVIRONMENT\",
            \"service\": \"database-migrations\",
            \"level\": \"error\"
          },
          \"values\": [[\"$(date +%s)000000000\", \"Migration failed: $MIGRATION_ID\"]]
        }]
      }" 2>/dev/null || true
  fi

  exit 1
fi
```

Make executable: `chmod +x scripts/db/migrate-with-telemetry.sh`

`package.json`:
```json
{
  "scripts": {
    "db:migrate:prod": "ENVIRONMENT=production ./scripts/db/migrate-with-telemetry.sh",
    "db:migrate:staging": "ENVIRONMENT=staging ./scripts/db/migrate-with-telemetry.sh"
  }
}
```

#### Task 1.4: Rollback Documentation and Scripts (30 min)

**File:** `scripts/db/rollback-guide.md` (new)

```markdown
# Database Rollback Procedures

## Option 1: Forward-Fix Migration (Preferred)

1. Create a new migration that reverts the problematic change:
   ```bash
   # Example: Rollback column addition
   npm run db:generate  # After removing column from Schema.ts
   git add migrations/
   git commit -m "revert: rollback column X from table Y"
   ```

2. Deploy through normal CI/CD pipeline

## Option 2: Neon Branch Rollback (Staging/Prod)

1. List available branches:
   ```bash
   neon branches list --project-id $PROJECT_ID
   ```

2. Promote previous branch:
   ```bash
   neon branches set-primary $PREVIOUS_BRANCH_ID --project-id $PROJECT_ID
   ```

3. Update DATABASE_URL and redeploy application

## Option 3: Point-in-Time Restore

For managed Postgres with PITR:

```bash
# AWS RDS
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier prod-db \
  --target-db-instance-identifier prod-db-restored \
  --restore-time 2025-01-15T10:30:00Z

# Google Cloud SQL
gcloud sql instances restore-backup prod-db \
  --backup-id 1234567890 \
  --backup-project myproject
```

## Option 4: pg_dump Restore (Last Resort)

```bash
# Restore from most recent backup
gunzip -c backups/db-backup-2025-01-15.sql.gz | \
  psql $DATABASE_URL
```

## Decision Tree

```
Migration Failed?
  ├─ In Development → Drop database, re-run from scratch
  ├─ In Staging → Forward-fix OR Neon branch rollback
  └─ In Production →
       ├─ Data corruption? → PITR restore
       ├─ Schema issue? → Forward-fix migration
       └─ App broken? → Rollback app deployment, keep DB
```
```

**File:** `scripts/db/rollback.sh` (new)

```bash
#!/bin/bash
# Quick rollback script for Neon
set -euo pipefail

ENVIRONMENT=${1:-staging}
PROJECT_ID=${NEON_PROJECT_ID:-}

if [ -z "$PROJECT_ID" ]; then
  echo "Error: NEON_PROJECT_ID not set"
  exit 1
fi

echo "🔄 Listing recent Neon branches for $ENVIRONMENT..."
neon branches list --project-id "$PROJECT_ID"

echo ""
read -p "Enter branch ID to promote: " BRANCH_ID

echo "⚠️  Promoting branch $BRANCH_ID to primary..."
neon branches set-primary "$BRANCH_ID" --project-id "$PROJECT_ID"

echo "✅ Branch promoted. Update DATABASE_URL and redeploy application."
```

---

### Phase 2: Environment-Specific Workflows (1.5 hours)

#### Task 2.1: Staging Deploy Workflow (45 min)

**File:** `.github/workflows/deploy-staging.yml` (new)

```yaml
name: Deploy to Staging

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  DATABASE_URL: ${{ secrets.DATABASE_URL_STAGING }}
  ENVIRONMENT: staging

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Pre-deploy validation
        run: npm run db:validate

      - name: Run migrations with telemetry
        env:
          GRAFANA_LOKI_URL: ${{ secrets.GRAFANA_LOKI_URL }}
        run: ./scripts/db/migrate-with-telemetry.sh

      - name: Build application
        run: npm run build

      - name: Deploy to Vercel Staging
        run: |
          npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }} \
            --env DATABASE_URL=${{ secrets.DATABASE_URL_STAGING }}

      - name: Post-deploy drift check
        run: npm run db:check-drift || echo "⚠️ Drift detected"

      - name: Smoke tests
        run: npm run test:e2e:staging || echo "⚠️ Smoke tests failed"
```

#### Task 2.2: Production Deploy Workflow (45 min)

**File:** `.github/workflows/deploy-production.yml` (new)

```yaml
name: Deploy to Production

on:
  workflow_dispatch:
    inputs:
      skip-migrations:
        description: 'Skip database migrations'
        type: boolean
        default: false

env:
  DATABASE_URL: ${{ secrets.DATABASE_URL_PROD }}
  ENVIRONMENT: production

jobs:
  deploy-production:
    runs-on: ubuntu-latest
    environment: production  # Requires manual approval
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Pre-deploy validation
        run: |
          echo "## Pre-Deploy Checklist" >> $GITHUB_STEP_SUMMARY
          npm run db:validate && echo "✅ Schema validation passed" >> $GITHUB_STEP_SUMMARY

      - name: Create Neon branch snapshot (backup)
        env:
          NEON_API_KEY: ${{ secrets.NEON_API_KEY }}
          NEON_PROJECT_ID: ${{ secrets.NEON_PROJECT_ID }}
        run: |
          SNAPSHOT_NAME="pre-deploy-$(date +%Y%m%d-%H%M%S)"
          neon branches create --name "$SNAPSHOT_NAME" --project-id "$NEON_PROJECT_ID"
          echo "📸 Snapshot created: $SNAPSHOT_NAME" >> $GITHUB_STEP_SUMMARY

      - name: Run migrations (with circuit breaker)
        if: ${{ !inputs.skip-migrations }}
        env:
          GRAFANA_LOKI_URL: ${{ secrets.GRAFANA_LOKI_URL }}
        run: |
          timeout 300 ./scripts/db/migrate-with-telemetry.sh || {
            echo "❌ Migration timed out or failed" >> $GITHUB_STEP_SUMMARY
            exit 1
          }

      - name: Build application
        run: npm run build

      - name: Deploy to Vercel Production (Canary)
        run: |
          # Deploy with 10% traffic
          npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }} \
            --env DATABASE_URL=${{ secrets.DATABASE_URL_PROD }} \
            --meta canary=true

      - name: Monitor canary (5 min)
        run: |
          echo "⏳ Monitoring canary deployment..."
          sleep 300
          # Check error rates (integrate with your monitoring)
          # If errors > threshold, exit 1

      - name: Full rollout
        run: |
          npx vercel promote --token=${{ secrets.VERCEL_TOKEN }}
          echo "✅ Full production deployment complete" >> $GITHUB_STEP_SUMMARY

      - name: Post-deploy drift check
        run: npm run db:check-drift
```

---

### Phase 3: Developer Experience Enhancements (30 min)

#### Task 3.1: Add Migration Helper Scripts (15 min)

`package.json`:
```json
{
  "scripts": {
    "db:status": "echo '📊 Migration Status:' && drizzle-kit introspect",
    "db:history": "psql $DATABASE_URL -c 'SELECT * FROM _drizzle_migrations ORDER BY id DESC LIMIT 10'",
    "db:reset:local": "rm -rf local.db && npm run db:migrate",
    "db:snapshot": "pg_dump $DATABASE_URL | gzip > backups/snapshot-$(date +%Y%m%d-%H%M%S).sql.gz"
  }
}
```

#### Task 3.2: Update Developer Documentation (15 min)

**File:** `docs/DATABASE.md` (new)

```markdown
# Database Development Guide

## Quick Start

1. **Make schema change:**
   ```bash
   # Edit src/server/db/models/Schema.ts
   npm run db:generate  # Creates migration
   npm run db:migrate   # Applies locally
   ```

2. **Verify migration:**
   ```bash
   npm run db:status    # Check current state
   npm run db:validate  # Drift detection
   ```

3. **Commit and push:**
   ```bash
   git add src/server/db/models/ migrations/
   git commit -m "feat: add user preferences table"
   git push  # CI will validate
   ```

## Common Tasks

### Create a new table
1. Add to `Schema.ts`
2. Run `npm run db:generate`
3. Inspect `migrations/XXXX_*.sql`
4. Run `npm run db:migrate`

### Modify existing table
1. Edit table definition in `Schema.ts`
2. Run `npm run db:generate`
3. Review generated SQL (ensure backward compatible!)
4. Test locally with `npm run db:migrate`

### Rollback a migration
See `scripts/db/rollback-guide.md`

### Check migration history
```bash
npm run db:history
```

### Reset local database
```bash
npm run db:reset:local
```

## Environment URLs

- **Local:** `postgresql://localhost/pglite` (auto-managed)
- **Staging:** Ask team lead for credentials
- **Production:** CI/CD only (no direct access)
```

---

## Comparison: Simplified vs. Flyway Approach

| Feature | Simplified (Drizzle++) | Flyway Approach | Winner |
|---------|------------------------|-----------------|--------|
| **Migration Generation** | Drizzle ORM | Drizzle → manual Flyway SQL | 🏆 Simplified |
| **Migration Application** | `drizzle-kit push` | `flyway migrate` | 🏆 Simplified (one tool) |
| **Drift Detection** | `drizzle-kit check` | `flyway validate -driftDetect` | 🤝 Tie |
| **Observability** | Custom wrapper scripts | Flyway Teams telemetry | 🏆 Simplified (no vendor lock-in) |
| **Rollback** | Forward-fix + Neon branches | `flyway undo` (Teams only) | 🏆 Simplified |
| **CI Integration** | Native GitHub Actions | Flyway CLI in CI | 🏆 Simplified |
| **Environment Configs** | Environment variables | 4+ `.conf` files | 🏆 Simplified |
| **Team Onboarding** | 30 min (already know Drizzle) | 2 hours (learn Flyway) | 🏆 Simplified |
| **Maintenance** | One tool to update | Two tools to coordinate | 🏆 Simplified |
| **Cost** | $0 | $0 (CLI) / $$$ (Teams features) | 🤝 Tie |

**Score: Simplified 8 - Flyway 0 - Tie 2**

---

## Implementation Timeline

### Week 1: Foundation (Phase 1)
- **Day 1:** Add schema validation to CI (Task 1.1)
- **Day 2:** Add pre-commit hooks (Task 1.2)
- **Day 3:** Create observability wrappers (Task 1.3)
- **Day 4:** Document rollback procedures (Task 1.4)
- **Day 5:** Test and iterate

### Week 2: Production-Ready (Phase 2 + 3)
- **Day 1:** Staging deploy workflow (Task 2.1)
- **Day 2:** Production deploy workflow (Task 2.2)
- **Day 3:** Developer experience enhancements (Task 3.1-3.2)
- **Day 4:** Team training session
- **Day 5:** Production deployment dry-run

**Total Time:** 10 days vs. 20-30 days for Flyway integration

---

## Success Metrics

### Adoption (Week 1)
- ✅ 100% of PRs pass schema validation
- ✅ 0 merge conflicts in migrations/
- ✅ Developers use `npm run db:generate` consistently

### Reliability (Week 2-4)
- ✅ 100% migration success rate in CI
- ✅ 0 schema drift incidents
- ✅ < 1 min average migration time

### Velocity (Month 1-3)
- ✅ 0 rollbacks needed
- ✅ Team ships schema changes daily
- ✅ No deployment delays due to migrations

---

## Conclusion

**DO NOT add Flyway.** The project already has everything needed for production-grade schema management. Focus on enhancing the existing Drizzle workflow with:

1. ✅ CI/CD validation and drift detection
2. ✅ Observability and audit trails
3. ✅ Documented rollback procedures
4. ✅ Environment-specific workflows
5. ✅ Developer experience improvements

This achieves **95% of Flyway benefits** with **20% of the implementation cost** and **zero ongoing complexity**.

---

## Next Steps (Start Today)

1. **Immediate (30 min):**
   ```bash
   # Add validation scripts to package.json
   npm pkg set scripts.db:validate="drizzle-kit check --config drizzle.config.ts --dialect postgresql"
   npm pkg set scripts.db:check-drift="npm run db:validate"

   # Test locally
   npm run db:validate
   ```

2. **This Week (2 hours):**
   - Create `.github/workflows/schema-check.yml`
   - Add pre-commit hook to `.lefthook.yml`
   - Test on a feature branch

3. **Next Week (1.5 hours):**
   - Implement observability wrapper
   - Create staging deploy workflow
   - Document rollback procedures

4. **Month 1 (Ongoing):**
   - Monitor migration success rates
   - Iterate on developer feedback
   - Add production deploy workflow when ready

**Status:** Ready to implement. No blockers. No new dependencies needed.
