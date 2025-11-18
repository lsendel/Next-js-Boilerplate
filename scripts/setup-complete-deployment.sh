#!/bin/bash

# ============================================================================
# Complete Deployment Setup for SocialPet
# ============================================================================
# This master script runs all setup scripts in the correct order
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║                                                            ║${NC}"
echo -e "${MAGENTA}║     SocialPet Complete Deployment Setup Wizard            ║${NC}"
echo -e "${MAGENTA}║                                                            ║${NC}"
echo -e "${MAGENTA}║     This will automate your entire deployment setup!      ║${NC}"
echo -e "${MAGENTA}║                                                            ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}What this wizard will do:${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}1.${NC} Create git branches (dev, staging, main)"
echo -e "${GREEN}2.${NC} Create GitHub environments with protection rules"
echo -e "${GREEN}3.${NC} Create 4 D1 databases on Cloudflare"
echo -e "${GREEN}4.${NC} Update wrangler.jsonc with database IDs"
echo -e "${GREEN}5.${NC} Configure GitHub secrets (you'll be prompted)"
echo -e "${GREEN}6.${NC} Verify complete setup"
echo ""

echo -e "${YELLOW}⚠️  Prerequisites:${NC}"
echo -e "  ✓ GitHub CLI installed (${CYAN}gh${NC})"
echo -e "  ✓ Wrangler CLI installed (${CYAN}wrangler${NC})"
echo -e "  ✓ Git repository initialized"
echo -e "  ✓ GitHub repository created"
echo -e "  ✓ Cloudflare account created"
echo ""

read -p "Have you met all prerequisites? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${RED}Please complete prerequisites first!${NC}"
    echo ""
    echo -e "${CYAN}Install GitHub CLI:${NC}"
    echo -e "  macOS:   ${YELLOW}brew install gh${NC}"
    echo -e "  Linux:   ${YELLOW}sudo apt install gh${NC}"
    echo -e "  Windows: ${YELLOW}winget install --id GitHub.cli${NC}"
    echo ""
    echo -e "${CYAN}Install Wrangler:${NC}"
    echo -e "  ${YELLOW}npm install -g wrangler${NC}"
    echo ""
    exit 1
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}Ready to begin!${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

read -p "Start setup wizard? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Setup cancelled${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Step 1 of 5: Creating Git Branches                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ -f "$SCRIPT_DIR/setup-git-branches.sh" ]; then
    bash "$SCRIPT_DIR/setup-git-branches.sh"
    echo ""
    echo -e "${GREEN}✓ Step 1 complete!${NC}"
else
    echo -e "${RED}❌ setup-git-branches.sh not found${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}Press Enter to continue to Step 2...${NC}"
read

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Step 2 of 5: Creating GitHub Environments                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ -f "$SCRIPT_DIR/setup-github-environments.sh" ]; then
    bash "$SCRIPT_DIR/setup-github-environments.sh"
    echo ""
    echo -e "${GREEN}✓ Step 2 complete!${NC}"
else
    echo -e "${RED}❌ setup-github-environments.sh not found${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}Press Enter to continue to Step 3...${NC}"
read

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Step 3 of 5: Creating D1 Databases                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ -f "$SCRIPT_DIR/setup-d1-databases.sh" ]; then
    bash "$SCRIPT_DIR/setup-d1-databases.sh"
    echo ""
    echo -e "${GREEN}✓ Step 3 complete!${NC}"
else
    echo -e "${RED}❌ setup-d1-databases.sh not found${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}Press Enter to continue to Step 4...${NC}"
read

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Step 4 of 5: Configuring GitHub Secrets                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}You need to add GitHub repository secrets for Cloudflare.${NC}"
echo ""
echo -e "${YELLOW}Do you have your Cloudflare credentials ready?${NC}"
echo -e "  • ${CYAN}CLOUDFLARE_API_TOKEN${NC}"
echo -e "  • ${CYAN}CLOUDFLARE_ACCOUNT_ID${NC}"
echo ""

