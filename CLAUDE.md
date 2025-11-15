# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16+ boilerplate with App Router, TypeScript, Tailwind CSS 4, and production-ready integrations. It prioritizes developer experience with a comprehensive tech stack including authentication (Clerk), database ORM (DrizzleORM), i18n (next-intl), testing (Vitest + Playwright), error monitoring (Sentry), logging (LogTape), security (Arcjet), and analytics (PostHog).

**Monorepo Structure:** This project uses a pnpm workspace monorepo with the following packages:
- `apps/web/` - Main Next.js application (all core features)
- `apps/docs/` - Documentation site (Nextra with App Router)

## Essential Commands

**Package Manager:** This project uses `pnpm` for the monorepo. Install with: `npm install -g pnpm`

**Makefile Available:** For convenience, a comprehensive `Makefile` is provided with shorter, memorable commands. Use `make help` to see all available commands.

### Quick Start with Makefile
```bash
make help           # Show all available commands
make dev            # Start development server
make test           # Run tests
make ready          # Check if ready to commit
make ship           # Prepare for deployment
```

### Development
```bash
pnpm dev                    # Start web app dev server (http://localhost:3000)
pnpm dev:docs               # Start docs site dev server
pnpm dev:all                # Start both apps in parallel
pnpm --filter web dev:spotlight  # Start Sentry Spotlight (dev error monitoring)
```

### Build & Deploy
```bash
pnpm build                  # Build web app
pnpm build:docs             # Build docs site
pnpm build:all              # Build both apps
pnpm start                  # Run web app production build
pnpm start:docs             # Run docs production build
pnpm --filter web build-local    # Build web with in-memory database
```

### Testing (Web App)
```bash
pnpm test                   # Run all unit tests (Vitest)
pnpm test:e2e               # Run E2E tests (Playwright)
npx playwright install      # Install Playwright browsers (first time only)
pnpm --filter web storybook # Start Storybook on http://localhost:6006
pnpm --filter web storybook:test  # Run Storybook tests in headless mode
```

### Code Quality
```bash
pnpm lint                   # Lint web app
pnpm lint:docs              # Lint docs site
pnpm lint:all               # Lint all workspaces in parallel
pnpm --filter web lint:fix  # Auto-fix linting issues in web app
pnpm --filter web check:types    # TypeScript type checking
pnpm --filter web check:deps     # Find unused dependencies/files (Knip)
pnpm --filter web check:i18n     # Validate translations completeness
pnpm --filter web build-stats    # Analyze bundle size
```

### Database
```bash
pnpm --filter web db:generate    # Generate migration from schema changes
pnpm --filter web db:migrate     # Apply migrations
pnpm --filter web db:studio      # Open Drizzle Studio (https://local.drizzle.studio)
```

### Other
```bash
pnpm --filter web commit         # Interactive commit with Conventional Commits
pnpm clean                       # Remove .next, out, coverage from all apps
```

## Architecture

### Workspace Structure

```
/
├── apps/
│   ├── web/              # Main Next.js application
│   │   ├── src/          # Application source code
│   │   ├── public/       # Static assets
│   │   ├── migrations/   # Database migrations
│   │   └── package.json  # Web app dependencies
│   └── docs/             # Documentation site (Nextra)
│       ├── app/          # Nextra App Router structure
│       └── package.json  # Docs dependencies
├── pnpm-workspace.yaml   # Workspace configuration
└── package.json          # Root workspace scripts
```

### App Router Structure (Web App)

The web app uses Next.js App Router with i18n and route groups:

- `apps/web/src/app/[locale]/(marketing)/` - Public marketing pages (home, about, portfolio)
- `apps/web/src/app/[locale]/(auth)/dashboard/` - Protected dashboard pages
- `apps/web/src/app/[locale]/(auth)/(center)/` - Centered auth pages (sign-in, sign-up)
- `apps/web/src/app/[locale]/api/` - API routes

Route groups `(marketing)`, `(auth)`, and `(center)` organize routes without affecting URLs.

### Core Libraries Configuration (Web App)

**i18n Setup:**
- `apps/web/src/libs/I18n.ts` - next-intl configuration
- `apps/web/src/libs/I18nRouting.ts` - Routing configuration
- `apps/web/src/libs/I18nNavigation.ts` - Type-safe navigation with i18n
- `apps/web/src/locales/` - Translation files (only edit `en.json`, Crowdin handles others)
- `apps/web/src/utils/AppConfig.ts` - Locale configuration

**Database:**
- `apps/web/src/models/Schema.ts` - Drizzle ORM schema definitions
- `apps/web/src/utils/DBConnection.ts` - Database connection factory
- `apps/web/src/libs/DB.ts` - Database utilities
- `apps/web/migrations/` - Database migration files
- Local development uses PGlite (no Docker needed)
- Production requires PostgreSQL (recommended: Prisma Postgres)

