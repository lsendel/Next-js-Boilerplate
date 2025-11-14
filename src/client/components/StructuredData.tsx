/* eslint-disable react-dom/no-dangerously-set-innerhtml */
/**
 * Structured Data Component
 *
 * Render JSON-LD script tag for structured data.
 * Usage: <StructuredData data={generateOrganizationSchema(...)} />
 */
export function StructuredData({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
