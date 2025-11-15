import type { NextFetchEvent, NextRequest } from 'next/server';
import type { ArcjetBotCategory, ArcjetWellKnownBot } from '@arcjet/next';
import { detectBot, tokenBucket } from '@arcjet/next';
import { createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import arcjet from '@/libs/Arcjet';
import { executeAuthMiddleware } from '@/libs/auth/middleware';
import { applySecurityHeaders, handleCorsPreflight } from '@/middleware/layers/security';
import { applyTenantContextToResponse, resolveTenantContext } from '@/middleware/utils/tenant';
import {
  TENANT_LOCALE_HEADER,
  TENANT_SLUG_HEADER,
  TENANT_SOURCE_HEADER,
} from '@/shared/constants/tenant';
import { routing } from './libs/I18nRouting';

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/:locale/dashboard(.*)',
]);

const isAuthPage = createRouteMatcher([
  '/sign-in(.*)',
  '/:locale/sign-in(.*)',
  '/sign-up(.*)',
  '/:locale/sign-up(.*)',
]);

const resolveArcjetMode = () => {
  if (process.env.ARCJET_MODE === 'LIVE' || process.env.ARCJET_MODE === 'DRY_RUN') {
    return process.env.ARCJET_MODE;
  }

  return process.env.NODE_ENV === 'production' ? 'LIVE' : 'DRY_RUN';
};

const parseCommaSeparatedEnv = (value?: string, fallback: string[] = []) => {
  if (!value) {
    return fallback;
  }

  return value
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean);
};

const arcjetMode = resolveArcjetMode();
const allowedBots = parseCommaSeparatedEnv(process.env.ARCJET_ALLOWED_BOTS, [
  'CATEGORY:SEARCH_ENGINE',
  'CATEGORY:PREVIEW',
  'CATEGORY:MONITOR',
]) as Array<ArcjetWellKnownBot | ArcjetBotCategory>;

// Improve security with Arcjet
const aj = arcjet.withRule(
  detectBot({
    mode: arcjetMode,
    allow: allowedBots,
  }),
);

const apiInterval = process.env.ARCJET_API_INTERVAL ?? '60s';

const parseIntervalToSeconds = (interval: string) => {
  const trimmed = interval.trim();
  const match = trimmed.match(/^(\d+)([smhd]?)$/i);

  if (!match) {
    return Number.parseInt(trimmed, 10) || 60;
  }

  const value = Number.parseInt(match[1]!, 10);
  const unit = match[2]?.toLowerCase();

  switch (unit) {
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 60 * 60 * 24;
    case 's':
    default:
      return value;
  }
};

const apiLimiter = arcjet.withRule(
  tokenBucket({
    mode: arcjetMode,
    refillRate: Number.parseInt(process.env.ARCJET_API_REFILL_RATE ?? '60', 10),
    interval: apiInterval,
    capacity: Number.parseInt(process.env.ARCJET_API_CAPACITY ?? '120', 10),
  }),
);

const configuredRetryAfter = process.env.ARCJET_API_RETRY_AFTER
  ? Number.parseInt(process.env.ARCJET_API_RETRY_AFTER, 10)
  : undefined;

const retryAfterSeconds = Number.isFinite(configuredRetryAfter ?? Number.NaN)
  ? Number(configuredRetryAfter)
  : parseIntervalToSeconds(apiInterval);

const isStateChangingMethod = (method: string) => {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
};

const isApiRequest = (pathname: string) => {
  return pathname === '/api'
    || pathname.startsWith('/api/')
    || pathname.includes('/api/');
};

// Currently, with database connections, Webpack is faster than Turbopack in production environment at runtime.
// Then, unfortunately, Webpack doesn't support `proxy.ts` on Vercel yet, here is the error: "Error: ENOENT: no such file or directory, lstat '/vercel/path0/.next/server/proxy.js'"
export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  // Resolve tenant context once and reuse
  const tenantContext = await resolveTenantContext(request);

  const preflightResponse = handleCorsPreflight(request);

  if (preflightResponse) {
    return applyTenantContextToResponse(preflightResponse, request, tenantContext);
  }

  if (tenantContext.rewriteApplied) {
    request.nextUrl.pathname = tenantContext.normalizedPathname;
  }

  request.headers.set(TENANT_SLUG_HEADER, tenantContext.tenant.slug);
  request.headers.set(TENANT_LOCALE_HEADER, tenantContext.locale);
  request.headers.set(TENANT_SOURCE_HEADER, tenantContext.source);

  const finalizeResponse = (response: NextResponse) => {
    const withTenant = applyTenantContextToResponse(response, request, tenantContext);
    return applySecurityHeaders(request, withTenant);
  };

  // Verify the request with Arcjet
  // Use `process.env` instead of Env to reduce bundle size in middleware
  if (process.env.ARCJET_KEY) {
    const userAgent = request.headers.get('user-agent') || '';

    const decision = await aj.protect(request, {
      'header.user-agent': userAgent,
    });

    if (decision.isDenied()) {
      return finalizeResponse(
        NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
      );
    }

    if (isApiRequest(request.nextUrl.pathname) && isStateChangingMethod(request.method)) {
      const rateLimitDecision = await apiLimiter.protect(request, {
        'header.user-agent': userAgent,
        'requested': 1,
      });

      if (rateLimitDecision.isDenied()) {
        return finalizeResponse(
          NextResponse.json(
            { error: 'Too many requests' },
            {
              status: 429,
              headers: {
                'Retry-After': retryAfterSeconds.toString(),
              },
            },
          ),
        );
      }
    }
  }

  // Auth middleware - works with multiple providers
  if (isAuthPage(request) || isProtectedRoute(request)) {
    const authResponse = await executeAuthMiddleware(request, event, {
      protectedRoutes: ['/dashboard'],
      publicRoutes: ['/'],
      signInUrl: '/sign-in',
      signUpUrl: '/sign-up',
      afterSignInUrl: '/dashboard',
      afterSignUpUrl: '/dashboard',
      afterSignOutUrl: '/',
    });

    if (authResponse) {
      const response = authResponse instanceof NextResponse
        ? authResponse
        : new NextResponse(authResponse.body, {
            status: authResponse.status,
            statusText: authResponse.statusText,
            headers: authResponse.headers,
          });

      return finalizeResponse(response);
    }

    return finalizeResponse(handleI18nRouting(request));
  }

  return finalizeResponse(handleI18nRouting(request));
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/_next`, `/_vercel`, `api` or `monitoring`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|_next|_vercel|monitoring|.*\\..*).*)',
  runtime: 'nodejs',
};
