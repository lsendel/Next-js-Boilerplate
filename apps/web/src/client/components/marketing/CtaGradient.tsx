export type CtaGradientProps = {
  title: string;
  description: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  gradientFrom?: string;
  gradientTo?: string;
};

/**
 * Gradient CTA Banner
 *
 * An eye-catching CTA section with vibrant gradient background.
 * Perfect for high-conversion actions and product launches.
 */
export function CtaGradient({
  title,
  description,
  primaryCta,
  secondaryCta,
  gradientFrom = 'from-blue-600',
  gradientTo = 'to-purple-600',
}: CtaGradientProps) {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
      {/* Gradient Background */}
      <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${gradientFrom} ${gradientTo}`} />

      {/* Decorative Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-[-20%] h-[300px] w-[300px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-[-20%] bottom-0 h-[300px] w-[300px] rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/90">
          {description}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <a
            href={primaryCta.href}
            className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-100 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {primaryCta.text}
          </a>
          {secondaryCta && (
            <a
              href={secondaryCta.href}
              className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/20"
            >
              {secondaryCta.text}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
