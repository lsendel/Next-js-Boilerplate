import Image from 'next/image';

export type Testimonial = {
  quote: string;
  author: {
    name: string;
    title: string;
    company?: string;
    avatar?: {
      src: string;
      alt: string;
    };
  };
  rating?: number;
};

const RATING_POSITIONS = ['one', 'two', 'three', 'four', 'five'];

export type TestimonialsGridProps = {
  title?: string;
  description?: string;
  testimonials: Testimonial[];
  columns?: 2 | 3;
};

/**
 * Testimonials Grid Section
 *
 * A social proof section showcasing customer testimonials in a grid layout.
 * Perfect for building trust and credibility.
 */
export function TestimonialsGrid({
  title,
  description,
  testimonials,
  columns = 3,
}: TestimonialsGridProps) {
  const gridCols = columns === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3';

  return (
    <section className="bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
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

        {/* Testimonials Grid */}
        <div className={`mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 ${gridCols}`}>
          {testimonials.map(testimonial => (
            <div
              key={`${testimonial.author.name}-${testimonial.author.title}`}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Rating */}
              {testimonial.rating && (
                <div className="mb-6 flex gap-1">
                  {RATING_POSITIONS.map((position, index) => (
                    <svg
                      key={`${testimonial.author.name}-star-${position}`}
                      className={`h-5 w-5 ${index < testimonial.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}

              {/* Quote */}
              <blockquote className="text-base leading-7 text-gray-700">
                "
                {testimonial.quote}
                "
              </blockquote>

              {/* Author */}
              <div className="mt-6 flex items-center gap-4">
                {testimonial.author.avatar && (
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.author.avatar.src}
                      alt={testimonial.author.avatar.alt}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.author.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.author.title}
                    {testimonial.author.company && ` at ${testimonial.author.company}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
