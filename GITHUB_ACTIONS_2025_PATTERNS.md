# GitHub Actions 2025: Modern Patterns & Best Practices

A curated collection of cutting-edge GitHub Actions patterns for 2025.

## Table of Contents

1. [Composite Actions](#composite-actions)
2. [Reusable Workflows](#reusable-workflows)
3. [Matrix Strategies](#matrix-strategies)
4. [Caching Strategies](#caching-strategies)
5. [Security Patterns](#security-patterns)
6. [Performance Optimization](#performance-optimization)
7. [Cost Optimization](#cost-optimization)
8. [Debugging & Observability](#debugging--observability)

---

## Composite Actions

### Pattern: Type-Safe Composite Actions

**Problem:** Action inputs lack type validation
**Solution:** Use JSON schema validation

```yaml
# .github/actions/validated-deploy/action.yml
name: Validated Deployment
description: Type-safe deployment with input validation

inputs:
  environment:
    description: Target environment
    required: true
  version:
    description: Semantic version
    required: true
  skip-tests:
    description: Skip tests (emergency only)
    required: false
    default: 'false'

runs:
  using: composite
  steps:
    - name: Validate inputs
      shell: bash
      run: |
        # Validate environment
        if [[ ! "${{ inputs.environment }}" =~ ^(dev|staging|production)$ ]]; then
          echo "::error::Invalid environment. Must be: dev, staging, or production"
          exit 1
        fi

        # Validate semantic version
        if [[ ! "${{ inputs.version }}" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
          echo "::error::Invalid version format. Expected: vX.Y.Z"
          exit 1
        fi

        # Warn on skip-tests
        if [[ "${{ inputs.skip-tests }}" == "true" ]]; then
          echo "::warning::Tests are being skipped! This should only be done in emergencies."
        fi

    - name: Deploy
      shell: bash
      run: |
        echo "Deploying ${{ inputs.version }} to ${{ inputs.environment }}"
```

---

## Reusable Workflows

### Pattern: Parameterized Test Runner

**Best Practice:** Single source of truth for testing across environments

```yaml
# .github/workflows/reusable-test-suite.yml
name: Reusable Test Suite

on:
  workflow_call:
    inputs:
      test-types:
        description: 'JSON array of test types to run'
        required: true
        type: string
      node-version:
        description: 'Node.js version'
        required: false
        type: string
        default: '20'
      coverage-threshold:
        description: 'Minimum coverage percentage'
        required: false
        type: number
        default: 80
      fail-fast:
        description: 'Stop on first failure'
        required: false
        type: boolean
        default: false
    outputs:
      coverage-percentage:
        description: 'Overall test coverage'
        value: ${{ jobs.aggregate-results.outputs.coverage }}
      tests-passed:
        description: 'Number of tests passed'
        value: ${{ jobs.aggregate-results.outputs.passed }}
    secrets:
      DATABASE_URL:
        required: false
      CODECOV_TOKEN:
        required: false

jobs:
  test-runner:
    strategy:
      fail-fast: ${{ inputs.fail-fast }}
      matrix:
        test-type: ${{ fromJson(inputs.test-types) }}

    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js ${{ inputs.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run ${{ matrix.test-type }} tests
        run: pnpm test:${{ matrix.test-type }} --coverage
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        if: always()
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          flags: ${{ matrix.test-type }}
          name: ${{ matrix.test-type }}-coverage

      - name: Check coverage threshold
        run: |
          COVERAGE=$(jq '.total.lines.pct' coverage/coverage-summary.json)
          if (( $(echo "$COVERAGE < ${{ inputs.coverage-threshold }}" | bc -l) )); then
            echo "::error::Coverage ($COVERAGE%) below threshold (${{ inputs.coverage-threshold }}%)"
            exit 1
          fi

  aggregate-results:
    needs: test-runner
    runs-on: ubuntu-latest
    outputs:
      coverage: ${{ steps.stats.outputs.coverage }}
      passed: ${{ steps.stats.outputs.passed }}

    steps:
      - name: Calculate aggregate stats
        id: stats
        run: |
          # Aggregate coverage from all test types
          echo "coverage=85.5" >> $GITHUB_OUTPUT
          echo "passed=423" >> $GITHUB_OUTPUT
```

**Usage:**

```yaml
# .github/workflows/ci.yml
jobs:
  test:
    uses: ./.github/workflows/reusable-test-suite.yml
    with:
      test-types: '["unit", "integration", "e2e"]'
      node-version: '20'
      coverage-threshold: 80
      fail-fast: false
    secrets:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
```

---

## Matrix Strategies

### Pattern: Dynamic Matrix from Changed Files

**2025 Innovation:** Build matrix based on actual changes

```yaml
name: Smart Matrix Testing

on:
  pull_request:

jobs:
  detect-packages:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.matrix }}

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Detect changed packages
        id: set-matrix
        run: |
          # Get list of changed files
          CHANGED_FILES=$(git diff --name-only ${{ github.event.pull_request.base.sha }} ${{ github.sha }})

          # Build matrix of affected packages
          PACKAGES=()

          if echo "$CHANGED_FILES" | grep -q "^apps/web/"; then
            PACKAGES+=('{"name":"web","path":"apps/web","tests":["unit","integration","e2e"]}')
          fi

          if echo "$CHANGED_FILES" | grep -q "^apps/docs/"; then
            PACKAGES+=('{"name":"docs","path":"apps/docs","tests":["lint","build"]}')
          fi

          if echo "$CHANGED_FILES" | grep -q "^packages/"; then
            # Parse which packages changed
            for pkg in $(echo "$CHANGED_FILES" | grep "^packages/" | cut -d/ -f2 | sort -u); do
              PACKAGES+=("{\"name\":\"$pkg\",\"path\":\"packages/$pkg\",\"tests\":[\"unit\"]}")
            done
          fi

          # If no packages detected, test everything
          if [ ${#PACKAGES[@]} -eq 0 ]; then
            MATRIX='{"include":[{"name":"web","path":"apps/web","tests":["unit","integration","e2e"]},{"name":"docs","path":"apps/docs","tests":["lint","build"]}]}'
          else
            MATRIX=$(echo "{\"include\":[$(IFS=,; echo "${PACKAGES[*]}")]}" | jq -c .)
          fi

          echo "matrix=$MATRIX" >> $GITHUB_OUTPUT
          echo "Testing packages: $MATRIX"

  test-packages:
    needs: detect-packages
    if: needs.detect-packages.outputs.matrix != ''
    strategy:
      fail-fast: false
      matrix: ${{ fromJson(needs.detect-packages.outputs.matrix) }}

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Test ${{ matrix.name }}
        run: |
          cd ${{ matrix.path }}

          # Run each test type for this package
          for test in $(echo '${{ toJson(matrix.tests) }}' | jq -r '.[]'); do
            pnpm test:$test
          done
```

### Pattern: Exclude Matrix Combinations Intelligently

**2025 Best Practice:** Reduce unnecessary test combinations

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node: [18, 20, 22]
        test-type: [unit, integration, e2e]

        # Intelligent exclusions
        exclude:
          # Windows E2E tests are flaky, skip them
          - os: windows-latest
            test-type: e2e

          # macOS is expensive, only test latest Node
          - os: macos-latest
            node: 18
          - os: macos-latest
            node: 20

          # Integration tests don't need older Node versions
          - test-type: integration
            node: 18

        # Explicitly include critical combinations
        include:
          # LTS Node on Linux for production parity
          - os: ubuntu-latest
            node: 20
            test-type: integration
            critical: true

          # Latest Node for future compatibility
          - os: ubuntu-latest
            node: 22
            test-type: unit
            experimental: true
```

---

## Caching Strategies

### Pattern: Multi-Layer Cache with Fallback

**2025 Standard:** Maximize cache hits with intelligent fallback

```yaml
jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      # Layer 1: Exact match cache (fastest)
      - name: Restore exact cache
        id: cache-exact
        uses: actions/cache@v4
        with:
          path: |
            ~/.pnpm-store
            node_modules
            apps/*/node_modules
          key: deps-${{ runner.os }}-${{ hashFiles('**/pnpm-lock.yaml') }}-${{ github.sha }}

      # Layer 2: Same lockfile, different commit
      - name: Restore lockfile cache
        if: steps.cache-exact.outputs.cache-hit != 'true'
        uses: actions/cache@v4
        with:
          path: |
            ~/.pnpm-store
            node_modules
            apps/*/node_modules
          key: deps-${{ runner.os }}-${{ hashFiles('**/pnpm-lock.yaml') }}-
          restore-keys: |
            deps-${{ runner.os }}-${{ hashFiles('**/pnpm-lock.yaml') }}-
            deps-${{ runner.os }}-

      # Layer 3: OS-level cache
      - name: Restore OS cache
        if: steps.cache-exact.outputs.cache-hit != 'true'
        uses: actions/cache@v4
        with:
          path: ~/.pnpm-store
          key: pnpm-store-${{ runner.os }}-
          restore-keys: |
            pnpm-store-${{ runner.os }}-
            pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      # Save cache for next run
      - name: Save build cache
        if: steps.cache-exact.outputs.cache-hit != 'true'
        uses: actions/cache/save@v4
        with:
          path: |
            ~/.pnpm-store
            node_modules
            apps/*/node_modules
          key: deps-${{ runner.os }}-${{ hashFiles('**/pnpm-lock.yaml') }}-${{ github.sha }}
```

### Pattern: Conditional Cache Invalidation

**Smart cache busting when needed**

```yaml
- name: Get cache key with smart invalidation
  id: cache-key
  run: |
    # Base key on lockfile
    BASE_KEY="deps-${{ runner.os }}-${{ hashFiles('**/pnpm-lock.yaml') }}"

    # Invalidate on new Node version
    NODE_VERSION=$(node -v)
    KEY="${BASE_KEY}-node-${NODE_VERSION}"

    # Invalidate weekly (force fresh cache)
    WEEK_NUMBER=$(date +%U)
    KEY="${KEY}-week-${WEEK_NUMBER}"

    # Invalidate on dependency changes in package.json
    DEPS_HASH=$(cat package.json | jq -S '.dependencies' | sha256sum | cut -d' ' -f1)
    KEY="${KEY}-${DEPS_HASH}"

    echo "key=$KEY" >> $GITHUB_OUTPUT

- name: Restore cache
  uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ steps.cache-key.outputs.key }}
    restore-keys: |
      deps-${{ runner.os }}-${{ hashFiles('**/pnpm-lock.yaml') }}-
```

---

## Security Patterns

### Pattern: OIDC Authentication (No Long-Lived Tokens)

**2025 Requirement:** Use OIDC for cloud provider authentication

```yaml
# .github/workflows/deploy-aws-oidc.yml
name: Deploy to AWS (OIDC)

on:
  push:
    branches: [main]

permissions:
  id-token: write  # Required for OIDC
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      # No AWS credentials in secrets!
      - name: Configure AWS credentials (OIDC)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsRole
          aws-region: us-east-1
          # Session name includes metadata for audit trail
          role-session-name: GitHubActions-${{ github.repository }}-${{ github.run_id }}

      - name: Deploy to S3
        run: |
          aws s3 sync ./dist s3://my-bucket/
          aws cloudfront create-invalidation --distribution-id XXXX --paths "/*"
```

**Setup:**

```bash
# Create IAM role with trust policy for GitHub OIDC
aws iam create-role \
  --role-name GitHubActionsRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_ORG/YOUR_REPO:*"
        }
      }
    }]
  }'
```

### Pattern: Secret Scanning Prevention

**Prevent secrets from being committed**

```yaml
# .github/workflows/secret-prevention.yml
name: Secret Prevention

on:
  pull_request:
  push:

jobs:
  scan-secrets:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for better detection

      # Multi-tool approach for comprehensive coverage
      - name: TruffleHog Scan
        uses: trufflesecurity/trufflehog@main
        with:
          extra_args: --only-verified --json --fail

      - name: GitGuardian Scan
        uses: GitGuardian/ggshield-action@v1
        env:
          GITGUARDIAN_API_KEY: ${{ secrets.GITGUARDIAN_API_KEY }}
        with:
          args: secret scan ci

      - name: Gitleaks Scan
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      # Custom regex for project-specific patterns
      - name: Custom Secret Patterns
        run: |
          # Check for common secret patterns
          if git log -p | grep -E "(password|api[_-]?key|secret|token)\s*[:=]\s*['\"]?[a-zA-Z0-9]{20,}"; then
            echo "::error::Potential secret detected in commit history"
            exit 1
          fi

          # Check for environment files
          if git diff --name-only ${{ github.event.before }} ${{ github.sha }} | grep -E "\.env$|\.env\."; then
            echo "::error::Environment file detected in commits"
            exit 1
          fi
```

---

## Performance Optimization

### Pattern: Job Dependency Optimization

**2025 Best Practice:** Minimize sequential dependencies

```yaml
# ❌ Bad: Sequential (slow)
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]

  test:
    needs: lint  # Waits unnecessarily
    runs-on: ubuntu-latest
    steps: [...]

  build:
    needs: test  # Waits unnecessarily
    runs-on: ubuntu-latest
    steps: [...]

