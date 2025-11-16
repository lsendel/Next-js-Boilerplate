# Database Development Guide

> Quick reference for database development with Drizzle ORM and schema deployment lifecycle.

---

## Quick Start

### 1. Make a Schema Change

```bash
# Edit the schema file
vim src/server/db/models/Schema.ts
```

### 2. Generate Migration

```bash
npm run db:generate
```

This creates a new SQL file in `migrations/XXXX_description.sql` and updates `migrations/meta/_journal.json`.

### 3. Apply Migration Locally

```bash
npm run db:migrate
```

Your local PGlite database is automatically updated.

### 4. Verify the Change

```bash
# Check migration status
npm run db:status

# View recent migrations
npm run db:history

# Check for drift
npm run db:validate
```

### 5. Commit and Push

```bash
git add src/server/db/models/ migrations/
git commit -m "feat(db): add user preferences table"
git push
```

The pre-commit hook validates that migrations are included, and CI validates the schema on every PR.

---

## Available Commands

### Core Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run db:generate` | Generate migration from schema | After editing Schema.ts |
| `npm run db:migrate` | Apply migrations | To update local database |
| `npm run db:studio` | Open Drizzle Studio | Visual database browser |

### Validation & Status

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run db:validate` | Check for schema drift | Before committing |
| `npm run db:check-drift` | Alias for validate | Same as above |
| `npm run db:status` | Show migration status | Check current state |
| `npm run db:info` | Introspect database | Debugging |
| `npm run db:history` | View last 10 migrations | Review history |

### Utilities

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run db:reset:local` | Wipe and re-migrate | Start fresh locally |
| `npm run db:snapshot` | Create backup | Before risky changes |

### Production Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run db:migrate:staging` | Migrate with telemetry | Staging deployment |
| `npm run db:migrate:prod` | Migrate with telemetry + alerts | Production deployment |

---

## Common Tasks

### Create a New Table

1. **Define the table in Schema.ts:**

```typescript
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const userPreferences = pgTable('user_preferences', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  theme: varchar('theme', { length: 20 }).default('light'),
  language: varchar('language', { length: 10 }).default('en'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

2. **Generate migration:**

```bash
npm run db:generate
# Output: Created migrations/0003_create_user_preferences.sql
```

3. **Review the SQL:**

```bash
cat migrations/0003_*.sql
```

4. **Apply locally:**

```bash
npm run db:migrate
```

5. **Verify:**

```bash
npm run db:status
# Should show new migration applied
```

---

### Modify an Existing Table

**Example: Add a column**

1. **Edit Schema.ts:**

```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  // Add new column
  displayName: varchar('display_name', { length: 100 }),
});
```

2. **Generate migration:**

```bash
npm run db:generate
```

3. **IMPORTANT: Review the generated SQL**

```bash
cat migrations/0004_*.sql
# Ensure it's backward compatible (column should be nullable!)
```

4. **Test locally:**

```bash
npm run db:migrate
npm run test:integration
```

5. **Commit:**

```bash
git add src/server/db/models/ migrations/
git commit -m "feat(db): add display_name to users"
```

---

### Rollback a Migration

**See:** `scripts/db/ROLLBACK_GUIDE.md` for comprehensive guide.

**Quick rollback (forward-fix):**

1. **Revert the schema change:**

```bash
# Edit Schema.ts to remove the problematic change
vim src/server/db/models/Schema.ts
```

2. **Generate reverse migration:**

```bash
npm run db:generate
```

3. **Test and deploy:**

```bash
npm run db:migrate
npm run test
git commit -m "revert: rollback migration XXXX"
```

---

### Check Migration History

```bash
# Last 10 migrations
npm run db:history

