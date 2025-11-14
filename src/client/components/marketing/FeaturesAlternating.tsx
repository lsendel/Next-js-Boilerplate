import type { ReactNode } from 'react';
import Image from 'next/image';

export type AlternatingFeature = {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  benefits?: string[];
  icon?: ReactNode;
};

export type FeaturesAlternatingProps = {
  title?: string;
  description?: string;
  features: AlternatingFeature[];
};

/**
 * Features Alternating Section
 *
 * A detailed feature showcase with alternating image-text layout.
 * Perfect for in-depth product explanations and feature demonstrations.
 */
export function FeaturesAlternating({
  title,
  description,
  features,
}: FeaturesAlternatingProps) {
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

        {/* Features */}
        <div className="mt-20 space-y-24 lg:space-y-32">
          {features.map((feature, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={`${feature.title}-${feature.image.src}`}
                className={`grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 ${!isEven ? 'lg:grid-flow-dense' : ''}`}
              >
                {/* Image */}
                <div className={!isEven ? 'lg:col-start-2' : ''}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl lg:aspect-[16/10]">
                    <Image
                      src={feature.image.src}
                      alt={feature.image.alt}
                      width={feature.image.width || 1600}
                      height={feature.image.height || 1000}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className={`flex flex-col justify-center ${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  {feature.icon && (
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                      {feature.icon}
                    </div>
                  )}

                  <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    {feature.title}
                  </h3>

                  <p className="mt-4 text-lg leading-8 text-gray-600">
                    {feature.description}
                  </p>

                  {feature.benefits && feature.benefits.length > 0 && (
                    <ul className="mt-8 space-y-3">
                      {feature.benefits.map(benefit => (
                        <li key={`${feature.title}-${benefit}`} className="flex gap-3">
                          <svg
                            className="mt-1 h-5 w-5 shrink-0 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-base leading-7 text-gray-700">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
