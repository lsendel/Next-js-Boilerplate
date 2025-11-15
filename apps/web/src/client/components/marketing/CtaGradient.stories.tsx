import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CtaGradient } from './CtaGradient';

const meta = {
  title: 'Marketing/CtaGradient',
  component: CtaGradient,
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
            id: 'link-name',
            enabled: true,
          },
        ],
      },
    },
  },
} satisfies Meta<typeof CtaGradient>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default gradient CTA with primary and secondary buttons
 */
export const Default: Story = {
  args: {
    title: 'Ready to get started?',
    description:
      'Join thousands of developers who are already building amazing applications with our platform. Start your journey today.',
    primaryCta: {
      text: 'Get started for free',
      href: '/sign-up',
    },
    secondaryCta: {
      text: 'View documentation',
      href: '/docs',
    },
  },
};

/**
 * Blue to purple gradient (default colors)
 */
export const BlueToPurple: Story = {
  args: {
    title: 'Experience the future of development',
    description:
      'Our cutting-edge tools and AI-powered features will transform how you build applications. Join the revolution.',
    primaryCta: {
      text: 'Start free trial',
      href: '/trial',
    },
    secondaryCta: {
      text: 'Watch demo',
      href: '/demo',
    },
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-purple-600',
  },
};

/**
 * Green to teal gradient for eco/nature themes
 */
export const GreenToTeal: Story = {
  args: {
    title: 'Build a sustainable future',
    description:
      'Reduce your carbon footprint while building powerful applications. Join us in creating a greener tomorrow.',
    primaryCta: {
      text: 'Get started',
      href: '/start',
    },
    secondaryCta: {
      text: 'Learn more',
      href: '/about',
    },
    gradientFrom: 'from-green-600',
    gradientTo: 'to-teal-600',
  },
};

/**
 * Orange to red gradient for urgent/action themes
 */
export const OrangeToRed: Story = {
  args: {
    title: 'Limited time offer - 50% off',
    description:
      'Don\'t miss out on our biggest sale of the year. Upgrade your plan today and save big on all premium features.',
    primaryCta: {
      text: 'Claim your discount',
      href: '/pricing',
    },
    secondaryCta: {
      text: 'View plans',
      href: '/plans',
    },
    gradientFrom: 'from-orange-600',
    gradientTo: 'to-red-600',
  },
};

/**
 * Pink to rose gradient for creative/design themes
 */
export const PinkToRose: Story = {
  args: {
    title: 'Unleash your creativity',
    description:
      'Create stunning designs with our intuitive tools and templates. Perfect for designers, marketers, and creators.',
    primaryCta: {
      text: 'Start creating',
      href: '/create',
    },
    secondaryCta: {
      text: 'Browse templates',
      href: '/templates',
    },
    gradientFrom: 'from-pink-600',
    gradientTo: 'to-rose-600',
  },
};

/**
 * Single CTA button only (no secondary)
 */
export const SingleButton: Story = {
  args: {
    title: 'Join our community',
    description:
      'Connect with developers worldwide, share your knowledge, and learn from the best in the industry.',
    primaryCta: {
      text: 'Join now',
      href: '/community',
    },
    gradientFrom: 'from-indigo-600',
    gradientTo: 'to-blue-600',
  },
};

/**
 * Short, punchy copy
 */
export const ShortCopy: Story = {
  args: {
    title: 'Ship faster',
    description: 'Deploy production-ready apps in minutes, not weeks.',
    primaryCta: {
      text: 'Get started',
      href: '/start',
    },
    secondaryCta: {
      text: 'Learn how',
      href: '/how-it-works',
    },
  },
};

/**
 * Long descriptive copy
 */
export const LongCopy: Story = {
  args: {
    title: 'Everything you need to build modern web applications',
    description:
      'From authentication to database management, from real-time features to analytics integration, our comprehensive platform provides all the tools and services you need to build, deploy, and scale your applications with confidence. Start building today and focus on what matters most - your product.',
    primaryCta: {
      text: 'Explore features',
      href: '/features',
    },
    secondaryCta: {
      text: 'View pricing',
      href: '/pricing',
    },
  },
};

/**
 * Mobile viewport
 */
export const MobileView: Story = {
  args: {
    title: 'Ready to get started?',
    description:
      'Join thousands of developers who are already building amazing applications with our platform.',
    primaryCta: {
      text: 'Get started',
      href: '/start',
    },
    secondaryCta: {
      text: 'Learn more',
      href: '/learn',
    },
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
    title: 'Ready to get started?',
    description:
      'Join thousands of developers who are already building amazing applications with our platform.',
    primaryCta: {
      text: 'Get started',
      href: '/start',
    },
    secondaryCta: {
      text: 'Learn more',
      href: '/learn',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

/**
 * CTA for product launch
 */
export const ProductLaunch: Story = {
  args: {
    title: '🚀 Now live: AI-powered code generation',
    description:
      'Generate production-ready code in seconds using our new AI assistant. Write less code, ship faster, and focus on innovation.',
    primaryCta: {
      text: 'Try AI assistant',
      href: '/ai',
    },
    secondaryCta: {
      text: 'See examples',
      href: '/examples',
    },
    gradientFrom: 'from-purple-600',
    gradientTo: 'to-pink-600',
  },
};