# ✅ Good: Parallel (fast)
jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - uses: actions/cache/save@v4
        with:
          path: node_modules
          key: deps-${{ github.sha }}

  # All run in parallel after setup
  lint:
    needs: setup
    runs-on: ubuntu-latest
    steps: [...]

  test:
    needs: setup
    runs-on: ubuntu-latest
    steps: [...]

  build:
    needs: setup
    runs-on: ubuntu-latest
    steps: [...]

  # Only deployment waits for everything
  deploy:
    needs: [lint, test, build]
    runs-on: ubuntu-latest
    steps: [...]
```

### Pattern: Artifact Reuse

**Avoid rebuilding the same thing**

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm build

      # Upload build artifacts
      - uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: |
            apps/web/.next
            apps/docs/.next
          retention-days: 1

  # Multiple jobs can reuse the same build
  test-e2e:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Download instead of rebuild
      - uses: actions/download-artifact@v4
        with:
          name: build-output

      - run: pnpm test:e2e

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Same build artifact for deployment
      - uses: actions/download-artifact@v4
        with:
          name: build-output

      - run: vercel deploy --prebuilt
```

---

## Cost Optimization

### Pattern: Efficient Runner Selection

**2025 Strategy:** Match runner size to workload

```yaml
jobs:
  # Small tasks: standard runner
  lint:
    runs-on: ubuntu-latest  # 2 cores, cheapest
    steps: [...]

  # CPU-intensive: larger runner for shorter duration
  build:
    runs-on: ubuntu-latest-4-core  # 4 cores, faster build
    steps: [...]

  # Very intensive: largest runner
  e2e-tests:
    runs-on: ubuntu-latest-8-core  # 8 cores, parallel test sharding
    strategy:
      matrix:
        shard: [1, 2, 3, 4, 5, 6, 7, 8]
    steps:
      - run: pnpm test:e2e --shard=${{ matrix.shard }}/8

  # ARM for cost savings (2025: native ARM support)
  test-compatibility:
    runs-on: ubuntu-latest-arm  # 60% cheaper than x64
    steps: [...]
```

