import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE, users } from '@/libs/auth/adapters/TestAdapter.server';
import { authLogger } from '@/libs/Logger';
import {
  guardTestAuthRequest,
  hashTestPassword,
  verifyTestPassword,
} from '@/libs/auth/utils/test-mode';

/**
 * API endpoint to handle user authentication for test authentication
 * This is only used when NEXT_PUBLIC_AUTH_PROVIDER=test
 */
export async function POST(request: NextRequest) {
  const guardResponse = guardTestAuthRequest();
  if (guardResponse) {
    return guardResponse;
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate email format
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 },
      );
    }

    // Validate password
    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 },
      );
    }

    // Find user by email
    let user = null;
    for (const u of users.values()) {
      if (u.email === email) {
        user = u;
        break;
      }
    }

    // If user doesn't exist, create one automatically (for E2E testing convenience)
    // This matches Clerk's test mode behavior where any credentials work
    if (!user) {
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const passwordHash = await hashTestPassword(password);
      user = {
        id: userId,
        email,
        passwordHash,
        firstName: null,
        lastName: null,
        imageUrl: null,
      };
      users.set(userId, user);
      authLogger.info('Test auth: Auto-created user during sign-in', {
        userId,
        email,
      });
    } else {
      const passwordMatches = await verifyTestPassword(
        password,
        user.passwordHash,
      );

      if (!passwordMatches) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 },
        );
      }
    }

    authLogger.info('Test auth: User signed in', { userId: user.id, email });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      },
    });

    const cookieData = JSON.stringify({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    });

    response.cookies.set(SESSION_COOKIE, cookieData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    authLogger.error('Error during sign in', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ error: 'Failed to sign in' }, { status: 500 });
  }
}
