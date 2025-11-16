# ADR-001: Multi-Provider Auth Architecture

## Status
Accepted

## Date
2024-11-15

## Context

SaaS applications often need to support multiple authentication providers based on deployment environment, customer requirements, or pricing tier. Hard-coding a single provider creates vendor lock-in and makes it difficult to:

1. **Switch providers** without rewriting application code
2. **Support different providers** for different customers (multi-tenancy)
3. **Test authentication** without external dependencies
4. **Compare providers** during evaluation
5. **Migrate gradually** from one provider to another

### Initial Challenges

- **Clerk-only implementation**: Application was tightly coupled to Clerk SDK
- **Direct imports**: Components imported from `@clerk/nextjs` throughout codebase
- **No abstraction**: Business logic mixed with provider-specific code
- **Testing difficulty**: E2E tests required Clerk test credentials
- **Environment constraints**: Couldn't run auth flows offline or in CI without external services

### Requirements

1. Support multiple auth providers: Clerk, Cloudflare Access, AWS Cognito
2. Switch providers via environment variable (zero code changes)
3. Unified API across all providers
4. Full TypeScript type safety
5. Support both client and server-side operations
6. Minimal bundle size impact
7. Test mode for E2E testing without external dependencies

## Decision

Implement a **modular authentication system** using the **Adapter Pattern** with a **Factory** for provider selection.

### Architecture

```
Application Code
      ↓
Unified Auth API (src/libs/auth/index.ts)
      ↓
Auth Factory (src/libs/auth/factory.ts)
      ↓
IAuthAdapter Interface (src/libs/auth/types.ts)
      ↓
┌─────────┬──────────────┬────────────┬─────────────┐
│  Clerk  │  Cloudflare  │  Cognito   │  Test       │
│ Adapter │   Adapter    │  Adapter   │  Adapter    │
└─────────┴──────────────┴────────────┴─────────────┘
```

### Core Components

#### 1. IAuthAdapter Interface

Defines the contract all providers must implement:

```typescript
export type IAuthAdapter = {
  // Server-side methods
  getCurrentUser: () => Promise<AuthUser | null>;
  getSession: () => Promise<AuthSession | null>;
  signOut: () => Promise<void>;

  // Middleware methods
  protectRoute: (request: NextRequest, config: AuthMiddlewareConfig) => Promise<{
    isAuthenticated: boolean;
    redirectUrl?: string;
  }>;

  // Client component render methods
  renderProvider: (props: { children: React.ReactNode; locale: string }) => React.ReactElement;
  renderSignIn: (props: { path: string; locale: string }) => React.ReactElement;
  renderSignUp: (props: { path: string; locale: string }) => React.ReactElement;
  renderSignOutButton: (props: { children: React.ReactNode }) => React.ReactElement;
  renderUserProfile: (props: { path: string }) => React.ReactElement;
};
```

#### 2. Auth Factory (Singleton Pattern)

Creates the appropriate adapter based on `NEXT_PUBLIC_AUTH_PROVIDER`:

```typescript
export class AuthFactory {
  private static instance: IAuthAdapter | null = null;

  static getAdapter(): IAuthAdapter {
    if (!this.instance) {
      this.instance = this.createAdapter();
    }
    return this.instance;
  }

  private static createAdapter(): IAuthAdapter {
    const provider = process.env.NEXT_PUBLIC_AUTH_PROVIDER || 'clerk';

    switch (provider) {
      case 'clerk': return new ClerkAdapter();
      case 'cloudflare': return new CloudflareAdapter();
      case 'cognito': return new CognitoAdapter();
      case 'test': return new TestAdapter();
      default: return new ClerkAdapter(); // Safe fallback
    }
  }
}
```

#### 3. Unified Auth API

Application code uses clean, provider-agnostic functions:

```typescript
// src/libs/auth/index.ts
export async function getCurrentUser(): Promise<AuthUser | null> {
  return await getAuthAdapter().getCurrentUser();
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
```

#### 4. Provider Adapters

Each adapter implements `IAuthAdapter` for its specific provider:

- **ClerkAdapter** (✅ Complete): Full Clerk SDK integration
- **CloudflareAdapter** (✅ Complete): Cloudflare Access with JWT verification
- **CognitoAdapter** (⚠️ Stub): Placeholder for AWS Cognito
- **TestAdapter** (✅ Complete): In-memory auth for E2E testing

## Implementation

### File Structure

```
src/libs/auth/
├── types.ts              # TypeScript interfaces
├── factory.ts            # Provider factory
├── index.ts              # Main exports and utilities
├── components.tsx        # Unified React components
├── middleware.ts         # Middleware helper
├── adapters/
│   ├── ClerkAdapter.tsx
│   ├── CloudflareAdapter.tsx
│   ├── CognitoAdapter.tsx
│   ├── TestAdapter.tsx
│   ├── TEST_ADAPTER_README.md
│   └── cloudflare/
│       ├── utils.ts      # Cloudflare-specific utilities
│       └── UserProfile.tsx
└── README.md
```

### Usage Examples

#### Server Components

```typescript
import { getCurrentUser, isAuthenticated } from '@/libs/auth';

export default async function Page() {
  const user = await getCurrentUser();
  const authenticated = await isAuthenticated();

  return <div>Hello {user?.email}</div>;
}
```

#### Client Components

