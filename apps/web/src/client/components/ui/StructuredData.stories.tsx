import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StructuredData } from '../StructuredData';

const meta = {
  title: 'UI/StructuredData',
  component: StructuredData,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Renders JSON-LD structured data for SEO. This component outputs a script tag with structured data that is invisible to users but readable by search engines.',
      },
    },
  },
} satisfies Meta<typeof StructuredData>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OrganizationSchema: Story = {
  args: {
    data: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Example Organization',
      url: 'https://www.example.com',
      logo: 'https://www.example.com/logo.png',
      description: 'An example organization',
    },
  },
  decorators: [
    Story => (
      <div>
        <Story />
        <div className="rounded border border-gray-300 bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            Structured data has been added to the page (invisible to users, visible to search engines).
            Check the page source or browser dev tools to see the JSON-LD script tag.
          </p>
        </div>
      </div>
    ),
  ],
};

export const WebsiteSchema: Story = {
  args: {
    data: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Example Website',
      url: 'https://www.example.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.example.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  },
  decorators: [
    Story => (
      <div>
        <Story />
        <div className="rounded border border-gray-300 bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            Website schema with search action. This tells search engines about your site's search functionality.
          </p>
        </div>
      </div>
    ),
  ],
};

export const BreadcrumbSchema: Story = {
  args: {
    data: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.example.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Products',
          item: 'https://www.example.com/products',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Product Name',
          item: 'https://www.example.com/products/product-name',
        },
      ],
    },
  },
  decorators: [
    Story => (
      <div>
        <Story />
        <div className="rounded border border-gray-300 bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            Breadcrumb navigation schema. This helps search engines understand your site structure.
          </p>
        </div>
      </div>
    ),
  ],
};

export const ArticleSchema: Story = {
  args: {
    data: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Example Article Title',
      author: {
        '@type': 'Person',
        name: 'John Doe',
      },
      datePublished: '2025-01-01',
      dateModified: '2025-01-15',
      image: 'https://www.example.com/article-image.jpg',
      publisher: {
        '@type': 'Organization',
        name: 'Example Publisher',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.example.com/logo.png',
        },
      },
    },
  },
  decorators: [
    Story => (
      <div>
        <Story />
        <div className="rounded border border-gray-300 bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            Article schema with author, dates, and publisher information. Useful for blog posts and news articles.
          </p>
        </div>
      </div>
    ),
  ],
};

export const MultipleSchemas: Story = {
  args: {
    data: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Example Org',
    },
  },
  decorators: [
    _Story => (
      <div>
        <StructuredData
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Example Org',
          }}
        />
        <StructuredData
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Example Site',
          }}
        />
        <div className="rounded border border-gray-300 bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            Multiple StructuredData components can be used on the same page for different schema types.
          </p>
        </div>
      </div>
    ),
  ],
};
