;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="437e0a13-8435-abad-b363-d8f3c69c71a5")}catch(e){}}();
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$Logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$Logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
    // Skip if Sentry is disabled
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SENTRY_DISABLED) {
        return;
    }
    try {
        const Sentry = await __turbopack_context__.A("[project]/node_modules/.pnpm/@sentry+nextjs@10.25.0_@opentelemetry+context-async-hooks@2.2.0_@opentelemetry+api@1.9._5c7fef5791beabe4949478aedcf57b38/node_modules/@sentry/nextjs/build/esm/index.client.js [app-client] (ecmascript, async loader)");
        Sentry.init({
            dsn: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SENTRY_DSN,
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
            tracesSampleRate: 1,
            // Define how likely Replay events are sampled
            replaysSessionSampleRate: 0.1,
            // Define how likely Replay events are sampled when an error occurs
            replaysOnErrorSampleRate: 1.0,
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
]);

//# debugId=437e0a13-8435-abad-b363-d8f3c69c71a5
//# sourceMappingURL=apps_web_src_libs_LazyMonitoring_ts_d11663fa._.js.map