**Security & Monitoring:**
- `apps/web/src/libs/Arcjet.ts` - Base Arcjet instance with Shield WAF
- `apps/web/src/middleware.ts` - Bot detection, auth protection, i18n routing
- `apps/web/src/libs/Logger.ts` - LogTape configuration with Better Stack integration
- Sentry configured via `apps/web/next.config.ts` and instrumentation files

**Environment Variables:**
- `apps/web/src/libs/Env.ts` - Type-safe environment variables with T3 Env
- `apps/web/.env` - Default values (tracked by Git)
- `apps/web/.env.local` - Secrets and overrides (NOT tracked by Git)

### Middleware Flow (Web App)

The middleware (`apps/web/src/middleware.ts`) executes in this order:
1. Arcjet bot detection and Shield WAF (if `ARCJET_KEY` is set)
2. Clerk authentication for protected routes (`/dashboard`) and auth pages
3. next-intl i18n routing

**Important:** Middleware runs on Node.js runtime, not Edge. This is required for database connections with Webpack builds on Vercel.

### Testing Strategy (Web App)

**Unit Tests:**
- Location: Colocated with source files (`*.test.ts`, `*.test.tsx`) in `apps/web/src/`
- Framework: Vitest with two projects:
  - `unit`: Node environment for `.test.ts` files (excluding hooks)
  - `ui`: Browser mode with Playwright for `.test.tsx` and hook tests
- Run with: `pnpm test`

**Integration & E2E Tests:**
- Location: `apps/web/tests/integration/` and `apps/web/tests/e2e/`
- File patterns: `*.spec.ts` (integration), `*.e2e.ts` (E2E)
- Framework: Playwright (Chromium locally, Chromium + Firefox in CI)
- Checkly monitoring: Tests with `*.check.e2e.ts` run as synthetic monitoring

**Storybook:**
- Stories: Colocated with components (`*.stories.ts`, `*.stories.tsx`)
- Testing: Accessibility checks included via `@storybook/addon-a11y`

### Database Schema Changes

Workflow:
1. Edit `apps/web/src/models/Schema.ts`
2. Run `pnpm --filter web db:generate` to create migration
3. Migration auto-applies on dev server restart via `apps/web/instrumentation.ts`
4. Or manually run `pnpm --filter web db:migrate`

Production deploys automatically run migrations during build.

### Translations (i18n)

**Developer workflow:**
- Only edit `apps/web/src/locales/en.json` (or your default language)
- Other languages are auto-generated by Crowdin
- Validation: `pnpm --filter web check:i18n`

**Crowdin sync:**
- Auto-syncs on push to `main` branch
- Can be triggered manually in GitHub Actions
- Runs daily at 5am

### Styling

- **Tailwind CSS 4** with PostCSS plugin
- Configuration: `apps/web/tailwind.config.ts` (if exists) or defaults
- Base template: `apps/web/src/templates/BaseTemplate.tsx`
- Unstyled by design - minimal opinionated styles

### Authentication (Modular System)

**Provider Selection:**
- Switch auth providers via `NEXT_PUBLIC_AUTH_PROVIDER` environment variable
- Options: `'clerk'` (default), `'cloudflare'`, `'cognito'`, `'test'`
- No code changes needed to switch providers

**Architecture:**
- `apps/web/src/libs/auth/` - Modular authentication system
- `apps/web/src/libs/auth/adapters/` - Provider implementations
  - `ClerkAdapter.tsx` - Fully implemented ✅
  - `CloudflareAdapter.tsx` - Fully implemented ✅
  - `CognitoAdapter.tsx` - Stub implementation ⚠️
  - `TestAdapter.tsx` - Test/development adapter ✅
- `apps/web/src/libs/auth/adapters/cloudflare/` - Cloudflare utilities
  - `utils.ts` - JWT verification, login/logout helpers
  - `UserProfile.tsx` - Custom profile UI
- `apps/web/src/libs/auth/factory.ts` - Provider factory (singleton)
- `apps/web/src/libs/auth/components.tsx` - Unified React components

**Usage:**
```typescript
// Server-side
import { getCurrentUser, isAuthenticated } from '@/libs/auth';

// Components
import { AuthProvider, SignInComponent, SignOutButtonComponent } from '@/libs/auth/components';
```

**Clerk Setup (default):**
- Keyless mode in development (use test keys from `apps/web/.env`)
- Protected routes defined in `apps/web/src/middleware.ts`
- Full-featured: UI components, multi-language, MFA, social auth

