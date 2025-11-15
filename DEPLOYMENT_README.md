# 🚀 Deployment & CI/CD Documentation

**Complete guide to deploying and managing your Next.js application**

**Last Updated:** November 15, 2025
**Status:** ✅ Production Ready
**Sprint 3 Optimizations:** Applied (29.7% bundle reduction)

---

## 📚 Documentation Overview

This project includes comprehensive deployment and CI/CD documentation following 2025 best practices. Choose the guide that matches your needs:

### Core Guides

| Guide | Purpose | When to Use |
|-------|---------|-------------|
| **[CI_CD_GUIDE.md](./CI_CD_GUIDE.md)** | Complete CI/CD pipeline, branch strategy, workflows | **Start here** for understanding the full development workflow |
| **[PLATFORM_DEPLOYMENT_GUIDE.md](./PLATFORM_DEPLOYMENT_GUIDE.md)** | Platform-specific deployment (Cloudflare, AWS, GCP) | When deploying to a specific platform |
| **[ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)** | Environment variables, secrets management | When configuring environments |
| **[OAUTH_CONFIGURATION.md](./OAUTH_CONFIGURATION.md)** | Authentication setup (Clerk, Cloudflare, Cognito) | When setting up authentication |

---

## 🎯 Quick Start by Use Case

### "I want to understand the development workflow"

1. Read [CI_CD_GUIDE.md](./CI_CD_GUIDE.md) sections:
   - Git Branching Strategy
   - Development Workflow
   - Pull Request Process

**TL;DR:**
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
npm run commit

# Push and create PR
git push -u origin feature/my-feature
gh pr create

# Merge (after approval)
gh pr merge --squash --delete-branch
```

### "I want to deploy to production"

1. **Setup environment:** Follow [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
2. **Choose platform:** Use [PLATFORM_DEPLOYMENT_GUIDE.md](./PLATFORM_DEPLOYMENT_GUIDE.md)
3. **Configure OAuth:** Follow [OAUTH_CONFIGURATION.md](./OAUTH_CONFIGURATION.md)
4. **Deploy:** Use GitHub Actions workflows (auto-configured)

**TL;DR:**
```bash
# All platforms deploy via GitHub Actions
git push origin main  # → Auto-deploy to staging
# → Manual approval → Auto-deploy to production
```

### "I want to set up CI/CD"

1. Read [CI_CD_GUIDE.md](./CI_CD_GUIDE.md) section: CI/CD Pipeline Architecture
2. Configure GitHub Secrets (per platform guide)
3. Push to `main` branch - CI/CD automatically runs

**Already Configured:**
- ✅ Reusable workflows (`.github/workflows/reusable-*.yml`)
- ✅ Platform-specific deployments
- ✅ Security scanning
- ✅ Automated testing

### "I want to configure authentication"

Follow [OAUTH_CONFIGURATION.md](./OAUTH_CONFIGURATION.md) for your provider:
- **Clerk** (recommended): Fastest setup, best DX
- **Cloudflare Access**: For Cloudflare users
- **AWS Cognito**: For AWS ecosystem

### "I want to understand the environment strategy"

Read:
- [CI_CD_GUIDE.md](./CI_CD_GUIDE.md) → Environment Strategy section
- [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) → Environment templates

**Three Tiers:**
- **Development:** PR previews (ephemeral)
- **Staging:** Auto-deploy from `main` (persistent)
- **Production:** Manual approval (HA setup)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Developer Workflow                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Feature Branch → PR → CI Checks → Review → Merge to Main       │
│                                                                   │
│  CI Checks (< 10 min):                                           │
│  ├─ Lint & TypeCheck                                            │
│  ├─ Unit Tests (80% coverage)                                   │
│  ├─ Build & Bundle Size Check                                   │
│  ├─ Security Scan (SBOM, secrets, CVE)                          │
│  └─ E2E Tests (on main only)                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CD Pipeline (Environments)                    │
│                                                                   │
│  Development (PR Preview)                                        │
│  ├─ Deploy: On PR creation                                      │
│  ├─ Database: Ephemeral/Dev DB                                  │
│  ├─ URL: preview-pr-123.pages.dev                               │
│  └─ Destroy: On PR close                                        │
│                                                                   │
│  Staging (Auto from main)                                        │
│  ├─ Deploy: On merge to main                                    │
│  ├─ Database: Persistent staging DB                             │
│  ├─ Tests: Full E2E suite + Performance                         │
│  ├─ URL: staging.your-domain.com                                │
│  └─ Promote: Manual approval to production                       │
│                                                                   │
│  Production (Manual approval)                                    │
│  ├─ Deploy: After staging tests pass                            │
│  ├─ Strategy: Canary (10% → 100%)                               │
│  ├─ Database: HA PostgreSQL with replicas                       │
│  ├─ Monitoring: Real-time error/perf tracking                   │
│  ├─ URL: your-domain.com                                        │
│  └─ Rollback: Automated on error spike                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Pre-Deployment Checklist

Before deploying to any environment, ensure:

### Development Setup
- [ ] Node.js 22+ installed
- [ ] `npm install` completed
- [ ] `.env.local` configured (see [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md))
- [ ] Local dev server working (`npm run dev`)
- [ ] Tests passing (`npm test`)

### Staging Setup
- [ ] Staging environment variables configured
- [ ] Staging database created
- [ ] Staging OAuth credentials configured
- [ ] GitHub Actions secrets added
- [ ] First deployment successful

### Production Setup
- [ ] Production environment variables configured
- [ ] Production database created (HA setup)
- [ ] Production OAuth credentials configured
- [ ] SSL certificate valid
- [ ] Monitoring configured (Sentry, PostHog)
- [ ] Alerts configured (Slack, PagerDuty)
- [ ] Backup strategy in place
- [ ] Rollback plan documented

---

## 🔄 Deployment Workflow

### Automated Deployment (Recommended)

```
1. Developer commits to feature branch
   └─> CI runs on PR (lint, test, build, security)

