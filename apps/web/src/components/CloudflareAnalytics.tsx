'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { isServiceEnabled, getServiceConfig } from '@/utils/MonitoringConfig';

/**
 * Cloudflare Web Analytics Component
 * 
 * Privacy-friendly analytics without cookies or personal data collection.
 * Complies with GDPR, CCPA, and other privacy regulations.
 * 
 * Enable via environment variable:
 * NEXT_PUBLIC_ENABLE_CF_ANALYTICS=true
 * NEXT_PUBLIC_CF_ANALYTICS_TOKEN=your_token
 * 
 * Get your token from:
 * Cloudflare Dashboard > Analytics > Web Analytics
 */
export function CloudflareAnalytics() {
  const enabled = isServiceEnabled('cloudflare');
  const config = getServiceConfig('cloudflare');

  useEffect(() => {
    if (enabled && config.token) {
      // Initialize Cloudflare Analytics Engine for custom events
      if (config.analyticsEngine) {
        (window as any).cfAnalytics = {
          track: (eventName: string, properties?: Record<string, unknown>) => {
            // Send custom events to Cloudflare Analytics Engine
            // This requires a Worker to handle the events
            if (navigator.sendBeacon) {
              const data = JSON.stringify({
                event: eventName,
                properties,
                timestamp: Date.now(),
                url: window.location.href,
                referrer: document.referrer,
              });
              navigator.sendBeacon('/api/analytics', data);
            }
          },
        };
      }
    }
  }, [enabled, config.token, config.analyticsEngine]);

  if (!enabled || !config.token) {
    return null;
  }

  return (
    <>
      {/* Cloudflare Web Analytics - Privacy-friendly, no cookies */}
      <Script
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon={JSON.stringify({ token: config.token })}
        strategy="afterInteractive"
      />
    </>
  );
}

/**
 * Hook to track custom events with Cloudflare Analytics
 * 
 * @example
 * ```tsx
 * import { useCloudflareAnalytics } from '@/components/CloudflareAnalytics';
 * 
 * function MyComponent() {
 *   const { track } = useCloudflareAnalytics();
 *   
 *   const handleClick = () => {
 *     track('button_click', { button: 'signup' });
 *   };
 *   
 *   return <button onClick={handleClick}>Sign Up</button>;
 * }
 * ```
 */
export function useCloudflareAnalytics() {
  const enabled = isServiceEnabled('cloudflare');

  const track = (eventName: string, properties?: Record<string, unknown>) => {
    if (!enabled) return;

    const cfAnalytics = (window as any).cfAnalytics;
    if (cfAnalytics?.track) {
      cfAnalytics.track(eventName, properties);
    }
  };

  return { track, enabled };
}

