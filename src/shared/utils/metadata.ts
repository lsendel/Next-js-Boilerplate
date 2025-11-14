import type { Metadata } from 'next';
import { routing } from '@/libs/I18nRouting';
import { getBaseUrl, getI18nPath } from './helpers';

type ImageDescriptor = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

type LocalizedMetadataOptions = {
  locale: string;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  type?: 'website' | 'article';
  images?: ImageDescriptor[];
};

const DEFAULT_IMAGE: ImageDescriptor = {
  url: '/assets/images/nextjs-starter-banner.png',
  width: 1200,
  height: 630,
  alt: 'Next.js Boilerplate preview',
};

export const buildLocalizedMetadata = async (options: LocalizedMetadataOptions): Promise<Metadata> => {
  const baseUrl = await getBaseUrl();
  const normalizedPath = options.path.startsWith('/') ? options.path : `/${options.path}`;
  const canonicalPath = await getI18nPath(normalizedPath, options.locale);
  const canonicalUrl = new URL(canonicalPath === '/' ? '' : canonicalPath, baseUrl).toString();

  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    const localizedPath = await getI18nPath(normalizedPath, locale);
    languages[locale] = new URL(localizedPath === '/' ? '' : localizedPath, baseUrl).toString();
  }

  const images = (options.images?.length ? options.images : [DEFAULT_IMAGE]).map(image => ({
    url: image.url.startsWith('http') ? image.url : new URL(image.url, baseUrl).toString(),
    width: image.width ?? DEFAULT_IMAGE.width,
    height: image.height ?? DEFAULT_IMAGE.height,
    alt: image.alt ?? options.title,
  }));

  return {
    title: options.title,
    description: options.description,
    keywords: options.keywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      type: options.type ?? 'website',
      url: canonicalUrl,
      title: options.title,
      description: options.description,
      images,
      siteName: 'Next.js Boilerplate',
    },
    twitter: {
      card: 'summary_large_image',
      title: options.title,
      description: options.description,
      images: images.map(image => image.url),
    },
  };
};