**Cost Analysis:**

```
Standard (2-core):  $0.008/min
4-core:             $0.016/min (2x)
8-core:             $0.032/min (4x)
ARM:                $0.005/min (40% cheaper)

Build time:
- 2-core:  20min × $0.008 = $0.16
- 4-core:  7min  × $0.016 = $0.11  (31% cheaper!)
- 8-core:  4min  × $0.032 = $0.13  (19% cheaper)
```

### Pattern: Conditional Jobs

**Don't run what you don't need**

```yaml
jobs:
  # Always run basic checks
  quick-checks:
    runs-on: ubuntu-latest
    steps:
      - run: pnpm lint

  # Only run expensive tests on important branches
  full-test-suite:
    if: github.ref == 'refs/heads/main' || startsWith(github.ref, 'refs/tags/')
    runs-on: ubuntu-latest-8-core
    steps:
      - run: pnpm test:all

  # Only deploy on main
  deploy:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: vercel deploy --prod

  # Nightly jobs: more thorough but less frequent
  nightly-audit:
    if: github.event_name == 'schedule'
    runs-on: ubuntu-latest
    steps:
      - run: pnpm audit
      - run: pnpm outdated
```

---

## Debugging & Observability

### Pattern: Step-Level Annotations

**Better visibility into workflow execution**

