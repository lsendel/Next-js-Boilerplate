# CI/CD Workflow Diagrams

Visual representations of the CI/CD pipeline, deployment flows, and decision trees.

---

## 1. Overall CI/CD Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DEVELOPER WORKFLOW                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Feature Branch  →  Dev Branch  →  Staging Branch  →  Main Branch      │
│        │                │                │                  │            │
│        │                │                │                  │            │
│        ▼                ▼                ▼                  ▼            │
│   PR Review      Auto Deploy      Auto Deploy      Manual Approval      │
│                       ↓                  ↓                  ↓            │
└───────────────────────┼──────────────────┼──────────────────┼───────────┘
                        │                  │                  │
                        ▼                  ▼                  ▼
              ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐
              │  Dev Environment │  │Staging Env      │  │ Production Env   │
              │  environment-dev │  │environment-stage│  │ environment      │
              │  .1pet.com       │  │.1pet.com        │  │ .1pet.com        │
              └─────────────────┘  └─────────────────┘  └──────────────────┘
                      │                     │                     │
                      └─────────────────────┴─────────────────────┘
                                            │
                                            ▼
                              ┌──────────────────────────┐
                              │   Quality Gates          │
                              │   - Linting              │
                              │   - Type Checking        │
                              │   - Security Scanning    │
                              │   - Unit Tests           │
                              │   - Integration Tests    │
                              │   - E2E Tests            │
                              └──────────────────────────┘
```

---

## 2. Environment Promotion Pipeline

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    ENVIRONMENT PROMOTION WORKFLOW                      ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║   TRIGGER                                                              ║
║   ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────────┐  ║
║   │ git push   │  │ git push   │  │ git push   │  │ Manual        │  ║
║   │ origin dev │  │ origin     │  │ origin main│  │ Workflow      │  ║
║   │            │  │ staging    │  │            │  │ Dispatch      │  ║
║   └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └───────┬───────┘  ║
║         │               │               │                 │           ║
║         └───────────────┴───────────────┴─────────────────┘           ║
║                                 │                                      ║
║                                 ▼                                      ║
║   ┌──────────────────────────────────────────────────────────────┐    ║
║   │  STAGE 1: PREPARE                                            │    ║
║   │  ✓ Calculate version (semantic versioning)                  │    ║
║   │  ✓ Determine target environment                             │    ║
║   │  ✓ Create GitHub deployment record                          │    ║
║   │  ✓ Set deployment status: in_progress                       │    ║
║   └────────────────────────────┬─────────────────────────────────┘    ║
║                                │                                      ║
║                                ▼                                      ║
║   ┌──────────────────────────────────────────────────────────────┐    ║
║   │  STAGE 2: QUALITY GATES (Parallel Execution)                │    ║
║   │  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐     │    ║
║   │  │  Linting    │  │ Type Check   │  │ i18n Check     │     │    ║
║   │  │  (ESLint)   │  │ (TypeScript) │  │ (Completeness) │     │    ║
║   │  └──────┬──────┘  └──────┬───────┘  └───────┬────────┘     │    ║
║   │         │                │                   │              │    ║
║   │         └────────────────┴───────────────────┘              │    ║
║   │                          │                                  │    ║
║   │                 ✓ All must pass                             │    ║
║   └────────────────────────────┬─────────────────────────────────┘    ║
║                                │                                      ║
║                                ▼                                      ║
║   ┌──────────────────────────────────────────────────────────────┐    ║
║   │  STAGE 3: SECURITY SCAN                                      │    ║
║   │  ✓ pnpm audit (dependency vulnerabilities)                  │    ║
║   │  ✓ TruffleHog (secret scanning)                             │    ║
║   │  ✓ OWASP Dependency Check (production only)                 │    ║
║   └────────────────────────────┬─────────────────────────────────┘    ║
║                                │                                      ║
║                                ▼                                      ║
║   ┌──────────────────────────────────────────────────────────────┐    ║
║   │  STAGE 4: INTEGRATION TESTS                                  │    ║
║   │  ✓ Unit tests (Vitest)                                       │    ║
║   │  ✓ Integration tests (with PostgreSQL)                      │    ║
║   │  ✓ Code coverage (Codecov)                                   │    ║
║   └────────────────────────────┬─────────────────────────────────┘    ║
║                                │                                      ║
║                                ▼                                      ║
║   ┌──────────────────────────────────────────────────────────────┐    ║
║   │  STAGE 5: BUILD                                               │    ║
║   │  ✓ Build Next.js application                                │    ║
║   │  ✓ Inject version into build                                │    ║
║   │  ✓ Upload build artifacts                                   │    ║
║   └────────────────────────────┬─────────────────────────────────┘    ║
║                                │                                      ║
║                                ▼                                      ║
║   ┌──────────────────────────────────────────────────────────────┐    ║
║   │  STAGE 6: DEPLOY                                             │    ║
║   │  ✓ Download build artifacts                                 │    ║
║   │  ✓ Apply D1 database migrations                             │    ║
║   │  ✓ Deploy to Cloudflare Pages                               │    ║
║   │  ✓ Tag release (production only)                            │    ║
║   │  ✓ Create GitHub release (production only)                  │    ║
║   └────────────────────────────┬─────────────────────────────────┘    ║
║                                │                                      ║
║                                ▼                                      ║
║   ┌──────────────────────────────────────────────────────────────┐    ║
║   │  STAGE 7: VERIFY                                             │    ║
║   │  ✓ Wait for deployment stabilization (30s)                  │    ║
║   │  ✓ Health check (5 retries)                                 │    ║
║   │  ✓ Version verification                                     │    ║
║   │  ✓ Smoke tests (critical paths)                             │    ║
║   └────────────────────────────┬─────────────────────────────────┘    ║
║                                │                                      ║
║                                ▼                                      ║
║   ┌──────────────────────────────────────────────────────────────┐    ║
║   │  STAGE 8: NOTIFY                                             │    ║
║   │  ✓ Update deployment status (success/failure)               │    ║
║   │  ✓ Create deployment summary                                │    ║
║   │  ✓ Create incident issue (on failure)                       │    ║
║   │  ✓ Log to monitoring systems                                │    ║
║   └────────────────────────────┬─────────────────────────────────┘    ║
║                                │                                      ║
║                                ▼                                      ║
║                          ┌──────────┐                                 ║
║                          │ SUCCESS! │                                 ║
║                          └──────────┘                                 ║
║                                                                        ║
╚═══════════════════════════════════════════════════════════════════════╝
```

