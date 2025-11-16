#!/bin/bash

# Phase 4: Advanced & Reference Migration
# Migrates advanced topics and reference documentation

set -e

echo "🚀 Starting Phase 4: Advanced & Reference Migration"
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Create directories
echo -e "${BLUE}Creating directories...${NC}"
mkdir -p apps/docs/app/advanced
mkdir -p apps/docs/app/reference

# Copy files
echo -e "${BLUE}Copying documentation files...${NC}"

if [ -f "docs/RBAC_ARCHITECTURE_PLAN.md" ]; then
  echo -e "${GREEN}✓${NC} Copying RBAC Architecture"
  cp docs/RBAC_ARCHITECTURE_PLAN.md apps/docs/app/advanced/rbac.mdx
fi

if [ -f "MIGRATION.md" ]; then
  echo -e "${GREEN}✓${NC} Copying Migration Guide"
  cp MIGRATION.md apps/docs/app/advanced/migration.mdx
fi

if [ -f "docs/INFRA_TERRAFORM.md" ]; then
  echo -e "${GREEN}✓${NC} Copying Infrastructure Guide"
  cp docs/INFRA_TERRAFORM.md apps/docs/app/advanced/infrastructure.mdx
fi

echo ""
echo -e "${GREEN}✅ Phase 4 migration complete!${NC}"
echo ""
echo -e "${YELLOW}All phases complete! Final steps:${NC}"
echo "1. Create _meta.json files for all sections"
echo "2. Review and update all migrated content"
echo "3. Fix internal links"
echo "4. Add missing pages (integrations, reference)"
echo "5. Test entire documentation site"
echo "6. Delete archived files once verified"
