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
# Create D1 database
pnpm d1:create

# This will output:
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
      "migrations_dir": "./migrations"
    }
  ]
}
```

---

### Step 2: Convert Database Schema for D1

D1 uses SQLite instead of PostgreSQL. You need to convert your Drizzle schema.

**Current schema** (`apps/web/src/models/Schema.ts`):
```typescript
// PostgreSQL-specific types
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
```

**New D1 schema:**
```typescript
// SQLite-compatible types
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const counterSchema = sqliteTable('counter', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: integer('value').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
```

**Key differences:**
- `pgTable` → `sqliteTable`
- `serial` → `integer().primaryKey({ autoIncrement: true })`
- `timestamp` → `integer({ mode: 'timestamp' })`
- PostgreSQL-specific features (JSONB, arrays) need alternatives

---

### Step 3: Generate and Apply D1 Migrations

```bash
# Generate migration from schema
pnpm db:generate

# Apply migration to local D1
pnpm d1:migrate

# Test locally
pnpm cf:preview
```

---

### Step 4: Update Database Connection for D1

Create `apps/web/src/utils/D1Connection.ts`:

```typescript
import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';
import * as schema from '@/models/Schema';

export function getD1Database(d1: D1Database) {
  return drizzle(d1, { schema });
}

// For use in Server Components and API Routes
export async function getDB() {
  // Access D1 binding from Cloudflare env
  const env = (globalThis as any).env;
  if (!env?.DB) {
    throw new Error('D1 database binding not found');
  }
  return getD1Database(env.DB);
}
```

Update `apps/web/src/libs/DB.ts`:

```typescript
import { getDB } from '@/utils/D1Connection';

// Use D1 in production, PGlite in development
export const db = process.env.NODE_ENV === 'production' 
  ? await getDB()
  : /* existing PGlite setup */;
```

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

### Step 6: Test Locally with Wrangler

```bash
# Build and preview with Cloudflare Workers runtime
pnpm cf:preview

# This will:
# 1. Build your Next.js app with OpenNext adapter
# 2. Start local Cloudflare Workers dev server
# 3. Open http://localhost:8788
```

**Test checklist:**
- [ ] Homepage loads
- [ ] Authentication works (Cloudflare Access)
- [ ] Database queries work
- [ ] API routes respond
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

## 🔧 Troubleshooting

### Issue: "D1 database binding not found"

**Solution:** Make sure `wrangler.jsonc` has correct D1 configuration and you're running with `pnpm cf:preview` (not `pnpm dev`).

### Issue: "Module not found: Can't resolve 'pg'"

**Solution:** Remove PostgreSQL-specific dependencies. D1 uses SQLite, no need for `pg` or `@neondatabase/serverless`.

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

