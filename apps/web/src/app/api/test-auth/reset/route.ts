import { NextResponse } from 'next/server';
import { users } from '@/libs/auth/adapters/TestAdapter.server';
import { authLogger } from '@/libs/Logger';
import { guardTestAuthRequest } from '@/libs/auth/utils/test-mode';

/**
 * API endpoint to reset test authentication state
 * This clears all users from in-memory storage
 *
 * ONLY AVAILABLE IN TEST MODE (NEXT_PUBLIC_AUTH_PROVIDER=test)
 *
 * Usage: POST /api/test-auth/reset
 */
export async function POST() {
  const guardResponse = guardTestAuthRequest();
  if (guardResponse) {
    return guardResponse;
  }

  try {
    const userCount = users.size;
    users.clear();

    authLogger.info('Test auth: Storage reset', { clearedUsers: userCount });

    return NextResponse.json({
      success: true,
      message: `Cleared ${userCount} user(s) from test auth storage`,
      clearedUsers: userCount,
    });
  } catch (error) {
    authLogger.error('Error resetting test auth storage', { error });
    return NextResponse.json(
      { error: 'Failed to reset test auth storage' },
      { status: 500 },
    );
  }
}
