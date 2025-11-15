export const DEFAULT_TENANT_SLUG = process.env.MULTI_TENANT_DEFAULT_SLUG ?? 'public';
export const TENANT_CACHE_TTL_MS = Number(process.env.TENANT_CACHE_TTL_MS ?? 60000);

export const TENANT_SLUG_COOKIE = 'tenant_slug';
export const TENANT_LOCALE_COOKIE = 'tenant_locale';
export const TENANT_DOMAIN_COOKIE = 'tenant_domain';

export const TENANT_SLUG_HEADER = 'x-tenant-slug';
export const TENANT_LOCALE_HEADER = 'x-tenant-locale';
export const TENANT_SOURCE_HEADER = 'x-tenant-source';
export const TENANT_DOMAIN_HEADER = 'x-tenant-domain';

export type TenantResolutionSource = 'domain' | 'path' | 'cookie' | 'default';
