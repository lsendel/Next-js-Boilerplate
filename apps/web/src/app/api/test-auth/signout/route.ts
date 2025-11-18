import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authLogger } from '@/libs/Logger';
import { SESSION_COOKIE } from '@/libs/auth/adapters/TestAdapter.server';
import { guardTestAuthRequest } from '@/libs/auth/utils/test-mode';

/**
 * API endpoint to clear session cookie for test authentication
 * This is only used when NEXT_PUBLIC_AUTH_PROVIDER=test
 */
export async function POST() {
  const guardResponse = guardTestAuthRequest();
  if (guardResponse) {
    return guardResponse;
  }

  try {
    // Clear session cookie
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);

    return NextResponse.json({ success: true });
  } catch (error) {
    authLogger.error('Error clearing session cookie', { error });
    return NextResponse.json(
      { error: 'Failed to clear session cookie' },
      { status: 500 },
    );
  }
}
