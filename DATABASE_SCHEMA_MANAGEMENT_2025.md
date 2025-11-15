# Database Schema Management Playbook (2025)

> **TL;DR**  
> Keep the Postgres schema in `src/server/db/models/Schema.ts`, generate SQL with `drizzle-kit`, test migrations locally through `pglite`, and let CI enforce `generate → diff check → migrate` on every PR. The migration history in `migrations/` plus the `drizzle_migrations` table is the source of truth, and we rely on revert migrations plus database snapshots for recovery.

## Goals

- **Single source of truth** for the relational model with Drizzle ORM.
- **Deterministic migrations** that behave the same on laptops, preview branches, staging, and production.
- **Continuous verification** so schema drift is detected before merge.
- **Traceable history** with the ability to re-run or revert specific changes in minutes.
- **Low-ceremony workflow** to keep shipping velocity high.

## Toolchain & Baseline

| Concern | Recommended Choice | Notes |
| --- | --- | --- |
| Schema authoring | `src/server/db/models/Schema.ts` | Typed, co-located with application models |
| Migration generation | `npm run db:generate` (`drizzle-kit generate`) | Emits SQL into `migrations/` and updates `migrations/meta/_journal.json` |
| Local database | `pglite` (`npm run db-server:file` or `db-server:memory`) | Fast, zero external dependencies |
| Remote databases | Managed Postgres (Neon, Supabase, RDS, etc.) | Use one cluster per environment; prefer Neon branching for instant clones |
| Applying migrations | `npm run db:migrate` (`drizzle-kit push`) | Uses `DATABASE_URL` and the committed SQL |
| Drift detection | `npx drizzle-kit check --config drizzle.config.ts --dialect postgresql` | Fails CI if the runtime schema deviates from committed SQL |
| Rollbacks | Forward-only fixes + provider PITR/branch restore | Generate "undo" migrations and/or promote previous Neon branch |

## Environment Matrix

| Environment | Database URL | Purpose | Migration Command |
| --- | --- | --- | --- |
| Local dev | `DATABASE_URL=postgres://pglite` (in-memory/file) | Iteration, unit tests | `npm run db:migrate` (PGlite starts automatically via `npm run dev`) |
| Preview / PR | Neon branch per PR or Docker Postgres in CI | Run migrations + tests automatically | GH Action step `npm run db:migrate` with secret `DATABASE_URL_PREVIEW` |
| Staging | Long-lived Neon branch `staging` | Pre-prod validation, load tests | Deploy job applies migrations before app rollout |
| Production | Primary Neon branch `main` (PITR enabled) | User-facing traffic | Manual approval step runs migrations, then deploys |

Store secrets in `.env.local` for local work and in GitHub Action secrets for CI:

```
DATABASE_URL_LOCAL=postgresql://localhost:5432/app_local
DATABASE_URL_DEV=${{ secrets.DATABASE_URL_DEV }}
DATABASE_URL_STAGING=${{ secrets.DATABASE_URL_STAGING }}
DATABASE_URL_PROD=${{ secrets.DATABASE_URL_PROD }}
```

## Developer Workflow

1. **Branch** from `main` and pull latest migrations.
2. **Model change** in `src/server/db/models/Schema.ts`.
3. Run `npm run db:generate` to emit a new `migrations/00xx_description.sql`.
4. Run `npm run db:migrate` (with the PGlite server already running) to ensure the SQL applies cleanly.
5. (Optional) Start a disposable Neon branch and run `DATABASE_URL=$(neon branch url)` `npm run db:migrate` to proof-test against real Postgres.
6. Commit both the schema file(s) and the generated SQL (including `migrations/meta/_journal.json`).
7. Push and open the PR. The CI job (below) will fail if migrations are missing or invalid.
8. Once merged, the CD pipeline applies the same migration to staging and production before rolling out the Next.js build.

## CI Integration

Add a lightweight job (`.github/workflows/ci.yml`) next to the existing pipeline:

```yaml
jobs:
  schema:
    runs-on: ubuntu-latest
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL_DEV }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - name: Ensure migrations are committed
        run: |
          npm run db:generate
          git diff --exit-code migrations src/server/db/models/Schema.ts
      - name: Apply migrations on ephemeral Postgres
        run: |
          npx @electric-sql/pglite-server --once --run "npm run db:migrate"
      - name: Detect drift against dev database
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL_DEV }}
        run: npx drizzle-kit check --config drizzle.config.ts --dialect postgresql
      - run: npm run ci:check
```

Key behaviors:

- **`db:generate` + `git diff`** guarantees the SQL stays in lockstep with the TypeScript schema.
- **Applying migrations** inside CI proves they are reversible/forward-only and fail fast if SQL is invalid.
- **`drizzle-kit check`** compares committed migrations with the actual database, catching drift introduced by hotfixes or manual changes.
- Downstream jobs (tests, lint, build) can reuse the prepared database.

## Schema Tracking & Observability

- Every migration has an entry in `migrations/meta/_journal.json`; never edit manually.
- The runtime database keeps the `_drizzle_migrations` table. Inspect it to see what ran:

```sql
SELECT tag, applied_at, checksum
FROM _drizzle_migrations
ORDER BY applied_at DESC;
```

- Enable PITR or hourly snapshots in your managed Postgres (Neon `log_retain` or RDS `backup_retention`) so you can rewind even if migrations are wrong.
- Consider adding a Grafana/Loki panel that alerts when `_drizzle_migrations.tag` differs between staging and production.

## Rollback & Recovery

1. **Logical rollback (preferred):**
   - Create a new migration that reverts the mistake (e.g., re-add column, drop constraint, restore data from a backup table).
   - Run through the same workflow and CI to ensure safety.
2. **Point-in-time restore / branch swap:**
   - For Neon, promote the automatically-created branch from before the migration, or use `neon branches rollback`.
   - For RDS/Cloud SQL, trigger a PITR to a new instance, verify, then switch application traffic.
3. **Disaster drill:**
   - Keep weekly `pg_dump` artifacts in object storage (`scripts/db/backup.sh` if you prefer scripted backups).

Document each rollback in the PR description and reference the migration tag (`0001_multi_tenant_admin`) so the audit trail remains easy to follow.

## Implementation Checklist

- [ ] Adopt the environment variables above and store non-prod URLs as GitHub secrets.
- [ ] Add the schema job to `.github/workflows/ci.yml` (or extend the existing workflow).
- [ ] Educate the team on the developer workflow (10-minute brown bag + update `MIGRATION.md` link to this file).
- [ ] Schedule quarterly drift detection drills (run `drizzle-kit check` against staging and prod manually).
- [ ] Configure managed Postgres PITR/branch snapshots and document the restore process in `DEPLOYMENT_GUIDE.md`.

Following this playbook gives us schema tracking, automated CI enforcement, and a rollback story that aligns with 2025 platform standards without adding heavy, bespoke tooling.
