# Code Cleanup Notes

## Unused Files Identified by Knip (31 files)

This document lists files identified as unused by the dependency analyzer. These files are kept for future use or documentation purposes, but can be safely removed if not needed.

### 📁 Client Components (8 files)

#### Blog Components (Empty Directory)
```
src/client/components/blog/
  - Directory exists but is empty (blog components already removed)
```

#### Barrel Exports (Index Files)
```
src/client/components/forms/index.ts
src/client/components/index.ts
src/client/components/marketing/index.ts
src/client/components/ui/index.ts
src/client/index.ts
src/client/providers/index.ts
```
**Status:** Intentional barrel exports for future organization
**Action:** Keep for now (enable clean imports when features are added)

---

### 📚 Libraries (6 files)

#### Audit Logger
```
src/libs/audit/AuditLogger.ts
```
**Status:** Audit logging feature not yet implemented
**Action:** Keep if audit trail functionality is planned

#### Authentication Security Utilities
```
src/libs/auth/security/jwt-verify.ts
src/libs/auth/security/session-fingerprint.ts
src/libs/auth/security/session-manager.ts
```
**Status:** Advanced auth features (JWT verification, fingerprinting)
**Action:** Keep for enhanced security features or using Cloudflare/Cognito adapters

#### Google Analytics
```
src/libs/GoogleAnalytics.tsx
```
**Status:** PostHog is used instead
**Action:** ⚠️ Can be safely removed if only using PostHog

---

### 🖥️  Server Files (6 files)

#### API Controllers
```
src/server/api/controllers/auth.controller.ts
```
**Status:** Using services directly instead of controller pattern
**Action:** Remove if not planning to use MVC pattern

#### Services
```
src/server/api/services/email.service.ts
src/server/api/services/service-factory.ts
```
**Status:** Email service not implemented, factory pattern not used
**Action:** Keep email.service.ts if planning email features

#### Database
```
src/server/db/repositories/base.repository.ts
```
**Status:** Base repository pattern not used (using direct DrizzleORM)
**Action:** Remove if not planning abstract repository pattern

#### Utilities
```
src/server/lib/rss.ts
src/server/lib/sitemap.ts
```
**Status:** RSS feed and sitemap generation utilities
**Action:** Keep for potential blog/content features

---

### 🔗 Shared Files (6 files)

#### Middleware
```
src/middleware/composer.ts
src/middleware/index.ts
```
**Status:** Middleware composition utilities not used
**Action:** Remove if using direct middleware implementation

#### Types
```
src/shared/types/api.ts
src/shared/types/auth.ts
src/shared/types/db.ts
src/shared/types/index.ts
```
**Status:** Type definitions not currently used
**Action:** Keep for type organization as project grows

#### Config
```
src/shared/config/index.ts
```
**Status:** Shared configuration not used
**Action:** Remove if not planning shared config pattern

#### Utils
```
src/shared/utils/index.ts
```
**Status:** Barrel export for utils
**Action:** Keep for clean imports

---

### ⚙️  Configuration (1 file)

```
vitest.integration.config.ts
```
**Status:** Integration test configuration
**Action:** ⚠️ Keep - Used for `npm run test:integration`

---

## 📦 Unused Dependencies (5 packages)

### Production Dependencies (3)
```json
{
  "isomorphic-dompurify": "For XSS prevention (DOMPurify)",
  "jose": "JWT operations",
  "validator": "Input validation utilities"
}
```
**Status:** Security-critical or utility libraries
**Action:** ✅ **KEEP** - These are used for security features

### Dev Dependencies (2)
```json
{
  "@types/bcryptjs": "Type definitions",
  "@types/validator": "Type definitions"
}
```
**Status:** Type definitions for bcryptjs and validator
**Action:** ⚠️ Can remove if TypeScript doesn't complain

---

## 🎯 Recommended Actions

### Safe to Remove (Low Risk)
1. `src/libs/GoogleAnalytics.tsx` - Using PostHog instead
2. `src/server/db/repositories/base.repository.ts` - Not using pattern
3. `src/server/api/controllers/auth.controller.ts` - Using services directly
4. `src/middleware/composer.ts` and `src/middleware/index.ts` - Not using composition

### Consider Removing (Medium Risk)
1. `src/server/lib/rss.ts` - If no blog/RSS planned
2. `src/server/lib/sitemap.ts` - If no dynamic sitemap needed
3. `src/server/api/services/service-factory.ts` - If not using factory pattern

### Keep for Now (Documentation/Future Use)
1. All auth adapter utilities (CloudflareAdapter, CognitoAdapter, etc.)
2. Barrel export index.ts files
3. Email service (future email feature)
4. Shared type definitions
5. Audit logger (future audit trail)

---

## 🧹 Cleanup Script

To remove the safest files:

```bash
# Remove GoogleAnalytics (using PostHog)
rm src/libs/GoogleAnalytics.tsx

# Remove unused middleware composition
rm src/middleware/composer.ts
rm src/middleware/index.ts
rmdir src/middleware 2>/dev/null || true

# Remove base repository pattern
rm src/server/db/repositories/base.repository.ts

# Remove unused controller
rm src/server/api/controllers/auth.controller.ts

# Remove unused service factory
rm src/server/api/services/service-factory.ts

# Verify tests still pass
npm run lint
npm run check:types
npm run test
```

**Estimated savings:** ~5-8 KB

---

## 📊 Export Analysis

### Unused Exports (40 exports)

Most unused exports are from alternative auth adapters:
- **Cloudflare utilities:** getUserFromHeaders, redirectToCloudflareLogin, etc.
- **Cognito utilities:** enableSMSMFA, confirmMFAChallenge, parseOAuthCallback, etc.
- **Test adapter:** sessions, users exports

**Action:** These are intentional for multi-provider support. Keep unless removing auth adapters entirely.

---

## 🔄 Next Review

Schedule cleanup review:
- **Next Sprint:** Remove confirmed dead code
- **Quarterly:** Review unused exports and dependencies
- **After Features:** Clean up experimental code

---

*Generated: November 14, 2025*
*Tool: Knip (npm run check:deps)*
