/**
 * JSON-LD Structured Data Utilities
 *
 * Generate schema.org compliant structured data for better SEO and rich snippets.
 * Reference: https://schema.org/
 */

export type Organization = {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[]; // Social media URLs
  contactPoint?: {
    telephone: string;
    contactType: string;
    email?: string;
  };
};

export type Product = {
  name: string;
  description: string;
  image: string[];
  brand?: string;
  offers?: {
    price: number;
    priceCurrency: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    url?: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
};

export type FAQPage = {
  questions: Array<{
    question: string;
    answer: string;
  }>;
};

export type Review = {
  author: string;
  datePublished: string;
  reviewBody: string;
  reviewRating: {
    ratingValue: number;
    bestRating?: number;
  };
};

export type BreadcrumbItem = {
  name: string;
  url: string;
};

/**
 * Generate Organization JSON-LD
 */
export function generateOrganizationSchema(org: Organization) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': org.name,
    'url': org.url,
    'logo': org.logo,
    'description': org.description,
    'sameAs': org.sameAs,
    'contactPoint': org.contactPoint
      ? {
          '@type': 'ContactPoint',
          'telephone': org.contactPoint.telephone,
          'contactType': org.contactPoint.contactType,
          'email': org.contactPoint.email,
        }
      : undefined,
  };
}

/**
 * Generate Product JSON-LD
 */
export function generateProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'description': product.description,
    'image': product.image,
    'brand': product.brand
      ? {
          '@type': 'Brand',
          'name': product.brand,
        }
      : undefined,
    'offers': product.offers
      ? {
          '@type': 'Offer',
          'price': product.offers.price,
          'priceCurrency': product.offers.priceCurrency,
          'availability': product.offers.availability ? `https://schema.org/${product.offers.availability}` : undefined,
          'url': product.offers.url,
        }
      : undefined,
    'aggregateRating': product.aggregateRating
      ? {
          '@type': 'AggregateRating',
          'ratingValue': product.aggregateRating.ratingValue,
          'reviewCount': product.aggregateRating.reviewCount,
        }
      : undefined,
  };
}

/**
 * Generate FAQPage JSON-LD
 */
export function generateFAQPageSchema(faq: FAQPage) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faq.questions.map(item => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer,
      },
    })),
  };
}

/**
 * Generate BreadcrumbList JSON-LD
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url,
    })),
  };
}

/**
 * Generate SoftwareApplication JSON-LD
 */
export function generateSoftwareApplicationSchema(app: {
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem?: string;
  offers?: {
    price: number;
    priceCurrency: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': app.name,
    'description': app.description,
    'applicationCategory': app.applicationCategory,
    'operatingSystem': app.operatingSystem,
    'offers': app.offers
      ? {
          '@type': 'Offer',
          'price': app.offers.price,
          'priceCurrency': app.offers.priceCurrency,
        }
      : undefined,
    'aggregateRating': app.aggregateRating
      ? {
          '@type': 'AggregateRating',
          'ratingValue': app.aggregateRating.ratingValue,
          'reviewCount': app.aggregateRating.reviewCount,
        }
      : undefined,
  };
}

/**
 * For rendering JSON-LD script tags, use the StructuredData component:
 * import { StructuredData } from '@/components/StructuredData';
 * <StructuredData data={generateOrganizationSchema(...)} />
 */
