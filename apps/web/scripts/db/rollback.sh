#!/bin/bash
# Quick rollback script for Neon managed Postgres
# Usage: ./scripts/db/rollback.sh [staging|production]

set -euo pipefail

ENVIRONMENT=${1:-staging}
PROJECT_ID=${NEON_PROJECT_ID:-}

if [ -z "$PROJECT_ID" ]; then
  echo "❌ Error: NEON_PROJECT_ID environment variable not set"
  echo "Set it with: export NEON_PROJECT_ID=your-project-id"
  exit 1
fi

echo "🔄 Neon Branch Rollback Tool"
echo "Environment: $ENVIRONMENT"
echo "Project ID: $PROJECT_ID"
echo ""

# Check if neon CLI is installed
if ! command -v neon &> /dev/null; then
  echo "❌ Error: Neon CLI not installed"
  echo "Install with: npm install -g neonctl"
  exit 1
fi

# List available branches
echo "📋 Available Neon branches:"
echo ""
neon branches list --project-id "$PROJECT_ID" || {
  echo "❌ Failed to list branches. Check your NEON_API_KEY and PROJECT_ID"
  exit 1
}

echo ""
echo "---"
echo ""

# Get current primary branch
CURRENT_PRIMARY=$(neon branches list --project-id "$PROJECT_ID" --output json | jq -r '.[] | select(.primary == true) | .id' 2>/dev/null || echo "unknown")
echo "Current primary branch: $CURRENT_PRIMARY"
echo ""

# Prompt for branch ID
read -p "Enter branch ID to promote (or 'cancel' to abort): " BRANCH_ID

if [ "$BRANCH_ID" = "cancel" ] || [ -z "$BRANCH_ID" ]; then
  echo "❌ Rollback cancelled"
  exit 0
fi

# Confirm action
echo ""
echo "⚠️  WARNING: You are about to promote branch '$BRANCH_ID' to primary"
echo "This will make it the active database for $ENVIRONMENT"
echo ""
read -p "Are you sure? Type 'yes' to confirm: " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "❌ Rollback cancelled"
  exit 0
fi

# Promote branch
echo ""
echo "🔄 Promoting branch $BRANCH_ID to primary..."
if neon branches set-primary "$BRANCH_ID" --project-id "$PROJECT_ID"; then
  echo "✅ Branch promoted successfully"
  echo ""
  echo "📝 Next steps:"
  echo "1. Get the new connection string:"
  echo "   neon connection-string --branch $BRANCH_ID --project-id $PROJECT_ID"
  echo ""
  echo "2. Update DATABASE_URL in your deployment environment"
  echo ""
  echo "3. Redeploy your application"
  echo ""
  echo "4. Monitor for errors and verify database state"
  echo ""
  echo "5. Document this rollback in your incident report"
else
  echo "❌ Failed to promote branch"
  exit 1
fi
