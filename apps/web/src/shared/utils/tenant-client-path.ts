import { routing } from '@/libs/I18nRouting';
import {
  DEFAULT_TENANT_SLUG,
  TENANT_DOMAIN_COOKIE,
  TENANT_LOCALE_COOKIE,
  TENANT_SLUG_COOKIE,
} from '@/shared/constants/tenant';

export type TenantClientContext = {
  slug: string;
  locale: string;
  domain: string | null;
};

const readCookie = (name: string) => {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookieMatch = document.cookie
    .split(';')
    .map(entry => entry.trim())
    .find(entry => entry.startsWith(`${name}=`));

  if (!cookieMatch) {
    return null;
  }

  return decodeURIComponent(cookieMatch.split('=').slice(1).join('='));
};

const getClientContext = (): TenantClientContext => {
  if (typeof document === 'undefined') {
    return {
      slug: DEFAULT_TENANT_SLUG,
      locale: routing.defaultLocale,
      domain: null,
    };
  }

  return {
    slug: readCookie(TENANT_SLUG_COOKIE) ?? DEFAULT_TENANT_SLUG,
    locale: readCookie(TENANT_LOCALE_COOKIE) ?? routing.defaultLocale,
    domain: readCookie(TENANT_DOMAIN_COOKIE),
  };
};

const normalizePath = (path: string) => {
  if (!path || path === '/') {
    return '/';
  }

  return path.startsWith('/') ? path : `/${path}`;
};

const buildLocalizedPath = (path: string, locale: string) => {
  if (locale === routing.defaultLocale) {
    return path;
  }

  if (path === '/') {
    return `/${locale}`;
  }

  return `/${locale}${path}`;
};

type TenantPathOptions = {
  locale?: string;
  context?: TenantClientContext;
};

export const resolveTenantClientPath = (path: string, options?: TenantPathOptions) => {
  const context = options?.context ?? getClientContext();
  const normalizedPath = normalizePath(path);
  const locale = options?.locale ?? context.locale;
  const localizedPath = buildLocalizedPath(normalizedPath, locale);

  const shouldPrefixSlug = context.slug
    && context.slug !== DEFAULT_TENANT_SLUG
    && !context.domain;

  if (!shouldPrefixSlug) {
    return localizedPath;
  }

  if (localizedPath === '/') {
    return `/${context.slug}`;
  }

  return `/${context.slug}${localizedPath}`;
};
