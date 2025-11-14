# Project Architecture

**Last Updated:** November 14, 2025
**Version:** 2.0 (Reorganized Structure)

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Layer Responsibilities](#layer-responsibilities)
4. [Import Path Conventions](#import-path-conventions)
5. [File Naming Conventions](#file-naming-conventions)
6. [Where to Put New Files](#where-to-put-new-files)
7. [Testing Strategy](#testing-strategy)
8. [Best Practices](#best-practices)

---

## Overview

This Next.js boilerplate follows a clean, layered architecture with clear separation of concerns. The codebase is organized into distinct layers based on execution environment and responsibility.

### Architectural Principles

1. **Layer-based Organization** - Code organized by execution environment (client/server/shared)
2. **Clear Boundaries** - Strict separation between client, server, and shared code
3. **No Circular Dependencies** - Unidirectional dependency flow
4. **Type Safety** - TypeScript-first with strict type checking
5. **Colocation** - Related files kept together (tests, stories, components)

### Dependency Direction

\`\`\`
┌─────────────────────────────────────────┐
│              /app (Next.js)             │
│         Pages, Layouts, Routes          │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┴──────────┐
    │                    │
    ▼                    ▼
┌────────┐          ┌──────────┐
│ /client│          │ /server  │
│Components│        │ Database │
│ Hooks   │        │ Services │
│Providers│        │    API   │
└────┬────┘        └─────┬────┘
     │                   │
     └────────┬──────────┘
              ▼
        ┌───────────┐
        │  /shared  │
        │   Types   │
        │  Utils    │
        │Validators │
        └───────────┘
\`\`\`

**Rules:**
- Client code CANNOT import from \`/server\`
- Server code CAN import from \`/shared\`
- Client code CAN import from \`/shared\`
- \`/app\` CAN import from any layer
- \`/shared\` CANNOT import from \`/client\` or \`/server\`

---

## Additional Resources

- [PROJECT_ORGANIZATION_PLAN.md](./PROJECT_ORGANIZATION_PLAN.md) - Detailed reorganization plan
- [SECURITY.md](./SECURITY.md) - Security implementation guide
- [CLAUDE.md](../CLAUDE.md) - Development guide

---

**Questions or suggestions?** Open an issue or contribute to this documentation!
