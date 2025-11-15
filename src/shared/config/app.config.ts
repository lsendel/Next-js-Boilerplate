import type { LocalizationResource } from '@clerk/types';
import type { LocalePrefixMode } from 'next-intl/routing';
import { enUS, frFR } from '@clerk/localizations';

const localePrefix: LocalePrefixMode = 'as-needed';

/**
 * Application Configuration
 *
 * Update these values for your specific project:
 * - name: Your application name
 * - locales: Supported languages
 * - defaultLocale: Default language for the application
 */
export const AppConfig = {
  name: 'Next.js Production Boilerplate',
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix,
};

const supportedLocales: Record<string, LocalizationResource> = {
  en: enUS,
  fr: frFR,
};

export const ClerkLocalizations = {
  defaultLocale: enUS,
  supportedLocales,
};