---

## 3. Rollback Workflow

```
╔═══════════════════════════════════════════════════════════════════════╗
║                         ROLLBACK WORKFLOW                              ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║   TRIGGER: Manual Workflow Dispatch                                   ║
║   Inputs: environment, target_version, reason, rollback_database      ║
║                                 │                                      ║
║                                 ▼                                      ║
║   ┌──────────────────────────────────────────────────────────────┐    ║
║   │  STAGE 1: VALIDATE                                           │    ║
║   │  ✓ Validate environment                                      │    ║
║   │  ✓ Determine target version (or find previous)              │    ║
║   │  ✓ Verify version exists in git tags                        │    ║
║   │  ✓ Find previous successful deployment                      │    ║
║   └────────────────────────────┬─────────────────────────────────┘    ║
║                                │                                      ║
║                                ▼                                      ║
║   ┌──────────────────────────────────────────────────────────────┐    ║
║   │  STAGE 2: BACKUP                                             │    ║
║   │  ⚠️ Create pre-rollback backup                               │    ║
║   │  ✓ Export current D1 database                               │    ║
║   │  ✓ Upload backup artifact (30-day retention)                │    ║
║   │  ✓ Log backup information                                   │    ║
║   └────────────────────────────┬─────────────────────────────────┘    ║
║                                │                                      ║
║                                ▼                                      ║
║   ┌──────────────────────────────────────────────────────────────┐    ║
║   │  STAGE 3: ROLLBACK                                           │    ║
║   │  ✓ Checkout target version from git                         │    ║
║   │  ✓ Install dependencies                                     │    ║
║   │  ✓ Build application (from target version)                  │    ║
║   │  ✓ (Optional) Rollback database migrations                  │    ║
║   │  ✓ Deploy to Cloudflare Pages                               │    ║
║   │  ✓ Create rollback tag                                      │    ║
║   └────────────────────────────┬─────────────────────────────────┘    ║
║                                │                                      ║
║                                ▼                                      ║
║   ┌──────────────────────────────────────────────────────────────┐    ║
║   │  STAGE 4: VERIFY                                             │    ║
║   │  ✓ Wait for deployment (30s)                                │    ║
║   │  ✓ Health check (5 retries)                                 │    ║
║   │  ✓ Version verification                                     │    ║
║   │  ✓ Smoke tests                                              │    ║
║   └────────────────────────────┬─────────────────────────────────┘    ║
║                                │                                      ║
║                                ▼                                      ║
║   ┌──────────────────────────────────────────────────────────────┐    ║
║   │  STAGE 5: DOCUMENT                                           │    ║
║   │  ✓ Create incident GitHub issue                             │    ║
║   │  ✓ Document rollback reason and status                      │    ║
║   │  ✓ Update deployment status                                 │    ║
║   │  ✓ Log to monitoring systems                                │    ║
║   └────────────────────────────┬─────────────────────────────────┘    ║
║                                │                                      ║
║                                ▼                                      ║
║                    ┌────────────────────────┐                         ║
║                    │  ROLLBACK COMPLETE!    │                         ║
║                    │  Review incident issue │                         ║
║                    └────────────────────────┘                         ║
║                                                                        ║
╚═══════════════════════════════════════════════════════════════════════╝
```