# All migrations (file list)
ls -lt migrations/*.sql
```

---

### Reset Local Database

```bash
# Completely wipe and re-migrate
npm run db:reset:local

# Manually
rm -rf local.db
npm run db:migrate
```

---

## Schema Best Practices

### 1. Always Use Additive Changes First

**Bad:**
```typescript
// Week 1: Remove old column immediately
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  // oldColumn removed - breaks existing code!
  newColumn: varchar('new_column'),
});
```

**Good:**
```typescript
// Week 1: Add new column (nullable)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  oldColumn: varchar('old_column'), // Keep for now
  newColumn: varchar('new_column'), // Add as nullable
});

// Week 2: Deploy code that uses newColumn
// Week 3: Backfill data from oldColumn to newColumn
// Week 4: Remove oldColumn
```

### 2. Make Columns Nullable Initially

```typescript
// Safe: Nullable column can be added without affecting existing rows
newColumn: varchar('new_column', { length: 100 }),

// Risky: NOT NULL requires default or backfill
newColumn: varchar('new_column', { length: 100 }).notNull().default(''),
```

### 3. Add Indexes for Foreign Keys

```typescript
export const userPreferences = pgTable('user_preferences', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
}, (table) => ({
  // Add index for foreign key
  userIdIdx: index('user_preferences_user_id_idx').on(table.userId),
}));
```

### 4. Use Timestamps

```typescript
createdAt: timestamp('created_at').defaultNow().notNull(),
updatedAt: timestamp('updated_at').defaultNow().notNull(),
```

### 5. Name Tables and Columns Consistently

- Tables: `snake_case`, plural (e.g., `user_preferences`)
- Columns: `snake_case` (e.g., `created_at`)
- Indexes: `{table}_{column}_idx` (e.g., `users_email_idx`)
- Foreign keys: `{table}_{referenced_table}_fk`

---

## Development Workflow

### Local Development

```bash
# 1. Start dev server (PGlite auto-starts)
npm run dev

# 2. Make schema changes
vim src/server/db/models/Schema.ts

# 3. Generate migration
npm run db:generate

# 4. Migration auto-applies on next request
# Or manually apply:
npm run db:migrate

# 5. Test your changes
npm run test:integration
```

### Pull Request Workflow

```bash
# 1. Create feature branch
git checkout -b feature/add-preferences

# 2. Make schema changes + generate migrations
npm run db:generate

# 3. Commit (pre-commit hook validates)
git add src/server/db/models/ migrations/
git commit -m "feat(db): add user preferences"

# 4. Push (CI validates)
git push origin feature/add-preferences

# 5. CI checks:
# - ✅ Migrations committed with schema changes
# - ✅ Migrations apply cleanly to ephemeral DB
# - ✅ No drift detected
# - ✅ All tests pass
```

### Deployment Workflow

```bash
# 1. Merge PR to main
# → Triggers automatic staging deployment

# 2. Staging deployment:
# - Runs migrations with telemetry
# - Deploys application
# - Runs smoke tests
# - Checks for drift

# 3. Manual production deployment:
# - Go to GitHub Actions
# - Run "Deploy to Production" workflow
# - Requires approval
# - Creates pre-deploy snapshot
# - Runs migrations (5min timeout)
# - Canary deployment (10% traffic)
# - Monitors for 5 minutes
# - Full rollout if healthy
```

---

## Troubleshooting

### Migration Failed in CI

**Error:** "Schema changed but migrations not generated"

**Fix:**
```bash
npm run db:generate
git add migrations/
git commit --amend --no-edit
git push --force-with-lease
```

### Pre-commit Hook Blocking

**Error:** "Schema changed but migrations not staged"

**Fix:**
```bash
npm run db:generate
git add migrations/
git commit
```

**Or bypass (not recommended):**
```bash
git commit --no-verify
```

### Drift Detected

**Error:** "Drift detected - manual DB changes found"

**Fix:**
1. Identify the manual change
2. Create forward-fix migration to match
3. Or revert manual change

```bash
# Show current DB state
npm run db:status

# Generate migration to fix drift
npm run db:generate
```

### Migration Timeout in Production

**Error:** Migration exceeds 5-minute timeout

**Cause:** Long-running migration (large table, missing index)

**Fix:**
1. Optimize migration SQL
2. Add indexes before data changes
3. Split into smaller migrations

---

## Environment Variables

### Local Development

```bash
# .env.local (not tracked by git)
DATABASE_URL=postgresql://localhost:5432/pglite
```

### Staging

```bash
# GitHub Secrets
DATABASE_URL_STAGING=postgresql://user:pass@staging.db/app
GRAFANA_LOKI_URL=https://loki.example.com
```

### Production

```bash
# GitHub Secrets
DATABASE_URL_PROD=postgresql://user:pass@prod.db/app
NEON_API_KEY=neon_api_xxx
NEON_PROJECT_ID=proj_xxx
PAGERDUTY_INTEGRATION_KEY=R027xxx
GRAFANA_LOKI_URL=https://loki.example.com
```

---

## References

- **Drizzle ORM Docs:** https://orm.drizzle.team/
- **Schema Management Playbook:** `../DATABASE_SCHEMA_MANAGEMENT_2025.md`
- **Rollback Guide:** `../scripts/db/ROLLBACK_GUIDE.md`
- **Deployment Plan:** `../SCHEMA_DEPLOYMENT_SIMPLIFIED_PLAN.md`

---

## Quick Reference Card

```bash
# Daily Development
npm run db:generate     # After editing Schema.ts
npm run db:migrate      # Apply migration locally
npm run db:validate     # Check for drift

# Debugging
npm run db:status       # Current migration status
npm run db:history      # View last 10 migrations
npm run db:studio       # Visual database browser

# Safety
npm run db:snapshot     # Create backup before risky change
npm run db:reset:local  # Start fresh (local only)

# Emergency
./scripts/db/rollback.sh production  # Rollback production DB
```

---

**Need Help?**
- Slack: #database-team
- Email: db-admin@example.com
- Docs: `scripts/db/ROLLBACK_GUIDE.md`

---

**Last Updated:** November 15, 2025
**Maintained By:** Database Team
**Review Schedule:** Quarterly
