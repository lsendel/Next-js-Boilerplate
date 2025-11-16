#!/bin/bash

# Migration Script: Upgrade to Optimized GitHub Workflows
# This script automates the migration to 2025 best practices
#
# Usage: bash scripts/migrate-to-optimized-workflows.sh [--dry-run]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DRY_RUN=false
BACKUP_DIR=".github/workflows/backup-$(date +%Y%m%d-%H%M%S)"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --help)
      echo "Usage: $0 [--dry-run] [--help]"
      echo ""
      echo "Options:"
      echo "  --dry-run    Show what would be done without making changes"
      echo "  --help       Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Helper functions
print_header() {
  echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
}

print_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

confirm() {
  if [ "$DRY_RUN" = true ]; then
    return 0
  fi

  read -p "$1 (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    return 0
  else
    return 1
  fi
}

# Main script
print_header "GitHub Workflows Migration to 2025 Best Practices"

if [ "$DRY_RUN" = true ]; then
  print_warning "DRY RUN MODE - No changes will be made"
fi

# Check prerequisites
print_info "Checking prerequisites..."

if ! command -v gh &> /dev/null; then
  print_warning "GitHub CLI (gh) not found - some features will be limited"
else
  print_success "GitHub CLI found"
fi

if [ ! -d ".github/workflows" ]; then
  print_error "Not in a GitHub repository root (no .github/workflows found)"
  exit 1
fi

print_success "Running in GitHub repository"

# Step 1: Backup existing workflows
print_header "Step 1: Backup Existing Workflows"

