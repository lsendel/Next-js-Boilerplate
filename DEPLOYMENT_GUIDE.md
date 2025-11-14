# Production Deployment Guide

**Project:** Next.js 16 Boilerplate (Sprint 3 Optimized)
**Date:** November 14, 2025
**Version:** Post-Sprint 3 (29.7% bundle reduction)
**Status:** ✅ Production Ready

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Platform-Specific Deployment](#platform-specific-deployment)
4. [Post-Deployment Verification](#post-deployment-verification)
5. [Monitoring & Alerts](#monitoring--alerts)
6. [Rollback Procedure](#rollback-procedure)
7. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### ✅ Code Quality

- [x] Production build successful (`npm run build-local`)
- [x] Zero TypeScript errors
- [x] Zero security vulnerabilities (`npm audit`)
- [x] All tests passing (`npm run test`)
- [x] No console errors in development

### ✅ Performance

- [x] First Load JS: **521.1 KB** (29.7% reduction from baseline)
- [x] Sentry lazy loading implemented
- [x] Package imports optimized
- [x] Bundle analysis complete

### ✅ Security

- [x] 0 vulnerabilities in production dependencies
- [x] Environment variables properly configured
- [x] Secrets not committed to git
- [x] `.env.local` gitignored
- [x] Authentication configured (Clerk/Cloudflare/Cognito)

### ✅ Documentation

- [x] Sprint 3 documentation complete
- [x] CLAUDE.md updated with project structure
- [x] README.md contains deployment instructions
- [x] Environment variables documented

---

## Environment Configuration

### Required Environment Variables

Create a `.env.production` file (gitignored) with these variables:

```bash
# ============================================
# PRODUCTION ENVIRONMENT VARIABLES
# ============================================

# Node Environment
NODE_ENV=production

# Application
NEXT_PUBLIC_APP_URL=https://your-production-domain.com

# ============================================
# DATABASE
# ============================================

# PostgreSQL Connection
DATABASE_URL=postgresql://user:password@host:5432/database
# Recommended: Prisma Postgres, Supabase, or Neon

# ============================================
# AUTHENTICATION
# ============================================

# Choose ONE authentication provider
NEXT_PUBLIC_AUTH_PROVIDER=clerk  # Options: clerk, cloudflare, cognito, test

# Clerk (if using)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Cloudflare Access (if using)
NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN=https://your-team.cloudflareaccess.com
NEXT_PUBLIC_CLOUDFLARE_AUDIENCE=your-audience-tag
NEXT_PUBLIC_CLOUDFLARE_VERIFY_JWT=true

# AWS Cognito (if using)
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_xxxxx
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxx
NEXT_PUBLIC_COGNITO_REGION=us-east-1

# ============================================
# MONITORING
# ============================================

# Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@o xxxxx.ingest.us.sentry.io/xxxxx
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
# Note: Sentry is lazy-loaded for performance

# PostHog (Analytics) - already lazy-loaded
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# ============================================
# SECURITY
# ============================================

# Arcjet (Shield WAF + Bot Detection)
ARCJET_KEY=ajkey_xxxxx
ARCJET_ENV=production

# ============================================
# LOGGING
# ============================================

# Better Stack (LogTape integration)
LOGTAIL_SOURCE_TOKEN=xxxxx

# ============================================
# INTERNATIONALIZATION
# ============================================

# Default locale (defined in src/utils/AppConfig.ts)
# No env var needed - configured in code

# ============================================
# EMAIL (Optional)
# ============================================

# Resend (if using email features)
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@your-domain.com

# ============================================
# BUILD CONFIGURATION
# ============================================

# Disable source maps in production (optional, for security)
GENERATE_SOURCEMAP=false

# Enable bundle analysis (optional, for debugging)
ANALYZE=false
```

### Optional Environment Variables

```bash
# Feature Flags
NEXT_PUBLIC_FEATURE_BLOG=true
NEXT_PUBLIC_FEATURE_MULTI_TENANT=true
NEXT_PUBLIC_FEATURE_ANALYTICS=true

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000

# CORS
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

---

## Platform-Specific Deployment

### Option 1: Vercel (Recommended)

**Why Vercel:**
- Native Next.js 16 support
- Edge network with global CDN
- Automatic SSL certificates
- Preview deployments for PRs
- Built-in analytics

**Steps:**

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Link Project**
   ```bash
   vercel link
   ```

4. **Add Environment Variables**
   ```bash
   # Via Vercel Dashboard
   # Project Settings → Environment Variables
   # Add all variables from .env.production

   # OR via CLI
   vercel env add NEXT_PUBLIC_APP_URL production
   # Repeat for each variable
   ```

5. **Deploy to Production**
   ```bash
   # Deploy and promote to production
   vercel --prod

   # OR push to main branch (auto-deploy)
   git push origin main
   ```

6. **Verify Deployment**
   - Check deployment logs in Vercel Dashboard
   - Visit production URL
   - Test authentication flow
   - Verify Sentry lazy loading (check Network tab)

**Vercel-Specific Configuration:**

```json
// vercel.json (optional)
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],  // Choose closest to your database
  "env": {
    "DATABASE_URL": "@database_url"  // Reference Vercel secrets
  }
}
```

---

### Option 2: AWS (with deployment workflows)

**Why AWS:**
- Full control over infrastructure
- Enterprise compliance requirements
- Existing AWS ecosystem

**Prerequisites:**
- AWS account with appropriate permissions
- PostgreSQL database (RDS or Aurora)
- S3 bucket for static assets
- CloudFront CDN (optional but recommended)

**Steps:**

1. **Configure AWS Credentials**
   ```bash
   # Create IAM user with permissions:
   # - ECS/Fargate (for containers)
   # - S3 (for static assets)
   # - CloudFront (for CDN)
   # - RDS (for database)

   # Add to GitHub Secrets:
   # AWS_ACCESS_KEY_ID
   # AWS_SECRET_ACCESS_KEY
   # AWS_REGION
   ```

2. **Set Up Database**
   ```bash
   # Create RDS PostgreSQL instance
   # Recommended: PostgreSQL 16+
   # Instance: db.t3.micro or larger
   # Storage: 20GB SSD minimum

   # Get connection string:
   DATABASE_URL=postgresql://user:pass@db-instance.region.rds.amazonaws.com:5432/dbname
   ```

3. **Deploy Using GitHub Actions**
   ```bash
   # The repo includes `.github/workflows/deploy-aws.yml`

   # Add required GitHub Secrets:
   # - All environment variables from .env.production
   # - AWS credentials

   # Push to main branch to trigger deployment
   git push origin main
   ```

4. **Manual Deployment (Alternative)**
   ```bash
   # Build Docker container
   docker build -t next-app .

   # Push to Amazon ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin xxxxx.dkr.ecr.us-east-1.amazonaws.com
   docker tag next-app:latest xxxxx.dkr.ecr.us-east-1.amazonaws.com/next-app:latest
   docker push xxxxx.dkr.ecr.us-east-1.amazonaws.com/next-app:latest

   # Deploy to ECS/Fargate
   aws ecs update-service --cluster next-cluster --service next-service --force-new-deployment
   ```

---

### Option 3: Google Cloud Platform

**Why GCP:**
- Google Cloud ecosystem integration
- Cloud Run for serverless containers
- Global network

**Steps:**

1. **Configure GCP**
   ```bash
   # Install gcloud CLI
   curl https://sdk.cloud.google.com | bash

   # Login
   gcloud auth login

   # Set project
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Set Up Database**
   ```bash
   # Create Cloud SQL PostgreSQL instance
   gcloud sql instances create next-app-db \
     --database-version=POSTGRES_16 \
     --tier=db-f1-micro \
     --region=us-central1

   # Create database
   gcloud sql databases create nextapp --instance=next-app-db

   # Get connection string
   gcloud sql instances describe next-app-db --format='value(connectionName)'
   ```

3. **Deploy to Cloud Run**
   ```bash
   # Deploy using GitHub Actions workflow
   # File: .github/workflows/deploy-gcp.yml

   # Add GitHub Secrets:
   # - GCP_PROJECT_ID
   # - GCP_SA_KEY (service account JSON)
   # - All environment variables

   # Push to main
   git push origin main
   ```

---

### Option 4: Azure

**Why Azure:**
- Microsoft ecosystem integration
- Azure AD authentication
- Enterprise support

**Steps:**

1. **Configure Azure**
   ```bash
   # Install Azure CLI
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

   # Login
   az login
   ```

2. **Set Up Database**
   ```bash
   # Create Azure Database for PostgreSQL
   az postgres flexible-server create \
     --resource-group next-app-rg \
     --name next-app-db \
     --location eastus \
     --admin-user dbadmin \
     --admin-password <secure-password> \
     --sku-name Standard_B1ms \
     --version 16
   ```

3. **Deploy to Azure Container Apps**
   ```bash
   # Using GitHub Actions workflow
   # File: .github/workflows/deploy-azure.yml

   # Add GitHub Secrets:
   # - AZURE_CREDENTIALS
   # - All environment variables

   # Push to main
   git push origin main
   ```

---

### Option 5: Cloudflare Pages

**Why Cloudflare:**
- Excellent performance (Cloudflare network)
- Free tier with good limits
- Integrated with Cloudflare Access auth

**Steps:**

1. **Configure Cloudflare**
   ```bash
   # Install Wrangler
   npm install -g wrangler

   # Login
   wrangler login
   ```

2. **Deploy**
   ```bash
   # Using GitHub Actions workflow
   # File: .github/workflows/deploy-cloudflare.yml

   # Add GitHub Secrets:
   # - CLOUDFLARE_API_TOKEN
   # - CLOUDFLARE_ACCOUNT_ID
   # - All environment variables

   # Push to main
   git push origin main
   ```

---

## Post-Deployment Verification

### Automated Checks

Run these after deployment:

```bash
# 1. Check HTTP status
curl -I https://your-production-domain.com
# Expected: HTTP/2 200

# 2. Verify SSL certificate
curl -vI https://your-production-domain.com 2>&1 | grep SSL
# Expected: Valid SSL certificate

# 3. Check First Load JS
# Open browser DevTools → Network
# Filter by JS
# Check total size of initial JS load
# Expected: ~521 KB (gzipped significantly less)

# 4. Verify Sentry lazy loading
# Open DevTools → Network
# Look for Sentry bundle loading
# Expected: Loads after page interactive (~200ms delay)

# 5. Test authentication
# Visit /sign-in
# Expected: Auth page loads correctly

# 6. Check API routes
curl https://your-production-domain.com/api/auth/user
# Expected: 401 or valid response

# 7. Verify CSP headers
curl -I https://your-production-domain.com | grep -i "content-security"
# Expected: CSP headers present (via Arcjet)
```

### Manual Verification Checklist

- [ ] Homepage loads correctly
- [ ] Navigation works (all routes)
- [ ] Sign-in flow works
- [ ] Sign-up flow works
- [ ] Dashboard accessible after auth
- [ ] Locale switching works
- [ ] No console errors
- [ ] Sentry captures test error
- [ ] PostHog tracks pageview
- [ ] Images load correctly
- [ ] Mobile responsive
- [ ] Performance acceptable (< 0.8s TTI on 4G)

### Performance Testing

```bash
# Option 1: Lighthouse CI
npm install -g @lhci/cli
lhci autorun --collect.url=https://your-production-domain.com

# Option 2: WebPageTest
# Visit: https://www.webpagetest.org
# Enter your production URL
# Check Performance grade

# Option 3: Chrome DevTools
# Open DevTools → Lighthouse
# Run Performance audit
# Expected: Score > 90
```

---

## Monitoring & Alerts

### Sentry (Error Monitoring)

**Dashboard:** https://sentry.io

**Key Metrics to Watch:**
- Error rate (should be < 1%)
- Issue frequency
- User impact
- Performance degradation

**Recommended Alerts:**
```javascript
// Sentry Alert Rules
{
  "conditions": [
    {
      "id": "sentry.rules.conditions.first_seen_event.FirstSeenEventCondition"
    },
    {
      "id": "sentry.rules.conditions.regression_event.RegressionEventCondition"
    }
  ],
  "actions": [
    {
      "id": "sentry.mail.actions.NotifyEmailAction",
      "targetType": "Team",
      "targetIdentifier": "your-team-id"
    }
  ]
}
```

### PostHog (Analytics)

**Dashboard:** https://app.posthog.com

**Key Metrics:**
- Page views
- User sessions
- Conversion funnel
- Feature usage

### Better Stack (Logging)

**Dashboard:** https://logs.betterstack.com

**Log Levels:**
- ERROR: Immediate attention required
- WARN: Potential issues
- INFO: General information
- DEBUG: Development only

### Vercel Analytics (if using Vercel)

**Metrics:**
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

**Targets:**
- TTFB: < 600ms
- FCP: < 1.8s
- LCP: < 2.5s
- CLS: < 0.1

---

## Rollback Procedure

### Vercel Rollback

```bash
# Option 1: Via Dashboard
# 1. Go to Vercel Dashboard
# 2. Select project
# 3. Deployments tab
# 4. Find previous successful deployment
# 5. Click "..." → "Promote to Production"

# Option 2: Via CLI
vercel rollback
# Select deployment to rollback to
```

### AWS/GCP/Azure Rollback

```bash
# Re-deploy previous version
git revert HEAD
git push origin main

# OR manually deploy previous Docker image
docker pull xxxxx.ecr.region.amazonaws.com/next-app:previous-tag
# Deploy using platform-specific commands
```

### Emergency Rollback

```bash
# If critical issue:
# 1. Immediately rollback to last known good version
# 2. Notify team via Slack/email
# 3. Investigate issue in staging environment
# 4. Fix and re-deploy
```

---

## Troubleshooting

### Issue: Build Fails

**Symptoms:** CI/CD pipeline fails, deployment doesn't complete

**Diagnosis:**
```bash
# Check build logs
npm run build 2>&1 | tee build.log

# Check TypeScript errors
npm run check:types

# Check linting
npm run lint
```

**Solutions:**
- Fix TypeScript errors
- Resolve dependency conflicts
- Check environment variables are set
- Verify Node.js version (requires 20+)

---

### Issue: 500 Internal Server Error

**Symptoms:** Homepage returns 500 error

**Diagnosis:**
```bash
# Check server logs
# Vercel: Dashboard → Deployment → Runtime Logs
# AWS: CloudWatch Logs
# GCP: Cloud Logging

# Check database connection
psql $DATABASE_URL -c "SELECT 1"
```

**Solutions:**
- Verify DATABASE_URL is correct
- Check database is accessible from deployment
- Verify environment variables are set
- Check Sentry for error details

---

### Issue: Authentication Not Working

**Symptoms:** Can't sign in, 401 errors

**Diagnosis:**
```bash
# Check auth provider environment variables
echo $NEXT_PUBLIC_AUTH_PROVIDER
# Should be: clerk, cloudflare, cognito, or test

# Check provider-specific variables
# Clerk:
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
echo $CLERK_SECRET_KEY

# Cloudflare:
echo $NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN
echo $NEXT_PUBLIC_CLOUDFLARE_AUDIENCE
```

**Solutions:**
- Verify auth provider is set correctly
- Check API keys are valid
- Verify domain whitelist in provider dashboard
- Check middleware is running (check server logs)

---

### Issue: Slow Performance

**Symptoms:** TTI > 1s, slow page loads

**Diagnosis:**
```bash
# Check bundle size
npm run build
# Look for "First Load JS" in output

# Run Lighthouse
npx lighthouse https://your-domain.com --view

# Check Sentry Performance tab
# Look for slow transactions
```

**Solutions:**
- Verify Sentry lazy loading is working
- Check for large images (should be Next.js Image optimized)
- Review bundle analyzer for unnecessary imports
- Check database query performance

---

### Issue: Sentry Not Capturing Errors

**Symptoms:** No errors showing in Sentry dashboard

**Diagnosis:**
```bash
# Check Sentry DSN is set
echo $NEXT_PUBLIC_SENTRY_DSN

# Test Sentry manually
# Visit: https://your-domain.com
# Open DevTools Console
# Type: throw new Error("Test Sentry")
# Wait 10-30 seconds
# Check Sentry dashboard
```

**Solutions:**
- Verify NEXT_PUBLIC_SENTRY_DSN is correct
- Check Sentry is initializing (DevTools → Network → look for Sentry requests after ~200ms)
- Verify project/org settings in Sentry dashboard
- Check rate limits not exceeded

---

### Issue: Database Migrations Not Running

**Symptoms:** Database schema out of sync

**Diagnosis:**
```bash
# Check migration status
npx drizzle-kit check

# List migrations
ls -la migrations/
```

**Solutions:**
```bash
# Run migrations manually
npm run db:migrate

# OR in production environment
DATABASE_URL=your-prod-url npm run db:migrate

# Verify schema
npx drizzle-kit push
```

---

## Security Checklist

Before going to production:

- [ ] All secrets in environment variables (not hardcoded)
- [ ] `.env.local` and `.env.production` in .gitignore
- [ ] HTTPS enforced (automatic on Vercel/Cloudflare)
- [ ] CSP headers configured (via Arcjet)
- [ ] Authentication working correctly
- [ ] Rate limiting active (via Arcjet)
- [ ] SQL injection prevention (via Drizzle ORM)
- [ ] XSS prevention (React escapes by default)
- [ ] CORS properly configured
- [ ] Secrets rotated from development values

---

## Performance Checklist

- [ ] First Load JS < 550 KB ✅ (currently 521.1 KB)
- [ ] Sentry lazy loading working ✅
- [ ] PostHog lazy loading working ✅
- [ ] Images using Next.js Image component
- [ ] Fonts optimized (next/font)
- [ ] No console.log in production
- [ ] Source maps uploaded to Sentry
- [ ] CDN caching configured
- [ ] Compression enabled (gzip/brotli)

---

## Support & Resources

### Documentation
- Main README: `/README.md`
- Sprint 3 Retrospective: `/SPRINT_3_RETROSPECTIVE.md`
- Project Instructions: `/CLAUDE.md`
- Migration Guide: `/MIGRATION.md`

### External Resources
- Next.js Deployment: https://nextjs.org/docs/deployment
- Vercel Docs: https://vercel.com/docs
- Sentry Docs: https://docs.sentry.io
- Clerk Docs: https://clerk.com/docs

### Getting Help
1. Check Sentry for error details
2. Review deployment logs
3. Check GitHub Issues
4. Contact platform support (Vercel/AWS/etc.)

---

## Post-Deployment Tasks

After successful deployment:

1. **Update Documentation**
   - Document production URL
   - Update README with deployment info
   - Note any platform-specific configurations

2. **Set Up Monitoring**
   - Configure Sentry alerts
   - Set up uptime monitoring (e.g., UptimeRobot, Checkly)
   - Configure log aggregation

3. **Team Notification**
   - Announce deployment to team
   - Share production URL
   - Document any changes from staging

4. **Create Snapshot**
   - Tag release in git
   - Document deployment date
   - Note bundle size and performance metrics

5. **Schedule Review**
   - Review performance metrics after 24 hours
   - Check error rates
   - Analyze user feedback

---

## Deployment Command Quick Reference

```bash
# Clean and build
npm run clean && npm run build-local

# Run tests
npm run test

# Security audit
npm audit --production

# Deploy to Vercel
vercel --prod

# Deploy to AWS (via GitHub Actions)
git push origin main

# Rollback (Vercel)
vercel rollback

# Check deployment status
vercel ls

# View logs (Vercel)
vercel logs

# Check bundle size
npm run build | grep "First Load JS"
```

---

## Conclusion

Your Next.js boilerplate is now optimized and ready for production deployment with:

✅ **29.7% faster bundle** (521.1 KB vs 740.7 KB baseline)
✅ **Zero security vulnerabilities**
✅ **Lazy-loaded monitoring** (Sentry, PostHog)
✅ **Production-grade authentication** (Clerk/Cloudflare/Cognito)
✅ **Comprehensive error tracking**
✅ **Performance monitoring**

Follow this guide for a safe, successful deployment. Good luck! 🚀

---

**Deployment Checklist:**
- [ ] Environment variables configured
- [ ] Database set up and migrated
- [ ] Build successful
- [ ] Tests passing
- [ ] Security audit clean
- [ ] Deployment executed
- [ ] Post-deployment verification complete
- [ ] Monitoring configured
- [ ] Team notified

**Last Updated:** November 14, 2025
**Sprint:** 3 (Bundle Optimization Complete)
**Status:** 🟢 Ready for Production
