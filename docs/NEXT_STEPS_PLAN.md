# Next Steps Implementation Plan

**Date:** November 14, 2025
**Status:** Ready for Implementation
**Priority:** Medium
**Estimated Time:** 8-12 hours

---

## Executive Summary

This plan outlines the next phase of improvements to solidify the architecture, improve code quality, and prepare the codebase for scale. These improvements build on the successful project reorganization.

### Goals

1. ✅ **Complete Repository Pattern** - Finish all database access layer implementations
2. ✅ **Establish Service Layer** - Create consistent business logic layer
3. ✅ **Improve Test Organization** - Co-locate tests with source code
4. ✅ **Evaluate Feature-Based Structure** - Assess benefits for future scalability

### Success Metrics

- [ ] All repository methods implemented (no TODOs)
- [ ] Service layer pattern established with 3+ examples
- [ ] 90%+ test co-location achieved
- [ ] Feature-based organization decision documented

---

## Phase 1: Complete Repository Pattern

**Priority:** High
**Estimated Time:** 2-3 hours
**Dependencies:** None

### Current State

```typescript
// src/server/db/repositories/user.repository.ts
export class UserRepository {
  // ❌ Currently has TODOs
  async findByEmail(email: string) {
    // TODO: Implement
  }
}
```

### Target State

Full implementation of repository pattern for all database entities with:
- CRUD operations
- Common queries
- Transaction support
- Error handling
- Type safety

---

### Task 1.1: Complete User Repository

**File:** `src/server/db/repositories/user.repository.ts`

**Methods to implement:**

```typescript
export class UserRepository {
  // ✅ Basic CRUD
  async create(data: InsertUser): Promise<User>
  async findById(id: number): Promise<User | null>
  async findByEmail(email: string): Promise<User | null>
  async update(id: number, data: Partial<User>): Promise<User>
  async delete(id: number): Promise<void>
  
  // ✅ Common queries
  async findByExternalId(provider: string, externalId: string): Promise<User | null>
  async findActiveUsers(): Promise<User[]>
  async search(query: string): Promise<User[]>
  
  // ✅ Account management
  async updateLastLogin(id: number): Promise<void>
  async updatePassword(id: number, passwordHash: string): Promise<void>
  async markEmailVerified(id: number): Promise<void>
  async softDelete(id: number): Promise<void>
  
  // ✅ Utilities
  async exists(email: string): Promise<boolean>
  async count(): Promise<number>
}
```

**Implementation checklist:**
- [ ] Implement all CRUD operations
- [ ] Add proper TypeScript types
- [ ] Implement error handling
- [ ] Add transaction support for complex operations
- [ ] Write JSDoc comments
- [ ] Add input validation

---

### Task 1.2: Create Session Repository

**File:** `src/server/db/repositories/session.repository.ts`

**Methods needed:**

```typescript
export class SessionRepository {
  // Session lifecycle
  async create(data: InsertSession): Promise<Session>
  async findByToken(token: string): Promise<Session | null>
  async findByUserId(userId: number): Promise<Session[]>
  async updateActivity(id: number): Promise<void>
  async delete(id: number): Promise<void>
  
  // Session management
  async deleteExpired(): Promise<number>
  async deleteByUserId(userId: number): Promise<void>
  async deleteAllButCurrent(userId: number, currentSessionId: number): Promise<void>
  
  // Validation
  async isValid(token: string): Promise<boolean>
  async getActiveSessions(userId: number): Promise<Session[]>
}
```

**Implementation checklist:**
- [ ] Create new file
- [ ] Implement all methods
- [ ] Add session cleanup utilities
- [ ] Implement session validation
- [ ] Add proper error handling

---

### Task 1.3: Create Audit Log Repository

**File:** `src/server/db/repositories/audit-log.repository.ts`

**Methods needed:**

```typescript
export class AuditLogRepository {
  // Logging
  async create(data: InsertAuditLog): Promise<AuditLog>
  async createBatch(logs: InsertAuditLog[]): Promise<void>
  
  // Querying
  async findByUserId(userId: number, limit?: number): Promise<AuditLog[]>
  async findByResource(resource: string, limit?: number): Promise<AuditLog[]>
  async findByAction(action: string, limit?: number): Promise<AuditLog[]>
  async findRecent(limit: number): Promise<AuditLog[]>
  
  // Analytics
  async countByUser(userId: number): Promise<number>
  async countByAction(action: string): Promise<number>
  
  // Cleanup
  async deleteOlderThan(days: number): Promise<number>
}
```

