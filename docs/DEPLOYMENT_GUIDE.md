# Deployment Guide

## Overview

This Next.js boilerplate includes production-ready deployment configurations for all major cloud providers with automated CI/CD, database backups, and monitoring.

## Supported Cloud Providers

- **AWS** (Elastic Container Service + ECR)
- **Azure** (App Service + Container Registry)
- **Google Cloud Platform** (Cloud Run + GCR)
- **Cloudflare** (Pages + Workers)

## Quick Start

### 1. Choose Your Cloud Provider

Each provider has its own deployment workflow in `.github/workflows/`:

- `deploy-aws.yml` - AWS ECS deployment
- `deploy-azure.yml` - Azure App Service deployment
- `deploy-gcp.yml` - Google Cloud Run deployment
- `deploy-cloudflare.yml` - Cloudflare Pages deployment

### 2. Configure Secrets

Add required secrets to your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

See [Required Secrets](#required-secrets) section below for provider-specific secrets.

### 3. Deploy

**Option A: Automatic Deployment**
- Push to `main` branch → Deploys to staging
- Push to `production` branch → Deploys to production (with approval)

**Option B: Manual Deployment**
```bash
# Using GitHub CLI
gh workflow run deploy-aws.yml -f environment=production

# Or via GitHub UI
Actions → [Select workflow] → Run workflow
```

## Deployment Workflows

### AWS Deployment

**Workflow:** `.github/workflows/deploy-aws.yml`

**Services Used:**
- ECR (Elastic Container Registry) - Docker images
- ECS (Elastic Container Service) - Container orchestration
- RDS (Relational Database Service) - PostgreSQL
- CloudFront - CDN and caching
- S3 - Database backups

**Steps:**
1. Run tests
2. Build Docker image
3. Push to ECR
4. Security scan with Trivy
5. Update ECS service
6. Run database migrations
7. Invalidate CloudFront cache
8. Create RDS snapshot

**Environment Variables Required:**
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
NEXT_PUBLIC_APP_URL=https://your-app.com
NEXT_PUBLIC_AUTH_PROVIDER=clerk
```

**Secrets Required:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_ACCOUNT_ID`
- `AWS_REGION` (e.g., us-east-1)
- `ECR_REPOSITORY` (e.g., nextjs-boilerplate)
- `ECS_CLUSTER` (e.g., nextjs-cluster)
- `ECS_SERVICE` (e.g., nextjs-service)
- `RDS_INSTANCE_ID`
- `CLOUDFRONT_DISTRIBUTION_ID`
- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`

**Estimated Cost:**
- ECS Fargate: $30-50/month (2 tasks, 0.5 vCPU, 1GB RAM each)
- RDS db.t3.micro: $15-20/month
- ECR: $1-2/month
- CloudFront: Variable (pay-per-use)

**Setup Guide:**
See `docs/deployment/AWS_SETUP.md` for detailed setup instructions.

### Azure Deployment

**Workflow:** `.github/workflows/deploy-azure.yml`

**Services Used:**
- Azure Container Registry (ACR) - Docker images
- Azure App Service - Web app hosting
- Azure Database for PostgreSQL - Database
- Azure Blob Storage - Backups

**Steps:**
1. Run tests
2. Build Docker image
3. Push to ACR
4. Deploy to App Service
5. Run database migrations via SSH
6. Create PostgreSQL backup
7. Export to Blob Storage

**Secrets Required:**
- `AZURE_CREDENTIALS` (Service Principal JSON)
- `AZURE_RESOURCE_GROUP`
- `AZURE_APP_NAME`
- `AZURE_POSTGRES_SERVER`
- `AZURE_STORAGE_ACCOUNT`
- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`

**Estimated Cost:**
- App Service Basic B1: $13/month
- PostgreSQL Basic 1 vCore: $25/month
- Storage: $1-2/month

### GCP Deployment

**Workflow:** `.github/workflows/deploy-gcp.yml`

**Services Used:**
- Google Container Registry (GCR) - Docker images
- Cloud Run - Serverless containers
- Cloud SQL - PostgreSQL
- Cloud Storage - Backups
- Container Analysis - Security scanning

**Steps:**
1. Run tests
2. Build and push Docker image
3. Scan image with Container Analysis
4. Deploy to Cloud Run
5. Run database migrations via Cloud Run Jobs
6. Create Cloud SQL backup
7. Export to Cloud Storage
8. Set retention policy

**Secrets Required:**
- `GCP_PROJECT_ID`
- `GCP_SA_KEY` (Service Account JSON)
- `GCP_REGION` (e.g., us-central1)
- `GCP_SQL_INSTANCE`
- `GCP_BACKUP_BUCKET`
- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`

**Estimated Cost:**
- Cloud Run: $10-20/month (with 1-10 instances)
- Cloud SQL db-f1-micro: $10/month
- Storage: $1-2/month

### Cloudflare Deployment

**Workflow:** `.github/workflows/deploy-cloudflare.yml`

**Services Used:**
- Cloudflare Pages - Static/SSR hosting
- Cloudflare Workers - Edge compute
- Cloudflare D1 - SQLite database
- Cloudflare R2 - Object storage (backups)

**Steps:**
1. Run tests
2. Build application
3. Deploy to Cloudflare Pages
4. Deploy Workers
5. Backup D1 database
6. Upload backup to R2
7. Clean old backups (30-day retention)

**Secrets Required:**
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_R2_BUCKET`
- `DATABASE_URL` (for D1)
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN` (if using Cloudflare Access)

**Estimated Cost:**
- Pages: Free (up to 500 builds/month)
- Workers: $5/month (paid plan for unlimited requests)
- D1: Free tier available
- R2: $0.015/GB storage

## Database Migrations

### Automatic Migrations

Migrations run automatically after deployment in all workflows:

**AWS**: ECS run-task with migration command
**Azure**: SSH command to App Service
**GCP**: Cloud Run Jobs
**Cloudflare**: Wrangler CLI

### Manual Migrations

```bash
# Local
npm run db:migrate

# AWS (via ECS)
aws ecs run-task \
  --cluster nextjs-cluster \
  --task-definition nextjs-migrate \
  --launch-type FARGATE

# Azure (via SSH)
az webapp ssh -g myResourceGroup -n myAppName
npm run db:migrate

# GCP (via Cloud Run Jobs)
gcloud run jobs execute nextjs-migrate --region us-central1

# Cloudflare (via Wrangler)
npx wrangler d1 migrations apply nextjs_db
```

## Database Backups

### Automatic Backups

All deployment workflows include automated database backups:

**Schedule:**
- Before deployment (pre-deploy backup)
- After successful deployment
- Daily via scheduled workflows (optional)

**Retention:**
- AWS RDS: 7-day automated backups, 30-day manual snapshots
- Azure PostgreSQL: 7-day automated, 30-day Blob Storage
- GCP Cloud SQL: 7-day automated, 30-day Cloud Storage
- Cloudflare D1: 30-day R2 storage

### Manual Backups

**Using Backup Script:**
```bash
# PostgreSQL
./scripts/backup-database.sh \
  --db-type postgres \
  --output-dir ./backups \
  --compress true \
  --encrypt true \
  --upload aws \
  --retention 30

# MySQL
./scripts/backup-database.sh \
  --db-type mysql \
  --upload gcp

# SQLite
./scripts/backup-database.sh \
  --db-type sqlite \
  --encrypt true
```

**Cloud-Specific:**
```bash
# AWS RDS
aws rds create-db-snapshot \
  --db-instance-identifier mydbinstance \
  --db-snapshot-identifier backup-$(date +%Y%m%d)

# Azure
az postgres flexible-server backup create \
  --resource-group mygroup \
  --name myserver \
  --backup-name backup-$(date +%Y%m%d)

# GCP
gcloud sql backups create \
  --instance=myinstance

# Cloudflare D1
npx wrangler d1 export nextjs_db \
  --output backup-$(date +%Y%m%d).sql
```

## Rollback Strategy

### Rolling Back Deployment

**AWS:**
```bash
# Revert to previous ECS task definition
aws ecs update-service \
  --cluster nextjs-cluster \
  --service nextjs-service \
  --task-definition nextjs-app:[previous-revision]
```

**Azure:**
```bash
# Swap deployment slots
az webapp deployment slot swap \
  -g myResourceGroup \
  -n myAppName \
  --slot staging \
  --target-slot production
```

**GCP:**
```bash
# Rollback to previous Cloud Run revision
gcloud run services update-traffic nextjs-boilerplate \
  --to-revisions=[previous-revision]=100 \
  --region us-central1
```

**Cloudflare:**
```bash
# Rollback to previous deployment
npx wrangler pages deployment rollback
```

### Rolling Back Database Migrations

**Down Migrations:**
```bash
# Create down migration
npm run db:generate

# Apply down migration
# (Implementation depends on your migration tool)
```

**Restore from Backup:**
```bash
# AWS
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier mydbinstance-restored \
  --db-snapshot-identifier backup-20250113

# Azure
az postgres flexible-server restore \
  --resource-group mygroup \
  --name myserver-restored \
  --source-server myserver \
  --restore-point-in-time "2025-01-13T12:00:00Z"

# GCP
gcloud sql backups restore BACKUP_ID \
  --backup-instance=myinstance \
  --backup-id=BACKUP_ID
```

## Monitoring and Logging

### Application Monitoring

**Sentry** (Error Tracking):
- Automatic error reporting
- Source map upload in deployment
- Release tracking

**Google Analytics** (User Analytics):
- Pageviews, events, conversions
- User behavior tracking

**PostHog** (Product Analytics):
- Feature usage
- User sessions
- A/B testing

### Infrastructure Monitoring

**AWS:**
- CloudWatch Logs
- CloudWatch Metrics
- X-Ray tracing

**Azure:**
- Application Insights
- Azure Monitor
- Log Analytics

**GCP:**
- Cloud Logging
- Cloud Monitoring
- Cloud Trace

**Cloudflare:**
- Analytics Dashboard
- Workers Analytics
- Real User Monitoring (RUM)

### Log Access

```bash
# AWS
aws logs tail /ecs/nextjs-boilerplate --follow

# Azure
az webapp log tail -g myResourceGroup -n myAppName

# GCP
gcloud logging read "resource.type=cloud_run_revision" --limit 50

# Cloudflare
npx wrangler tail
```

## Health Checks

All deployments include health check endpoints:

**Endpoint:** `/api/health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-13T12:00:00Z",
  "uptime": 3600,
  "database": "connected",
  "redis": "connected"
}
```

**Configuration:**

**Dockerfile:**
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
```

