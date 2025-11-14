# Project Organization Plan

**Date:** November 14, 2025
**Status:** Ready for Implementation

## Executive Summary

This plan addresses organizational inconsistencies in the Next.js boilerplate and establishes a clear, scalable architecture following Next.js 15 and industry best practices.

## Issues Identified

### Critical Issues

1. **Duplicate Directory Structures**
   - Middleware exists in `/src/middleware/` AND `/src/libs/middleware/`
   - Schema exists in `/src/models/` AND `/src/server/db/models/`
   - Utilities exist in `/src/utils/` AND `/src/shared/utils/`
   - Validations exist in `/src/validations/` AND `/src/shared/validators/`

2. **Type Definition Confusion**
   - `/src/types/` - Framework augmentations
   - `/src/shared/types/` - Application types
   - No clear convention for developers

3. **Incomplete Migration**
   - Legacy files remain in old locations
   - New structure partially adopted
   - Import path aliases mask the confusion

4. **Under-utilized Patterns**
   - Repository pattern has TODOs
   - Service layer not established
   - Data access patterns inconsistent

## Target Architecture

### Clean Separation of Concerns

```
/src
├── /app                    # Next.js App Router (pages, layouts, routes)
├── /client                 # Client-side code (components, hooks, providers)
├── /server                 # Server-side code (database, API, services)
├── /shared                 # Isomorphic code (types, utils, validators, config)
├── /middleware             # Edge middleware (single source of truth)
├── /types                  # Framework type augmentations ONLY
└── /locales                # i18n translations
```

### Layer Responsibilities

**`/app`** - Next.js framework files only
- Pages, layouts, route handlers
- Metadata and configuration
- No business logic

**`/client`** - Client-side rendering
- React components (organized by category)
- Custom hooks
- Context providers
- Client-only utilities
- Client-side styles

**`/server`** - Server-side processing
- Database (schema, migrations, repositories)
- API logic (controllers, services)
- Server-only utilities
- Email/external service integrations

**`/shared`** - Runs everywhere
- TypeScript types and interfaces
- Pure utility functions (no side effects)
- Zod validators
- Configuration constants
- Shared business logic

**`/middleware`** - Edge runtime only
- Request/response processing
- Authentication checks
- Security headers
- Rate limiting
- Analytics

**`/types`** - TypeScript augmentation only
- next-intl module augmentation
- Third-party type extensions
- Global type declarations

## Migration Actions

### Phase 1: Consolidate Duplicates (Breaking Changes)

#### Action 1.1: Remove `/src/models/`
**Files to migrate:**
- `/src/models/Schema.ts` → `/src/server/db/models/Schema.ts` (already exists)

**Action:**
```bash
# File already exists in new location, verify identical
rm -rf /src/models/
```

**Update imports:**
```typescript
// OLD
import { counter } from '@/models/Schema';

// NEW
import { counter } from '@/server/db/models/Schema';
```

#### Action 1.2: Remove `/src/validations/`
**Files to migrate:**
- `/src/validations/CounterValidation.ts` → `/src/shared/validators/counter.validator.ts`

**Action:**
```bash
mkdir -p /src/shared/validators/
# Move and rename file
mv /src/validations/CounterValidation.ts /src/shared/validators/counter.validator.ts
rm -rf /src/validations/
```

**Update imports:**
```typescript
// OLD
import { CounterSchema } from '@/validations/CounterValidation';

// NEW
import { CounterSchema } from '@/shared/validators/counter.validator';
```

#### Action 1.3: Consolidate `/src/utils/`
**Decision matrix for each file:**

| File | New Location | Reason |
|------|--------------|--------|
| `AppConfig.ts` | `/src/shared/config/app.config.ts` | Shared configuration |
| `DBConnection.ts` | `/src/server/lib/db-connection.ts` | Server-only database |
| `Helpers.ts` | `/src/shared/utils/helpers.ts` | Pure utility functions |
| `Helpers.test.ts` | `/src/shared/utils/helpers.test.ts` | Co-locate with source |
| `rss.ts` | `/src/server/lib/rss.ts` | Server-only generation |
| `sitemap.ts` | `/src/server/lib/sitemap.ts` | Server-only generation |
| `structuredData.ts` | `/src/shared/utils/structured-data.ts` | Shared SEO utilities |