**Implementation checklist:**
- [ ] Create new file
- [ ] Implement logging methods
- [ ] Add query methods with filters
- [ ] Implement cleanup utilities
- [ ] Add batch insert support

---

### Task 1.4: Repository Base Class

**File:** `src/server/db/repositories/base.repository.ts`

**Purpose:** Abstract common repository operations

```typescript
export abstract class BaseRepository<T, TInsert> {
  constructor(
    protected db: Database,
    protected table: PgTable
  ) {}
  
  // Common CRUD operations
  protected async findById(id: number): Promise<T | null>
  protected async create(data: TInsert): Promise<T>
  protected async update(id: number, data: Partial<T>): Promise<T>
  protected async delete(id: number): Promise<void>
  protected async findAll(): Promise<T[]>
  protected async count(): Promise<number>
  
  // Transaction support
  protected async transaction<R>(
    callback: (tx: Transaction) => Promise<R>
  ): Promise<R>
}
```

**Implementation checklist:**
- [ ] Create base repository class
- [ ] Implement common CRUD methods
- [ ] Add transaction wrapper
- [ ] Add error handling
- [ ] Refactor existing repositories to extend base

---

## Phase 2: Establish Service Layer Pattern

**Priority:** High
**Estimated Time:** 3-4 hours
**Dependencies:** Phase 1 (Repository pattern)

### Current State

Business logic scattered across:
- API route handlers
- Controller functions
- Direct repository calls

### Target State

Clear service layer that:
- Encapsulates business logic
- Orchestrates multiple repositories
- Handles transactions
- Implements domain rules
- Is testable and reusable

---

### Task 2.1: Create User Service

**File:** `src/server/api/services/user.service.ts`

**Implementation:**

```typescript
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private sessionRepo: SessionRepository,
    private auditLogger: AuditLogRepository,
    private emailService: EmailService
  ) {}
  
  // User registration flow
  async registerUser(data: RegisterUserInput): Promise<{
    user: User;
    session: Session;
  }> {
    // 1. Validate input
    const validated = UserRegistrationSchema.parse(data);
    
    // 2. Check if user exists
    const exists = await this.userRepo.exists(validated.email);
    if (exists) {
      throw new ConflictError('Email already registered');
    }
    
    // 3. Check password strength
    const passwordCheck = validatePasswordStrength(validated.password);
    if (!passwordCheck.isValid) {
      throw new ValidationError(passwordCheck.errors);
    }
    
    // 4. Check password breach
    const breachCount = await checkPasswordBreach(validated.password);
    if (breachCount > 0) {
      throw new SecurityError('Password found in breach database');
    }
    
    // 5. Hash password
    const passwordHash = await hashPassword(validated.password);
    
    // 6. Create user and session in transaction
    return await this.db.transaction(async (tx) => {
      const user = await this.userRepo.create({
        email: validated.email,
        passwordHash,
        firstName: validated.firstName,
        lastName: validated.lastName,
      });
      
      const session = await this.sessionRepo.create({
        userId: user.id,
        sessionToken: generateSessionToken(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      
      await this.auditLogger.create({
        userId: user.id,
        action: 'USER_REGISTERED',
        resource: 'user',
        resourceId: user.id.toString(),
      });
      
      return { user, session };
    });
    
    // 7. Send welcome email (async, non-blocking)
    this.emailService.sendWelcomeEmail(user.email, user.firstName)
      .catch(err => logger.error('Failed to send welcome email', { err }));
    
    return { user, session };
  }
  
  // Authentication
  async authenticateUser(email: string, password: string): Promise<{
    user: User;
    session: Session;
  }> { ... }
  
  // Profile management
  async updateProfile(userId: number, data: UpdateProfileInput): Promise<User> { ... }
  
  // Password management
  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> { ... }
  async requestPasswordReset(email: string): Promise<void> { ... }
  async resetPassword(token: string, newPassword: string): Promise<void> { ... }
  
  // Account management
  async verifyEmail(token: string): Promise<User> { ... }
  async deactivateAccount(userId: number): Promise<void> { ... }
  async deleteAccount(userId: number): Promise<void> { ... }
}
```

**Implementation checklist:**
- [ ] Create UserService class
- [ ] Implement registration flow
- [ ] Implement authentication flow
- [ ] Add profile management
- [ ] Add password management
- [ ] Add email verification
- [ ] Add proper error handling
- [ ] Add transaction support
- [ ] Add audit logging
- [ ] Write JSDoc comments

---

### Task 2.2: Create Auth Service

**File:** `src/server/api/services/auth.service.ts`

**Purpose:** Handle authentication-specific logic