**AWS ECS:**
```json
{
  "healthCheck": {
    "command": ["CMD-SHELL", "curl -f http://localhost:3000/api/health || exit 1"],
    "interval": 30,
    "timeout": 5,
    "retries": 3,
    "startPeriod": 60
  }
}
```

## Environment-Specific Configuration

### Development
```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nextjs_dev
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Staging
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@staging-db:5432/nextjs_staging
NEXT_PUBLIC_APP_URL=https://staging.your-app.com
```

### Production
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db:5432/nextjs_production
NEXT_PUBLIC_APP_URL=https://your-app.com
```

## Custom Domain Setup

### AWS (CloudFront)
1. Add domain to CloudFront distribution
2. Create ACM certificate
3. Update DNS (Route 53 or external)
4. Configure CNAME/A record

### Azure
1. Add custom domain in App Service
2. Configure DNS
3. Enable HTTPS with free certificate

### GCP
1. Map custom domain in Cloud Run
2. Verify domain ownership
3. Configure DNS records

### Cloudflare Pages
1. Add custom domain in Pages dashboard
2. Cloudflare automatically configures DNS
3. Free SSL certificate included

## Scaling Configuration

### AWS ECS
```json
{
  "desiredCount": 2,
  "deploymentConfiguration": {
    "maximumPercent": 200,
    "minimumHealthyPercent": 100
  }
}
```

Auto-scaling:
```bash
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/nextjs-cluster/nextjs-service \
  --min-capacity 2 \
  --max-capacity 10
