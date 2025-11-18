#!/bin/bash

# ============================================================================
# GitHub Environments Setup Script for SocialPet
# ============================================================================
# This script automates the creation of GitHub environments with proper
# protection rules and deployment branch restrictions
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    GitHub Environments Setup for SocialPet                 ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) is not installed${NC}"
    echo -e "${YELLOW}Install it from: https://cli.github.com/${NC}"
    echo ""
    echo -e "${CYAN}Installation:${NC}"
    echo -e "  macOS:   ${YELLOW}brew install gh${NC}"
    echo -e "  Linux:   ${YELLOW}sudo apt install gh${NC} or ${YELLOW}sudo yum install gh${NC}"
    echo -e "  Windows: ${YELLOW}winget install --id GitHub.cli${NC}"
    exit 1
fi

echo -e "${GREEN}✓ GitHub CLI detected${NC}"
echo ""

# Check if authenticated
echo -e "${BLUE}Checking GitHub authentication...${NC}"
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Not authenticated with GitHub${NC}"
    echo -e "${YELLOW}Logging in now...${NC}"
    gh auth login
fi

echo -e "${GREEN}✓ Authenticated with GitHub${NC}"
echo ""

# Get repository information
cd "$REPO_ROOT"
REPO_URL=$(git remote get-url origin 2>/dev/null || echo "")

if [ -z "$REPO_URL" ]; then
    echo -e "${RED}❌ No git remote found${NC}"
    echo -e "${YELLOW}Please run this script from within a git repository${NC}"
    exit 1
fi

# Extract owner/repo from URL
if [[ "$REPO_URL" =~ github\.com[:/]([^/]+)/([^/.]+) ]]; then
    REPO_OWNER="${BASH_REMATCH[1]}"
    REPO_NAME="${BASH_REMATCH[2]}"
else
    echo -e "${RED}❌ Could not parse repository URL${NC}"
    echo -e "${YELLOW}URL: $REPO_URL${NC}"
    exit 1
fi

echo -e "${BLUE}Repository Information:${NC}"
echo -e "  Owner: ${YELLOW}$REPO_OWNER${NC}"
echo -e "  Repo:  ${YELLOW}$REPO_NAME${NC}"
echo ""

# Confirm before proceeding
echo -e "${YELLOW}⚠️  This script will create/update GitHub environments:${NC}"
echo -e "  ${GREEN}1. dev${NC}        - Development environment (no protection)"
echo -e "  ${GREEN}2. test${NC}       - Test environment (no protection)"
echo -e "  ${GREEN}3. staging${NC}    - Staging environment (no protection)"
echo -e "  ${GREEN}4. production${NC} - Production environment (with protection)"
echo ""
echo -e "${CYAN}Production environment will be configured with:${NC}"
echo -e "  - Wait timer: 5 minutes"
echo -e "  - Deployment branch: main only"
echo -e "  - Reviewers: You'll be prompted to add them"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Aborted${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Creating GitHub Environments...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Function to create or update an environment
create_environment() {
    local env_name=$1
    local description=$2

    echo -e "${CYAN}Creating environment: ${YELLOW}$env_name${NC}"

    # Create environment using GitHub API
    gh api \
        --method PUT \
        -H "Accept: application/vnd.github+json" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        "/repos/$REPO_OWNER/$REPO_NAME/environments/$env_name" \
        > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Environment '$env_name' created/updated${NC}"
    else
        echo -e "${YELLOW}⚠️  Environment '$env_name' may already exist or creation failed${NC}"
    fi
}

# Function to add deployment branch policy
add_branch_policy() {
    local env_name=$1
    local branch_pattern=$2

    echo -e "${CYAN}  → Adding deployment branch policy: ${YELLOW}$branch_pattern${NC}"

    # First, enable deployment branch policy
    gh api \
        --method PUT \
        -H "Accept: application/vnd.github+json" \
        "/repos/$REPO_OWNER/$REPO_NAME/environments/$env_name" \
        -f "deployment_branch_policy[protected_branches]=false" \
        -f "deployment_branch_policy[custom_branch_policies]=true" \
        > /dev/null 2>&1

    # Then add the specific branch pattern
    gh api \
        --method POST \
        -H "Accept: application/vnd.github+json" \
        "/repos/$REPO_OWNER/$REPO_NAME/environments/$env_name/deployment-branch-policies" \
        -f "name=$branch_pattern" \
        > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}  ✓ Branch policy added: $branch_pattern${NC}"
    else
        echo -e "${YELLOW}  ⚠️  Branch policy may already exist${NC}"
    fi
}

# Function to configure production environment protection
configure_production_protection() {
    echo -e "${CYAN}Configuring production environment protection...${NC}"

    # Set wait timer (5 minutes = 300 seconds)
    echo -e "${CYAN}  → Setting wait timer: ${YELLOW}5 minutes${NC}"

    gh api \
        --method PUT \
        -H "Accept: application/vnd.github+json" \
        "/repos/$REPO_OWNER/$REPO_NAME/environments/production" \
        -f "wait_timer=5" \
        > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}  ✓ Wait timer configured${NC}"
    else
        echo -e "${YELLOW}  ⚠️  Wait timer configuration may have failed${NC}"
    fi
}

# Create Development Environment
echo -e "${BLUE}[1/4] Development Environment${NC}"
create_environment "dev" "Development environment"
add_branch_policy "dev" "dev"
echo ""

