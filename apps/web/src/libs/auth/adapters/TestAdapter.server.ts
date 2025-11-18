import type { NextRequest } from 'next/server';
import type { AuthMiddlewareConfig } from '../types';

/**
 * Test user interface
 */
export type TestUser = {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
};

/**
 * Session cookie name for test authentication
 * The cookie value will be the user ID directly (no separate session Map needed)
 */
export const SESSION_COOKIE = 'test-auth-session';

/**
 * In-memory user storage (server-side only)
 * This is shared between middleware and API routes
 */
export const users = new Map<string, TestUser>();

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

    // Parse user data from cookie (stored as JSON)
    const cookieValue = request.cookies.get(SESSION_COOKIE)?.value;

    if (!cookieValue) {
      const locale
        = request.nextUrl.pathname.match(/(\/.*)\/dashboard/)?.at(1) ?? '';
      const signInUrl = new URL(`${locale}${config.signInUrl}`, request.url);
      return Response.redirect(signInUrl.toString(), 302);
    }

    try {
      JSON.parse(cookieValue);
      return null; // Continue to next middleware
    } catch {
      const locale
        = request.nextUrl.pathname.match(/(\/.*)\/dashboard/)?.at(1) ?? '';
      const signInUrl = new URL(`${locale}${config.signInUrl}`, request.url);
      return Response.redirect(signInUrl.toString(), 302);
    }
  };
}
