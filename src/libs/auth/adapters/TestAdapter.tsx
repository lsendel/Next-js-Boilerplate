import type { NextRequest } from 'next/server';
import type { AuthMiddlewareConfig, AuthSession, AuthUser, IAuthAdapter } from '../types';
import React from 'react';
import { TestSignInForm } from './TestSignInForm';
import { TestSignUpForm } from './TestSignUpForm';
import { TestSignOutButton } from './TestSignOutButton';
import { TestUserProfile } from './TestUserProfile';

/**
 * Test Authentication Adapter
 * Simple form-based authentication for E2E tests
 *
 * WARNING: This adapter is for testing purposes only!
 * Do NOT use in production - it stores passwords in memory without proper hashing
 */
export class TestAdapter implements IAuthAdapter {
  private static readonly SESSION_COOKIE = 'test-auth-session';

  async getCurrentUser(): Promise<AuthUser | null> {
    // Import server-side modules
    const { cookies } = await import('next/headers');
    const { sessions, users } = await import('./TestAdapter.server');

    const cookieStore = await cookies();
    const sessionId = cookieStore.get(TestAdapter.SESSION_COOKIE)?.value;

    if (!sessionId) {
      return null;
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return null;
    }

    const user = users.get(userId);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    };
  }

  async getSession(): Promise<AuthSession | null> {
    // Import server-side modules
    const { cookies } = await import('next/headers');
    const { sessions } = await import('./TestAdapter.server');

    const cookieStore = await cookies();
    const sessionId = cookieStore.get(TestAdapter.SESSION_COOKIE)?.value;

    if (!sessionId) {
      return null;
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return null;
    }

    return {
      userId,
      sessionId,
    };
  }

  async signOut(): Promise<void> {
    // Sign out is handled by the SignOutButton component
    // This method is a no-op for server-side usage
  }

  async protectRoute(
    request: NextRequest,
    _config: AuthMiddlewareConfig,
  ): Promise<{ isAuthenticated: boolean; redirectUrl?: string }> {
    // This method should not be used - middleware uses TestAdapter.server directly
    // Kept for interface compliance
    const sessionId = request.cookies.get(TestAdapter.SESSION_COOKIE)?.value;

    if (!sessionId) {
      return { isAuthenticated: false };
    }

    // Import server-side modules
    const { sessions } = await import('./TestAdapter.server');
    const userId = sessions.get(sessionId);
    if (!userId) {
      return { isAuthenticated: false };
    }

    return { isAuthenticated: true };
  }

  renderProvider(props: { children: React.ReactNode; locale: string }): React.ReactElement {
    // Test auth doesn't need a provider wrapper
    return <>{props.children}</>;
  }

  renderSignIn(props: { path: string; locale: string }): React.ReactElement {
    return <TestSignInForm path={props.path} locale={props.locale} />;
  }

  renderSignUp(props: { path: string; locale: string }): React.ReactElement {
    return <TestSignUpForm path={props.path} locale={props.locale} />;
  }

  renderSignOutButton(props: { children: React.ReactNode }): React.ReactElement {
    return <TestSignOutButton>{props.children}</TestSignOutButton>;
  }

  renderUserProfile(_props: { path: string }): React.ReactElement {
    return <TestUserProfile />;
  }

  /**
   * Test-specific middleware wrapper
   * @deprecated Use createTestMiddleware from TestAdapter.server instead
   */
  static createMiddleware(config: AuthMiddlewareConfig) {
    return async (request: NextRequest) => {
      const isProtectedRoute = config.protectedRoutes.some(route =>
        request.nextUrl.pathname.includes(route),
      );

      if (!isProtectedRoute) {
        return null; // Continue to next middleware
      }

      const sessionId = request.cookies.get(TestAdapter.SESSION_COOKIE)?.value;

      // Import server-side modules
      const { sessions } = await import('./TestAdapter.server');
      const userId = sessionId ? sessions.get(sessionId) : null;

      if (!userId) {
        // User not authenticated, redirect to sign-in
        const locale = request.nextUrl.pathname.match(/(\/.*)\/dashboard/)?.at(1) ?? '';
        const signInUrl = new URL(`${locale}${config.signInUrl}`, request.url);
        return Response.redirect(signInUrl.toString(), 302);
      }

      return null; // Continue to next middleware
    };
  }
}