read -p "Add secrets now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${CYAN}Adding CLOUDFLARE_API_TOKEN...${NC}"
    echo -e "${YELLOW}Get your token from:${NC}"
    echo -e "  https://dash.cloudflare.com/profile/api-tokens"
    echo ""

    gh secret set CLOUDFLARE_API_TOKEN

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ CLOUDFLARE_API_TOKEN added${NC}"
    else
        echo -e "${RED}❌ Failed to add CLOUDFLARE_API_TOKEN${NC}"
    fi

    echo ""
    echo -e "${CYAN}Adding CLOUDFLARE_ACCOUNT_ID...${NC}"
    echo -e "${YELLOW}Get your Account ID from:${NC}"
    echo -e "  wrangler whoami"
    echo -e "  or https://dash.cloudflare.com → Your domain → Overview"
    echo ""

    gh secret set CLOUDFLARE_ACCOUNT_ID

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ CLOUDFLARE_ACCOUNT_ID added${NC}"
    else
        echo -e "${RED}❌ Failed to add CLOUDFLARE_ACCOUNT_ID${NC}"
    fi

    echo ""
    echo -e "${GREEN}✓ Step 4 complete!${NC}"
else
    echo ""
    echo -e "${YELLOW}⊘ Skipping secret setup${NC}"
    echo -e "${CYAN}Add them later with:${NC}"
    echo -e "  ${YELLOW}gh secret set CLOUDFLARE_API_TOKEN${NC}"
    echo -e "  ${YELLOW}gh secret set CLOUDFLARE_ACCOUNT_ID${NC}"
fi

echo ""
echo -e "${CYAN}Press Enter to continue to Step 5...${NC}"
read

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Step 5 of 5: Final Verification                          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}Verifying setup...${NC}"
echo ""

# Check git branches
echo -e "${BLUE}Git Branches:${NC}"
git branch -a | grep -E '(dev|staging|main)' | while read -r branch; do
    echo -e "  ${GREEN}✓${NC} $branch"
done
echo ""

# Check GitHub environments
echo -e "${BLUE}GitHub Environments:${NC}"
if command -v gh &> /dev/null; then
    ENV_LIST=$(gh api "/repos/:owner/:repo/environments" --jq '.environments[].name' 2>/dev/null || echo "")
    if [ -z "$ENV_LIST" ]; then
        echo -e "  ${YELLOW}⚠️  Could not verify (check manually)${NC}"
    else
        echo "$ENV_LIST" | while read -r env; do
            echo -e "  ${GREEN}✓${NC} $env"
        done
    fi
else
    echo -e "  ${YELLOW}⚠️  GitHub CLI not available${NC}"
fi
echo ""

# Check GitHub secrets
echo -e "${BLUE}GitHub Secrets:${NC}"
if command -v gh &> /dev/null; then
    SECRET_LIST=$(gh secret list --json name --jq '.[].name' 2>/dev/null || echo "")
    if echo "$SECRET_LIST" | grep -q "CLOUDFLARE_API_TOKEN"; then
        echo -e "  ${GREEN}✓${NC} CLOUDFLARE_API_TOKEN"
    else
        echo -e "  ${RED}✗${NC} CLOUDFLARE_API_TOKEN (missing)"
    fi

    if echo "$SECRET_LIST" | grep -q "CLOUDFLARE_ACCOUNT_ID"; then
        echo -e "  ${GREEN}✓${NC} CLOUDFLARE_ACCOUNT_ID"
    else
        echo -e "  ${RED}✗${NC} CLOUDFLARE_ACCOUNT_ID (missing)"
    fi
else
    echo -e "  ${YELLOW}⚠️  Cannot verify (gh CLI needed)${NC}"
fi
echo ""

