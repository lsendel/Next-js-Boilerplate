;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="810e67a7-d46b-e9cd-bd92-6741c948c83c")}catch(e){}}();
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/apps/web/src/shared/constants/tenant.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_TENANT_SLUG",
    ()=>DEFAULT_TENANT_SLUG,
    "TENANT_CACHE_TTL_MS",
    ()=>TENANT_CACHE_TTL_MS,
    "TENANT_DOMAIN_COOKIE",
    ()=>TENANT_DOMAIN_COOKIE,
    "TENANT_DOMAIN_HEADER",
    ()=>TENANT_DOMAIN_HEADER,
    "TENANT_LOCALE_COOKIE",
    ()=>TENANT_LOCALE_COOKIE,
    "TENANT_LOCALE_HEADER",
    ()=>TENANT_LOCALE_HEADER,
    "TENANT_SLUG_COOKIE",
    ()=>TENANT_SLUG_COOKIE,
    "TENANT_SLUG_HEADER",
    ()=>TENANT_SLUG_HEADER,
    "TENANT_SOURCE_HEADER",
    ()=>TENANT_SOURCE_HEADER
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const DEFAULT_TENANT_SLUG = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.MULTI_TENANT_DEFAULT_SLUG ?? 'public';
const TENANT_CACHE_TTL_MS = Number(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.TENANT_CACHE_TTL_MS ?? 60000);
const TENANT_SLUG_COOKIE = 'tenant_slug';
const TENANT_LOCALE_COOKIE = 'tenant_locale';
const TENANT_DOMAIN_COOKIE = 'tenant_domain';
const TENANT_SLUG_HEADER = 'x-tenant-slug';
const TENANT_LOCALE_HEADER = 'x-tenant-locale';
const TENANT_SOURCE_HEADER = 'x-tenant-source';
const TENANT_DOMAIN_HEADER = 'x-tenant-domain';
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/shared/utils/tenant-client-path.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "resolveTenantClientPath",
    ()=>resolveTenantClientPath
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$I18nRouting$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/libs/I18nRouting.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$constants$2f$tenant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/shared/constants/tenant.ts [app-client] (ecmascript)");
;
;
const readCookie = (name)=>{
    if (typeof document === 'undefined') {
        return null;
    }
    const cookieMatch = document.cookie.split(';').map((entry)=>entry.trim()).find((entry)=>entry.startsWith(`${name}=`));
    if (!cookieMatch) {
        return null;
    }
    return decodeURIComponent(cookieMatch.split('=').slice(1).join('='));
};
const getClientContext = ()=>{
    if (typeof document === 'undefined') {
        return {
            slug: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$constants$2f$tenant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_TENANT_SLUG"],
            locale: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$I18nRouting$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["routing"].defaultLocale,
            domain: null
        };
    }
    return {
        slug: readCookie(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$constants$2f$tenant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TENANT_SLUG_COOKIE"]) ?? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$constants$2f$tenant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_TENANT_SLUG"],
        locale: readCookie(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$constants$2f$tenant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TENANT_LOCALE_COOKIE"]) ?? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$I18nRouting$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["routing"].defaultLocale,
        domain: readCookie(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$constants$2f$tenant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TENANT_DOMAIN_COOKIE"])
    };
};
const normalizePath = (path)=>{
    if (!path || path === '/') {
        return '/';
    }
    return path.startsWith('/') ? path : `/${path}`;
};
const buildLocalizedPath = (path, locale)=>{
    if (locale === __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$I18nRouting$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["routing"].defaultLocale) {
        return path;
    }
    if (path === '/') {
        return `/${locale}`;
    }
    return `/${locale}${path}`;
};
const resolveTenantClientPath = (path, options)=>{
    const context = (options === null || options === void 0 ? void 0 : options.context) ?? getClientContext();
    const normalizedPath = normalizePath(path);
    const locale = (options === null || options === void 0 ? void 0 : options.locale) ?? context.locale;
    const localizedPath = buildLocalizedPath(normalizedPath, locale);
    const shouldPrefixSlug = context.slug && context.slug !== __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$constants$2f$tenant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_TENANT_SLUG"] && !context.domain;
    if (!shouldPrefixSlug) {
        return localizedPath;
    }
    if (localizedPath === '/') {
        return `/${context.slug}`;
    }
    return `/${context.slug}${localizedPath}`;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/shared/hooks/useTenantPath.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTenantPath",
    ()=>useTenantPath
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$use$2d$intl$40$4$2e$5$2e$3_react$40$19$2e$2$2e$0$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/use-intl@4.5.3_react@19.2.0/node_modules/use-intl/dist/esm/development/react.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$tenant$2d$client$2d$path$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/shared/utils/tenant-client-path.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const useTenantPath = ()=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "ed268337f9479ae7f25337ebd044d784e5be7e50ddd0e5025f0ba49c4e32b081") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "ed268337f9479ae7f25337ebd044d784e5be7e50ddd0e5025f0ba49c4e32b081";
    }
    const locale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$use$2d$intl$40$4$2e$5$2e$3_react$40$19$2e$2$2e$0$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    let t0;
    if ($[1] !== locale) {
        t0 = (path, t1)=>{
            const options = t1 === undefined ? {} : t1;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$tenant$2d$client$2d$path$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveTenantClientPath"])(path, {
                locale: options.locale ?? locale
            });
        };
        $[1] = locale;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    return t0;
};
_s(useTenantPath, "ubkSS9Gz1bw7UV2c73rm/bCUdh8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$use$2d$intl$40$4$2e$5$2e$3_react$40$19$2e$2$2e$0$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/client/components/navigation/TenantLink.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TenantLink",
    ()=>TenantLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$hooks$2f$useTenantPath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/shared/hooks/useTenantPath.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const isInternalPath = (value)=>{
    return typeof value === 'string' && value.startsWith('/');
};
function TenantLink(props) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(15);
    if ($[0] !== "760d2e4774d54f913ce4b43f4a56e804eeaf388253c18f797a02cdccf08ff3aa") {
        for(let $i = 0; $i < 15; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "760d2e4774d54f913ce4b43f4a56e804eeaf388253c18f797a02cdccf08ff3aa";
    }
    let href;
    let localeOverride;
    let localeProp;
    let rest;
    if ($[1] !== props) {
        ({ href, locale: localeProp, localeOverride, ...rest } = props);
        $[1] = props;
        $[2] = href;
        $[3] = localeOverride;
        $[4] = localeProp;
        $[5] = rest;
    } else {
        href = $[2];
        localeOverride = $[3];
        localeProp = $[4];
        rest = $[5];
    }
    const resolvePath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$hooks$2f$useTenantPath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTenantPath"])();
    const localeValue = typeof localeProp === "string" ? localeProp : undefined;
    let t0;
    if ($[6] !== href || $[7] !== localeOverride || $[8] !== localeValue || $[9] !== resolvePath) {
        t0 = isInternalPath(href) ? resolvePath(href, {
            locale: localeOverride ?? localeValue
        }) : href;
        $[6] = href;
        $[7] = localeOverride;
        $[8] = localeValue;
        $[9] = resolvePath;
        $[10] = t0;
    } else {
        t0 = $[10];
    }
    const targetHref = t0;
    let t1;
    if ($[11] !== localeProp || $[12] !== rest || $[13] !== targetHref) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            ...rest,
            href: targetHref,
            locale: localeProp
        }, void 0, false, {
            fileName: "[project]/apps/web/src/client/components/navigation/TenantLink.tsx",
            lineNumber: 63,
            columnNumber: 10
        }, this);
        $[11] = localeProp;
        $[12] = rest;
        $[13] = targetHref;
        $[14] = t1;
    } else {
        t1 = $[14];
    }
    return t1;
}
_s(TenantLink, "N4C3So9tAHCEtCmtYFEmXrP8LL4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$hooks$2f$useTenantPath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTenantPath"]
    ];
});
_c = TenantLink;
var _c;
__turbopack_context__.k.register(_c, "TenantLink");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/libs/I18nNavigation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePathname",
    ()=>usePathname
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$intl$40$4$2e$5$2e$3_$40$swc$2b$helpers$40$0$2e$5$2e$17_next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1_cfa378505ff7bbb395b2967dbee90810$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$navigation$2f$react$2d$client$2f$createNavigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__createNavigation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-intl@4.5.3_@swc+helpers@0.5.17_next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1_cfa378505ff7bbb395b2967dbee90810/node_modules/next-intl/dist/esm/development/navigation/react-client/createNavigation.js [app-client] (ecmascript) <export default as createNavigation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$I18nRouting$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/libs/I18nRouting.ts [app-client] (ecmascript)");
;
;
const { usePathname } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$intl$40$4$2e$5$2e$3_$40$swc$2b$helpers$40$0$2e$5$2e$17_next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1_cfa378505ff7bbb395b2967dbee90810$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$navigation$2f$react$2d$client$2f$createNavigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__createNavigation$3e$__["createNavigation"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$I18nRouting$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["routing"]);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/client/components/ui/LocaleSwitcher.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LocaleSwitcher",
    ()=>LocaleSwitcher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$use$2d$intl$40$4$2e$5$2e$3_react$40$19$2e$2$2e$0$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/use-intl@4.5.3_react@19.2.0/node_modules/use-intl/dist/esm/development/react.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.56.1_babel-p_b926c862864a98e92239cf7fab3e53e7/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$I18nNavigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/libs/I18nNavigation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$I18nRouting$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/libs/I18nRouting.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const LocaleSwitcher = ()=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(8);
    if ($[0] !== "8b5cf73c9f63fd2870b234758028526f99617b81dca80549dbdd07aa01dc6be2") {
        for(let $i = 0; $i < 8; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "8b5cf73c9f63fd2870b234758028526f99617b81dca80549dbdd07aa01dc6be2";
    }
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$I18nNavigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const locale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$use$2d$intl$40$4$2e$5$2e$3_react$40$19$2e$2$2e$0$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    let t0;
    if ($[1] !== pathname || $[2] !== router) {
        t0 = (event)=>{
            router.push(`/${event.target.value}${pathname}`);
            router.refresh();
        };
        $[1] = pathname;
        $[2] = router;
        $[3] = t0;
    } else {
        t0 = $[3];
    }
    const handleChange = t0;
    let t1;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$I18nRouting$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["routing"].locales.map(_temp);
        $[4] = t1;
    } else {
        t1 = $[4];
    }
    let t2;
    if ($[5] !== handleChange || $[6] !== locale) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
            defaultValue: locale,
            onChange: handleChange,
            className: "border border-gray-300 font-medium focus:outline-hidden focus-visible:ring-3",
            "aria-label": "lang-switcher",
            children: t1
        }, void 0, false, {
            fileName: "[project]/apps/web/src/client/components/ui/LocaleSwitcher.tsx",
            lineNumber: 42,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[5] = handleChange;
        $[6] = locale;
        $[7] = t2;
    } else {
        t2 = $[7];
    }
    return t2;
};
_s(LocaleSwitcher, "HbZyCmtioPgKbitnOrzxTCYDzdg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$libs$2f$I18nNavigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$use$2d$intl$40$4$2e$5$2e$3_react$40$19$2e$2$2e$0$2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"]
    ];
});
_c = LocaleSwitcher;
function _temp(elt) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$56$2e$1_babel$2d$p_b926c862864a98e92239cf7fab3e53e7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
        value: elt,
        children: elt.toUpperCase()
    }, elt, false, {
        fileName: "[project]/apps/web/src/client/components/ui/LocaleSwitcher.tsx",
        lineNumber: 52,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "LocaleSwitcher");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# debugId=810e67a7-d46b-e9cd-bd92-6741c948c83c
//# sourceMappingURL=apps_web_src_49926767._.js.map