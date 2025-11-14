/**
 * CSRF Token API Endpoint
 *
 * Provides CSRF tokens for client-side auth operations
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getCsrfTokenForClient } from '@/libs/auth/security/csrf';

/**
 * GET /api/auth/csrf
 *
 * Returns a CSRF token for the current session
 */
export async function GET(_request: NextRequest) {
  try {
    const token = await getCsrfTokenForClient();

    return NextResponse.json(
      { csrfToken: token },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
        },
      },
    );
  } catch {
    return NextResponse.json(
      {
        error: 'Failed to generate CSRF token',
        code: 'CSRF_TOKEN_GENERATION_FAILED',
      },
      { status: 500 },
    );
  }
}
