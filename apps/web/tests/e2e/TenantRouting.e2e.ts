import { expect, test } from '@playwright/test';

const config = {
  sharedHost: process.env.E2E_SHARED_HOST || 'http://localhost:3000',
  customHost: process.env.E2E_CUSTOM_HOST,
  slug: process.env.E2E_TENANT_SLUG || 'acme',
  defaultLocale: process.env.E2E_TENANT_DEFAULT_LOCALE || 'en',
  mode: (process.env.E2E_TENANT_MODE || 'shared').toLowerCase(),
};

const shouldRunShared = config.mode === 'shared' || config.mode === 'both';
const shouldRunCustom = config.mode === 'custom' || config.mode === 'both';

const buildSharedTenantUrl = (base: string, slug: string, locale: string, path = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const localeSegment = locale === config.defaultLocale ? '' : `/${locale}`;
  return `${base}/${slug}${localeSegment}${normalizedPath === '/' ? '' : normalizedPath}`;
};

const buildCustomTenantUrl = (base: string, locale: string, path = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const localeSegment = locale === config.defaultLocale ? '' : `/${locale}`;
  return `${base}${localeSegment}${normalizedPath === '/' ? '' : normalizedPath}`;
};

test.describe('Tenant routing', () => {
  const sharedTest = shouldRunShared ? test : test.skip;
  sharedTest('shared-domain slug + locale rewrites nav links', async ({ page }) => {
    const url = buildSharedTenantUrl(config.sharedHost, config.slug, 'fr', '/pricing');
    await page.goto(url, { waitUntil: 'networkidle' });

    await page.waitForSelector(`a[href="/${config.slug}/fr/features"]`);
    const pricingCta = page.locator(`a[href="/${config.slug}/fr/pricing"]`);
    await expect(pricingCta).toHaveCount(1);

    const cookies = await page.context().cookies();
    const slugCookie = cookies.find(cookie => cookie.name === 'tenant_slug');
    const localeCookie = cookies.find(cookie => cookie.name === 'tenant_locale');

    expect(slugCookie?.value).toBe(config.slug);
    expect(localeCookie?.value).toBe('fr');
  });

  const customTest = shouldRunCustom ? test : test.skip;
  customTest('custom-domain routing omits slug but keeps locale', async ({ browser }) => {
    test.skip(!config.customHost, 'E2E_CUSTOM_HOST must be set for custom-domain routing tests');

    const context = await browser.newContext();
    const page = await context.newPage();
    const url = buildCustomTenantUrl(config.customHost!, 'fr', '/pricing');
    await page.goto(url, { waitUntil: 'networkidle' });

    await page.waitForSelector('a[href="/fr/features"]');
    await expect(page.locator('a[href="/fr/pricing"]')).toHaveCount(1);

    const cookies = await context.cookies();
    const slugCookie = cookies.find(cookie => cookie.name === 'tenant_slug');
    const domainCookie = cookies.find(cookie => cookie.name === 'tenant_domain');

    expect(slugCookie?.value).toBe(config.slug);
    expect(domainCookie?.value).toContain(new URL(config.customHost!).hostname);
  });
});
