# Naming Conventions - Action Plan

## Overview
The codebase has **85% naming consistency**. This document provides a step-by-step plan to reach 95%+ consistency.

## Issues Found & Priority

### 1. EXPORTED CONSTANTS - INCONSISTENT PATTERNS (CRITICAL)

**Problem**: Three competing patterns for exported constants

**Current Files**:
```
Pattern A: PascalCase
  - /src/shared/config/app.config.ts: export const AppConfig = { ... }
  - /src/libs/Env.ts: export const Env = createEnv({ ... })
  - /src/libs/Logger.ts: export const logger = ...
  - /src/client/providers/PostHogProvider.tsx: export const PostHogProvider = ...
  - /src/templates/BaseTemplate.tsx: export const BaseTemplate = ...

Pattern B: UPPER_SNAKE_CASE
  - /src/shared/config/index.ts: export const APP_CONFIG = { ... }
  - /src/shared/config/index.ts: export const AUTH_CONFIG = { ... }
  - /src/shared/config/index.ts: export const RATE_LIMIT_CONFIG = { ... }
  - /src/libs/auth/security/rate-limit.ts: export const AUTH_RATE_LIMITS = { ... }

Pattern C: camelCase
  - /src/shared/utils/helpers.ts: export const getBaseUrl = () => { ... }
  - /src/libs/services/counterService.ts: export const getCounter = async () => { ... }
  - /src/server/api/services/auth.service.ts: export const authService = new AuthService()
```

**Solution - RECOMMENDED APPROACH**:

Use **PascalCase** for exported objects/components and **camelCase** for functions/singletons:

```typescript
// Config objects → PascalCase
export const AppConfig = { ... }
export const ClerkLocalizations = { ... }

// Singleton instances → camelCase
export const authService = new AuthService()
export const userService = new UserService()
export const sessionManager = new SessionManager()

// Utility functions → camelCase
export const getBaseUrl = () => { ... }
export const getI18nPath = (url, locale) => { ... }

// Constants needing distinction → UPPER_SNAKE_CASE
export const DEFAULT_LOCALE = 'en'
export const CSRF_TOKEN_NAME = '__Host-csrf-token'
```

**Files to Update** (Consolidate to new standard):
1. Remove duplicate naming patterns
2. Rename UPPER_SNAKE_CASE config objects back to PascalCase where they conflict

---

### 2. SERVICE FILE NAMING - ONE OUTLIER (HIGH PRIORITY)

**Issue**: `counterService.ts` breaks the `.service.ts` pattern

**Current**: `/src/libs/services/counterService.ts`
**Should be**: `/src/libs/services/counter.service.ts`

**Steps**:
1. Rename the file:
   ```bash
   mv src/libs/services/counterService.ts src/libs/services/counter.service.ts
   ```

2. Update imports in these files:
   ```bash
   grep -r "from.*counterService" src/ --include="*.ts" --include="*.tsx"
   ```
   
   Files that will need updating:
   - Any file importing from `@/libs/services/counterService`
   - Update to: `@/libs/services/counter.service`

3. Verify changes:
   ```bash
   npm run type-check
   ```

---

### 3. UTILITY FILE NAMING - ONE OUTLIER (MEDIUM PRIORITY)

**Issue**: `structured-data.ts` uses kebab-case while others use camelCase

**Current**: `/src/shared/utils/structured-data.ts`
**Should be**: `/src/shared/utils/structuredData.ts`

**Steps**:
1. Rename the file:
   ```bash
   mv src/shared/utils/structured-data.ts src/shared/utils/structuredData.ts
   ```

2. Update imports:
   ```bash
   grep -r "structured-data" src/ --include="*.ts" --include="*.tsx"
   ```
   
   Files that will need updating:
   - Any file importing from `shared/utils/structured-data`
   - Update to: `shared/utils/structuredData`

3. Verify changes:
   ```bash
   npm run type-check
   ```

---

### 4. MIDDLEWARE DUPLICATION (MEDIUM PRIORITY)

**Issue**: Files exist in both `/src/middleware/` and `/src/libs/middleware/`

**Duplicated Files**:
- `composer.ts`
- `types.ts`
- `layers/security.ts`

**Solution**: Consolidate into `/src/libs/middleware/` (one source of truth)

**Steps**:
1. Compare the files to find which version is most up-to-date:
   ```bash
   diff src/middleware/composer.ts src/libs/middleware/composer.ts
   diff src/middleware/types.ts src/libs/middleware/types.ts
   diff src/middleware/layers/security.ts src/libs/middleware/layers/security.ts
   ```

2. Keep the best version in `/src/libs/middleware/`

3. Remove the duplicates from `/src/middleware/`:
   ```bash
   rm src/middleware/composer.ts
   rm src/middleware/types.ts
   rm -rf src/middleware/layers/
   ```

4. Update imports everywhere to use `/src/libs/middleware/`:
   ```bash
   grep -r "from.*middleware" src/ --include="*.ts" --include="*.tsx"
   ```

