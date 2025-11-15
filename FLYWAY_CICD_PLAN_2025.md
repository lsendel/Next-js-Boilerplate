# Flyway-Integrated CI/CD Plan (2025)

> **Objective:** introduce Flyway into the existing CI/CD workflow so that every environment (local → preview → staging → production) applies and validates schema changes exactly once, with automated guardrails that match 2025 best practices for regulated cloud deployments.

---

## Guiding Principles

- **Git as Source of Truth** – migrations (`migrations/flyway/V###__*.sql` + repeatable scripts) live in this repo; no out-of-band DDL.
- **Shift-Left Verification** – Flyway `validate`, `info`, and smoke migrations run in PR CI before any application tests.
- **Environment Parity** – each environment has its own database URL, credentials, and Flyway config, but executes the same automation steps.
- **Policy as Code** – GitHub Actions enforce branch policies, approval gates, and deployment order (dev → staging → prod).
- **Observability & Auditability** – Flyway telemetry events forward to the central observability stack; drift or checksum mismatches create PagerDuty alerts.
- **Zero-Downtime Bias** – mandate additive migrations first, feature-flagged rollouts, and delayed destructive changes.

---

## Pipeline Overview

```
Feature Branch → PR CI (Flyway validate + migrate on ephemeral DB)
  └─> Merge to main → Dev Deploy (auto) → Staging (auto with approval) → Prod (manual approval)
           │              │                        │                        │
           ▼              ▼                        ▼                        ▼
      flyway info   flyway migrate            flyway migrate            flyway migrate
      drift check   smoke tests               integration tests         canary rollout
```

Key automation building blocks:

| Stage | Action | Command | Notes |
| --- | --- | --- | --- |
| Pre-commit | Ensure migrations exist | `npm run db:generate && npx flyway validate -configFiles=flyway.dev.conf` | Fails if Drizzle schema and Flyway SQL diverge |
| PR CI | Ephemeral DB migration | `flyway migrate -configFiles=flyway.ci.conf -cleanDisabled=true` | Runs against short-lived Neon branch / Docker Postgres |
| Merge to `main` | Dev deploy | `flyway migrate -env=dev` inside deployment job before `npm run deploy:dev` | Block app rollout if migrations fail |
| Promotion | Staging/Prod | `flyway info` → `flyway migrate -baselineOnMigrate=true` | Adds approval + change ticket requirement |
| Post-deploy | Drift detection | `flyway validate -driftDetect=true` | Alerts if manual DB changes occur |

Recommended config artifacts (checked in):

- `flyway.dev.conf`, `flyway.ci.conf`, `flyway.staging.conf`, `flyway.prod.conf`
- `flyway.env.template` – documents required env vars (`FLYWAY_URL`, `FLYWAY_USER`, etc.)
- `scripts/flyway/migrate.sh` – thin wrapper that injects secrets from CI/CD.

---

## Environment Plans

### 1. Local Development (Feature Branches)

| Concern | Plan |
| --- | --- |
| Schema authoring | Continue modeling with Drizzle; every schema change generates SQL in `migrations/flyway/V###__*.sql`. |
| Tooling | Install Flyway CLI via `npm run tools:install` (wrapper downloads platform binary into `node_modules/.bin`). |
| Workflow | `npm run db:generate` → `npx flyway validate -configFiles=flyway.dev.conf` → `npx flyway migrate`. Uses local PGlite or Docker Postgres seeded from `.env.local`. |
| Safety | `flyway.cleanDisabled=true`; destructive operations require `--clean` flag + feature flag + peer review. |
| Testing | Developers can run `npm run test:db` to execute integration tests against the migrated database. |
| Observability | Local migrations emit logs only; telemetry disabled to avoid noise. |

**Local Checklist**

1. Sync with `main` and install deps (`npm ci`).
2. Run `npm run db:generate` and ensure new files land under `migrations/flyway/`.
3. `npx flyway info -configFiles=flyway.dev.conf` to confirm pending migrations.
4. `npx flyway migrate -configFiles=flyway.dev.conf`.
5. Run unit/integration tests.
6. Commit schema + migration SQL + updated `_journal.json`.

### 2. PR / Preview Environments

| Concern | Plan |
| --- | --- |
| Trigger | Every Pull Request to `main`. |
| Infrastructure | GitHub Actions job spawns ephemeral Postgres (Docker) or Neon branch per PR. |
| Flyway Steps | `flyway validate` → `flyway migrate` → `flyway info`. Repeatable migrations re-run each time. |
| Drift Gate | `flyway validate -driftDetect=true` compares the PR migrations to the dev database snapshot; fails fast if drift appears. |
| Secrets | `FLYWAY_URL_PR`, `FLYWAY_USER_PR`, `FLYWAY_PASSWORD_PR` stored in GH environment `preview`. |
| Preview App | After Flyway migration succeeds, `npm run deploy:preview` runs with the ephemeral database URL injected. |
| Reporting | Publish Flyway HTML reports (checksum status, pending migrations) as workflow artifacts for reviewers. |

