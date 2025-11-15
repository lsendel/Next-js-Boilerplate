# Database Rollback Procedures

> **Important:** Always prefer forward-fix migrations over rollbacks when possible. Rollbacks can lead to data loss and should only be used in emergencies.

---

## Decision Tree

```
Migration Failed or Needs Rollback?
  ├─ In Development → Drop database, re-run from scratch
  ├─ In Staging → Forward-fix OR Neon branch rollback
  └─ In Production →
       ├─ Data corruption? → PITR restore (Point-in-Time Recovery)
       ├─ Schema issue only? → Forward-fix migration
       └─ App completely broken? → Rollback app deployment, keep DB
```

---

## Option 1: Forward-Fix Migration (Preferred)

**When to use:** Schema changes need to be reversed, no data corruption

**Advantages:**
- No risk of data loss
- Preserves audit trail
- Can be tested in staging first
- Works with all environments

**Process:**

1. **Identify the problematic change**
   ```bash
   # View recent migrations
   ls -lt migrations/*.sql | head -5
   ```

2. **Revert the schema change**
   ```bash
   # Edit src/server/db/models/Schema.ts
   # Remove or modify the problematic change
   vim src/server/db/models/Schema.ts
   ```

3. **Generate reverse migration**
   ```bash
   npm run db:generate
   ```

4. **Test locally**
   ```bash
   npm run db:migrate
   npm run test:integration
   ```

5. **Commit and deploy**
   ```bash
   git add src/server/db/models/ migrations/
   git commit -m "revert: rollback migration XXXX - description"
   git push
   ```

**Example:**

```typescript
// Before (problematic)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  newColumn: varchar('new_column', { length: 100 }), // Problem!
});

// After (forward-fix)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  // Column removed
});
```

---

## Option 2: Neon Branch Rollback (Staging/Production)

**When to use:** Quick rollback needed, using Neon managed Postgres

**Advantages:**
- Fast (seconds to switch)
- Complete database state rollback
- Can preserve problematic state for debugging

**Prerequisites:**
- Neon API key set in environment
- Automatic branching enabled

**Process:**

1. **List available branches**
   ```bash
   neon branches list --project-id $NEON_PROJECT_ID
   ```

2. **Identify the branch before migration**
   ```bash
   # Neon creates automatic branches before migrations
   # Look for branch with timestamp before the problematic migration
   ```

3. **Promote the previous branch**
   ```bash
   neon branches set-primary $PREVIOUS_BRANCH_ID --project-id $NEON_PROJECT_ID
   ```

4. **Update application configuration**
   ```bash
   # Update DATABASE_URL in deployment environment
   # Redeploy application
   ```

5. **Verify**
   ```bash
   # Check database state
   psql $DATABASE_URL -c "SELECT * FROM _drizzle_migrations ORDER BY id DESC LIMIT 5"
   ```

**Script:** See `scripts/db/rollback.sh`

---

## Option 3: Point-in-Time Restore (PITR)

**When to use:** Data corruption occurred, need to restore to before the migration

**Advantages:**
- Can restore to any point in time (within retention window)
- Preserves data integrity

**Disadvantages:**
- Slower than branch rollback
- Requires PITR enabled on database
- May lose recent data

### For Neon:

```bash
# Create a new branch from a specific point in time
neon branches create \
  --name restored-$(date +%Y%m%d-%H%M%S) \
  --parent main \
  --timestamp "2025-01-15T10:30:00Z" \
  --project-id $NEON_PROJECT_ID

# Get the new branch connection string
neon connection-string --branch restored-XXXX --project-id $NEON_PROJECT_ID

# Update DATABASE_URL and redeploy
```

### For AWS RDS:

```bash
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier prod-db \
  --target-db-instance-identifier prod-db-restored \
  --restore-time 2025-01-15T10:30:00Z
```

### For Google Cloud SQL:

```bash
gcloud sql instances restore-backup prod-db \
  --backup-id 1234567890 \
  --backup-project myproject
```

---

## Option 4: pg_dump Restore (Last Resort)

**When to use:** No PITR available, have recent backup

**Prerequisites:**
- Recent backup created via `npm run db:snapshot`
- Backup file in `backups/` directory

**Process:**

1. **List available backups**
   ```bash
   ls -lh backups/
   ```

