/**
 * Session Fingerprinting
 *
 * Detects session hijacking by tracking device/browser fingerprints
 * and monitoring for suspicious changes
 */

import crypto from 'node:crypto';

export type SessionFingerprint = {
  hash: string;
  userAgent: string;
  acceptLanguage: string;
  createdAt: number;
};

type FingerprintValidationResult = {
  valid: boolean;
  reason?: string;
  suspiciousActivity?: boolean;
};

/**
 * Generate session fingerprint from request headers
 */
export function generateSessionFingerprint(request: Request): SessionFingerprint {
  const userAgent = request.headers.get('user-agent') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  const acceptEncoding = request.headers.get('accept-encoding') || '';

  // Create hash of semi-stable browser characteristics
  const fingerprintData = [userAgent, acceptLanguage, acceptEncoding].join('|');

  const hash = crypto
    .createHash('sha256')
    .update(fingerprintData)
    .digest('base64url');

  return {
    hash,
    userAgent,
    acceptLanguage,
    createdAt: Date.now(),
  };
}

/**
 * Validate session fingerprint against stored fingerprint
 *
 * Detects potential session hijacking by comparing fingerprints
 */
export function validateSessionFingerprint(
  current: SessionFingerprint,
  stored: SessionFingerprint,
): FingerprintValidationResult {
  // Exact match - all good
  if (current.hash === stored.hash) {
    return { valid: true };
  }

  // Check for suspicious changes

  // 1. Complete user agent change (different browser/OS)
  const userAgentChanged
    = !current.userAgent.includes(extractBrowserFamily(stored.userAgent))
      || !current.userAgent.includes(extractOSFamily(stored.userAgent));

  if (userAgentChanged) {
    return {
      valid: false,
      reason: 'User agent changed significantly',
      suspiciousActivity: true,
    };
  }

  // 2. Language changed dramatically (possible geolocation change)
  const storedLang = stored.acceptLanguage.split(',')[0];
  const currentLang = current.acceptLanguage.split(',')[0];

  if (storedLang !== currentLang) {
    return {
      valid: false,
      reason: 'Accept-Language changed',
      suspiciousActivity: true,
    };
  }

  // 3. Minor user agent changes (version updates) - allow but log
  return {
    valid: true,
    reason: 'Minor fingerprint changes detected',
  };
}

/**
 * Extract browser family from user agent
 */
function extractBrowserFamily(userAgent: string): string {
  if (userAgent.includes('Chrome')) {
    return 'Chrome';
  }
  if (userAgent.includes('Firefox')) {
    return 'Firefox';
  }
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    return 'Safari';
  }
  if (userAgent.includes('Edge')) {
    return 'Edge';
  }
  if (userAgent.includes('Opera')) {
    return 'Opera';
  }
  return 'Unknown';
}

/**
 * Extract OS family from user agent
 */
function extractOSFamily(userAgent: string): string {
  if (userAgent.includes('Windows')) {
    return 'Windows';
  }
  if (userAgent.includes('Mac OS')) {
    return 'MacOS';
  }
  if (userAgent.includes('Linux')) {
    return 'Linux';
  }
  if (userAgent.includes('Android')) {
    return 'Android';
  }
  if (userAgent.includes('iOS') || userAgent.includes('iPhone')) {
    return 'iOS';
  }
  return 'Unknown';
}

/**
 * Serialize fingerprint for storage
 */
export function serializeFingerprint(
  fingerprint: SessionFingerprint,
): string {
  return JSON.stringify(fingerprint);
}

/**
 * Deserialize fingerprint from storage
 */
export function deserializeFingerprint(data: string): SessionFingerprint {
  return JSON.parse(data);
}

/**
 * Check if fingerprint should be refreshed
 * Refresh every 7 days to account for legitimate changes
 */
export function shouldRefreshFingerprint(
  fingerprint: SessionFingerprint,
): boolean {
  const REFRESH_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days
  return Date.now() - fingerprint.createdAt > REFRESH_INTERVAL;
}
