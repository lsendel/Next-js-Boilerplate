/**
 * RSS Feed Generator
 *
 * Generate RSS 2.0 compliant XML feeds for blog posts.
 * Reference: https://www.rssboard.org/rss-specification
 */

export type RSSItem = {
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  author?: string;
  category?: string[];
  guid?: string;
  enclosure?: {
    url: string;
    length?: number;
    type?: string;
  };
};

export type RSSFeedConfig = {
  title: string;
  description: string;
  link: string;
  language?: string;
  copyright?: string;
  managingEditor?: string;
  webMaster?: string;
  image?: {
    url: string;
    title: string;
    link: string;
    width?: number;
    height?: number;
  };
};

/**
 * Generate RSS 2.0 XML feed
 */
export function generateRSSFeed(config: RSSFeedConfig, items: RSSItem[]): string {
  const {
    title,
    description,
    link,
    language = 'en-us',
    copyright,
    managingEditor,
    webMaster,
    image,
  } = config;

  const lastBuildDate = new Date().toUTCString();
  const pubDate = items.length > 0 ? items[0]!.pubDate.toUTCString() : lastBuildDate;

  const rssItems = items
    .map((item) => {
      const categories = item.category
        ? item.category.map(cat => `    <category>${escapeXml(cat)}</category>`).join('\n')
        : '';

      const enclosure = item.enclosure
        ? `    <enclosure url="${escapeXml(item.enclosure.url)}" ${item.enclosure.length ? `length="${item.enclosure.length}" ` : ''}${item.enclosure.type ? `type="${escapeXml(item.enclosure.type)}"` : ''} />`
        : '';

      return `  <item>
    <title>${escapeXml(item.title)}</title>
    <description>${escapeXml(item.description)}</description>
    <link>${escapeXml(item.link)}</link>
    <guid isPermaLink="true">${escapeXml(item.guid || item.link)}</guid>
    <pubDate>${item.pubDate.toUTCString()}</pubDate>
${item.author ? `    <author>${escapeXml(item.author)}</author>` : ''}
${categories}
${enclosure}
  </item>`;
    })
    .join('\n');

  const imageElement = image
    ? `  <image>
    <url>${escapeXml(image.url)}</url>
    <title>${escapeXml(image.title)}</title>
    <link>${escapeXml(image.link)}</link>
${image.width ? `    <width>${image.width}</width>` : ''}
${image.height ? `    <height>${image.height}</height>` : ''}
  </image>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(title)}</title>
  <description>${escapeXml(description)}</description>
  <link>${escapeXml(link)}</link>
  <language>${language}</language>
  <lastBuildDate>${lastBuildDate}</lastBuildDate>
  <pubDate>${pubDate}</pubDate>
  <atom:link href="${escapeXml(link)}/rss.xml" rel="self" type="application/rss+xml" />
${copyright ? `  <copyright>${escapeXml(copyright)}</copyright>` : ''}
${managingEditor ? `  <managingEditor>${escapeXml(managingEditor)}</managingEditor>` : ''}
${webMaster ? `  <webMaster>${escapeXml(webMaster)}</webMaster>` : ''}
${imageElement}
${rssItems}
</channel>
</rss>`;
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
 * Example usage in Next.js API route:
 *
 * // src/app/rss.xml/route.ts
 * import { generateRSSFeed } from '@/utils/rss';
 * import { getAllBlogPosts } from '@/utils/blog';
 *
 * export async function GET() {
 *   const posts = await getAllBlogPosts();
 *
 *   const feed = generateRSSFeed(
 *     {
 *       title: 'Your Blog Title',
 *       description: 'Your blog description',
 *       link: 'https://yourdomain.com',
 *       language: 'en-us',
 *       copyright: '2025 Your Company',
 *     },
 *     posts.map(post => ({
 *       title: post.title,
 *       description: post.excerpt,
 *       link: `https://yourdomain.com/blog/${post.slug}`,
 *       pubDate: new Date(post.publishedAt),
 *       author: post.author.email,
 *       category: [post.category],
 *     })),
 *   );
 *
 *   return new Response(feed, {
 *     headers: {
 *       'Content-Type': 'application/xml',
 *       'Cache-Control': 'public, max-age=3600, s-maxage=3600',
 *     },
 *   });
 * }
 */
