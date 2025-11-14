# Modular Authentication System

This directory contains a modular authentication system that allows you to switch between different authentication providers (Clerk, Cloudflare Access, AWS Cognito) using just an environment variable.

## Quick Start

### Switch Auth Providers

Change the `NEXT_PUBLIC_AUTH_PROVIDER` environment variable in your `.env` file:

```bash
# Use Clerk (default)
NEXT_PUBLIC_AUTH_PROVIDER=clerk

# Use Cloudflare Access
NEXT_PUBLIC_AUTH_PROVIDER=cloudflare

# Use AWS Cognito
NEXT_PUBLIC_AUTH_PROVIDER=cognito
```

Restart your dev server after changing the provider.

## Architecture

### Files Structure

```
src/libs/auth/
├── types.ts              # TypeScript interfaces and types
├── factory.ts            # Provider factory (singleton pattern)
├── index.ts              # Main exports and convenience functions
├── components.tsx        # React components (AuthProvider, SignIn, etc.)
├── middleware.ts         # Middleware helper for route protection
├── adapters/
│   ├── ClerkAdapter.tsx       # Clerk implementation
│   ├── CloudflareAdapter.tsx  # Cloudflare Access implementation
│   └── CognitoAdapter.tsx     # AWS Cognito implementation (stub)
└── README.md            # This file
```

### How It Works

1. **Adapter Pattern**: Each auth provider implements the `IAuthAdapter` interface
2. **Factory Pattern**: The `AuthFactory` creates the correct adapter based on `NEXT_PUBLIC_AUTH_PROVIDER`
3. **Single API**: Your app code uses the unified API, adapter handles provider-specific logic

## Usage

### Server Components

```typescript
import { getCurrentUser, isAuthenticated } from '@/libs/auth';

export default async function Page() {
  const user = await getCurrentUser();
  // user: { id: string, email: string, firstName?: string, ... }

  const authenticated = await isAuthenticated();
  // authenticated: boolean

  return <div>Hello {user?.email}</div>;
}
```

### Client Components

```typescript
import {
  AuthProvider,
  SignInComponent,
  SignUpComponent,
  SignOutButtonComponent,
  UserProfileComponent
} from '@/libs/auth/components';

// Wrap your app with AuthProvider
<AuthProvider locale="en">
  {children}
</AuthProvider>

// Use sign-in UI
<SignInComponent path="/sign-in" locale="en" />

// Use sign-up UI
<SignUpComponent path="/sign-up" locale="en" />

// Use sign-out button
<SignOutButtonComponent>
  <button>Sign Out</button>
</SignOutButtonComponent>

// User profile UI
<UserProfileComponent path="/profile" />
```

### Middleware

```typescript
import { executeAuthMiddleware } from '@/libs/auth/middleware';

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  const authResponse = await executeAuthMiddleware(request, event, {
    protectedRoutes: ['/dashboard'],
    publicRoutes: ['/'],
    signInUrl: '/sign-in',
    signUpUrl: '/sign-up',
    afterSignInUrl: '/dashboard',
    afterSignUpUrl: '/dashboard',
    afterSignOutUrl: '/',
  });

  if (authResponse) {
    return authResponse;
  }

  // Continue to next middleware
}
```

## Provider-Specific Setup

### Clerk (Fully Implemented ✅)

1. Set environment variables in `.env.local`:
```bash
NEXT_PUBLIC_AUTH_PROVIDER=clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

2. That's it! Clerk is fully integrated.

**Features:**
- ✅ Pre-built UI components
- ✅ Multi-language support
- ✅ Social auth, MFA, passkeys
- ✅ User profile management

### Cloudflare Access (Fully Implemented ✅)

1. Set environment variables:
```bash
NEXT_PUBLIC_AUTH_PROVIDER=cloudflare
NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN=https://your-team.cloudflareaccess.com
NEXT_PUBLIC_CLOUDFLARE_AUDIENCE=your-application-audience-tag
NEXT_PUBLIC_CLOUDFLARE_VERIFY_JWT=true  # Optional: Enable JWT verification
```

2. Configure Cloudflare Access in your Cloudflare dashboard

**Current Implementation:**
- ✅ Reads user from request headers
- ✅ Full middleware integration with route protection
- ✅ JWT token verification (optional)
- ✅ Custom sign-in UI with auto-redirect
- ✅ User profile UI with account information
- ✅ Sign-out functionality
- ✅ Utility functions for Cloudflare Access operations

**Features:**
- Automatic redirect to Cloudflare login
- JWT token validation (when enabled)
- User profile management
- Clean error handling and configuration validation

### AWS Cognito (Stub Implementation ⚠️)

1. Install dependencies:
```bash
npm install aws-amplify @aws-amplify/ui-react
```

2. Set environment variables:
```bash
NEXT_PUBLIC_AUTH_PROVIDER=cognito
NEXT_PUBLIC_COGNITO_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx
```

3. Configure Amplify (see `adapters/CognitoAdapter.tsx` comments)

**Current Implementation:**
- ⚠️ Stub only - displays "not implemented" messages
- ⚠️ All methods need to be implemented

**To Complete:**
- Configure AWS Amplify
- Implement all IAuthAdapter methods
- Add Authenticator UI components

## Adding a New Provider

1. Create a new adapter in `adapters/` implementing `IAuthAdapter`:

```typescript
// adapters/MyAuthAdapter.tsx
import type { AuthUser, IAuthAdapter } from '../types';

export class MyAuthAdapter implements IAuthAdapter {
  async getCurrentUser(): Promise<AuthUser | null> {
    // Your implementation
  }

  // Implement all other methods...
}
```

2. Add to factory in `factory.ts`:

```typescript
case 'myauth':
  return new MyAuthAdapter();
```

3. Add environment variables to `.env`

4. Update documentation

## Type Definitions

### AuthUser
```typescript
type AuthUser = {
  id: string;
  email: string | null;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
};
```

### IAuthAdapter
See `types.ts` for the complete interface that all adapters must implement.

## Benefits

- ✅ **No vendor lock-in**: Switch providers anytime
- ✅ **Clean code**: Single API across your entire app
- ✅ **Type-safe**: Full TypeScript support
- ✅ **Testing**: Easy to mock for tests
- ✅ **Extensible**: Add new providers easily

## Limitations

- Cloudflare and Cognito adapters are stubs (need completion)
- Provider-specific features not exposed (use adapter directly if needed)
- UI components may vary between providers

## Advanced: Direct Adapter Access

If you need provider-specific features:

```typescript
import { getAuthAdapter, getAuthProvider } from '@/libs/auth';
import { ClerkAdapter } from '@/libs/auth/adapters/ClerkAdapter';

const adapter = getAuthAdapter();
const provider = getAuthProvider(); // 'clerk' | 'cloudflare' | 'cognito'

if (provider === 'clerk') {
  // Type-safe access to Clerk-specific features
  const clerkAdapter = adapter as ClerkAdapter;
  // Use Clerk-specific methods
}
```

## Troubleshooting

**Issue: Changes not reflected after switching provider**
- Restart your Next.js dev server
- Clear `.next` cache: `npm run clean && npm run dev`

**Issue: TypeScript errors after adding adapter**
- Ensure your adapter implements all `IAuthAdapter` methods
- Check return types match the interface

**Issue: Middleware not working**
- Verify your adapter's `createMiddleware` static method
- Check middleware is registered in `middleware.ts`

## Contributing

When adding or updating adapters:
1. Implement the complete `IAuthAdapter` interface
2. Add tests (if test infrastructure exists)
3. Update this README
4. Add environment variables to `.env` and `.env.example`
