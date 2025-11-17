import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE, users } from '@/libs/auth/adapters/TestAdapter.server';
import { authLogger } from '@/libs/Logger';

/**
 * API endpoint to handle user registration for test authentication
 * This is only used when NEXT_PUBLIC_AUTH_PROVIDER=test
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, confirmPassword } = body;

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

    // Validate password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 },
      );
    }

    // Check if email already exists
    for (const user of users.values()) {
      if (user.email === email) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 },
        );
      }
    }

    // Create user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const newUser = {
      id: userId,
      email,
      password, // In real app, this would be hashed!
      firstName: null,
      lastName: null,
      imageUrl: null,
    };
    users.set(userId, newUser);

    authLogger.info('Test auth: User registered', { userId, email });

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        email,
        firstName: null,
        lastName: null,
        imageUrl: null,
      },
    });

    // Store user data directly in cookie as JSON (no shared in-memory state needed)
    const cookieData = JSON.stringify({
      id: userId,
      email,
      firstName: null,
      lastName: null,
      imageUrl: null,
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
    authLogger.error('Error during sign up', { error });
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 },
    );
  }
}
