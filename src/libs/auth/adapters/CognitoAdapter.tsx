import type { NextRequest } from 'next/server';
import type { AuthMiddlewareConfig, AuthSession, AuthUser, IAuthAdapter } from '../types';
import { configureAmplify, getCognitoConfig } from './cognito/amplify-config';
import { extractCognitoTokenFromCookies, parseCognitoIssuer, verifyCognitoToken } from './cognito/jwt-utils';
import { CognitoSignIn } from './cognito/SignIn';
import { CognitoSignUp } from './cognito/SignUp';
import { CognitoUserProfile } from './cognito/UserProfile';
import { cognitoUserToAuthUser } from './cognito/utils';
import { resolveTenantClientPath } from '@/shared/utils/tenant-client-path';
import { decodeJWT } from '../security/jwt-verifier';
import { authLogger } from '@/libs/Logger';

/**
 * AWS Cognito Authentication Adapter
 * Implements the IAuthAdapter interface using AWS Cognito
 *
 * Features:
 * - OAuth2 social sign-in (Google, Facebook, Apple)
 * - MFA support (TOTP and SMS)
 * - Cognito Hosted UI
 * - JWT token validation
 *
 * Prerequisites:
 * 1. Install: npm install aws-amplify
 * 2. Configure environment variables (see .env)
 * 3. Set up Cognito User Pool in AWS Console
 */
export class CognitoAdapter implements IAuthAdapter {
  constructor() {
    // Configure Amplify on initialization
    if (typeof window !== 'undefined') {
      configureAmplify();
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      // Dynamically import to avoid SSR issues
      const { getCurrentUser: getAmplifyUser, fetchUserAttributes } = await import('aws-amplify/auth');

      const cognitoUser = await getAmplifyUser();
      const attributes = await fetchUserAttributes();

      return cognitoUserToAuthUser({
        userId: cognitoUser.userId,
        username: cognitoUser.username,
        attributes,
      });
    } catch {
      // User not authenticated
      return null;
    }
  }

  async getSession(): Promise<AuthSession | null> {
    try {
      const { fetchAuthSession } = await import('aws-amplify/auth');

      const session = await fetchAuthSession();

      if (!session.tokens) {
        return null;
      }

      return {
        userId: session.tokens.idToken?.payload.sub as string || '',
        sessionId: session.tokens.accessToken?.toString() || '',
      };
    } catch {
      return null;
    }
  }

  async signOut(): Promise<void> {
    try {
      const { signOut } = await import('aws-amplify/auth');
      await signOut();
    } catch (error) {
      authLogger.error('Failed to sign out', { error });
    }
  }

  async protectRoute(
    _request: NextRequest,
    config: AuthMiddlewareConfig,
  ): Promise<{ isAuthenticated: boolean; redirectUrl?: string }> {
    // Cognito tokens are stored in cookies/localStorage
    // For middleware, we'd need to verify JWT tokens server-side
    // This is a simplified version - in production, verify JWT signature

    try {
      const { fetchAuthSession } = await import('aws-amplify/auth');
      const session = await fetchAuthSession();

      return {
        isAuthenticated: !!session.tokens,
        redirectUrl: session.tokens ? undefined : config.signInUrl,
      };
    } catch {
      return {
        isAuthenticated: false,
        redirectUrl: config.signInUrl,
      };
    }
  }

  renderProvider(props: { children: React.ReactNode; locale: string }): React.ReactElement {
    // Cognito doesn't need a provider wrapper like Clerk
    // Amplify is configured globally
    return <>{props.children}</>;
  }

  renderSignIn(props: { path: string; locale: string }): React.ReactElement {
    // Use custom Cognito sign-in component
    return <CognitoSignIn path={props.path} locale={props.locale} />;
  }

  renderSignUp(props: { path: string; locale: string }): React.ReactElement {
    // Use custom Cognito sign-up component
    return <CognitoSignUp path={props.path} locale={props.locale} />;
  }

