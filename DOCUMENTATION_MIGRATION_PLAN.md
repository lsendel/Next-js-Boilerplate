# Documentation Migration Plan

**Status:** Phase 1 Complete | Phase 2-4 Ready for Migration
**Created:** 2025-11-15
**Documentation Site:** http://localhost:3001

## ✅ Completed (Phase 1)

### Infrastructure
- [x] Monorepo structure with pnpm workspaces
- [x] Nextra documentation app in `apps/docs/`
- [x] Main app migrated to `apps/web/`
- [x] 2,103 dependencies installed
- [x] Documentation site running successfully

### Cleanup
- [x] 40+ outdated files archived to `docs-archive/`
  - 25+ sprint reports
  - 7 status reports
  - 15+ old plans/roadmaps

### Documentation Created
- [x] Landing page (`apps/docs/app/index.mdx`)
- [x] Getting Started section (5 pages):
  - Overview
  - Installation
  - First Steps
  - Project Structure
  - Customization

## 📋 Phase 2: Core Documentation Migration

### High Priority (Do First)

| # | Source File | Destination | Size | Status | Notes |
|---|-------------|-------------|------|--------|-------|
| 1 | `docs/ARCHITECTURE.md` | `apps/docs/app/architecture/index.mdx` | 77 lines (STUB) | ⏳ **EXPAND** | Needs comprehensive expansion |
| 2 | `docs/API_REFERENCE.md` | `apps/docs/app/api/index.mdx` | 34KB | ⏳ TODO | Well-written, ready to migrate |
| 3 | `CI_CD_GUIDE.md` | `apps/docs/app/operations/ci-cd.mdx` | 72KB | ⏳ TODO | Massive, comprehensive guide |
| 4 | `DEPLOYMENT_GUIDE.md` | `apps/docs/app/guides/deployment/index.mdx` | 26KB | ⏳ TODO | Consolidate with DEPLOYMENT_README |
| 5 | `PLATFORM_DEPLOYMENT_GUIDE.md` | Split into platform guides | 23KB | ⏳ TODO | Split into vercel.mdx, aws.mdx, etc. |

### Authentication Documentation

| # | Source File | Destination | Status | Notes |
|---|-------------|-------------|--------|-------|
| 6 | `src/libs/auth/README.md` | `apps/docs/app/architecture/auth-system.mdx` | ⏳ TODO | Modular auth architecture |
| 7 | `docs/CLOUDFLARE_AUTH_SETUP.md` | `apps/docs/app/guides/authentication/cloudflare.mdx` | ⏳ TODO | Cloudflare Access setup |
| 8 | `docs/COGNITO_AUTH_SETUP.md` | `apps/docs/app/guides/authentication/cognito.mdx` | ⏳ TODO | AWS Cognito setup |
| 9 | `OAUTH_CONFIGURATION.md` | `apps/docs/app/guides/authentication/oauth.mdx` | ⏳ TODO | OAuth configuration |
| 10 | Create Clerk guide | `apps/docs/app/guides/authentication/clerk.mdx` | ⏳ TODO | Extract from README |
| 11 | Create auth overview | `apps/docs/app/guides/authentication/index.mdx` | ⏳ TODO | Overview of modular auth |

### Database Documentation

| # | Source File | Destination | Status | Notes |
|---|-------------|-------------|--------|-------|
| 12 | `docs/DATABASE.md` | `apps/docs/app/guides/database/index.mdx` | ⏳ TODO | Quick reference |
| 13 | `docs/DATABASE_SCHEMA.md` | `apps/docs/app/guides/database/schema.mdx` | ⏳ TODO | Schema documentation |
| 14 | `DATABASE_SCHEMA_MANAGEMENT_2025.md` | `apps/docs/app/guides/database/migrations.mdx` | ⏳ TODO | Migration workflow |
| 15 | `SCHEMA_DEPLOYMENT_IMPLEMENTATION_PLAN.md` | Merge into migrations.mdx | ⏳ TODO | Consolidate |
| 16 | `FLYWAY_CICD_PLAN_2025.md` | `apps/docs/app/guides/database/flyway.mdx` | ⏳ TODO | Flyway-specific (optional) |
| 17 | `scripts/db/ROLLBACK_GUIDE.md` | `apps/docs/app/guides/database/rollback.mdx` | ⏳ TODO | Rollback procedures |

### Testing Documentation

