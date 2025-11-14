import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FaqSection } from './FaqSection';

const meta = {
  title: 'Marketing/FaqSection',
  component: FaqSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
        ],
      },
    },
  },
} satisfies Meta<typeof FaqSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleFaqs = [
  {
    question: 'What is included in the free plan?',
    answer:
      'The free plan includes all core features, unlimited projects, 5GB storage, and community support. Perfect for getting started and exploring the platform.',
  },
  {
    question: 'Can I upgrade or downgrade my plan at any time?',
    answer:
      'Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades are applied at the end of your current billing cycle. No cancellation fees.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans. All payments are processed securely through Stripe.',
  },
  {
    question: 'Is there a money-back guarantee?',
    answer:
      'Yes, we offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied for any reason, contact our support team for a full refund within 30 days of purchase.',
  },
  {
    question: 'Do you offer educational or nonprofit discounts?',
    answer:
      'Yes! We provide 50% discounts for students, educators, and registered nonprofit organizations. Contact our sales team with proof of eligibility to receive your discount code.',
  },
  {
    question: 'How do I cancel my subscription?',
    answer:
      'You can cancel your subscription anytime from your account settings. Your access will continue until the end of your current billing period, and you won\'t be charged again.',
  },
];

const technicalFaqs = [
  {
    question: 'What technologies does this boilerplate use?',
    answer:
      'Built with Next.js 15, React 19, TypeScript, Tailwind CSS 4, and Drizzle ORM. Includes authentication (Clerk), testing (Vitest/Playwright), error monitoring (Sentry), and more.',
  },
  {
    question: 'How do I set up the development environment?',
    answer:
      'Clone the repo, run npm install, and npm run dev. The local database uses PGlite (no Docker needed). All environment variables are documented in .env.example.',
  },
  {
    question: 'Can I use this for commercial projects?',
    answer:
      'Yes, this boilerplate is MIT licensed. You can use it for personal or commercial projects without restrictions. Attribution is appreciated but not required.',
  },
  {
    question: 'How do I deploy to production?',
    answer:
      'Deploy to Vercel, Netlify, or any Node.js hosting platform. Configure your DATABASE_URL and other secrets. GitHub Actions are included for CI/CD pipelines.',
  },
];

/**
 * Default FAQ section with title and description
 */
export const Default: Story = {
  args: {
    title: 'Frequently asked questions',
    description:
      'Everything you need to know about our product and services. Can\'t find what you\'re looking for? Contact our support team.',
    faqs: sampleFaqs,
  },
};

/**
 * FAQ section without title/description (minimal)
 */
export const NoHeader: Story = {
  args: {
    faqs: sampleFaqs,
  },
};

/**
 * Two column layout for better space utilization
 */
export const TwoColumns: Story = {
  args: {
    title: 'Got questions? We have answers',
    description: 'Browse our most frequently asked questions below.',
    faqs: sampleFaqs,
    columns: 2,
  },
};

/**
 * Single column layout (default)
 */
export const SingleColumn: Story = {
  args: {
    title: 'Common questions',
    description: 'Find answers to the most common questions about our platform.',
    faqs: sampleFaqs,
    columns: 1,
  },
};

/**
 * Small FAQ set (3 questions)
 */
export const SmallSet: Story = {
  args: {
    title: 'Quick answers',
    description: 'The three most important things you need to know.',
    faqs: sampleFaqs.slice(0, 3),
  },
};

/**
 * Large FAQ set (8+ questions)
 */
export const LargeSet: Story = {
  args: {
    title: 'Complete FAQ',
    description: 'Comprehensive answers to all your questions.',
    faqs: [
      ...sampleFaqs,
      {
        question: 'Do you offer API access?',
        answer:
          'Yes, all paid plans include full REST API access with comprehensive documentation. Rate limits vary by plan tier.',
      },
      {
        question: 'What are your uptime guarantees?',
        answer:
          'We maintain 99.9% uptime SLA for all paid plans. Status page and incident reports are available at status.example.com.',
      },
    ],
    columns: 2,
  },
};

/**
 * Technical FAQ for developers
 */
