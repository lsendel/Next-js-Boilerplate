/**
 * Cloudflare Access Utilities
 * Helper functions for working with Cloudflare Access
 */

import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/libs/auth/security/jwt-verifier';
import { securityLogger } from '@/libs/Logger';

export type CloudflareAccessJWT = {
  aud: string[]; // Audience (your application's audience tag)
  email: string; // User's email
  type: string; // Token type
  iat: number; // Issued at
  exp: number; // Expiration
  sub: string; // Subject (user ID)
  country?: string; // User's country
  custom?: Record<string, unknown>; // Custom claims
};

/**
 * Check if request is authenticated by Cloudflare Access
 */
export function isCloudflareAuthenticated(request: NextRequest): boolean {
  const email = request.headers.get('Cf-Access-Authenticated-User-Email');
  return email !== null;
}

/**
 * Get Cloudflare Access JWT token from request
 */
export function getCloudflareAccessToken(request: NextRequest): string | null {
  // Cloudflare Access JWT is typically in the CF_Authorization cookie
  const cookieHeader = request.headers.get('cookie');

  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(';').map(c => c.trim());
  const cfAuthCookie = cookies.find(c => c.startsWith('CF_Authorization='));

  if (!cfAuthCookie) {
    return null;
  }

  const token = cfAuthCookie.split('=')[1];
  return token || null;
}

/**
 * Verify Cloudflare Access JWT token with signature verification
 *
 * This implementation uses Web Crypto API to verify JWT signatures:
 * 1. Fetches Cloudflare's public keys from their JWKS endpoint
 * 2. Verifies the signature using the public key
 * 3. Validates the audience, issuer, and expiration
 *
 * See: https://developers.cloudflare.com/cloudflare-one/identity/authorization-cookie/validating-json/
 */
export async function verifyCloudflareAccessToken(
  token: string,
  teamDomain: string,
  audience: string,
): Promise<CloudflareAccessJWT | null> {
  try {
    // Cloudflare Access JWKS endpoint
    const jwksUrl = `${teamDomain}/cdn-cgi/access/certs`;

    // Verify JWT with signature validation
    const payload = await verifyJWT(token, jwksUrl, {
      audience,
      clockTolerance: 60, // 60 seconds clock skew tolerance
    });

    if (!payload) {
      return null;
    }

    // Validate required Cloudflare Access fields
    if (!payload.email || !payload.exp) {
      securityLogger.warn('Cloudflare Access token missing required fields', { hasEmail: !!payload.email, hasExp: !!payload.exp });
      return null;
    }

    return payload as CloudflareAccessJWT;
  } catch (error) {
    securityLogger.error('Failed to verify Cloudflare Access token', { error });
    return null;
  }
}

/**
 * Get Cloudflare Access logout URL
 */
export function getCloudflareLogoutUrl(teamDomain: string, redirectUrl?: string): string {
  const logoutUrl = `${teamDomain}/cdn-cgi/access/logout`;

  if (redirectUrl) {
    return `${logoutUrl}?redirect_url=${encodeURIComponent(redirectUrl)}`;
  }

  return logoutUrl;
}

/**
 * Get Cloudflare Access login URL
 */
export function getCloudflareLoginUrl(teamDomain: string, redirectUrl?: string): string {
  const loginUrl = `${teamDomain}/cdn-cgi/access/login`;

  if (redirectUrl) {
    return `${loginUrl}?redirect_url=${encodeURIComponent(redirectUrl)}`;
  }

  return loginUrl;
}