| # | Source File | Destination | Status | Notes |
|---|-------------|-------------|--------|-------|
| 18 | `LOCAL_TESTING_GUIDE.md` | `apps/docs/app/guides/testing/local-ci.mdx` | ⏳ TODO | Testing CI locally |
| 19 | Create unit testing guide | `apps/docs/app/guides/testing/unit.mdx` | ⏳ TODO | Vitest guide |
| 20 | Create E2E testing guide | `apps/docs/app/guides/testing/e2e.mdx` | ⏳ TODO | Playwright guide |
| 21 | Create integration testing guide | `apps/docs/app/guides/testing/integration.mdx` | ⏳ TODO | Integration tests |
| 22 | Create Storybook guide | `apps/docs/app/guides/testing/storybook.mdx` | ⏳ TODO | Component stories |
| 23 | Create testing overview | `apps/docs/app/guides/testing/index.mdx` | ⏳ TODO | Testing strategy |

### Security Documentation

| # | Source File | Destination | Status | Notes |
|---|-------------|-------------|--------|-------|
| 24 | `docs/SECURITY.md` | `apps/docs/app/guides/security/index.mdx` | ⏳ TODO | Security practices |
| 25 | `SECURITY_AUDIT_REPORT.md` | `apps/docs/app/guides/security/audit.mdx` | ⏳ TODO | Latest audit report |
| 26 | `docs/AUTH_SECURITY_IMPROVEMENTS.md` | Merge into auth security | ⏳ TODO | Auth-specific security |
| 27 | `docs/RBAC_ARCHITECTURE_PLAN.md` | `apps/docs/app/advanced/rbac.mdx` | ⏳ TODO | RBAC implementation |

## 📋 Phase 3: Integrations & Operations

### Integrations Documentation

| # | Source File | Destination | Status | Notes |
|---|-------------|-------------|--------|-------|
| 28 | Create Sentry guide | `apps/docs/app/integrations/sentry.mdx` | ⏳ TODO | Error monitoring |
| 29 | Create LogTape guide | `apps/docs/app/integrations/logtape.mdx` | ⏳ TODO | Logging |
| 30 | Create Better Stack guide | `apps/docs/app/integrations/better-stack.mdx` | ⏳ TODO | Log management |
| 31 | Create PostHog guide | `apps/docs/app/integrations/posthog.mdx` | ⏳ TODO | Analytics |
| 32 | Create Checkly guide | `apps/docs/app/integrations/checkly.mdx` | ⏳ TODO | Monitoring |
| 33 | Create Crowdin guide | `apps/docs/app/integrations/crowdin.mdx` | ⏳ TODO | Translations |
| 34 | Create Arcjet guide | `apps/docs/app/integrations/arcjet.mdx` | ⏳ TODO | Security |
| 35 | Create integrations overview | `apps/docs/app/integrations/index.mdx` | ⏳ TODO | All integrations |

### Operations Documentation

| # | Source File | Destination | Status | Notes |
|---|-------------|-------------|--------|-------|
| 36 | `docs/ops/ci-monitoring.md` | `apps/docs/app/operations/monitoring.mdx` | ⏳ TODO | CI monitoring |
| 37 | `docs/ops/environment-variables.md` | `apps/docs/app/operations/environments.mdx` | ⏳ TODO | Environment setup |
| 38 | `docs/ops/observability.md` | `apps/docs/app/operations/observability.mdx` | ⏳ TODO | Observability |
| 39 | `docs/CI_ENVIRONMENTS.md` | Merge into environments.mdx | ⏳ TODO | Consolidate |
| 40 | `docs/CI_E2E_ENVIRONMENTS.md` | Merge into environments.mdx | ⏳ TODO | Consolidate |
| 41 | `ENVIRONMENT_SETUP.md` | Merge into environments.mdx | ⏳ TODO | Consolidate |
| 42 | Create troubleshooting guide | `apps/docs/app/operations/troubleshooting.mdx` | ⏳ TODO | Common issues |
| 43 | Create operations overview | `apps/docs/app/operations/index.mdx` | ⏳ TODO | Ops overview |

## 📋 Phase 4: Advanced & Reference

### i18n Documentation

| # | Source File | Destination | Status | Notes |
|---|-------------|-------------|--------|-------|
| 44 | Extract from README | `apps/docs/app/guides/i18n/index.mdx` | ⏳ TODO | i18n overview |
| 45 | Extract from CLAUDE.md | `apps/docs/app/guides/i18n/setup.mdx` | ⏳ TODO | Setup guide |
| 46 | Create translations guide | `apps/docs/app/guides/i18n/translations.mdx` | ⏳ TODO | Managing translations |
| 47 | Create Crowdin guide | `apps/docs/app/guides/i18n/crowdin.mdx` | ⏳ TODO | Crowdin workflow |

### Advanced Topics

