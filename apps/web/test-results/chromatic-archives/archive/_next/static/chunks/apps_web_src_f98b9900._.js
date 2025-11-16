;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="575c3a55-88fc-e0a4-b797-6664522527e3")}catch(e){}}();
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/libs/Env.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Env",
    ()=>Env
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$t3$2d$oss$2b$env$2d$nextjs$40$0$2e$13$2e$8_typescript$40$5$2e$9$2e$3_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$t3$2d$oss$2f$env$2d$nextjs$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@t3-oss+env-nextjs@0.13.8_typescript@5.9.3_zod@4.1.12/node_modules/@t3-oss/env-nextjs/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/schemas.js [app-client] (ecmascript)");
;
;
const Env = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$t3$2d$oss$2b$env$2d$nextjs$40$0$2e$13$2e$8_typescript$40$5$2e$9$2e$3_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$t3$2d$oss$2f$env$2d$nextjs$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEnv"])({
    server: {
        ARCJET_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["string"]().startsWith('ajkey_').optional(),
        CLERK_SECRET_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["string"]().min(1).optional(),
        DATABASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["string"]().min(1),
        // Security
        PASSWORD_PEPPER: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["string"]().min(32).optional(),
        SECURITY_ALERT_WEBHOOK: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["string"]().url().optional(),
        ENCRYPTION_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["string"]().min(32).optional()
    },
    client: {
        NEXT_PUBLIC_APP_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["string"]().optional(),
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["string"]().min(1).optional(),
        NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["string"]().optional(),
        NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["string"]().optional(),
        NEXT_PUBLIC_POSTHOG_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["string"]().optional(),
        NEXT_PUBLIC_POSTHOG_HOST: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["string"]().optional()
    },
    shared: {
        NODE_ENV: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enum"]([
            'test',
            'development',
            'production'
        ]).optional()
    },
    // You need to destructure all the keys manually
    runtimeEnv: {
        ARCJET_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.ARCJET_KEY,
        CLERK_SECRET_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.CLERK_SECRET_KEY,
        DATABASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.DATABASE_URL,
        PASSWORD_PEPPER: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.PASSWORD_PEPPER,
        SECURITY_ALERT_WEBHOOK: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.SECURITY_ALERT_WEBHOOK,
        ENCRYPTION_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.ENCRYPTION_KEY,
        NEXT_PUBLIC_APP_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ("TURBOPACK compile-time value", "pk_test_cmVsYXhlZC10dXJrZXktNjcuY2xlcmsuYWNjb3VudHMuZGV2JA"),
        NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN,
        NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST,
        NEXT_PUBLIC_POSTHOG_KEY: ("TURBOPACK compile-time value", ""),
        NEXT_PUBLIC_POSTHOG_HOST: ("TURBOPACK compile-time value", "https://us.i.posthog.com"),
        NODE_ENV: ("TURBOPACK compile-time value", "development")
    }
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$logtape$2b$logtape$40$1$2e$2$2e$0$2f$node_modules$2f40$logtape$2f$logtape$2f$dist$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@logtape+logtape@1.2.0/node_modules/@logtape/logtape/dist/config.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$logtape$2b$logtape$40$1$2e$2$2e$0$2f$node_modules$2f40$logtape$2f$logtape$2f$dist$2f$sink$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@logtape+logtape@1.2.0/node_modules/@logtape/logtape/dist/sink.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$logtape$2b$logtape$40$1$2e$2$2e$0$2f$node_modules$2f40$logtape$2f$logtape$2f$dist$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@logtape+logtape@1.2.0/node_modules/@logtape/logtape/dist/formatter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$logtape$2b$logtape$40$1$2e$2$2e$0$2f$node_modules$2f40$logtape$2f$logtape$2f$dist$2f$logger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@logtape+logtape@1.2.0/node_modules/@logtape/logtape/dist/logger.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$Env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/libs/Env.ts [app-client] (ecmascript)");
;
;
const betterStackSink = async (record)=>{
    await fetch(`https://${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$Env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Env"].NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$Env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Env"].NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN}`
        },
        body: JSON.stringify(record)
    });
};
await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$logtape$2b$logtape$40$1$2e$2$2e$0$2f$node_modules$2f40$logtape$2f$logtape$2f$dist$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["configure"])({
    sinks: {
        console: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$logtape$2b$logtape$40$1$2e$2$2e$0$2f$node_modules$2f40$logtape$2f$logtape$2f$dist$2f$sink$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConsoleSink"])({
            formatter: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$logtape$2b$logtape$40$1$2e$2$2e$0$2f$node_modules$2f40$logtape$2f$logtape$2f$dist$2f$formatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getJsonLinesFormatter"])()
        }),
        betterStack: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$logtape$2b$logtape$40$1$2e$2$2e$0$2f$node_modules$2f40$logtape$2f$logtape$2f$dist$2f$sink$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromAsyncSink"])(betterStackSink)
    },
    loggers: [
        {
            category: [
                'logtape',
                'meta'
            ],
            sinks: [
                'console'
            ],
            lowestLevel: 'warning'
        },
        {
            category: [
                'app'
            ],
            sinks: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$Env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Env"].NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN && __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$Env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Env"].NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST ? [
                'console',
                'betterStack'
            ] : [
                'console'
            ],
            lowestLevel: 'debug'
        },
        {
            category: [
                'app',
                'db'
            ],
            sinks: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$Env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Env"].NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN && __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$Env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Env"].NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST ? [
                'console',
                'betterStack'
            ] : [
                'console'
            ],
            lowestLevel: 'debug'
        },
        {
            category: [
                'app',
                'auth'
            ],
            sinks: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$Env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Env"].NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN && __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$Env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Env"].NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST ? [
                'console',
                'betterStack'
            ] : [
                'console'
            ],
            lowestLevel: 'debug'
        },
        {
            category: [
                'app',
                'security'
            ],
            sinks: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$Env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Env"].NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN && __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$Env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Env"].NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST ? [
                'console',
                'betterStack'
            ] : [
                'console'
            ],
            lowestLevel: 'debug'
        }
    ]
});
const logger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$logtape$2b$logtape$40$1$2e$2$2e$0$2f$node_modules$2f40$logtape$2f$logtape$2f$dist$2f$logger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLogger"])([
    'app'
]);
const dbLogger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$logtape$2b$logtape$40$1$2e$2$2e$0$2f$node_modules$2f40$logtape$2f$logtape$2f$dist$2f$logger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLogger"])([
    'app',
    'db'
]);
const authLogger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$logtape$2b$logtape$40$1$2e$2$2e$0$2f$node_modules$2f40$logtape$2f$logtape$2f$dist$2f$logger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLogger"])([
    'app',
    'auth'
]);
const securityLogger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$logtape$2b$logtape$40$1$2e$2$2e$0$2f$node_modules$2f40$logtape$2f$logtape$2f$dist$2f$logger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLogger"])([
    'app',
    'security'
]);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
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

//# debugId=575c3a55-88fc-e0a4-b797-6664522527e3
//# sourceMappingURL=apps_web_src_f98b9900._.js.map