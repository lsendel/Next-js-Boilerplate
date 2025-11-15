import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, sessions, users } from '@/libs/auth/adapters/TestAdapter.server';
import { authLogger } from '@/libs/Logger';

/**
 * API endpoint to get current user for test authentication
 * This is only used when NEXT_PUBLIC_AUTH_PROVIDER=test
 */
export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 },
      );
    }

    const userId = sessions.get(sessionId);
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 },
      );
    }

    const user = users.get(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      );
    }

    // Return user without password
    return NextResponse.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    });
  } catch (error) {
    authLogger.error('Error getting user', { error });
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 },
    );
  }
}
