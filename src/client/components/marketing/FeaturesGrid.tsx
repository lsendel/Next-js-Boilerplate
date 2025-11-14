import type { ReactNode } from 'react';

export type Feature = {
  icon: ReactNode;
  title: string;
  description: string;
};

export type FeaturesGridProps = {
  title?: string;
  description?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
};

/**
 * Features Grid Section
 *
 * A responsive grid layout showcasing product features with icons.
 * Perfect for highlighting key benefits and capabilities.
 */
export function FeaturesGrid({
  title,
  description,
  features,
  columns = 3,
}: FeaturesGridProps) {
  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[columns];

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

        {/* Features Grid */}
        <div className={`mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 ${gridCols}`}>
          {features.map(feature => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-blue-500 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white transition-transform group-hover:scale-110">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-base leading-7 text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