2. PR approved and merged to main
   └─> CD pipeline triggered

3. Staging deployment (automatic)
   ├─ Build application
   ├─ Deploy to staging
   ├─ Run database migrations
   ├─ Smoke tests
   └─ Full E2E test suite

4. Staging tests pass
   └─> Slack notification: "Ready for production"

5. Team reviews staging
   └─> Manual approval button

6. Production deployment (automated after approval)
   ├─ Create Sentry release
   ├─ Canary deploy (10% traffic)
   ├─ Monitor for 5 minutes
   ├─ Gradual rollout (10% → 50% → 100%)
   ├─ Database migrations (if any)
   └─ Post-deployment verification

7. Monitoring & rollback (automatic)
   ├─ Monitor error rates
   ├─ Monitor response times
   ├─ Auto-rollback if thresholds exceeded
   └─ Notify team of deployment status
```

### Manual Deployment (For exceptions)

See platform-specific guides:
- Cloudflare: `wrangler pages publish .next`
- AWS: `aws ecs update-service --force-new-deployment`
- GCP: `gcloud run deploy nextjs-app --source .`

---

## 🛠️ GitHub Actions Workflows

### Configured Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | Every PR, push to main | Run tests, linting, security |
| `reusable-test.yml` | Called by other workflows | Reusable test suite |
| `reusable-security-scan.yml` | Called by other workflows | Security scanning |
| `reusable-deploy.yml` | Called by other workflows | Common deployment logic |
| `deploy-cloudflare.yml` | Push to main | Deploy to Cloudflare Pages |
| `deploy-aws.yml` | Push to main | Deploy to AWS ECS |
| `deploy-gcp.yml` | Push to main | Deploy to GCP Cloud Run |
| `deploy-azure.yml` | Push to main | Deploy to Azure App Service |

### Required GitHub Secrets

Set these in GitHub repository settings → Secrets → Actions:

**For All Platforms:**
```
DATABASE_URL
NEXT_PUBLIC_APP_URL
CLERK_SECRET_KEY (or auth provider)
ARCJET_KEY
SENTRY_AUTH_TOKEN
```

**Platform-Specific:**
- **Cloudflare:** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- **AWS:** `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- **GCP:** `GCP_PROJECT_ID`, `GCP_SA_KEY`
- **Azure:** `AZURE_CREDENTIALS`

**Optional:**
```
SLACK_WEBHOOK (deployment notifications)
CODECOV_TOKEN (coverage reports)
```

---

## 🔒 Security & Compliance

### Security Scanning Layers

1. **Pre-commit:** Local secret scanning, linting
2. **PR Checks:** Dependency audit, CodeQL, Trivy
3. **SBOM Generation:** Software Bill of Materials (EO 14028 compliance)
4. **License Compliance:** MIT/Apache-2.0 only

### Security Best Practices

✅ **Implemented:**
- Secrets stored in GitHub Secrets / AWS Secrets Manager / GCP Secret Manager
- Automated dependency updates (Dependabot)
- Security scanning on every PR
- Container vulnerability scanning
- HTTPS everywhere
- SBOM generation

❌ **Never Do:**
- Commit secrets to git
- Use production credentials in development
- Deploy without security scan
- Skip dependency audits

---

## 📊 Monitoring & Observability

### Monitoring Stack

- **Sentry:** Error tracking and performance
- **PostHog:** Product analytics
- **BetterStack:** Structured logging
- **Platform metrics:** CPU, memory, network

