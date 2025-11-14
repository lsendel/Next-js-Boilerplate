/* eslint-disable tailwindcss/classnames-order */
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FeaturesAlternating } from '@/client/components/marketing/FeaturesAlternating';
import { FeaturesGrid } from '@/client/components/marketing/FeaturesGrid';
import { StructuredData } from '@/client/components/StructuredData';
import { buildLocalizedMetadata } from '@/shared/utils/metadata';
import { generateBreadcrumbSchema, generateSoftwareApplicationSchema } from '@/shared/utils/structuredData';
import { getBaseUrl, getI18nPath } from '@/shared/utils/helpers';

type FeaturesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: FeaturesPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Features' });

  return await buildLocalizedMetadata({
    locale,
    path: '/features',
    title: t('meta_title'),
    description: t('meta_description'),
    keywords: ['Next.js features', 'SaaS starter features', 'Next.js boilerplate capabilities'],
  });
}

export default async function FeaturesPage(props: FeaturesPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Features' });

  const baseUrl = await getBaseUrl();
  const canonicalPath = await getI18nPath('/features', locale);
  const canonicalUrl = new URL(canonicalPath, baseUrl).toString();

  const softwareSchema = generateSoftwareApplicationSchema({
    name: 'Next.js Boilerplate Feature Set',
    description: t('meta_description'),
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Cross-platform',
    offers: {
      price: 0,
      priceCurrency: 'USD',
    },
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: new URL(await getI18nPath('/', locale), baseUrl).toString() },
    { name: t('hero_eyebrow'), url: canonicalUrl },
  ]);

  const featureCards = [
    { title: t('grid_cards.auth.title'), description: t('grid_cards.auth.description') },
    { title: t('grid_cards.database.title'), description: t('grid_cards.database.description') },
    { title: t('grid_cards.security.title'), description: t('grid_cards.security.description') },
    { title: t('grid_cards.seo.title'), description: t('grid_cards.seo.description') },
    { title: t('grid_cards.monitoring.title'), description: t('grid_cards.monitoring.description') },
    { title: t('grid_cards.tooling.title'), description: t('grid_cards.tooling.description') },
  ];

  const alternatingFeatures = [
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 6.253c4.97 0 9 1.79 9 4v6c0 2.21-4.03 4-9 4s-9-1.79-9-4v-6c0-2.21 4.03-4 9-4z" />
        </svg>
      ),
      title: t('middleware_title'),
      description: t('middleware_description'),
      image: {
        src: '/assets/images/nextjs-starter-banner.png',
        alt: 'Middleware architecture diagram',
      },
      benefits: [
        t('middleware_benefits.0'),
        t('middleware_benefits.1'),
        t('middleware_benefits.2'),
        t('middleware_benefits.3'),
      ],
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      ),
      title: t('marketing_title'),
      description: t('marketing_description'),
      image: {
        src: '/assets/images/nextjs-boilerplate-sign-in.png',
        alt: 'Marketing components preview',
      },
      benefits: [
        t('marketing_benefits.0'),
        t('marketing_benefits.1'),
        t('marketing_benefits.2'),
        t('marketing_benefits.3'),
      ],
    },
  ];

  return (
    <>
      <StructuredData data={softwareSchema} />
      <StructuredData data={breadcrumbSchema} />

      <div className="rounded-2xl bg-gray-50 p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">{t('hero_eyebrow')}</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
          {t('hero_title')}
        </h1>
        <p className="mt-3 text-base text-gray-600">
          {t('hero_subtitle')}
        </p>
      </div>

      <FeaturesGrid
        title={t('grid_title')}
        description={t('grid_description')}
        features={featureCards.map(card => ({
          icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          title: card.title,
          description: card.description,
        }))}
        columns={3}
      />

      <FeaturesAlternating
        title={t('deep_dives_title')}
        description={t('deep_dives_description')}
        features={alternatingFeatures}
      />
    </>
  );
}
