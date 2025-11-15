import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/libs/auth';
import { authLogger } from '@/libs/Logger';

/**
 * API endpoint to get current authenticated user
 * Used by auth provider UI components
 */
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 },
      );
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    });
  } catch (error) {
    authLogger.error('Error fetching user', { error });
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 },
    );
  }
}
