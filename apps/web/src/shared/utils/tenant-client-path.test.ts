import { describe, expect, it } from 'vitest';
import { resolveTenantClientPath } from './tenant-client-path';
import type { TenantClientContext } from './tenant-client-path';

describe('resolveTenantClientPath', () => {
  const sharedContext: TenantClientContext = {
    slug: 'public',
    locale: 'en',
    domain: null,
  };

  it('returns root path unchanged for default tenant on shared domain', () => {
    expect(resolveTenantClientPath('/', { context: sharedContext })).toBe('/');
  });

  it('prefixes locale for non-default languages', () => {
    expect(resolveTenantClientPath('/', { context: sharedContext, locale: 'fr' })).toBe('/fr');
    expect(resolveTenantClientPath('/pricing', { context: sharedContext, locale: 'fr' })).toBe('/fr/pricing');
  });

  it('prefixes slug for shared-domain tenants', () => {
    const context: TenantClientContext = { slug: 'acme', locale: 'en', domain: null };
    expect(resolveTenantClientPath('/', { context })).toBe('/acme');
    expect(resolveTenantClientPath('/pricing', { context })).toBe('/acme/pricing');
  });

  it('preserves both slug and locale ordering', () => {
    const context: TenantClientContext = { slug: 'acme', locale: 'en', domain: null };
    expect(resolveTenantClientPath('/pricing', { context, locale: 'fr' })).toBe('/acme/fr/pricing');
  });

  it('skips slug prefix for custom domains', () => {
    const context: TenantClientContext = { slug: 'acme', locale: 'en', domain: 'acme.example.com' };
    expect(resolveTenantClientPath('/pricing', { context })).toBe('/pricing');
  });
});
