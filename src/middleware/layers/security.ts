import type { MiddlewareFunction } from '../types';
import type { NextRequest, NextResponse as NextResponseType } from 'next/server';
import { NextResponse } from 'next/server';

const parseOrigin = (value?: string | null) => {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.origin;
  } catch {
    return null;
  }
};

const appendIfValue = (set: Set<string>, value?: string | null) => {
  if (value) {
    set.add(value);
  }
};

const buildContentSecurityPolicy = () => {
  const scriptSrc = new Set<string>(['\'self\'', '\'unsafe-inline\'']);
  const styleSrc = new Set<string>(['\'self\'', '\'unsafe-inline\'']);
  const imgSrc = new Set<string>(['\'self\'', 'data:', 'blob:']);
  const fontSrc = new Set<string>(['\'self\'', 'data:']);
  const connectSrc = new Set<string>(['\'self\'', 'wss:']);
  const frameSrc = new Set<string>(['\'self\'']);

  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    const clerkDomains = [
      'https://clerk.com',
      'https://clerkstage.dev',
      'https://*.clerk.com',
      'https://*.clerkstage.dev',
    ];
    clerkDomains.forEach((domain) => {
      scriptSrc.add(domain);
      connectSrc.add(domain);
      frameSrc.add(domain);
    });
  }

  const sentryOrigin = parseOrigin(process.env.NEXT_PUBLIC_SENTRY_DSN);
  appendIfValue(connectSrc, sentryOrigin);

  const posthogOrigin = parseOrigin(process.env.NEXT_PUBLIC_POSTHOG_HOST);
  appendIfValue(connectSrc, posthogOrigin);
  appendIfValue(scriptSrc, posthogOrigin);

  const directives = new Map<string, Set<string>>([
    ['default-src', new Set(['\'self\''])],
    ['script-src', scriptSrc],
    ['style-src', styleSrc],
    ['img-src', imgSrc],
    ['font-src', fontSrc],
    ['connect-src', connectSrc],
    ['frame-src', frameSrc],
    ['frame-ancestors', new Set(['\'none\''])],
    ['base-uri', new Set(['\'self\''])],
    ['form-action', new Set(['\'self\''])],
    ['object-src', new Set(['\'none\''])],
  ]);

  return Array.from(directives.entries())
    .map(([directive, sources]) => `${directive} ${Array.from(sources).join(' ')}`)
    .join('; ');
};

export const applySecurityHeaders = (
  request: NextRequest,
  response: NextResponseType,
) => {
  const headers = response.headers;

  headers.set('Content-Security-Policy', buildContentSecurityPolicy());
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Permissions-Policy', [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()',
  ].join(', '));

  if (process.env.NODE_ENV === 'production') {
    headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload',
    );
  }

  const allowOrigin = process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || '*';

  if (request.nextUrl.pathname.includes('/api/')) {
    headers.set('Access-Control-Allow-Credentials', 'true');
    headers.set('Access-Control-Allow-Origin', allowOrigin);
    headers.set('Vary', 'Origin');
    headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    );
    headers.set(
      'Access-Control-Allow-Headers',
      'X-Requested-With, Content-Type, Authorization, X-CSRF-Token',
    );
  }

  return response;
};

export const handleCorsPreflight = (request: NextRequest) => {
  if (request.method !== 'OPTIONS' || !request.nextUrl.pathname.includes('/api/')) {
    return null;
  }

  const response = new NextResponse(null, { status: 204 });

  return applySecurityHeaders(request, response);
};

/**
 * Security Middleware Layer
 *
 * Adds security headers and protections following OWASP best practices.
 */
export const securityMiddleware: MiddlewareFunction = async (request) => {
  const preflightResponse = handleCorsPreflight(request);

  if (preflightResponse) {
    return preflightResponse;
  }

  const response = NextResponse.next();

  return applySecurityHeaders(request, response);
};