**Actions:**
```bash
# Create directories
mkdir -p /src/shared/config/
mkdir -p /src/server/lib/

# Move files
mv /src/utils/AppConfig.ts /src/shared/config/app.config.ts
mv /src/utils/DBConnection.ts /src/server/lib/db-connection.ts
mv /src/utils/Helpers.ts /src/shared/utils/helpers.ts
mv /src/utils/Helpers.test.ts /src/shared/utils/helpers.test.ts
mv /src/utils/rss.ts /src/server/lib/rss.ts
mv /src/utils/sitemap.ts /src/server/lib/sitemap.ts
mv /src/utils/structuredData.ts /src/shared/utils/structured-data.ts

# Remove directory
rm -rf /src/utils/
```

#### Action 1.4: Consolidate Middleware
**Analysis:**
- `/src/middleware/` - New, correct location
- `/src/libs/middleware/` - Legacy, contains duplicate code

**Action:**
```bash
# Verify no unique code exists in /src/libs/middleware/
# If all code is duplicated in /src/middleware/, remove it
rm -rf /src/libs/middleware/
```

**Note:** Keep `/src/libs/` for other library configurations (Env, I18n, etc.)

### Phase 2: Reorganize Remaining Files

#### Action 2.1: Move Library Configs to `/src/shared/config/`
**Files to consider:**
- `/src/libs/Env.ts` → Keep (requires special location for Next.js)
- `/src/libs/I18n.ts` → `/src/shared/config/i18n.config.ts`
- `/src/libs/I18nNavigation.ts` → `/src/shared/config/i18n-navigation.ts`
- `/src/libs/I18nRouting.ts` → `/src/shared/config/i18n-routing.ts`

**Decision:** Keep in `/src/libs/` for now (Next.js convention for library wrappers)

#### Action 2.2: Rename Security Files to Match Conventions
**Current:**
- `/src/server/lib/security/headers.ts`
- `/src/server/lib/security/input-sanitization.ts`
- `/src/server/lib/security/password.ts`
- `/src/server/lib/security/security-logger.ts`
- `/src/server/lib/security/middleware.ts`

**Rename to:**
- `/src/server/lib/security/headers.security.ts`
- `/src/server/lib/security/input-sanitization.security.ts`
- `/src/server/lib/security/password.security.ts`
- `/src/server/lib/security/logger.security.ts`
- `/src/server/lib/security/middleware.security.ts`

**Reason:** Clear naming convention, easier to search

#### Action 2.3: Create Missing Directories
```bash
mkdir -p /src/client/utils/
mkdir -p /src/server/api/services/
```

### Phase 3: Complete Implementations

#### Action 3.1: Implement Repository Methods
**File:** `/src/server/db/repositories/user.repository.ts`

**Complete TODOs:**
- `findByEmail()`
- `findById()`
- `create()`
- `update()`
- `delete()`

#### Action 3.2: Establish Service Layer Pattern
**Create example service:**
- `/src/server/api/services/user.service.ts`

**Pattern:**
```typescript
// Service handles business logic
export class UserService {
  constructor(private userRepo: UserRepository) {}

  async registerUser(data: RegisterInput) {
    // 1. Validate
    // 2. Check duplicates
    // 3. Hash password
    // 4. Create user
    // 5. Send welcome email
    // 6. Return result
  }
}

// Controller handles HTTP
export async function POST(request: NextRequest) {
  const userService = new UserService(userRepository);
  return userService.registerUser(data);
}
```

### Phase 4: Update Import Paths

#### Action 4.1: Update `tsconfig.json` Paths
**Remove fallback paths:**

