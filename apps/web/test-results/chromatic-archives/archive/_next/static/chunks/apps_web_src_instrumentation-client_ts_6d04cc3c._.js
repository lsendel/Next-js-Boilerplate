;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="513f106f-0d90-af2e-9c6f-56100ea0bf60")}catch(e){}}();
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/instrumentation-client.ts [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

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
 */ // Intentionally no Sentry import to prevent eager loading
// Router transition tracking disabled as acceptable trade-off for bundle size
// See src/libs/LazyMonitoring.ts for the lazy loading implementation
;
globalThis["_sentryRouteManifest"] = "{\"dynamicRoutes\":[{\"path\":\"/:locale/sign-in/:sign-in*?\",\"regex\":\"^/([^/]+)/sign-in(?:/(.*))?$\",\"paramNames\":[\"locale\",\"sign-in\"],\"hasOptionalPrefix\":true},{\"path\":\"/:locale/sign-up/:sign-up*?\",\"regex\":\"^/([^/]+)/sign-up(?:/(.*))?$\",\"paramNames\":[\"locale\",\"sign-up\"],\"hasOptionalPrefix\":true},{\"path\":\"/:locale/dashboard\",\"regex\":\"^/([^/]+)/dashboard$\",\"paramNames\":[\"locale\"],\"hasOptionalPrefix\":true},{\"path\":\"/:locale/dashboard/user-profile/:user-profile*?\",\"regex\":\"^/([^/]+)/dashboard/user-profile(?:/(.*))?$\",\"paramNames\":[\"locale\",\"user-profile\"],\"hasOptionalPrefix\":true},{\"path\":\"/:locale\",\"regex\":\"^/([^/]+)$\",\"paramNames\":[\"locale\"],\"hasOptionalPrefix\":true},{\"path\":\"/:locale/about\",\"regex\":\"^/([^/]+)/about$\",\"paramNames\":[\"locale\"],\"hasOptionalPrefix\":true},{\"path\":\"/:locale/contact\",\"regex\":\"^/([^/]+)/contact$\",\"paramNames\":[\"locale\"],\"hasOptionalPrefix\":true},{\"path\":\"/:locale/counter\",\"regex\":\"^/([^/]+)/counter$\",\"paramNames\":[\"locale\"],\"hasOptionalPrefix\":true},{\"path\":\"/:locale/features\",\"regex\":\"^/([^/]+)/features$\",\"paramNames\":[\"locale\"],\"hasOptionalPrefix\":true},{\"path\":\"/:locale/landing\",\"regex\":\"^/([^/]+)/landing$\",\"paramNames\":[\"locale\"],\"hasOptionalPrefix\":true},{\"path\":\"/:locale/portfolio\",\"regex\":\"^/([^/]+)/portfolio$\",\"paramNames\":[\"locale\"],\"hasOptionalPrefix\":true},{\"path\":\"/:locale/portfolio/:slug\",\"regex\":\"^/([^/]+)/portfolio/([^/]+)$\",\"paramNames\":[\"locale\",\"slug\"],\"hasOptionalPrefix\":true},{\"path\":\"/:locale/pricing\",\"regex\":\"^/([^/]+)/pricing$\",\"paramNames\":[\"locale\"],\"hasOptionalPrefix\":true}],\"staticRoutes\":[]}";
globalThis["_sentryNextJsVersion"] = "16.0.3";
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# debugId=513f106f-0d90-af2e-9c6f-56100ea0bf60
//# sourceMappingURL=apps_web_src_instrumentation-client_ts_6d04cc3c._.js.map