```typescript
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private sessionRepo: SessionRepository,
    private auditLogger: AuditLogRepository,
    private securityLogger: SecurityLogger
  ) {}
  
  // Session management
  async createSession(userId: number, clientInfo: ClientInfo): Promise<Session> { ... }
  async validateSession(token: string): Promise<Session | null> { ... }
  async refreshSession(token: string): Promise<Session> { ... }
  async destroySession(token: string): Promise<void> { ... }
  async destroyAllSessions(userId: number): Promise<void> { ... }
  
  // Security
  async checkRateLimit(identifier: string, action: string): Promise<boolean> { ... }
  async recordFailedLogin(email: string, ip: string): Promise<void> { ... }
  async checkAccountLocked(email: string): Promise<boolean> { ... }
  
  // Token management
  async generatePasswordResetToken(email: string): Promise<string> { ... }
  async validatePasswordResetToken(token: string): Promise<User | null> { ... }
  async generateEmailVerificationToken(userId: number): Promise<string> { ... }
  async validateEmailVerificationToken(token: string): Promise<User | null> { ... }
}
```

**Implementation checklist:**
- [ ] Create AuthService class
- [ ] Implement session lifecycle
- [ ] Add rate limiting checks
- [ ] Implement token generation/validation
- [ ] Add security logging
- [ ] Add proper error handling

---

### Task 2.3: Refactor API Routes to Use Services

**Files to update:**
- `src/app/api/auth/user/route.ts`
- `src/app/[locale]/api/counter/route.ts`
- Any other API routes

**Pattern:**

```typescript
// ❌ Before: Direct repository/logic in route
export async function POST(request: NextRequest) {
  const data = await request.json();
  const user = await db.insert(users).values(data);
  return NextResponse.json({ user });
}

// ✅ After: Use service layer
export async function POST(request: NextRequest) {
  const userService = new UserService(
    new UserRepository(),
    new SessionRepository(),
    new AuditLogRepository(),
    new EmailService()
  );
  
  try {
    const data = await request.json();
    const result = await userService.registerUser(data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleServiceError(error);
  }
}
```

**Implementation checklist:**
- [ ] Identify all API routes
- [ ] Create service instances
- [ ] Move business logic to services
- [ ] Keep only HTTP handling in routes
- [ ] Add consistent error handling
- [ ] Update to use dependency injection

---

### Task 2.4: Create Service Factory/Container

**File:** `src/server/api/services/service-factory.ts`

**Purpose:** Centralize service instantiation (Dependency Injection)

```typescript
export class ServiceFactory {
  private static userRepo: UserRepository;
  private static sessionRepo: SessionRepository;
  private static auditLogger: AuditLogRepository;
  
  // Lazy initialization
  private static getUserRepository(): UserRepository {
    if (!this.userRepo) {
      this.userRepo = new UserRepository();
    }
    return this.userRepo;
  }
  
  // Service creators
  static createUserService(): UserService {
    return new UserService(
      this.getUserRepository(),
      this.getSessionRepository(),
      this.getAuditLogger(),
      this.getEmailService()
    );
  }
  
  static createAuthService(): AuthService {
    return new AuthService(
      this.getUserRepository(),
      this.getSessionRepository(),
      this.getAuditLogger(),
      this.getSecurityLogger()
    );
  }
}

// Usage in API routes:
export async function POST(request: NextRequest) {
  const userService = ServiceFactory.createUserService();
  // ...
}
```

**Implementation checklist:**
- [ ] Create ServiceFactory class
- [ ] Add repository singletons
- [ ] Add service creators
- [ ] Update API routes to use factory
- [ ] Consider using actual DI container (optional)

---

## Phase 3: Co-locate Unit Tests

**Priority:** Medium
**Estimated Time:** 2-3 hours
**Dependencies:** None (can run in parallel)

### Current State

Tests in separate `/tests` directory:
```
/tests
  /unit
    user.test.ts
    auth.test.ts
```

### Target State

Tests co-located with source:
```
/src/shared/utils
  helpers.ts
  helpers.test.ts         ← Co-located

/src/server/db/repositories
  user.repository.ts
  user.repository.test.ts ← Co-located
```

---

### Task 3.1: Move Existing Tests

**Tests to relocate:**

```bash
# Find all existing tests
find tests/unit -name "*.test.ts"

# Move to source locations
tests/unit/helpers.test.ts → src/shared/utils/helpers.test.ts
tests/unit/format.test.ts → src/shared/utils/format.test.ts
# ... etc
```

**Implementation checklist:**
- [ ] Inventory all unit tests
- [ ] Create mapping of test → source location
- [ ] Move test files
- [ ] Update import paths in tests
- [ ] Run tests to verify
- [ ] Update test configuration

