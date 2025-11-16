/**
 * Centralized Monitoring Configuration
 * 
 * This file provides a single source of truth for enabling/disabling
 * monitoring services: Sentry, PostHog, and Cloudflare Analytics.
 * 
 * Enable/disable via environment variables:
 * - NEXT_PUBLIC_ENABLE_SENTRY=true/false
 * - NEXT_PUBLIC_ENABLE_POSTHOG=true/false
 * - NEXT_PUBLIC_ENABLE_CF_ANALYTICS=true/false
 */

export const MonitoringConfig = {
  // Sentry - Error tracking and performance monitoring
  sentry: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_SENTRY === 'true',
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    // Only enable in production by default
    defaultEnabled: process.env.NODE_ENV === 'production',
    // Sample rate for performance monitoring (0.0 to 1.0)
    tracesSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    // Sample rate for session replay (0.0 to 1.0)
    replaysSessionSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE || '0.1'),
    replaysOnErrorSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ERROR_SAMPLE_RATE || '1.0'),
  },

  // PostHog - Product analytics and feature flags
  posthog: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_POSTHOG === 'true',
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    apiHost: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    // Only enable in production by default
    defaultEnabled: process.env.NODE_ENV === 'production',
    // Capture pageviews automatically
    capturePageview: true,
    // Capture performance metrics
    capturePerformance: true,
  },

  // Cloudflare Analytics - Privacy-friendly web analytics
  cloudflare: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_CF_ANALYTICS === 'true',
    token: process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN,
    // Always enabled in production if token is provided
    defaultEnabled: process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN,
    // Use Cloudflare Web Analytics (privacy-friendly, no cookies)
    webAnalytics: true,
    // Use Cloudflare Analytics Engine for custom events
    analyticsEngine: true,
  },

  // Global monitoring settings
  global: {
    // Enable all monitoring in production, disable in development
    enableInProduction: true,
    enableInDevelopment: false,
    // Respect user's Do Not Track preference
    respectDoNotTrack: true,
    // Enable debug mode for troubleshooting
    debug: process.env.NODE_ENV === 'development',
  },
} as const;

/**
 * Helper function to check if any monitoring service is enabled
 */
export function isMonitoringEnabled(): boolean {
  const { sentry, posthog, cloudflare, global } = MonitoringConfig;
  
  // Respect environment
  if (process.env.NODE_ENV === 'development' && !global.enableInDevelopment) {
    return false;
  }
  
  // Check if at least one service is enabled
  return sentry.enabled || posthog.enabled || cloudflare.enabled;
}

/**
 * Helper function to check if a specific monitoring service is enabled
 */
export function isServiceEnabled(service: 'sentry' | 'posthog' | 'cloudflare'): boolean {
  const config = MonitoringConfig[service];
  
  // Check explicit enable flag first
  if (config.enabled !== undefined) {
    return config.enabled;
  }
  
  // Fall back to default enabled setting
  return config.defaultEnabled;
}

/**
 * Helper function to get monitoring configuration for a specific service
 */
export function getServiceConfig<T extends 'sentry' | 'posthog' | 'cloudflare'>(
  service: T
): typeof MonitoringConfig[T] {
  return MonitoringConfig[service];
}

/**
 * Type-safe monitoring event tracking
 */
export interface MonitoringEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

/**
 * Universal event tracking function
 * Sends events to all enabled monitoring services
 */
export function trackEvent(event: MonitoringEvent): void {
  const { name, properties = {}, timestamp = Date.now() } = event;
  
  // Track in PostHog
  if (isServiceEnabled('posthog') && typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture(name, properties);
  }
  
  // Track in Cloudflare Analytics Engine
  if (isServiceEnabled('cloudflare') && typeof window !== 'undefined' && (window as any).cfAnalytics) {
    (window as any).cfAnalytics.track(name, { ...properties, timestamp });
  }
  
  // Track in Sentry as breadcrumb
  if (isServiceEnabled('sentry') && typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.addBreadcrumb({
      category: 'event',
      message: name,
      data: properties,
      timestamp: timestamp / 1000,
    });
  }
}

