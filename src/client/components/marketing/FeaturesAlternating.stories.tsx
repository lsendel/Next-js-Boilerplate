import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FeaturesAlternating } from './FeaturesAlternating';

const meta = {
  title: 'Marketing/FeaturesAlternating',
  component: FeaturesAlternating,
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
            id: 'image-alt',
            enabled: true,
          },
        ],
      },
    },
  },
} satisfies Meta<typeof FeaturesAlternating>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleFeatures = [
  {
    title: 'Authentication built-in',
    description:
      'Pre-configured authentication with Clerk, Cloudflare Access, or AWS Cognito. Support for social logins, MFA, and passwordless authentication out of the box.',
    image: {
      src: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=1600&h=1000&fit=crop',
      alt: 'Secure authentication interface with login screen',
    },
    benefits: [
      'Multiple authentication providers',
      'Social login (Google, GitHub, etc.)',
      'Two-factor authentication',
      'Session management',
    ],
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
        />
      </svg>
    ),
  },
  {
    title: 'Database with ORM',
    description:
      'Drizzle ORM with PostgreSQL for type-safe database queries. Automatic migrations, seed data, and local development with PGlite - no Docker required.',
    image: {
      src: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1600&h=1000&fit=crop',
      alt: 'Database schema visualization',
    },
    benefits: [
      'Type-safe queries with Drizzle ORM',
      'Automatic migration generation',
      'Local development with PGlite',
      'Production-ready PostgreSQL',
    ],
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
        />
      </svg>
    ),
  },
  {
    title: 'Testing infrastructure',
    description:
      'Comprehensive testing setup with Vitest for unit tests, Playwright for E2E, and Storybook for component testing. Achieve high code coverage with minimal effort.',
    image: {
      src: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1600&h=1000&fit=crop',
      alt: 'Testing dashboard with passing test results',
    },
    benefits: [
      'Unit tests with Vitest',
      'E2E tests with Playwright',
      'Component stories with Storybook',
      'Coverage reports included',
    ],
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

/**
 * Default alternating features
 */
export const Default: Story = {
  args: {
    title: 'Everything you need to ship fast',
    description:
      'All the tools, integrations, and best practices you need to build production-ready applications. Stop configuring, start building.',
    features: sampleFeatures,
  },
};

/**
 * Without header
 */
export const NoHeader: Story = {
  args: {
    features: sampleFeatures,
  },
};

/**
 * Single feature
 */
export const SingleFeature: Story = {
  args: {
    title: 'Built-in authentication',
    description: 'Secure, scalable authentication ready to use.',
    features: [sampleFeatures[0]!],
  },
};

/**
 * Two features
 */
export const TwoFeatures: Story = {
  args: {
    title: 'Core features',
    description: 'Authentication and database, pre-configured.',
    features: sampleFeatures.slice(0, 2),
  },
};

/**
 * Features without benefits list
 */
export const NoBenefits: Story = {
  args: {
    title: 'Platform capabilities',
    description: 'Powerful features to accelerate development.',
    features: [
      {
        title: 'Internationalization',
        description:
          'Built-in i18n with next-intl. Support multiple languages, automatic locale detection, and translation management with Crowdin.',
        image: {
          src: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=1600&h=1000&fit=crop',
          alt: 'World map showing global reach',
        },
        icon: (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
        ),
      },
      {
        title: 'Monitoring & Analytics',
        description:
          'Integrated error tracking with Sentry, logging with LogTape, and user analytics with PostHog. Full observability from day one.',
        image: {
          src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=1000&fit=crop',
          alt: 'Analytics dashboard with charts',
        },
        icon: (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
        ),
      },
    ],
  },
};

/**
 * Features without icons
 */
export const NoIcons: Story = {
  args: {
    title: 'Platform features',
    description: 'Everything you need in one place.',
    features: sampleFeatures.map(({ icon, ...rest }) => rest),
  },
};

/**
 * Product features showcase
 */
export const ProductShowcase: Story = {
  args: {
    title: 'See how it works',
    description:
      'Walk through the key features that make our platform the best choice for developers.',
    features: [
      {
        title: 'Instant deployment',
        description:
          'Deploy to production with a single command. Automatic builds, zero-downtime deployments, and instant rollbacks. Your code goes live in seconds, not hours.',
        image: {
          src: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1600&h=1000&fit=crop',
          alt: 'Deployment pipeline visualization',
        },
        benefits: [
          'One-command deployment',
          'Zero-downtime updates',
          'Automatic SSL certificates',
          'Global CDN distribution',
          'Instant rollback capability',
        ],
        icon: (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
            />
          </svg>
        ),
      },
      {
        title: 'Real-time collaboration',
        description:
          'Work together seamlessly with your team. See changes as they happen, comment on code, and ship features faster with built-in collaboration tools.',
        image: {
          src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=1000&fit=crop',
          alt: 'Team collaborating on project',
        },
        benefits: [
          'Live code sharing',
          'In-line comments',
          'Team notifications',
          'Version history',
          'Conflict resolution',
        ],
        icon: (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
          </svg>
        ),
      },
      {
        title: 'Enterprise security',
        description:
          'Bank-level security for your applications. SOC 2 Type II compliant, encrypted at rest and in transit, with comprehensive audit logs and access controls.',
        image: {
          src: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1600&h=1000&fit=crop',
          alt: 'Security shield and lock',
        },
        benefits: [
          'SOC 2 Type II certified',
          'End-to-end encryption',
          'Role-based access control',
          'Audit logging',
          'Compliance reporting',
        ],
        icon: (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
        ),
      },
    ],
  },
};

/**
 * Mobile viewport
 */
export const MobileView: Story = {
  args: {
    title: 'Everything you need',
    description: 'All the tools to build fast.',
    features: sampleFeatures.slice(0, 2),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Tablet viewport
 */
export const TabletView: Story = {
  args: {
    title: 'Everything you need to ship fast',
    description: 'All the tools you need to build production-ready applications.',
    features: sampleFeatures,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

/**
 * Long content example
 */
export const LongContent: Story = {
  args: {
    title: 'Comprehensive platform features',
    description:
      'A complete development platform with everything you need to build, test, deploy, and scale modern web applications.',
    features: [
      {
        title: 'Advanced authentication and authorization system',
        description:
          'Implement enterprise-grade authentication with support for multiple providers, including traditional email/password, social logins (Google, GitHub, Facebook), SAML for enterprise SSO, and passwordless options via magic links or biometric authentication. Features include role-based access control (RBAC), attribute-based access control (ABAC), multi-factor authentication (MFA) with SMS, authenticator apps, or hardware tokens, session management with configurable timeouts, and comprehensive audit logging for compliance requirements.',
        image: {
          src: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1600&h=1000&fit=crop',
          alt: 'Advanced security interface',
        },
        benefits: [
          'Email/password and passwordless authentication',
          'Social login with 20+ providers',
          'Enterprise SSO with SAML 2.0 and OpenID Connect',
          'Multi-factor authentication (SMS, TOTP, WebAuthn)',
          'Role-based and attribute-based access control',
          'Session management with device tracking',
          'Comprehensive audit logs for compliance (SOC 2, GDPR, HIPAA)',
          'Custom authentication flows and webhooks',
        ],
        icon: (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
        ),
      },
    ],
  },
};
