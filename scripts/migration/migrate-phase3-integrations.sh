#!/bin/bash

# Phase 3: Integrations & Operations Migration
# Migrates integration and operations documentation

set -e

echo "🚀 Starting Phase 3: Integrations & Operations Migration"
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Create directories
echo -e "${BLUE}Creating directories...${NC}"
mkdir -p apps/docs/app/integrations
mkdir -p apps/docs/app/operations/runbooks

# Copy operations docs
echo -e "${BLUE}Copying operations documentation...${NC}"

if [ -f "docs/ops/ci-monitoring.md" ]; then
  echo -e "${GREEN}✓${NC} Copying CI Monitoring"
  cp docs/ops/ci-monitoring.md apps/docs/app/operations/monitoring.mdx
fi

if [ -f "docs/ops/environment-variables.md" ]; then
  echo -e "${GREEN}✓${NC} Copying Environment Variables"
  cp docs/ops/environment-variables.md apps/docs/app/operations/environments.mdx
fi

if [ -f "docs/ops/observability.md" ]; then
  echo -e "${GREEN}✓${NC} Copying Observability"
  cp docs/ops/observability.md apps/docs/app/operations/observability.mdx
fi

echo ""
echo -e "${GREEN}✅ Phase 3 migration complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Create integration guides (Sentry, PostHog, etc.)"
echo "2. Create _meta.json files for new sections"
echo "3. Test documentation site: http://localhost:3001"
echo "4. Run: ./scripts/migration/migrate-phase4-advanced.sh"