### Key Metrics

Monitor these during deployment:

- **Error Rate:** < 1% (rollback if > 5%)
- **Response Time (P95):** < 500ms
- **Success Rate:** > 99%
- **Time to Interactive:** < 0.8s (Sprint 3 optimized!)

### Deployment Annotations

All deployments are marked in:
- Sentry releases
- Grafana annotations (if configured)
- Slack notifications

---

## 🚨 Rollback Procedures

### Automatic Rollback

Triggered when:
- Error rate > 5%
- Response time > 2s
- Health check fails

### Manual Rollback

```bash
# Trigger rollback via GitHub Actions
gh workflow run deploy-production.yml \
  --field deployment-type=rollback \
  --field rollback-to=v2024.11.14-123

# Or platform-specific:
# Cloudflare: wrangler pages deployment rollback <id>
# AWS: Update ECS service to previous task definition
# GCP: Route traffic to previous Cloud Run revision
```

### Database Rollback

All migrations are reversible:
```bash
npm run db:migrate:rollback
```

---

## 🎓 Learning Path

### For New Team Members

1. **Week 1: Development Workflow**
   - Read [CI_CD_GUIDE.md](./CI_CD_GUIDE.md) sections 1-6
   - Make first PR
   - Review PR process

2. **Week 2: Testing & Quality**
   - Read [CI_CD_GUIDE.md](./CI_CD_GUIDE.md) section 7
   - Write unit tests
   - Write E2E tests

3. **Week 3: Deployment**
   - Read [PLATFORM_DEPLOYMENT_GUIDE.md](./PLATFORM_DEPLOYMENT_GUIDE.md)
   - Deploy to staging
   - Shadow production deployment

4. **Week 4: Advanced Topics**
   - Read [CI_CD_GUIDE.md](./CI_CD_GUIDE.md) sections 9-12
   - Practice rollback
   - Configure monitoring

### For DevOps Engineers

1. Review all documentation
2. Set up platform-specific infrastructure
3. Configure GitHub Actions secrets
4. Test deployment pipeline
5. Set up monitoring and alerts
6. Document runbooks

---

## 📖 Additional Resources

### External Documentation
- **Next.js:** https://nextjs.org/docs
- **GitHub Actions:** https://docs.github.com/actions
- **Cloudflare Pages:** https://developers.cloudflare.com/pages
- **AWS ECS:** https://docs.aws.amazon.com/ecs
- **GCP Cloud Run:** https://cloud.google.com/run/docs

### Internal Documentation
- [Sprint 3 Optimizations](./SPRINT_3_INDEX.md) - Performance improvements
- [CLAUDE.md](./CLAUDE.md) - Project overview for AI assistants
- [MIGRATION.md](./MIGRATION.md) - Migration guide from older versions

---

## 🆘 Getting Help

### Troubleshooting

1. **Check the guides:**
   - CI/CD issues → [CI_CD_GUIDE.md](./CI_CD_GUIDE.md) Troubleshooting section
   - Platform issues → [PLATFORM_DEPLOYMENT_GUIDE.md](./PLATFORM_DEPLOYMENT_GUIDE.md)
   - Auth issues → [OAUTH_CONFIGURATION.md](./OAUTH_CONFIGURATION.md) Troubleshooting section

2. **Check workflow runs:**
   ```bash
   gh run list --limit 10
   gh run view <run-id> --log
   ```

3. **Check deployment status:**
   ```bash
   # Cloudflare
   wrangler pages deployment list

   # AWS
   aws ecs describe-services --cluster nextjs-production

   # GCP
   gcloud run services describe nextjs-app
   ```

### Common Issues

See [CI_CD_GUIDE.md Troubleshooting](./CI_CD_GUIDE.md#troubleshooting) for detailed solutions to:
- CI failing on main
- Deployment stuck
- Tests pass locally, fail in CI
- Slow CI pipeline
- Deployment rollback needed

---

## ✅ Status

**Project Status:** Production Ready

- ✅ CI/CD pipelines configured
- ✅ All platforms supported (Cloudflare, AWS, GCP, Azure)
- ✅ Security scanning integrated
- ✅ Automated deployments working
- ✅ Monitoring configured
- ✅ Rollback procedures tested
- ✅ Documentation complete

**Sprint 3 Optimizations:**
- First Load JS: 521.1 KB (29.7% reduction)
- Time to Interactive: ~0.78s on 4G
- Sentry lazy loading
- Package import optimization
- Zero vulnerabilities

---

**Ready to deploy!** 🚀

Choose your platform and follow the respective guide. All automation is in place.

---

**Last Updated:** November 15, 2025
**Maintained By:** DevOps Team
**Questions?** Check the guides above or ask in #deployment channel
