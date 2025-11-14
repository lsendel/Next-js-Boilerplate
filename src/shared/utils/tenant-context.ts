import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { cookies, headers } from 'next/headers';
import { routing } from '@/libs/I18nRouting';
import {
  DEFAULT_TENANT_SLUG,
  TENANT_DOMAIN_HEADER,
  TENANT_LOCALE_COOKIE,
  TENANT_LOCALE_HEADER,
  TENANT_SLUG_COOKIE,
  TENANT_SLUG_HEADER,
  TENANT_SOURCE_HEADER,
} from '@/shared/constants/tenant';
import type { TenantResolutionSource } from '@/shared/constants/tenant';

export type TenantRuntimeContext = {
  slug: string;
  locale: string;
  source: TenantResolutionSource;
  domain?: string | null;
};

const isPromise = (value: unknown): value is Promise<unknown> => {
  return typeof value === 'object'
    && value !== null
    && 'then' in value
    && typeof (value as any).then === 'function';
};

const getHeadersSafe = (): ReadonlyHeaders | null => {
  try {
    const result = headers();
    return isPromise(result) ? null : result as ReadonlyHeaders;
  } catch {
    return null;
  }
};

const getCookiesSafe = (): ReadonlyRequestCookies | null => {
  try {
    const result = cookies();
    return isPromise(result) ? null : result as ReadonlyRequestCookies;
  } catch {
    return null;
  }
};

const normalizePath = (path: string) => {
  if (!path || path === '/') {
    return '/';
  }

  return path.startsWith('/') ? path : `/${path}`;
};

const shouldPrefixSlug = (context: TenantRuntimeContext) => {
  if (!context.slug || context.slug === DEFAULT_TENANT_SLUG) {
    return false;
  }

  if (context.domain || context.source === 'domain') {
    return false;
  }

  return true;
};

const buildLocaleSegment = (normalizedPath: string, locale: string) => {
  if (locale === routing.defaultLocale) {
    return normalizedPath;
  }

  if (normalizedPath === '/') {
    return `/${locale}`;
  }

  return `/${locale}${normalizedPath}`;
};

export const getTenantRuntimeContext = (
  overrides?: Partial<TenantRuntimeContext>,
): TenantRuntimeContext => {
  const headerList = getHeadersSafe();
  const cookieStore = getCookiesSafe();

  const slug = overrides?.slug
    ?? headerList?.get(TENANT_SLUG_HEADER)
    ?? cookieStore?.get(TENANT_SLUG_COOKIE)?.value
    ?? DEFAULT_TENANT_SLUG;

  const locale = overrides?.locale
    ?? headerList?.get(TENANT_LOCALE_HEADER)
    ?? cookieStore?.get(TENANT_LOCALE_COOKIE)?.value
    ?? routing.defaultLocale;

  const source = (overrides?.source
    ?? headerList?.get(TENANT_SOURCE_HEADER)
    ?? 'default') as TenantResolutionSource;

  const domain = overrides?.domain ?? headerList?.get(TENANT_DOMAIN_HEADER);

  return {
    slug,
    locale,
    source,
    domain,
  };
};

export const buildTenantPath = (
  path: string,
  locale: string,
  context?: TenantRuntimeContext,
) => {
  const tenantContext = context ?? getTenantRuntimeContext();
  const normalizedPath = normalizePath(path);
  const localizedPath = buildLocaleSegment(normalizedPath, locale);

  if (!shouldPrefixSlug(tenantContext)) {
    return localizedPath;
  }

  if (localizedPath === '/') {
    return `/${tenantContext.slug}`;
  }

  return `/${tenantContext.slug}${localizedPath}`;
};
