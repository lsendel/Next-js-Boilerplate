/**
 * Client-side instrumentation for Sentry
 *
 * IMPORTANT: This file is intentionally minimal to reduce First Load JS.
 * Client-side Sentry is now lazy-loaded via src/libs/LazyMonitoring.ts
 * after the page becomes interactive, saving ~259 KB from the initial bundle.
 *
 * Server-side Sentry initialization remains in src/instrumentation.ts
 * and runs immediately to capture SSR/API errors.
 *
 * Trade-off: Router transition tracking is disabled to avoid loading Sentry
 * immediately. Navigation errors will still be caught by the lazy-loaded Sentry
 * after page interactive. This is acceptable for 30% performance gain.
 *
 * Migration: Moved from immediate initialization to lazy loading
 * Date: Sprint 3 Day 3 - Performance Optimization
 */

// Intentionally no Sentry import to prevent eager loading
// Router transition tracking disabled as acceptable trade-off for bundle size
// See src/libs/LazyMonitoring.ts for the lazy loading implementation
