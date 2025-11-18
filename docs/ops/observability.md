## Observability Runbook

This guide summarizes the minimum production configuration for alerts, dashboards, log retention, and backups.

### 1. Sentry Alerts

1. Create a Sentry project dedicated to this app.
2. Enable `Alert > Issues` and configure:
   - High-priority alert: trigger when error frequency increases by 200% within 5 minutes.
   - Release-regression alert: trigger when a new issue impacts more than 5 users.
3. Add notification rules for the on-call rotation (Slack, email, or PagerDuty).
4. Store `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORGANIZATION`, `SENTRY_PROJECT`, and `SENTRY_AUTH_TOKEN` as production secrets so builds can upload source maps.

### 2. PostHog Dashboards

1. Set `NEXT_PUBLIC_POSTHOG_KEY`/`NEXT_PUBLIC_POSTHOG_HOST` in production.
2. Create dashboards for:
   - Activation funnel (visit → sign up → first key action).
   - API error rate (use the `$pageview` event and custom events you emit).
3. Configure anomaly detection alerts to email on-call when conversion drops or latency spikes.


### 2.1 Monitoring feature flags by environment

Monitoring providers are wired through three feature flags. They are consumed in code via `MonitoringConfig` and injected at build time in `.github/workflows/deploy-cloudflare.yml`.

| Environment              | Sentry (`NEXT_PUBLIC_ENABLE_SENTRY`) | PostHog (`NEXT_PUBLIC_ENABLE_POSTHOG`) | CF Analytics (`NEXT_PUBLIC_ENABLE_CF_ANALYTICS`) | Where to set                                                         |
| ------------------------ | ------------------------------------- | -------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------- |
| **Local dev (`pnpm dev`)**  | `false` (default in `apps/web/.env`)   | `false` (default in `apps/web/.env`)    | `true` but token empty by default               | `apps/web/.env` / `apps/web/.env.local`                              |
| **Staging (Cloudflare)** | `true`                                | `false`                                 | `true`                                         | GitHub **environment/repo vars**: `ENABLE_SENTRY`, `ENABLE_POSTHOG`, `ENABLE_CF_ANALYTICS` |
| **Production (Cloudflare)** | `true`                             | `true`                                  | `true`                                         | Same GitHub vars or Cloudflare Pages **Environment variables**       |

Notes:

- The Cloudflare deploy workflow maps GitHub vars → build-time env:
  - `ENABLE_SENTRY` → `NEXT_PUBLIC_ENABLE_SENTRY`
  - `ENABLE_POSTHOG` → `NEXT_PUBLIC_ENABLE_POSTHOG`
  - `ENABLE_CF_ANALYTICS` → `NEXT_PUBLIC_ENABLE_CF_ANALYTICS`
- For **staging**, a common setup is: `ENABLE_SENTRY=true`, `ENABLE_CF_ANALYTICS=true`, `ENABLE_POSTHOG=false` so you see real errors and traffic without skewing product funnels.
- For **local dev**, `.env` keeps Sentry/PostHog off by default; CF Analytics is effectively off until you supply `NEXT_PUBLIC_CF_ANALYTICS_TOKEN`.

When onboarding a new environment (e.g. another staging stack), define these three `ENABLE_*` variables first so observability behaves as expected from the first deploy.

### 3. Better Stack Logging

1. Create a source in Better Stack and add `NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN` and `NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST`.
2. Define log-based alerts, e.g.:
   - Alert when `level: "error"` logs exceed 20/min.
   - Alert when `"Too many requests"` occurs more than 5 times in 2 minutes (signals Arcjet rate limiting).
3. Set retention policies (e.g., 30 days hot storage, 12 months archive) according to compliance requirements.

### 4. Backups

1. Provide a `BACKUP_DATABASE_URL` secret and enable the scheduled `Database Backup` workflow.
2. Optionally switch `scripts/backup-database.sh` to upload to S3/Azure/GCS by setting `UPLOAD_TO` and supplying the appropriate credentials.
3. Run quarterly restore drills: download the artifact from GitHub Actions, restore into a staging database, and run smoke tests.

### 5. Incident Readiness

1. Document the runbook location for your team.
2. Add dashboards + alerts links to your pager rotation notes.
3. Review Arcjet analytics periodically and adjust the CSP/allowed bot list as your integrations change.
