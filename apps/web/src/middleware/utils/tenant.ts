import type { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { routing } from '@/libs/I18nRouting';
import { db } from '@/server/db/DB';
import { tenantDomains, tenants } from '@/server/db/models/Schema';
import {
  DEFAULT_TENANT_SLUG,
  TENANT_CACHE_TTL_MS,
  TENANT_DOMAIN_COOKIE,
  TENANT_DOMAIN_HEADER,
  TENANT_LOCALE_COOKIE,
  TENANT_LOCALE_HEADER,
  TENANT_SLUG_COOKIE,
  TENANT_SLUG_HEADER,
  TENANT_SOURCE_HEADER,
} from '@/shared/constants/tenant';
import type { TenantResolutionSource } from '@/shared/constants/tenant';

type TenantRecord = {
  id?: number;
  slug: string;
  defaultLocale: string;
  status?: string;
};

type CacheEntry = {
  value: TenantRecord | null;
  expiresAt: number;
};

export type TenantResolution = {
  tenant: TenantRecord;
  locale: string;
  normalizedPathname: string;
  rewriteApplied: boolean;
  source: TenantResolutionSource;
  domainMatched?: string;
  slugMatchedFromPath?: boolean;
  localeMatchedFromPath?: boolean;
};

const globalObject = globalThis as unknown as {
  __tenant_cache__?: Map<string, CacheEntry>;
};

const tenantCache = globalObject.__tenant_cache__ ?? new Map<string, CacheEntry>();
if (!globalObject.__tenant_cache__) {
  globalObject.__tenant_cache__ = tenantCache;
}

const makeCacheKey = (type: 'slug' | 'domain', value: string) => {
  return `${type}:${value.toLowerCase()}`;
};

const getCachedTenant = (key: string) => {
  const cached = tenantCache.get(key);
  if (!cached) {
    return undefined;
  }

  if (cached.expiresAt < Date.now()) {
    tenantCache.delete(key);
    return undefined;
  }

  return cached.value;
};

const setCachedTenant = (key: string, value: TenantRecord | null) => {
  tenantCache.set(key, {
    value,
    expiresAt: Date.now() + TENANT_CACHE_TTL_MS,
  });
};

const mapTenantRecord = (record: typeof tenants.$inferSelect): TenantRecord => {
  return {
    id: record.id,
    slug: record.slug,
    defaultLocale: record.defaultLocale ?? routing.defaultLocale,
    status: record.status,
  };
};

const getTenantBySlug = async (slug: string) => {
  const normalized = slug.toLowerCase();
  const cacheKey = makeCacheKey('slug', normalized);
  const cached = getCachedTenant(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  try {
    const result = await db.query.tenants.findFirst({
      where: eq(tenants.slug, normalized),
    });

    const tenant = result ? mapTenantRecord(result) : null;
    setCachedTenant(cacheKey, tenant);

    return tenant;
  } catch (error: any) {
    // Gracefully handle missing tenant tables (e.g., during migrations or in test environments)
    // Check both error.code and error.cause.code for PostgreSQL error codes
    if (error.code === '42P01' || error.cause?.code === '42P01') {
      // PostgreSQL error code for "relation does not exist"
      // Return null - default tenant will be used
      return null;
    }
    // Re-throw other errors
    throw error;
  }
};

const getTenantByDomain = async (domain: string) => {
  const normalized = domain.toLowerCase();
  const cacheKey = makeCacheKey('domain', normalized);
  const cached = getCachedTenant(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  try {
    const result = await db.query.tenantDomains.findFirst({
      where: eq(tenantDomains.domain, normalized),
      with: {
        tenant: true,
      },
    });

    const tenant = result?.tenant ? mapTenantRecord(result.tenant) : null;
    setCachedTenant(cacheKey, tenant);

    if (tenant) {
      setCachedTenant(makeCacheKey('slug', tenant.slug), tenant);
    }

    return tenant;
  } catch (error: any) {
    // Gracefully handle missing tenant tables (e.g., during migrations or in test environments)
    // Check both error.code and error.cause.code for PostgreSQL error codes
    if (error.code === '42P01' || error.cause?.code === '42P01') {
      // PostgreSQL error code for "relation does not exist"
      // Return null - default tenant will be used
      return null;
    }
    // Re-throw other errors
    throw error;
  }
};

const createDefaultTenant = (): TenantRecord => ({
  slug: DEFAULT_TENANT_SLUG,
  defaultLocale: routing.defaultLocale,
  status: 'active',
});

const splitPathname = (pathname: string) => {
  return pathname.split('/').filter(Boolean);
};

const buildLocalizedPath = (segments: string[], locale: string) => {
  const rest = segments.filter(Boolean).join('/');

  if (locale === routing.defaultLocale) {
    return rest ? `/${rest}` : '/';
  }

  return rest ? `/${locale}/${rest}` : `/${locale}`;
};

const getDomainFromHost = (hostHeader: string | null) => {
  if (!hostHeader) {
    return null;
  }

  return hostHeader.split(':')[0]?.toLowerCase() ?? null;
};

const resolveTenantFromPath = async (segments: string[]) => {
  const [candidate, ...rest] = segments;
  if (!candidate) {
    return null;
  }

  const tenant = await getTenantBySlug(candidate);
  if (!tenant) {
    return null;
  }

  return {
    tenant,
    remainingSegments: rest,
  };
};

export const resolveTenantContext = async (request: NextRequest): Promise<TenantResolution> => {
  const originalPath = request.nextUrl.pathname || '/';
  const segments = splitPathname(originalPath);
  const cookieSlug = request.cookies.get(TENANT_SLUG_COOKIE)?.value;
  const cookieLocale = request.cookies.get(TENANT_LOCALE_COOKIE)?.value;

  let tenant: TenantRecord | null = null;
  let source: TenantResolutionSource = 'default';
  let domainMatched: string | undefined;
  let slugMatchedFromPath = false;

  if (cookieSlug) {
    const cookieTenant = await getTenantBySlug(cookieSlug);
    if (cookieTenant) {
      tenant = cookieTenant;
      source = 'cookie';
    }
  }

  const domain = getDomainFromHost(request.headers.get('host'));
  if (domain) {
    const domainTenant = await getTenantByDomain(domain);
    if (domainTenant) {
      tenant = domainTenant;
      source = 'domain';
      domainMatched = domain;
    }
  }

  let workingSegments = [...segments];
  if (source !== 'domain') {
    const pathTenant = await resolveTenantFromPath(segments);
    if (pathTenant) {
      tenant = pathTenant.tenant;
      workingSegments = pathTenant.remainingSegments;
      source = 'path';
      slugMatchedFromPath = true;
    }
  }

  if (!tenant) {
    tenant = createDefaultTenant();
  }

  let locale = tenant.defaultLocale ?? routing.defaultLocale;
  let localeMatchedFromPath = false;
  let postLocaleSegments = [...workingSegments];
  const possibleLocale = workingSegments[0];
  if (possibleLocale && routing.locales.includes(possibleLocale)) {
    locale = possibleLocale;
    localeMatchedFromPath = true;
    postLocaleSegments = workingSegments.slice(1);
  } else if (cookieLocale && routing.locales.includes(cookieLocale)) {
    locale = cookieLocale;
  }

  const normalizedPathname = buildLocalizedPath(postLocaleSegments, locale);
  const rewriteApplied = normalizedPathname !== originalPath;

  return {
    tenant,
    locale,
    normalizedPathname,
    rewriteApplied,
    source,
    domainMatched,
    slugMatchedFromPath,
    localeMatchedFromPath,
  };
};

export const applyTenantContextToResponse = (
  response: NextResponse,
  request: NextRequest,
  context: TenantResolution,
) => {
  response.headers.set(TENANT_SLUG_HEADER, context.tenant.slug);
  response.headers.set(TENANT_LOCALE_HEADER, context.locale);
  response.headers.set(TENANT_SOURCE_HEADER, context.source);

  if (context.domainMatched) {
    response.headers.set(TENANT_DOMAIN_HEADER, context.domainMatched);
  }

  const secureCookie = process.env.NODE_ENV === 'production';
  const slugCookie = request.cookies.get(TENANT_SLUG_COOKIE)?.value;
  if (slugCookie !== context.tenant.slug) {
    response.cookies.set(TENANT_SLUG_COOKIE, context.tenant.slug, {
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
      secure: secureCookie,
    });
  }

  const localeCookie = request.cookies.get(TENANT_LOCALE_COOKIE)?.value;
  if (localeCookie !== context.locale) {
    response.cookies.set(TENANT_LOCALE_COOKIE, context.locale, {
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
      secure: secureCookie,
    });
  }

  const domainCookie = request.cookies.get(TENANT_DOMAIN_COOKIE)?.value;
  if (context.domainMatched) {
    if (domainCookie !== context.domainMatched) {
      response.cookies.set(TENANT_DOMAIN_COOKIE, context.domainMatched, {
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
        secure: secureCookie,
      });
    }
  } else if (domainCookie) {
    response.cookies.delete(TENANT_DOMAIN_COOKIE);
  }

  return response;
};
