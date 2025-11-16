# Sprint 4 - P1 Tasks Implementation Plan

## Overview

This document outlines the comprehensive implementation plan for all Priority 1 (High) tasks in Sprint 4.

### Status Summary

- ✅ **P0 (Critical)**: Fix E2E Test Failures - **COMPLETED**
- ✅ **P1.1**: Create Issue Templates - **COMPLETED**
- 🔄 **P1.2**: Integration Testing Matrix - **PLANNED**
- 🔄 **P1.3**: Component Dependency Graph - **PLANNED**
- 🔄 **P1.4**: Automated Quality Checks/Lefthook - **PLANNED**

---

## P1.2: Integration Testing Matrix

### Objective
Create a comprehensive matrix documenting integration test coverage across features, browsers, environments, and authentication providers.

### Background
The project currently has:
- E2E tests using Playwright (95 total tests)
- Integration tests (in `tests/integration/`)
- Multi-auth provider support (Clerk, Cloudflare, Cognito, Test)
- Multi-browser support (Chromium, Firefox, Webkit)
- Multi-locale support (en, fr)

### Deliverables

#### 1. Test Coverage Matrix Document
**Location**: `docs/testing/integration-test-matrix.md`

**Structure**:
```markdown
# Integration Test Coverage Matrix

## Feature Coverage

| Feature | Unit Tests | Integration Tests | E2E Tests | Coverage % |
|---------|-----------|-------------------|-----------|------------|
| Authentication (Clerk) | ✅ | ✅ | ✅ | 90% |
| Authentication (Cloudflare) | ✅ | ⚠️ Partial | ⚠️ Partial | 60% |
| Authentication (Test) | ✅ | ✅ | ✅ | 95% |
| Database (PGlite) | ✅ | ✅ | ✅ | 85% |
| I18n (next-intl) | ✅ | ✅ | ✅ | 80% |
| Middleware (Arcjet) | ✅ | ⚠️ Partial | ❌ Missing | 50% |
| Error Monitoring (Sentry) | ⚠️ Partial | ❌ Missing | ❌ Missing | 30% |
| Analytics (PostHog) | ⚠️ Partial | ❌ Missing | ❌ Missing | 25% |

## Browser Coverage

| Test Suite | Chromium | Firefox | Webkit | Notes |
|------------|----------|---------|--------|-------|
| Auth.Navigation | ✅ | ✅ (CI) | ⚠️ Optional | Full coverage |
| Auth.SignIn | ✅ | ✅ (CI) | ⚠️ Optional | Full coverage |
| Auth.SignUp | ✅ | ✅ (CI) | ⚠️ Optional | Full coverage |
| Dashboard | ✅ | ✅ (CI) | ⚠️ Optional | Full coverage |

## Environment Coverage

| Feature | Local Dev | CI/CD | Production | Notes |
|---------|-----------|-------|------------|-------|
| PGlite Database | ✅ | ✅ | ❌ N/A | Dev/Test only |
| PostgreSQL | ⚠️ Manual | ✅ | ✅ | Requires setup |
| Test Auth | ✅ | ✅ | ❌ N/A | Test only |
| Clerk Auth | ✅ | ⚠️ Keyless | ✅ | Prod ready |

## Auth Provider Coverage

| Test Scenario | Clerk | Cloudflare | Cognito | Test |
|---------------|-------|------------|---------|------|
| Sign In | ✅ | ⚠️ Partial | ❌ Stub | ✅ |
| Sign Up | ✅ | ⚠️ Partial | ❌ Stub | ✅ |
| Sign Out | ✅ | ⚠️ Partial | ❌ Stub | ✅ |
| Protected Routes | ✅ | ✅ | ❌ Stub | ✅ |
| User Profile | ✅ | ✅ | ❌ Stub | ✅ |
```

#### 2. Test Gap Analysis Report
**Location**: `docs/testing/test-gaps.md`

Identify missing test coverage:
- Arcjet middleware integration tests
- Sentry error tracking E2E tests
- PostHog analytics E2E tests
- Cloudflare Access full E2E suite
- AWS Cognito implementation and tests
- Cross-browser compatibility for Webkit
- Multi-locale E2E tests (currently only navigation tests)

#### 3. Test Inventory Script
**Location**: `scripts/test-inventory.ts`