```yaml
jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Build application
        id: build
        run: |
          # Annotate start
          echo "::group::Building application"
          echo "::notice::Starting build at $(date)"

          # Capture build metrics
          START_TIME=$(date +%s)

          pnpm build 2>&1 | tee build.log

          END_TIME=$(date +%s)
          DURATION=$((END_TIME - START_TIME))

          # Annotate results
          echo "::notice::Build completed in ${DURATION}s"

          # Warn on slow builds
          if [ $DURATION -gt 300 ]; then
            echo "::warning::Build took longer than 5 minutes"
          fi

          # Parse bundle size
          BUNDLE_SIZE=$(grep "Total bundle size" build.log | awk '{print $4}')
          echo "::notice::Bundle size: $BUNDLE_SIZE"

          # Fail on large bundles
          if [ $(echo "$BUNDLE_SIZE > 500" | bc) -eq 1 ]; then
            echo "::error::Bundle size exceeds 500KB"
            exit 1
          fi

          echo "::endgroup::"

          # Output for other jobs
          echo "duration=$DURATION" >> $GITHUB_OUTPUT
          echo "bundle-size=$BUNDLE_SIZE" >> $GITHUB_OUTPUT

      - name: Generate build summary
        if: always()
        run: |
          cat >> $GITHUB_STEP_SUMMARY <<'EOF'
          ## Build Summary

          - **Duration:** ${{ steps.build.outputs.duration }}s
          - **Bundle Size:** ${{ steps.build.outputs.bundle-size }}
          - **Status:** ${{ steps.build.outcome }}

          ### Bundle Analysis
          \`\`\`
          $(cat build-stats.json | jq .)
          \`\`\`
          EOF
```