  renderSignOutButton(props: { children: React.ReactNode }): React.ReactElement {
    const handleSignOut = async () => {
      try {
        const { signOut } = await import('aws-amplify/auth');
        await signOut();

        // Redirect to home page
        if (typeof window !== 'undefined') {
          window.location.href = resolveTenantClientPath('/');
        }
      } catch (error) {
        console.error('Failed to sign out:', error);
      }
    };

    return (
      <button type="button" onClick={handleSignOut}>
        {props.children}
      </button>
    );
  }

  renderUserProfile(props: { path: string }): React.ReactElement {
    // Use custom Cognito user profile component
    return <CognitoUserProfile path={props.path} />;
  }

  /**
   * Cognito-specific middleware wrapper
   */
  static createMiddleware(config: AuthMiddlewareConfig) {
    return async (request: NextRequest) => {
      // Check if this is a protected route
      const isProtectedRoute = config.protectedRoutes.some(route =>
        request.nextUrl.pathname.includes(route),
      );

      if (!isProtectedRoute) {
        return null; // Continue to next middleware
      }

      // Check for Cognito tokens in cookies
      // Cognito uses cookies: CognitoIdentityServiceProvider.{clientId}.{username}.{tokenType}
      const cookieHeader = request.headers.get('cookie');

      if (!cookieHeader) {
        // No cookies, redirect to sign-in
        const cognitoConfig = getCognitoConfig();
        if (cognitoConfig.oauth) {
          // Use hosted UI
          const { getHostedUIUrl } = await import('./cognito/amplify-config');
          const hostedUIUrl = getHostedUIUrl();
          return Response.redirect(hostedUIUrl, 302);
        }

        // Fallback to app sign-in page
        return Response.redirect(new URL(config.signInUrl, request.url), 302);
      }

      // Extract and verify ID token
      const idToken = extractCognitoTokenFromCookies(cookieHeader, 'idToken');

      if (!idToken) {
        // No valid session, redirect to sign-in
        const cognitoConfig = getCognitoConfig();
        if (cognitoConfig.oauth) {
          const { getHostedUIUrl } = await import('./cognito/amplify-config');
          const hostedUIUrl = getHostedUIUrl();
          return Response.redirect(hostedUIUrl, 302);
        }

        return Response.redirect(new URL(config.signInUrl, request.url), 302);
      }

      // Decode token to get issuer (region and user pool ID)
      const decoded = decodeJWT(idToken);
      if (!decoded?.payload.iss) {
        console.warn('Invalid Cognito token: missing issuer');
        const cognitoConfig = getCognitoConfig();
        if (cognitoConfig.oauth) {
          const { getHostedUIUrl } = await import('./cognito/amplify-config');
          const hostedUIUrl = getHostedUIUrl();
          return Response.redirect(hostedUIUrl, 302);
        }

        return Response.redirect(new URL(config.signInUrl, request.url), 302);
      }

      // Parse region and user pool ID from issuer
      const cognitoInfo = parseCognitoIssuer(decoded.payload.iss as string);
      if (!cognitoInfo) {
        console.warn('Failed to parse Cognito issuer');
        return Response.redirect(new URL(config.signInUrl, request.url), 302);
      }

      // Verify JWT signature with Cognito's public keys
      const payload = await verifyCognitoToken(
        idToken,
        cognitoInfo.region,
        cognitoInfo.userPoolId,
        decoded.payload.aud as string | undefined,
      );

      if (!payload) {
        // JWT verification failed - redirect to sign-in
        console.warn('Cognito JWT verification failed');
        const cognitoConfig = getCognitoConfig();
        if (cognitoConfig.oauth) {
          const { getHostedUIUrl } = await import('./cognito/amplify-config');
          const hostedUIUrl = getHostedUIUrl();
          return Response.redirect(hostedUIUrl, 302);
        }

        return Response.redirect(new URL(config.signInUrl, request.url), 302);
      }

      return null; // Continue to next middleware
    };
  }
}
