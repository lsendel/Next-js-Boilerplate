---
name: nextjs-lint
description: Run comprehensive ESLint checks with Next.js, React, accessibility, and Tailwind rules
tools:
  - Bash
  - Read
---

# Next.js Linting Skill

Run comprehensive linting for this Next.js boilerplate with @antfu/eslint-config.

## Current ESLint Configuration:
- **@antfu/eslint-config** (React, Next.js, TypeScript)
- **eslint-plugin-jsx-a11y** - Accessibility rules
- **eslint-plugin-tailwindcss** - Tailwind CSS best practices
- **eslint-plugin-playwright** - E2E test rules
- **eslint-plugin-storybook** - Component story rules

## Tasks:
1. **Run ESLint** with `npm run lint`
2. **Parse output** to identify issues by category:
   - TypeScript errors
   - React/Next.js issues
   - Accessibility violations (a11y)
   - Tailwind CSS problems
   - Code style inconsistencies
3. **Group by severity**: error vs warning
4. **Group by file type**:
   - Components (.tsx)
   - Pages (app/[locale])
   - API routes
   - Tests
5. **Suggest auto-fix** if appropriate: `npm run lint:fix`

## Output Format:
```
📊 ESLint Results
================

❌ Errors: X
⚠️  Warnings: Y

🔴 Critical Issues:
  - [file:line] rule-name: description

🟡 Warnings:
  - [file:line] rule-name: description

💡 Auto-fixable: Z issues
   Run: npm run lint:fix
```

## Focus Areas:
- React hooks rules (useEffect dependencies, etc.)
- Accessibility (ARIA, semantic HTML, keyboard navigation)
- Tailwind CSS class ordering and best practices
- TypeScript type safety
- Next.js-specific patterns (Image, Link, metadata)
