# 🚀 Cloudflare Migration Guide

This guide will help you migrate your Next.js boilerplate from Vercel to Cloudflare Pages with D1 database.

## 📋 Prerequisites

- [x] Cloudflare account (free tier works)
- [x] Wrangler CLI installed (`pnpm add -D wrangler`)
- [x] @opennextjs/cloudflare adapter installed
- [x] Basic understanding of Cloudflare Workers

## 🎯 Migration Overview

**What's changing:**
- **Hosting:** Vercel → Cloudflare Pages + Workers
- **Database:** PostgreSQL (Neon) → Cloudflare D1 (SQLite)
- **Auth:** Keeping Cloudflare Access ✅
- **Monitoring:** Configurable Sentry + PostHog + Cloudflare Analytics

**What's staying the same:**
- Next.js 16 with App Router
- React 19
- Drizzle ORM
- TypeScript + Tailwind CSS
- All existing features

---

## 📝 Step-by-Step Migration

### Step 1: Create Cloudflare D1 Database

```bash
# Create D1 database (from the monorepo root)
pnpm --filter web d1:create

# This will output something like:
# ✅ Successfully created DB 'next-boilerplate-db'
# 📋 Database ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Copy the Database ID** and update `apps/web/wrangler.jsonc`:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "next-boilerplate-db",
      "database_id": "YOUR_DATABASE_ID_HERE",  // ← Paste here
      "migrations_dir": "./migrations-d1"
    }
  ]
}
```

---

### Step 2: Database Schema Layout (Postgres + D1)

This boilerplate already ships with **two Drizzle schemas**:

- `apps/web/src/server/db/models/Schema.ts` → PostgreSQL schema used for local dev & tests (via PGlite/Postgres driver).
- `apps/web/src/server/db/models/SchemaD1.ts` → SQLite-compatible schema used for **Cloudflare D1** in production.

You generally **do not need to hand-convert** the schema yourself. Instead:

- Make relational model changes in both `Schema.ts` (Postgres) and `SchemaD1.ts` (D1).
- Keep types and columns aligned, but use D1-friendly types in `SchemaD1.ts` (e.g. `sqliteTable`, `integer({ mode: 'timestamp' })`).

**Key differences to keep in mind when editing `SchemaD1.ts`:**
- `pgTable` → `sqliteTable`
- `serial` → `integer().primaryKey({ autoIncrement: true })`
- `timestamp` → `integer({ mode: 'timestamp' })`
- PostgreSQL-only features (JSONB, arrays, advanced indexes) need SQLite-friendly alternatives

---

### Step 3: Generate and Apply D1 Migrations

D1 migrations live under `apps/web/migrations-d1` and are driven by `drizzle.config.d1.ts`.

From the **monorepo root**:

```bash
# Generate D1 migration SQL from SchemaD1.ts
pnpm --filter web db:d1:generate

# Apply migrations to your local D1 database
pnpm --filter web d1:migrate

# Test locally on the Cloudflare runtime
pnpm --filter web cf:preview
```

---

### Step 4: Database Connection (Unified API)

The project already exposes a **single DB entrypoint** that chooses the right backend at runtime:

- `apps/web/src/server/lib/d1-connection.ts` – creates a Drizzle instance for D1 using `SchemaD1.ts`.
- `apps/web/src/server/lib/db-connection.ts` – creates a Postgres/PGlite Drizzle instance using `Schema.ts`.
- `apps/web/src/server/db/DB.ts` – unified `db` that switches between D1 and Postgres depending on the environment.
- `apps/web/src/libs/DB.ts` – re-exports `db` for use across the app.

In simplified form:

```ts
// apps/web/src/server/db/DB.ts
const isD1Environment = () => {
  const env = (globalThis as any).env;
  return !!env?.DB;
};
```

- In **Cloudflare Workers** (Pages), `env.DB` is injected, so `db` uses D1 via `createD1Connection(env.DB)`.
- In **local dev / tests**, `env.DB` is absent, so `db` falls back to `createDbConnection()` (PGlite/Postgres).

You can import the unified DB anywhere in server code:

```ts
import { db } from '@/libs/DB';
```

No additional changes are required to “wire up” D1 – the boilerplate has already done this for you.

---

### Step 5: Configure Monitoring (Optional but Recommended)

Enable/disable monitoring services via environment variables:

