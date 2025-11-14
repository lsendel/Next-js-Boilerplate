import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HeroGradient } from './HeroGradient';

const meta = {
  title: 'Marketing/HeroGradient',
  component: HeroGradient,
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
} satisfies Meta<typeof HeroGradient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Launch your SaaS in days, not months',
    description:
      'The complete Next.js boilerplate with authentication, payments, database, and everything you need to build a modern SaaS application.',
    primaryCta: {
      text: 'Start building',
      href: '/sign-up',
    },
    secondaryCta: {
      text: 'View pricing',
      href: '/pricing',
    },
  },
};

export const WithBadge: Story = {
  args: {
    title: 'Launch your SaaS in days, not months',
    description:
      'The complete Next.js boilerplate with authentication, payments, database, and everything you need to build a modern SaaS application.',
    primaryCta: {
      text: 'Start building',
      href: '/sign-up',
    },
    secondaryCta: {
      text: 'View pricing',
      href: '/pricing',
    },
    badge: (
      <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm ring-1 ring-inset ring-white/30">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        Version 2.0 is here
      </span>
    ),
  },
};

export const PurplePinkGradient: Story = {
  args: {
    title: 'Design systems made simple',
    description:
      'Create beautiful, consistent user interfaces with our comprehensive component library. Built with accessibility and customization in mind.',
    primaryCta: {
      text: 'Get started',
      href: '/sign-up',
    },
    secondaryCta: {
      text: 'Explore docs',
      href: '/docs',
    },
    gradientFrom: 'from-purple-600',
    gradientTo: 'to-pink-600',
    badge: (
      <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm ring-1 ring-inset ring-white/30">
        New release
      </span>
    ),
  },
};

export const TealBlueGradient: Story = {
  args: {
    title: 'Analytics that drive growth',
    description:
      'Understand your users, optimize your product, and grow your business with powerful analytics and insights.',
    primaryCta: {
      text: 'Try for free',
      href: '/sign-up',
    },
    secondaryCta: {
      text: 'Watch demo',
      href: '/demo',
    },
    gradientFrom: 'from-teal-500',
    gradientTo: 'to-blue-600',
  },
};

export const OrangeRedGradient: Story = {
  args: {
    title: 'Ship faster with confidence',
    description:
      'Deploy your applications with zero downtime, automatic scaling, and enterprise-grade security. Built for developers, loved by teams.',
    primaryCta: {
      text: 'Deploy now',
      href: '/sign-up',
    },
    secondaryCta: {
      text: 'See features',
      href: '/features',
    },
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-red-600',
    badge: (
      <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm ring-1 ring-inset ring-white/30">
        99.9% uptime SLA
      </span>
    ),
  },
};

export const MinimalNoCTA: Story = {
  args: {
    title: 'Transform your workflow',
    description:
      'Join thousands of teams using our platform to collaborate, create, and deliver exceptional results.',
    primaryCta: {
      text: 'Get started free',
      href: '/sign-up',
    },
  },
};

export const MobileViewport: Story = {
  args: {
    title: 'Launch your SaaS in days',
    description:
      'Everything you need to build a modern SaaS application, all in one place.',
    primaryCta: {
      text: 'Start building',
      href: '/sign-up',
    },
    secondaryCta: {
      text: 'Learn more',
      href: '/features',
    },
    badge: (
      <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm ring-1 ring-inset ring-white/30">
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
    title: 'Launch your SaaS in days, not months',
    description:
      'The complete Next.js boilerplate with authentication, payments, and everything you need.',
    primaryCta: {
      text: 'Start building',
      href: '/sign-up',
    },
    secondaryCta: {
      text: 'View pricing',
      href: '/pricing',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
