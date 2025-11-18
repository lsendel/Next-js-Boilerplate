#!/bin/bash

# ============================================================================
# D1 Database Setup Script for SocialPet
# ============================================================================
# This script creates all D1 databases needed for the project
# and guides you through updating the wrangler.jsonc configuration
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project configuration
PROJECT_NAME="socialpet"
WRANGLER_CONFIG="apps/web/wrangler.jsonc"

# Database names
DATABASES=(
  "dev:socialpet-db-dev:Development database"
  "test:socialpet-db-test:Test database for integration tests"
  "staging:socialpet-db-staging:Staging database"
  "production:socialpet-db-production:Production database"
)

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    SocialPet D1 Database Setup Script                     ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler CLI is not installed${NC}"
    echo -e "${YELLOW}Install it with: npm install -g wrangler${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Wrangler CLI detected${NC}"
echo ""

# Check if logged in
echo -e "${BLUE}Checking Cloudflare authentication...${NC}"
if ! wrangler whoami &> /dev/null; then
    echo -e "${RED}❌ Not logged in to Cloudflare${NC}"
    echo -e "${YELLOW}Logging in now...${NC}"
    wrangler login
fi

echo -e "${GREEN}✓ Authenticated with Cloudflare${NC}"
echo ""

# Get account information
ACCOUNT_INFO=$(wrangler whoami)
echo -e "${BLUE}Account Information:${NC}"
echo "$ACCOUNT_INFO"
echo ""

# Confirm before proceeding
echo -e "${YELLOW}⚠️  This script will create 4 D1 databases:${NC}"
for db in "${DATABASES[@]}"; do
    ENV="${db%%:*}"
    DB_NAME=$(echo "$db" | cut -d':' -f2)
    DESCRIPTION=$(echo "$db" | cut -d':' -f3-)
    echo -e "  - ${GREEN}$DB_NAME${NC} ($DESCRIPTION)"