**Cloudflare Access Setup:**
- Set `NEXT_PUBLIC_AUTH_PROVIDER=cloudflare`
- Configure `NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN` and `NEXT_PUBLIC_CLOUDFLARE_AUDIENCE`
- Optional JWT verification with `NEXT_PUBLIC_CLOUDFLARE_VERIFY_JWT=true`
- Full-featured: Custom UI, profile management, JWT validation

### Customization Points

Search codebase for `FIXME:` comments to find key customization spots:
- `apps/web/src/utils/AppConfig.ts` - App name, locales
- `apps/web/src/templates/BaseTemplate.tsx` - Default theme
- `apps/web/next.config.ts` - Next.js configuration
- `apps/web/.env` - Environment variables
- Favicon files in `apps/web/public/`

### Git Workflow

- **Commit convention:** Conventional Commits (enforced by Commitlint)
- Use `pnpm --filter web commit` for guided commit messages
- GitHub Actions: CI tests, Crowdin sync, semantic releases
- Pre-commit hooks managed by Lefthook (not Husky) - configured in `apps/web/lefthook.yml`

### Key Integrations (Web App)

- **Error Monitoring:** Sentry (dev: Spotlight at `/monitoring`, prod: cloud)
- **Logging:** LogTape + Better Stack (prod)
- **Security:** Arcjet Shield WAF + bot detection
- **Analytics:** PostHog (configure with keys)
- **Code Coverage:** Codecov (CI only)
- **Monitoring:** Checkly (synthetic monitoring for production)

### TypeScript Paths

Absolute imports in web app use `@/` prefix mapping to `apps/web/src/`:
```typescript
import { counterSchema } from '@/models/Schema';
import { AppConfig } from '@/utils/AppConfig';
```

In the web app context, these resolve to:
- `@/models/Schema` → `apps/web/src/models/Schema.ts`
- `@/utils/AppConfig` → `apps/web/src/utils/AppConfig.ts`

## Important Notes

- **Package Manager:** Requires pnpm (install: `npm install -g pnpm`)
- **Node version:** Requires Node.js 20+
- **Monorepo:** Uses pnpm workspace with `apps/web` and `apps/docs`
- **Database:** Local development works out of the box with PGlite. Production needs PostgreSQL connection string in `DATABASE_URL`.
- **Secrets:** Never commit `.env.local` - it's in `.gitignore`
- **Middleware runtime:** Uses `nodejs` runtime, not Edge (required for database connections)
- **Bundle analyzer:** Run `pnpm --filter web build-stats` to analyze webpack bundle size
- **React Compiler:** Enabled in production builds (`reactCompiler: true`)
- **Turbopack:** File system caching enabled for dev mode

## VSCode Integration

Recommended extensions defined in `.vscode/extension.json`. Configurations include:
- Debug configurations for frontend/backend
- Tasks for common operations
- Settings for ESLint, Prettier auto-fix on save

## Documentation Site (apps/docs)

The docs site uses Nextra with Next.js App Router:
- **Tech Stack:** Next.js 15+, Nextra, App Router
- **Content:** Documentation in `apps/docs/app/` directory
- **Commands:** `pnpm dev:docs` (dev), `pnpm build:docs` (build)
- **Port:** Runs on a different port from web app (configured in package.json)

## Makefile Commands

A comprehensive `Makefile` provides an intuitive interface for all common operations. Commands are organized into logical categories:

### Quick Reference
```bash
# Most Common Commands
make dev              # Start development server
make test             # Run unit tests
make test-e2e         # Run E2E tests
make lint             # Lint code
make build            # Build for production

# Workflow Shortcuts
make work             # Install deps + start dev (typical start)
make dev-fresh        # Clean + install + dev (fresh start)
make ready            # Run all checks before commit
make ship             # Full deployment preparation
make setup            # Initial project setup

# Database
make db-migrate       # Apply migrations
make db-generate      # Generate new migration
make db-studio        # Open database GUI

# Quality
make quality          # Run all quality checks
make ci-check         # Run all CI checks
make type-check       # TypeScript type checking

# Utilities
make help             # Show all available commands
make info             # Show project information
make clean            # Remove build artifacts
```

### Command Categories
1. **Development** - dev, dev-docs, dev-all, dev-spotlight
2. **Build & Production** - build, build-docs, build-all, start
3. **Testing** - test, test-e2e, test-coverage, test-all
4. **Database** - db-migrate, db-generate, db-studio, db-reset
5. **Code Quality** - lint, format, type-check, quality
6. **Dependencies** - install, update, outdated
7. **Cleanup** - clean, clean-deps, clean-cache
8. **Tools** - storybook, commit, pre-commit
9. **Workflows** - work, ready, ship, setup

Run `make help` to see the complete list with descriptions.
