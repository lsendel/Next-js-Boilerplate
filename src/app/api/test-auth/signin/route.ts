import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, sessions, users } from '@/libs/auth/adapters/TestAdapter.server';
import { authLogger } from '@/libs/Logger';

/**
 * API endpoint to handle user authentication for test authentication
 * This is only used when NEXT_PUBLIC_AUTH_PROVIDER=test
 */
export async function POST(request: NextRequest) {
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
      user = {
        id: userId,
        email,
        password, // Not hashed - this is test mode only!
        firstName: null,
        lastName: null,
        imageUrl: null,
      };
      users.set(userId, user);
      authLogger.info('Test auth: Auto-created user during sign-in', { userId, email });
    } else if (user.password !== password) {
      // User exists but password doesn't match
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      );
    }

    // Create session
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    sessions.set(sessionId, user.id);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    authLogger.info('Test auth: User signed in', { userId: user.id, email });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      },
    });
  } catch (error) {
    authLogger.error('Error during sign in', { error });
    return NextResponse.json(
      { error: 'Failed to sign in' },
      { status: 500 },
    );
  }
}