---

### Task 3.2: Update Test Configuration

**File:** `vitest.config.ts` or `jest.config.js`

```typescript
// Update test match patterns
export default defineConfig({
  test: {
    include: [
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
    ],
    exclude: [
      'node_modules',
      'dist',
      '.next',
    ],
  },
});
```

**Implementation checklist:**
- [ ] Update test glob patterns
- [ ] Update coverage configuration
- [ ] Update CI/CD test commands
- [ ] Verify all tests still run

---

### Task 3.3: Create Test Templates

**File:** `docs/templates/UNIT_TEST_TEMPLATE.md`

```typescript
// Template for unit tests
import { describe, it, expect, beforeEach } from 'vitest';
import { functionToTest } from './module';

describe('functionToTest', () => {
  beforeEach(() => {
    // Setup
  });

  it('should handle normal case', () => {
    const result = functionToTest('input');
    expect(result).toBe('expected');
  });

  it('should handle edge case', () => {
    const result = functionToTest('');
    expect(result).toBe('');
  });

  it('should throw error on invalid input', () => {
    expect(() => functionToTest(null)).toThrow();
  });
});
```

**Implementation checklist:**
- [ ] Create test templates
- [ ] Add to documentation
- [ ] Create examples for each layer
- [ ] Add testing best practices guide

---

### Task 3.4: Write Missing Tests

**Priority areas:**

1. **Repositories** (High priority)
   - [ ] user.repository.test.ts
   - [ ] session.repository.test.ts
   - [ ] audit-log.repository.test.ts

2. **Services** (High priority)
   - [ ] user.service.test.ts
   - [ ] auth.service.test.ts

3. **Utilities** (Medium priority)
   - [ ] Security utilities
   - [ ] Validation functions
   - [ ] Format helpers

4. **Components** (Medium priority)
   - [ ] Form components
   - [ ] UI components

**Implementation checklist:**
- [ ] Identify coverage gaps
- [ ] Write tests for critical paths
- [ ] Aim for 80%+ coverage
- [ ] Add integration tests where needed

---

## Phase 4: Evaluate Feature-Based Organization

**Priority:** Low (Planning phase)
**Estimated Time:** 1-2 hours
**Dependencies:** None

### Current State: Layer-Based Organization

```
/src
├── /client/components    # All components
├── /server/api/services  # All services
└── /shared/types         # All types
```

### Alternative: Feature-Based Organization

```
/src/features
├── /auth
│   ├── /components
│   │   ├── SignInForm.tsx
│   │   └── SignUpForm.tsx
│   ├── /services
│   │   └── auth.service.ts
│   ├── /repositories
│   │   └── user.repository.ts
│   ├── /types
│   │   └── auth.types.ts
│   ├── /hooks
│   │   └── useAuth.ts
│   └── index.ts
│
├── /blog
│   ├── /components
│   ├── /services
│   ├── /types
│   └── index.ts
│
└── /dashboard
    ├── /components
    ├── /services
    └── index.ts
```

---

### Task 4.1: Document Trade-offs

**File:** `docs/FEATURE_VS_LAYER_ORGANIZATION.md`

**Analysis to include:**

#### Layer-Based Pros:
- ✅ Clear technical separation
- ✅ Easy to find all components/services
- ✅ Good for small-medium projects
- ✅ Matches Next.js conventions

#### Layer-Based Cons:
- ❌ Features spread across directories
- ❌ Harder to isolate/extract features
- ❌ More imports across directories

#### Feature-Based Pros:
- ✅ All related code together
- ✅ Easy to extract to microservice/package
- ✅ Clear domain boundaries
- ✅ Parallel team development

#### Feature-Based Cons:
- ❌ Harder to find all components
- ❌ Potential code duplication
- ❌ Requires discipline to maintain

**Implementation checklist:**
- [ ] Document both approaches
- [ ] List pros/cons
- [ ] Provide examples of each
- [ ] Make recommendation based on project size

---

### Task 4.2: Decision Criteria

**Questions to answer:**

1. **Team Size**
   - Single developer → Layer-based OK
   - Small team (2-5) → Layer-based OK
   - Large team (5+) → Consider feature-based

2. **Project Complexity**
   - Simple CRUD → Layer-based
   - Multiple domains → Feature-based
   - Microservices target → Feature-based

3. **Growth Plans**
   - Static size → Layer-based
   - Rapid growth → Feature-based
   - Monorepo plans → Feature-based

**Implementation checklist:**
- [ ] Assess current project size
- [ ] Evaluate growth trajectory
- [ ] Consider team composition
- [ ] Make documented decision

