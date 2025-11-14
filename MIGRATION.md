# Modular Authentication Migration Guide

This project now has a modular authentication system that allows you to switch between different providers (Clerk, Cloudflare Access, AWS Cognito) using environment variables.

## What Changed?

### Before
```typescript
import { SignIn, SignOutButton, SignUp } from '@clerk/nextjs';
// Direct Clerk imports everywhere
import { currentUser } from '@clerk/nextjs/server';
```

### After
```typescript
// Unified auth abstraction
import { getCurrentUser } from '@/libs/auth';
import { SignInComponent, SignOutButtonComponent, SignUpComponent } from '@/libs/auth/components';
```

## Files Modified

1. **src/middleware.ts** - Now uses auth abstraction
2. **src/app/[locale]/(auth)/layout.tsx** - Uses AuthProvider instead of ClerkProvider
3. **src/app/[locale]/(auth)/(center)/sign-in/[[...sign-in]]/page.tsx** - Uses SignInComponent
4. **src/app/[locale]/(auth)/(center)/sign-up/[[...sign-up]]/page.tsx** - Uses SignUpComponent
5. **src/app/[locale]/(auth)/dashboard/layout.tsx** - Uses SignOutButtonComponent
6. **src/app/[locale]/(auth)/dashboard/user-profile/[[...user-profile]]/page.tsx** - Uses UserProfileComponent
7. **src/components/Hello.tsx** - Uses getCurrentUser()
8. **.env** - Added NEXT_PUBLIC_AUTH_PROVIDER configuration

## New Files Added

```
src/libs/auth/
├── types.ts                    # Auth interfaces and types
├── factory.ts                  # Provider factory
├── index.ts                    # Main exports
├── components.tsx              # React components
├── middleware.ts               # Middleware helper
├── adapters/
│   ├── ClerkAdapter.tsx        # Clerk implementation (✅ complete)
│   ├── CloudflareAdapter.tsx   # Cloudflare stub (⚠️ needs work)
│   └── CognitoAdapter.tsx      # Cognito stub (⚠️ needs work)
└── README.md                   # Auth system documentation
```

## Switching Auth Providers

### Use Clerk (Current Default)
```bash
# .env or .env.local
NEXT_PUBLIC_AUTH_PROVIDER=clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Use Cloudflare Access
```bash
# .env or .env.local
NEXT_PUBLIC_AUTH_PROVIDER=cloudflare
NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN=https://your-team.cloudflareaccess.com
```

**Note:** Cloudflare adapter needs additional implementation for production use.

### Use AWS Cognito
```bash
# First install dependencies
npm install aws-amplify @aws-amplify/ui-react

# Then configure
NEXT_PUBLIC_AUTH_PROVIDER=cognito
NEXT_PUBLIC_COGNITO_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx
```

**Note:** Cognito adapter is a stub and needs full implementation.

## Breaking Changes

None! The app still works exactly as before with Clerk (default). The changes are backward compatible.

## Benefits of This Change

1. **No vendor lock-in** - Switch auth providers anytime
2. **Clean codebase** - Single API across all components
3. **Type-safe** - Full TypeScript support throughout
4. **Easy testing** - Mock auth easily for tests
5. **Extensible** - Add new providers with minimal effort

## Testing

After migration, the following tests confirm everything works:

✅ TypeScript compilation: `npm run check:types`
✅ Unit tests: `npm run test`
✅ App runs: `npm run dev`
✅ All existing functionality preserved

## Rollback

If you need to rollback to direct Clerk usage:

1. Revert changes to the files listed in "Files Modified" above
2. Remove `src/libs/auth/` directory
3. Use direct Clerk imports again

## Need Help?

- See `src/libs/auth/README.md` for complete auth system documentation
- Cloudflare adapter: Implement methods marked with `TODO` in `CloudflareAdapter.tsx`
- Cognito adapter: Follow instructions in `CognitoAdapter.tsx` comments
- Add new provider: Implement `IAuthAdapter` interface in new adapter

## Migration Checklist

- [x] Auth abstraction layer created
- [x] Clerk adapter implemented
- [x] Cloudflare adapter stub created
- [x] Cognito adapter stub created
- [x] All components updated to use abstraction
- [x] Middleware updated
- [x] Environment variables configured
- [x] Tests passing
- [x] TypeScript compilation successful
- [x] Documentation updated

## Future Improvements

Potential enhancements to the auth system:

1. Complete Cloudflare Access adapter implementation
2. Complete AWS Cognito adapter implementation
3. Add NextAuth.js adapter for maximum flexibility
4. Add auth adapter unit tests
5. Create example custom adapter
6. Add session management utilities
7. Implement role-based access control (RBAC) abstraction