```bash
# .env.local (not tracked by Git)
NEXT_PUBLIC_ENABLE_SENTRY=true
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

NEXT_PUBLIC_ENABLE_POSTHOG=true
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key

NEXT_PUBLIC_ENABLE_CF_ANALYTICS=true
NEXT_PUBLIC_CF_ANALYTICS_TOKEN=your_cloudflare_analytics_token
```

**Usage in code:**

```typescript
import { isServiceEnabled, trackEvent } from '@/utils/MonitoringConfig';

// Check if service is enabled
if (isServiceEnabled('sentry')) {
  // Initialize Sentry
}

// Track events across all enabled services
trackEvent({
  name: 'user_signup',
  properties: { plan: 'pro' },
});
```

---

### Step 6: Test D1 + Worker runtime locally with Wrangler

```bash
# Build and preview with Cloudflare Workers runtime
pnpm cf:preview

# This will:
# 1. Build your Next.js app with OpenNext adapter
# 2. Start local Cloudflare Workers dev server
# 3. Open http://localhost:8788
```

**Test checklist (D1 + Worker):**
- [ ] Homepage loads (`/`)
- [ ] Marketing pages load (`/landing`, `/pricing`, etc.)
- [ ] Authentication works (Cloudflare Access)
- [ ] D1 migrations are applied (no "no such table" errors in logs)
- [ ] Tenant lookups work (if using multi-tenant slugs or domains)
- [ ] API routes respond as expected
- [ ] Static assets load
- [ ] Monitoring tracks events (if enabled)

---

### Step 7: Deploy to Cloudflare Pages

```bash
# Deploy to production
pnpm cf:deploy

# This will:
# 1. Build your app with OpenNext
# 2. Deploy to Cloudflare Pages
# 3. Apply D1 migrations to production
```

**First-time setup:**

```bash
# Login to Cloudflare
npx wrangler login

# Deploy
pnpm cf:deploy
```

---

### Step 8: Configure Custom Domain (Optional)

1. Go to Cloudflare Dashboard → Pages → your-project
2. Click "Custom domains"
3. Add your domain
4. Update DNS records (automatic if domain is on Cloudflare)

Update `apps/web/wrangler.jsonc`:

```jsonc
{
  "routes": [
    {
      "pattern": "yourdomain.com/*",
      "custom_domain": true
    }
  ]
}
```

---

### Step 9: Multi-Environment (dev/stage/prod) with Wrangler

For real projects, you'll often have multiple long-lived environments (for example the matrix in `docs/CI_ENVIRONMENTS.md`):

- `dev` → e.g. `environment-dev.1pet.com`
- `stage` → e.g. `environment-stage.1pet.com` or `stg.1pet.me`
- `prod` → e.g. `environment.1pet.com`

Wrangler supports per-environment configuration via the `env` block in `apps/web/wrangler.jsonc`.

**Example (staging environment):**

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "next-boilerplate-db",
      "database_id": "YOUR_D1_DATABASE_ID",
      "migrations_dir": "./migrations-d1"
    }
  ],
  "env": {
    "stage": {
      "d1_databases": [
        {
          "binding": "DB",
          "database_name": "next-boilerplate-db-stage",
          "database_id": "YOUR_STAGE_D1_DATABASE_ID",
          "migrations_dir": "./migrations-d1"
        }
      ],
      "routes": [
        {
          "pattern": "stg.1pet.me/*",
          "custom_domain": true
        }
      ]
    }
  }
}
```

With this in place, you can run migrations against each environment's D1 database:

```bash
# Local dev D1 (if you use a local D1 instance)
pnpm --filter web d1:migrate

# Staging D1
yarn --filter web d1:migrate:stage   # or pnpm/npm, depending on your PM

