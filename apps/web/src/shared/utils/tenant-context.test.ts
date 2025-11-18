import { describe, expect, it } from 'vitest';
import { routing } from '@/libs/I18nRouting';
import type { TenantRuntimeContext } from './tenant-context';
import { buildTenantPath } from './tenant-context';

const baseContext: TenantRuntimeContext = {
  slug: 'acme',
  locale: routing.defaultLocale,
  source: 'path',
  domain: null,
};

describe('buildTenantPath (multi-tenant)', () => {
  it('prefixes slug for non-default tenant on shared domain', () => {
    const path = buildTenantPath('/pricing', 'en', baseContext);
    expect(path).toBe('/acme/pricing');
  });

  it('does not prefix slug for default tenant', () => {
    const context: TenantRuntimeContext = {
      ...baseContext,
      slug: 'public',
    };

    const path = buildTenantPath('/pricing', 'en', context);
    expect(path).toBe('/pricing');
  });

  it('does not prefix slug when request is domain-based', () => {
    const context: TenantRuntimeContext = {
      ...baseContext,
      domain: 'acme.test',
      source: 'domain',
    };

    const path = buildTenantPath('/pricing', 'en', context);
    expect(path).toBe('/pricing');
  });

  it('handles non-default locale without double slash', () => {
    const path = buildTenantPath('/pricing', 'fr', baseContext);
    expect(path).toBe('/acme/fr/pricing');
  });

  it('normalizes root path correctly for slug + locale', () => {
    const path = buildTenantPath('/', 'fr', baseContext);
    expect(path).toBe('/acme/fr');
  });
});