Automated script to:
- Scan all test files
- Extract test descriptions and tags
- Generate coverage statistics
- Identify untested features
- Output JSON/CSV for analysis

**Usage**:
```bash
npm run test:inventory
```

### Implementation Steps

1. **Phase 1: Data Collection** (2 hours)
   - Run all test suites and collect results
   - Analyze test files to categorize by feature
   - Document current browser/environment coverage
   - Review auth provider test implementations

2. **Phase 2: Documentation** (2 hours)
   - Create integration-test-matrix.md
   - Create test-gaps.md
   - Add visual coverage badges
   - Link to existing test files

3. **Phase 3: Automation** (3 hours)
   - Build test-inventory.ts script
   - Integrate with CI pipeline
   - Add npm script commands
   - Generate initial reports

4. **Phase 4: Gap Filling Recommendations** (1 hour)
   - Prioritize missing tests by risk
   - Create follow-up tasks for P2/P3
   - Document testing best practices

### Success Criteria

- [ ] Complete test coverage matrix documented
- [ ] Identified all test gaps with severity ratings
- [ ] Automated inventory script running in CI
- [ ] Coverage reports generated on every PR
- [ ] Clear roadmap for addressing gaps in future sprints

---

## P1.3: Component Dependency Graph

### Objective
Create a visual representation of component relationships and dependencies to aid in refactoring, debugging, and architecture decisions.

### Background
The project has:
- Complex component hierarchy (templates, features, UI components)
- Multiple auth adapters with conditional rendering
- I18n components and providers
- Shared utilities and hooks

### Deliverables

#### 1. Dependency Graph Visualization
**Location**: `docs/architecture/component-dependency-graph.svg` (and `.png`)

**Tool**: Madge or dependency-cruiser

**Features**:
- Visual graph of component imports
- Color-coded by layer (templates, features, UI, libs)
- Highlight circular dependencies
- Show external dependencies (React, Next.js, etc.)

#### 2. Dependency Analysis Report
**Location**: `docs/architecture/dependency-analysis.md`

