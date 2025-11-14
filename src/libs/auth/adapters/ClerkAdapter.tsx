import type { NextRequest } from 'next/server';
import type { AuthMiddlewareConfig, AuthSession, AuthUser, IAuthAdapter } from '../types';
import { ClerkProvider, SignIn, SignOutButton, SignUp, UserProfile } from '@clerk/nextjs';
import { clerkMiddleware, currentUser } from '@clerk/nextjs/server';
import { routing } from '@/libs/I18nRouting';
import { ClerkLocalizations } from '@/shared/config/app.config';

/**
 * Clerk Authentication Adapter
 * Implements the IAuthAdapter interface using Clerk
 */
export class ClerkAdapter implements IAuthAdapter {
  async getCurrentUser(): Promise<AuthUser | null> {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress ?? null,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    };
  }

  async getSession(): Promise<AuthSession | null> {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    // Clerk doesn't expose session ID directly in the same way
    // We can use the user ID as a proxy
    return {
      userId: user.id,
      sessionId: user.id, // Clerk manages sessions internally
    };
  }

  async signOut(): Promise<void> {
    // Sign out is handled by the SignOutButton component
    // This method is a no-op for server-side usage
  }

  async protectRoute(
    _request: NextRequest,
    _config: AuthMiddlewareConfig,
  ): Promise<{ isAuthenticated: boolean; redirectUrl?: string }> {
    // Clerk middleware handles this internally
    // We'll return a placeholder here and handle it in the actual middleware
    return {
      isAuthenticated: true, // Clerk handles this
    };
  }

  renderProvider(props: { children: React.ReactNode; locale: string }): React.ReactElement {
    const clerkLocale = ClerkLocalizations.supportedLocales[props.locale]
      ?? ClerkLocalizations.defaultLocale;

    let signInUrl = '/sign-in';
    let signUpUrl = '/sign-up';
    let dashboardUrl = '/dashboard';
    let afterSignOutUrl = '/';

    if (props.locale !== routing.defaultLocale) {
      signInUrl = `/${props.locale}${signInUrl}`;
      signUpUrl = `/${props.locale}${signUpUrl}`;
      dashboardUrl = `/${props.locale}${dashboardUrl}`;
      afterSignOutUrl = `/${props.locale}${afterSignOutUrl}`;
    }

    return (
      <ClerkProvider
        appearance={{
          cssLayerName: 'clerk',
        }}
        localization={clerkLocale}
        signInUrl={signInUrl}
        signUpUrl={signUpUrl}
        signInFallbackRedirectUrl={dashboardUrl}
        signUpFallbackRedirectUrl={dashboardUrl}
        afterSignOutUrl={afterSignOutUrl}
      >
        {props.children}
      </ClerkProvider>
    );
  }

  renderSignIn(props: { path: string; locale: string }): React.ReactElement {
    return <SignIn path={props.path} />;
  }

  renderSignUp(props: { path: string; locale: string }): React.ReactElement {
    return <SignUp path={props.path} />;
  }

  renderSignOutButton(props: { children: React.ReactNode }): React.ReactElement {
    return <SignOutButton>{props.children}</SignOutButton>;
  }

  renderUserProfile(props: { path: string }): React.ReactElement {
    return <UserProfile path={props.path} />;
  }

  /**
   * Clerk-specific middleware wrapper
   * This is used in the actual middleware.ts file
   */
  static createMiddleware(config: AuthMiddlewareConfig) {
    return clerkMiddleware(async (auth, req) => {
      const isProtectedRoute = config.protectedRoutes.some(route =>
        req.nextUrl.pathname.includes(route),
      );

      if (isProtectedRoute) {
        const locale = req.nextUrl.pathname.match(/(\/.*)\/dashboard/)?.at(1) ?? '';
        const signInUrl = new URL(`${locale}${config.signInUrl}`, req.url);

        await auth.protect({
          unauthenticatedUrl: signInUrl.toString(),
        });
      }

      return null; // Continue to next middleware
    });
  }
}
