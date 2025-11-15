import type { NextRequest } from 'next/server';
import type { AuthMiddlewareConfig } from '../types';

/**
 * Test user interface
 */
export type TestUser = {
  id: string;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
};

/**
 * Session cookie name for test authentication
 */
export const SESSION_COOKIE = 'test-auth-session';

/**
 * In-memory user storage (server-side only)
 * This is shared between middleware and API routes
 */
export const users = new Map<string, TestUser>();

/**
 * In-memory session storage (server-side only)
 * This is shared between middleware and API routes
 */
export const sessions = new Map<string, string>(); // sessionId -> userId

/**
 * Test Authentication Middleware
 * Server-side only - handles route protection
 *
 * WARNING: This is for testing purposes only!
 */
export function createTestMiddleware(config: AuthMiddlewareConfig) {
  return async (request: NextRequest) => {
    const isProtectedRoute = config.protectedRoutes.some(route =>
      request.nextUrl.pathname.includes(route),
    );

    if (!isProtectedRoute) {
      return null; // Continue to next middleware
    }

    const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
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
