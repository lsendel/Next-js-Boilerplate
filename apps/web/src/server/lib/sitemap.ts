/**
 * Sitemap Generator
 *
 * Generate XML sitemaps for better SEO and search engine indexing.
 * Reference: https://www.sitemaps.org/protocol.html
 */

export type SitemapURL = {
  loc: string;
  lastmod?: Date;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number; // 0.0 to 1.0
  images?: Array<{
    loc: string;
    caption?: string;
    title?: string;
  }>;
};

/**
 * Generate XML sitemap
 */
export function generateSitemap(urls: SitemapURL[]): string {
  const urlElements = urls
    .map((url) => {
      const images = url.images
        ? url.images
            .map(
              img => `    <image:image>
      <image:loc>${escapeXml(img.loc)}</image:loc>
${img.caption ? `      <image:caption>${escapeXml(img.caption)}</image:caption>` : ''}
${img.title ? `      <image:title>${escapeXml(img.title)}</image:title>` : ''}
    </image:image>`,
            )
            .join('\n')
        : '';

      return `  <url>
    <loc>${escapeXml(url.loc)}</loc>
${url.lastmod ? `    <lastmod>${url.lastmod.toISOString().split('T')[0]}</lastmod>` : ''}
${url.changefreq ? `    <changefreq>${url.changefreq}</changefreq>` : ''}
${url.priority !== undefined ? `    <priority>${url.priority.toFixed(1)}</priority>` : ''}
${images}
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlElements}
</urlset>`;
}

/**
 * Generate sitemap index (for large sites with multiple sitemaps)
 */
export function generateSitemapIndex(sitemaps: Array<{ loc: string; lastmod?: Date }>): string {
  const sitemapElements = sitemaps
    .map(
      sitemap => `  <sitemap>
    <loc>${escapeXml(sitemap.loc)}</loc>
${sitemap.lastmod ? `    <lastmod>${sitemap.lastmod.toISOString()}</lastmod>` : ''}
  </sitemap>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapElements}
</sitemapindex>`;
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Helper function to generate blog sitemap URLs
 */
export function generateBlogSitemapURLs(
  posts: Array<{
    slug: string;
    updatedAt?: Date;
    coverImage?: string;
  }>,
  baseUrl: string,
): SitemapURL[] {
  return posts.map(post => ({
    loc: `${baseUrl}/blog/${post.slug}`,
    lastmod: post.updatedAt || new Date(),
    changefreq: 'monthly' as const,
    priority: 0.7,
    images: post.coverImage
      ? [
          {
            loc: post.coverImage,
          },
        ]
      : undefined,
  }));
}

/**
 * Helper function to generate static page URLs
 */
export function generateStaticPageURLs(
  pages: Array<{
    path: string;
    priority?: number;
    changefreq?: SitemapURL['changefreq'];
  }>,
  baseUrl: string,
): SitemapURL[] {
  return pages.map(page => ({
    loc: `${baseUrl}${page.path}`,
    lastmod: new Date(),
    changefreq: page.changefreq || 'monthly',
    priority: page.priority !== undefined ? page.priority : 0.5,
  }));
}

/**
 * Example usage in Next.js:
 *
 * // src/app/sitemap.xml/route.ts
 * import { generateSitemap, generateStaticPageURLs, generateBlogSitemapURLs } from '@/utils/sitemap';
 * import { getAllBlogPosts } from '@/utils/blog';
 *
 * export async function GET() {
 *   const baseUrl = 'https://yourdomain.com';
 *   const posts = await getAllBlogPosts();
 *
 *   // Static pages
 *   const staticPages = generateStaticPageURLs(
 *     [
 *       { path: '/', priority: 1.0, changefreq: 'daily' },
 *       { path: '/about', priority: 0.8 },
 *       { path: '/contact', priority: 0.8 },
 *       { path: '/pricing', priority: 0.9 },
 *     ],
 *     baseUrl,
 *   );
 *
 *   // Blog posts
 *   const blogPages = generateBlogSitemapURLs(posts, baseUrl);
 *
 *   const sitemap = generateSitemap([...staticPages, ...blogPages]);
 *
 *   return new Response(sitemap, {
 *     headers: {
 *       'Content-Type': 'application/xml',
 *       'Cache-Control': 'public, max-age=3600, s-maxage=3600',
 *     },
 *   });
 * }
 *
 * // Next.js also supports automatic sitemap generation:
 * // src/app/sitemap.ts
 * import { MetadataRoute } from 'next';
 *
 * export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 *   return [
 *     {
 *       url: 'https://yourdomain.com',
 *       lastModified: new Date(),
 *       changeFrequency: 'daily',
 *       priority: 1,
 *     },
 *     {
 *       url: 'https://yourdomain.com/about',
 *       lastModified: new Date(),
 *       changeFrequency: 'monthly',
 *       priority: 0.8,
 *     },
 *   ];
 * }
 */
