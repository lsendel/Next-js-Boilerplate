'use client';

import { useState } from 'react';
import { TenantLink } from '@/client/components/navigation/TenantLink';

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqSectionProps = {
  title?: string;
  description?: string;
  faqs: FaqItem[];
  columns?: 1 | 2;
};

/**
 * FAQ Section Component
 *
 * An accordion-style FAQ section for answering common questions.
 * Perfect for reducing support queries and improving user experience.
 */
export function FaqSection({
  title,
  description,
  faqs,
  columns = 1,
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const gridCols = columns === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-1';

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

        {/* FAQ Items */}
        <div className={`mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 ${gridCols}`}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-gray-50"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  <svg
                    className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <p className="text-base leading-7 text-gray-700">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mx-auto mt-16 max-w-md text-center">
          <p className="text-base text-gray-600">
            Can't find the answer you're looking for?
            {' '}
            <TenantLink href="/contact" className="font-semibold text-blue-600 hover:text-blue-500">
              Contact our support team
            </TenantLink>
          </p>
        </div>
      </div>
    </section>
  );
}
