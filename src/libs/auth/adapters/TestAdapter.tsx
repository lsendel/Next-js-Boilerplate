'use client';

import type { NextRequest } from 'next/server';
import type { AuthMiddlewareConfig, AuthSession, AuthUser, IAuthAdapter } from '../types';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';
import { routing } from '@/libs/I18nRouting';
import { authLogger } from '@/libs/Logger';

/**
 * In-memory user storage for test authentication
 * This is cleared on server restart - only for E2E testing!
 */
interface TestUser {
  id: string;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
}

const users = new Map<string, TestUser>();
const sessions = new Map<string, string>(); // sessionId -> userId

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
    const { cookies } = await import('next/headers');
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
    const { cookies } = await import('next/headers');
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
    const sessionId = request.cookies.get(TestAdapter.SESSION_COOKIE)?.value;

    if (!sessionId) {
      return { isAuthenticated: false };
    }

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

/**
 * Sign In Form Component
 */
function TestSignInForm({ locale }: { path: string; locale: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate email format
      if (!email || !email.includes('@')) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // Validate password
      if (!password || password.length < 8) {
        setError('Password must be at least 8 characters');
        setIsLoading(false);
        return;
      }

      // Find user by email
      let user: TestUser | null = null;
      for (const u of users.values()) {
        if (u.email === email) {
          user = u;
          break;
        }
      }

      if (!user || user.password !== password) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Create session
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      sessions.set(sessionId, user.id);

      // Set cookie via API route
      const response = await fetch('/api/test-auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to set session cookie');
      }

      // Redirect to dashboard
      const dashboardUrl = locale !== routing.defaultLocale
        ? `/${locale}/dashboard`
        : '/dashboard';
      window.location.href = dashboardUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
      setIsLoading(false);
    }
  };

  const signUpUrl = locale !== routing.defaultLocale
    ? `/${locale}/sign-up`
    : '/sign-up';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Test Mode Authentication
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div
              role="alert"
              className="rounded-md bg-red-50 p-4 text-sm text-red-800"
            >
              {error}
            </div>
          )}

          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="relative block w-full rounded-t-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Email"
                aria-label="Email"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="relative block w-full rounded-b-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Password"
                aria-label="Password"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <a
                href={signUpUrl}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Sign Up Form Component
 */
function TestSignUpForm({ locale }: { path: string; locale: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate email format
      if (!email || !email.includes('@')) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // Validate password
      if (!password || password.length < 8) {
        setError('Password must be at least 8 characters');
        setIsLoading(false);
        return;
      }

      // Validate password confirmation
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      // Check if email already exists
      for (const user of users.values()) {
        if (user.email === email) {
          setError('An account with this email already exists');
          setIsLoading(false);
          return;
        }
      }

      // Create user
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const newUser: TestUser = {
        id: userId,
        email,
        password, // In real app, this would be hashed!
        firstName: null,
        lastName: null,
        imageUrl: null,
      };
      users.set(userId, newUser);

      // Create session
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      sessions.set(sessionId, userId);

      // Set cookie via API route
      const response = await fetch('/api/test-auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to set session cookie');
      }

      // Redirect to dashboard
      const dashboardUrl = locale !== routing.defaultLocale
        ? `/${locale}/dashboard`
        : '/dashboard';
      window.location.href = dashboardUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign up');
      setIsLoading(false);
    }
  };

  const signInUrl = locale !== routing.defaultLocale
    ? `/${locale}/sign-in`
    : '/sign-in';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Test Mode Authentication
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div
              role="alert"
              className="rounded-md bg-red-50 p-4 text-sm text-red-800"
            >
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Email"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Password (min 8 characters)"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Confirm password"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a
                href={signInUrl}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Sign Out Button Component
 */
function TestSignOutButton({ children }: { children: React.ReactNode }) {
  const handleSignOut = async () => {
    try {
      // Clear session cookie via API route
      await fetch('/api/test-auth/signout', {
        method: 'POST',
      });

      // Redirect to home page
      window.location.href = '/';
    } catch (err) {
      authLogger.error('Test auth sign out error', { error: err });
    }
  };

  return (
    <button type="button" onClick={handleSignOut}>
      {children}
    </button>
  );
}

/**
 * User Profile Component
 */
function TestUserProfile() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data on mount
  // Note: In a real implementation, this would use server components
  // For test mode, we keep it simple
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/test-auth/user');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (err) {
        authLogger.error('Test auth failed to fetch user', { error: err });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            User Profile
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Test Mode Authentication
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">User ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {user.id}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {user.email}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">First Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {user.firstName || 'Not set'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Last Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {user.lastName || 'Not set'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
