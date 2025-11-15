# Platform Deployment Guide
## Step-by-Step Instructions for Cloudflare, AWS, and GCP

**Last Updated:** November 15, 2025
**Sprint 3 Optimized:** 29.7% Bundle Reduction Applied

> **📖 For CI/CD workflows, branch strategy, and automation:** See [CI_CD_GUIDE.md](./CI_CD_GUIDE.md)
>
> This guide covers **manual deployment** and **platform-specific setup**. For the complete CI/CD pipeline, automated deployments, environment promotion, and best practices, refer to the CI/CD Guide.

---

## Table of Contents

1. [Cloudflare Pages Deployment](#cloudflare-pages-deployment)
2. [AWS Deployment (ECS/Fargate)](#aws-deployment-ecsfargate)
3. [Google Cloud Platform Deployment](#google-cloud-platform-deployment)
4. [Post-Deployment Verification](#post-deployment-verification)

**Related Guides:**
- [CI/CD Guide](./CI_CD_GUIDE.md) - Complete CI/CD workflows and best practices
- [OAuth Configuration](./OAUTH_CONFIGURATION.md) - Authentication setup
- [Environment Setup](./ENVIRONMENT_SETUP.md) - Environment variables and secrets

---

## Cloudflare Pages Deployment

### Overview

- **Best for:** Sites already using Cloudflare DNS
- **Pros:** Free tier, excellent performance, edge network
- **Deployment Time:** 10-15 minutes
- **Monthly Cost:** Free for most use cases

### Prerequisites Checklist

- [ ] Cloudflare account (sign up at https://cloudflare.com)
- [ ] Domain added to Cloudflare (DNS managed by Cloudflare)
- [ ] GitHub repository with your code
- [ ] PostgreSQL database ready (Neon, Supabase, or other)

### Step 1: Prepare Environment Variables

Create a file `cloudflare-env-vars.txt` with all required variables:

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Auth (Cloudflare Access recommended for Cloudflare deployments)
NEXT_PUBLIC_AUTH_PROVIDER=cloudflare
NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN=https://your-team.cloudflareaccess.com
NEXT_PUBLIC_CLOUDFLARE_AUDIENCE=your_audience_tag
NEXT_PUBLIC_CLOUDFLARE_VERIFY_JWT=true

# Security
PASSWORD_PEPPER=your_32_char_pepper
ENCRYPTION_KEY=your_32_char_encryption_key
ARCJET_KEY=ajkey_your_cloudflare_arcjet_key
ARCJET_ENV=production

# Monitoring (Sprint 3: Lazy Loaded!)
NEXT_PUBLIC_SENTRY_DSN=https://your_sentry_dsn@sentry.io/project
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your_auth_token
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Optional
NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN=your_token
```

### Step 2: Create Cloudflare Pages Project

**Via Cloudflare Dashboard:**

1. Log in to https://dash.cloudflare.com
2. Select your account
3. Click "Pages" in left sidebar
4. Click "Create a project"
5. Click "Connect to Git"
6. Authorize GitHub
7. Select your repository
8. Click "Begin setup"

**Configure build settings:**
- **Production branch:** `main`
- **Build command:** `npm run build`
- **Build output directory:** `.next`
- **Root directory:** (leave empty)
- **Environment variables:** Add all from `cloudflare-env-vars.txt`

9. Click "Save and Deploy"

### Step 3: Configure Custom Domain

1. After first deployment, go to "Custom domains"
2. Click "Set up a custom domain"
3. Enter your domain (e.g., `your-domain.com`)
4. Cloudflare will automatically configure DNS
5. SSL certificate will be provisioned automatically (takes ~5 minutes)

### Step 4: Configure Build Settings

1. Go to "Settings" → "Builds & deployments"
2. **Node version:** Set to `20` or `latest`
3. **Build system:** V2 (default)
4. **Environment variables:** Verify all are set
5. Click "Save"

### Step 5: Deploy

**Automatic deployments:**
- Push to `main` branch triggers production deployment
- Push to other branches creates preview deployment

**Manual deployment:**
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler pages publish .next
```

### Step 6: Configure Cloudflare Settings

**Enable performance features:**

1. Go to Cloudflare Dashboard → Your domain
2. **Speed** → **Optimization:**
   - ✅ Auto Minify: JavaScript, CSS, HTML
   - ✅ Brotli compression
   - ✅ Rocket Loader: Off (conflicts with Next.js)
3. **Caching:**
   - Cache Level: Standard
   - Browser Cache TTL: Respect Existing Headers
4. **Network:**
   - ✅ HTTP/2
   - ✅ HTTP/3 (QUIC)
   - ✅ 0-RTT Connection Resumption

### Step 7: Verify Deployment

```bash
# Check site is live
curl -I https://your-domain.com
# Expected: HTTP/2 200

# Check bundle size (Sprint 3 optimization)
# Open DevTools → Network → Filter JS
# Expected: ~521 KB total First Load JS

# Verify Sentry lazy loads
# Network tab should show Sentry loading after ~200ms
```

### Cloudflare Pages Deployment Complete! ✅

**Next:**
- [ ] Configure Cloudflare Access (if using for auth)
- [ ] Set up monitoring in Sentry/PostHog
- [ ] Test all functionality
- [ ] Configure alerts

---

## AWS Deployment (ECS/Fargate)

### Overview

- **Best for:** Enterprise applications, existing AWS infrastructure
- **Pros:** Full control, scalable, compliance-ready
- **Deployment Time:** 30-60 minutes (first time)
- **Monthly Cost:** ~$30-100 (depending on usage)

### Prerequisites Checklist

- [ ] AWS account with billing enabled
- [ ] AWS CLI installed (`aws --version`)
- [ ] Docker installed (`docker --version`)
- [ ] IAM user with appropriate permissions
- [ ] GitHub repository

### Architecture

```
Internet → ALB → ECS Service (Fargate) → Container(s)
                    ↓
              RDS PostgreSQL
```

### Step 1: Configure AWS CLI

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure credentials
aws configure
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region: us-east-1
# Default output format: json
```

### Step 2: Create PostgreSQL Database (RDS)

```bash
# Create DB subnet group
aws rds create-db-subnet-group \
  --db-subnet-group-name nextjs-db-subnet \
  --db-subnet-group-description "Subnet group for Next.js DB" \
  --subnet-ids subnet-xxxxx subnet-yyyyy  # Replace with your subnet IDs

# Create PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier nextjs-production-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 16.1 \
  --master-username dbadmin \
  --master-user-password 'YourSecurePassword123!' \
  --allocated-storage 20 \
  --db-subnet-group-name nextjs-db-subnet \
  --vpc-security-group-ids sg-xxxxx \  # Replace with your security group
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "mon:04:00-mon:05:00" \
  --publicly-accessible false \
  --storage-encrypted \
  --enable-cloudwatch-logs-exports '["postgresql"]'

# Wait for DB to be available (takes ~10 minutes)
aws rds wait db-instance-available \
  --db-instance-identifier nextjs-production-db

# Get DB endpoint
aws rds describe-db-instances \
  --db-instance-identifier nextjs-production-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text

# Save as:
# DATABASE_URL=postgresql://dbadmin:YourSecurePassword123!@endpoint:5432/postgres
```

### Step 3: Create Secrets in AWS Secrets Manager

```bash
# Create secrets file
cat > secrets.json <<EOF
{
  "DATABASE_URL": "postgresql://dbadmin:password@db-endpoint:5432/postgres",
  "CLERK_SECRET_KEY": "sk_live_your_clerk_key",
  "PASSWORD_PEPPER": "$(openssl rand -hex 32)",
  "ENCRYPTION_KEY": "$(openssl rand -hex 32)",
  "ARCJET_KEY": "ajkey_your_arcjet_key",
  "SENTRY_AUTH_TOKEN": "your_sentry_token"
}
EOF

# Create secret
aws secretsmanager create-secret \
  --name nextjs-production-secrets \
  --description "Production secrets for Next.js app" \
  --secret-string file://secrets.json \
  --region us-east-1

# Clean up secrets file
shred -u secrets.json
```

### Step 4: Create ECR Repository

```bash
# Create repository
aws ecr create-repository \
  --repository-name nextjs-app \
  --region us-east-1

# Get repository URI
aws ecr describe-repositories \
  --repository-names nextjs-app \
  --query 'repositories[0].repositoryUri' \
  --output text
# Save this as: ECR_REPOSITORY_URI
```

### Step 5: Build and Push Docker Image

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin $ECR_REPOSITORY_URI

# Build image
docker build -t nextjs-app .

# Tag image
docker tag nextjs-app:latest $ECR_REPOSITORY_URI:latest

# Push to ECR
docker push $ECR_REPOSITORY_URI:latest
```

### Step 6: Create ECS Cluster

```bash
# Create cluster
aws ecs create-cluster \
  --cluster-name nextjs-production \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy \
    capacityProvider=FARGATE,weight=1 \
    capacityProvider=FARGATE_SPOT,weight=4
```

### Step 7: Create Task Definition

Create `task-definition.json`:

```json
{
  "family": "nextjs-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "nextjs",
      "image": "YOUR_ECR_REPOSITORY_URI:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "NEXT_PUBLIC_APP_URL", "value": "https://your-domain.com"},
        {"name": "NEXT_PUBLIC_AUTH_PROVIDER", "value": "clerk"},
        {"name": "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "value": "pk_live_..."},
        {"name": "NEXT_PUBLIC_SENTRY_DSN", "value": "https://...@sentry.io/..."},
        {"name": "NEXT_PUBLIC_POSTHOG_KEY", "value": "phc_..."},
        {"name": "ARCJET_ENV", "value": "production"}
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:nextjs-production-secrets:DATABASE_URL::"
        },
        {
          "name": "CLERK_SECRET_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:nextjs-production-secrets:CLERK_SECRET_KEY::"
        },
        {
          "name": "PASSWORD_PEPPER",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:nextjs-production-secrets:PASSWORD_PEPPER::"
        },
        {
          "name": "ENCRYPTION_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:nextjs-production-secrets:ENCRYPTION_KEY::"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/nextjs-app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

Register task definition:

```bash
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json
```

### Step 8: Create Application Load Balancer

```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name nextjs-alb \
  --subnets subnet-xxxxx subnet-yyyyy \  # Public subnets
  --security-groups sg-xxxxx \  # ALB security group
  --scheme internet-facing \
  --type application \
  --ip-address-type ipv4

# Create target group
aws elbv2 create-target-group \
  --name nextjs-targets \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-xxxxx \
  --target-type ip \
  --health-check-path / \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3

# Create listener
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
```

### Step 9: Create ECS Service

```bash
aws ecs create-service \
  --cluster nextjs-production \
  --service-name nextjs-service \
  --task-definition nextjs-app:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx,subnet-yyyyy],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=nextjs,containerPort=3000" \
  --health-check-grace-period-seconds 60
```

### Step 10: Configure GitHub Actions (Automated Deployments)

The repository already includes `.github/workflows/deploy-aws.yml`.

**Add GitHub Secrets:**

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Add these secrets:
   ```
   AWS_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY
   AWS_REGION=us-east-1
   AWS_ECR_REPOSITORY=your-account-id.dkr.ecr.us-east-1.amazonaws.com/nextjs-app
   AWS_ECS_CLUSTER=nextjs-production
   AWS_ECS_SERVICE=nextjs-service
   AWS_ECS_TASK_DEFINITION=nextjs-app
   ```

3. Also add all environment variables (for build-time):
   ```
   NEXT_PUBLIC_APP_URL
   NEXT_PUBLIC_AUTH_PROVIDER
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   NEXT_PUBLIC_SENTRY_DSN
   NEXT_PUBLIC_POSTHOG_KEY
   ```

**Deploy via GitHub:**

```bash
git push origin main
```

GitHub Actions will:
1. Build Docker image
2. Push to ECR
3. Update ECS task definition
4. Deploy to ECS

### Step 11: Configure DNS

Point your domain to the ALB:

```bash
# Get ALB DNS name
aws elbv2 describe-load-balancers \
  --names nextjs-alb \
  --query 'LoadBalancers[0].DNSName' \
  --output text

# Create Route 53 record (or use your DNS provider)
aws route53 change-resource-record-sets \
  --hosted-zone-id HOSTED_ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "your-domain.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "ALB_HOSTED_ZONE_ID",
          "DNSName": "alb-dns-name",
          "EvaluateTargetHealth": true
        }
      }
    }]
  }'
