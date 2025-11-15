import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HeroCentered } from './HeroCentered';

const meta = {
  title: 'Marketing/HeroCentered',
  component: HeroCentered,
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
        ],
      },
    },
  },
} satisfies Meta<typeof HeroCentered>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Build amazing products faster',
    description:
      'Everything you need to ship your next SaaS product. Authentication, payments, analytics, and more. Get started in minutes, not weeks.',
    primaryCta: {
      text: 'Get started',
      href: '/sign-up',
    },
    secondaryCta: {
      text: 'View demo',
      href: '/demo',
    },
  },
};

export const WithBadge: Story = {
  args: {
    title: 'Build amazing products faster',
    description:
      'Everything you need to ship your next SaaS product. Authentication, payments, analytics, and more. Get started in minutes, not weeks.',
    primaryCta: {
      text: 'Get started',
      href: '/sign-up',
    },
    secondaryCta: {
      text: 'View demo',
      href: '/demo',
    },
    badge: (
      <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
        </span>
        Now in beta
      </span>
    ),
  },
};

export const ProductLaunch: Story = {
  args: {
    title: 'The future of team collaboration',
    description:
      'Join thousands of teams already using our platform to streamline their workflow, improve productivity, and ship faster than ever before.',
    primaryCta: {
      text: 'Start free trial',
      href: '/sign-up',
    },
    secondaryCta: {
      text: 'Schedule demo',
      href: '/contact',
    },
    badge: (
      <span className="inline-flex items-center rounded-full bg-green-50 px-4 py-1.5 text-sm font-semibold text-green-700 ring-1 ring-inset ring-green-700/10">
        Just launched v2.0
      </span>
    ),
  },
};

export const MinimalWithOnlyCTA: Story = {
  args: {
    title: 'Ship better products, faster',
    description:
      'The complete toolkit for modern SaaS applications. Built with Next.js, TypeScript, and the latest web technologies.',
    primaryCta: {
      text: 'Get started for free',
      href: '/sign-up',
    },
  },
};

export const LongContent: Story = {
  args: {
    title: 'Build, deploy, and scale your applications with confidence using our enterprise-grade platform',
    description:
      'Our comprehensive platform provides everything you need to build modern web applications. From authentication and database management to analytics and monitoring, we have got you covered. Join thousands of developers who trust our platform to power their products.',
    primaryCta: {
      text: 'Get started',
      href: '/sign-up',
    },
    secondaryCta: {
      text: 'Learn more',
      href: '/features',
    },
    badge: (
      <span className="inline-flex items-center rounded-full bg-purple-50 px-4 py-1.5 text-sm font-semibold text-purple-700 ring-1 ring-inset ring-purple-700/10">
        Trusted by 10,000+ developers
      </span>
    ),
  },
};

export const MobileViewport: Story = {
  args: {
    title: 'Build amazing products faster',
    description:
      'Everything you need to ship your next SaaS product. Authentication, payments, analytics, and more.',
    primaryCta: {
      text: 'Get started',
      href: '/sign-up',
    },
    secondaryCta: {
      text: 'View demo',
      href: '/demo',
    },
    badge: (
      <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
        New
      </span>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletViewport: Story = {
  args: {
    title: 'Build amazing products faster',
    description:
      'Everything you need to ship your next SaaS product. Authentication, payments, analytics, and more.',
    primaryCta: {
      text: 'Get started',
      href: '/sign-up',
    },
    secondaryCta: {
      text: 'View demo',
      href: '/demo',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
