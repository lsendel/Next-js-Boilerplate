/**
 * Lazy Loading for Monitoring Services
 *
 * Loads Sentry after page becomes interactive to reduce First Load JS.
 * This optimization removes ~259 KB from the initial bundle while maintaining
 * error tracking capabilities for user interactions.
 *
 * Trade-off: Errors in the first ~500ms after page load won't be tracked.
 * This is acceptable because:
 * - Most critical errors happen after user interaction
 * - Server-side Sentry (instrumentation.ts) still captures SSR/API errors
 * - Can add error boundary that eagerly loads Sentry on first error
 */

import { logger } from '@/libs/Logger';

let sentryInitialized = false;

/**
 * Initialize Sentry client-side monitoring
 * Called automatically after page load
 */
async function initSentry() {
  // Skip if already initialized or on server
  if (sentryInitialized || typeof window === 'undefined') {
    return;
  }

  // Skip if Sentry is disabled
  if (process.env.NEXT_PUBLIC_SENTRY_DISABLED) {
    return;
  }

  try {
    const Sentry = await import('@sentry/nextjs');

    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

      // Add optional integrations for additional features
      integrations: [
        Sentry.replayIntegration(),
        Sentry.consoleLoggingIntegration(),
        Sentry.browserTracingIntegration(),

        ...(process.env.NODE_ENV === 'development'
          ? [Sentry.spotlightBrowserIntegration()]
          : []),
      ],

      // Adds request headers and IP for users
      sendDefaultPii: true,

      // Define how likely traces are sampled
      tracesSampleRate: 1,

      // Define how likely Replay events are sampled
      replaysSessionSampleRate: 0.1,

      // Define how likely Replay events are sampled when an error occurs
      replaysOnErrorSampleRate: 1.0,

      // Enable logs to be sent to Sentry
      enableLogs: true,

      // Debug mode
      debug: false,
    });

    sentryInitialized = true;

    if (process.env.NODE_ENV === 'development') {
      logger.warn('LazyMonitoring: Sentry initialized after page load');
    }
  } catch (error) {
    logger.error('LazyMonitoring failed to initialize Sentry', { error });
  }
}

/**
 * Auto-initialize Sentry after page load
 * Uses requestIdleCallback for better performance if available
 */
if (typeof window !== 'undefined') {
  const initAfterLoad = () => {
    // Use requestIdleCallback to avoid blocking user interactions
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        initSentry();
      });
    } else {
      // Fallback: small delay to ensure page is interactive
      setTimeout(() => {
        initSentry();
      }, 100);
    }
  };

  // Initialize based on document ready state
  if (document.readyState === 'complete') {
    // Page already loaded, initialize immediately
    initAfterLoad();
  } else {
    // Wait for page load
    window.addEventListener('load', initAfterLoad);
  }
}

/**
 * Capture an exception and eagerly load Sentry if needed
 * Useful for error boundaries that need immediate error reporting
 */
export async function captureException(error: Error) {
  if (!sentryInitialized) {
    await initSentry();
  }

  if (sentryInitialized) {
    const Sentry = await import('@sentry/nextjs');
    Sentry.captureException(error);
  } else {
    // Fallback: log to console if Sentry failed to initialize
    logger.error('LazyMonitoring: Sentry not available, logging error', { error });
  }
}
