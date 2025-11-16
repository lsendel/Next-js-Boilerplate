# Environment & Secrets Matrix

Use this checklist whenever you spin up a new environment (local, staging, production, CI). Each variable lists where it must be defined and whether it is safe for the browser (`client`) or must stay server-side/secret.

## Core Application

| Variable | Scope | Where to configure | Notes |
| --- | --- | --- | --- |
| `DATABASE_URL` | Server | Hosting provider + GitHub Actions secrets | Must point to PostgreSQL/PGlite instance; used by Drizzle and migrations. |
| `NEXT_PUBLIC_APP_URL` | Client | Hosting provider | Used for absolute URLs, sitemap, CORS fallback. Optional locally. |
| `NEXT_TELEMETRY_DISABLED` | Server | Optional | Set to `1` in CI to disable Next telemetry. |

## Security (Arcjet)

| Variable | Scope | Where | Notes |
| --- | --- | --- | --- |
| `ARCJET_KEY` | Server/secret | Hosting provider + CI | Obtain from Arcjet dashboard. Required to enable middleware protections. |
| `ARCJET_MODE` | Server | Hosting provider | `LIVE` blocks traffic, `DRY_RUN` logs only. Defaults to `LIVE` in production. |
| `ARCJET_TRUSTED_PROXIES` | Server | Hosting provider | Comma-separated IPs/CIDRs for load balancers so Arcjet reads real client IPs. |
| `ARCJET_ALLOWED_BOTS` | Server | Hosting provider | Comma-separated bot categories permitted through middleware. |
| `ARCJET_API_REFILL_RATE`, `ARCJET_API_INTERVAL`, `ARCJET_API_CAPACITY`, `ARCJET_API_RETRY_AFTER` | Server | Hosting provider | Tune token-bucket limiter for `/api` state-changing routes. |

## Authentication

| Variable | Scope | Where | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_AUTH_PROVIDER` | Client | `.env.local` / hosting | Choose `clerk`, `cloudflare`, or `cognito`. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Client | Hosting + GitHub Actions | Pulled from Clerk dashboard. |
| `CLERK_SECRET_KEY` | Server/secret | Hosting + GitHub Actions secrets | Never expose to client builds. |
| `NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN`, `NEXT_PUBLIC_CLOUDFLARE_AUDIENCE`, `NEXT_PUBLIC_CLOUDFLARE_VERIFY_JWT` | Client | Only when using Cloudflare Access | Configure in Access dashboard. |
| `NEXT_PUBLIC_COGNITO_*` | Client | Only when using AWS Cognito | Region, pools, OAuth domains, etc. |

## Observability & Analytics

| Variable | Scope | Where | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORGANIZATION`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` | Mixed | Hosting + GitHub secrets | Required to upload source maps and capture runtime errors. |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | Client | Hosting | Enable analytics dashboarding if you use PostHog. |
| `NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN`, `NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST` | Client | Hosting | Route LogTape logs to Better Stack. |
| `NEXT_PUBLIC_BETTER_STACK_*` | Client | Hosting | Only set if you forward logs externally. |

## Monitoring & Backups

| Variable | Scope | Where | Notes |
| --- | --- | --- | --- |
| `BACKUP_DATABASE_URL` | Server/secret | GitHub Actions secret | Used by `.github/workflows/backup.yml` for nightly dumps. |
| `CHECKLY_API_KEY`, `CHECKLY_ACCOUNT_ID` | Server/secret | GitHub Actions | Required if you use Checkly monitoring. |

## Tips

- **Local development**: copy `.env` → `.env.local` and override secrets there; `.env.local` is git-ignored.
- **Hosting**: prefer per-environment configs (Preview vs Production) so you can rotate credentials independently.
- **CI**: reuse the same secrets for GitHub Actions. The CI workflow expects `DATABASE_URL`, `ARCJET_KEY`, Clerk keys, and any analytics credentials that run during build/tests.
- **Rotation**: document owners next to each secret in your ops checklist to keep compliance simple.
