/**
 * Password Validation API Endpoint
 *
 * Validates password strength and checks for breaches
 * Protected by rate limiting and CSRF
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyCsrfToken } from '@/libs/auth/security/csrf';
import {
  getPasswordValidationMessage,
  validatePassword,
} from '@/libs/auth/security/password-breach';
import {
  checkAuthRateLimit,
  formatRateLimitError,
  getClientIdentifier,
  getRateLimitHeaders,
} from '@/libs/auth/security/rate-limit';
import { securityLogger } from '@/libs/Logger';

/**
 * POST /api/auth/validate-password
 *
 * Request body: { password: string }
 * Response: { valid: boolean, score: number, message?: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify CSRF token
    const csrfValid = await verifyCsrfToken(request);
    if (!csrfValid) {
      return NextResponse.json(
        { error: 'Invalid CSRF token', code: 'CSRF_TOKEN_INVALID' },
        { status: 403 },
      );
    }

    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimit = await checkAuthRateLimit(clientId, 'signUp');

    if (rateLimit.blocked) {
      return NextResponse.json(
        {
          error: formatRateLimitError(rateLimit),
          code: 'RATE_LIMIT_EXCEEDED',
        },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimit),
        },
      );
    }

    // Parse request body
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required', code: 'INVALID_REQUEST' },
        { status: 400 },
      );
    }

    // Validate password
    const result = await validatePassword(password);
    const message = getPasswordValidationMessage(
      result.strength,
      result.breach,
    );

    return NextResponse.json(
      {
        valid: result.valid,
        score: result.strength.score,
        message,
        feedback: result.strength.feedback,
        breached: result.breach.breached,
        occurrences: result.breach.occurrences,
      },
      {
        status: 200,
        headers: getRateLimitHeaders(rateLimit),
      },
    );
  } catch (error) {
    securityLogger.error('Password validation error', { error });
    return NextResponse.json(
      {
        error: 'Password validation failed',
        code: 'VALIDATION_ERROR',
      },
      { status: 500 },
    );
  }
}
