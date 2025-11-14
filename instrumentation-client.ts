/**
 * Client-side Instrumentation for Next.js
 *
 * This file provides client-specific instrumentation hooks.
 * It runs only in the browser/client environment.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

/**
 * Placeholder for Sentry navigation instrumentation
 *
 * Note: The captureRouterTransitionStart API is not available in @sentry/nextjs 10.25.0
 * This will be enabled when upgrading to a newer version of Sentry that supports it.
 *
 * To enable when available:
 * ```typescript
 * import * as Sentry from '@sentry/nextjs';
 * export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
 * ```
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#configure-client-side-navigation-instrumentation
 */
export const onRouterTransitionStart = () => {
  // Placeholder - will be implemented when Sentry API is available
};
