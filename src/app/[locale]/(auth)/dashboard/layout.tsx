import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { LocaleSwitcher } from '@/client/components/ui/LocaleSwitcher';
import { SignOutButtonComponent } from '@/libs/auth/components';
import { BaseTemplate } from '@/templates/BaseTemplate';
import { getI18nPath } from '@/shared/utils/helpers';

export default async function DashboardLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'DashboardLayout',
  });

  const buildHref = (path: string) => getI18nPath(path, locale);

  return (
    <BaseTemplate
      leftNav={(
        <>
          <li>
            <Link
              href={buildHref('/dashboard/')}
              className="border-none text-gray-700 hover:text-gray-900"
            >
              {t('dashboard_link')}
            </Link>
          </li>
          <li>
            <Link
              href={buildHref('/dashboard/user-profile/')}
              className="border-none text-gray-700 hover:text-gray-900"
            >
              {t('user_profile_link')}
            </Link>
          </li>
        </>
      )}
      rightNav={(
        <>
          <li>
            <SignOutButtonComponent>
              <button className="border-none text-gray-700 hover:text-gray-900" type="button">
                {t('sign_out')}
              </button>
            </SignOutButtonComponent>
          </li>

          <li>
            <LocaleSwitcher />
          </li>
        </>
      )}
    >
      {props.children}
    </BaseTemplate>
  );
}
