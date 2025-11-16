import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/libs/auth/adapters/TestAdapter.server';
import { authLogger } from '@/libs/Logger';

/**
 * API endpoint to get current user for test authentication
 * This is only used when NEXT_PUBLIC_AUTH_PROVIDER=test
 */
export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(SESSION_COOKIE)?.value;

    if (!cookieValue) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 },
      );
    }

    try {
      // Parse user data from JSON cookie
      const userData = JSON.parse(cookieValue);

      // Return user data (password not stored in cookie)
      return NextResponse.json({
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        imageUrl: userData.imageUrl,
      });
    } catch (parseError) {
      authLogger.error('Error parsing user cookie', { error: parseError });
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 },
      );
    }
  } catch (error) {
    authLogger.error('Error getting user', { error });
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 },
    );
  }
}
