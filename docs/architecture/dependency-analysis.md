# Component Dependency Analysis

Generated: 2025-11-16T11:38:35.065Z

## Summary

- **Total Files**: 116
- **Circular Dependencies**: 1
- **Orphaned Files**: 83
- **High-Impact Files**: 10

## Circular Dependencies

### LOW Severity

Cycle:
- Processed 116 files (899ms) (61 warnings)

## High-Impact Components

Files imported by many other files (potential bottlenecks):

| File | Dependents |
|------|------------|
| libs/auth/adapters/cognito/utils.ts | 4 |
| libs/I18nRouting.ts | 3 |
| libs/auth/adapters/cognito/amplify-config.ts | 3 |
| libs/auth/adapters/ClerkAdapter.tsx | 3 |
| libs/auth/adapters/CloudflareAdapter.tsx | 3 |
| libs/auth/adapters/CognitoAdapter.tsx | 3 |
| libs/Env.ts | 2 |
| libs/auth/adapters/TestAdapter.server.ts | 2 |
| libs/auth/adapters/TestAdapter.tsx | 2 |
| libs/auth/factory.ts | 2 |

## Orphaned Files

Files with no imports and no dependents:

- app/[locale]/(auth)/(center)/layout.tsx
- app/[locale]/(auth)/(center)/sign-in/[[...sign-in]]/page.tsx
- app/[locale]/(auth)/(center)/sign-up/[[...sign-up]]/page.tsx
- app/[locale]/(auth)/dashboard/layout.tsx
- app/[locale]/(auth)/dashboard/page.tsx
- app/[locale]/(auth)/dashboard/user-profile/[[...user-profile]]/page.tsx
- app/[locale]/(auth)/layout.tsx
- app/[locale]/(marketing)/about/page.tsx
- app/[locale]/(marketing)/contact/page.tsx
- app/[locale]/(marketing)/counter/page.tsx
- app/[locale]/(marketing)/features/page.tsx
- app/[locale]/(marketing)/landing/page.tsx
- app/[locale]/(marketing)/layout.tsx
- app/[locale]/(marketing)/page.tsx
- app/[locale]/(marketing)/portfolio/[slug]/page.tsx
- app/[locale]/(marketing)/portfolio/page.tsx
- app/[locale]/(marketing)/pricing/page.tsx
- app/[locale]/api/counter/route.ts
- app/[locale]/layout.tsx
- app/api/auth/csrf/route.ts
- app/api/auth/user/route.ts
- app/api/auth/validate-password/route.ts
- app/api/test-auth/signin/route.ts
- app/api/test-auth/signout/route.ts
- app/api/test-auth/signup/route.ts
- app/api/test-auth/user/route.ts
- app/global-error.tsx
- app/robots.ts
- app/sitemap.ts
- client/components/MonitoringInit.tsx
- client/components/StructuredData.tsx
- client/components/forms/CounterForm.tsx
- client/components/forms/CurrentCount.tsx
- client/components/marketing/CtaGradient.tsx
- client/components/marketing/CtaSimple.tsx
- client/components/marketing/FaqSection.tsx
- client/components/marketing/FeaturesAlternating.tsx
- client/components/marketing/FeaturesGrid.tsx
- client/components/marketing/HeroCentered.tsx
- client/components/marketing/HeroGradient.tsx
- client/components/marketing/HeroWithImage.tsx
- client/components/marketing/PricingTable.tsx
- client/components/marketing/TestimonialsGrid.tsx
- client/components/navigation/TenantLink.tsx
- client/components/ui/DemoBadge.tsx
- client/components/ui/DemoBanner.tsx
- client/components/ui/LocaleSwitcher.tsx
- client/providers/PostHogPageView.tsx
- instrumentation-client.ts
- instrumentation.ts
- libs/Arcjet.ts
- libs/LazyMonitoring.ts
- libs/api/counter.ts
- libs/auth/adapters/ClerkAdapter.tsx
- libs/auth/adapters/TestAdapter.server.ts
- libs/auth/security/csrf.ts
- libs/auth/security/password-breach.ts
- libs/auth/security/rate-limit.ts
- libs/auth/types.ts
- libs/services/counter.service.ts
- middleware/layers/security.ts
- middleware/utils/tenant.ts
- server/api/services/auth.service.ts
- server/api/services/email.service.ts
- server/api/services/user.service.ts
- server/db/DB.ts
- server/db/models/Schema.ts
- server/db/repositories/session.repository.ts
- server/db/repositories/user.repository.ts
- server/lib/db-connection.ts
- server/lib/security-logger.ts
- shared/config/app.config.ts
- shared/constants/tenant.ts
- shared/hooks/useTenantPath.ts
- shared/utils/crypto.ts
- shared/utils/format.ts
- shared/utils/structuredData.ts
- shared/utils/tenant-client-path.ts
- shared/utils/validation.ts
- shared/validators/counter.validator.ts
- templates/BaseTemplate.tsx
- types/I18n.ts
- utils/MonitoringConfig.ts

## Recommendations

- **Fix circular dependencies**: Refactor to break cycles
- **Monitor high-impact files**: Changes may affect many components
- **Review orphaned files**: Consider removing if unused