**Contents**:
```markdown
# Component Dependency Analysis

## Architecture Layers

```
┌─────────────────────────────────────┐
│     App Routes & Pages              │
│  (src/app/[locale]/**/page.tsx)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Templates                   │
│      (src/templates/*)             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Feature Components               │
│      (src/components/*)            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Auth/Libs/Utils                │
│      (src/libs/*, src/utils/*)     │
└─────────────────────────────────────┘
```

## Circular Dependency Issues

### Found: 0 circular dependencies ✅

(Or list any found with severity and recommended fixes)

## High-Impact Components

Components imported by 10+ other files:

1. `src/libs/auth/components.tsx` - 25 imports
2. `src/templates/BaseTemplate.tsx` - 18 imports
3. `src/utils/AppConfig.ts` - 15 imports
4. `src/libs/I18nNavigation.ts` - 12 imports

## External Dependency Usage

| Package | Direct Imports | Indirect Imports | Total |
|---------|----------------|------------------|-------|
| react | 45 | 120 | 165 |
| next | 38 | 85 | 123 |
| @clerk/nextjs | 8 | 12 | 20 |
| next-intl | 15 | 25 | 40 |
```

#### 3. Automated Dependency Checker
**Location**: `scripts/check-dependencies.ts`

**Features**:
- Detect circular dependencies
- Identify unused exports
- Find deeply nested imports (>5 levels)
- Suggest refactoring opportunities
- Integrate with CI for PR checks

**Usage**:
```bash
npm run check:deps         # Run Knip (already exists)
npm run check:circular     # Check for circular deps (new)
npm run graph:components   # Generate visual graph (new)
```

### Implementation Steps

1. **Phase 1: Tool Setup** (1.5 hours)
   - Install madge or dependency-cruiser
   - Configure exclusion rules (node_modules, test files)
   - Test graph generation on subset of components
   - Choose visualization format (SVG, interactive HTML)

2. **Phase 2: Graph Generation** (2 hours)
   - Generate full component dependency graph
   - Create filtered views (by layer, by feature)
   - Export to multiple formats (SVG, PNG, JSON)
   - Add to docs/architecture/

3. **Phase 3: Analysis** (2 hours)
   - Analyze for circular dependencies
   - Identify high-impact components
   - Document architecture layers
   - Create dependency-analysis.md

4. **Phase 4: Automation & CI Integration** (2.5 hours)
   - Create npm scripts for graph generation
   - Add circular dependency check to CI
   - Setup automatic graph updates on main branch
   - Add badge to README if needed

### Tools to Evaluate

1. **Madge** (Recommended)
   - Simple, fast, well-maintained
   - Supports TypeScript/JSX
   - GraphViz output
   - Circular dependency detection

2. **dependency-cruiser**
   - More powerful rules engine
   - Better TypeScript support
   - Custom validation rules
   - HTML reports

3. **React Component Hierarchy**
   - react-component-hierarchy
   - Visual React tree
   - Props documentation

### Success Criteria

- [ ] Complete visual dependency graph generated
- [ ] Zero circular dependencies (or all documented/justified)
- [ ] Automated graph updates on code changes
- [ ] Clear documentation of architecture layers
- [ ] CI check prevents new circular dependencies

---

## P1.4: Automated Quality Checks with Lefthook

### Objective
Implement comprehensive pre-commit and pre-push quality checks using Lefthook to ensure code quality, prevent regressions, and enforce standards.

### Background
The project currently uses:
- Lefthook (already configured in `lefthook.yml`)
- ESLint for linting
- TypeScript for type checking
- Prettier for formatting (via ESLint)
- Vitest for unit tests
- Playwright for E2E tests

Current Lefthook configuration needs enhancement.

### Deliverables

#### 1. Enhanced Lefthook Configuration
**Location**: `lefthook.yml`

**Proposed Structure**:
```yaml
# Pre-commit hooks (fast checks on staged files)
pre-commit:
  parallel: true
  commands:
    # Linting
    lint:
      glob: "*.{js,jsx,ts,tsx}"
      run: npx eslint --fix {staged_files}
      stage_fixed: true

    # Type checking (on staged files only)
    typecheck:
      glob: "*.{ts,tsx}"
      run: npx tsc --noEmit --pretty

    # Format check
    format:
      glob: "*.{js,jsx,ts,tsx,json,md,yml}"
      run: npx prettier --write {staged_files}
      stage_fixed: true

    # Check i18n translations
    i18n:
      glob: "src/locales/en.json"
      run: npm run check:i18n

    # Secret scanning
    secrets:
      run: |
        if git diff --cached --name-only | xargs grep -E '(api[_-]?key|password|secret|token|auth).*=.*["\047][^"\047]{20,}'; then
          echo "⚠️  Potential secret detected in staged files!"
          exit 1
        fi

# Pre-push hooks (comprehensive checks before push)
pre-push:
  parallel: true
  commands:
    # Full type check
    typecheck:
      run: npm run check:types

    # Lint all files
    lint:
      run: npm run lint

    # Run unit tests
    test:
      run: npm run test -- --run --reporter=verbose

    # Check for unused dependencies
    deps:
      run: npm run check:deps

    # Check for circular dependencies
    circular:
      run: npm run check:circular

    # Build check
    build:
      run: npm run build-local

# Commit message hook
commit-msg:
  commands:
    # Enforce Conventional Commits
    conventional:
      run: |
        if ! grep -qE '^(feat|fix|docs|style|refactor|perf|test|chore|ci|build|revert)(\([a-z-]+\))?: .+' "$1"; then
          echo "❌ Commit message must follow Conventional Commits format"
          echo "Examples:"
          echo "  feat: add user authentication"
          echo "  fix(auth): resolve token expiration bug"
          echo "  docs: update README with setup instructions"
          exit 1
        fi
```

#### 2. Quality Check Scripts
**Location**: `scripts/quality-checks/`

Create modular scripts:

**`scripts/quality-checks/check-secrets.ts`**
- Scan for hardcoded secrets
- Check .env.local is not committed
- Validate API key formats

**`scripts/quality-checks/check-circular-deps.ts`**
- Run madge circular dependency check
- Output results in CI-friendly format
- Fail on new circular dependencies

**`scripts/quality-checks/check-file-size.ts`**
- Warn on files >500 lines
- Block files >1000 lines
- Suggest splitting large components

**`scripts/quality-checks/check-import-order.ts`**
- Validate import organization
- Enforce grouping (external, internal, relative)
- Check for banned imports

#### 3. CI Integration
**Location**: `.github/workflows/quality-checks.yml`

```yaml
name: Quality Checks

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Setup Node.js
        uses: actions/setup-node@v5
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Lefthook checks
        run: npx lefthook run pre-push

      - name: Check for secrets
        run: npm run check:secrets

      - name: Validate bundle size
        run: npm run check:bundle-size
```

#### 4. Documentation
**Location**: `docs/development/quality-checks.md`

Document:
- All quality checks and their purpose
- How to bypass checks (emergencies only)
- How to add new checks
- Troubleshooting common issues

### Implementation Steps

1. **Phase 1: Script Development** (3 hours)
   - Create check-secrets.ts
   - Create check-circular-deps.ts (integrate madge)
   - Create check-file-size.ts
   - Test scripts independently

2. **Phase 2: Lefthook Configuration** (2 hours)
   - Update lefthook.yml with new hooks
   - Configure parallel execution
   - Add skip flags for emergencies
   - Test locally on sample commits

3. **Phase 3: CI Integration** (2 hours)
   - Create quality-checks.yml workflow
   - Add status badges to README
   - Configure required checks in GitHub
   - Test on sample PRs

4. **Phase 4: Documentation & Training** (1 hour)
   - Write quality-checks.md
   - Update CONTRIBUTING.md
   - Add examples of common fixes
   - Document bypass procedures

### Checks to Implement

#### Pre-commit (Fast)
- ✅ ESLint with auto-fix
- ✅ Prettier formatting
- ✅ TypeScript type checking (affected files)
- 🆕 Secret scanning
- 🆕 Import order validation
- 🆕 i18n completeness check

#### Pre-push (Comprehensive)
- ✅ Full TypeScript type check
- ✅ Full ESLint
- ✅ Unit tests
- 🆕 Circular dependency check
- 🆕 Bundle size check
- 🆕 Build verification
- 🆕 Dependency audit

#### Commit-msg
- ✅ Conventional Commits format (already using commitlint)
- 🆕 Maximum line length (72 chars subject)
- 🆕 No trailing periods in subject

### Success Criteria

- [ ] All quality checks run automatically on commits/pushes
- [ ] CI enforces same checks as local hooks
- [ ] Clear error messages guide developers to fixes
- [ ] Documentation covers all checks and bypass procedures
- [ ] Zero false positives in secret scanning
- [ ] Pre-commit hooks complete in <10 seconds
- [ ] Pre-push hooks complete in <2 minutes

---

## Implementation Timeline

### Week 1
- **Days 1-2**: P1.2 Integration Testing Matrix
  - Data collection and documentation
  - Test inventory script development

- **Days 3-4**: P1.3 Component Dependency Graph
  - Tool setup and graph generation
  - Analysis and documentation

- **Day 5**: P1.4 Automated Quality Checks (Part 1)
  - Script development
  - Lefthook configuration

### Week 2
- **Days 1-2**: P1.4 Automated Quality Checks (Part 2)
  - CI integration
  - Testing and refinement

- **Days 3-4**: Testing and Integration
  - End-to-end testing of all P1 deliverables
  - Fix any issues discovered

- **Day 5**: Documentation and Handoff
  - Final documentation updates
  - Demo and knowledge transfer

## Risk Assessment

### High Risk
- **Madge/dependency-cruiser configuration complexity**
  - Mitigation: Start with simple config, iterate
  - Fallback: Manual dependency documentation

- **Lefthook hook execution time**
  - Mitigation: Optimize for speed, use parallel execution
  - Fallback: Move slow checks to pre-push only

### Medium Risk
- **Test inventory script accuracy**
  - Mitigation: Manual validation of initial output
  - Regular audits against actual test files

- **CI pipeline performance impact**
  - Mitigation: Use caching, parallel jobs
  - Monitor execution times

### Low Risk
- **Documentation maintenance**
  - Mitigation: Automate where possible
  - Regular review cycles

## Success Metrics

1. **Testing Coverage**: 80%+ feature coverage documented
2. **Dependency Health**: Zero unresolved circular dependencies
3. **Code Quality**: <5% commit rejections by quality checks
4. **Developer Experience**: <10 sec pre-commit, <2 min pre-push
5. **Documentation**: 100% of features documented in matrix

## Next Steps After Completion

1. Address identified test gaps (move to P2/P3)
2. Implement advanced dependency rules
3. Add performance regression tests
4. Expand quality checks (accessibility, security)
5. Create dashboard for quality metrics
