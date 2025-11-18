'use client';

import { useCallback } from 'react';
import { isServiceEnabled } from '@/utils/MonitoringConfig';

/**
 * Hook to track custom events with Cloudflare Analytics.
 *
 * @example
 * ```tsx
 * import { useCloudflareAnalytics } from '@/hooks/useCloudflareAnalytics';
 *
 * function MyComponent() {
 *   const { track } = useCloudflareAnalytics();
 *   track('button_click');
 * }
 * ```
 */
export function useCloudflareAnalytics() {
  const enabled = isServiceEnabled('cloudflare');

  const track = useCallback(
    (eventName: string, properties?: Record<string, unknown>) => {
      if (!enabled) {
        return;
      }

      const cfAnalytics = (window as any).cfAnalytics;
      if (cfAnalytics?.track) {
        cfAnalytics.track(eventName, properties);
      }
    },
    [enabled],
  );

  return { track, enabled };
}
