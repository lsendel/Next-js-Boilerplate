import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { AuthProvider } from '@/libs/auth/components';

export default async function AuthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProvider locale={locale}>{props.children}</AuthProvider>
    </Suspense>
  );
}
