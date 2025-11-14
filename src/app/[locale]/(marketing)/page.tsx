import Link from 'next/link';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { StructuredData } from '@/client/components/StructuredData';
import { Sponsors } from '@/client/components/ui/Sponsors';
import { generateBreadcrumbSchema, generateFAQPageSchema, generateOrganizationSchema, generateSoftwareApplicationSchema } from '@/shared/utils/structuredData';
import { buildLocalizedMetadata } from '@/shared/utils/metadata';
import { getBaseUrl, getI18nPath } from '@/shared/utils/helpers';

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IIndexProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return await buildLocalizedMetadata({
    locale,
    path: '/',
    title: t('meta_title'),
    description: t('meta_description'),
    keywords: [
      'Next.js boilerplate',
      'Tailwind CSS starter',
      'TypeScript SaaS template',
      'Next.js 16 app router example',
      'SaaS starter kit',
    ],
    images: [
      {
        url: '/assets/images/nextjs-starter-banner.png',
        width: 1200,
        height: 630,
        alt: 'Next.js Boilerplate marketing preview',
      },
    ],
  });
}

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  const baseUrl = await getBaseUrl();
  const canonicalPath = await getI18nPath('/', locale);
  const canonicalUrl = new URL(canonicalPath === '/' ? '' : canonicalPath, baseUrl).toString();
  const pricingHref = await getI18nPath('/pricing', locale);
  const featuresHref = await getI18nPath('/features', locale);
  const contactHref = await getI18nPath('/contact', locale);

  const faqs = [
    {
      question: 'What is Next.js Boilerplate?',
      answer:
        'Next.js Boilerplate is a production-ready starter kit built with Next.js 16, Tailwind CSS, Drizzle ORM, next-intl, and complete security tooling so you can launch SaaS products faster.',
    },
    {
      question: 'Does it include authentication and database integrations?',
      answer:
        'Yes. You can switch between Clerk, Cloudflare Access, or AWS Cognito with a single environment variable, and the database layer ships with Drizzle ORM and PostgreSQL/PGlite.',
    },
    {
      question: 'Is SEO and internationalization supported out of the box?',
      answer:
        'Absolutely. The template includes structured data helpers, localized metadata generation, hreflang support, and multi-language routing through next-intl.',
    },
  ];

  const structuredDataPayloads = [
    generateOrganizationSchema({
      name: 'Next.js Boilerplate',
      url: canonicalUrl,
      logo: `${baseUrl}/assets/images/nextjs-starter-logo.png`,
      description: t('meta_description'),
      sameAs: ['https://github.com/ixartz/Next-js-Boilerplate', 'https://twitter.com/ixartz'],
      contactPoint: {
        telephone: '+1-555-0100',
        contactType: 'customer support',
        email: 'hello@nextjs-boilerplate.com',
      },
    }),
    generateSoftwareApplicationSchema({
      name: 'Next.js Boilerplate',
      description: t('meta_description'),
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Cross-platform',
      offers: {
        price: 0,
        priceCurrency: 'USD',
      },
      aggregateRating: {
        ratingValue: 4.9,
        reviewCount: 124,
      },
    }),
    generateFAQPageSchema({ questions: faqs }),
    generateBreadcrumbSchema([
      {
        name: 'Home',
        url: canonicalUrl,
      },
    ]),
  ];

  const sellingPoints = [
    {
      title: 'Next.js 16 App Router Architecture',
      description:
        'Ship a modern React 19 experience with server components, streaming, and async data fetching already configured.',
    },
    {
      title: 'Security & Compliance Built In',
      description:
        'Arcjet bot protection, CSRF tokens, rate limiting, and audit logging keep your SaaS compliant from day one.',
    },
    {
      title: 'Scalable Design System',
      description:
        'Tailwind CSS v4, Storybook, and marketing templates let you design landing pages and dashboards without starting from scratch.',
    },
  ];

  const useCases = [
    {
      title: 'Launch SaaS products faster',
      body: 'Choose your auth provider, connect PostgreSQL, and deploy with production-ready monitoring in hours instead of weeks.',
    },
    {
      title: 'Modernize existing apps',
      body: 'Migrate to Next.js 16 while keeping strong typing, SEO, and analytics in a modular architecture.',
    },
    {
      title: 'Build internal tools',
      body: 'The dashboard, database layer, and authentication adapters make it easy to spin up secure internal tools or portals.',
    },
  ];

  return (
    <>
      {structuredDataPayloads.map(payload => (
        <StructuredData key={payload['@type']} data={payload} />
      ))}

      <p>
        {`Follow `}
        <a
          className="text-blue-700 hover:border-b-2 hover:border-blue-700"
          href="https://twitter.com/ixartz"
          target="_blank"
          rel="noreferrer noopener"
        >
          @Ixartz on Twitter
        </a>
        {` for updates and more information about the boilerplate.`}
      </p>
      <h2 className="mt-5 text-2xl font-bold">
        Boilerplate Code for Your Next.js Project with Tailwind CSS
      </h2>
      <p className="text-base">
        Next.js Boilerplate is a developer-friendly starter code for Next.js projects, built with Tailwind CSS and TypeScript.
        {' '}
        <span role="img" aria-label="zap">
          ⚡️
        </span>
        {' '}
        Designed with developer experience in mind, it includes:
      </p>
      <ul className="mt-3 text-base">
        <li>🚀 Next.js with App Router support</li>
        <li>🔥 TypeScript for type checking</li>
        <li>💎 Tailwind CSS integration</li>
        <li>
          🔒 Authentication with
          {' '}
          <a
            className="font-bold text-blue-700 hover:border-b-2 hover:border-blue-700"
            href="https://clerk.com?utm_source=github&amp;utm_medium=sponsorship&amp;utm_campaign=nextjs-boilerplate"
          >
            Clerk
          </a>
          {' '}
          (includes passwordless, social, and multi-factor auth)
        </li>
        <li>📦 ORM with DrizzleORM (PostgreSQL, SQLite, MySQL support)</li>
        <li>
          💽 Dev database with PGlite and production with
          {' '}
          <a
            className="font-bold text-blue-700 hover:border-b-2 hover:border-blue-700"
            href="https://www.prisma.io/?via=nextjsindex"
          >
            Prisma PostgreSQL
          </a>
        </li>
        <li>
          🌐 Multi-language support (i18n) with next-intl and
          {' '}
          <a
            className="font-bold text-blue-700 hover:border-b-2 hover:border-blue-700"
            href="https://l.crowdin.com/next-js"
          >
            Crowdin
          </a>
        </li>
        <li>🔴 Form handling (React Hook Form) and validation (Zod)</li>
        <li>📏 Linting and formatting (ESLint, Prettier)</li>
        <li>🦊 Git hooks and commit linting (Husky, Commitlint)</li>
        <li>🦺 Testing suite (Vitest, React Testing Library, Playwright)</li>
        <li>🎉 Storybook for UI development</li>
        <li>
          🐰 AI-powered code reviews with
          {' '}
          <a
            className="font-bold text-blue-700 hover:border-b-2 hover:border-blue-700"
            href="https://www.coderabbit.ai?utm_source=next_js_starter&utm_medium=github&utm_campaign=next_js_starter_oss_2025"
          >
            CodeRabbit
          </a>
        </li>
        <li>
          🚨 Error monitoring (
          <a
            className="font-bold text-blue-700 hover:border-b-2 hover:border-blue-700"
            href="https://sentry.io/for/nextjs/?utm_source=github&amp;utm_medium=paid-community&amp;utm_campaign=general-fy25q1-nextjs&amp;utm_content=github-banner-nextjsboilerplate-logo"
          >
            Sentry
          </a>
          ) and logging (LogTape, an alternative to Pino.js)
        </li>
        <li>🖥️ Monitoring as Code (Checkly)</li>
        <li>
          🔐 Security and bot protection (
          <a
            className="font-bold text-blue-700 hover:border-b-2 hover:border-blue-700"
            href="https://launch.arcjet.com/Q6eLbRE"
          >
            Arcjet
          </a>
          )
        </li>
        <li>🤖 SEO optimization (metadata, JSON-LD, Open Graph tags)</li>
        <li>⚙️ Development tools (VSCode config, bundler analyzer, changelog generation)</li>
      </ul>
      <p className="text-base">
        Our sponsors&apos; exceptional support has made this project possible.
        Their services integrate seamlessly with the boilerplate, and we
        recommend trying them out.
      </p>
      <h2 className="mt-5 text-2xl font-bold">{t('sponsors_title')}</h2>
      <Sponsors />

      <section id="highlights" className="mt-12 space-y-6 rounded-2xl bg-gray-50 p-6">
        <h2 className="text-2xl font-bold">
          Build SEO-friendly, secure SaaS products with Next.js Boilerplate
        </h2>
        <p className="text-base text-gray-700">
          Every feature combines developer productivity with search performance. Metadata, hreflang tags, structured data, and
          JSON-LD helpers are ready to use so your marketing pages rank the moment you publish them.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {sellingPoints.map(point => (
            <article key={point.title} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">{point.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{point.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="use-cases" className="mt-12 grid gap-6 md:grid-cols-3">
        {useCases.map(useCase => (
          <article key={useCase.title} className="rounded-xl border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900">{useCase.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{useCase.body}</p>
          </article>
        ))}
      </section>

      <section id="navigation" className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Explore the template</h2>
        <p className="mt-2 text-sm text-gray-600">
          Ready-made pages showcase how the toolkit can power your marketing site and application experience.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500" href={pricingHref}>
            View pricing page
          </Link>
          <Link className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50" href={featuresHref}>
            Explore feature showcase
          </Link>
          <Link className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50" href={contactHref}>
            Contact the team
          </Link>
        </div>
      </section>

      <section id="faqs" className="mt-12 rounded-2xl bg-gray-50 p-6">
        <h2 className="text-2xl font-bold">Frequently asked questions</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {faqs.map(faq => (
            <article key={faq.question} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
              <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="cta" className="mt-12 rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center">
        <h2 className="text-2xl font-bold text-blue-900">Ready to launch faster?</h2>
        <p className="mt-2 text-blue-800">
          Clone the repository, choose your authentication provider, and deploy with production-ready SEO and monitoring.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <a
            className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500"
            href="https://github.com/ixartz/Next-js-Boilerplate"
            target="_blank"
            rel="noreferrer"
          >
            View repository
          </a>
          <Link className="rounded-md border border-blue-200 px-6 py-3 font-semibold text-blue-900 hover:bg-blue-100" href={pricingHref}>
            Review pricing template
          </Link>
        </div>
      </section>
    </>
  );
};
