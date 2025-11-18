#!/bin/bash

# ============================================================================
# Setup Verification Script for SocialPet
# ============================================================================
# This script verifies that all prerequisites are met before running the
# complete deployment setup
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

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    SocialPet Setup Verification                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

ERRORS=0
WARNINGS=0

# Function to check command
check_command() {
    local cmd=$1
    local name=$2
    local install_hint=$3

    if command -v "$cmd" &> /dev/null; then
        VERSION=$($cmd --version 2>&1 | head -n1 || echo "installed")
        echo -e "${GREEN}✓${NC} $name: ${CYAN}$VERSION${NC}"
        return 0
    else
        echo -e "${RED}✗${NC} $name: Not installed"
        if [ -n "$install_hint" ]; then
            echo -e "  ${YELLOW}Install: $install_hint${NC}"
        fi
        ((ERRORS++))
        return 1
    fi
}

# Function to check file
check_file() {
    local file=$1
    local name=$2

    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $name exists"
        return 0
    else
        echo -e "${YELLOW}⚠${NC}  $name: Not found"
        ((WARNINGS++))
        return 1
    fi
}

echo -e "${MAGENTA}Checking Required Tools...${NC}"
echo ""

# Check git
check_command "git" "Git" "https://git-scm.com/downloads"

# Check GitHub CLI
check_command "gh" "GitHub CLI" "brew install gh (macOS) or https://cli.github.com/"

# Check wrangler
check_command "wrangler" "Wrangler CLI" "npm install -g wrangler"

# Check pnpm
check_command "pnpm" "pnpm" "npm install -g pnpm"

# Check node
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'.' -f1 | tr -d 'v')
    if [ "$NODE_MAJOR" -ge 20 ]; then
        echo -e "${GREEN}✓${NC} Node.js: ${CYAN}$NODE_VERSION${NC}"
    else
        echo -e "${YELLOW}⚠${NC}  Node.js: ${CYAN}$NODE_VERSION${NC} (requires v20+)"
        ((WARNINGS++))
    fi
else
    echo -e "${RED}✗${NC} Node.js: Not installed"
    ((ERRORS++))
fi

echo ""
echo -e "${MAGENTA}Checking Authentication...${NC}"
echo ""

# Check GitHub auth
if gh auth status &> /dev/null; then
    GH_USER=$(gh api user --jq '.login' 2>/dev/null || echo "authenticated")
    echo -e "${GREEN}✓${NC} GitHub authenticated: ${CYAN}$GH_USER${NC}"
else
    echo -e "${RED}✗${NC} GitHub: Not authenticated"
    echo -e "  ${YELLOW}Run: gh auth login${NC}"
    ((ERRORS++))
fi

# Check Wrangler auth
if wrangler whoami &> /dev/null; then
    WRANGLER_USER=$(wrangler whoami 2>&1 | grep "logged in" || echo "authenticated")
    echo -e "${GREEN}✓${NC} Wrangler authenticated"
else
    echo -e "${RED}✗${NC} Wrangler: Not authenticated"
    echo -e "  ${YELLOW}Run: wrangler login${NC}"
    ((ERRORS++))
fi

echo ""
echo -e "${MAGENTA}Checking Git Repository...${NC}"
echo ""

# Check if in git repo
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Git repository detected"

    # Check remote
    if git remote get-url origin > /dev/null 2>&1; then
        REMOTE_URL=$(git remote get-url origin)
        echo -e "${GREEN}✓${NC} Git remote: ${CYAN}$REMOTE_URL${NC}"
    else
        echo -e "${YELLOW}⚠${NC}  Git remote: Not configured"
        echo -e "  ${YELLOW}Run: git remote add origin <your-repo-url>${NC}"
        ((WARNINGS++))
    fi

    # Check current branch
    CURRENT_BRANCH=$(git branch --show-current)
    echo -e "${BLUE}ℹ${NC}  Current branch: ${CYAN}$CURRENT_BRANCH${NC}"
else
    echo -e "${RED}✗${NC} Not in a git repository"
    ((ERRORS++))
fi

echo ""
echo -e "${MAGENTA}Checking Project Files...${NC}"
echo ""

# Check important files
check_file "apps/web/wrangler.jsonc" "Wrangler config"
check_file "apps/web/package.json" "Web package.json"
check_file ".github/workflows/environment-promotion.yml" "Environment promotion workflow"
check_file ".github/workflows/rollback.yml" "Rollback workflow"
check_file "scripts/setup-complete-deployment.sh" "Complete deployment script"
check_file "scripts/setup-git-branches.sh" "Git branches script"
check_file "scripts/setup-github-environments.sh" "GitHub environments script"
check_file "scripts/setup-d1-databases.sh" "D1 databases script"

echo ""
echo -e "${MAGENTA}Checking Script Permissions...${NC}"
echo ""

# Check script permissions
for script in scripts/setup-*.sh; do
    if [ -x "$script" ]; then
        echo -e "${GREEN}✓${NC} $(basename "$script") is executable"
    else
        echo -e "${YELLOW}⚠${NC}  $(basename "$script") is not executable"
        echo -e "  ${YELLOW}Run: chmod +x $script${NC}"
        ((WARNINGS++))
    fi
done

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Verification Summary${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo -e "${CYAN}You're ready to run the setup wizard:${NC}"
    echo -e "  ${YELLOW}./scripts/setup-complete-deployment.sh${NC}"
    echo ""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
    echo -e "${CYAN}You can proceed, but some features may not work optimally${NC}"
    echo ""
    echo -e "${CYAN}Run the setup wizard with:${NC}"
    echo -e "  ${YELLOW}./scripts/setup-complete-deployment.sh${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}✗ $ERRORS error(s) found${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
    fi
    echo ""
    echo -e "${CYAN}Please fix the errors above before running the setup wizard${NC}"
    echo ""
    exit 1
fi
