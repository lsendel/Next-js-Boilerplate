import type { NextRequest } from 'next/server';

/**
 * Auth Provider Types
 * These types define the contract that all auth providers must implement
 */

export type AuthProvider = 'clerk' | 'cloudflare' | 'cognito' | 'test';

export type AuthUser = {
  id: string;
  email: string | null;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
};

export type AuthSession = {
  userId: string;
  sessionId: string;
};

export type SignInResult = {
  success: boolean;
  redirectUrl?: string;
  error?: string;
};

export type AuthMiddlewareConfig = {
  protectedRoutes: string[];
  publicRoutes: string[];
  signInUrl: string;
  signUpUrl: string;
  afterSignInUrl: string;
  afterSignUpUrl: string;
  afterSignOutUrl: string;
};

/**
 * Core Auth Adapter Interface
 * All auth providers must implement this interface
 */
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

/**
 * Auth Configuration
 */
export type AuthConfig = {
  provider: AuthProvider;
  // Clerk specific
  clerk?: {
    publishableKey: string;
    secretKey: string;
  };
  // Cloudflare specific
  cloudflare?: {
    teamDomain: string;
    audience: string;
  };
  // AWS Cognito specific
  cognito?: {
    region: string;
    userPoolId: string;
    clientId: string;
  };
};