done
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Aborted${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Creating D1 Databases...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Store database IDs
declare -A DB_IDS

# Create each database
for db in "${DATABASES[@]}"; do
    ENV="${db%%:*}"
    DB_NAME=$(echo "$db" | cut -d':' -f2)
    DESCRIPTION=$(echo "$db" | cut -d':' -f3-)

    echo -e "${BLUE}Creating $DB_NAME...${NC}"

    # Check if database already exists
    if wrangler d1 list | grep -q "$DB_NAME"; then
        echo -e "${YELLOW}⚠️  Database '$DB_NAME' already exists. Skipping creation.${NC}"

        # Get existing database ID
        DB_ID=$(wrangler d1 list | grep "$DB_NAME" | awk '{print $2}')
        DB_IDS[$ENV]=$DB_ID

        echo -e "${GREEN}✓ Using existing database${NC}"
        echo -e "  Database ID: ${YELLOW}$DB_ID${NC}"
    else
        # Create database
        OUTPUT=$(wrangler d1 create "$DB_NAME" 2>&1)

        # Extract database ID from output
        DB_ID=$(echo "$OUTPUT" | grep -oP 'database_id = "\K[^"]+' || echo "")

        if [ -z "$DB_ID" ]; then
            echo -e "${RED}❌ Failed to create database${NC}"
            echo "$OUTPUT"
            exit 1
        fi

        DB_IDS[$ENV]=$DB_ID

        echo -e "${GREEN}✓ Database created successfully${NC}"
        echo -e "  Database ID: ${YELLOW}$DB_ID${NC}"
    fi

    echo ""
done

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Database Creation Complete!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Display summary
echo -e "${GREEN}✓ Summary:${NC}"
echo ""
for db in "${DATABASES[@]}"; do
    ENV="${db%%:*}"
    DB_NAME=$(echo "$db" | cut -d':' -f2)
    DB_ID=${DB_IDS[$ENV]}

    echo -e "${BLUE}$ENV:${NC}"
    echo -e "  Name: $DB_NAME"
    echo -e "  ID:   ${YELLOW}$DB_ID${NC}"
    echo ""
done

# Update wrangler.jsonc
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Updating wrangler.jsonc...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

if [ ! -f "$WRANGLER_CONFIG" ]; then
    echo -e "${RED}❌ wrangler.jsonc not found at $WRANGLER_CONFIG${NC}"
    exit 1
fi

# Create backup
BACKUP_FILE="${WRANGLER_CONFIG}.backup.$(date +%Y%m%d-%H%M%S)"
cp "$WRANGLER_CONFIG" "$BACKUP_FILE"
echo -e "${GREEN}✓ Backup created: $BACKUP_FILE${NC}"
echo ""

# Update database IDs in wrangler.jsonc
for db in "${DATABASES[@]}"; do
    ENV="${db%%:*}"
    DB_NAME=$(echo "$db" | cut -d':' -f2)
    DB_ID=${DB_IDS[$ENV]}

    # Different patterns for different environments
    if [ "$ENV" == "production" ]; then
        # Production is at root level
        sed -i.tmp "s/\"database_id\": \"YOUR_PRODUCTION_D1_DATABASE_ID\"/\"database_id\": \"$DB_ID\"/g" "$WRANGLER_CONFIG"
    else
        # Others are in env sections
        if [ "$ENV" == "dev" ]; then
            SEARCH_PATTERN="YOUR_DEV_D1_DATABASE_ID"
        elif [ "$ENV" == "test" ]; then
            SEARCH_PATTERN="YOUR_TEST_D1_DATABASE_ID"
        elif [ "$ENV" == "staging" ]; then
            SEARCH_PATTERN="YOUR_STAGING_D1_DATABASE_ID"
        fi

        sed -i.tmp "s/\"database_id\": \"$SEARCH_PATTERN\"/\"database_id\": \"$DB_ID\"/g" "$WRANGLER_CONFIG"
    fi
done

# Remove sed backup files
rm -f "${WRANGLER_CONFIG}.tmp"

echo -e "${GREEN}✓ wrangler.jsonc updated with all database IDs${NC}"
echo ""

# Verify changes
echo -e "${BLUE}Verifying configuration...${NC}"
if grep -q "YOUR.*DATABASE_ID" "$WRANGLER_CONFIG"; then
    echo -e "${YELLOW}⚠️  Warning: Some placeholder IDs remain in wrangler.jsonc${NC}"
    echo -e "${YELLOW}   Please check the file manually${NC}"
else
    echo -e "${GREEN}✓ All database IDs updated successfully${NC}"
fi
echo ""

# Next steps
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Next Steps:${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}1.${NC} Review the updated wrangler.jsonc:"
echo -e "   ${YELLOW}cat $WRANGLER_CONFIG${NC}"
echo ""
echo -e "${GREEN}2.${NC} Apply migrations to each database:"
echo -e "   ${YELLOW}cd apps/web${NC}"
echo -e "   ${YELLOW}pnpm d1:migrate                 # Development${NC}"
echo -e "   ${YELLOW}npx wrangler d1 migrations apply socialpet-db-test --remote --env test${NC}"
echo -e "   ${YELLOW}pnpm d1:migrate:stage           # Staging${NC}"
echo -e "   ${YELLOW}pnpm d1:migrate:prod            # Production${NC}"
echo ""
echo -e "${GREEN}3.${NC} Test database connectivity:"
echo -e "   ${YELLOW}npx wrangler d1 execute socialpet-db-dev --remote --command \"SELECT 1\"${NC}"
echo ""
echo -e "${GREEN}4.${NC} Configure GitHub Secrets:"
echo -e "   - ${YELLOW}CLOUDFLARE_API_TOKEN${NC}"
echo -e "   - ${YELLOW}CLOUDFLARE_ACCOUNT_ID${NC}"
echo ""
echo -e "${GREEN}5.${NC} Setup custom domains in Cloudflare Pages"
echo ""
echo -e "${GREEN}6.${NC} Deploy to environments:"
echo -e "   ${YELLOW}git push origin dev              # Deploy to dev${NC}"
echo -e "   ${YELLOW}git push origin staging          # Deploy to staging${NC}"
echo -e "   ${YELLOW}git push origin main             # Deploy to production${NC}"
echo ""

echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ D1 Database setup complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}For detailed setup instructions, see:${NC}"
echo -e "  ${YELLOW}docs/CLOUDFLARE_SOCIALPET_SETUP.md${NC}"
echo ""
