# CI & Workflow Monitoring Guide

Follow these steps whenever you change `.github/workflows/ci.yml` or `.github/workflows/backup.yml`, or when you bring a new infrastructure engineer onto the project.

## 1. Local dry runs

1. Install [act](https://github.com/nektos/act) or an equivalent GitHub Actions runner emulator.
2. Run `act -j quality` to execute the `CI` workflow. Provide mock secrets via `--secret-file` (at least `DATABASE_URL` and `ARCJET_KEY`).
3. For the backup workflow, run `act workflow_dispatch -W .github/workflows/backup.yml -s BACKUP_DATABASE_URL=...`.
4. Confirm:
   - `pg_isready` inside the integration setup succeeds (PGlite fires up, port 5432 accessible).
   - Redis service is reachable (`redis-cli ping`).
   - Playwright installs browsers once and reuses cache.

## 2. First-run validation in GitHub

1. Merge a PR and watch the first few CI builds. Verify each step (lint, type-check, tests, build, e2e) stays under the timeout budget.
2. Inspect uploaded artifacts for Playwright traces or coverage if the workflow produces them.
3. Check the `Database Backup` scheduled run the next morning: ensure an artifact named `database-backup-<run_id>` exists and contains gzipped SQL dumps.

## 3. Monitoring & alerts

1. Enable GitHub notification rules or Slack webhooks for failed workflows (CI and Backup) so the team hears about regressions.
2. Add dashboards (GitHub Insights or a third-party monitor) tracking workflow success rate/median duration.
3. For backups, periodically download an artifact, restore it into staging, and run smoke tests—document the process in your incident response playbook.

## 4. Troubleshooting checklist

- **PGlite errors**: confirm no other process binds to 5432. Override the port via `PGLITE_PORT` if needed.
- **Redis failures**: the CI service uses Docker; if tests require persistence, adjust `redis_cli` commands in `tests/integration/setup.ts`.
- **Secrets missing**: GitHub Actions logs will show `process.env.*` errors. Cross-check against `docs/ops/environment-variables.md`.
- **Long Playwright installs**: cache the `.cache/ms-playwright` directory using `actions/setup-node`’s cache or a custom step if builds become slow.
