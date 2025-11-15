/**
 * CSRF Protection for Authentication
 *
 * Implements double-submit cookie pattern for CSRF protection
 * on state-changing auth operations
 */

import crypto from 'node:crypto';
import { cookies } from 'next/headers';

const CSRF_TOKEN_NAME = '__Host-csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_TOKEN_LENGTH = 32;

/**
 * Generate a cryptographically secure CSRF token
 */
function generateCsrfToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('base64url');
}

/**
 * Set CSRF token in cookie
 */
async function setCsrfToken(): Promise<string> {
  const token = generateCsrfToken();
  const cookieStore = await cookies();

  cookieStore.set(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return token;
}

/**
 * Get CSRF token from cookie
 */
async function getCsrfToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CSRF_TOKEN_NAME);
  return token?.value || null;
}

/**
 * Verify CSRF token from request
 *
 * Compares token from header with token from cookie (double-submit pattern)
 */
export async function verifyCsrfToken(request: Request): Promise<boolean> {
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  const cookieToken = await getCsrfToken();

  if (!headerToken || !cookieToken) {
    return false;
  }

  // Simple string comparison (constant-time comparison not needed here
  // as timing attacks are impractical for CSRF tokens)
  return headerToken === cookieToken;
}

/**
 * Get CSRF token for client-side use
 */
export async function getCsrfTokenForClient(): Promise<string> {
  let token = await getCsrfToken();

  if (!token) {
    token = await setCsrfToken();
  }

  return token;
}
