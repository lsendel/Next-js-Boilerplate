# ============================================================================
# Next.js Boilerplate Monorepo - Makefile
# ============================================================================
# A logically organized Makefile for common development scenarios
# Usage: make <target>
# Tip: Run 'make help' to see all available commands
# ============================================================================

.PHONY: help
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# ============================================================================
# 📚 HELP & DOCUMENTATION
# ============================================================================

help: ## Show this help message
	@echo "$(BLUE)╔════════════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║$(NC)  Next.js Boilerplate Monorepo - Available Commands         $(BLUE)║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "; category=""} \
		/^## / {category=substr($$0, 4); printf "\n$(YELLOW)%s$(NC)\n", category; next} \
		{printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

# ============================================================================
## 🚀 DEVELOPMENT
# ============================================================================

dev: ## Start web app development server (PGlite + Next.js + Spotlight)
	@echo "$(BLUE)Starting web app development server...$(NC)"
	pnpm dev

dev-web: ## Start web app only (alias for 'dev')
	@$(MAKE) dev

dev-docs: ## Start documentation site development server
	@echo "$(BLUE)Starting documentation site...$(NC)"
	pnpm dev:docs

dev-all: ## Start both web app and docs in parallel
	@echo "$(BLUE)Starting all development servers...$(NC)"
	pnpm dev:all

dev-spotlight: ## Start only Sentry Spotlight for error monitoring
	@echo "$(BLUE)Starting Sentry Spotlight...$(NC)"
	pnpm --filter web dev:spotlight

dev-next: ## Start only Next.js dev server (no database, no spotlight)
	@echo "$(BLUE)Starting Next.js dev server only...$(NC)"
	pnpm --filter web dev:next

# ============================================================================
## 🏗️  BUILD & PRODUCTION
# ============================================================================

build: ## Build web app for production
	@echo "$(BLUE)Building web app for production...$(NC)"
	pnpm build

build-docs: ## Build documentation site
	@echo "$(BLUE)Building documentation site...$(NC)"
	pnpm build:docs

build-all: ## Build both web app and docs
	@echo "$(BLUE)Building all projects...$(NC)"
	pnpm build:all

build-local: ## Build web app with in-memory database (for testing)
	@echo "$(BLUE)Building web app with local PGlite database...$(NC)"
	pnpm --filter web build-local

build-analyze: ## Build and analyze bundle size
	@echo "$(BLUE)Building and analyzing bundle size...$(NC)"
	pnpm --filter web build-stats

start: ## Start production build of web app
	@echo "$(BLUE)Starting production server...$(NC)"
	pnpm start

start-docs: ## Start production build of docs
	@echo "$(BLUE)Starting docs production server...$(NC)"
	pnpm start:docs

# ============================================================================
## 🧪 TESTING
# ============================================================================

test: ## Run all unit tests (Vitest)
	@echo "$(BLUE)Running unit tests...$(NC)"
	pnpm test

test-watch: ## Run unit tests in watch mode
	@echo "$(BLUE)Running unit tests in watch mode...$(NC)"
	pnpm --filter web test:watch

test-coverage: ## Run unit tests with coverage report
	@echo "$(BLUE)Running unit tests with coverage...$(NC)"
	pnpm --filter web test:coverage

test-e2e: ## Run E2E tests with Playwright
	@echo "$(BLUE)Running E2E tests...$(NC)"
	pnpm test:e2e

test-e2e-ui: ## Run E2E tests with Playwright UI
	@echo "$(BLUE)Running E2E tests with UI...$(NC)"
	pnpm --filter web test:e2e:ui

test-e2e-headed: ## Run E2E tests in headed mode (visible browser)
	@echo "$(BLUE)Running E2E tests in headed mode...$(NC)"
	pnpm --filter web test:e2e:headed

test-storybook: ## Run Storybook tests
	@echo "$(BLUE)Running Storybook tests...$(NC)"
	pnpm --filter web storybook:test

test-all: ## Run all tests (unit + e2e + storybook)
	@echo "$(BLUE)Running all tests...$(NC)"
	@$(MAKE) test
	@$(MAKE) test-e2e
	@$(MAKE) test-storybook

# ============================================================================
## 🗄️  DATABASE
# ============================================================================

db-generate: ## Generate database migration from schema changes
	@echo "$(BLUE)Generating database migration...$(NC)"
	pnpm --filter web db:generate

db-migrate: ## Apply database migrations
	@echo "$(BLUE)Applying database migrations...$(NC)"
	pnpm --filter web db:migrate

db-studio: ## Open Drizzle Studio (database GUI)
	@echo "$(BLUE)Opening Drizzle Studio...$(NC)"
	pnpm --filter web db:studio

db-push: ## Push schema changes directly to database (dev only)
	@echo "$(BLUE)Pushing schema changes to database...$(NC)"
	pnpm --filter web db:push

db-seed: ## Seed database with sample data
	@echo "$(BLUE)Seeding database...$(NC)"
	pnpm --filter web db:seed

db-reset: ## Reset database (drop all tables and rerun migrations)
	@echo "$(RED)WARNING: This will delete all data!$(NC)"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo "$(BLUE)Resetting database...$(NC)"
	pnpm --filter web db:reset

# ============================================================================
## ✨ CODE QUALITY
# ============================================================================

lint: ## Lint web app
	@echo "$(BLUE)Linting web app...$(NC)"
	pnpm lint

lint-docs: ## Lint documentation site
	@echo "$(BLUE)Linting documentation site...$(NC)"
	pnpm lint:docs

lint-all: ## Lint all workspaces in parallel
	@echo "$(BLUE)Linting all workspaces...$(NC)"
	pnpm lint:all

lint-fix: ## Auto-fix linting issues in web app
	@echo "$(BLUE)Auto-fixing linting issues...$(NC)"
	pnpm --filter web lint:fix

format: ## Format code with Prettier
	@echo "$(BLUE)Formatting code...$(NC)"
	pnpm --filter web format

format-check: ## Check code formatting without changing files
	@echo "$(BLUE)Checking code formatting...$(NC)"
	pnpm --filter web format:check

type-check: ## Run TypeScript type checking
	@echo "$(BLUE)Running TypeScript type checking...$(NC)"
	pnpm --filter web check:types

check-deps: ## Find unused dependencies and files (Knip)
	@echo "$(BLUE)Checking for unused dependencies...$(NC)"
	pnpm --filter web check:deps

check-i18n: ## Validate translation completeness
	@echo "$(BLUE)Validating translations...$(NC)"
	pnpm --filter web check:i18n

quality: ## Run all quality checks (lint, type-check, format-check)
	@echo "$(BLUE)Running all quality checks...$(NC)"
	@$(MAKE) lint-all
	@$(MAKE) type-check
	@$(MAKE) format-check

ci-check: ## Run all CI checks (quality + tests)
	@echo "$(BLUE)Running CI checks...$(NC)"
	pnpm --filter web ci:check

# ============================================================================
## 📦 DEPENDENCIES
# ============================================================================

install: ## Install all dependencies (pnpm install)
	@echo "$(BLUE)Installing dependencies...$(NC)"
	pnpm install

install-clean: ## Clean install (remove node_modules, lockfile, and reinstall)
	@echo "$(BLUE)Performing clean install...$(NC)"
	@$(MAKE) clean-deps
	pnpm install

update: ## Update all dependencies (interactive)
	@echo "$(BLUE)Updating dependencies...$(NC)"
	pnpm update --interactive --latest

update-web: ## Update web app dependencies only
	@echo "$(BLUE)Updating web app dependencies...$(NC)"
	pnpm --filter web update --interactive --latest

update-docs: ## Update docs dependencies only
	@echo "$(BLUE)Updating docs dependencies...$(NC)"
	pnpm --filter docs update --interactive --latest

outdated: ## Check for outdated dependencies
	@echo "$(BLUE)Checking for outdated dependencies...$(NC)"
	pnpm outdated

playwright-install: ## Install Playwright browsers
	@echo "$(BLUE)Installing Playwright browsers...$(NC)"
	npx playwright install

# ============================================================================
## 🧹 CLEANUP
# ============================================================================

clean: ## Remove build artifacts (.next, out, coverage)
	@echo "$(BLUE)Cleaning build artifacts...$(NC)"
	pnpm clean

clean-deps: ## Remove all node_modules
	@echo "$(BLUE)Removing node_modules...$(NC)"
	rm -rf node_modules apps/*/node_modules

clean-cache: ## Remove all cache files (.next, turbo cache, etc.)
	@echo "$(BLUE)Removing cache files...$(NC)"
	rm -rf apps/*/.next apps/*/.turbo .turbo

clean-all: ## Remove all generated files (node_modules, build, cache)
	@echo "$(RED)Removing all generated files...$(NC)"
	@$(MAKE) clean
	@$(MAKE) clean-deps
	@$(MAKE) clean-cache
	rm -rf pnpm-lock.yaml

# ============================================================================
## 🎨 DEVELOPMENT TOOLS
# ============================================================================

storybook: ## Start Storybook development server
	@echo "$(BLUE)Starting Storybook...$(NC)"
	pnpm --filter web storybook

storybook-build: ## Build Storybook for production
	@echo "$(BLUE)Building Storybook...$(NC)"
	pnpm --filter web storybook:build

commit: ## Interactive commit with Conventional Commits
	@echo "$(BLUE)Starting interactive commit...$(NC)"
	pnpm --filter web commit

pre-commit: ## Run pre-commit hooks manually
	@echo "$(BLUE)Running pre-commit hooks...$(NC)"
	cd apps/web && lefthook run pre-commit

# ============================================================================
## 📊 MONITORING & DEBUGGING
# ============================================================================

logs-web: ## Show web app logs (if running in background)
	@echo "$(BLUE)Showing web app logs...$(NC)"
	@echo "$(YELLOW)Note: Only works if app is running$(NC)"

analyze: ## Analyze bundle size
	@$(MAKE) build-analyze

lighthouse: ## Run Lighthouse audit (requires production build)
	@echo "$(BLUE)Running Lighthouse audit...$(NC)"
	@echo "$(YELLOW)Make sure production build is running on localhost:3000$(NC)"
	npx lighthouse http://localhost:3000 --view

# ============================================================================
## 🚢 DEPLOYMENT
# ============================================================================

deploy-check: ## Run pre-deployment checks
	@echo "$(BLUE)Running pre-deployment checks...$(NC)"
	@$(MAKE) quality
	@$(MAKE) test-all
	@$(MAKE) build
	@echo "$(GREEN)✓ All checks passed! Ready to deploy.$(NC)"

docker-build: ## Build Docker image (if Dockerfile exists)
	@echo "$(BLUE)Building Docker image...$(NC)"
	docker build -t nextjs-boilerplate .

docker-run: ## Run Docker container
	@echo "$(BLUE)Running Docker container...$(NC)"
	docker run -p 3000:3000 nextjs-boilerplate

# ============================================================================
## 📝 DOCUMENTATION
# ============================================================================

docs-dev: ## Start documentation site (alias for dev-docs)
	@$(MAKE) dev-docs

docs-build: ## Build documentation site (alias for build-docs)
	@$(MAKE) build-docs

# ============================================================================
## 🔧 UTILITIES
# ============================================================================

info: ## Show project information
	@echo "$(BLUE)╔════════════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║$(NC)  Project Information                                        $(BLUE)║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(GREEN)Node version:$(NC)       $$(node --version)"
	@echo "$(GREEN)pnpm version:$(NC)       $$(pnpm --version)"
	@echo "$(GREEN)Project structure:$(NC) pnpm monorepo"
	@echo "$(GREEN)Workspaces:$(NC)"
	@echo "  - apps/web  (Next.js application)"
	@echo "  - apps/docs (Nextra documentation)"
	@echo ""

check-env: ## Check if required environment variables are set
	@echo "$(BLUE)Checking environment variables...$(NC)"
	@cd apps/web && node -e "require('./src/libs/Env.ts')" && echo "$(GREEN)✓ Environment variables are valid$(NC)" || echo "$(RED)✗ Environment variables are invalid$(NC)"

setup: ## Initial setup (install deps + playwright + migrate)
	@echo "$(BLUE)Running initial setup...$(NC)"
	@$(MAKE) install
	@$(MAKE) playwright-install
	@$(MAKE) db-migrate
	@echo "$(GREEN)✓ Setup complete!$(NC)"
	@echo ""
	@echo "$(YELLOW)Run 'make dev' to start development server$(NC)"

# ============================================================================
## 🎯 COMMON WORKFLOWS
# ============================================================================

dev-fresh: ## Fresh development start (clean + install + dev)
	@echo "$(BLUE)Starting fresh development environment...$(NC)"
	@$(MAKE) clean
	@$(MAKE) install
	@$(MAKE) dev

work: ## Start typical development workflow (install + dev)
	@echo "$(BLUE)Starting work session...$(NC)"
	@$(MAKE) install
	@$(MAKE) dev

ready: ## Check if project is ready for commit (quality + tests)
	@echo "$(BLUE)Checking if project is ready for commit...$(NC)"
	@$(MAKE) quality
	@$(MAKE) test
	@echo "$(GREEN)✓ Project is ready for commit!$(NC)"

ship: ## Prepare for deployment (quality + test-all + build)
	@echo "$(BLUE)Preparing for deployment...$(NC)"
	@$(MAKE) deploy-check
	@echo "$(GREEN)✓ Ready to ship!$(NC)"