---

## 4. Version Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        VERSION CONTROL FLOW                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Commit to dev branch                                                │
│         │                                                            │
│         ▼                                                            │
│  ┌──────────────────────┐                                           │
│  │ Version Calculation  │                                           │
│  │ 1.2.3-dev.123+abc123 │                                           │
│  └──────────┬───────────┘                                           │
│             │                                                        │
│             ▼                                                        │
│  ┌──────────────────────┐                                           │
│  │ Deploy to Dev        │                                           │
│  │ environment-dev      │                                           │
│  │ .1pet.com            │                                           │
│  └──────────────────────┘                                           │
│                                                                      │
│  ─────────────────────────────────────────────────────              │
│                                                                      │
│  Merge to staging branch                                             │
│         │                                                            │
│         ▼                                                            │
│  ┌──────────────────────┐                                           │
│  │ Version Calculation  │                                           │
│  │ 1.2.3-rc.5           │                                           │
│  └──────────┬───────────┘                                           │
│             │                                                        │
│             ▼                                                        │
│  ┌──────────────────────┐                                           │
│  │ Deploy to Staging    │                                           │
│  │ environment-stage    │                                           │
│  │ .1pet.com            │                                           │
│  └──────────────────────┘                                           │
│                                                                      │
│  ─────────────────────────────────────────────────────              │
│                                                                      │
│  Merge to main branch + Manual Approval                              │
│         │                                                            │
│         ▼                                                            │
│  ┌──────────────────────┐                                           │
│  │ Version Calculation  │                                           │
│  │ 1.2.3                │                                           │
│  └──────────┬───────────┘                                           │
│             │                                                        │
│             ▼                                                        │
│  ┌──────────────────────┐                                           │
│  │ Deploy to Production │                                           │
│  │ environment.1pet.com │                                           │
│  └──────────┬───────────┘                                           │
│             │                                                        │
│             ├─────→ Create git tag: v1.2.3                          │
│             │                                                        │
│             ├─────→ Create GitHub release                           │
│             │                                                        │
│             └─────→ Track in deployment API                         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Quality Gate Decision Tree

```
                         ┌─────────────┐
                         │  Code Push  │
                         └──────┬──────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Linting (ESLint)    │
                    └──────────┬────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                   Pass                  Fail
                    │                     │
                    │                     └──→ ❌ Block Deployment
                    ▼
        ┌───────────────────────┐
        │ Type Check (TypeScript)│
        └──────────┬─────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
       Pass                  Fail
        │                     │
        │                     └──→ ❌ Block Deployment
        ▼
┌───────────────────────┐
│  i18n Validation      │
└──────────┬────────────┘
           │
┌──────────┴──────────┐
│                     │
Pass                  Fail
│                     │
│                     └──→ ❌ Block Deployment
▼
┌───────────────────────┐
│  Security Scan        │
│  (audit + secrets)    │
└──────────┬────────────┘
           │
┌──────────┴──────────┐
│                     │
Pass                  Fail
│                     │
│                     └──→ ❌ Block Deployment
▼
┌───────────────────────┐
│  Unit Tests           │
└──────────┬────────────┘
           │
┌──────────┴──────────┐
│                     │
Pass                  Fail
│                     │
│                     └──→ ❌ Block Deployment
▼
┌───────────────────────┐
│  Integration Tests    │
└──────────┬────────────┘
           │
┌──────────┴──────────┐
│                     │
Pass                  Fail
│                     │
│                     └──→ ❌ Block Deployment
▼
┌───────────────────────┐
│  Is Staging/Prod?     │
└──────────┬────────────┘
           │
    ┌──────┴──────┐
   Yes             No
    │              │
    ▼              │
┌────────────┐     │
│  E2E Tests │     │
└─────┬──────┘     │
      │            │
  ┌───┴───┐        │
 Pass    Fail      │
  │       │        │
  │       └──→ ❌  │
  │              Block
  │                │
  └────────────────┘
           │
           ▼
    ✅ Proceed to Build & Deploy
```

