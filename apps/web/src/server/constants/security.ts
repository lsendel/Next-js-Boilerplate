/**
 * Security Constants
 *
 * Centralized security configuration values used across the application.
 * These constants ensure consistency and make security policies easy to update.
 */

/**
 * Authentication security configuration
 */
export const AUTH_SECURITY = {
  /** Maximum number of failed login attempts before account lockout */
  MAX_LOGIN_ATTEMPTS: 5,

  /** Duration of account lockout in milliseconds (15 minutes) */
  LOCKOUT_DURATION_MS: 15 * 60 * 1000,

  /** Password reset token expiry time in milliseconds (15 minutes) */
  PASSWORD_RESET_TOKEN_EXPIRY_MS: 15 * 60 * 1000,

  /** Number of bcrypt salt rounds for password hashing (OWASP recommended) */
  BCRYPT_SALT_ROUNDS: 12,

  /** Minimum password length */
  MIN_PASSWORD_LENGTH: 8,

  /** Maximum password length */
  MAX_PASSWORD_LENGTH: 128,
} as const;

/**
 * Session configuration
 */
export const SESSION_CONFIG = {
  /** Default session expiry in days */
  DEFAULT_EXPIRY_DAYS: 30,

  /** Length of session token in bytes */
  TOKEN_LENGTH_BYTES: 32,

  /** Cookie name for session token */
  COOKIE_NAME: 'session_token',

  /**
   * Calculate session expiry date
   * @param days - Number of days until expiry (defaults to 30)
   * @returns Date object representing expiry time
   */
  getExpiryDate: (days = 30): Date =>
    new Date(Date.now() + days * 24 * 60 * 60 * 1000),

  /**
   * Calculate milliseconds from days
   * @param days - Number of days
   * @returns Milliseconds
   */
  daysToMs: (days: number): number => days * 24 * 60 * 60 * 1000,
} as const;

/**
 * Rate limiting configuration
 */
export const RATE_LIMIT = {
  /** Maximum sign-in attempts per time window */
  SIGNIN_MAX_ATTEMPTS: 5,

  /** Sign-in rate limit window in minutes */
  SIGNIN_WINDOW_MINUTES: 15,

  /** Maximum sign-up attempts per time window */
  SIGNUP_MAX_ATTEMPTS: 3,

  /** Sign-up rate limit window in minutes */
  SIGNUP_WINDOW_MINUTES: 60,

  /** Maximum password reset attempts per time window */
  PASSWORD_RESET_MAX_ATTEMPTS: 3,

  /** Password reset rate limit window in minutes */
  PASSWORD_RESET_WINDOW_MINUTES: 60,

  /** Maximum MFA attempts per time window */
  MFA_MAX_ATTEMPTS: 5,

  /** MFA rate limit window in minutes */
  MFA_WINDOW_MINUTES: 10,
} as const;

/**
 * CSRF protection configuration
 */
export const CSRF_CONFIG = {
  /** CSRF token cookie name with __Host- prefix for security */
  TOKEN_NAME: '__Host-csrf-token',

  /** CSRF token expiry in milliseconds (24 hours) */
  TOKEN_EXPIRY_MS: 24 * 60 * 60 * 1000,

  /** CSRF token length in bytes */
  TOKEN_LENGTH_BYTES: 32,
} as const;

/**
 * Token generation configuration
 */
export const TOKEN_CONFIG = {
  /** Default token length in bytes */
  DEFAULT_LENGTH_BYTES: 32,

  /** Email verification token expiry (24 hours) */
  EMAIL_VERIFICATION_EXPIRY_MS: 24 * 60 * 60 * 1000,

  /** API token expiry (90 days) */
  API_TOKEN_EXPIRY_MS: 90 * 24 * 60 * 60 * 1000,
} as const;

/**
 * Helper function to convert minutes to milliseconds
 */
export const minutesToMs = (minutes: number): number => minutes * 60 * 1000;

/**
 * Helper function to convert hours to milliseconds
 */
export const hoursToMs = (hours: number): number => hours * 60 * 60 * 1000;

/**
 * Helper function to convert days to milliseconds
 */
export const daysToMs = (days: number): number => days * 24 * 60 * 60 * 1000;
