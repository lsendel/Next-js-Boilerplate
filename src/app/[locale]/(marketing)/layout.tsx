import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { DemoBanner } from '@/client/components/ui/DemoBanner';
import { LocaleSwitcher } from '@/client/components/ui/LocaleSwitcher';
import { BaseTemplate } from '@/templates/BaseTemplate';
import { getI18nPath } from '@/shared/utils/helpers';

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'RootLayout',
  });

  const buildHref = (path: string) => getI18nPath(path, locale);

  return (
    <>
      <DemoBanner />
      <BaseTemplate
        leftNav={(
          <>
            <li>
              <Link
                href={buildHref('/')}
                className="border-none text-gray-700 hover:text-gray-900"
              >
                {t('home_link')}
              </Link>
            </li>
            <li>
              <Link
                href={buildHref('/about/')}
                className="border-none text-gray-700 hover:text-gray-900"
              >
                {t('about_link')}
              </Link>
            </li>
            <li>
              <Link
                href={buildHref('/counter/')}
                className="border-none text-gray-700 hover:text-gray-900"
              >
                {t('counter_link')}
              </Link>
            </li>
            <li>
              <Link
                href={buildHref('/portfolio/')}
                className="border-none text-gray-700 hover:text-gray-900"
              >
                {t('portfolio_link')}
              </Link>
            </li>
            <li>
              <Link
                href={buildHref('/features/')}
                className="border-none text-gray-700 hover:text-gray-900"
              >
                {t('features_link')}
              </Link>
            </li>
            <li>
              <Link
                href={buildHref('/pricing/')}
                className="border-none text-gray-700 hover:text-gray-900"
              >
                {t('pricing_link')}
              </Link>
            </li>
            <li>
              <a
                className="border-none text-gray-700 hover:text-gray-900"
                href="https://github.com/ixartz/Next-js-Boilerplate"
              >
                GitHub
              </a>
            </li>
            <li>
              <Link
                href={buildHref('/contact/')}
                className="border-none text-gray-700 hover:text-gray-900"
              >
                {t('contact_link')}
              </Link>
            </li>
          </>
        )}
        rightNav={(
          <>
            <li>
              <Link
                href={buildHref('/sign-in/')}
                className="border-none text-gray-700 hover:text-gray-900"
              >
                {t('sign_in_link')}
              </Link>
            </li>

            <li>
              <Link
                href={buildHref('/sign-up/')}
                className="border-none text-gray-700 hover:text-gray-900"
              >
                {t('sign_up_link')}
              </Link>
            </li>

            <li>
              <LocaleSwitcher />
            </li>
          </>
        )}
      >
        <div className="py-5 text-xl [&_p]:my-6">{props.children}</div>
      </BaseTemplate>
    </>
  );
}
