/**
 * Authentication Rate Limiting
 *
 * Implements rate limiting for auth endpoints to prevent brute force attacks
 * Uses sliding window algorithm with Redis or in-memory fallback
 */

export type RateLimitConfig = {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
};

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
  blocked: boolean;
};

/**
 * Default rate limit configurations for authentication endpoints
 *
 * Naming: PascalCase for complex config objects
 */
export const AuthRateLimits = {
  // Sign-in attempts: 5 attempts per 15 minutes
  signIn: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
    blockDurationMs: 60 * 60 * 1000, // 1 hour block
  },

  // Sign-up attempts: 3 attempts per hour
  signUp: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000,
    blockDurationMs: 24 * 60 * 60 * 1000, // 24 hour block
  },

  // Password reset: 3 attempts per hour
  passwordReset: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000,
    blockDurationMs: 2 * 60 * 60 * 1000, // 2 hour block
  },

  // MFA verification: 5 attempts per 10 minutes
  mfaVerify: {
    maxAttempts: 5,
    windowMs: 10 * 60 * 1000,
    blockDurationMs: 30 * 60 * 1000, // 30 minute block
  },

  // OAuth callback: 10 attempts per minute
  oauthCallback: {
    maxAttempts: 10,
    windowMs: 60 * 1000,
    blockDurationMs: 5 * 60 * 1000, // 5 minute block
  },
} as const;

/**
 * In-memory rate limit store (fallback when Redis is not available)
 * For production, use Redis with persistence
 */
class InMemoryRateLimitStore {
  private store = new Map<
    string,
    { attempts: number[]; blockedUntil: number | null }
  >();

  async increment(
    key: string,
    config: RateLimitConfig,
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const record = this.store.get(key) || { attempts: [], blockedUntil: null };

    // Check if currently blocked
    if (record.blockedUntil && now < record.blockedUntil) {
      return {
        success: false,
        remaining: 0,
        resetAt: record.blockedUntil,
        blocked: true,
      };
    }

    // Remove expired attempts (outside window)
    const windowStart = now - config.windowMs;
    record.attempts = record.attempts.filter(time => time > windowStart);

    // Add current attempt
    record.attempts.push(now);

    // Check if limit exceeded
    if (record.attempts.length > config.maxAttempts) {
      record.blockedUntil = now + config.blockDurationMs;
      this.store.set(key, record);

      return {
        success: false,
        remaining: 0,
        resetAt: record.blockedUntil,
        blocked: true,
      };
    }

    // Update store
    this.store.set(key, record);

    return {
      success: true,
      remaining: config.maxAttempts - record.attempts.length,
      resetAt: now + config.windowMs,
      blocked: false,
    };
  }

  async reset(key: string): Promise<void> {
    this.store.delete(key);
  }

  // Cleanup old entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      const hasRecentAttempts = record.attempts.some(
        time => now - time < 24 * 60 * 60 * 1000,
      );
      const isBlocked = record.blockedUntil && now < record.blockedUntil;

      if (!hasRecentAttempts && !isBlocked) {
        this.store.delete(key);
      }
    }
  }
}

// Global store instance
const rateLimitStore = new InMemoryRateLimitStore();

// Cleanup every hour
setInterval(() => rateLimitStore.cleanup(), 60 * 60 * 1000);

/**
 * Check rate limit for an auth operation
 *
 * @param identifier - Unique identifier (email, IP, user ID)
 * @param operation - Type of auth operation
 * @returns Rate limit result
 */
export async function checkAuthRateLimit(
  identifier: string,
  operation: keyof typeof AuthRateLimits,
): Promise<RateLimitResult> {
  const config = AuthRateLimits[operation];
  const key = `auth:${operation}:${identifier}`;

  return rateLimitStore.increment(key, config);
}

/**
 * Get client identifier from request
 * Uses combination of IP and user agent for fingerprinting
 */
export function getClientIdentifier(request: Request): string {
  // Get IP address (supports various proxy headers)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  const ip
    = cfConnectingIp || realIp || forwarded?.split(',')[0] || 'unknown';

  // Get user agent for additional fingerprinting
  const userAgent = request.headers.get('user-agent') || 'unknown';

  // Create hash of IP + UA
  return `${ip}:${hashString(userAgent)}`;
}

/**
 * Simple string hash function
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Format rate limit error message
 */
export function formatRateLimitError(result: RateLimitResult): string {
  const minutes = Math.ceil((result.resetAt - Date.now()) / 60000);

  return `Too many attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`;
}

/**
 * Rate limit headers for API responses
 *
 * @param result - Rate limit result with remaining attempts
 * @param operation - Type of operation being rate limited
 * @returns Headers to include in API response
 */
export function getRateLimitHeaders(
  result: RateLimitResult,
  operation: keyof typeof AuthRateLimits = 'signIn',
): HeadersInit {
  return {
    'X-RateLimit-Limit': AuthRateLimits[operation].maxAttempts.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetAt).toISOString(),
    ...(result.blocked && {
      'Retry-After': Math.ceil((result.resetAt - Date.now()) / 1000).toString(),
    }),
  };
}