**GitHub Actions Snippet**

```yaml
- name: Flyway (PR)
  env:
    FLYWAY_URL: ${{ steps.db.outputs.url }}
    FLYWAY_USER: flyway
    FLYWAY_PASSWORD: ${{ secrets.PREVIEW_DB_PASSWORD }}
  run: |
    npx flyway -configFiles=flyway.ci.conf validate
    npx flyway -configFiles=flyway.ci.conf migrate
    npx flyway -configFiles=flyway.ci.conf info
```

### 3. Staging

| Concern | Plan |
| --- | --- |
| Trigger | Merge to `main` or manual promotion from a release tag. |
| Deployment Order | `flyway migrate` runs before the Next.js build is rolled out to staging infrastructure. |
| Zero-Downtime Guard | Use `flyway.placeholders` for dual-write columns/feature flags; require backward-compatible migrations only. |
| Data | Staging DB refreshes nightly from sanitized production snapshots; Flyway baseline re-applied post-refresh. |
| Approvals | Require 1 reviewer + QA sign-off via GitHub Environments with protection rules. |
| Validation | After migrate, run `flyway info` + automated integration tests + synthetic monitoring. Any drift triggers Slack/PagerDuty. |
| Rollback | `flyway undo` is disabled; instead, rely on forward-fix migrations or Neon branch rollback script `scripts/flyway/rollback-staging.sh`. |

**Promotion Flow**

1. `flyway validate -configFiles=flyway.staging.conf`.
2. `flyway migrate -configFiles=flyway.staging.conf -token=stg-approval`.
3. Application deploy (staging).
4. `flyway info` + integration tests + contract tests.
5. Automatically create release candidate notes referencing Flyway `schema_version`. 

### 4. Production

| Concern | Plan |
| --- | --- |
| Trigger | Manual approval via GitHub `production` environment after staging green. |
| Observability | Enable Flyway Teams telemetry & Webhook integration to ship events (start, success, failure) into Grafana/Loki for auditing. |
| Safety Nets | PITR enabled on managed Postgres; `flyway.outputType=json` piped into `scripts/flyway/checks.ts` to validate for long-running locks, blocking DDL, or column drops. |
| Deployment Pattern | `flyway migrate` with `-baselineOnMigrate=true` (for new clusters) followed by canary deploy (10%) → monitor → full rollout. |
| Runbook | If migrate fails, automatically halt CD, page on-call, and run `scripts/flyway/rollback-prod.sh` which promotes previous Neon branch / restores from PITR. |
| Compliance | Capture Flyway reports + Git commit SHAs + ticket numbers, store in `s3://compliance-audit/flyway/YYYY/MM/DD`. |
| Secrets | Pulled from your secret manager (1Password Connect, AWS Secrets Manager) via GitHub OIDC; no long-lived passwords in CI. |

**Prod Deployment Sequence**

1. `flyway validate -configFiles=flyway.prod.conf -driftDetect=true`.
2. `flyway migrate -configFiles=flyway.prod.conf -cleanDisabled=true -skipExecutingMigrations=false`.
3. `flyway info` + `flyway history` artifact upload.
4. Canary deploy + progressive traffic shift using feature flags.
5. Close the change request automatically if metrics stay healthy for 30 minutes.

---

## Best-Practice Enhancements (2025)

- **Automated Change Windows:** encode blackout windows in GitHub Environment rules so Flyway migrations cannot run during restricted hours.
- **Static Analysis:** run `sqlfluff` + `npm run lint:migrations` against Flyway scripts for style and index coverage before PR merge.
- **Data Quality Tests:** integrate tools like dbt tests or pgTAP to run right after `flyway migrate` in staging/prod to validate data invariants.
- **Secrets Rotation:** rotate Flyway database users quarterly; credentials flow from Secrets Manager → GitHub OIDC → short-lived tokens.
- **Config Drift ChatOps:** `/flyway info prod` Slack command executes read-only Flyway info via GitHub Actions workflow dispatch for SRE visibility.
- **Disaster Drills:** quarterly exercise that restores production DB to staging using Flyway baselines, ensuring runbooks stay fresh.

---

## Next Steps

1. Add Flyway CLI as a dev dependency (`npm install --save-dev @flyway/cli` or wrapper script) and scaffold the `migrations/flyway/` folder.
2. Create environment-specific config files and reference them in GitHub Actions + deployment scripts.
3. Update developer onboarding docs to include the Local Development checklist above.
4. Extend `.github/workflows/ci.yml` and deployment workflows with the snippets in this guide.
5. Configure observability integrations (Grafana, PagerDuty, Slack) for Flyway events and drift alerts.

Following this plan ensures Flyway-enforced schema governance across every stage of the pipeline, with auditable, zero-drift migrations that align with 2025 CI/CD and compliance expectations.
