# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16+ boilerplate with App Router, TypeScript, Tailwind CSS 4, and production-ready integrations. It prioritizes developer experience with a comprehensive tech stack including authentication (Clerk), database ORM (DrizzleORM), i18n (next-intl), testing (Vitest + Playwright), error monitoring (Sentry), logging (LogTape), security (Arcjet), and analytics (PostHog).

## Essential Commands

### Development
```bash
npm run dev                 # Start dev server with PGlite database (http://localhost:3000)
npm run dev:next            # Start Next.js dev server only
npm run dev:spotlight       # Start Sentry Spotlight (dev error monitoring)
```

### Build & Deploy
```bash
npm run build-local         # Build with temporary in-memory database
npm run build               # Production build (requires DATABASE_URL)
npm start                   # Run production build
```

### Testing
```bash
npm run test                # Run all unit tests (Vitest)
npm run test:e2e            # Run E2E tests (Playwright)
npx playwright install      # Install Playwright browsers (first time only)
npm run storybook           # Start Storybook on http://localhost:6006
npm run storybook:test      # Run Storybook tests in headless mode
```

### Code Quality
```bash
npm run lint                # Check for linting errors
npm run lint:fix            # Auto-fix linting issues
npm run check:types         # TypeScript type checking
npm run check:deps          # Find unused dependencies/files (Knip)
npm run check:i18n          # Validate translations completeness
npm run build-stats         # Analyze bundle size
```

### Database
```bash
npm run db:generate         # Generate migration from schema changes
npm run db:migrate          # Apply migrations
npm run db:studio           # Open Drizzle Studio (https://local.drizzle.studio)
```

### Other
```bash
npm run commit              # Interactive commit with Conventional Commits
npm run clean               # Remove .next, out, coverage directories
```

## Architecture

### App Router Structure

The project uses Next.js App Router with i18n and route groups:

- `src/app/[locale]/(marketing)/` - Public marketing pages (home, about, portfolio)
- `src/app/[locale]/(auth)/dashboard/` - Protected dashboard pages
- `src/app/[locale]/(auth)/(center)/` - Centered auth pages (sign-in, sign-up)
- `src/app/[locale]/api/` - API routes

Route groups `(marketing)`, `(auth)`, and `(center)` organize routes without affecting URLs.

### Core Libraries Configuration

**i18n Setup:**
- `src/libs/I18n.ts` - next-intl configuration
- `src/libs/I18nRouting.ts` - Routing configuration
- `src/libs/I18nNavigation.ts` - Type-safe navigation with i18n
- `src/locales/` - Translation files (only edit `en.json`, Crowdin handles others)
- `src/utils/AppConfig.ts` - Locale configuration

**Database:**
- `src/models/Schema.ts` - Drizzle ORM schema definitions
- `src/utils/DBConnection.ts` - Database connection factory
- `src/libs/DB.ts` - Database utilities
- Local development uses PGlite (no Docker needed)
- Production requires PostgreSQL (recommended: Prisma Postgres)

**Security & Monitoring:**
- `src/libs/Arcjet.ts` - Base Arcjet instance with Shield WAF
- `src/middleware.ts` - Bot detection, auth protection, i18n routing
- `src/libs/Logger.ts` - LogTape configuration with Better Stack integration
- Sentry configured via `next.config.ts` and instrumentation files

**Environment Variables:**
- `src/libs/Env.ts` - Type-safe environment variables with T3 Env
- `.env` - Default values (tracked by Git)
- `.env.local` - Secrets and overrides (NOT tracked by Git)

### Middleware Flow

The middleware (`src/middleware.ts`) executes in this order:
1. Arcjet bot detection and Shield WAF (if `ARCJET_KEY` is set)
2. Clerk authentication for protected routes (`/dashboard`) and auth pages
3. next-intl i18n routing

**Important:** Middleware runs on Node.js runtime, not Edge. This is required for database connections with Webpack builds on Vercel.

### Testing Strategy

**Unit Tests:**
- Location: Colocated with source files (`*.test.ts`, `*.test.tsx`)
- Framework: Vitest with two projects:
  - `unit`: Node environment for `.test.ts` files (excluding hooks)
  - `ui`: Browser mode with Playwright for `.test.tsx` and hook tests
- Run with: `npm run test`

**Integration & E2E Tests:**
- Location: `tests/integration/` and `tests/e2e/`
- File patterns: `*.spec.ts` (integration), `*.e2e.ts` (E2E)
- Framework: Playwright (Chromium locally, Chromium + Firefox in CI)
- Checkly monitoring: Tests with `*.check.e2e.ts` run as synthetic monitoring