```

### AWS Deployment Complete! ✅

**Next Steps:**
- [ ] Configure SSL certificate (AWS Certificate Manager)
- [ ] Set up CloudWatch alarms
- [ ] Configure auto-scaling
- [ ] Set up backups

---

## Google Cloud Platform Deployment

### Overview

- **Best for:** Google Cloud ecosystem, serverless containers
- **Pros:** Auto-scaling, pay per use, global network
- **Deployment Time:** 20-40 minutes
- **Monthly Cost:** ~$20-80 (depending on traffic)

### Prerequisites Checklist

- [ ] Google Cloud account with billing enabled
- [ ] `gcloud` CLI installed
- [ ] Project created in GCP
- [ ] GitHub repository

### Step 1: Install and Configure gcloud

```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Initialize
gcloud init

# Set project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  sqladmin.googleapis.com
```

### Step 2: Create PostgreSQL Database (Cloud SQL)

```bash
# Create Cloud SQL instance
gcloud sql instances create nextjs-db \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password='YourSecurePassword123!' \
  --storage-type=SSD \
  --storage-size=10GB \
  --backup-start-time=03:00 \
  --enable-bin-log \
  --retained-backups-count=7

# Create database
gcloud sql databases create nextjs_production \
  --instance=nextjs-db

# Get connection name
gcloud sql instances describe nextjs-db \
  --format='value(connectionName)'