---

### Task 4.3: Hybrid Approach (Recommended)

**Proposal:** Keep current layer-based structure, but organize within layers by feature

```
/src/client/components
├── /auth          # Auth feature components
│   ├── SignInForm.tsx
│   └── SignUpForm.tsx
├── /blog          # Blog feature components
│   ├── BlogPost.tsx
│   └── BlogList.tsx
└── /dashboard     # Dashboard feature components
    ├── DashboardHeader.tsx
    └── DashboardStats.tsx

/src/server/api/services
├── /auth          # Auth feature services
│   ├── auth.service.ts
│   └── user.service.ts
├── /blog          # Blog feature services
│   └── blog.service.ts
└── /dashboard     # Dashboard feature services
    └── analytics.service.ts
```

**Benefits:**
- ✅ Maintains layer separation
- ✅ Groups by feature within layers
- ✅ Easy migration to full feature-based later
- ✅ Best of both worlds

**Implementation checklist:**
- [ ] Reorganize components by feature
- [ ] Reorganize services by feature
- [ ] Update imports
- [ ] Document new structure

---

## Implementation Timeline

### Week 1: Repository & Service Layer

| Day | Tasks | Hours |
|-----|-------|-------|
| Day 1 | Phase 1: Tasks 1.1-1.2 (Repositories) | 3-4h |
| Day 2 | Phase 1: Tasks 1.3-1.4 (More repositories + Base) | 3-4h |
| Day 3 | Phase 2: Task 2.1 (User Service) | 2-3h |
| Day 4 | Phase 2: Tasks 2.2-2.3 (Auth Service + Refactor) | 3-4h |
| Day 5 | Phase 2: Task 2.4 (Service Factory) | 1-2h |

### Week 2: Testing & Evaluation

| Day | Tasks | Hours |
|-----|-------|-------|
| Day 6 | Phase 3: Tasks 3.1-3.2 (Move tests) | 2-3h |
| Day 7 | Phase 3: Tasks 3.3-3.4 (Write new tests) | 3-4h |
| Day 8 | Phase 4: All tasks (Evaluation) | 2h |
| Day 9 | Documentation updates | 1-2h |
| Day 10 | Code review & refinements | 2-3h |

---

## Success Criteria

### Phase 1 Complete When:
- [ ] All repository methods implemented
- [ ] No TODO comments in repositories
- [ ] All repositories extend BaseRepository
- [ ] 100% TypeScript type coverage
- [ ] Error handling in all methods

### Phase 2 Complete When:
- [ ] UserService and AuthService fully implemented
- [ ] All API routes refactored to use services
- [ ] Service factory/DI container in place
- [ ] Business logic moved out of API routes
- [ ] Transaction support working

### Phase 3 Complete When:
- [ ] All unit tests co-located
- [ ] Test coverage >80%
- [ ] All tests passing
- [ ] Test templates documented
- [ ] CI/CD updated

### Phase 4 Complete When:
- [ ] Trade-offs documented
- [ ] Decision made and justified
- [ ] Migration path defined (if needed)
- [ ] Architecture documentation updated

---

## Rollback Plan

If any phase causes issues:

1. **Repository Issues**
   - Keep old implementations
   - Feature flag new repositories
   - Gradual migration per table

2. **Service Layer Issues**
   - Keep logic in routes temporarily
   - Migrate one route at a time
   - Use feature flags

3. **Test Co-location Issues**
   - Revert test moves
   - Keep in /tests directory
   - Try gradual migration

4. **Feature Organization Issues**
   - Stay with current structure
   - Document decision
   - Revisit in 6 months

---

## Next Steps After This Plan

Once all phases complete:

1. **Performance Optimization**
   - Add caching layer
   - Optimize database queries
   - Add Redis for sessions

2. **Advanced Features**
   - Add GraphQL API
   - Implement real-time updates
   - Add background jobs

3. **Scalability**
   - Prepare for microservices
   - Add API versioning
   - Implement feature flags

4. **DevOps**
   - Add more monitoring
   - Improve CI/CD pipeline
   - Add automated deployments

---

## Questions & Decisions Needed

Before starting implementation:

1. **Testing Framework:** Vitest or Jest? (Recommend: Vitest)
2. **DI Container:** Manual factory or library? (Recommend: Manual first)
3. **Feature Organization:** Now or later? (Recommend: Later)
4. **Code Coverage Target:** 80%, 90%, or 100%? (Recommend: 80%)

---

**Ready to begin?** Start with Phase 1, Task 1.1!

For questions or clarifications, refer to the detailed task descriptions above.
