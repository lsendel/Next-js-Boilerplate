import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CtaSimple } from './CtaSimple';

const meta = {
  title: 'Marketing/CtaSimple',
  component: CtaSimple,
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
} satisfies Meta<typeof CtaSimple>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Ready to get started?',
    description:
      'Start building your next project today. No credit card required. Get started in seconds.',
    primaryCta: {
      text: 'Create account',
      href: '/sign-up',
    },
    secondaryCta: {
      text: 'Learn more',
      href: '/features',
    },
  },
};

export const FreeTrial: Story = {
  args: {
    title: 'Start your free 14-day trial',
    description:
      'No credit card required. Full access to all features. Cancel anytime. Join thousands of satisfied customers.',
    primaryCta: {
      text: 'Start free trial',
      href: '/sign-up',
    },
    secondaryCta: {
      text: 'View pricing',
      href: '/pricing',
    },
  },
};

export const NewsletterSignup: Story = {
  args: {
    title: 'Stay up to date',
    description:
      'Get the latest updates, tips, and best practices delivered to your inbox every week.',
    primaryCta: {
      text: 'Subscribe to newsletter',
      href: '/newsletter',
    },
  },
};

export const DemoRequest: Story = {
  args: {
    title: 'See it in action',
    description:
      'Schedule a personalized demo with our team and discover how we can help you achieve your goals.',
    primaryCta: {
      text: 'Schedule demo',
      href: '/demo',
    },
    secondaryCta: {
      text: 'Watch video',
      href: '/video',
    },
  },
};

export const ContactSales: Story = {
  args: {
    title: 'Need a custom solution?',
    description:
      'Our enterprise team is ready to help you build the perfect solution for your organization.',
    primaryCta: {
      text: 'Contact sales',
      href: '/contact-sales',
    },
    secondaryCta: {
      text: 'View pricing',
      href: '/pricing',
    },
  },
};

export const BookConsultation: Story = {
  args: {
    title: 'Get expert guidance',
    description:
      'Book a free 30-minute consultation with our product specialists to discuss your specific needs.',
    primaryCta: {
      text: 'Book consultation',
      href: '/consultation',
    },
    secondaryCta: {
      text: 'Read case studies',
      href: '/case-studies',
    },
  },
};

export const MinimalOnlyCTA: Story = {
  args: {
    title: 'Join the waitlist',
    description: 'Be the first to know when we launch. Limited early access spots available.',
    primaryCta: {
      text: 'Join waitlist',
      href: '/waitlist',
    },
  },
};

export const BottomOfPage: Story = {
  args: {
    title: 'Ready to transform your workflow?',
    description:
      'Join thousands of teams already using our platform to ship faster and collaborate better.',
    primaryCta: {
      text: 'Get started for free',
      href: '/sign-up',
    },
    secondaryCta: {
      text: 'Talk to sales',
      href: '/contact',
    },
  },
  decorators: [
    Story => (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl p-8">
          <h1 className="text-4xl font-bold">Sample Page Content</h1>
          <p className="mt-4 text-lg text-gray-600">
            This demonstrates the CTA component positioned at the bottom of a page with content above it.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="text-xl font-semibold">Feature {i}</h3>
                <p className="mt-2 text-gray-600">Description of this amazing feature.</p>
              </div>
            ))}
          </div>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const MobileViewport: Story = {
  args: {
    title: 'Ready to get started?',
    description: 'Start building your next project today. No credit card required.',
    primaryCta: {
      text: 'Create account',
      href: '/sign-up',
    },
    secondaryCta: {
      text: 'Learn more',
      href: '/features',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletViewport: Story = {
  args: {
    title: 'Ready to get started?',
    description:
      'Start building your next project today. No credit card required. Get started in seconds.',
    primaryCta: {
      text: 'Create account',
      href: '/sign-up',
    },
    secondaryCta: {
      text: 'Learn more',
      href: '/features',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