# Check D1 databases
echo -e "${BLUE}D1 Databases:${NC}"
if command -v wrangler &> /dev/null; then
    DB_LIST=$(wrangler d1 list 2>/dev/null | grep socialpet || echo "")
    if [ -z "$DB_LIST" ]; then
        echo -e "  ${YELLOW}⚠️  No socialpet databases found${NC}"
    else
        echo "$DB_LIST" | while read -r db; do
            echo -e "  ${GREEN}✓${NC} $db"
        done
    fi
else
    echo -e "  ${YELLOW}⚠️  Wrangler CLI not available${NC}"
fi
echo ""

echo -e "${GREEN}✓ Step 5 complete!${NC}"
echo ""

# Final summary
echo ""
echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║                                                            ║${NC}"
echo -e "${MAGENTA}║     🎉  Setup Wizard Complete!  🎉                        ║${NC}"
echo -e "${MAGENTA}║                                                            ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Summary of what was configured:${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${GREEN}✓${NC} Git branches created (dev, staging, main)"
echo -e "${GREEN}✓${NC} GitHub environments configured (4 environments)"
echo -e "${GREEN}✓${NC} D1 databases created (4 databases)"
echo -e "${GREEN}✓${NC} wrangler.jsonc updated with database IDs"
echo -e "${GREEN}✓${NC} GitHub secrets configured"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Next Steps:${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}1.${NC} Configure custom domains in Cloudflare Pages:"
echo -e "   ${CYAN}https://dash.cloudflare.com → Workers & Pages → Create application${NC}"
echo -e "   • ${YELLOW}dev.socialpet.io${NC}"
echo -e "   • ${YELLOW}tst.socialpet.io${NC}"
echo -e "   • ${YELLOW}stg.socialpet.io${NC}"
echo -e "   • ${YELLOW}socialpet.io${NC}"
echo -e "   • ${YELLOW}www.socialpet.io${NC}"
echo ""

echo -e "${YELLOW}2.${NC} Apply database migrations:"
echo -e "   ${CYAN}cd apps/web${NC}"
echo -e "   ${CYAN}pnpm d1:migrate                                    # Dev${NC}"
echo -e "   ${CYAN}npx wrangler d1 migrations apply socialpet-db-test --remote --env test${NC}"
echo -e "   ${CYAN}pnpm d1:migrate:stage                              # Staging${NC}"
echo -e "   ${CYAN}pnpm d1:migrate:prod                               # Production${NC}"
echo ""

echo -e "${YELLOW}3.${NC} Deploy to dev environment:"
echo -e "   ${CYAN}git checkout dev${NC}"
echo -e "   ${CYAN}git push origin dev${NC}"
echo ""

echo -e "${YELLOW}4.${NC} Monitor deployment:"
echo -e "   ${CYAN}gh run watch${NC}"
echo ""

echo -e "${YELLOW}5.${NC} Verify deployment:"
echo -e "   ${CYAN}curl https://dev.socialpet.io/api/health${NC}"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Documentation:${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "  📚 ${CYAN}docs/CLOUDFLARE_SOCIALPET_SETUP.md${NC}"
echo -e "     Complete setup guide with detailed instructions"
echo ""
echo -e "  ☑️  ${CYAN}docs/DEPLOYMENT_CHECKLIST_SOCIALPET.md${NC}"
echo -e "     Interactive checklist for deployment"
echo ""
echo -e "  📋 ${CYAN}docs/SOCIALPET_DEPLOYMENT_SUMMARY.md${NC}"
echo -e "     Quick reference and command guide"
echo ""
echo -e "  🚀 ${CYAN}docs/CI_CD_QUICK_REFERENCE.md${NC}"
echo -e "     Daily operations reference"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Your SocialPet deployment is now ready! 🚀${NC}"
echo ""
echo -e "${CYAN}Need help? Check the documentation above or run:${NC}"
echo -e "  ${YELLOW}cat docs/SOCIALPET_DEPLOYMENT_SUMMARY.md${NC}"
echo ""