2. **Restore from backup**
   ```bash
   # WARNING: This will overwrite the database
   gunzip -c backups/snapshot-YYYYMMDD-HHMMSS.sql.gz | \
     psql $DATABASE_URL
   ```

3. **Verify**
   ```bash
   psql $DATABASE_URL -c "SELECT * FROM _drizzle_migrations ORDER BY id DESC LIMIT 5"
   ```

---

## Emergency Contacts

**During Business Hours:**
- DevOps Team: #devops-team (Slack)
- Database Admin: db-admin@example.com

**After Hours:**
- On-Call Engineer: PagerDuty escalation
- Escalation: CTO (for production only)

---

## Rollback Checklist

Before performing a rollback:

- [ ] Identify the problematic migration
- [ ] Determine the rollback method (forward-fix preferred)
- [ ] Create incident ticket/report
- [ ] Notify team in #incidents Slack channel
- [ ] Take snapshot/backup if not automated
- [ ] Document the root cause
- [ ] Plan verification steps
- [ ] Communicate to stakeholders

After rollback:

- [ ] Verify database state
- [ ] Run smoke tests
- [ ] Monitor error rates
- [ ] Document what happened
- [ ] Schedule post-mortem
- [ ] Update runbooks if needed

---

## Prevention Best Practices

1. **Test migrations in staging first**
   ```bash
   # Always deploy to staging before production
   git push origin main  # Triggers staging deploy
   # Wait for staging verification
   # Then manually approve production deploy
   ```

2. **Use feature flags for risky changes**
   ```typescript
   // Deploy code with feature flag OFF
   // Run migration
   // Enable feature flag gradually
   ```

3. **Additive changes first**
   ```typescript
   // Week 1: Add new column (nullable)
   export const users = pgTable('users', {
     oldColumn: varchar('old_column'),
     newColumn: varchar('new_column'), // nullable!
   });

   // Week 2: Backfill data, make required
   // Week 3: Remove old column
   ```

4. **Automated pre-deploy snapshots**
   ```yaml
   # In deployment workflow
   - name: Create snapshot
     run: npm run db:snapshot
   ```

---

## Common Scenarios

### Scenario: Added column breaks old application code

**Solution:** Forward-fix by making column nullable

```bash
# Edit schema, make column nullable
npm run db:generate
git commit -m "fix: make new column nullable for backward compatibility"
git push
```

### Scenario: Dropped column still needed by app

**Solution:** Re-add column, deploy fix

```bash
# Re-add column to schema
npm run db:generate
npm run db:migrate
# Verify locally
git commit -m "fix: re-add accidentally dropped column"
git push
```

### Scenario: Migration hangs/times out

**Solution:** Cancel migration, investigate locking

```bash
# Check for long-running queries
psql $DATABASE_URL -c "SELECT pid, now() - pg_stat_activity.query_start AS duration, query FROM pg_stat_activity WHERE state = 'active';"

# Kill blocking query if safe
psql $DATABASE_URL -c "SELECT pg_terminate_backend(PID);"
```

### Scenario: Data corruption after migration

**Solution:** PITR restore to before migration

```bash
# Use Option 3 (PITR) above
# Restore to timestamp before migration
# Apply fixed migration
```

---

## Testing Rollback Procedures

**Quarterly Drill:**

1. Create test environment
2. Apply problematic migration intentionally
3. Practice each rollback method
4. Time the procedures
5. Update this document with learnings

---

## Logging Migration Events

All migrations should be logged for audit trail:

```bash
# Automatic with telemetry wrapper
ENVIRONMENT=production ./scripts/db/migrate-with-telemetry.sh

# Manual logging
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) - Migration started: $MIGRATION_NAME" >> migrations/audit.log
```

---

## References

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Neon Branching Guide](https://neon.tech/docs/guides/branching)
- [DATABASE_SCHEMA_MANAGEMENT_2025.md](../../DATABASE_SCHEMA_MANAGEMENT_2025.md)
- [SCHEMA_DEPLOYMENT_SIMPLIFIED_PLAN.md](../../SCHEMA_DEPLOYMENT_SIMPLIFIED_PLAN.md)

---

**Last Updated:** November 15, 2025
**Maintained By:** DevOps Team
**Review Schedule:** Quarterly
