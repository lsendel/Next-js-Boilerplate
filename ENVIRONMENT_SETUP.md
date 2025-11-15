# Environment Setup Guide
## Complete Configuration for All Platforms

**Last Updated:** November 14, 2025 (Post-Sprint 3)
**Status:** Production Ready with 29.7% Bundle Optimization

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Environment Files Overview](#environment-files-overview)
3. [Platform-Specific Setup](#platform-specific-setup)
4. [Service Account Setup](#service-account-setup)
5. [Verification & Testing](#verification--testing)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

### For Local Development

```bash
# 1. Copy example environment file
cp .env.example .env

# 2. Update with your development values
# Edit .env and fill in at minimum:
# - DATABASE_URL (can use PGlite for development)
# - NEXT_PUBLIC_AUTH_PROVIDER=clerk
# - CLERK_SECRET_KEY=sk_test_...
# - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# 3. Start development server
npm run dev
```

###For Production Deployment

```bash
# 1. Choose your platform (Vercel/AWS/GCP/Azure/Cloudflare)

# 2. Copy appropriate template
cp .env.production.template .env.production

# 3. Fill in ALL required values (see checklist below)

# 4. Add environment variables to your platform
# (See platform-specific sections)

# 5. Deploy!
```

---

## Environment Files Overview

### File Structure

```
project-root/
├── .env                          # Local development (gitignored)
├── .env.local                    # Local overrides (gitignored)
├── .env.production               # Production config (gitignored)
├── .env.staging                  # Staging config (gitignored)
├── .env.example                  # Template (committed to git)
├── .env.production.template      # Production template (committed to git)
└── .env.staging.template         # Staging template (committed to git)
```

### Which File to Use?

| Environment | File to Create | Template to Copy From |
|-------------|----------------|----------------------|
| **Local Development** | `.env` | `.env.example` |
| **Staging** | `.env.staging` | `.env.staging.template` |
| **Production** | `.env.production` | `.env.production.template` |

### Environment Variable Priority

Next.js loads environment variables in this order (later overrides earlier):

1. `.env` - Defaults for all environments
2. `.env.local` - Local overrides (never committed)
3. `.env.development` - Development-specific
4. `.env.production` - Production-specific
5. Platform environment variables (Vercel, AWS, etc.) - Highest priority

---

## Platform-Specific Setup

### 1. Vercel (Recommended)

**Why Vercel:** Native Next.js support, zero config, global CDN, automatic SSL

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login

```bash
vercel login
```

#### Step 3: Link Project

```bash
# From project root
vercel link
```

#### Step 4: Add Environment Variables

**Option A: Via Dashboard (Recommended)**

1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add each variable from `.env.production.template`
5. Select environment: Production, Preview, or Development

**Option B: Via CLI**

```bash
# Add production variables
vercel env add NEXT_PUBLIC_APP_URL production
# Enter value when prompted

# Add secrets (more secure)
vercel secrets add database-url
# Enter value when prompted

# Reference secret in environment variable
vercel env add DATABASE_URL production
# Enter: @database-url
```

#### Required Variables for Vercel

```bash
# Minimum required
DATABASE_URL
NEXT_PUBLIC_AUTH_PROVIDER
CLERK_SECRET_KEY  # or other auth provider keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARCJET_KEY
NEXT_PUBLIC_SENTRY_DSN
NEXT_PUBLIC_POSTHOG_KEY
PASSWORD_PEPPER
ENCRYPTION_KEY
```

#### Step 5: Deploy

```bash
vercel --prod
```

#### Vercel-Specific Notes

- Environment variables are automatically available in build and runtime
- Automatic HTTPS with SSL certificates
- Preview deployments for PRs automatically created
- Edge network with global CDN
- Automatic optimization for Next.js

---

### 2. AWS (ECS/Fargate/Lambda)

**Why AWS:** Full control, enterprise compliance, existing AWS infrastructure

#### Prerequisites

- AWS Account with appropriate IAM permissions
- AWS CLI installed and configured
- Docker installed (for containerized deployments)

#### Step 1: Set Up AWS Secrets Manager

```bash
# Install AWS CLI
aws configure

# Create secret for sensitive values
aws secretsmanager create-secret \
  --name nextjs-production-secrets \
  --secret-string file://secrets.json \
  --region us-east-1

# secrets.json example:
{
  "DATABASE_URL": "postgresql://...",
  "CLERK_SECRET_KEY": "sk_live_...",
  "PASSWORD_PEPPER": "...",
  "ENCRYPTION_KEY": "..."
}
```

#### Step 2: Configure ECS Task Definition

```json
{
  "family": "nextjs-app",
  "containerDefinitions": [
    {
      "name": "nextjs",
      "image": "your-ecr-repo/nextjs-app:latest",
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "NEXT_PUBLIC_APP_URL",
          "value": "https://your-domain.com"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:nextjs-production-secrets:DATABASE_URL::"
        },
        {
          "name": "CLERK_SECRET_KEY",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:nextjs-production-secrets:CLERK_SECRET_KEY::"
        }
      ]
    }
  ]
}
```

#### Step 3: Deploy via GitHub Actions

The project includes `.github/workflows/deploy-aws.yml`. Add these GitHub Secrets:

```bash
# Required GitHub Secrets
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
AWS_ECR_REPOSITORY
AWS_ECS_CLUSTER
AWS_ECS_SERVICE

# Plus all environment variables from .env.production.template
```

#### Step 4: Push to Deploy

```bash
git push origin main
```

---

### 3. Google Cloud Platform (Cloud Run)

**Why GCP:** Serverless containers, global network, Google Cloud ecosystem

#### Step 1: Install gcloud CLI

```bash
curl https://sdk.cloud.google.com | bash
gcloud init
```

#### Step 2: Set Up Secret Manager

```bash
# Create secrets
echo -n "postgresql://..." | gcloud secrets create database-url --data-file=-
echo -n "sk_live_..." | gcloud secrets create clerk-secret-key --data-file=-

# Grant Cloud Run access to secrets
gcloud secrets add-iam-policy-binding database-url \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

#### Step 3: Deploy to Cloud Run

```bash
# Build and deploy
gcloud run deploy nextjs-app \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,NEXT_PUBLIC_APP_URL=https://your-domain.com" \
  --set-secrets="DATABASE_URL=database-url:latest,CLERK_SECRET_KEY=clerk-secret-key:latest"
```

#### Or Use GitHub Actions

Add these GitHub Secrets:

```bash
GCP_PROJECT_ID
GCP_SA_KEY  # Service account JSON key
GCP_REGION
```

Push to deploy:

```bash
git push origin main
```

---

### 4. Azure (App Service / Container Apps)

**Why Azure:** Microsoft ecosystem, Azure AD integration, enterprise support

#### Step 1: Install Azure CLI

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
az login
```

#### Step 2: Create Key Vault

```bash
# Create resource group
az group create --name nextjs-rg --location eastus

# Create Key Vault
az keyvault create \
  --name nextjs-kv \
  --resource-group nextjs-rg \
  --location eastus

# Add secrets
az keyvault secret set --vault-name nextjs-kv --name DATABASE-URL --value "postgresql://..."
az keyvault secret set --vault-name nextjs-kv --name CLERK-SECRET-KEY --value "sk_live_..."
```

#### Step 3: Deploy to App Service

```bash
# Create App Service plan
az appservice plan create \
  --name nextjs-plan \
  --resource-group nextjs-rg \
  --sku B1 \
  --is-linux

# Create web app
az webapp create \
  --resource-group nextjs-rg \
  --plan nextjs-plan \
  --name nextjs-app \
  --deployment-container-image-name your-acr.azurecr.io/nextjs:latest

# Configure environment variables
az webapp config appsettings set \
  --resource-group nextjs-rg \
  --name nextjs-app \
  --settings NODE_ENV=production NEXT_PUBLIC_APP_URL=https://nextjs-app.azurewebsites.net

# Reference Key Vault secrets
az webapp config appsettings set \
  --resource-group nextjs-rg \
  --name nextjs-app \
  --settings DATABASE_URL="@Microsoft.KeyVault(SecretUri=https://nextjs-kv.vault.azure.net/secrets/DATABASE-URL)"
```

---

### 5. Cloudflare Pages

**Why Cloudflare:** Excellent performance, free tier, Cloudflare Access integration

#### Step 1: Install Wrangler

```bash
npm install -g wrangler
wrangler login
```

#### Step 2: Configure Environment Variables

```bash
# Via Cloudflare Dashboard
# 1. Go to Pages project settings
# 2. Environment Variables
# 3. Add variables for Production

# Or via wrangler
wrangler pages secret put DATABASE_URL
wrangler pages secret put CLERK_SECRET_KEY
```

#### Step 3: Deploy

```bash
# Manual deployment
wrangler pages publish

# Or via GitHub Actions (already configured)
git push origin main
```

---

## Service Account Setup

### Required Services

#### 1. Database (PostgreSQL)

**Recommended Providers:**

| Provider | Tier | Cost | Notes |
|----------|------|------|-------|
| **Neon** | Free tier available | $0-19/mo | Serverless, excellent for development |
| **Supabase** | Free tier available | $0-25/mo | Includes auth & storage |
| **Prisma Postgres** | Pay as you go | Varies | Managed by Prisma team |
| **AWS RDS** | No free tier | ~$15/mo+ | Enterprise grade |
| **Google Cloud SQL** | No free tier | ~$10/mo+ | Integrated with GCP |

**Setup Steps:**

1. Create database instance
2. Create database: `CREATE DATABASE nextjs_production;`
3. Create user with appropriate permissions
4. Get connection string
5. Add to DATABASE_URL environment variable

**Connection String Format:**
```
postgresql://username:password@host:port/database?sslmode=require
```

#### 2. Authentication (Choose ONE)

##### Clerk (Recommended)

1. Sign up at https://clerk.com
2. Create application
3. Get API keys from Dashboard
4. Add to environment:
   ```bash
   NEXT_PUBLIC_AUTH_PROVIDER=clerk
   CLERK_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   ```

##### Cloudflare Access

1. Configure Cloudflare Access in dashboard
2. Get team domain and audience tag
3. Add to environment:
   ```bash
   NEXT_PUBLIC_AUTH_PROVIDER=cloudflare
   NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN=https://your-team.cloudflareaccess.com
   NEXT_PUBLIC_CLOUDFLARE_AUDIENCE=your_audience_tag
   NEXT_PUBLIC_CLOUDFLARE_VERIFY_JWT=true
   ```

##### AWS Cognito

1. Create User Pool in AWS Console
2. Create App Client
3. Configure OAuth settings
4. Get credentials and add to environment

#### 3. Monitoring

##### Sentry (Error Tracking)

**Sprint 3 Note:** Sentry is lazy-loaded for performance (~220 KB savings!)

1. Sign up at https://sentry.io
2. Create project
3. Get DSN from project settings
4. Add to environment:
   ```bash
   NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
   SENTRY_ORG=your-org
   SENTRY_PROJECT=your-project
   SENTRY_AUTH_TOKEN=... # For source maps
   ```

##### PostHog (Analytics)

**Sprint 3 Note:** PostHog is already lazy-loaded!

1. Sign up at https://posthog.com
2. Create project
3. Get API key
4. Add to environment:
   ```bash
   NEXT_PUBLIC_POSTHOG_KEY=phc_...
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

#### 4. Security

##### Arcjet (Bot Protection & Rate Limiting)

1. Sign up at https://arcjet.com
2. Create site
3. Get API key
4. Add to environment:
   ```bash
   ARCJET_KEY=ajkey_...
   ARCJET_ENV=production
   ```

##### Generate Security Keys

```bash
# Password Pepper (32+ characters)
openssl rand -hex 32

# Encryption Key (32+ characters)
openssl rand -hex 32

# Add to environment:
PASSWORD_PEPPER=generated_hex_string
ENCRYPTION_KEY=generated_hex_string
```

---

## Verification & Testing

### Pre-Deployment Checklist

Use this checklist before deploying to any environment:

#### Environment Variables

- [ ] `NODE_ENV` set correctly (`production` for prod/staging)
- [ ] `NEXT_PUBLIC_APP_URL` matches deployment URL
- [ ] `DATABASE_URL` points to correct database
- [ ] `NEXT_PUBLIC_AUTH_PROVIDER` set (NOT `test` in production)
- [ ] Auth provider keys are correct for environment
- [ ] `PASSWORD_PEPPER` is unique (32+ chars)
- [ ] `ENCRYPTION_KEY` is unique (32+ chars)
- [ ] `ARCJET_KEY` is set
- [ ] `NEXT_PUBLIC_SENTRY_DSN` is set
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` is set
- [ ] All REPLACE_WITH_* placeholders filled in

#### Security

- [ ] `.env`, `.env.local`, `.env.production` in .gitignore
- [ ] No secrets committed to git
- [ ] Different secrets for dev/staging/production
- [ ] SSL certificate configured
- [ ] Security alert webhook configured

#### Database

- [ ] Database accessible from deployment platform
- [ ] Migrations run successfully
- [ ] Database backups configured
- [ ] Connection pooling configured (if needed)

#### Build

- [ ] `npm run build` succeeds locally
- [ ] No TypeScript errors (`npm run check:types`)
- [ ] No linting errors (`npm run lint`)
- [ ] Tests passing (`npm run test`)

### Post-Deployment Verification

After deploying, verify everything works:

#### 1. Basic Connectivity

```bash
# Check homepage loads
curl -I https://your-domain.com
# Expected: HTTP/2 200

# Check API route
curl https://your-domain.com/api/auth/csrf
# Expected: JSON response with CSRF token

# Check SSL
curl -vI https://your-domain.com 2>&1 | grep "SSL certificate"
# Expected: Valid certificate
```

#### 2. Performance Verification

**Sprint 3 Optimizations:**

```bash
# Run Lighthouse
npx lighthouse https://your-domain.com --only-categories=performance
# Expected: Score > 90

# Check First Load JS
# 1. Open DevTools → Network
# 2. Filter by JS
# 3. Check total size
# Expected: ~521 KB (Sprint 3 optimized!)

# Verify Sentry lazy loading
# 1. Open DevTools → Network
# 2. Look for Sentry requests
# Expected: Loads ~200ms AFTER page interactive
```

#### 3. Feature Testing

Manual verification:

- [ ] Homepage renders correctly
- [ ] Can navigate to /sign-in
- [ ] Can sign in successfully
- [ ] Dashboard accessible after auth
- [ ] Locale switching works
- [ ] No console errors
- [ ] Error tracking works (test with throw)
- [ ] Analytics tracking works

#### 4. Monitoring Verification

Check dashboards:

- [ ] **Sentry**: Errors appear in dashboard
- [ ] **PostHog**: Page views tracked
- [ ] **BetterStack**: Logs flowing
- [ ] **Arcjet**: Bot protection active

---

## Troubleshooting

### Common Issues

#### Issue: Environment Variables Not Loading

**Symptoms:** App can't connect to database, auth doesn't work

**Diagnosis:**
```bash
# Check variables are set
echo $DATABASE_URL
# Should output connection string

# In Node.js
console.log(process.env.DATABASE_URL);
```

**Solutions:**
1. Verify variables added to platform (Vercel/AWS/etc.)
2. Check variable names match exactly (case-sensitive)
3. Restart deployment after adding variables
4. Check `.env.production` file exists (if using file-based config)
5. Verify no typos in variable names

#### Issue: Database Connection Fails

**Symptoms:** `ECONNREFUSED`, `Connection timeout`

**Diagnosis:**
```bash
# Test connection string locally
psql "postgresql://user:pass@host:port/db" -c "SELECT 1"
```

**Solutions:**
1. Check database host is accessible from deployment platform
2. Verify database allows connections from deployment IPs
3. Check SSL mode if required: `?sslmode=require`
4. Verify credentials are correct
5. Check firewall rules
6. For AWS RDS: Check security groups
7. For GCP Cloud SQL: Enable Cloud SQL Admin API

#### Issue: Auth Provider Not Working

**Symptoms:** Can't sign in, 401 errors, redirect loops

**Diagnosis:**
```bash
# Check auth provider value
echo $NEXT_PUBLIC_AUTH_PROVIDER
# Should be: clerk, cloudflare, or cognito (NOT test!)

# Check provider keys
echo $CLERK_SECRET_KEY
# Should start with sk_live_ for production
```

**Solutions:**
1. Verify `NEXT_PUBLIC_AUTH_PROVIDER` is set correctly
2. Check API keys are for correct environment (prod vs dev)
3. Verify redirect URLs configured in provider dashboard
4. Check domain whitelist in provider settings
5. For Clerk: Verify Application ID matches
6. For Cloudflare: Check audience tag is correct
7. Test with provider's debug/test mode first

#### Issue: Build Fails

**Symptoms:** Deployment fails during build

**Diagnosis:**
```bash
# Try building locally
npm run build

# Check TypeScript
npm run check:types

# Check for missing dependencies
npm install
```

**Solutions:**
1. Fix TypeScript errors
2. Update dependencies if needed
3. Clear `.next` directory: `npm run clean`
4. Check Node version matches production (20+)
5. Verify all imports resolve correctly

#### Issue: Performance Slower Than Expected

**Symptoms:** TTI > 1s, slow page loads

**Diagnosis:**
```bash
# Check bundle size
npm run build | grep "First Load JS"
# Expected: ~521 KB

# Verify lazy loading
# Check DevTools → Network
# Sentry should load after ~200ms
```

**Solutions:**
1. Verify Sprint 3 optimizations applied
2. Check Sentry is lazy loading (not eager)
3. Check PostHog is lazy loading
4. Run bundle analyzer: `ANALYZE=true npm run build-stats`
5. Check for large images not optimized
6. Verify CDN caching enabled

---

## Environment Variables Quick Reference

### Critical Variables (Required for All Environments)

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Database
DATABASE_URL=postgresql://...

# Auth (choose ONE provider)
NEXT_PUBLIC_AUTH_PROVIDER=clerk
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...

# Security
PASSWORD_PEPPER=32_char_random_string
ENCRYPTION_KEY=32_char_random_string
ARCJET_KEY=ajkey_...

# Monitoring (Sprint 3: Lazy Loaded!)
NEXT_PUBLIC_SENTRY_DSN=https://...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
```

### Platform Environment Variable Limits

| Platform | Max Variables | Max Value Size | Notes |
|----------|---------------|----------------|-------|
| Vercel | Unlimited | 4 KB | Per variable |
| AWS ECS | 50 per task | 4 KB | Use Secrets Manager for more |
| GCP Cloud Run | 100 | 32 KB | Total size |
| Azure App Service | Unlimited | 8 KB | Per variable |
| Cloudflare Pages | 50 | 5 KB | Per variable |

---

## Next Steps

After setting up all environments:

1. **Test thoroughly** - Use checklist above
2. **Set up monitoring** - Configure alerts in Sentry, PostHog
3. **Document specifics** - Note your platform choice, database provider, etc.
4. **Create backups** - Database, environment variable exports
5. **Schedule reviews** - Review and rotate secrets every 90 days

---

**Need Help?**

- Check `DEPLOYMENT_GUIDE.md` for platform-specific deployment steps
- Review `.env.production.template` for complete variable list
- See `SPRINT_3_RETROSPECTIVE.md` for performance optimization details

---

**Last Updated:** November 14, 2025
**Sprint 3 Status:** Complete (29.7% bundle reduction)
**Production Ready:** ✅ YES
