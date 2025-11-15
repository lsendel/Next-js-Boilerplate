import type { ReactNode } from 'react';
import { TenantLink } from '@/client/components/navigation/TenantLink';

export type PricingTier = {
  name: string;
  price: {
    monthly: number;
    yearly?: number;
    currency?: string;
  };
  description: string;
  features: string[];
  cta: {
    text: string;
    href: string;
  };
  highlighted?: boolean;
  badge?: ReactNode;
};

export type PricingTableProps = {
  title?: string;
  description?: string;
  tiers: PricingTier[];
  billingPeriod?: 'monthly' | 'yearly';
  showBillingToggle?: boolean;
};

/**
 * Pricing Table Section
 *
 * A comprehensive pricing table showcasing different subscription tiers.
 * Perfect for SaaS products and subscription-based services.
 */
export function PricingTable({
  title,
  description,
  tiers,
  billingPeriod = 'monthly',
  showBillingToggle = false,
}: PricingTableProps) {
  return (
    <section className="bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        {(title || description) && (
          <div className="mx-auto max-w-2xl text-center">
            {title && (
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-lg leading-8 text-gray-600">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Billing Toggle */}
        {showBillingToggle && (
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
              <button
                type="button"
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                  billingPeriod === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                  billingPeriod === 'yearly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="ml-1.5 inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier) => {
            const price = billingPeriod === 'yearly' && tier.price.yearly
              ? tier.price.yearly
              : tier.price.monthly;
            const currency = tier.price.currency || '$';

            return (
              <div
                key={tier.name}
                className={`relative rounded-3xl p-8 ${
                  tier.highlighted
                    ? 'border-2 border-blue-600 bg-white shadow-xl ring-4 ring-blue-50'
                    : 'border border-gray-200 bg-white shadow-sm'
                }`}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-4 right-0 left-0 flex justify-center">
                    {tier.badge}
                  </div>
                )}

                {/* Header */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {tier.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {tier.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">
                      {currency}
                      {price}
                    </span>
                    <span className="text-sm font-semibold text-gray-600">
                      /
                      {billingPeriod === 'yearly' ? 'year' : 'month'}
                    </span>
                  </div>
                  {billingPeriod === 'yearly' && tier.price.yearly && (
                    <p className="mt-1 text-sm text-gray-500">
                      {currency}
                      {Math.round(tier.price.yearly / 12)}
                      /month billed annually
                    </p>
                  )}
                </div>

                {/* CTA */}
                <TenantLink
                  href={tier.cta.href}
                  className={`mb-8 block w-full rounded-lg px-6 py-3 text-center text-base font-semibold transition-colors ${
                    tier.highlighted
                      ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                      : 'border border-gray-300 bg-white text-gray-900 shadow-sm hover:bg-gray-50'
                  }`}
                >
                  {tier.cta.text}
                </TenantLink>

                {/* Features */}
                <ul className="space-y-3">
                  {tier.features.map(feature => (
                    <li key={`${tier.name}-${feature}`} className="flex gap-3">
                      <svg
                        className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Enterprise CTA */}
        <div className="mx-auto mt-16 max-w-md text-center">
          <p className="text-base text-gray-600">
            Need a custom plan for your team?
            {' '}
            <TenantLink href="/contact" className="font-semibold text-blue-600 hover:text-blue-500">
              Contact sales
            </TenantLink>
          </p>
        </div>
      </div>
    </section>
  );
}
