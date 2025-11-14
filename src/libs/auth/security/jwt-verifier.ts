/**
 * JWT Verification Utilities
 * Provides JWT signature verification using Web Crypto API (no external dependencies)
 */

import { Buffer } from 'node:buffer';
import { securityLogger } from '@/libs/Logger';

export type JWK = {
  kid: string;
  kty: string;
  alg: string;
  use: string;
  n: string;
  e: string;
};

export type JWKS = {
  keys: JWK[];
};

export type JWTHeader = {
  alg: string;
  kid: string;
  typ?: string;
};

export type JWTPayload = {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: unknown;
};

/**
 * Decode JWT without verification (for header and payload inspection)
 */
export function decodeJWT(token: string): {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
} | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [headerPart, payloadPart, signaturePart] = parts;

    if (!headerPart || !payloadPart || !signaturePart) {
      return null;
    }

    const header = JSON.parse(
      Buffer.from(headerPart, 'base64url').toString('utf-8'),
    ) as JWTHeader;

    const payload = JSON.parse(
      Buffer.from(payloadPart, 'base64url').toString('utf-8'),
    ) as JWTPayload;

    return {
      header,
      payload,
      signature: signaturePart,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch JWKS from a URL with caching
 */
const jwksCache = new Map<string, { jwks: JWKS; expiresAt: number }>();
const CACHE_DURATION = 3600000; // 1 hour

export async function fetchJWKS(jwksUrl: string): Promise<JWKS | null> {
  try {
    // Check cache first
    const cached = jwksCache.get(jwksUrl);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.jwks;
    }

    const response = await fetch(jwksUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      securityLogger.error('Failed to fetch JWKS', { jwksUrl, status: response.status });
      return null;
    }

    const jwks = await response.json() as JWKS;

    // Cache the result
    jwksCache.set(jwksUrl, {
      jwks,
      expiresAt: Date.now() + CACHE_DURATION,
    });

    return jwks;
  } catch (error) {
    securityLogger.error('Failed to fetch JWKS', { error });
    return null;
  }
}

/**
 * Find matching JWK by kid
 */
export function findJWK(jwks: JWKS, kid: string): JWK | null {
  return jwks.keys.find(key => key.kid === kid) || null;
}

/**
 * Import JWK as CryptoKey for verification
 */
export async function importJWK(jwk: JWK): Promise<CryptoKey | null> {
  try {
    // Only support RSA keys for now (most common for JWT)
    if (jwk.kty !== 'RSA') {
      securityLogger.error('Only RSA keys are supported', { keyType: jwk.kty });
      return null;
    }

    return await crypto.subtle.importKey(
      'jwk',
      {
        kty: jwk.kty,
        n: jwk.n,
        e: jwk.e,
        alg: jwk.alg,
        ext: true,
      },
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: { name: 'SHA-256' },
      },
      false,
      ['verify'],
    );
  } catch (error) {
    securityLogger.error('Failed to import JWK', { error });
    return null;
  }
}

/**
 * Verify JWT signature using Web Crypto API
 */
export async function verifyJWTSignature(
  token: string,
  publicKey: CryptoKey,
): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const [headerPart, payloadPart, signaturePart] = parts;

    if (!headerPart || !payloadPart || !signaturePart) {
      return false;
    }

    // The signature is over the header and payload
    const signedData = `${headerPart}.${payloadPart}`;
    const signedDataBuffer = new TextEncoder().encode(signedData);

    // Decode the signature from base64url
    const signatureBuffer = Buffer.from(signaturePart, 'base64url');

    // Verify the signature
    return await crypto.subtle.verify(
      {
        name: 'RSASSA-PKCS1-v1_5',
      },
      publicKey,
      signatureBuffer,
      signedDataBuffer,
    );
  } catch (error) {
    securityLogger.error('Failed to verify JWT signature', { error });
    return false;
  }
}

/**
 * Validate JWT claims (exp, nbf, aud, iss)
 */
export function validateJWTClaims(
  payload: JWTPayload,
  options: {
    audience?: string | string[];
    issuer?: string;
    clockTolerance?: number;
  } = {},
): boolean {
  const now = Math.floor(Date.now() / 1000);
  const clockTolerance = options.clockTolerance || 0;

  // Check expiration
  if (payload.exp !== undefined) {
    if (payload.exp + clockTolerance < now) {
      securityLogger.warn('JWT expired', { exp: payload.exp, now });
      return false;
    }
  }

  // Check not before
  if (payload.nbf !== undefined) {
    if (payload.nbf - clockTolerance > now) {
      console.warn('JWT not yet valid');
      return false;
    }
  }

  // Check audience
  if (options.audience) {
    const expectedAudiences = Array.isArray(options.audience)
      ? options.audience
      : [options.audience];

    const tokenAudiences = Array.isArray(payload.aud)
      ? payload.aud
      : payload.aud
        ? [payload.aud]
        : [];

    const hasValidAudience = expectedAudiences.some(expectedAud =>
      tokenAudiences.includes(expectedAud),
    );

    if (!hasValidAudience) {
      console.warn('JWT audience mismatch');
      return false;
    }
  }

  // Check issuer
  if (options.issuer && payload.iss !== options.issuer) {
    console.warn('JWT issuer mismatch');
    return false;
  }

  return true;
}

/**
 * Complete JWT verification with signature and claims validation
 */
export async function verifyJWT(
  token: string,
  jwksUrl: string,
  options: {
    audience?: string | string[];
    issuer?: string;
    clockTolerance?: number;
  } = {},
): Promise<JWTPayload | null> {
  try {
    // Step 1: Decode the JWT
    const decoded = decodeJWT(token);
    if (!decoded) {
      console.error('Failed to decode JWT');
      return null;
    }

    // Step 2: Validate claims
    if (!validateJWTClaims(decoded.payload, options)) {
      return null;
    }

    // Step 3: Fetch JWKS
    const jwks = await fetchJWKS(jwksUrl);
    if (!jwks) {
      console.error('Failed to fetch JWKS');
      return null;
    }

    // Step 4: Find matching JWK
    const jwk = findJWK(jwks, decoded.header.kid);
    if (!jwk) {
      console.error(`No matching JWK found for kid: ${decoded.header.kid}`);
      return null;
    }

    // Step 5: Import public key
    const publicKey = await importJWK(jwk);
    if (!publicKey) {
      console.error('Failed to import public key');
      return null;
    }

    // Step 6: Verify signature
    const isValid = await verifyJWTSignature(token, publicKey);
    if (!isValid) {
      console.error('JWT signature verification failed');
      return null;
    }

    return decoded.payload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}
