import { describe, expect, it } from 'vitest';
import { routing } from '@/libs/I18nRouting';
import { getI18nPath } from './helpers';
import { buildTenantPath, type TenantRuntimeContext } from './tenant-context';

describe('Helpers', () => {
  describe('getI18nPath function', () => {
    it('should not change the path for default language', async () => {
      const url = '/random-url';
      const locale = routing.defaultLocale;

      expect(await getI18nPath(url, locale)).toBe(url);
    });

    it('should prepend the locale to the path for non-default language', async () => {
      const url = '/random-url';
      const locale = 'fr';

      expect(await getI18nPath(url, locale)).toMatch(/^\/fr/);
    });
  });

  describe('buildTenantPath', () => {
    const path = '/dashboard';
    const tenantContext: TenantRuntimeContext = {
      slug: 'acme',
      locale: 'en',
      source: 'path',
      domain: null,
    };

    it('prefixes tenant slug for default locale paths on shared domain', () => {
      expect(buildTenantPath('/', 'en', tenantContext)).toBe('/acme');
      expect(buildTenantPath(path, 'en', tenantContext)).toBe('/acme/dashboard');
    });

    it('keeps locale segment for non-default locale when slug prefixed', () => {
      expect(buildTenantPath(path, 'fr', tenantContext)).toBe('/acme/fr/dashboard');
    });

    it('does not prefix slug for custom domains', () => {
      expect(
        buildTenantPath(path, 'fr', {
          ...tenantContext,
          source: 'domain',
          domain: 'acme.example.com',
        }),
      ).toBe('/fr/dashboard');
    });
  });
});
