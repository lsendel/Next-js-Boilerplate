import type { ReactNode } from 'react';
import Image from 'next/image';

export type HeroWithImageProps = {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  badge?: ReactNode;
  imagePosition?: 'left' | 'right';
};

/**
 * Hero Section with Image
 *
 * A two-column hero section with text on one side and an image/screenshot on the other.
 * Perfect for showcasing product screenshots or app interfaces.
 */
export function HeroWithImage({
  title,
  description,
  image,
  primaryCta,
  secondaryCta,
  badge,
  imagePosition = 'right',
}: HeroWithImageProps) {
  const content = (
    <div className="flex flex-col justify-center">
      {/* Badge */}
      {badge && (
        <div className="mb-6">
          {badge}
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
        {title}
      </h1>

      {/* Description */}
      <p className="mt-6 text-lg leading-8 text-gray-600">
        {description}
      </p>

      {/* CTAs */}
      {(primaryCta || secondaryCta) && (
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6">
          {primaryCta && (
            <a
              href={primaryCta.href}
              className="rounded-lg bg-blue-600 px-6 py-3 text-center text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {primaryCta.text}
            </a>
          )}
          {secondaryCta && (
            <a
              href={secondaryCta.href}
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-base font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50"
            >
              {secondaryCta.text}
            </a>
          )}
        </div>
      )}
    </div>
  );

  const imageContent = (
    <div className="relative">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl lg:aspect-[16/9]">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width || 1600}
          height={image.height || 900}
          className="h-full w-full object-cover"
          priority
        />
      </div>
      {/* Decorative blur effect */}
      <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-tr from-blue-100 to-purple-100 opacity-30 blur-3xl" />
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className={`grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 ${imagePosition === 'left' ? 'lg:grid-flow-dense' : ''}`}>
          <div className={imagePosition === 'left' ? 'lg:col-start-2' : ''}>
            {content}
          </div>
          <div className={imagePosition === 'left' ? 'lg:col-start-1 lg:row-start-1' : ''}>
            {imageContent}
          </div>
        </div>
      </div>
    </section>
  );
}
