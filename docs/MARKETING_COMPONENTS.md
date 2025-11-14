# Marketing Components Documentation

This guide covers all the marketing and landing page components available in this boilerplate.

## Table of Contents

- [Hero Components](#hero-components)
- [Feature Components](#feature-components)
- [CTA Components](#cta-components)
- [Social Proof Components](#social-proof-components)
- [Pricing Components](#pricing-components)
- [FAQ Components](#faq-components)
- [Blog Components](#blog-components)
- [SEO Utilities](#seo-utilities)
- [Google Analytics](#google-analytics)

## Hero Components

### HeroCentered

A clean, centered hero section perfect for landing pages.

**Features:**
- Centered layout
- Optional badge
- Dual CTAs (primary and secondary)
- Background pattern decoration
- Trust indicators

**Usage:**

```typescript
import { HeroCentered } from '@/components/marketing';

<HeroCentered
  badge={
    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
      New Feature
    </span>
  }
  title="Build amazing products faster"
  description="Complete toolkit for modern SaaS applications"
  primaryCta={{
    text: 'Start free trial',
    href: '/sign-up',
  }}
  secondaryCta={{
    text: 'View demo',
    href: '/demo',
  }}
/>
```

### HeroWithImage

A two-column hero with text on one side and image on the other.

**Features:**
- Responsive two-column layout
- Image positioning (left or right)
- Decorative blur effects
- Next.js Image optimization

**Usage:**

```typescript
import { HeroWithImage } from '@/components/marketing';

<HeroWithImage
  title="Your product headline"
  description="Detailed description of your product"
  image={{
    src: '/path/to/image.png',
    alt: 'Product screenshot',
    width: 1600,
    height: 900,
  }}
  imagePosition="right" // or "left"
  primaryCta={{
    text: 'Get started',
    href: '/sign-up',
  }}
/>
```

### HeroGradient

Eye-catching hero with vibrant gradient background.

**Features:**
- Customizable gradient colors
- White text for contrast
- Decorative background elements
- Built-in trust indicators

**Usage:**

```typescript
import { HeroGradient } from '@/components/marketing';

<HeroGradient
  title="Build faster, launch sooner"
  description="Everything you need in one place"
  gradientFrom="from-blue-600"
  gradientTo="to-purple-600"
  primaryCta={{
    text: 'Start free trial',
    href: '/sign-up',
  }}
/>
```

## Feature Components

### FeaturesGrid

Responsive grid layout showcasing features with icons.

**Features:**
- Configurable columns (2, 3, or 4)
- Icon + title + description
- Hover effects
- Optional header section

**Usage:**

```typescript
import { FeaturesGrid } from '@/components/marketing';

<FeaturesGrid
  title="Everything you need"
  description="All the tools to launch your product"
  columns={3}
  features={[
    {
      icon: <YourIconComponent />,
      title: 'Feature name',
      description: 'Feature description',
    },
    // ... more features
  ]}
/>
```

### FeaturesAlternating

Detailed feature showcase with alternating image-text layout.

**Features:**
- Alternating left/right layout
- Image integration
- Benefit lists with checkmarks
- Optional icons

**Usage:**

```typescript
import { FeaturesAlternating } from '@/components/marketing';

<FeaturesAlternating
  title="Designed for developers"
  features={[
    {
      title: 'Developer Experience First',
      description: 'Type-safe code, comprehensive testing...',
      image: {
        src: '/feature-image.png',
        alt: 'Feature screenshot',
      },
      benefits: [
        'TypeScript with strict mode',
        'Pre-configured ESLint',
        'Vitest for testing',
      ],
    },
  ]}
/>
```

## CTA Components

### CtaSimple

Clean, focused call-to-action section.

**Features:**
- Centered layout
- Dual CTA buttons
- Simple and effective

**Usage:**

```typescript
import { CtaSimple } from '@/components/marketing';

<CtaSimple
  title="Ready to get started?"
  description="Join thousands of developers"
  primaryCta={{
    text: 'Start free trial',
    href: '/sign-up',
  }}
  secondaryCta={{
    text: 'Schedule demo',
    href: '/demo',
  }}
/>
```

### CtaGradient

Vibrant CTA with gradient background.

**Features:**
- Customizable gradient colors
- High-conversion design
- Decorative elements

**Usage:**

```typescript
import { CtaGradient } from '@/components/marketing';

<CtaGradient
  title="Start building today"
  description="Get instant access"
  gradientFrom="from-blue-600"
  gradientTo="to-purple-600"
  primaryCta={{
    text: 'Get started',
    href: '/sign-up',
  }}
/>
```

## Social Proof Components

### TestimonialsGrid

Customer testimonials in grid layout.

**Features:**
- Star ratings
- Author avatars
- Company information
- Configurable columns (2 or 3)

**Usage:**

```typescript
import { TestimonialsGrid } from '@/components/marketing';

<TestimonialsGrid
  title="Loved by developers"
  columns={3}
  testimonials={[
    {
      quote: 'This product saved us months!',
      author: {
        name: 'Sarah Chen',
        title: 'CTO',
        company: 'TechStart Inc',
        avatar: {
          src: '/avatar.png',
          alt: 'Sarah Chen',
        },
      },
      rating: 5,
    },
  ]}
/>
```

## Pricing Components

### PricingTable

Comprehensive pricing table with multiple tiers.

**Features:**
- Monthly/yearly toggle
- Highlighted tier
- Custom badges
- Feature lists with checkmarks
- Enterprise CTA

**Usage:**

```typescript
import { PricingTable } from '@/components/marketing';

<PricingTable
  title="Simple, transparent pricing"
  showBillingToggle={true}
  tiers={[
    {
      name: 'Pro',
      description: 'For growing businesses',
      price: {
        monthly: 29,
        yearly: 290,
      },
      features: [
        'Up to 50,000 MAU',
        'Priority support',
        'Advanced analytics',
      ],
      cta: {
        text: 'Start trial',
        href: '/sign-up',
      },
      highlighted: true,
    },
  ]}
/>
```

## FAQ Components

### FaqSection

Accordion-style FAQ section.

**Features:**
- Collapsible questions
- Smooth animations
- Configurable columns (1 or 2)
- Contact CTA

**Usage:**

```typescript
import { FaqSection } from '@/components/marketing';

<FaqSection
  title="Frequently asked questions"
  columns={1}
  faqs={[
    {
      question: 'What is included in the free trial?',
      answer: 'Full access to all features for 14 days...',
    },
  ]}
/>
```

## Blog Components

### BlogCard

Blog post preview card for listings.

**Features:**
- Cover image with category badge
- Author info with avatar
- Reading time
- Publish date
- Hover effects

**Usage:**

```typescript
import { BlogCard } from '@/components/blog';

<BlogCard
  slug="my-first-post"
  title="How to Build a SaaS Product"
  excerpt="Learn the fundamentals..."
  coverImage={{
    src: '/blog/cover.png',
    alt: 'Blog post cover',
  }}
  author={{
    name: 'John Doe',
    avatar: '/avatars/john.png',
  }}
  publishedAt="2025-01-15"
  readingTime="5 min read"
  category="Tutorial"
/>
```

### BlogGrid

Grid layout for blog post listings.

**Usage:**

```typescript
import { BlogGrid } from '@/components/blog';

<BlogGrid
  title="Latest Posts"
  description="Read our latest articles"
  columns={3}
  posts={blogPosts}
/>
```

### BlogHeader

Full-width header for blog posts.

**Features:**
- Cover image
- Author bio
- Tags
- Reading time
- Category badge

**Usage:**

```typescript
import { BlogHeader } from '@/components/blog';

<BlogHeader
  title="My Blog Post Title"
  excerpt="A brief description"
  coverImage={{
    src: '/cover.png',
    alt: 'Cover',
  }}
  author={{
    name: 'Jane Doe',
    avatar: '/avatar.png',
    bio: 'Software Engineer',
  }}
  publishedAt="2025-01-15"
  readingTime="10 min read"
  category="Development"
  tags={['Next.js', 'React', 'TypeScript']}
/>
```

## SEO Utilities

### JSON-LD Structured Data

Generate schema.org structured data for better SEO.

**Available Schemas:**
- Organization
- Product
- FAQPage
- Review
- Breadcrumb
- SoftwareApplication
- WebSite

**Usage:**

```typescript
import {
  generateOrganizationSchema,
  generateProductSchema,
  generateFAQPageSchema,
  StructuredData,
} from '@/utils/structuredData';

// In your page component
const orgSchema = generateOrganizationSchema({
  name: 'Your Company',
  url: 'https://yourcompany.com',
  logo: 'https://yourcompany.com/logo.png',
  sameAs: [
    'https://twitter.com/yourcompany',
    'https://linkedin.com/company/yourcompany',
  ],
});

// Render in your page
<StructuredData data={orgSchema} />
```

### RSS Feed

Generate RSS 2.0 compliant XML feeds.

**Usage:**

```typescript
// src/app/rss.xml/route.ts
import { generateRSSFeed } from '@/utils/rss';

export async function GET() {
  const feed = generateRSSFeed(
    {
      title: 'Your Blog',
      description: 'Blog description',
      link: 'https://yourdomain.com',
    },
    posts.map(post => ({
      title: post.title,
      description: post.excerpt,
      link: `https://yourdomain.com/blog/${post.slug}`,
      pubDate: new Date(post.publishedAt),
    })),
  );

  return new Response(feed, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
```

### Sitemap

Generate XML sitemaps for search engines.

**Usage:**

```typescript
// src/app/sitemap.xml/route.ts
import { generateSitemap, generateStaticPageURLs } from '@/utils/sitemap';

export async function GET() {
  const baseUrl = 'https://yourdomain.com';

  const urls = generateStaticPageURLs(
    [
      { path: '/', priority: 1.0, changefreq: 'daily' },
      { path: '/about', priority: 0.8 },
      { path: '/pricing', priority: 0.9 },
    ],
    baseUrl,
  );

  const sitemap = generateSitemap(urls);

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
```

## Google Analytics

Track page views, events, and conversions.

### Setup

1. Get your GA4 Measurement ID from https://analytics.google.com/
2. Add to `.env`:

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

3. Add to root layout:

```typescript
// src/app/layout.tsx
import { GoogleAnalytics } from '@/libs/GoogleAnalytics';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <GoogleAnalytics />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Track Events

```typescript
import { trackEvent } from '@/libs/GoogleAnalytics';

// Track button click
trackEvent('button_click', {
  button_name: 'signup',
  location: 'hero',
});

// Track form submission
trackEvent('form_submit', {
  form_name: 'contact',
});
```

### Track Conversions

```typescript
import { trackConversion } from '@/libs/GoogleAnalytics';

trackConversion('purchase', {
  value: 99.99,
  currency: 'USD',
  transaction_id: 'T123',
});
```

### Privacy Controls

```typescript
import { optInAnalytics, optOutAnalytics } from '@/libs/GoogleAnalytics';

// User opts out
optOutAnalytics();

// User opts in
optInAnalytics();
```

## Best Practices

### Performance

- All components use Next.js Image for optimized images
- Lazy loading for off-screen content
- Minimal JavaScript bundles
- CSS is scoped to components

### SEO

- Semantic HTML markup
- Proper heading hierarchy
- Alt text for all images
- JSON-LD structured data
- RSS and sitemap support

### Accessibility

- ARIA labels where appropriate
- Keyboard navigation support
- Sufficient color contrast
- Focus indicators

### Customization

All components support:
- Tailwind CSS classes
- Custom styling via className
- Dark mode (if enabled)
- Internationalization (i18n)

## Examples

See `/src/app/[locale]/(marketing)/landing/page.tsx` for a complete landing page example using all components.

## Support

For issues or questions:
- GitHub Issues: [Your Repo URL]
- Documentation: [Your Docs URL]
- Discord Community: [Your Discord URL]