# Save as: PROJECT_ID:us-central1:nextjs-db

# For local testing, create proxy
cloud_sql_proxy -instances=PROJECT_ID:us-central1:nextjs-db=tcp:5432

# DATABASE_URL format:
# postgresql://postgres:YourSecurePassword123!@/nextjs_production?host=/cloudsql/PROJECT_ID:us-central1:nextjs-db
```

### Step 3: Create Secrets in Secret Manager

```bash
# Create secrets
echo -n "postgresql://postgres:password@/nextjs_production?host=/cloudsql/PROJECT_ID:us-central1:nextjs-db" | \
  gcloud secrets create database-url --data-file=-

echo -n "sk_live_your_clerk_key" | \
  gcloud secrets create clerk-secret-key --data-file=-

echo -n "$(openssl rand -hex 32)" | \
  gcloud secrets create password-pepper --data-file=-

echo -n "$(openssl rand -hex 32)" | \
  gcloud secrets create encryption-key --data-file=-

echo -n "ajkey_your_arcjet_key" | \
  gcloud secrets create arcjet-key --data-file=-

# Grant Cloud Run access to secrets
PROJECT_NUMBER=$(gcloud projects describe YOUR_PROJECT_ID --format='value(projectNumber)')

for secret in database-url clerk-secret-key password-pepper encryption-key arcjet-key; do
  gcloud secrets add-iam-policy-binding $secret \
    --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
