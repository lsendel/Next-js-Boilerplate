import { setRequestLocale } from 'next-intl/server';
import { AuthProvider } from '@/libs/auth/components';

export default async function AuthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <AuthProvider locale={locale}>
      {props.children}
    </AuthProvider>
  );
}
