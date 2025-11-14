---
name: nextjs-static-analysis
description: Deep static analysis for TypeScript, React patterns, and Next.js-specific issues
tools:
  - Bash
  - Read
  - Grep
---

# Next.js Static Analysis Skill

Perform comprehensive static analysis beyond linting.

## Analysis Modules:

### 1. TypeScript Type Checking
- **Run**: `npm run check:types` (tsc --noEmit)
- **Check for**:
  - Type errors and `any` usage
  - Missing type definitions
  - Incorrect prop types
  - Async/Promise handling issues

### 2. Dependency Analysis
- **Run**: `npm run check:deps` (Knip)
- **Identifies**:
  - Unused dependencies
  - Unused exports
  - Unreachable code
  - Duplicate dependencies

### 3. Bundle Size Analysis
- **Run**: `npm run build-stats` (with webpack analyzer)
- **Check for**:
  - Large bundle sizes (> 200KB)
  - Duplicate packages
  - Missing code splitting
  - Unoptimized imports (entire lodash vs specific functions)

### 4. React/Next.js Pattern Analysis
- **Scan codebase for anti-patterns**:
  - Client Components using Server Component patterns
  - Missing `use client` directives
  - Inefficient Server Actions
  - Missing Suspense boundaries
  - Large client bundles with server-only code
  - Improper data fetching (fetch without caching)
  - Missing error boundaries
  - Non-optimized images (using `<img>` vs `<Image>`)

### 5. i18n Validation
- **Run**: `npm run check:i18n`
- **Validates**: Translation completeness across locales

### 6. Security Patterns
- **Scan for**:
  - Unsafe `dangerouslySetInnerHTML` usage
  - XSS vulnerabilities in user input
  - Exposed API keys or secrets
  - Missing CSRF protection
  - Insecure authentication flows

### 7. Performance Anti-patterns
- **Check for**:
  - Missing `key` props in lists
  - Unnecessary re-renders
  - Large component trees
  - Missing React.memo/useMemo for expensive operations
  - Blocking async operations in render

## Output Format:
```
🔍 Static Analysis Report
=========================

1️⃣ TypeScript: X errors
2️⃣ Dependencies: Y unused
3️⃣ Bundle Size: Z MB
4️⃣ React Patterns: A issues
5️⃣ i18n: B missing translations
6️⃣ Security: C vulnerabilities
7️⃣ Performance: D warnings

[Detailed breakdown with file:line references]

🎯 Priority Actions:
1. Fix critical TypeScript errors
2. Remove unused dependencies
3. Optimize bundle size
...
```

## Critical Issues to Flag:
- TypeScript errors blocking build
- Security vulnerabilities
- Bundle size > 500KB
- Missing accessibility attributes
- Unused dependencies > 5
