import type { ReactNode } from 'react';

export type HeroGradientProps = {
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
  gradientFrom?: string;
  gradientTo?: string;
};

/**
 * Hero Section with Gradient Background
 *
 * An eye-catching hero section with a vibrant gradient background.
 * Perfect for modern SaaS products and tech startups.
 */
export function HeroGradient({
  title,
  description,
  primaryCta,
  secondaryCta,
  badge,
  gradientFrom = 'from-blue-600',
  gradientTo = 'to-purple-600',
}: HeroGradientProps) {
  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${gradientFrom} ${gradientTo} px-6 py-24 sm:py-32 lg:px-8`}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-[-40%] h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-[-40%] bottom-0 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        {/* Badge */}
        {badge && (
          <div className="mb-8 inline-flex justify-center">
            {badge}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          {title}
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg leading-8 text-white/90">
          {description}
        </p>

        {/* CTAs */}
        {(primaryCta || secondaryCta) && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            {primaryCta && (
              <a
                href={primaryCta.href}
                className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-100 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {primaryCta.text}
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/20"
              >
                {secondaryCta.text}
              </a>
            )}
          </div>
        )}

        {/* Trust indicators or additional info */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            <span>Free 14-day trial</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