**Storybook:**
- Stories: Colocated with components (`*.stories.ts`, `*.stories.tsx`)
- Testing: Accessibility checks included via `@storybook/addon-a11y`

### Database Schema Changes

Workflow:
1. Edit `src/models/Schema.ts`
2. Run `npm run db:generate` to create migration
3. Migration auto-applies on dev server restart via `instrumentation.ts`
4. Or manually run `npm run db:migrate`

Production deploys automatically run migrations during build.

### Translations (i18n)

**Developer workflow:**
- Only edit `src/locales/en.json` (or your default language)
- Other languages are auto-generated by Crowdin
- Validation: `npm run check:i18n`

**Crowdin sync:**
- Auto-syncs on push to `main` branch
- Can be triggered manually in GitHub Actions
- Runs daily at 5am

### Styling

- **Tailwind CSS 4** with PostCSS plugin
- Configuration: `tailwind.config.ts` (if exists) or defaults
- Base template: `src/templates/BaseTemplate.tsx`
- Unstyled by design - minimal opinionated styles

### Authentication (Modular System)

**Provider Selection:**
- Switch auth providers via `NEXT_PUBLIC_AUTH_PROVIDER` environment variable
- Options: `'clerk'` (default), `'cloudflare'`, `'cognito'`
- No code changes needed to switch providers

**Architecture:**
- `src/libs/auth/` - Modular authentication system
- `src/libs/auth/adapters/` - Provider implementations
  - `ClerkAdapter.tsx` - Fully implemented ✅
  - `CloudflareAdapter.tsx` - Fully implemented ✅
  - `CognitoAdapter.tsx` - Stub implementation ⚠️
- `src/libs/auth/adapters/cloudflare/` - Cloudflare utilities
  - `utils.ts` - JWT verification, login/logout helpers
  - `UserProfile.tsx` - Custom profile UI
- `src/libs/auth/factory.ts` - Provider factory (singleton)
- `src/libs/auth/components.tsx` - Unified React components

**Usage:**
```typescript
// Server-side
import { getCurrentUser, isAuthenticated } from '@/libs/auth';

// Components
import { AuthProvider, SignInComponent, SignOutButtonComponent } from '@/libs/auth/components';
```

**Clerk Setup (default):**
- Keyless mode in development (use test keys from `.env`)
- Protected routes defined in `src/middleware.ts`
- Full-featured: UI components, multi-language, MFA, social auth

**Cloudflare Access Setup:**
- Set `NEXT_PUBLIC_AUTH_PROVIDER=cloudflare`
- Configure `NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN` and `NEXT_PUBLIC_CLOUDFLARE_AUDIENCE`
- Optional JWT verification with `NEXT_PUBLIC_CLOUDFLARE_VERIFY_JWT=true`
- Full-featured: Custom UI, profile management, JWT validation

### Customization Points

Search codebase for `FIXME:` comments to find key customization spots:
- `src/utils/AppConfig.ts` - App name, locales
- `src/templates/BaseTemplate.tsx` - Default theme
- `next.config.ts` - Next.js configuration
- `.env` - Environment variables
- Favicon files in `public/`

### Git Workflow

- **Commit convention:** Conventional Commits (enforced by Commitlint)
- Use `npm run commit` for guided commit messages
- GitHub Actions: CI tests, Crowdin sync, semantic releases
- Pre-commit hooks managed by Lefthook (not Husky)

### Key Integrations

- **Error Monitoring:** Sentry (dev: Spotlight at `/monitoring`, prod: cloud)
- **Logging:** LogTape + Better Stack (prod)
- **Security:** Arcjet Shield WAF + bot detection
- **Analytics:** PostHog (configure with keys)
- **Code Coverage:** Codecov (CI only)
- **Monitoring:** Checkly (synthetic monitoring for production)

### TypeScript Paths

Absolute imports use `@/` prefix mapping to `src/`:
```typescript
import { counterSchema } from '@/models/Schema';
import { AppConfig } from '@/utils/AppConfig';
```

## Important Notes

- **Node version:** Requires Node.js 20+
- **Database:** Local development works out of the box with PGlite. Production needs PostgreSQL connection string in `DATABASE_URL`.
- **Secrets:** Never commit `.env.local` - it's in `.gitignore`
- **Middleware runtime:** Uses `nodejs` runtime, not Edge (required for database connections)
- **Bundle analyzer:** Run `npm run build-stats` to analyze webpack bundle size
- **React Compiler:** Enabled in production builds (`reactCompiler: true`)
- **Turbopack:** File system caching enabled for dev mode

## VSCode Integration

Recommended extensions defined in `.vscode/extension.json`. Configurations include:
- Debug configurations for frontend/backend
- Tasks for common operations
- Settings for ESLint, Prettier auto-fix on save
