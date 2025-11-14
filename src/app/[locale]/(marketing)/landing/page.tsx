import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { setRequestLocale } from 'next-intl/server';
import { StructuredData } from '@/client/components/StructuredData';
import { buildLocalizedMetadata } from '@/shared/utils/metadata';
import {
  generateBreadcrumbSchema,
  generateFAQPageSchema,
  generateOrganizationSchema,
  generateProductSchema,
} from '@/shared/utils/structuredData';
import { getBaseUrl, getI18nPath } from '@/shared/utils/helpers';

// Dynamic imports for code splitting - reduces initial bundle size
const CtaGradient = dynamic(() => import('@/client/components/marketing/CtaGradient').then(mod => ({ default: mod.CtaGradient })), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-gray-100" />,
});

const CtaSimple = dynamic(() => import('@/client/components/marketing/CtaSimple').then(mod => ({ default: mod.CtaSimple })), {
  loading: () => <div className="min-h-[300px] animate-pulse bg-gray-100" />,
});

const FaqSection = dynamic(() => import('@/client/components/marketing/FaqSection').then(mod => ({ default: mod.FaqSection })), {
  loading: () => <div className="min-h-[500px] animate-pulse bg-gray-100" />,
});

const FeaturesAlternating = dynamic(() => import('@/client/components/marketing/FeaturesAlternating').then(mod => ({ default: mod.FeaturesAlternating })), {
  loading: () => <div className="min-h-[600px] animate-pulse bg-gray-100" />,
});

const FeaturesGrid = dynamic(() => import('@/client/components/marketing/FeaturesGrid').then(mod => ({ default: mod.FeaturesGrid })), {
  loading: () => <div className="min-h-[500px] animate-pulse bg-gray-100" />,
});

const HeroCentered = dynamic(() => import('@/client/components/marketing/HeroCentered').then(mod => ({ default: mod.HeroCentered })), {
  loading: () => <div className="min-h-[600px] animate-pulse bg-gray-100" />,
});

const PricingTable = dynamic(() => import('@/client/components/marketing/PricingTable').then(mod => ({ default: mod.PricingTable })), {
  loading: () => <div className="min-h-[700px] animate-pulse bg-gray-100" />,
});

const TestimonialsGrid = dynamic(() => import('@/client/components/marketing/TestimonialsGrid').then(mod => ({ default: mod.TestimonialsGrid })), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-gray-100" />,
});

type LandingPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: LandingPageProps): Promise<Metadata> {
  const { locale } = await props.params;

  return await buildLocalizedMetadata({
    locale,
    path: '/landing',
    title: 'Next.js Boilerplate Landing Page Template',
    description: 'Showcase landing page components included with the Next.js Boilerplate.',
    keywords: ['Next.js landing page', 'SaaS landing page template', 'Next.js marketing components'],
  });
}

/**
 * Landing Page Template
 *
 * A comprehensive landing page demonstrating all marketing components.
 * Includes SEO optimization with JSON-LD structured data.
 */