---

## 6. Monitoring & Verification Flow

```
┌───────────────────────────────────────────────────────────────────┐
│                   POST-DEPLOYMENT VERIFICATION                     │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Deployment Complete                                               │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────────────┐                                          │
│  │ Wait 30 seconds     │  (Allow deployment to stabilize)         │
│  └──────────┬──────────┘                                          │
│             │                                                      │
│             ▼                                                      │
│  ┌─────────────────────────────────────────┐                      │
│  │ Health Check Loop (5 attempts)          │                      │
│  │                                          │                      │
│  │ GET /api/health                          │                      │
│  │  ├─ Status: 200 + status: "ok" → ✅     │                      │
│  │  └─ Other → Wait 10s, retry             │                      │
│  └──────────┬──────────────────────────────┘                      │
│             │                                                      │
│      ┌──────┴──────┐                                              │
│     Pass          Fail (after 5 attempts)                         │
│      │              │                                              │
│      │              └──→ ❌ Deployment Failed                      │
│      │                   └─ Update status: failure                │
│      │                   └─ Create incident issue                 │
│      │                                                             │
│      ▼                                                             │
│  ┌─────────────────────┐                                          │
│  │ Version Check       │                                          │
│  │                     │                                          │
│  │ GET /api/version    │                                          │
│  │  ├─ version matches → ✅                                       │
│  │  └─ mismatch → ⚠️  Warning                                     │
│  └──────────┬──────────┘                                          │
│             │                                                      │
│             ▼                                                      │
│  ┌─────────────────────┐                                          │
│  │ Smoke Tests         │                                          │
│  │                     │                                          │
│  │ Test critical paths:│                                          │
│  │  ✓ Homepage         │                                          │
│  │  ✓ Auth flows       │                                          │
│  │  ✓ Key API routes   │                                          │
│  └──────────┬──────────┘                                          │
│             │                                                      │
│      ┌──────┴──────┐                                              │
│     Pass          Fail                                            │
│      │              │                                              │
│      │              └──→ ❌ Verification Failed                    │
│      │                   └─ Create alert                          │
│      │                   └─ Consider rollback                     │
│      │                                                             │
│      ▼                                                             │
│  ┌─────────────────────┐                                          │
│  │ Update Status       │                                          │
│  │  ✓ status: success  │                                          │
│  │  ✓ environment_url  │                                          │
│  │  ✓ log_url          │                                          │
│  └──────────┬──────────┘                                          │
│             │                                                      │
│             ▼                                                      │
│  ┌─────────────────────┐                                          │
│  │ Create Summary      │                                          │
│  │  ✓ GitHub comment   │                                          │
│  │  ✓ Deployment log   │                                          │
│  │  ✓ Metrics update   │                                          │
│  └──────────┬──────────┘                                          │
│             │                                                      │
│             ▼                                                      │
│  ┌─────────────────────┐                                          │
│  │ Monitor (15-30 min) │                                          │
│  │  ✓ Error rates      │                                          │
│  │  ✓ Performance      │                                          │
│  │  ✓ User feedback    │                                          │
│  └─────────────────────┘                                          │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
```

---

## 7. Emergency Rollback Decision Tree

