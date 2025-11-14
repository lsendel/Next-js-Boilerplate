/**
 * AWS Cognito JWT Verification Utilities
 */

import { verifyJWT } from '@/libs/auth/security/jwt-verifier';

export type CognitoJWTPayload = {
  'sub': string; // User ID
  'email'?: string;
  'email_verified'?: boolean;
  'cognito:username'?: string;
  'cognito:groups'?: string[];
  'token_use': 'id' | 'access';
  'auth_time': number;
  'iat': number;
  'exp': number;
  'iss': string; // Issuer (Cognito User Pool URL)
  'aud'?: string; // Client ID
  [key: string]: unknown;
};

/**
 * Verify AWS Cognito JWT token with signature verification
 *
 * Cognito uses RS256 algorithm and publishes public keys at:
 * https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
 *
 * @param token - The JWT token to verify
 * @param region - AWS region (e.g., 'us-east-1')
 * @param userPoolId - Cognito User Pool ID
 * @param clientId - Optional App Client ID for audience validation
 * @returns The verified JWT payload or null if verification fails
 */
export async function verifyCognitoToken(
  token: string,
  region: string,
  userPoolId: string,
  clientId?: string,
): Promise<CognitoJWTPayload | null> {
  try {
    // Construct Cognito JWKS URL
    const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

    // Expected issuer
    const expectedIssuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

    // Verify JWT with signature validation
    const payload = await verifyJWT(token, jwksUrl, {
      audience: clientId,
      issuer: expectedIssuer,
      clockTolerance: 60, // 60 seconds clock skew tolerance
    });

    if (!payload) {
      return null;
    }

    // Validate Cognito-specific fields
    if (!payload.token_use || !['id', 'access'].includes(payload.token_use as string)) {
      console.warn('Invalid Cognito token_use claim');
      return null;
    }

    if (!payload.sub) {
      console.warn('Missing sub claim in Cognito token');
      return null;
    }

    return payload as CognitoJWTPayload;
  } catch (error) {
    console.error('Failed to verify Cognito token:', error);
    return null;
  }
}

/**
 * Extract Cognito configuration from environment or token
 */
export function parseCognitoIssuer(issuer: string): {
  region: string;
  userPoolId: string;
} | null {
  try {
    // Format: https://cognito-idp.{region}.amazonaws.com/{userPoolId}
    const match = issuer.match(/https:\/\/cognito-idp\.([^.]+)\.amazonaws\.com\/([^/]+)/);

    if (!match || !match[1] || !match[2]) {
      return null;
    }

    return {
      region: match[1],
      userPoolId: match[2],
    };
  } catch {
    return null;
  }
}

/**
 * Extract token from Cognito cookies
 * Cognito cookies follow the pattern: CognitoIdentityServiceProvider.{clientId}.{username}.{tokenType}
 */
export function extractCognitoTokenFromCookies(
  cookieHeader: string,
  tokenType: 'idToken' | 'accessToken' = 'idToken',
): string | null {
  try {
    const cookies = cookieHeader.split(';').map(c => c.trim());

    // Find the cookie containing the token type
    const tokenCookie = cookies.find(c =>
      c.includes(`CognitoIdentityServiceProvider`) && c.includes(tokenType),
    );

    if (!tokenCookie) {
      return null;
    }

    const token = tokenCookie.split('=')[1];
    return token || null;
  } catch {
    return null;
  }
}
