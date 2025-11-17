"use client";

import { useEffect } from "react";
import { logger } from "@/libs/Logger";
import { isServiceEnabled } from "@/utils/MonitoringConfig";

/**
 * Monitoring Initialization Component
 *
 * Lazy loads Sentry monitoring after page becomes interactive.
 * This component is intentionally minimal to avoid adding to First Load JS.
 *
 * The actual initialization happens in src/libs/LazyMonitoring.ts which
 * uses requestIdleCallback to defer loading until after user interactions.
 */
export function MonitoringInit() {
  useEffect(() => {
    if (!isServiceEnabled("sentry")) {
      return;
    }

    // Dynamically import the lazy monitoring module
    // This ensures it only loads client-side and after React hydration
    import("@/libs/LazyMonitoring").catch((error) => {
      logger.error("MonitoringInit failed to load lazy monitoring", { error });
    });
  }, []);

  // This component renders nothing - it only triggers the lazy load
  return null;
}