```typescript
import {
  AuthProvider,
  SignInComponent,
  SignOutButtonComponent
} from '@/libs/auth/components';

// Wrap app with AuthProvider
<AuthProvider locale="en">
  {children}
</AuthProvider>

// Use sign-in UI
<SignInComponent path="/sign-in" locale="en" />

// Use sign-out button
<SignOutButtonComponent>
  <button>Sign Out</button>
</SignOutButtonComponent>
```

#### Middleware

```typescript
import { executeAuthMiddleware } from '@/libs/auth/middleware';

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  const authResponse = await executeAuthMiddleware(request, event, {
    protectedRoutes: ['/dashboard'],
    signInUrl: '/sign-in',
    afterSignInUrl: '/dashboard',
  });

  if (authResponse) return authResponse;
  // Continue to next middleware
}
```

### Switching Providers

Change environment variable and restart:

```bash
# .env.local
NEXT_PUBLIC_AUTH_PROVIDER=cloudflare
NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN=https://team.cloudflareaccess.com
NEXT_PUBLIC_CLOUDFLARE_AUDIENCE=your-audience-tag
```

No code changes required!

## Consequences

### Positive

✅ **No vendor lock-in**: Switch providers by changing one environment variable
✅ **Clean codebase**: Application code completely decoupled from provider specifics
✅ **Type safety**: Full TypeScript support with autocomplete
✅ **Testability**: Test adapter enables E2E tests without external dependencies
✅ **Extensibility**: Add new providers by implementing `IAuthAdapter`
✅ **Maintainability**: Provider-specific logic isolated in adapters
✅ **Bundle optimization**: Tree-shaking removes unused provider code
✅ **Multi-tenancy ready**: Can support different providers per tenant

### Negative

⚠️ **Abstraction overhead**: Adapter layer adds complexity vs direct provider usage
⚠️ **Lowest common denominator**: Unified API can't expose provider-specific features
⚠️ **Initial implementation cost**: More code to write upfront
⚠️ **Testing matrix**: Must test all adapters to ensure compatibility
⚠️ **Documentation burden**: Need to document each provider's setup
⚠️ **Type complexity**: Generic types can be harder to understand

### Trade-offs

**Provider-Specific Features**

Solution: Allow direct adapter access for advanced use cases:

```typescript
import { getAuthAdapter, getAuthProvider } from '@/libs/auth';

const adapter = getAuthAdapter();
const provider = getAuthProvider(); // 'clerk' | 'cloudflare' | ...

if (provider === 'clerk') {
  // Access Clerk-specific features
  const clerkAdapter = adapter as ClerkAdapter;
  // Use Clerk-specific methods
}
```

**Bundle Size**

All adapters are imported by factory, but Next.js tree-shaking removes unused code in production builds. Static provider selection allows dead code elimination.

**Migration Path**

For gradual migration:
1. Deploy with both old and new adapters
2. Use feature flags to control rollout
3. Monitor errors and performance
4. Complete migration and remove old adapter

## Related

### Files

- `src/libs/auth/types.ts` - Core types and interfaces
- `src/libs/auth/factory.ts:12-59` - Factory implementation
- `src/libs/auth/index.ts` - Unified API exports
- `src/libs/auth/components.tsx` - React components
- `src/libs/auth/README.md` - Usage documentation

### ADRs

- ADR-005: Test Auth Adapter Design
- ADR-002: Middleware Execution Order (auth middleware integration)

### Documentation

- `src/libs/auth/README.md` - Complete usage guide
- `src/libs/auth/adapters/TEST_ADAPTER_README.md` - Test adapter specifics

## Compliance

- [x] ClerkAdapter fully implemented
- [x] CloudflareAdapter fully implemented
- [x] TestAdapter fully implemented
- [x] Unit tests for factory
- [x] E2E tests with test adapter
- [x] Documentation updated
- [ ] CognitoAdapter implementation (planned Sprint 6)
- [ ] Integration tests for all adapters
- [ ] Provider switching E2E tests

## Future Work

### Sprint 6: Cognito Adapter

Complete AWS Cognito implementation:

```typescript
// Install dependencies
npm install aws-amplify @aws-amplify/ui-react

// Implement all IAuthAdapter methods
export class CognitoAdapter implements IAuthAdapter {
  async getCurrentUser() { /* Amplify integration */ }
  // ... complete implementation
}
```

### Provider-Specific Optimizations

- Lazy-load adapters to reduce initial bundle size
- Use dynamic imports for provider SDKs
- Implement adapter-specific caching strategies

### Enhanced Type Safety

```typescript
// Type-safe provider configuration
type ProviderConfig<T extends AuthProvider> =
  T extends 'clerk' ? ClerkConfig :
  T extends 'cloudflare' ? CloudflareConfig :
  T extends 'cognito' ? CognitoConfig :
  never;
```

### Multi-Provider Support

Support multiple providers simultaneously (different providers per tenant):

```typescript
const adapter = getAuthAdapterForTenant(tenantId);
```

## Lessons Learned

1. **Start with interfaces**: Defining `IAuthAdapter` first forced clear thinking about requirements
2. **Render methods in interface**: Initially tried HOCs, but direct render methods simpler
3. **Singleton factory**: Ensures consistent adapter instance across app
4. **Test adapter crucial**: Enabled E2E testing without external dependencies
5. **Environment-based selection**: Runtime selection via env var more flexible than build-time

## References

- [Adapter Pattern](https://refactoring.guru/design-patterns/adapter)
- [Factory Pattern](https://refactoring.guru/design-patterns/factory-method)
- [Clerk Documentation](https://clerk.com/docs)
- [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/identity/authorization-cookie/)
- [AWS Cognito](https://docs.aws.amazon.com/cognito/)