done
```

### Step 4: Deploy to Cloud Run

**Option A: Via gcloud (Direct)**

```bash
# Deploy from source
gcloud run deploy nextjs-app \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars="NODE_ENV=production,NEXT_PUBLIC_APP_URL=https://your-domain.com,NEXT_PUBLIC_AUTH_PROVIDER=clerk,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...,NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...,NEXT_PUBLIC_POSTHOG_KEY=phc_...,ARCJET_ENV=production" \
  --set-secrets="DATABASE_URL=database-url:latest,CLERK_SECRET_KEY=clerk-secret-key:latest,PASSWORD_PEPPER=password-pepper:latest,ENCRYPTION_KEY=encryption-key:latest,ARCJET_KEY=arcjet-key:latest" \
  --add-cloudsql-instances=PROJECT_ID:us-central1:nextjs-db
```

**Option B: Via GitHub Actions (Automated)**

The repository includes `.github/workflows/deploy-gcp.yml`.

**Add GitHub Secrets:**

1. Create service account:
   ```bash
   gcloud iam service-accounts create github-actions \
     --display-name="GitHub Actions Deploy"

   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/run.admin"

   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/cloudsql.client"

   # Create key
   gcloud iam service-accounts keys create key.json \
     --iam-account=github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com
   ```

2. Add to GitHub Secrets:
   ```
   GCP_PROJECT_ID=your-project-id
   GCP_SA_KEY=<contents of key.json>
   GCP_REGION=us-central1
   CLOUD_SQL_INSTANCE=PROJECT_ID:us-central1:nextjs-db
   ```

3. Also add environment variables:
   ```
   NEXT_PUBLIC_APP_URL
   NEXT_PUBLIC_AUTH_PROVIDER
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   NEXT_PUBLIC_SENTRY_DSN
   NEXT_PUBLIC_POSTHOG_KEY
   ```

**Deploy:**

```bash
git push origin main
```

### Step 5: Configure Custom Domain

```bash
# Map custom domain
gcloud run services add-iam-policy-binding nextjs-app \
  --region=us-central1 \
  --member="allUsers" \
  --role="roles/run.invoker"

gcloud run domain-mappings create \
  --service=nextjs-app \
  --domain=your-domain.com \
  --region=us-central1

# Get DNS records to configure
gcloud run domain-mappings describe \
  --domain=your-domain.com \
  --region=us-central1

# Add the shown DNS records to your domain registrar
```

### Step 6: Configure Load Balancer (Optional, for advanced routing)

```bash
# Create backend service
gcloud compute backend-services create nextjs-backend \
  --global