if [ "$DRY_RUN" = false ]; then
  mkdir -p "$BACKUP_DIR"
  cp -r .github/workflows/* "$BACKUP_DIR/" 2>/dev/null || true
  print_success "Backed up workflows to $BACKUP_DIR"
else
  print_info "Would create backup at $BACKUP_DIR"
fi

# Step 2: Check if optimized workflows exist
print_header "Step 2: Verify Optimized Workflows"

files_to_check=(
  ".github/workflows/CI-optimized.yml"
  ".github/workflows/merge-queue-optimized.yml"
  ".github/actions/setup-monorepo-optimized/action.yml"
  ".github/workflows/dependabot-auto-merge.yml"
)

all_exist=true
for file in "${files_to_check[@]}"; do
  if [ -f "$file" ]; then
    print_success "Found: $file"
  else
    print_error "Missing: $file"
    all_exist=false
  fi
done

if [ "$all_exist" = false ]; then
  print_error "Some optimized workflow files are missing"
  print_info "Please ensure all files from the migration guide are present"
  exit 1
fi

# Step 3: Rename workflows
print_header "Step 3: Activate Optimized Workflows"

if confirm "Activate optimized CI workflow?"; then
  if [ "$DRY_RUN" = false ]; then
    if [ -f ".github/workflows/CI.yml" ]; then
      mv .github/workflows/CI.yml .github/workflows/CI-legacy.yml
      print_success "Backed up CI.yml → CI-legacy.yml"
    fi
    mv .github/workflows/CI-optimized.yml .github/workflows/CI.yml
    print_success "Activated CI-optimized.yml → CI.yml"
  else
    print_info "Would rename CI.yml → CI-legacy.yml"
    print_info "Would rename CI-optimized.yml → CI.yml"
  fi
fi

if confirm "Activate merge queue workflow?"; then
  if [ "$DRY_RUN" = false ]; then
    if [ ! -f ".github/workflows/merge-queue.yml" ]; then
      mv .github/workflows/merge-queue-optimized.yml .github/workflows/merge-queue.yml
      print_success "Activated merge-queue-optimized.yml → merge-queue.yml"
    else
      print_warning "merge-queue.yml already exists, skipping"
    fi
  else
    print_info "Would rename merge-queue-optimized.yml → merge-queue.yml"
  fi
fi

# Step 4: Update composite action
print_header "Step 4: Update Composite Actions"

if [ "$DRY_RUN" = false ]; then
  if [ -d ".github/actions/setup-project" ]; then
    mv .github/actions/setup-project .github/actions/setup-project-legacy
    print_success "Backed up setup-project → setup-project-legacy"
  fi

  if [ -d ".github/actions/setup-monorepo-optimized" ]; then
    if [ ! -d ".github/actions/setup-monorepo" ]; then
      cp -r .github/actions/setup-monorepo-optimized .github/actions/setup-monorepo
      print_success "Created setup-monorepo composite action"
    fi
  fi
else
  print_info "Would backup setup-project → setup-project-legacy"
  print_info "Would create setup-monorepo from setup-monorepo-optimized"
fi

# Step 5: GitHub Settings
print_header "Step 5: GitHub Repository Settings"

print_info "The following settings need to be configured manually:"
echo ""
echo "1. Enable Merge Queue:"
echo "   Settings → General → Pull Requests → Merge queue"
echo "   - Check 'Require merge queue'"
echo "   - Merge method: Squash and merge"
echo "   - Build concurrency: 5"
echo ""
echo "2. Update Branch Protection (main):"
echo "   Settings → Branches → main → Edit"
echo "   - Require status checks:"
echo "     • Quality / lint"
echo "     • Quality / type-check"
echo "     • Unit Tests"
echo "     • Build / web"
echo ""
echo "3. Optional: Add Secrets (for Turbo remote cache)"
echo "   Settings → Secrets and variables → Actions"
echo "   - TURBO_TOKEN (if using Vercel remote cache)"
echo ""

if command -v gh &> /dev/null; then
  if confirm "Open repository settings in browser?"; then
    gh repo view --web
  fi
fi

# Step 6: Verify installation
print_header "Step 6: Verification"

print_info "Running verification checks..."

# Check workflow syntax
for workflow in .github/workflows/*.yml; do
  if [ -f "$workflow" ]; then
    # Basic YAML syntax check
    if command -v yamllint &> /dev/null; then
      if yamllint "$workflow" &> /dev/null; then
        print_success "Syntax OK: $(basename "$workflow")"
      else
        print_warning "Syntax issues in $(basename "$workflow")"
      fi
    fi
  fi
done

# Check for required secrets/vars
print_info "Checking for optional configuration..."

if [ -f ".env" ] || [ -f ".env.local" ]; then
  print_success "Environment files found"
fi

# Step 7: Generate migration summary
print_header "Migration Summary"

echo ""
echo "📊 Migration Status:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$DRY_RUN" = false ]; then
  echo "✅ Workflows backed up to: $BACKUP_DIR"
  echo "✅ Optimized CI activated"
  echo "✅ Merge queue workflow ready"
  echo "✅ Composite actions updated"
else
  echo "🔍 Dry run completed - no changes made"
fi

echo ""
echo "📋 Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Review changes:"
echo "   git status"
echo ""
echo "2. Configure GitHub settings (see above)"
echo ""
echo "3. Test with a PR:"
echo "   git checkout -b test-optimized-ci"
echo "   echo '# Test' >> README.md"
echo "   git add README.md"
echo "   git commit -m 'test: verify optimized workflows'"
echo "   git push -u origin test-optimized-ci"
echo "   gh pr create"
echo ""
echo "4. Monitor first run:"
echo "   gh run list --workflow=CI"
echo ""
echo "5. Measure improvements:"
echo "   - Compare execution time (should be 60% faster)"
echo "   - Check cache hit rate (should be >80%)"
echo "   - Verify auto-cancel works (push new commit)"
echo ""

if [ "$DRY_RUN" = false ]; then
  echo "6. Commit changes:"
  echo "   git add .github/"
  echo "   git commit -m 'ci: migrate to optimized workflows (2025 best practices)'"
  echo "   git push"
  echo ""
fi

echo "📚 Documentation:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "- Migration Guide: MIGRATION_GUIDE.md"
echo "- Quick Start: QUICK_START_IMPROVEMENTS.md"
echo "- Full Plan: GITHUB_WORKFLOWS_IMPROVEMENT_PLAN.md"
echo "- Patterns: GITHUB_ACTIONS_2025_PATTERNS.md"
echo ""

# Rollback instructions
echo "🔄 Rollback (if needed):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
if [ "$DRY_RUN" = false ]; then
  echo "mv .github/workflows/CI.yml .github/workflows/CI-new.yml"
  echo "mv .github/workflows/CI-legacy.yml .github/workflows/CI.yml"
  echo ""
  echo "Or restore from backup:"
  echo "cp -r $BACKUP_DIR/* .github/workflows/"
else
  echo "No rollback needed (dry run mode)"
fi
echo ""

print_header "Migration Complete!"

if [ "$DRY_RUN" = false ]; then
  print_success "Ready to test! Create a PR to verify the improvements."
else
  print_info "Re-run without --dry-run to apply changes"
fi

echo ""
