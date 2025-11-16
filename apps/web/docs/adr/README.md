# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records for the Next.js Boilerplate project.

## What is an ADR?

An Architecture Decision Record (ADR) captures an important architectural decision made along with its context and consequences.

## Format

Each ADR follows this structure:
- **Title**: Short descriptive name
- **Status**: Proposed | Accepted | Deprecated | Superseded
- **Date**: When the decision was made
- **Context**: What is the issue we're seeing that is motivating this decision?
- **Decision**: What is the change we're proposing/making?
- **Consequences**: What becomes easier or more difficult to do because of this change?
- **Related**: Links to code, issues, or other ADRs

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [001](./001-multi-provider-auth-architecture.md) | Multi-Provider Auth Architecture | Accepted | 2024-11-15 |
| [002](./002-middleware-execution-order.md) | Middleware Execution Order | Accepted | 2024-11-15 |
| [003](./003-pglite-local-development.md) | PGlite for Local Development | Accepted | 2024-11-15 |
| [004](./004-tenant-middleware-graceful-degradation.md) | Graceful Degradation for Tenant Middleware | Accepted | 2025-01-15 |
| [005](./005-test-auth-adapter-design.md) | Test Auth Adapter Design | Accepted | 2024-12-01 |
| [006](./006-middleware-matcher-excludes-api.md) | Middleware Matcher Excludes API Routes | Accepted | 2025-01-15 |
| [007](./007-session-cookies-on-response.md) | Session Cookies Must Be Set on Response Object | Accepted | 2025-01-15 |

## Summary by Topic

### Authentication & Authorization
- [ADR-001](./001-multi-provider-auth-architecture.md) - Multi-provider auth adapter pattern (Clerk, Cloudflare, Cognito, Test)
- [ADR-005](./005-test-auth-adapter-design.md) - Test adapter for E2E testing
- [ADR-007](./007-session-cookies-on-response.md) - Session cookie handling in API routes

### Middleware & Request Processing
- [ADR-002](./002-middleware-execution-order.md) - Middleware execution order (Tenant → Security → Auth → i18n)
- [ADR-004](./004-tenant-middleware-graceful-degradation.md) - Error handling for missing database tables
- [ADR-006](./006-middleware-matcher-excludes-api.md) - Exclude /api routes from middleware

### Database & Development
- [ADR-003](./003-pglite-local-development.md) - PGlite for zero-setup local development

## Creating a New ADR

1. Copy the template: `cp docs/adr/000-template.md docs/adr/XXX-your-title.md`
2. Fill in the sections
3. Update this README index
4. Link from related code/issues