| # | Source File | Destination | Status | Notes |
|---|-------------|-------------|--------|-------|
| 48 | `docs/RBAC_ARCHITECTURE_PLAN.md` | `apps/docs/app/advanced/rbac.mdx` | ⏳ TODO | RBAC implementation |
| 49 | `MIGRATION.md` | `apps/docs/app/advanced/migration.mdx` | ⏳ TODO | Migration guide |
| 50 | `docs/INFRA_TERRAFORM.md` | `apps/docs/app/advanced/infrastructure.mdx` | ⏳ TODO | Terraform |
| 51 | Create multi-tenancy guide | `apps/docs/app/advanced/multi-tenancy.mdx` | ⏳ TODO | Multi-tenancy |
| 52 | Create performance guide | `apps/docs/app/advanced/performance.mdx` | ⏳ TODO | Optimization |
| 53 | Create advanced overview | `apps/docs/app/advanced/index.mdx` | ⏳ TODO | Advanced topics |

### Reference Documentation

| # | Source File | Destination | Status | Notes |
|---|-------------|-------------|--------|-------|
| 54 | Extract from CLAUDE.md | `apps/docs/app/reference/npm-scripts.mdx` | ⏳ TODO | All npm scripts |
| 55 | `docs/ops/environment-variables.md` | `apps/docs/app/reference/environment-variables.mdx` | ⏳ TODO | Complete env var list |
| 56 | Create components reference | `apps/docs/app/reference/components.mdx` | ⏳ TODO | Component API |
| 57 | Create utilities reference | `apps/docs/app/reference/utilities.mdx` | ⏳ TODO | Utility functions |
| 58 | Create glossary | `apps/docs/app/reference/glossary.mdx` | ⏳ TODO | Terms & definitions |
| 59 | Create reference overview | `apps/docs/app/reference/index.mdx` | ⏳ TODO | Reference overview |

## 📋 Duplicates to Consolidate

### Files to Merge

| Original Files | Consolidated Destination | Action |
|----------------|-------------------------|---------|
| `DEPLOYMENT_GUIDE.md` + `DEPLOYMENT_README.md` + `docs/DEPLOYMENT_GUIDE.md` | `apps/docs/app/guides/deployment/index.mdx` | Merge all 3 |
| `SECURITY_AUDIT_REPORT.md` + `docs/SECURITY_AUDIT_REPORT.md` | `apps/docs/app/guides/security/audit.mdx` | Pick latest |
| `DATABASE_SCHEMA_MANAGEMENT_2025.md` + `SCHEMA_DEPLOYMENT_IMPLEMENTATION_PLAN.md` | `apps/docs/app/guides/database/migrations.mdx` | Consolidate |
| `CI_ENVIRONMENTS.md` + `CI_E2E_ENVIRONMENTS.md` + `docs/ops/environment-variables.md` | `apps/docs/app/operations/environments.mdx` | Merge all |

### Files to Delete After Migration

- `DEPLOYMENT_README.md` (duplicate)
- `docs/DEPLOYMENT_GUIDE.md` (duplicate)
- Old schema deployment plans (keep one)

## 🗂️ Directory Structure Overview