```
                    ┌──────────────────┐
                    │  Issue Detected  │
                    └────────┬─────────┘
                             │
                             ▼
                ┌────────────────────────┐
                │  Assess Severity       │
                └────────┬───────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ CRITICAL     │  │ HIGH         │  │ LOW/MEDIUM   │
│ - Data loss  │  │ - Perf issue │  │ - UI bug     │
│ - Security   │  │ - Feature    │  │ - Minor      │
│ - Total down │  │   broken     │  │   issue      │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       │                 │                 │
       ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ ROLLBACK    │   │ Evaluate    │   │ Plan        │
│ IMMEDIATELY │   │ Impact      │   │ Forward Fix │
└──────┬──────┘   └──────┬──────┘   └──────┬──────┘
       │                 │                 │
       │          ┌──────┴──────┐          │
       │          │             │          │
       │          ▼             ▼          │
       │    ┌──────────┐  ┌──────────┐    │
       │    │ Affects  │  │ Limited  │    │
       │    │ Many     │  │ Impact   │    │
       │    └────┬─────┘  └────┬─────┘    │
       │         │             │          │
       │         ▼             ▼          │
       │    ┌─────────┐   ┌──────────┐   │
       │    │ROLLBACK │   │ Monitor  │   │
       │    │ 1 hour  │   │ Plan Fix │   │
       │    └─────────┘   └──────────┘   │
       │                                  │
       └──────────────┬───────────────────┘
                      │
                      ▼
           ┌────────────────────┐
           │ Execute Rollback   │
           │ Workflow           │
           └──────────┬─────────┘
                      │
                      ▼
           ┌────────────────────┐
           │ Verify Rollback    │
           └──────────┬─────────┘
                      │
                      ▼
           ┌────────────────────┐
           │ Document Incident  │
           │ Post-Mortem        │
           └────────────────────┘
```

---

## 8. CI/CD System Integration

```
┌─────────────────────────────────────────────────────────────────────┐
│                      SYSTEM INTEGRATION MAP                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────┐                                                 │
│  │   GitHub       │                                                 │
│  │   Repository   │                                                 │
│  └───────┬────────┘                                                 │
│          │                                                           │
│          ├─────────→ GitHub Actions (Workflows)                     │
│          │            ├─ Environment Promotion                      │
│          │            ├─ Rollback                                   │
│          │            ├─ CI (Tests)                                 │
│          │            └─ Release                                    │
│          │                                                           │
│          ├─────────→ GitHub Deployments API                         │
│          │            └─ Track deployment status                    │
│          │                                                           │
│          └─────────→ GitHub Releases                                │
│                       └─ Production versions                        │
│                                                                      │
│  ┌────────────────┐                                                 │
│  │  Cloudflare    │                                                 │
│  │  Pages         │                                                 │
│  └───────┬────────┘                                                 │
│          │                                                           │
│          ├─────────→ D1 Database (dev/stage/prod)                   │
│          │                                                           │
│          ├─────────→ Workers (runtime)                              │
│          │                                                           │
│          └─────────→ Analytics                                      │
│                                                                      │
│  ┌────────────────┐                                                 │
│  │  Monitoring    │                                                 │
│  └───────┬────────┘                                                 │
│          │                                                           │
│          ├─────────→ Sentry (errors)                                │
│          │                                                           │
│          ├─────────→ PostHog (analytics)                            │
│          │                                                           │
│          ├─────────→ Better Stack (logs)                            │
│          │                                                           │
│          └─────────→ Cloudflare Analytics (edge metrics)            │
│                                                                      │
│  ┌────────────────┐                                                 │
│  │  Application   │                                                 │
│  └───────┬────────┘                                                 │
│          │                                                           │
│          ├─────────→ /api/health (health checks)                    │
│          │                                                           │
│          └─────────→ /api/version (version tracking)                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Summary

These diagrams illustrate:

1. **Overall Architecture** - The complete CI/CD system layout
2. **Environment Promotion** - Step-by-step deployment pipeline
3. **Rollback Flow** - Emergency recovery procedures
4. **Version Management** - Semantic versioning across environments
5. **Quality Gates** - Decision tree for deployment blocking
6. **Verification** - Post-deployment monitoring and checks
7. **Emergency Response** - Incident severity and rollback decisions
8. **System Integration** - How all components work together

**For detailed information**, see:
- [Complete CI/CD Guide](./CI_CD_COMPLETE_GUIDE.md)
- [Quick Reference](./CI_CD_QUICK_REFERENCE.md)
- [Implementation Summary](./CI_CD_IMPLEMENTATION_SUMMARY.md)
