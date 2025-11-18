;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="4d3fc5c8-61bf-a774-abab-3296e3bae0cc")}catch(e){}}();
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/.pnpm/next-intl@4.5.3_@swc+helpers@0.5.17_next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1_cfa378505ff7bbb395b2967dbee90810/node_modules/next-intl/dist/esm/development/routing/defineRouting.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>defineRouting
]);
function defineRouting(config) {
    if (config.domains) {
        validateUniqueLocalesPerDomain(config.domains);
    }
    return config;
}
function validateUniqueLocalesPerDomain(domains) {
    const domainsByLocale = new Map();
    for (const { domain, locales } of domains){
        for (const locale of locales){
            const localeDomains = domainsByLocale.get(locale) || new Set();
            localeDomains.add(domain);
            domainsByLocale.set(locale, localeDomains);
        }
    }
    const duplicateLocaleMessages = Array.from(domainsByLocale.entries()).filter((param)=>{
        let [, localeDomains] = param;
        return localeDomains.size > 1;
    }).map((param)=>{
        let [locale, localeDomains] = param;
        return `- "${locale}" is used by: ${Array.from(localeDomains).join(', ')}`;
    });
    if (duplicateLocaleMessages.length > 0) {
        console.warn('Locales are expected to be unique per domain, but found overlap:\n' + duplicateLocaleMessages.join('\n') + '\nPlease see https://next-intl.dev/docs/routing/configuration#domains');
    }
}
;
}),
"[project]/node_modules/.pnpm/next-intl@4.5.3_@swc+helpers@0.5.17_next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1_cfa378505ff7bbb395b2967dbee90810/node_modules/next-intl/dist/esm/development/routing/defineRouting.js [app-client] (ecmascript) <export default as defineRouting>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defineRouting",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$intl$40$4$2e$5$2e$3_$40$swc$2b$helpers$40$0$2e$5$2e$17_next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1_cfa378505ff7bbb395b2967dbee90810$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$intl$40$4$2e$5$2e$3_$40$swc$2b$helpers$40$0$2e$5$2e$17_next$40$16$2e$0$2e$3_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1_cfa378505ff7bbb395b2967dbee90810$2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-intl@4.5.3_@swc+helpers@0.5.17_next@16.0.3_@babel+core@7.28.5_@opentelemetry+api@1_cfa378505ff7bbb395b2967dbee90810/node_modules/next-intl/dist/esm/development/routing/defineRouting.js [app-client] (ecmascript)");
}),
]);

//# debugId=4d3fc5c8-61bf-a774-abab-3296e3bae0cc
//# sourceMappingURL=15ba1_next-intl_dist_esm_development_routing_defineRouting_230d3cf8.js.map