```
apps/docs/app/
├── index.mdx                      ✅ Done
├── _meta.json                     ✅ Done
│
├── getting-started/               ✅ Done (5 pages)
│   ├── _meta.json
│   ├── index.mdx
│   ├── installation.mdx
│   ├── first-steps.mdx
│   ├── project-structure.mdx
│   └── customization.mdx
│
├── architecture/                  ⏳ TODO (6 pages)
│   ├── _meta.json
│   ├── index.mdx                  # Expand ARCHITECTURE.md stub
│   ├── app-router.mdx             # Next.js routing
│   ├── auth-system.mdx            # From src/libs/auth/README.md
│   ├── database.mdx               # DB architecture
│   ├── middleware.mdx             # Middleware pipeline
│   └── multi-tenancy.mdx          # Multi-tenancy design
│
├── guides/                        ⏳ TODO (30+ pages)
│   ├── authentication/
│   │   ├── _meta.json
│   │   ├── index.mdx
│   │   ├── clerk.mdx
│   │   ├── cloudflare.mdx
│   │   ├── cognito.mdx
│   │   ├── oauth.mdx
│   │   └── security.mdx
│   ├── database/
│   │   ├── _meta.json
│   │   ├── index.mdx
│   │   ├── schema.mdx
│   │   ├── migrations.mdx
│   │   ├── rollback.mdx
│   │   └── flyway.mdx
│   ├── testing/
│   │   ├── _meta.json
│   │   ├── index.mdx
│   │   ├── unit.mdx
│   │   ├── integration.mdx
│   │   ├── e2e.mdx
│   │   ├── storybook.mdx
│   │   └── local-ci.mdx
│   ├── deployment/
│   │   ├── _meta.json
│   │   ├── index.mdx
│   │   ├── vercel.mdx
│   │   ├── cloudflare.mdx
│   │   ├── aws.mdx
│   │   ├── azure.mdx
│   │   ├── gcp.mdx
│   │   └── checklist.mdx
│   ├── i18n/
│   │   ├── _meta.json
│   │   ├── index.mdx
│   │   ├── setup.mdx
│   │   ├── translations.mdx
│   │   └── crowdin.mdx
│   └── security/
│       ├── _meta.json
│       ├── index.mdx
│       └── audit.mdx
│
├── integrations/                  ⏳ TODO (8 pages)
│   ├── _meta.json
│   ├── index.mdx
│   ├── sentry.mdx
│   ├── logtape.mdx
│   ├── better-stack.mdx
│   ├── posthog.mdx
│   ├── checkly.mdx
│   ├── crowdin.mdx
│   └── arcjet.mdx
│
├── api/                           ⏳ TODO (5 pages)
│   ├── _meta.json
│   ├── index.mdx                  # From docs/API_REFERENCE.md
│   ├── authentication.mdx
│   ├── routes.mdx
│   ├── services.mdx
│   └── validation.mdx
│
├── operations/                    ⏳ TODO (8 pages)
│   ├── _meta.json
│   ├── index.mdx
│   ├── ci-cd.mdx                  # From CI_CD_GUIDE.md (72KB!)
│   ├── environments.mdx
│   ├── monitoring.mdx
│   ├── logging.mdx
│   ├── observability.mdx
│   ├── troubleshooting.mdx
│   └── runbooks/
│       ├── database-issues.mdx
│       ├── auth-failures.mdx
│       └── performance.mdx
│
├── advanced/                      ⏳ TODO (6 pages)
│   ├── _meta.json
│   ├── index.mdx
│   ├── rbac.mdx
│   ├── multi-tenancy.mdx
│   ├── performance.mdx
│   ├── infrastructure.mdx
│   └── migration.mdx
│
└── reference/                     ⏳ TODO (6 pages)
    ├── _meta.json
    ├── index.mdx
    ├── environment-variables.mdx
    ├── npm-scripts.mdx
    ├── components.mdx
    ├── utilities.mdx
    └── glossary.mdx
```

## 📊 Migration Statistics

- **Total Files to Migrate:** ~60
- **Total Pages to Create:** ~75
- **Completed:** 6 pages (8%)
- **Remaining:** 69 pages (92%)

### Time Estimates

| Phase | Pages | Estimated Time |
|-------|-------|----------------|
| Phase 1 (Done) | 6 | ✅ 3 hours |
| Phase 2 (Core) | 27 | 6-8 hours |
| Phase 3 (Integrations/Ops) | 24 | 5-6 hours |
| Phase 4 (Advanced/Reference) | 18 | 4-5 hours |
| **Total** | **75** | **15-19 hours** |

## 🚀 Quick Start Guide

### Run Migration Scripts

```bash
# Make scripts executable
chmod +x scripts/migrate-docs-*.sh

# Run migrations (in order)
./scripts/migrate-docs-phase2.sh  # Core docs
./scripts/migrate-docs-phase3.sh  # Integrations
./scripts/migrate-docs-phase4.sh  # Advanced
```

### Manual Migration Workflow

For each file:

1. **Read source**: Open source file
2. **Convert to MDX**: Adjust formatting if needed
3. **Add frontmatter** (optional):
   ```mdx
   ---
   title: "Page Title"
   description: "Page description"
   ---
   ```
4. **Create _meta.json**: Add navigation entry
5. **Test**: Check http://localhost:3001
6. **Verify links**: Fix any broken internal links

## 📝 Notes

### Important Considerations

1. **Large Files**: CI_CD_GUIDE.md (72KB) may need splitting
2. **Duplicates**: Always compare duplicates before deleting
3. **Links**: Update all internal links to new paths
4. **Images**: Move images to `apps/docs/public/`
5. **Code Blocks**: Ensure proper syntax highlighting

### Keep in Root

- `README.md` - GitHub readme
- `CLAUDE.md` - AI assistant instructions
- `MIGRATION.md` - Migration guide
- `.github/` workflows

## ✅ Next Steps

1. Review this migration plan
2. Run phase 2 migration script
3. Manually review and adjust migrated content
4. Test all links and navigation
5. Deploy documentation site

---

**Last Updated:** 2025-11-15
**Progress:** Phase 1 Complete | Ready for Phase 2