# Create URL map
gcloud compute url-maps create nextjs-lb \
  --default-service=nextjs-backend

# Create HTTP proxy
gcloud compute target-http-proxies create nextjs-proxy \
  --url-map=nextjs-lb

# Create forwarding rule
gcloud compute forwarding-rules create nextjs-http \
  --global \
  --target-http-proxy=nextjs-proxy \
  --ports=80
```

### GCP Deployment Complete! ✅

**Next Steps:**
- [ ] Configure SSL (automatic with Cloud Run)
- [ ] Set up Cloud Monitoring alerts
- [ ] Configure auto-scaling policies
- [ ] Test deployment

---

## Post-Deployment Verification

### Universal Checklist (All Platforms)

After deploying to any platform, verify:

#### 1. Basic Connectivity

```bash
# Homepage loads
curl -I https://your-domain.com
# Expected: HTTP/2 200

# SSL certificate valid
curl -vI https://your-domain.com 2>&1 | grep "SSL certificate"
# Expected: Valid certificate

# API endpoints work
curl https://your-domain.com/api/auth/csrf
# Expected: JSON response with CSRF token
```

#### 2. Performance (Sprint 3 Optimizations)

```bash
# Run Lighthouse
npx lighthouse https://your-domain.com \
  --only-categories=performance \
  --output=json \
  --output-path=./lighthouse-report.json

# Check score
cat lighthouse-report.json | jq '.categories.performance.score * 100'
# Expected: > 90

# Verify bundle size
# Open DevTools → Network → Filter JS
# Expected: ~521 KB total (Sprint 3 optimized!)

# Verify Sentry lazy loading
# DevTools → Network
# Expected: Sentry loads ~200ms AFTER page interactive
```

#### 3. Functionality

Manual testing:

- [ ] Can access homepage
- [ ] Can navigate to /sign-in
- [ ] Can sign in successfully
- [ ] Can access /dashboard when authenticated
- [ ] Redirected to /sign-in when not authenticated
- [ ] Can sign out
- [ ] Locale switching works
- [ ] No console errors
- [ ] Forms work correctly
- [ ] Database operations work

#### 4. Monitoring

Check dashboards:

- [ ] **Sentry:** Test error appears (throw new Error("Test"))
- [ ] **PostHog:** Page views tracked
- [ ] **Platform metrics:** CPU/Memory normal
- [ ] **Database:** Connections healthy

#### 5. Security

```bash
# Check security headers
curl -I https://your-domain.com | grep -i "content-security\|x-frame\|x-content"
# Expected: CSP, X-Frame-Options, X-Content-Type-Options headers

# Verify bot protection (Arcjet)
# Make rapid requests
for i in {1..50}; do curl -s https://your-domain.com > /dev/null; done
# Should see rate limiting kick in

# Check no secrets exposed
curl https://your-domain.com | grep -i "sk_\|ajkey_\|password"
# Expected: No matches
```

---

## Quick Reference

### Deployment Command Summary

```bash
# Cloudflare Pages
wrangler pages publish .next

# AWS
aws ecs update-service --cluster nextjs-production --service nextjs-service --force-new-deployment

# GCP
gcloud run deploy nextjs-app --source .

# All platforms: Git push (with GitHub Actions configured)
git push origin main
```

### Environment Variable Checklist

Verify these are set on your platform:

```
✅ NODE_ENV=production
✅ NEXT_PUBLIC_APP_URL=https://your-domain.com
✅ DATABASE_URL=postgresql://...
✅ NEXT_PUBLIC_AUTH_PROVIDER=clerk|cloudflare|cognito
✅ Auth provider keys (Clerk/Cloudflare/Cognito)
✅ PASSWORD_PEPPER=(32+ chars)
✅ ENCRYPTION_KEY=(32+ chars)
✅ ARCJET_KEY=ajkey_...
✅ NEXT_PUBLIC_SENTRY_DSN=https://...
✅ NEXT_PUBLIC_POSTHOG_KEY=phc_...
```

---

## Need Help?

- **Cloudflare:** https://developers.cloudflare.com/pages/
- **AWS ECS:** https://docs.aws.amazon.com/ecs/
- **GCP Cloud Run:** https://cloud.google.com/run/docs

**All platforms configured and ready for deployment!** ✅

---

**Last Updated:** November 14, 2025
**Sprint 3 Status:** Optimizations Applied (29.7% bundle reduction)
**Production Ready:** YES