# Production D1 (used by main / prod Pages project)
pnpm --filter web d1:migrate:prod
```

> Adjust the `env` key (`stage`), `database_name`, `database_id`, and `pattern` to match your actual Cloudflare setup. The example here uses `stg.1pet.me` as a staging custom domain.

---
## 🧰 Common Runbooks (Cloudflare-first)

### 1. Create a New Environment (e.g. `stage`)

1. Create or configure a new D1 database in the Cloudflare dashboard.
2. Add a new `env.<name>` block in `apps/web/wrangler.jsonc` with:
   - A D1 binding named `DB`
   - `database_name` + `database_id` for that environment
   - Optional `routes` if you use a custom domain (e.g. `stg.1pet.me/*`).
3. Add or update environment variables in Cloudflare Pages for that project
   (`ARCJET_ENV`, monitoring flags, etc.).
4. Run D1 migrations for the new environment:
   ```bash
   pnpm --filter web d1:migrate:<name>
   ```

### 2. Rotate D1 Credentials / Database

1. Create a new D1 database in Cloudflare.
2. Update the corresponding `database_id` (and name if needed) in `apps/web/wrangler.jsonc`.
3. Apply migrations to the new database:
   ```bash
   pnpm --filter web d1:migrate:<env>
   ```
4. Deploy via Cloudflare:
   ```bash
   pnpm cf:deploy
   ```
5. After verifying traffic and data are correct, decommission the old D1 database.

### 3. Temporarily Disable Monitoring

Use the feature flags to disable Sentry/PostHog/Cloudflare Analytics without code changes:

```bash
# In Cloudflare Pages project settings (environment variables)
NEXT_PUBLIC_ENABLE_SENTRY=false
NEXT_PUBLIC_ENABLE_POSTHOG=false
NEXT_PUBLIC_ENABLE_CF_ANALYTICS=false
```

Deploy a new build; the monitoring providers will no longer initialize but the code paths remain intact.

---




---

## 🔧 Troubleshooting

### Issue: "D1 database binding not found"

**Solution:** Make sure `wrangler.jsonc` has correct D1 configuration and you're running with `pnpm cf:preview` (not `pnpm dev`).

### Issue: "Module not found: Can't resolve 'pg'"

**Solution:** Remove any **Neon-specific** PostgreSQL clients (for example `@neondatabase/serverless`) and stale imports that point at your old Neon setup. This boilerplate still uses `pg` + PGlite for local development and Node-based builds, so you should **keep the `pg` dependency** unless you intentionally drop the Postgres dev path.

### Issue: Middleware errors in production

**Solution:** Ensure middleware is edge-compatible. Remove Node.js-specific APIs (fs, crypto, etc.). Use Web APIs instead.

### Issue: Database queries fail

**Solution:** Check SQL syntax differences between PostgreSQL and SQLite:
- PostgreSQL: `RETURNING *` → SQLite: `RETURNING *` (supported in D1)
- PostgreSQL: `SERIAL` → SQLite: `INTEGER PRIMARY KEY AUTOINCREMENT`
- PostgreSQL: `JSONB` → SQLite: `TEXT` (store as JSON string)

---

## 📊 Performance Comparison

| Metric | Vercel | Cloudflare Pages |
|--------|--------|------------------|
| **Global Edge Locations** | 100+ | 300+ |
| **Cold Start** | ~200ms | ~50ms |
| **Database Latency** | 50-200ms (Neon) | <10ms (D1 at edge) |
| **Free Tier Requests** | 100GB bandwidth | Unlimited requests |
| **Free Tier Database** | 0.5GB (Neon) | 5GB (D1) |
| **Cost (100k req/month)** | $20-40 | $0-5 |

---

## ✅ Post-Migration Checklist

- [ ] D1 database created and configured
- [ ] Schema converted to SQLite
- [ ] Migrations applied to D1
- [ ] Local testing passed (`pnpm cf:preview`)
- [ ] Monitoring configured (Sentry, PostHog, CF Analytics)
- [ ] Deployed to Cloudflare Pages
- [ ] Custom domain configured (if applicable)
- [ ] DNS updated
- [ ] SSL certificate active
- [ ] Old Vercel deployment archived

---

## 🎉 You're Done!

Your Next.js app is now running on Cloudflare's global edge network with:
- ⚡ **50ms cold starts** (vs 200ms on Vercel)
- 🌍 **300+ edge locations** worldwide
- 💾 **D1 database** at the edge (sub-10ms queries)
- 🔐 **Cloudflare Access** authentication
- 📊 **Configurable monitoring** (Sentry + PostHog + CF Analytics)
- 💰 **Lower costs** (free tier covers most projects)

**Next steps:**
- Monitor performance in Cloudflare Dashboard
- Set up alerts for errors/downtime
- Optimize bundle size with `pnpm build-stats`
- Enable Cloudflare WAF for security

Need help? Check the [Cloudflare Docs](https://developers.cloudflare.com/pages/) or open an issue.