export default async function LandingPage(props: LandingPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const baseUrl = await getBaseUrl();
  const canonicalPath = await getI18nPath('/landing', locale);
  const canonicalUrl = new URL(canonicalPath, baseUrl).toString();

  // SEO Structured Data
  const organizationSchema = generateOrganizationSchema({
    name: 'Next.js Boilerplate',
    url: canonicalUrl,
    logo: `${baseUrl}/assets/images/nextjs-starter-logo.png`,
    description: 'Demo landing page that ships with the Next.js Boilerplate.',
    sameAs: [
      'https://twitter.com/ixartz',
      'https://github.com/ixartz/Next-js-Boilerplate',
    ],
  });

  const productSchema = generateProductSchema({
    name: 'Next.js Boilerplate Landing Page',
    description: 'Pre-built marketing components for SaaS teams using Next.js Boilerplate.',
    image: [`${baseUrl}/assets/images/nextjs-starter-banner.png`],
    brand: 'Next.js Boilerplate',
    offers: {
      price: 0,
      priceCurrency: 'USD',
      availability: 'InStock',
      url: canonicalUrl,
    },
    aggregateRating: {
      ratingValue: 4.8,
      reviewCount: 127,
    },
  });

  const faqSchema = generateFAQPageSchema({
    questions: [
      {
        question: 'What is included in the free trial?',
        answer: 'The free trial includes full access to all features for 14 days, no credit card required.',
      },
      {
        question: 'Can I cancel anytime?',
        answer: 'Yes, you can cancel your subscription at any time. There are no long-term commitments.',
      },
    ],
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: new URL(await getI18nPath('/', locale), baseUrl).toString() },
    { name: 'Landing Page', url: canonicalUrl },
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={productSchema} />
      <StructuredData data={faqSchema} />
      <StructuredData data={breadcrumbSchema} />

      {/* Hero Section */}
      <HeroCentered
        badge={(
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
            New: AI-powered features
          </span>
        )}
        title="Build amazing products faster than ever"
        description="The complete toolkit for modern SaaS applications. Authentication, database, payments, and more - all configured and ready to use."
        primaryCta={{
          text: 'Start free trial',
          href: '/sign-up',
        }}
        secondaryCta={{
          text: 'View demo',
          href: '/demo',
        }}
      />

      {/* Features Grid */}
      <FeaturesGrid
        title="Everything you need to launch"
        description="All the tools and integrations you need to build a production-ready SaaS application."
        columns={3}
        features={[
          {
            icon: (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            ),
            title: 'Multi-Provider Authentication',
            description: 'Switch between Clerk, Cloudflare Access, or AWS Cognito with a single environment variable.',
          },
          {
            icon: (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            ),
            title: 'Type-Safe Database',
            description: 'DrizzleORM with PostgreSQL, SQLite, and MySQL support. Local development with PGlite.',
          },
          {
            icon: (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            ),
            title: 'Built-in Monitoring',
            description: 'Sentry error tracking, Better Stack logging, and Checkly uptime monitoring pre-configured.',
          },
          {
            icon: (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            ),
            title: 'Internationalization',
            description: 'Multi-language support with next-intl and automatic translation management via Crowdin.',
          },
          {
            icon: (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ),
            title: 'Security First',
            description: 'Arcjet bot protection, rate limiting, and attack defense built-in from day one.',
          },
          {
            icon: (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ),
            title: 'Fast by Default',
            description: 'Lighthouse score optimization, bundle analysis, and Next.js 16+ performance features.',
          },
        ]}
      />

      {/* Features Alternating */}
      <FeaturesAlternating
        title="Designed for developers, built for production"
        description="Every feature is production-ready and thoroughly tested."
        features={[
          {
            icon: (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            ),
            title: 'Developer Experience First',
            description: 'Type-safe code, comprehensive testing, and pre-configured development tools. Everything you need is already set up and ready to use.',
            image: {
              src: '/assets/images/nextjs-starter-banner.png',
              alt: 'Developer tools screenshot',
            },
            benefits: [
              'TypeScript with strict mode enabled',
              'ESLint and Prettier pre-configured',
              'Vitest for unit testing with browser mode',
              'Playwright for E2E testing',
              'Storybook for UI development',
            ],
          },
          {
            icon: (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ),
            title: 'Production Ready Out of the Box',
            description: 'Deploy with confidence using battle-tested infrastructure and monitoring solutions.',
            image: {
              src: '/assets/images/nextjs-starter-banner.png',
              alt: 'Production dashboard screenshot',
            },
            benefits: [
              'Error monitoring with Sentry',
              'Log management with Better Stack',
              'Uptime monitoring with Checkly',
              'Analytics with PostHog',
              'Code coverage with Codecov',
            ],
          },
        ]}
      />

      {/* Testimonials */}
      <TestimonialsGrid
        title="Loved by developers worldwide"
        description="Join thousands of developers who have launched their products faster with our boilerplate."
        columns={3}
        testimonials={[
          {
            quote: 'This boilerplate saved us months of development time. The multi-provider auth system is brilliant!',
            author: {
              name: 'Sarah Chen',
              title: 'CTO',
              company: 'TechStart Inc',
              avatar: {
                src: '/assets/images/avatar-placeholder.png',
                alt: 'Sarah Chen',
              },
            },
            rating: 5,
          },
          {
            quote: 'Finally, a Next.js starter that includes everything I actually need for a SaaS product. No more endless setup.',
            author: {
              name: 'Marcus Johnson',
              title: 'Founder',
              company: 'AppVentures',
              avatar: {
                src: '/assets/images/avatar-placeholder.png',
                alt: 'Marcus Johnson',
              },
            },
            rating: 5,
          },
          {
            quote: 'The code quality is exceptional. Well-documented, type-safe, and easy to customize. Highly recommended!',
            author: {
              name: 'Emma Rodriguez',
              title: 'Lead Developer',
              company: 'Digital Solutions',
              avatar: {
                src: '/assets/images/avatar-placeholder.png',
                alt: 'Emma Rodriguez',
              },
            },
            rating: 5,
          },
        ]}
      />

      {/* Pricing */}
      <PricingTable
        title="Simple, transparent pricing"
        description="Choose the plan that's right for you. All plans include a 14-day free trial."
        showBillingToggle={true}
        tiers={[
          {
            name: 'Starter',
            description: 'Perfect for side projects and small applications',
            price: {
              monthly: 0,
              yearly: 0,
              currency: '$',
            },
            features: [
              'Up to 5,000 MAU',
              'Community support',
              'Basic analytics',
              'All authentication providers',
              '99.9% uptime SLA',
            ],
            cta: {
              text: 'Get started',
              href: '/sign-up',
            },
          },
          {
            name: 'Pro',
            description: 'For growing businesses and teams',
            price: {
              monthly: 29,
              yearly: 290,
              currency: '$',
            },
            features: [
              'Up to 50,000 MAU',
              'Priority email support',
              'Advanced analytics',
              'Custom branding',
              'Remove powered by badge',
              'Advanced security features',
            ],
            cta: {
              text: 'Start free trial',
              href: '/sign-up',
            },
            highlighted: true,
            badge: (
              <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                Most Popular
              </span>
            ),
          },
          {
            name: 'Enterprise',
            description: 'For large-scale applications and organizations',
            price: {
              monthly: 99,
              yearly: 990,
              currency: '$',
            },
            features: [
              'Unlimited MAU',
              '24/7 dedicated support',
              'Custom integrations',
              'SLA guarantee',
              'On-premise deployment option',
              'Advanced team features',
              'Custom contract terms',
            ],
            cta: {
              text: 'Contact sales',
              href: '/contact',
            },
          },
        ]}
      />

      {/* FAQ */}
      <FaqSection
        title="Frequently asked questions"
        description="Everything you need to know about the product and billing."
        faqs={[
          {
            question: 'What is included in the free trial?',
            answer: 'The free trial includes full access to all features for 14 days, no credit card required. You can explore all authentication providers, database features, and integrations.',
          },
          {
            question: 'Can I cancel anytime?',
            answer: 'Yes, you can cancel your subscription at any time. There are no long-term commitments or cancellation fees.',
          },
          {
            question: 'Which authentication providers are supported?',
            answer: 'We support Clerk, Cloudflare Access, and AWS Cognito. You can switch between providers using a single environment variable.',
          },
          {
            question: 'Do you offer refunds?',
            answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied, contact us within 30 days for a full refund.',
          },
          {
            question: 'Can I use this for client projects?',
            answer: 'Yes! The boilerplate is MIT licensed, which means you can use it for unlimited personal and commercial projects.',
          },
          {
            question: 'How do I get support?',
            answer: 'Pro and Enterprise customers get priority email support. Starter plan users can access our community Discord and documentation.',
          },
        ]}
      />

      {/* CTA Simple */}
      <CtaSimple
        title="Ready to build something amazing?"
        description="Join thousands of developers who have launched their products faster with our boilerplate."
        primaryCta={{
          text: 'Start your free trial',
          href: '/sign-up',
        }}
        secondaryCta={{
          text: 'Schedule a demo',
          href: '/demo',
        }}
      />

      {/* CTA Gradient */}
      <CtaGradient
        title="Start building today"
        description="Get instant access to the complete toolkit. No credit card required."
        primaryCta={{
          text: 'Get started for free',
          href: '/sign-up',
        }}
        secondaryCta={{
          text: 'View documentation',
          href: '/docs',
        }}
        gradientFrom="from-blue-600"
        gradientTo="to-purple-600"
      />
    </>
  );
}
