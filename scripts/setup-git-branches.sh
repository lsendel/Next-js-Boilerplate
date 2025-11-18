#!/bin/bash

# ============================================================================
# Git Branches Setup Script for SocialPet
# ============================================================================
# This script creates and pushes all required git branches for the
# environment promotion workflow
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    Git Branches Setup for SocialPet                        ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Not in a git repository${NC}"
    echo -e "${YELLOW}Please run this script from the project root${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Git repository detected${NC}"
echo ""

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}Current branch: ${YELLOW}$CURRENT_BRANCH${NC}"
echo ""

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo -e "${RED}❌ No remote 'origin' found${NC}"
    echo -e "${YELLOW}Please add a remote first:${NC}"
    echo -e "  git remote add origin <your-repo-url>"
    exit 1
fi

REMOTE_URL=$(git remote get-url origin)
echo -e "${BLUE}Remote URL: ${YELLOW}$REMOTE_URL${NC}"
echo ""

# Check for uncommitted changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
    echo ""
    echo -e "${CYAN}Please commit or stash your changes first:${NC}"
    echo -e "  ${YELLOW}git add .${NC}"
    echo -e "  ${YELLOW}git commit -m \"Your commit message\"${NC}"
    echo -e "  ${YELLOW}# or${NC}"
    echo -e "  ${YELLOW}git stash${NC}"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Aborted${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${YELLOW}⚠️  This script will create and push these branches:${NC}"
echo -e "  ${GREEN}• dev${NC}      - Development environment"
echo -e "  ${GREEN}• staging${NC}  - Staging environment"
echo -e "  ${GREEN}• main${NC}     - Production environment (if not exists)"
echo ""
echo -e "${CYAN}Note: Branches will be created from the current branch: ${YELLOW}$CURRENT_BRANCH${NC}"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Aborted${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Creating Git Branches...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Function to create and push branch
create_branch() {
    local branch_name=$1
    local description=$2

    echo -e "${CYAN}Creating branch: ${YELLOW}$branch_name${NC} ($description)"

    # Check if branch exists locally
    if git show-ref --verify --quiet "refs/heads/$branch_name"; then
        echo -e "${YELLOW}  ⚠️  Branch already exists locally${NC}"

        # Ask if should recreate
        read -p "  Recreate from current branch? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${CYAN}  → Deleting local branch...${NC}"
            git branch -D "$branch_name"
            echo -e "${CYAN}  → Creating fresh branch...${NC}"
            git branch "$branch_name"
            echo -e "${GREEN}  ✓ Branch recreated${NC}"
        else
            echo -e "${YELLOW}  ⊘ Keeping existing branch${NC}"
        fi
    else
        # Create new branch
        git branch "$branch_name"
        echo -e "${GREEN}  ✓ Branch created locally${NC}"
    fi

    # Check if branch exists on remote
    if git ls-remote --heads origin "$branch_name" | grep -q "$branch_name"; then
        echo -e "${YELLOW}  ⚠️  Branch exists on remote${NC}"

        read -p "  Force push? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${CYAN}  → Force pushing to remote...${NC}"
            git push -f origin "$branch_name"
            echo -e "${GREEN}  ✓ Branch force pushed to remote${NC}"
        else
            echo -e "${YELLOW}  ⊘ Skipping push${NC}"
        fi
    else
        # Push to remote
        echo -e "${CYAN}  → Pushing to remote...${NC}"
        git push -u origin "$branch_name"
        echo -e "${GREEN}  ✓ Branch pushed to remote${NC}"
    fi

    echo ""
}

# Create development branch
create_branch "dev" "Development environment"

# Create staging branch
create_branch "staging" "Staging environment"

# Handle main branch
echo -e "${CYAN}Checking main branch...${NC}"
if git show-ref --verify --quiet "refs/heads/main"; then
    echo -e "${GREEN}  ✓ Main branch already exists${NC}"

    # Check if it's on remote
    if git ls-remote --heads origin main | grep -q main; then
        echo -e "${GREEN}  ✓ Main branch exists on remote${NC}"
    else
        echo -e "${YELLOW}  ⚠️  Main branch not on remote${NC}"
        read -p "  Push main branch? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git push -u origin main
            echo -e "${GREEN}  ✓ Main branch pushed to remote${NC}"
        fi
    fi
else
    echo -e "${YELLOW}  ⚠️  Main branch doesn't exist locally${NC}"

    # Check if we're using 'master' instead
    if git show-ref --verify --quiet "refs/heads/master"; then
        echo -e "${CYAN}  → Detected 'master' branch${NC}"
        read -p "  Rename 'master' to 'main'? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git branch -m master main
            echo -e "${GREEN}  ✓ Renamed master → main${NC}"

            # Push and update remote
            git push -u origin main
            echo -e "${GREEN}  ✓ Main branch pushed to remote${NC}"

            # Optionally delete remote master
            read -p "  Delete remote 'master' branch? (y/n) " -n 1 -r
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                git push origin --delete master
                echo -e "${GREEN}  ✓ Remote master deleted${NC}"
            fi
        fi
    else
        # Create main from current branch
        read -p "  Create main branch from current branch? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git branch main
            git push -u origin main
            echo -e "${GREEN}  ✓ Main branch created and pushed${NC}"
        fi
    fi
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Setting Default Branch on GitHub...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Check if gh CLI is available
if command -v gh &> /dev/null; then
    echo -e "${CYAN}Setting 'main' as default branch on GitHub...${NC}"

    # Try to set main as default branch
    if gh repo edit --default-branch main 2>/dev/null; then
        echo -e "${GREEN}✓ Default branch set to 'main' on GitHub${NC}"
    else
        echo -e "${YELLOW}⚠️  Could not set default branch via CLI${NC}"
        echo -e "${CYAN}Please set manually:${NC}"
        echo -e "  GitHub → Settings → Branches → Default branch → Switch to 'main'"
    fi
else
    echo -e "${YELLOW}⚠️  GitHub CLI not installed${NC}"
    echo -e "${CYAN}Set default branch manually:${NC}"
    echo -e "  GitHub → Settings → Branches → Default branch → Switch to 'main'"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Branch Protection (Optional)${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}Do you want to add branch protection rules for 'main'?${NC}"
echo -e "${CYAN}(Prevents direct pushes, requires pull requests)${NC}"
echo ""
read -p "Add branch protection? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]] && command -v gh &> /dev/null; then
    echo ""
    echo -e "${CYAN}Enabling branch protection for 'main'...${NC}"

    # Create branch protection rule
    gh api \
        --method PUT \
        -H "Accept: application/vnd.github+json" \
        "/repos/:owner/:repo/branches/main/protection" \
        -f "required_status_checks[strict]=false" \
        -f "required_status_checks[contexts][]=[]" \
        -f "enforce_admins=false" \
        -f "required_pull_request_reviews[dismiss_stale_reviews]=true" \
        -f "required_pull_request_reviews[require_code_owner_reviews]=false" \
        -f "required_pull_request_reviews[required_approving_review_count]=1" \
        -f "restrictions=null" \
        2>/dev/null

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Branch protection enabled for 'main'${NC}"
    else
        echo -e "${YELLOW}⚠️  Failed to enable branch protection${NC}"
        echo -e "${CYAN}Add manually in GitHub UI:${NC}"
        echo -e "  Settings → Branches → Add branch protection rule"
    fi
else
    echo -e "${YELLOW}⊘ Skipping branch protection${NC}"
    echo -e "${CYAN}Add later in GitHub UI if needed:${NC}"
    echo -e "  Settings → Branches → Branch protection rules"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Verification${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${GREEN}✓ Local branches:${NC}"
git branch -v | while read -r line; do
    echo -e "  ${YELLOW}$line${NC}"
done

echo ""
echo -e "${GREEN}✓ Remote branches:${NC}"
git branch -r | grep origin | while read -r line; do
    echo -e "  ${YELLOW}$line${NC}"
done

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Branch Setup Summary${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${CYAN}Branches configured:${NC}"
echo ""
echo -e "${YELLOW}dev${NC}      → Development environment"
echo -e "           Deploy: ${GREEN}git push origin dev${NC}"
echo ""
echo -e "${YELLOW}staging${NC}  → Staging environment"
echo -e "           Deploy: ${GREEN}git push origin staging${NC}"
echo ""
echo -e "${YELLOW}main${NC}     → Production environment"
echo -e "           Deploy: ${GREEN}git push origin main${NC} (requires approval)"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Next Steps${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${GREEN}1.${NC} Setup GitHub environments:"
echo -e "   ${YELLOW}./scripts/setup-github-environments.sh${NC}"
echo ""

echo -e "${GREEN}2.${NC} Setup D1 databases:"
echo -e "   ${YELLOW}./scripts/setup-d1-databases.sh${NC}"
echo ""

echo -e "${GREEN}3.${NC} Deploy to dev:"
echo -e "   ${YELLOW}git checkout dev${NC}"
echo -e "   ${YELLOW}git push origin dev${NC}"
echo ""

echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Git Branches Setup Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""
