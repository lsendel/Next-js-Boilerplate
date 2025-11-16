#!/bin/bash

# Phase 2: Core Documentation Migration
# Migrates high-priority documentation files

set -e

echo "🚀 Starting Phase 2: Core Documentation Migration"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create directories
echo -e "${BLUE}Creating documentation directories...${NC}"
mkdir -p apps/docs/app/architecture
mkdir -p apps/docs/app/api
mkdir -p apps/docs/app/guides/authentication
mkdir -p apps/docs/app/guides/database
mkdir -p apps/docs/app/guides/testing
mkdir -p apps/docs/app/guides/deployment
mkdir -p apps/docs/app/guides/security

# Copy files (preserving originals for now)
echo -e "${BLUE}Copying documentation files...${NC}"

# API Reference
if [ -f "docs/API_REFERENCE.md" ]; then
  echo -e "${GREEN}✓${NC} Copying API Reference (34KB)"
  cp docs/API_REFERENCE.md apps/docs/app/api/index.mdx
fi

# CI/CD Guide
if [ -f "CI_CD_GUIDE.md" ]; then
  echo -e "${GREEN}✓${NC} Copying CI/CD Guide (72KB)"
  mkdir -p apps/docs/app/operations
  cp CI_CD_GUIDE.md apps/docs/app/operations/ci-cd.mdx
fi

# Deployment
if [ -f "DEPLOYMENT_GUIDE.md" ]; then
  echo -e "${GREEN}✓${NC} Copying Deployment Guide"
  cp DEPLOYMENT_GUIDE.md apps/docs/app/guides/deployment/index.mdx
fi

# Authentication
if [ -f "docs/CLOUDFLARE_AUTH_SETUP.md" ]; then
  echo -e "${GREEN}✓${NC} Copying Cloudflare Auth Setup"
  cp docs/CLOUDFLARE_AUTH_SETUP.md apps/docs/app/guides/authentication/cloudflare.mdx
fi

if [ -f "docs/COGNITO_AUTH_SETUP.md" ]; then
  echo -e "${GREEN}✓${NC} Copying Cognito Auth Setup"
  cp docs/COGNITO_AUTH_SETUP.md apps/docs/app/guides/authentication/cognito.mdx
fi

if [ -f "apps/web/src/libs/auth/README.md" ]; then
  echo -e "${GREEN}✓${NC} Copying Auth System Architecture"
  cp apps/web/src/libs/auth/README.md apps/docs/app/architecture/auth-system.mdx
fi

# Database
if [ -f "docs/DATABASE.md" ]; then
  echo -e "${GREEN}✓${NC} Copying Database Guide"
  cp docs/DATABASE.md apps/docs/app/guides/database/index.mdx
fi

if [ -f "docs/DATABASE_SCHEMA.md" ]; then
  echo -e "${GREEN}✓${NC} Copying Database Schema"
  cp docs/DATABASE_SCHEMA.md apps/docs/app/guides/database/schema.mdx
fi

if [ -f "DATABASE_SCHEMA_MANAGEMENT_2025.md" ]; then
  echo -e "${GREEN}✓${NC} Copying Database Migrations Guide"
  cp DATABASE_SCHEMA_MANAGEMENT_2025.md apps/docs/app/guides/database/migrations.mdx
fi

if [ -f "apps/web/scripts/db/ROLLBACK_GUIDE.md" ]; then
  echo -e "${GREEN}✓${NC} Copying Database Rollback Guide"
  cp apps/web/scripts/db/ROLLBACK_GUIDE.md apps/docs/app/guides/database/rollback.mdx
fi

# Testing
if [ -f "LOCAL_TESTING_GUIDE.md" ]; then
  echo -e "${GREEN}✓${NC} Copying Local Testing Guide"
  cp LOCAL_TESTING_GUIDE.md apps/docs/app/guides/testing/local-ci.mdx
fi

# Security
if [ -f "docs/SECURITY.md" ]; then
  echo -e "${GREEN}✓${NC} Copying Security Guide"
  cp docs/SECURITY.md apps/docs/app/guides/security/index.mdx
fi

if [ -f "SECURITY_AUDIT_REPORT.md" ]; then
  echo -e "${GREEN}✓${NC} Copying Security Audit Report"
  cp SECURITY_AUDIT_REPORT.md apps/docs/app/guides/security/audit.mdx
fi

echo ""
echo -e "${GREEN}✅ Phase 2 migration complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review migrated files in apps/docs/app/"
echo "2. Update _meta.json files for navigation"
echo "3. Fix any broken internal links"
echo "4. Test documentation site: http://localhost:3001"
echo "5. Run: ./scripts/migration/migrate-phase3-integrations.sh"
