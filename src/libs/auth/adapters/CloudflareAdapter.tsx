import type { NextRequest } from 'next/server';
import type { AuthMiddlewareConfig, AuthSession, AuthUser, IAuthAdapter } from '../types';
import { headers } from 'next/headers';
import { CloudflareUserProfile } from './cloudflare/UserProfile';
import {
  getCloudflareAccessToken,
  getCloudflareLoginUrl,
  getCloudflareLogoutUrl,
  isCloudflareAuthenticated,
  verifyCloudflareAccessToken,
} from './cloudflare/utils';
import { resolveTenantClientPath } from '@/shared/utils/tenant-client-path';
import { authLogger } from '@/libs/Logger';

/**
 * Cloudflare Access Authentication Adapter
 * Implements the IAuthAdapter interface using Cloudflare Access
 *
 * Note: Cloudflare Access authenticates users at the edge before they reach your app.
 * User information is passed via request headers.
 *
 * For full JWT verification, you need to:
 * 1. Set NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN in your .env
 * 2. Set NEXT_PUBLIC_CLOUDFLARE_AUDIENCE (your application's audience tag)
 * 3. Optionally enable JWT verification in middleware
 */
export class CloudflareAdapter implements IAuthAdapter {
  private getTeamDomain(): string {
    return process.env.NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN || '';
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const headersList = await headers();

    // Cloudflare Access passes user info via headers
    const email = headersList.get('Cf-Access-Authenticated-User-Email');
    const userId = headersList.get('Cf-Access-Authenticated-User-Id');

    if (!email) {
      return null;
    }

    return {
      id: userId || email,
      email,
      // Cloudflare Access doesn't provide name/image by default
      // You can extend this by storing user profiles in your database
      firstName: null,
      lastName: null,
      imageUrl: null,
    };
  }

  async getSession(): Promise<AuthSession | null> {
    const user = await this.getCurrentUser();

    if (!user) {
      return null;
    }

    return {
      userId: user.id,
      sessionId: user.id, // Cloudflare manages sessions
    };
  }

  async signOut(): Promise<void> {
    // Cloudflare Access sign-out is handled by redirecting to:
    // https://<your-team-domain>.cloudflareaccess.com/cdn-cgi/access/logout
    // This needs to be handled client-side
  }

  async protectRoute(
    request: NextRequest,
    config: AuthMiddlewareConfig,
  ): Promise<{ isAuthenticated: boolean; redirectUrl?: string }> {
    // Cloudflare Access handles protection at the edge
    // If the request reaches here, the user is already authenticated
    const email = request.headers.get('Cf-Access-Authenticated-User-Email');

    return {
      isAuthenticated: !!email,
      redirectUrl: email ? undefined : config.signInUrl,
    };
  }

  renderProvider(props: { children: React.ReactNode; locale: string }): React.ReactElement {
    // Cloudflare Access doesn't need a provider wrapper
    // Return a simple fragment
    return <>{props.children}</>;
  }

  renderSignIn(_props: { path: string; locale: string }): React.ReactElement {
    const teamDomain = this.getTeamDomain();
    const loginUrl = teamDomain
      ? getCloudflareLoginUrl(teamDomain, typeof window !== 'undefined' ? window.location.href : undefined)
      : '/';

    // Auto-redirect on mount
    if (typeof window !== 'undefined' && teamDomain) {
      window.location.href = loginUrl;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
          <div className="mb-6">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Redirecting to Cloudflare Access
            </h1>
            <p className="text-gray-600">
              Please wait while we redirect you to the login page...
            </p>
          </div>

          {teamDomain && (
            <div className="mt-6 border-t pt-6">
              <p className="mb-3 text-sm text-gray-500">
                If you are not redirected automatically:
              </p>
              <a
                href={loginUrl}
                className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Click here to sign in
              </a>
            </div>
          )}

          {!teamDomain && (
            <div className="mt-6 rounded-lg bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">
                Configuration Error
              </p>
              <p className="mt-1 text-sm text-red-600">
                NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN is not configured
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  renderSignUp(props: { path: string; locale: string }): React.ReactElement {
    // Cloudflare Access doesn't have separate sign-up
    // Use the same sign-in flow
    return this.renderSignIn(props);
  }

  renderSignOutButton(props: { children: React.ReactNode }): React.ReactElement {
    const teamDomain = this.getTeamDomain();

    const handleSignOut = () => {
      if (!teamDomain) {
        authLogger.error('NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN not configured');
        return;
      }

      if (typeof window === 'undefined') {
        return;
      }

      const tenantHomePath = resolveTenantClientPath('/');
      const redirectTarget = new URL(
        tenantHomePath === '/' ? '' : tenantHomePath,
        window.location.origin,
      ).toString();

      const logoutUrl = getCloudflareLogoutUrl(teamDomain, redirectTarget);
      window.location.href = logoutUrl;
    };

    return (
      <button type="button" onClick={handleSignOut}>
        {props.children}
      </button>
    );
  }

  renderUserProfile(_props: { path: string }): React.ReactElement {
    return <CloudflareUserProfile />;
  }

  /**
   * Cloudflare-specific middleware wrapper
   */
  static createMiddleware(config: AuthMiddlewareConfig) {
    return async (request: NextRequest) => {
      const teamDomain = process.env.NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN;
      const audience = process.env.NEXT_PUBLIC_CLOUDFLARE_AUDIENCE;
      const verifyJWT = process.env.NEXT_PUBLIC_CLOUDFLARE_VERIFY_JWT === 'true';

      // Check if this is a protected route
      const isProtectedRoute = config.protectedRoutes.some(route =>
        request.nextUrl.pathname.includes(route),
      );

      if (!isProtectedRoute) {
        return null; // Continue to next middleware
      }

      // Check if user is authenticated via headers
      const isAuthenticated = isCloudflareAuthenticated(request);

      if (!isAuthenticated) {
        // Redirect to Cloudflare Access login
        if (teamDomain) {
          const loginUrl = getCloudflareLoginUrl(teamDomain, request.url);
          return Response.redirect(loginUrl, 302);
        }

        // Fallback if domain not configured
        return Response.json(
          { error: 'Authentication required. Please configure NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN.' },
          { status: 401 },
        );
      }

      // Optional: Verify JWT token
      if (verifyJWT && teamDomain) {
        const token = getCloudflareAccessToken(request);

        if (token) {
          const payload = await verifyCloudflareAccessToken(
            token,
            teamDomain,
            audience || '',
          );

          if (!payload) {
            // JWT verification failed
            authLogger.warn('Cloudflare Access JWT verification failed');
            const loginUrl = getCloudflareLoginUrl(teamDomain, request.url);
            return Response.redirect(loginUrl, 302);
          }

          // Token is valid, continue
        } else {
          authLogger.warn('Cloudflare Access JWT token not found');
        }
      }

      return null; // Continue to next middleware
    };
  }
}