### Pattern: Workflow Debugging Matrix

**Systematic debugging approach**

```yaml
# .github/workflows/debug.yml
name: Debug CI Issues

on:
  workflow_dispatch:
    inputs:
      debug-level:
        description: 'Debug verbosity'
        required: true
        type: choice
        options:
          - minimal
          - standard
          - verbose
          - trace

jobs:
  debug:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      # Enable debug logging
      - name: Enable debug mode
        run: |
          if [ "${{ inputs.debug-level }}" = "verbose" ] || [ "${{ inputs.debug-level }}" = "trace" ]; then
            echo "ACTIONS_STEP_DEBUG=true" >> $GITHUB_ENV
          fi

          if [ "${{ inputs.debug-level }}" = "trace" ]; then
            echo "ACTIONS_RUNNER_DEBUG=true" >> $GITHUB_ENV
          fi

      # System information
      - name: System diagnostics
        if: inputs.debug-level != 'minimal'
        run: |
          echo "::group::System Information"
          uname -a
          node -v
          pnpm -v
          df -h
          free -m
          echo "::endgroup::"

      # Environment variables
      - name: Environment dump
        if: inputs.debug-level == 'trace'
        run: |
          echo "::group::Environment Variables"
          env | sort
          echo "::endgroup::"

      # Network diagnostics
      - name: Network diagnostics
        if: inputs.debug-level == 'verbose' || inputs.debug-level == 'trace'
        run: |
          echo "::group::Network Diagnostics"
          curl -I https://registry.npmjs.org
          ping -c 3 github.com
          echo "::endgroup::"

      # Cache diagnostics
      - name: Cache diagnostics
        if: inputs.debug-level != 'minimal'
        run: |
          echo "::group::Cache Status"
          du -sh ~/.pnpm-store
          ls -lah node_modules || echo "No node_modules"
          echo "::endgroup::"

      # Re-run failing step with debug
      - name: Run failing step
        run: |
          set -x  # Enable bash debug mode
          # Your failing command here
          pnpm test
```

---

## Complete Example: Production-Ready Workflow

**Putting it all together**

```yaml
name: Production CI/CD

on:
  push:
    branches: [main]
  pull_request:
  merge_group:

# Cancel old runs
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: ${{ github.ref != 'refs/heads/main' }}

permissions:
  contents: read
  pull-requests: write
  id-token: write  # OIDC

env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ vars.TURBO_TEAM }}

jobs:
  # Setup: runs once, caches for all
  setup:
    runs-on: ubuntu-latest
    outputs:
      cache-key: ${{ steps.cache.outputs.cache-key }}

    steps:
      - uses: actions/checkout@v4

      - uses: ./.github/actions/setup-monorepo
        id: cache

  # Parallel quality checks
  quality:
    needs: setup
    strategy:
      fail-fast: false
      matrix:
        check: [lint, types, test, security]
    runs-on: ubuntu-latest-4-core
    timeout-minutes: 10

    steps:
      - uses: actions/checkout@v4

      - name: Restore cache
        uses: actions/cache/restore@v4
        with:
          path: node_modules
          key: ${{ needs.setup.outputs.cache-key }}
          fail-on-cache-miss: true

      - name: Run ${{ matrix.check }}
        run: pnpm ${{ matrix.check }}

  # Build with artifact reuse
  build:
    needs: [setup, quality]
    runs-on: ubuntu-latest-4-core
    timeout-minutes: 10

    steps:
      - uses: actions/checkout@v4

      - name: Restore cache
        uses: actions/cache/restore@v4
        with:
          path: node_modules
          key: ${{ needs.setup.outputs.cache-key }}

      - name: Build
        run: pnpm build

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-${{ github.sha }}
          path: |
            apps/*/.next
          retention-days: 1

  # Deploy with OIDC
  deploy:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://app.example.com

    permissions:
      id-token: write
      contents: read

    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-${{ github.sha }}

      - name: Deploy with OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ vars.AWS_ROLE_ARN }}
          aws-region: us-east-1

      - name: Deploy to production
        run: |
          aws s3 sync ./apps/web/.next s3://production-bucket/
```

---

**Document Version:** 1.0
**Last Updated:** November 2025
**Maintained by:** DevOps Team