```

### Azure App Service
```bash
# Scale up (vertical)
az appservice plan update \
  --name myAppServicePlan \
  --resource-group myResourceGroup \
  --sku P1V2

# Scale out (horizontal)
az appservice plan update \
  --name myAppServicePlan \
  --resource-group myResourceGroup \
  --number-of-workers 3
```

### GCP Cloud Run
```bash
gcloud run services update nextjs-boilerplate \
  --min-instances 1 \
  --max-instances 10 \
  --concurrency 80 \
  --cpu 2 \
  --memory 2Gi \
  --region us-central1
```

### Cloudflare
Automatic scaling - no configuration needed!

## Troubleshooting

### Common Issues

**1. Deployment Fails**
- Check GitHub Actions logs
- Verify secrets are set correctly
- Ensure Docker image builds locally

**2. Database Connection Fails**
- Check DATABASE_URL format
- Verify network/firewall rules
- Test connection from deployed environment

**3. Health Check Fails**
- Check health endpoint locally
- Verify port configuration
- Review container logs

**4. High Latency**
- Enable CDN caching
- Optimize database queries
- Add Redis caching

### Debug Commands

```bash
# Test Docker image locally
docker build -t nextjs-test .
docker run -p 3000:3000 -e DATABASE_URL=$DATABASE_URL nextjs-test

# Check deployment status
# AWS
aws ecs describe-services --cluster nextjs-cluster --services nextjs-service

# Azure
az webapp show -g myResourceGroup -n myAppName

# GCP
gcloud run services describe nextjs-boilerplate --region us-central1

# Cloudflare
npx wrangler pages deployment list
```

## Cost Optimization

### Tips for Reducing Costs

1. **Use appropriate instance sizes**
   - Start small, scale as needed
   - Monitor resource usage

2. **Enable auto-scaling**
   - Scale down during low traffic
   - Set maximum limits

3. **Optimize Docker images**
   - Multi-stage builds
   - Minimal base images
   - Layer caching

4. **Use CDN effectively**
   - Cache static assets
   - Edge caching for dynamic content

5. **Database optimization**
   - Connection pooling
   - Query optimization
   - Read replicas for scaling

6. **Clean up old resources**
   - Delete unused images
   - Remove old backups
   - Archive old logs

## Security Best Practices

1. ✅ Use HTTPS everywhere
2. ✅ Rotate secrets regularly
3. ✅ Enable WAF (Web Application Firewall)
4. ✅ Implement rate limiting
5. ✅ Use security headers
6. ✅ Regular security audits
7. ✅ Automated dependency updates
8. ✅ Container image scanning

## Next Steps

1. Review and customize deployment workflows
2. Set up monitoring and alerting
3. Configure auto-scaling rules
4. Set up custom domain
5. Enable CDN caching
6. Configure backup retention
7. Set up disaster recovery plan

## Additional Resources

- [CI/CD Pipeline Documentation](./CI_CD_SETUP.md)
- [Authentication Security Guide](./AUTH_SECURITY_IMPROVEMENTS.md)
- [Database Backup Script](../scripts/backup-database.sh)
- [Docker Configuration](../Dockerfile)
- [Docker Compose Setup](../docker-compose.yml)
