;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="08557a2c-dee3-6d60-f3f0-0bf18ab248f1")}catch(e){}}();
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/libs/Logger.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "authLogger",
    ()=>authLogger,
    "dbLogger",
    ()=>dbLogger,
    "logger",
    ()=>logger,
    "securityLogger",
    ()=>securityLogger
]);
const createClientLogger = ()=>({
        debug: ()=>{},
        info: ()=>{},
        warn: ()=>{},
        error: ()=>{}
    });
const isServer = ("TURBOPACK compile-time value", "object") === 'undefined';
let loggerInstance;
let dbLoggerInstance;
let authLoggerInstance;
let securityLoggerInstance;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    loggerInstance = createClientLogger();
    dbLoggerInstance = createClientLogger();
    authLoggerInstance = createClientLogger();
    securityLoggerInstance = createClientLogger();
}
const logger = loggerInstance;
const dbLogger = dbLoggerInstance;
const authLogger = authLoggerInstance;
const securityLogger = securityLoggerInstance;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/apps/web/src/utils/MonitoringConfig.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
 */ __turbopack_context__.s([
    "MonitoringConfig",
    ()=>MonitoringConfig,
    "getServiceConfig",
    ()=>getServiceConfig,
    "isMonitoringEnabled",
    ()=>isMonitoringEnabled,
    "isServiceEnabled",
    ()=>isServiceEnabled,
    "trackEvent",
    ()=>trackEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const MonitoringConfig = {
    // Sentry - Error tracking and performance monitoring
    sentry: {
        enabled: ("TURBOPACK compile-time value", "false") === 'true',
        dsn: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SENTRY_DSN || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.SENTRY_DSN,
        environment: ("TURBOPACK compile-time value", "development"),
        // Only enable in production by default
        defaultEnabled: ("TURBOPACK compile-time value", "development") === 'production',
        // Sample rate for performance monitoring (0.0 to 1.0)
        tracesSampleRate: Number.parseFloat(("TURBOPACK compile-time value", "0.1") || '0.1'),
        // Sample rate for session replay (0.0 to 1.0)
        replaysSessionSampleRate: Number.parseFloat(("TURBOPACK compile-time value", "0.1") || '0.1'),
        replaysOnErrorSampleRate: Number.parseFloat(("TURBOPACK compile-time value", "1.0") || '1.0')
    },
    // PostHog - Product analytics and feature flags
    posthog: {
        enabled: ("TURBOPACK compile-time value", "false") === 'true',
        apiKey: ("TURBOPACK compile-time value", ""),
        apiHost: ("TURBOPACK compile-time value", "https://us.i.posthog.com") || 'https://app.posthog.com',
        // Only enable in production by default
        defaultEnabled: ("TURBOPACK compile-time value", "development") === 'production',
        // Capture pageviews automatically
        capturePageview: true,
        // Capture performance metrics
        capturePerformance: true
    },
    // Cloudflare Analytics - Privacy-friendly web analytics
    cloudflare: {
        enabled: ("TURBOPACK compile-time value", "true") === 'true',
        token: ("TURBOPACK compile-time value", ""),
        // Always enabled in production if token is provided
        defaultEnabled: ("TURBOPACK compile-time value", "development") === 'production' && !!("TURBOPACK compile-time value", ""),
        // Use Cloudflare Web Analytics (privacy-friendly, no cookies)
        webAnalytics: true,
        // Use Cloudflare Analytics Engine for custom events
        analyticsEngine: true
    },
    // Global monitoring settings
    global: {
        // Enable all monitoring in production, disable in development
        enableInProduction: true,
        enableInDevelopment: false,
        // Respect user's Do Not Track preference
        respectDoNotTrack: true,
        // Enable debug mode for troubleshooting
        debug: ("TURBOPACK compile-time value", "development") === 'development'
    }
};
function isMonitoringEnabled() {
    const { sentry, posthog, cloudflare, global } = MonitoringConfig;
    // Respect environment
    if (("TURBOPACK compile-time value", "development") === 'development' && !global.enableInDevelopment) {
        return false;
    }
    // Check if at least one service is enabled
    return sentry.enabled || posthog.enabled || cloudflare.enabled;
}
function isServiceEnabled(service) {
    const config = MonitoringConfig[service];
    // Check explicit enable flag first
    if (config.enabled !== undefined) {
        return config.enabled;
    }
    // Fall back to default enabled setting
    return config.defaultEnabled;
}
function getServiceConfig(service) {
    return MonitoringConfig[service];
}
function trackEvent(event) {
    const { name, properties = {}, timestamp = Date.now() } = event;
    // Track in PostHog
    if (isServiceEnabled('posthog') && ("TURBOPACK compile-time value", "object") !== 'undefined' && window.posthog) {
        window.posthog.capture(name, properties);
    }
    // Track in Cloudflare Analytics Engine
    if (isServiceEnabled('cloudflare') && ("TURBOPACK compile-time value", "object") !== 'undefined' && window.cfAnalytics) {
        window.cfAnalytics.track(name, {
            ...properties,
            timestamp
        });
    }
    // Track in Sentry as breadcrumb
    if (isServiceEnabled('sentry') && ("TURBOPACK compile-time value", "object") !== 'undefined' && window.Sentry) {
        window.Sentry.addBreadcrumb({
            category: 'event',
            message: name,
            data: properties,
            timestamp: timestamp / 1000
        });
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/libs/LazyMonitoring.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
 */ __turbopack_context__.s([
    "captureException",
    ()=>captureException
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$Logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/libs/Logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$utils$2f$MonitoringConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/utils/MonitoringConfig.ts [app-client] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$Logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$Logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
let sentryInitialized = false;
/**
 * Initialize Sentry client-side monitoring
 * Called automatically after page load
 */ async function initSentry() {
    // Skip if already initialized or on server
    if (sentryInitialized || ("TURBOPACK compile-time value", "object") === 'undefined') {
        return;
    }
    // Skip if Sentry is disabled via feature flags
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$utils$2f$MonitoringConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isServiceEnabled"])('sentry')) {
        return;
    }
    try {
        const Sentry = await __turbopack_context__.A("[project]/node_modules/.pnpm/@sentry+nextjs@10.25.0_@opentelemetry+context-async-hooks@2.2.0_@opentelemetry+api@1.9._5c7fef5791beabe4949478aedcf57b38/node_modules/@sentry/nextjs/build/esm/index.client.js [app-client] (ecmascript, async loader)");
        const sentryConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$utils$2f$MonitoringConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getServiceConfig"])('sentry');
        if (!sentryConfig.dsn) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$Logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn('LazyMonitoring: Sentry enabled but DSN is not configured. Skipping initialization.');
            return;
        }
        Sentry.init({
            dsn: sentryConfig.dsn,
            // Add optional integrations for additional features
            integrations: [
                Sentry.replayIntegration(),
                Sentry.consoleLoggingIntegration(),
                Sentry.browserTracingIntegration(),
                ...("TURBOPACK compile-time truthy", 1) ? [
                    Sentry.spotlightBrowserIntegration()
                ] : "TURBOPACK unreachable"
            ],
            // Adds request headers and IP for users
            sendDefaultPii: true,
            // Define how likely traces are sampled
            tracesSampleRate: sentryConfig.tracesSampleRate,
            // Define how likely Replay events are sampled
            replaysSessionSampleRate: sentryConfig.replaysSessionSampleRate,
            // Define how likely Replay events are sampled when an error occurs
            replaysOnErrorSampleRate: sentryConfig.replaysOnErrorSampleRate,
            // Enable logs to be sent to Sentry
            enableLogs: true,
            // Debug mode
            debug: false
        });
        sentryInitialized = true;
        if ("TURBOPACK compile-time truthy", 1) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$Logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn('LazyMonitoring: Sentry initialized after page load');
        }
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$Logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('LazyMonitoring failed to initialize Sentry', {
            error
        });
    }
}
/**
 * Auto-initialize Sentry after page load
 * Uses requestIdleCallback for better performance if available
 */ if ("TURBOPACK compile-time truthy", 1) {
    const initAfterLoad = ()=>{
        // Use requestIdleCallback to avoid blocking user interactions
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(()=>{
                initSentry();
            });
        } else {
            // Fallback: small delay to ensure page is interactive
            setTimeout(()=>{
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
async function captureException(error) {
    if (!sentryInitialized) {
        await initSentry();
    }
    if (sentryInitialized) {
        const Sentry = await __turbopack_context__.A("[project]/node_modules/.pnpm/@sentry+nextjs@10.25.0_@opentelemetry+context-async-hooks@2.2.0_@opentelemetry+api@1.9._5c7fef5791beabe4949478aedcf57b38/node_modules/@sentry/nextjs/build/esm/index.client.js [app-client] (ecmascript, async loader)");
        Sentry.captureException(error);
    } else {
        // Fallback: log to console if Sentry failed to initialize
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$Logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('LazyMonitoring: Sentry not available, logging error', {
            error
        });
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/apps/web/src/shared/config/app.config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppConfig",
    ()=>AppConfig,
    "ClerkLocalizations",
    ()=>ClerkLocalizations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$localizations$40$3$2e$28$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$clerk$2f$localizations$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+localizations@3.28.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/@clerk/localizations/dist/index.mjs [app-client] (ecmascript)");
;
const localePrefix = 'as-needed';
const AppConfig = {
    name: 'Next.js Production Boilerplate',
    locales: [
        'en',
        'fr'
    ],
    defaultLocale: 'en',
    localePrefix
};
const supportedLocales = {
    en: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$localizations$40$3$2e$28$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$clerk$2f$localizations$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enUS"],
    fr: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$localizations$40$3$2e$28$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$clerk$2f$localizations$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["frFR"]
};
const ClerkLocalizations = {
    defaultLocale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$localizations$40$3$2e$28$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$clerk$2f$localizations$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enUS"],
    supportedLocales
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/libs/I18nRouting.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "routing",
    ()=>routing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$intl$40$4$2e$5$2e$3_$40$swc$2b$helpers$40$0$2e$5$2e$17_next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1_cfa378505ff7bbb395b2967dbee90810$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__defineRouting$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-intl@4.5.3_@swc+helpers@0.5.17_next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1_cfa378505ff7bbb395b2967dbee90810/node_modules/next-intl/dist/esm/development/routing/defineRouting.js [app-client] (ecmascript) <export default as defineRouting>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/shared/config/app.config.ts [app-client] (ecmascript)");
;
;
const routing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$intl$40$4$2e$5$2e$3_$40$swc$2b$helpers$40$0$2e$5$2e$17_next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1_cfa378505ff7bbb395b2967dbee90810$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__defineRouting$3e$__["defineRouting"])({
    locales: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppConfig"].locales,
    localePrefix: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppConfig"].localePrefix,
    defaultLocale: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$config$2f$app$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppConfig"].defaultLocale
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/app/global-error.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>GlobalError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/error.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$LazyMonitoring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/libs/LazyMonitoring.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$I18nRouting$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/libs/I18nRouting.ts [app-client] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$LazyMonitoring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$LazyMonitoring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function GlobalError(props) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(5);
    if ($[0] !== "55749af4c01f1acbf9736dcf91a2e4cb035afa5634cf74411507356ff40db260") {
        for(let $i = 0; $i < 5; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "55749af4c01f1acbf9736dcf91a2e4cb035afa5634cf74411507356ff40db260";
    }
    let t0;
    let t1;
    if ($[1] !== props.error) {
        t0 = ({
            "GlobalError[useEffect()]": ()=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$LazyMonitoring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["captureException"])(props.error);
            }
        })["GlobalError[useEffect()]"];
        t1 = [
            props.error
        ];
        $[1] = props.error;
        $[2] = t0;
        $[3] = t1;
    } else {
        t0 = $[2];
        t1 = $[3];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t0, t1);
    let t2;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
            lang: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$I18nRouting$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["routing"].defaultLocale,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    statusCode: 0
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/global-error.tsx",
                    lineNumber: 35,
                    columnNumber: 51
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/global-error.tsx",
                lineNumber: 35,
                columnNumber: 45
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/global-error.tsx",
            lineNumber: 35,
            columnNumber: 10
        }, this);
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    return t2;
}
_s(GlobalError, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = GlobalError;
var _c;
__turbopack_context__.k.register(_c, "GlobalError");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
]);

//# debugId=08557a2c-dee3-6d60-f3f0-0bf18ab248f1
//# sourceMappingURL=apps_web_src_e435f4a5._.js.map