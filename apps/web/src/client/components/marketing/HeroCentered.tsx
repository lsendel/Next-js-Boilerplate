import type { ReactNode } from 'react';

export type HeroCenteredProps = {
  title: string;
  description: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  badge?: ReactNode;
};

/**
 * Centered Hero Section
 *
 * A clean, centered hero section perfect for landing pages.
 * Features optional badge, title, description, and dual CTAs.
 */
export function HeroCentered({
  title,
  description,
  primaryCta,
  secondaryCta,
  badge,
}: HeroCenteredProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white px-6 py-24 sm:py-32 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute top-0 left-[max(50%,25rem)] h-[64rem] w-[128rem] -translate-x-1/2 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)] stroke-gray-200"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="hero-pattern"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#hero-pattern)" />
        </svg>
      </div>

      <div className="mx-auto max-w-4xl text-center">
        {/* Badge */}
        {badge && (
          <div className="mb-8 inline-flex justify-center">
            {badge}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          {title}
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg leading-8 text-gray-600">
          {description}
        </p>

        {/* CTAs */}
        {(primaryCta || secondaryCta) && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            {primaryCta && (
              <a
                href={primaryCta.href}
                className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {primaryCta.text}
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50"
              >
                {secondaryCta.text}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