# Create Test Environment
echo -e "${BLUE}[2/4] Test Environment${NC}"
create_environment "test" "Test environment for integration tests"
# Test environment allows all branches (no branch policy)
echo -e "${CYAN}  → Allowing all branches for test environment${NC}"
gh api \
    --method PUT \
    -H "Accept: application/vnd.github+json" \
    "/repos/$REPO_OWNER/$REPO_NAME/environments/test" \
    -f "deployment_branch_policy[protected_branches]=false" \
    -f "deployment_branch_policy[custom_branch_policies]=false" \
    > /dev/null 2>&1
echo -e "${GREEN}  ✓ Test environment configured for all branches${NC}"
echo ""

# Create Staging Environment
echo -e "${BLUE}[3/4] Staging Environment${NC}"
create_environment "staging" "Staging environment"
add_branch_policy "staging" "staging"
echo ""

# Create Production Environment
echo -e "${BLUE}[4/4] Production Environment${NC}"
create_environment "production" "Production environment"
add_branch_policy "production" "main"
configure_production_protection
echo ""

# Add reviewers to production
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Production Environment Reviewers${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Do you want to add required reviewers for production?${NC}"
echo -e "${CYAN}(Reviewers must approve deployments before they proceed)${NC}"
echo ""
read -p "Add reviewers? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${CYAN}Enter GitHub usernames (one per line, empty line to finish):${NC}"
    echo -e "${YELLOW}Example: octocat${NC}"
    echo ""

    REVIEWERS=()
    while true; do
        read -p "Reviewer: " reviewer
        if [ -z "$reviewer" ]; then
            break
        fi
        REVIEWERS+=("$reviewer")
        echo -e "${GREEN}  ✓ Added: $reviewer${NC}"
    done

    if [ ${#REVIEWERS[@]} -gt 0 ]; then
        echo ""
        echo -e "${CYAN}Adding ${#REVIEWERS[@]} reviewer(s) to production environment...${NC}"

        # Build JSON array of reviewer objects
        REVIEWERS_JSON="["
        for i in "${!REVIEWERS[@]}"; do
            if [ $i -gt 0 ]; then
                REVIEWERS_JSON+=","
            fi
            REVIEWERS_JSON+="{\"type\":\"User\",\"id\":null,\"reviewer\":{\"login\":\"${REVIEWERS[$i]}\"}}"
        done
        REVIEWERS_JSON+="]"

        # Add reviewers
        gh api \
            --method PUT \
            -H "Accept: application/vnd.github+json" \
            "/repos/$REPO_OWNER/$REPO_NAME/environments/production" \
            -f "reviewers=$REVIEWERS_JSON" \
            > /dev/null 2>&1

        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Reviewers added successfully${NC}"
        else
            echo -e "${YELLOW}⚠️  Failed to add reviewers via API${NC}"
            echo -e "${CYAN}Please add them manually in GitHub UI:${NC}"
            echo -e "  Settings → Environments → production → Required reviewers"
        fi
    else
        echo -e "${YELLOW}⚠️  No reviewers added${NC}"
        echo -e "${CYAN}You can add them later in GitHub UI${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping reviewer setup${NC}"
    echo -e "${CYAN}Add reviewers manually:${NC}"
    echo -e "  GitHub → Settings → Environments → production → Required reviewers"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Verifying Environments...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# List all environments
ENV_LIST=$(gh api "/repos/$REPO_OWNER/$REPO_NAME/environments" --jq '.environments[].name' 2>/dev/null || echo "")

if [ -z "$ENV_LIST" ]; then
    echo -e "${RED}❌ Could not retrieve environments${NC}"
    echo -e "${YELLOW}Please check manually in GitHub UI${NC}"
else
    echo -e "${GREEN}✓ Environments created:${NC}"
    echo "$ENV_LIST" | while read -r env; do
        echo -e "  ${YELLOW}• $env${NC}"
    done
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Environment Configuration Summary${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${CYAN}Environment Protection Rules:${NC}"
echo ""
echo -e "${YELLOW}dev${NC}"
echo -e "  Protection:     None"
echo -e "  Branches:       dev only"
echo -e "  Auto-deploy:    ✅ Yes"
echo ""
echo -e "${YELLOW}test${NC}"
echo -e "  Protection:     None"
echo -e "  Branches:       All branches"
echo -e "  Auto-deploy:    ⚡ Manual"
echo ""
echo -e "${YELLOW}staging${NC}"
echo -e "  Protection:     None"
echo -e "  Branches:       staging only"
echo -e "  Auto-deploy:    ✅ Yes"
echo ""
echo -e "${YELLOW}production${NC}"
echo -e "  Protection:     ⚠️  Reviewers + Wait timer"
echo -e "  Branches:       main only"
echo -e "  Wait timer:     5 minutes"
echo -e "  Reviewers:      ${#REVIEWERS[@]} configured"
echo -e "  Auto-deploy:    ❌ Requires approval"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Next Steps${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${GREEN}1.${NC} Verify environments in GitHub UI:"
echo -e "   ${YELLOW}https://github.com/$REPO_OWNER/$REPO_NAME/settings/environments${NC}"
echo ""

echo -e "${GREEN}2.${NC} Add GitHub Secrets:"
echo -e "   ${YELLOW}gh secret set CLOUDFLARE_API_TOKEN${NC}"
echo -e "   ${YELLOW}gh secret set CLOUDFLARE_ACCOUNT_ID${NC}"
echo ""

echo -e "${GREEN}3.${NC} Create git branches:"
echo -e "   ${YELLOW}./scripts/setup-git-branches.sh${NC}"
echo ""

echo -e "${GREEN}4.${NC} Setup D1 databases:"
echo -e "   ${YELLOW}./scripts/setup-d1-databases.sh${NC}"
echo ""

echo -e "${GREEN}5.${NC} Deploy to dev:"
echo -e "   ${YELLOW}git push origin dev${NC}"
echo ""

echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ GitHub Environments Setup Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""