```json
{
  "compilerOptions": {
    "paths": {
      // Clean paths (no fallbacks)
      "@/*": ["./src/*"],
      "@/app/*": ["./src/app/*"],
      "@/client/*": ["./src/client/*"],
      "@/server/*": ["./src/server/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/middleware/*": ["./src/middleware/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

**Remove these fallback paths:**
```json
// DELETE these (confusing, mask real locations)
"@/components/*": ["./src/client/components/*", "./src/components/*"]
"@/libs/*": ["./src/server/lib/*", "./src/libs/*"]
"@/models/*": ["./src/server/db/models/*", "./src/models/*"]
"@/utils/*": ["./src/shared/utils/*", "./src/utils/*"]
"@/validations/*": ["./src/shared/validators/*", "./src/validations/*"]
```

#### Action 4.2: Batch Update Imports
**Tool:** Use VSCode find/replace or codemod

**Patterns to replace:**
```typescript
// Models
'@/models/Schema' → '@/server/db/models/Schema'

// Validations
'@/validations/CounterValidation' → '@/shared/validators/counter.validator'

// Utils
'@/utils/AppConfig' → '@/shared/config/app.config'
'@/utils/Helpers' → '@/shared/utils/helpers'
'@/utils/rss' → '@/server/lib/rss'
'@/utils/sitemap' → '@/server/lib/sitemap'
'@/utils/structuredData' → '@/shared/utils/structured-data'
'@/utils/DBConnection' → '@/server/lib/db-connection'
```

### Phase 5: Documentation

#### Action 5.1: Create `/docs/ARCHITECTURE.md`
**Contents:**
- Directory structure explanation
- Layer responsibilities
- Import path conventions
- Where to put new files
- Examples of each pattern

#### Action 5.2: Update `CLAUDE.md`
**Add section:**
- Project organization principles
- File naming conventions
- Import path usage

#### Action 5.3: Create `/docs/CONTRIBUTING.md`
**Contents:**
- Where to add new features
- Naming conventions
- Testing requirements
- Code organization rules

## File Naming Conventions

### General Rules
- Use kebab-case for file names: `user-profile.tsx`
- Use PascalCase for components: `UserProfile.tsx`
- Add purpose suffix for clarity: `.service.ts`, `.repository.ts`, `.validator.ts`

### Convention Table

| File Type | Pattern | Example |
|-----------|---------|---------|
| React Component | PascalCase | `UserProfile.tsx` |
| Page Component | `page.tsx` | `app/dashboard/page.tsx` |
| Layout | `layout.tsx` | `app/dashboard/layout.tsx` |
| API Route | `route.ts` | `app/api/users/route.ts` |
| Type Definitions | `.types.ts` | `auth.types.ts` |
| Validators | `.validator.ts` | `user.validator.ts` |
| Services | `.service.ts` | `email.service.ts` |
| Repositories | `.repository.ts` | `user.repository.ts` |
| Utilities | `.ts` | `format.ts` |
| Config | `.config.ts` | `app.config.ts` |
| Tests | `.test.ts(x)` | `helpers.test.ts` |
| E2E Tests | `.e2e.ts` | `auth.e2e.ts` |
| Stories | `.stories.tsx` | `Button.stories.tsx` |

## Import Path Conventions

### Preferred Import Patterns

```typescript
// ✅ DO: Use path aliases for src/
import { UserProfile } from '@/client/components/UserProfile';
import { hashPassword } from '@/server/lib/security/password.security';
import type { AuthUser } from '@/shared/types/auth.types';
import { UserSchema } from '@/shared/validators/user.validator';

// ✅ DO: Use relative imports within the same feature
import { UserCard } from './UserCard';
import { formatName } from './utils';

// ❌ DON'T: Use relative imports across different top-level directories
import { hashPassword } from '../../../server/lib/security/password';

// ❌ DON'T: Mix path aliases with relative imports arbitrarily
import { UserProfile } from '@/client/components/UserProfile';
import { UserCard } from './UserCard'; // Inconsistent if not in same directory
```

### Import Order

```typescript
// 1. React/Next.js imports
import React from 'react';
import { NextRequest, NextResponse } from 'next/server';

// 2. Third-party libraries
import { z } from 'zod';
import validator from 'validator';

