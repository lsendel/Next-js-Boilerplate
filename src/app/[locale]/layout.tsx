import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { MonitoringInit } from '@/client/components/MonitoringInit';
import { DemoBadge } from '@/client/components/ui/DemoBadge';
import { PostHogProvider } from '@/client/providers/PostHogProvider';
import { routing } from '@/libs/I18nRouting';
import { getBaseUrl } from '@/shared/utils/helpers';
import '@/styles/global.css';

// Optimize font loading with Next.js font system
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getBaseUrl();

  return {
    metadataBase: new URL(baseUrl),
    icons: [
      {
        rel: 'apple-touch-icon',
        url: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
      {
        rel: 'icon',
        url: '/favicon.ico',
      },
    ],
    alternates: {
      canonical: '/',
      languages: routing.locales.reduce<Record<string, string>>((acc, locale) => {
        acc[locale] = locale === routing.defaultLocale ? '/' : `/${locale}`;
        return acc;
      }, {}),
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className={inter.variable}>
      <body className="font-sans">
        <NextIntlClientProvider>
          <PostHogProvider>
            {props.children}
          </PostHogProvider>

          <DemoBadge />
          <MonitoringInit />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
