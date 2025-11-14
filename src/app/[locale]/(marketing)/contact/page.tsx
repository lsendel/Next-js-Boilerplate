/* eslint-disable tailwindcss/classnames-order */
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { StructuredData } from '@/client/components/StructuredData';
import { buildLocalizedMetadata } from '@/shared/utils/metadata';
import { generateOrganizationSchema } from '@/shared/utils/structuredData';
import { getBaseUrl, getI18nPath } from '@/shared/utils/helpers';

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: ContactPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Contact' });

  return await buildLocalizedMetadata({
    locale,
    path: '/contact',
    title: t('meta_title'),
    description: t('meta_description'),
    keywords: ['Contact Next.js boilerplate', 'SaaS starter support', 'Next.js template questions'],
  });
}

export default async function ContactPage(props: ContactPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Contact' });

  const baseUrl = await getBaseUrl();
  const canonicalPath = await getI18nPath('/contact', locale);
  const canonicalUrl = new URL(canonicalPath, baseUrl).toString();

  const orgSchema = generateOrganizationSchema({
    name: 'Next.js Boilerplate',
    url: canonicalUrl,
    description: t('meta_description'),
    sameAs: ['https://twitter.com/ixartz', 'https://github.com/ixartz/Next-js-Boilerplate'],
    contactPoint: {
      telephone: '+1-555-0100',
      contactType: 'customer support',
      email: 'hello@nextjs-boilerplate.com',
    },
  });

  return (
    <>
      <StructuredData data={orgSchema} />

      <div className="rounded-2xl bg-gray-50 p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">{t('hero_eyebrow')}</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">{t('hero_title')}</h1>
        <p className="mt-3 text-base text-gray-600">
          {t('hero_subtitle')}
        </p>
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">{t('support_title')}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('support_description')}
          </p>
          <dl className="mt-4 space-y-3 text-sm text-gray-700">
            <div>
              <dt className="font-semibold text-gray-900">{t('email_label')}</dt>
              <dd>
                <a className="text-blue-700 hover:underline" href="mailto:hello@nextjs-boilerplate.com">
                  hello@nextjs-boilerplate.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">{t('phone_label')}</dt>
              <dd>+1 (555) 010-0000</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">{t('response_time_label')}</dt>
              <dd>{t('response_time_value')}</dd>
            </div>
          </dl>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">{t('community_title')}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('community_description')}
          </p>
          <ul className="mt-4 space-y-3 text-sm text-blue-700">
            <li>
              <a className="hover:underline" href="https://github.com/ixartz/Next-js-Boilerplate" target="_blank" rel="noreferrer">
                {t('community_links.github')}
              </a>
            </li>
            <li>
              <a className="hover:underline" href="https://twitter.com/ixartz" target="_blank" rel="noreferrer">
                {t('community_links.twitter')}
              </a>
            </li>
            <li>
              <a className="hover:underline" href="https://nextjs-boilerplate.com" target="_blank" rel="noreferrer">
                {t('community_links.blog')}
              </a>
            </li>
          </ul>
        </article>
      </section>
    </>
  );
}