// 3. Internal imports (grouped by layer)
import type { AuthUser } from '@/shared/types/auth.types';
import { hashPassword } from '@/server/lib/security/password.security';
import { UserForm } from '@/client/components/forms/UserForm';

// 4. Relative imports
import { localUtility } from './utils';

// 5. Styles
import styles from './styles.module.css';
```

## Where to Put New Files

### Decision Tree

**Creating a new React component?**
- Client-side only? → `/src/client/components/{category}/`
- Server component with data fetching? → `/src/app/[locale]/{route}/` (if page-specific)

**Creating a new utility function?**
- Works in browser AND server? → `/src/shared/utils/`
- Server-only (database, file system)? → `/src/server/lib/`
- Client-only (DOM, browser APIs)? → `/src/client/utils/`

**Creating a new type definition?**
- Framework augmentation (next-intl, etc.)? → `/src/types/`
- Application type (User, Post, etc.)? → `/src/shared/types/`

**Creating a new API route?**
- Locale-scoped (uses translations)? → `/src/app/[locale]/api/{resource}/route.ts`
- Global (auth, webhooks)? → `/src/app/api/{resource}/route.ts`

**Creating a new service?**
- Business logic layer? → `/src/server/api/services/{resource}.service.ts`
- External integration? → `/src/server/api/services/{provider}.service.ts`

**Creating a new validator?**
- Always → `/src/shared/validators/{resource}.validator.ts`

**Creating a database model?**
- Schema → `/src/server/db/models/{table}.model.ts`
- Repository → `/src/server/db/repositories/{table}.repository.ts`
- Migration → `/src/server/db/migrations/{timestamp}_{name}.sql`

## Testing Strategy

### Test Co-location

```
/src/shared/utils/
  helpers.ts
  helpers.test.ts          ← Co-located unit test

/src/client/components/ui/
  Button.tsx
  Button.test.tsx          ← Co-located component test
  Button.stories.tsx       ← Co-located Storybook story
```

### E2E Test Organization

```
/tests/e2e/
  auth.e2e.ts              ← E2E test suite
  /pages/                  ← Page Object Model
    auth.page.ts
  /fixtures/               ← Test fixtures
    user.fixture.ts
```

## Benefits of This Organization

### Developer Experience
✅ Clear conventions - No guessing where files go
✅ Fast navigation - Predictable structure
✅ Easy onboarding - Self-documenting organization
✅ Reduced cognitive load - Consistent patterns

### Code Quality
✅ Better separation of concerns
✅ Clear dependency direction (client doesn't import server)
✅ Easier to enforce architectural rules
✅ Simpler to test (clear boundaries)

### Scalability
✅ Easy to split into monorepo later
✅ Clear module boundaries
✅ Can extract features to packages
✅ Parallel development friendly

## Migration Timeline

### Immediate (This Session)
- [x] Remove `/src/models/`
- [x] Consolidate `/src/validations/`
- [x] Consolidate `/src/utils/`
- [x] Update all imports
- [x] Update `tsconfig.json` paths
- [x] Create architecture documentation

### Short-term (Next Sprint)
- [ ] Complete repository implementations
- [ ] Establish service layer pattern
- [ ] Add CONTRIBUTING.md
- [ ] Co-locate unit tests

### Long-term (Future Consideration)
- [ ] Evaluate feature-based organization
- [ ] Consider monorepo structure
- [ ] Implement micro-frontends if needed

## Rollback Plan

If issues arise during migration:

1. **Git rollback:** All changes in single commit/branch
2. **Import path fallbacks:** Temporarily restore in tsconfig.json
3. **Symlinks:** Create temporary symlinks for old paths
4. **Gradual migration:** Move one directory at a time

## Success Metrics

- [ ] Zero duplicate directories
- [ ] Zero ambiguous import paths
- [ ] All TODOs in repositories completed
- [ ] Documentation updated
- [ ] No build errors
- [ ] All tests passing

---

**Approved by:** Claude Code
**Ready for Implementation:** Yes
**Estimated Time:** 45-60 minutes
**Risk Level:** Medium (breaking changes to import paths)
**Mitigation:** Git branch, comprehensive testing
