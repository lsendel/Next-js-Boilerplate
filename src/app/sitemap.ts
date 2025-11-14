import type { MetadataRoute } from 'next';
import { routing } from '@/libs/I18nRouting';
import { getBaseUrl, getI18nPath } from '@/shared/utils/helpers';

const marketingPaths = [
  '/',
  '/about',
  '/counter',
  '/portfolio',
  '/landing',
  '/pricing',
  '/features',
  '/contact',
];

const authPaths = ['/sign-in', '/sign-up', '/dashboard'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getBaseUrl();
  const now = new Date();

  const sitemapEntries = await Promise.all(
    routing.locales.map(async (locale) => {
      const buildEntry = async (
        path: string,
        priority = 0.7,
        changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'] = 'weekly',
      ) => {
        const localizedPath = await getI18nPath(path, locale);
        const relativePath = localizedPath === '/' ? '' : localizedPath;
        return {
          url: new URL(relativePath, baseUrl).toString(),
          lastModified: now,
          changeFrequency,
          priority,
        };
      };

      const marketingEntries = await Promise.all(
        marketingPaths.map(path => buildEntry(path, path === '/' ? 1 : 0.7, 'weekly')),
      );
      const authEntries = await Promise.all(
        authPaths.map(path => buildEntry(path, 0.3, 'monthly')),
      );

      return [...marketingEntries, ...authEntries];
    }),
  );

  return sitemapEntries.flat();
}
