# Quick Reference: Naming Conventions

## File Naming Patterns

```
COMPONENTS (React)
  ✓ HeroGradient.tsx         (PascalCase)
  ✓ CounterForm.tsx          (PascalCase)
  
SERVICES
  ✓ auth.service.ts          (kebab-case + .service)
  ✓ user.service.ts          (kebab-case + .service)
  ❌ counterService.ts        (WRONG - use counter.service.ts)

REPOSITORIES
  ✓ user.repository.ts       (kebab-case + .repository)
  ✓ session.repository.ts    (kebab-case + .repository)

UTILITIES
  ✓ helpers.ts               (camelCase)
  ✓ validation.ts            (camelCase)
  ❌ structured-data.ts      (WRONG - use structuredData.ts)

VALIDATORS
  ✓ counter.validator.ts     (kebab-case + .validator)

API ROUTES
  ✓ route.ts                 (Next.js standard)

TEST FILES
  ✓ user.test.ts            (suffix .test.ts)
  ✓ helpers.test.tsx        (suffix .test.tsx)

ADAPTERS
  ✓ ClerkAdapter.tsx         (PascalCase + Adapter)
  ✓ CloudflareAdapter.tsx    (PascalCase + Adapter)

PAGES/LAYOUTS
  ✓ page.tsx                 (Next.js standard)
  ✓ layout.tsx               (Next.js standard)

CORE UTILITIES
  ✓ Logger.ts                (PascalCase for classes)
  ✓ Env.ts                   (PascalCase)
  ✓ DB.ts                    (PascalCase)
```

## Code Naming Patterns

```
FUNCTIONS
  ✓ export function isValidEmail() { }      (camelCase)
  ✓ export function formatDate() { }        (camelCase)

CLASSES
  ✓ export class AuthService { }            (PascalCase)
  ✓ export class SessionManager { }         (PascalCase)

TYPES/INTERFACES
  ✓ export type AuthUser = { }              (PascalCase)
  ✓ export type HeroGradientProps = { }    (PascalCase)

VARIABLES (Local)
  ✓ const userId = session.userId           (camelCase)
  ✓ let encryptedData = ...                 (camelCase)

CONSTANTS (Exported)
  Pattern 1: export const AuthConfig = { }  (PascalCase) ⚠
  Pattern 2: export const AUTH_CONFIG = { } (UPPER_SNAKE_CASE) ⚠
  Pattern 3: export const authService = ... (camelCase) ⚠
  
  INCONSISTENT - Use one pattern!

DATABASE FIELDS
  ✓ email_verified                          (snake_case)
  ✓ password_hash                           (snake_case)
  ✓ is_active                               (snake_case)
  ✓ created_at                              (snake_case)

ENUM/UNION VALUES
  ✓ 'success' | 'failure' | 'partial'      (lowercase)
  ✓ 'data_access' | 'data_deletion'        (snake_case)

ROUTES/URLS
  ✓ /[locale]/sign-in                       (kebab-case)
  ✓ /[locale]/user-profile                  (kebab-case)
  ✓ /api/auth/validate-password             (kebab-case)
```

## Directory Patterns

```
/src/client/components/
  ├── blog/              Feature group
  ├── forms/             Feature group
  ├── marketing/         Feature group
  └── ui/                Generic components

/src/server/
  ├── api/
  │   ├── controllers/
  │   ├── services/
  │   └── routes/
  ├── db/
  │   ├── models/
  │   ├── repositories/
  │   └── migrations/
  └── lib/

/src/libs/
  ├── auth/
  │   ├── adapters/
  │   ├── security/
  │   └── types.ts
  ├── middleware/
  ├── audit/
  └── [singletons]

/src/shared/
  ├── config/
  ├── types/
  ├── utils/
  └── validators/
```

## Consistency Score: 85%

| Area | Score | Issues |
|------|-------|--------|
| Components | 100% | None |
| Services | 80% | 1 file (counterService.ts) |
| Repositories | 100% | None |
| Utilities | 86% | 1 file (structured-data.ts) |
| Functions | 100% | None |
| Classes | 100% | None |
| Types | 100% | None |
| **Exported Constants** | **33%** | **3 patterns - NEEDS FIX** |
| Routes | 100% | None |
| Database | 100% | None |

## Priority Fixes

### HIGH PRIORITY
1. **Standardize exported constants** - Choose 1 pattern
   - Option: UPPER_SNAKE_CASE for config, camelCase for instances

2. **Fix service file naming** 
   - Rename: `counterService.ts` → `counter.service.ts`

### MEDIUM PRIORITY
1. **Fix utility file naming**
   - Rename: `structured-data.ts` → `structuredData.ts`

2. **Consolidate middleware**
   - Remove duplicate files between /src/middleware and /src/libs/middleware

3. **Standardize type file naming**
   - Use lowercase `types.ts` everywhere

### LOW PRIORITY
1. Document all naming conventions
2. Update ESLint rules to enforce patterns

## Files to Update

### Rename These Files
```
/src/libs/services/counterService.ts
  → /src/libs/services/counter.service.ts
  
/src/shared/utils/structured-data.ts
  → /src/shared/utils/structuredData.ts
```

### Remove These Duplicates
```
/src/middleware/composer.ts          (keep only in /src/libs/middleware/)
/src/middleware/types.ts             (keep only in /src/libs/middleware/)
/src/middleware/layers/security.ts   (keep only in /src/libs/middleware/)
```

### Standardize These Constants
Multiple patterns exist - standardize to one:
- `/src/shared/config/app.config.ts`
- `/src/libs/Env.ts`
- `/src/libs/Logger.ts`
- `/src/server/api/services/auth.service.ts`
- etc.

## Tools to Help Enforce

```json
{
  "eslint": {
    "rules": {
      "naming-convention": {
        "selector": "variableLike",
        "format": ["camelCase"]
      },
      "naming-convention": {
        "selector": "typeLike",
        "format": ["PascalCase"]
      }
    }
  }
}
```

