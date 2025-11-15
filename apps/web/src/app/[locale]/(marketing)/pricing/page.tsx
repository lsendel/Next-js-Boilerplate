/* eslint-disable tailwindcss/classnames-order */
import Link from 'next/link';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PricingTable } from '@/client/components/marketing/PricingTable';
import { StructuredData } from '@/client/components/StructuredData';
import { buildLocalizedMetadata } from '@/shared/utils/metadata';
import { generateProductSchema } from '@/shared/utils/structuredData';
import { getBaseUrl, getI18nPath } from '@/shared/utils/helpers';

type PricingPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: PricingPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Pricing' });

  return await buildLocalizedMetadata({
    locale,
    path: '/pricing',
    title: t('meta_title'),
    description: t('meta_description'),
    keywords: ['Next.js pricing', 'SaaS starter pricing', 'Next.js boilerplate tiers'],
  });
}

export default async function PricingPage(props: PricingPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Pricing' });

  const baseUrl = await getBaseUrl();
  const canonicalPath = await getI18nPath('/pricing', locale);
  const canonicalUrl = new URL(canonicalPath, baseUrl).toString();

  const tiers = [
    {
      name: t('tiers.hobby.name'),
      price: {
        monthly: 0,
        currency: '$',
      },
      description: t('tiers.hobby.description'),
      features: [
        t('tiers.hobby.features.0'),
        t('tiers.hobby.features.1'),
        t('tiers.hobby.features.2'),
        t('tiers.hobby.features.3'),
      ],
      cta: {
        text: t('tiers.hobby.cta'),
        href: 'https://github.com/ixartz/Next-js-Boilerplate',
      },
      highlighted: false,
    },
    {
      name: t('tiers.startup.name'),
      price: {
        monthly: 79,
        yearly: 790,
        currency: '$',
      },
      description: t('tiers.startup.description'),
      features: [
        t('tiers.startup.features.0'),
        t('tiers.startup.features.1'),
        t('tiers.startup.features.2'),
        t('tiers.startup.features.3'),
      ],
      cta: {
        text: t('tiers.startup.cta'),
        href: '/contact',
      },
      highlighted: true,
      badge: (
        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {t('hero_eyebrow')}
        </span>
      ),
    },
    {
      name: t('tiers.enterprise.name'),
      price: {
        monthly: 199,
        currency: '$',
      },
      description: t('tiers.enterprise.description'),
      features: [
        t('tiers.enterprise.features.0'),
        t('tiers.enterprise.features.1'),
        t('tiers.enterprise.features.2'),
        t('tiers.enterprise.features.3'),
      ],
      cta: {
        text: t('tiers.enterprise.cta'),
        href: '/contact',
      },
    },
  ];

  const pricingSchema = generateProductSchema({
    name: 'Next.js Boilerplate Plans',
    description: t('meta_description'),
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

  return (
    <>
      <StructuredData data={pricingSchema} />

      <div className="rounded-2xl bg-gray-50 p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">{t('hero_eyebrow')}</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
          {t('hero_title')}
        </h1>
        <p className="mt-3 text-base text-gray-600">
          {t('hero_subtitle')}
        </p>
      </div>

      <PricingTable
        title={t('hero_title')}
        description={t('hero_subtitle')}
        tiers={tiers}
        showBillingToggle
        billingPeriod="monthly"
      />

      <section className="mt-12 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">{t('cta_title')}</h2>
        <p className="mt-2 text-gray-600">
          {t('cta_description')}
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500" href={getI18nPath('/contact', locale)}>
            {t('cta_primary')}
          </Link>
          <a
            className="rounded-md border border-gray-300 px-4 py-2 font-semibold text-gray-900 hover:bg-gray-50"
            href="https://github.com/ixartz/Next-js-Boilerplate"
            target="_blank"
            rel="noreferrer"
          >
            {t('cta_secondary')}
          </a>
        </div>
      </section>
    </>
  );
}
