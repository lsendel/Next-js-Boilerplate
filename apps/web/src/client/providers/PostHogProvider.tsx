'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { getServiceConfig, isServiceEnabled } from '@/utils/MonitoringConfig';
import { SuspendedPostHogPageView } from './PostHogPageView';

// Singleton flag to prevent re-initialization
let isPostHogInitialized = false;

export const PostHogProvider = (props: { children: React.ReactNode }) => {
  const enabled = isServiceEnabled('posthog');
  const posthogConfig = getServiceConfig('posthog');

  useEffect(() => {
    if (!enabled || !posthogConfig.apiKey || isPostHogInitialized) {
      return;
    }

    posthog.init(posthogConfig.apiKey, {
      api_host: posthogConfig.apiHost,
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      capture_pageleave: true, // Enable pageleave capture
    });

    isPostHogInitialized = true;
  }, [enabled, posthogConfig.apiKey, posthogConfig.apiHost]);

  if (!enabled || !posthogConfig.apiKey) {
    return props.children;
  }

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {props.children}
    </PHProvider>
  );
};
