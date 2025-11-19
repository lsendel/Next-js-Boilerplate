import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

export const Env = createEnv({
  server: {
    ARCJET_KEY: z.string().startsWith('ajkey_').optional(),
    CLERK_SECRET_KEY: z.string().min(1).optional(), // Optional - only required when using Clerk auth
    DATABASE_URL: z.string().min(1),
    // Security
    PASSWORD_PEPPER: z.string().min(32).optional(), // Secret for password hashing
    SECURITY_ALERT_WEBHOOK: z.string().url().optional(), // Webhook for critical security alerts
    ENCRYPTION_KEY: z.string().min(32).optional(), // Key for encrypting sensitive data
    BETTER_STACK_SOURCE_TOKEN: z.string().optional(),
    BETTER_STACK_INGESTING_HOST: z.string().optional(),
    // Cloudflare
    CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
    CLOUDFLARE_API_TOKEN: z.string().optional(),
    D1_DATABASE_ID: z.string().optional(),
    // Sentry
    SENTRY_DSN: z.preprocess(
      val => (val === '' ? undefined : val),
      z.string().url().optional(),
    ),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(), // Optional - only required when using Clerk auth
    NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN: z.string().optional(),
    NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),
    // Monitoring feature flags
    NEXT_PUBLIC_ENABLE_SENTRY: z.string().optional(),
    NEXT_PUBLIC_ENABLE_POSTHOG: z.string().optional(),
    NEXT_PUBLIC_ENABLE_CF_ANALYTICS: z.string().optional(),
    NEXT_PUBLIC_CF_ANALYTICS_TOKEN: z.string().optional(),
    // Sentry client config
    NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: z.string().optional(),
    NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE: z.string().optional(),
    NEXT_PUBLIC_SENTRY_REPLAYS_ERROR_SAMPLE_RATE: z.string().optional(),
    // Auth provider
    NEXT_PUBLIC_AUTH_PROVIDER: z
      .enum(['clerk', 'cloudflare', 'cognito', 'test'])
      .optional(),
    NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN: z.string().optional(),
    NEXT_PUBLIC_CLOUDFLARE_AUDIENCE: z.string().optional(),
    NEXT_PUBLIC_CLOUDFLARE_VERIFY_JWT: z.string().optional(),
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  // You need to destructure all the keys manually
  runtimeEnv: {
    ARCJET_KEY: process.env.ARCJET_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    PASSWORD_PEPPER: process.env.PASSWORD_PEPPER,
    SECURITY_ALERT_WEBHOOK: process.env.SECURITY_ALERT_WEBHOOK,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    BETTER_STACK_SOURCE_TOKEN: process.env.BETTER_STACK_SOURCE_TOKEN,
    BETTER_STACK_INGESTING_HOST: process.env.BETTER_STACK_INGESTING_HOST,
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
    D1_DATABASE_ID: process.env.D1_DATABASE_ID,
    SENTRY_DSN: process.env.SENTRY_DSN,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN:
      process.env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN,
    NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST:
      process.env.NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_ENABLE_SENTRY: process.env.NEXT_PUBLIC_ENABLE_SENTRY,
    NEXT_PUBLIC_ENABLE_POSTHOG: process.env.NEXT_PUBLIC_ENABLE_POSTHOG,
    NEXT_PUBLIC_ENABLE_CF_ANALYTICS:
      process.env.NEXT_PUBLIC_ENABLE_CF_ANALYTICS,
    NEXT_PUBLIC_CF_ANALYTICS_TOKEN: process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN,
    NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE:
      process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE,
    NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE:
      process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE,
    NEXT_PUBLIC_SENTRY_REPLAYS_ERROR_SAMPLE_RATE:
      process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ERROR_SAMPLE_RATE,
    NEXT_PUBLIC_AUTH_PROVIDER: process.env.NEXT_PUBLIC_AUTH_PROVIDER,
    NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_CLOUDFLARE_AUTH_DOMAIN,
    NEXT_PUBLIC_CLOUDFLARE_AUDIENCE:
      process.env.NEXT_PUBLIC_CLOUDFLARE_AUDIENCE,
    NEXT_PUBLIC_CLOUDFLARE_VERIFY_JWT:
      process.env.NEXT_PUBLIC_CLOUDFLARE_VERIFY_JWT,
    NODE_ENV: process.env.NODE_ENV,
  },
});
