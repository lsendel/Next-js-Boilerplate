;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="2f98b828-d823-8c36-6ad1-a95b95ff4c57")}catch(e){}}();
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/apps/web/src/client/components/MonitoringInit.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MonitoringInit",
    ()=>MonitoringInit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$utils$2f$MonitoringConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/utils/MonitoringConfig.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function MonitoringInit() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MonitoringInit.useEffect": ()=>{
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$utils$2f$MonitoringConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isServiceEnabled"])('sentry')) {
                return;
            }
            // Dynamically import the lazy monitoring module
            // This ensures it only loads client-side and after React hydration
            __turbopack_context__.A("[project]/apps/web/src/libs/LazyMonitoring.ts [app-client] (ecmascript, async loader)").catch({
                "MonitoringInit.useEffect": (error)=>{
                    console.error('MonitoringInit failed to load lazy monitoring', error);
                }
            }["MonitoringInit.useEffect"]);
        }
    }["MonitoringInit.useEffect"], []);
    // This component renders nothing - it only triggers the lazy load
    return null;
}
_s(MonitoringInit, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = MonitoringInit;
var _c;
__turbopack_context__.k.register(_c, "MonitoringInit");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/client/providers/PostHogPageView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SuspendedPostHogPageView",
    ()=>SuspendedPostHogPageView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$js$40$1$2e$293$2e$0$2f$node_modules$2f$posthog$2d$js$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-js@1.293.0/node_modules/posthog-js/react/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const PostHogPageView = ()=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "d40568aac3967e3ce9a8dafe7baa2f687da89287baee8e549fac4c3c7ed4f78e") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "d40568aac3967e3ce9a8dafe7baa2f687da89287baee8e549fac4c3c7ed4f78e";
    }
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const posthog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$js$40$1$2e$293$2e$0$2f$node_modules$2f$posthog$2d$js$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePostHog"])();
    let t0;
    let t1;
    if ($[1] !== pathname || $[2] !== posthog || $[3] !== searchParams) {
        t0 = ()=>{
            if (pathname && posthog) {
                let url = window.origin + pathname;
                if (searchParams.toString()) {
                    url = `${url}?${searchParams.toString()}`;
                }
                posthog.capture("$pageview", {
                    $current_url: url
                });
            }
        };
        t1 = [
            pathname,
            searchParams,
            posthog
        ];
        $[1] = pathname;
        $[2] = posthog;
        $[3] = searchParams;
        $[4] = t0;
        $[5] = t1;
    } else {
        t0 = $[4];
        t1 = $[5];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t0, t1);
    return null;
};
_s(PostHogPageView, "7kj4bB2OgHwjcmUcGuRWsM2O5pE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$js$40$1$2e$293$2e$0$2f$node_modules$2f$posthog$2d$js$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePostHog"]
    ];
});
_c = PostHogPageView;
const SuspendedPostHogPageView = ()=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(2);
    if ($[0] !== "d40568aac3967e3ce9a8dafe7baa2f687da89287baee8e549fac4c3c7ed4f78e") {
        for(let $i = 0; $i < 2; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "d40568aac3967e3ce9a8dafe7baa2f687da89287baee8e549fac4c3c7ed4f78e";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
            fallback: null,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PostHogPageView, {}, void 0, false, {
                fileName: "[project]/apps/web/src/client/providers/PostHogPageView.tsx",
                lineNumber: 59,
                columnNumber: 36
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/apps/web/src/client/providers/PostHogPageView.tsx",
            lineNumber: 59,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    return t0;
};
_c1 = SuspendedPostHogPageView;
var _c, _c1;
__turbopack_context__.k.register(_c, "PostHogPageView");
__turbopack_context__.k.register(_c1, "SuspendedPostHogPageView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/client/providers/PostHogProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PostHogProvider",
    ()=>PostHogProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$js$40$1$2e$293$2e$0$2f$node_modules$2f$posthog$2d$js$2f$dist$2f$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-js@1.293.0/node_modules/posthog-js/dist/module.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$js$40$1$2e$293$2e$0$2f$node_modules$2f$posthog$2d$js$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-js@1.293.0/node_modules/posthog-js/react/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$utils$2f$MonitoringConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/utils/MonitoringConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$client$2f$providers$2f$PostHogPageView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/client/providers/PostHogPageView.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
// Singleton flag to prevent re-initialization
let isPostHogInitialized = false;
const PostHogProvider = (props)=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(8);
    if ($[0] !== "e0377fca2776778bd44ab6ae1d02cbb7535e6eded31e73b3ab068fcbbc2249f6") {
        for(let $i = 0; $i < 8; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "e0377fca2776778bd44ab6ae1d02cbb7535e6eded31e73b3ab068fcbbc2249f6";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$utils$2f$MonitoringConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isServiceEnabled"])("posthog");
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const enabled = t0;
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$utils$2f$MonitoringConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getServiceConfig"])("posthog");
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const posthogConfig = t1;
    let t2;
    let t3;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = ()=>{
            if (!enabled || !posthogConfig.apiKey || isPostHogInitialized) {
                return;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$js$40$1$2e$293$2e$0$2f$node_modules$2f$posthog$2d$js$2f$dist$2f$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].init(posthogConfig.apiKey, {
                api_host: posthogConfig.apiHost,
                capture_pageview: false,
                capture_pageleave: true
            });
            isPostHogInitialized = true;
        };
        t3 = [
            enabled,
            posthogConfig.apiKey,
            posthogConfig.apiHost
        ];
        $[3] = t2;
        $[4] = t3;
    } else {
        t2 = $[3];
        t3 = $[4];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t2, t3);
    if (!enabled || !posthogConfig.apiKey) {
        return props.children;
    }
    let t4;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$client$2f$providers$2f$PostHogPageView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SuspendedPostHogPageView"], {}, void 0, false, {
            fileName: "[project]/apps/web/src/client/providers/PostHogProvider.tsx",
            lineNumber: 63,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    let t5;
    if ($[6] !== props.children) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$js$40$1$2e$293$2e$0$2f$node_modules$2f$posthog$2d$js$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PostHogProvider"], {
            client: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$js$40$1$2e$293$2e$0$2f$node_modules$2f$posthog$2d$js$2f$dist$2f$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
            children: [
                t4,
                props.children
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/client/providers/PostHogProvider.tsx",
            lineNumber: 70,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[6] = props.children;
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    return t5;
};
_s(PostHogProvider, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = PostHogProvider;
var _c;
__turbopack_context__.k.register(_c, "PostHogProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/CloudflareAnalytics.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CloudflareAnalytics",
    ()=>CloudflareAnalytics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/script.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$utils$2f$MonitoringConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/utils/MonitoringConfig.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function CloudflareAnalytics() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "819ae14f876e7d6bbb5f568815fce5eb79595488c0c7f2094433f351a4ad61fa") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "819ae14f876e7d6bbb5f568815fce5eb79595488c0c7f2094433f351a4ad61fa";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$utils$2f$MonitoringConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isServiceEnabled"])("cloudflare");
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const enabled = t0;
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$utils$2f$MonitoringConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getServiceConfig"])("cloudflare");
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const config = t1;
    let t2;
    let t3;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = ({
            "CloudflareAnalytics[useEffect()]": ()=>{
                if (enabled && config.token) {
                    if (config.analyticsEngine) {
                        window.cfAnalytics = {
                            track: _temp
                        };
                    }
                }
            }
        })["CloudflareAnalytics[useEffect()]"];
        t3 = [
            enabled,
            config.token,
            config.analyticsEngine
        ];
        $[3] = t2;
        $[4] = t3;
    } else {
        t2 = $[3];
        t3 = $[4];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t2, t3);
    if (!enabled || !config.token) {
        return null;
    }
    let t4;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                src: "https://static.cloudflareinsights.com/beacon.min.js",
                "data-cf-beacon": JSON.stringify({
                    token: config.token
                }),
                strategy: "afterInteractive"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/CloudflareAnalytics.tsx",
                lineNumber: 72,
                columnNumber: 12
            }, this)
        }, void 0, false);
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    return t4;
}
_s(CloudflareAnalytics, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = CloudflareAnalytics;
/**
 * See `useCloudflareAnalytics` in `@/hooks/useCloudflareAnalytics` for tracking helpers.
 */ function _temp(eventName, properties) {
    if (navigator.sendBeacon) {
        const data = JSON.stringify({
            event: eventName,
            properties,
            timestamp: Date.now(),
            url: window.location.href,
            referrer: document.referrer
        });
        navigator.sendBeacon("/api/analytics", data);
    }
}
var _c;
__turbopack_context__.k.register(_c, "CloudflareAnalytics");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# debugId=2f98b828-d823-8c36-6ad1-a95b95ff4c57
//# sourceMappingURL=apps_web_src_ec3d1e6f._.js.map