export const TechnicalFaq: Story = {
  args: {
    title: 'Developer FAQ',
    description:
      'Technical information about the Next.js boilerplate, setup, and deployment.',
    faqs: technicalFaqs,
  },
};

/**
 * Pricing FAQ
 */
export const PricingFaq: Story = {
  args: {
    title: 'Pricing questions',
    description:
      'Common questions about plans, billing, and payments.',
    faqs: [
      {
        question: 'What is included in the free plan?',
        answer:
          'The free plan includes all core features, unlimited projects, 5GB storage, and community support. Perfect for getting started.',
      },
      {
        question: 'Can I upgrade or downgrade my plan?',
        answer:
          'Yes, you can change your plan anytime. Upgrades are immediate, downgrades apply at the end of your billing cycle.',
      },
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept all major credit cards, PayPal, and bank transfers for annual plans through our secure payment processor Stripe.',
      },
      {
        question: 'Is there a money-back guarantee?',
        answer:
          'Yes, we offer a 30-day money-back guarantee on all paid plans. Contact support for a full refund within 30 days.',
      },
    ],
  },
};

/**
 * Security FAQ
 */
export const SecurityFaq: Story = {
  args: {
    title: 'Security & Privacy',
    description:
      'Learn about our security practices and data protection measures.',
    faqs: [
      {
        question: 'How do you protect my data?',
        answer:
          'We use industry-standard encryption (AES-256), secure data centers, regular security audits, and compliance with SOC 2 Type II standards.',
      },
      {
        question: 'Is my payment information secure?',
        answer:
          'Yes, all payment data is processed through Stripe, a PCI DSS Level 1 certified provider. We never store your credit card information.',
      },
      {
        question: 'Can I export my data?',
        answer:
          'Yes, you can export all your data at any time in standard formats (JSON, CSV). Data portability is a core principle of our platform.',
      },
      {
        question: 'What is your data retention policy?',
        answer:
          'Active data is retained indefinitely. Deleted data is permanently removed after 30 days. Backups are kept for 90 days for disaster recovery.',
      },
    ],
  },
};

/**
 * Mobile viewport
 */
export const MobileView: Story = {
  args: {
    title: 'Frequently asked questions',
    description: 'Find answers to common questions.',
    faqs: sampleFaqs.slice(0, 4),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Tablet viewport with two columns
 */
export const TabletView: Story = {
  args: {
    title: 'Frequently asked questions',
    description: 'Find answers to common questions.',
    faqs: sampleFaqs,
    columns: 2,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

/**
 * Long question and answer text
 */
export const LongContent: Story = {
  args: {
    title: 'Detailed FAQ',
    faqs: [
      {
        question:
          'How do I integrate third-party authentication providers like Google, GitHub, or Microsoft with the built-in Clerk authentication system?',
        answer:
          'To integrate third-party authentication providers, navigate to your Clerk dashboard, select "Social Connections" from the sidebar, and enable your desired providers (Google, GitHub, Microsoft, Facebook, etc.). Each provider requires OAuth credentials - you\'ll need to create OAuth apps in each provider\'s developer console. Copy the Client ID and Client Secret into Clerk\'s configuration. Clerk handles the entire OAuth flow, token management, and user session creation automatically. The boilerplate is pre-configured to support any provider you enable in Clerk with zero code changes required. For custom OAuth providers not listed in Clerk, you can use the OAuth 2.0 generic connection feature.',
      },
      {
        question:
          'What is the recommended approach for handling database migrations in production deployments?',
        answer:
          'For production deployments, we recommend a blue-green deployment strategy with automatic migrations. The boilerplate includes Drizzle Kit for migration management. Generate migrations locally with npm run db:generate after schema changes. Commit migrations to version control. During deployment, migrations run automatically via the instrumentation.ts file before the application starts. For zero-downtime deployments, use backward-compatible migrations (additive changes only), deploy the code with new schema, then remove old columns in a subsequent deployment. Always test migrations in staging environments that mirror production data volumes. Use database backups before applying migrations. Consider using migration tools like Flyway or Liquibase for enterprise environments requiring advanced rollback capabilities.',
      },
    ],
  },
};