5. Verify:
   ```bash
   npm run type-check
   ```

---

### 5. TYPE FILE NAMING (LOW PRIORITY)

**Issue**: Inconsistent naming for type definition files

**Current**:
- `/src/types/I18n.ts` - PascalCase ❌
- `/src/libs/auth/types.ts` - lowercase ✓
- `/src/shared/types/api.types.ts` - kebab-case ❌
- `/src/shared/types/auth.types.ts` - kebab-case ❌

**Recommendation**: Use lowercase `types.ts` everywhere

**Steps**:
1. Rename files:
   ```bash
   mv src/types/I18n.ts src/types/i18n.types.ts
   mv src/shared/types/api.types.ts src/shared/types/api.ts
   mv src/shared/types/auth.types.ts src/shared/types/auth.ts
   mv src/shared/types/db.types.ts src/shared/types/db.ts
   ```

2. Update all imports:
   ```bash
   grep -r "from.*I18n" src/ --include="*.ts" --include="*.tsx"
   grep -r "from.*api.types" src/ --include="*.ts" --include="*.tsx"
   grep -r "from.*auth.types" src/ --include="*.ts" --include="*.tsx"
   grep -r "from.*db.types" src/ --include="*.ts" --include="*.tsx"
   ```

3. Verify:
   ```bash
   npm run type-check
   ```

---

## IMPLEMENTATION ORDER

### Phase 1: Quick Fixes (2-3 hours)
1. Fix service file naming (`counterService.ts` → `counter.service.ts`)
2. Fix utility file naming (`structured-data.ts` → `structuredData.ts`)
3. Verify all changes compile

### Phase 2: Consolidation (1-2 hours)
1. Consolidate middleware files (remove duplicates)
2. Standardize type file naming
3. Test everything

### Phase 3: Constants Standardization (2-3 hours)
1. Choose constant naming convention (recommended: PascalCase for objects, camelCase for functions)
2. Review and update all exported constants
3. Document the convention

### Phase 4: Documentation (1 hour)
1. Create `NAMING_CONVENTIONS.md` in project root
2. Update README with link to conventions
3. Add pre-commit hooks to check naming (optional)

---

## TESTING AFTER CHANGES

```bash
# Type checking
npm run type-check

# Full build
npm run build

# Tests
npm test

# Linting
npm run lint
```

---

## SHELL SCRIPTS TO HELP

### Find all files with inconsistent naming

```bash
#!/bin/bash

echo "=== Service files ==="
find src -name "*[sS]ervice.ts" -o -name "*[sS]ervice.tsx"

echo "=== Utility files ==="
find src/shared/utils -type f -name "*.ts"

echo "=== Repository files ==="
find src -name "*[rR]epository.ts" -o -name "*[rR]epository.tsx"

echo "=== Middleware duplicates ==="
echo "In /src/middleware:"
ls -la src/middleware/
echo "In /src/libs/middleware:"
ls -la src/libs/middleware/

echo "=== Type files ==="
find src -name "*types.ts" -o -name "*Types.ts" -o -name "*[Tt]ypes.tsx"
```

### Update imports after renaming

```bash
#!/bin/bash
# Usage: ./update-imports.sh oldPath newPath
# Example: ./update-imports.sh counterService counter.service

OLD=$1
NEW=$2

find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i "" \
  "s|from ['\"]@/$OLD['\"]|from '@/$NEW'|g; \
   s|from ['\"]\./$OLD['\"]|from './$NEW'|g; \
   s|from ['\"]\.\./$OLD['\"]|from '../$NEW'|g; \
   s|import.*$OLD|import from '$NEW'|g" {} \;

echo "Updated imports from $OLD to $NEW"
```

---

## FINAL VERIFICATION CHECKLIST

- [ ] All `.service.ts` files follow kebab-case pattern
- [ ] All `.repository.ts` files follow kebab-case pattern
- [ ] All `.validator.ts` files follow kebab-case pattern
- [ ] All utility files in `/shared/utils/` use camelCase
- [ ] No duplicate middleware files exist
- [ ] All type files follow consistent naming
- [ ] All exported constants follow one pattern
- [ ] No build errors: `npm run build`
- [ ] All tests pass: `npm test`
- [ ] TypeScript check passes: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] Documentation updated

---

## ESTIMATED EFFORT

| Task | Time | Priority |
|------|------|----------|
| Fix service naming | 15 min | HIGH |
| Fix utility naming | 15 min | MEDIUM |
| Consolidate middleware | 30 min | MEDIUM |
| Standardize types | 30 min | LOW |
| Standardize constants | 1-2 hours | HIGH |
| Documentation | 30 min | MEDIUM |
| Testing & verification | 1 hour | CRITICAL |
| **Total** | **4-5 hours** | - |

---

## SUCCESS CRITERIA

- Consistency score: **95%+** (from current 85%)
- Zero naming-related linting errors
- All unit tests passing
- Build succeeds without warnings related to naming
- Team agrees on conventions
- Documentation is in place

---

