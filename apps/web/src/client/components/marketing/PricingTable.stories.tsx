import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PricingTable } from './PricingTable';

const meta = {
  title: 'Marketing/PricingTable',
  component: PricingTable,
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
} satisfies Meta<typeof PricingTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultTiers = [
  {
    name: 'Starter',
    price: {
      monthly: 0,
      yearly: 0,
    },
    description: 'Perfect for trying out our platform',
    features: [
      'Up to 1,000 monthly active users',
      'Basic analytics dashboard',
      'Email support',
      'Community access',
      'API access',
    ],
    cta: {
      text: 'Get started',
      href: '/sign-up',
    },
  },
  {
    name: 'Professional',
    price: {
      monthly: 49,
      yearly: 470,
    },
    description: 'For growing businesses',
    features: [
      'Up to 10,000 monthly active users',
      'Advanced analytics & insights',
      'Priority email & chat support',
      'Custom branding',
      'Advanced API access',
      'Team collaboration (up to 5)',
      'SSO authentication',
    ],
    cta: {
      text: 'Start free trial',
      href: '/sign-up?plan=pro',
    },
    highlighted: true,
    badge: (
      <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
        Most popular
      </span>
    ),
  },
  {
    name: 'Enterprise',
    price: {
      monthly: 199,
      yearly: 1990,
    },
    description: 'For large-scale operations',
    features: [
      'Unlimited monthly active users',
      'Enterprise analytics suite',
      '24/7 phone & email support',
      'Dedicated account manager',
      'Custom integrations',
      'Unlimited team members',
      'Advanced security features',
      'SLA guarantee',
      'Custom contracts',
    ],
    cta: {
      text: 'Contact sales',
      href: '/contact-sales',
    },
  },
];

export const Default: Story = {
  args: {
    title: 'Choose the perfect plan',
    description: 'Start with a free trial. No credit card required. Cancel anytime.',
    tiers: defaultTiers,
  },
};

export const MonthlyBilling: Story = {
  args: {
    title: 'Simple, transparent pricing',
    description: 'Choose the plan that fits your needs. All plans include a 14-day free trial.',
    tiers: defaultTiers,
    billingPeriod: 'monthly',
    showBillingToggle: true,
  },
};

export const YearlyBilling: Story = {
  args: {
    title: 'Simple, transparent pricing',
    description: 'Choose the plan that fits your needs. Save 20% with annual billing.',
    tiers: defaultTiers,
    billingPeriod: 'yearly',
    showBillingToggle: true,
  },
};

export const TwoTiers: Story = {
  args: {
    title: 'Choose your plan',
    description: 'Start free, upgrade when you need more',
    tiers: [
      {
        name: 'Free',
        price: {
          monthly: 0,
        },
        description: 'For individuals and small projects',
        features: [
          'Up to 100 monthly active users',
          'Basic features',
          'Community support',
          'Public repositories',
        ],
        cta: {
          text: 'Get started free',
          href: '/sign-up',
        },
      },
      {
        name: 'Pro',
        price: {
          monthly: 29,
          yearly: 290,
        },
        description: 'For professionals and teams',
        features: [
          'Unlimited monthly active users',
          'All features included',
          'Priority support',
          'Private repositories',
          'Advanced analytics',
          'Team collaboration',
        ],
        cta: {
          text: 'Start free trial',
          href: '/sign-up?plan=pro',
        },
        highlighted: true,
      },
    ],
  },
};

export const FourTiers: Story = {
  args: {
    title: 'Pricing for teams of all sizes',
    description: 'From startups to enterprise, we have a plan for you',
    tiers: [
      {
        name: 'Hobby',
        price: {
          monthly: 0,
        },
        description: 'For side projects',
        features: ['1 project', 'Basic features', 'Community support'],
        cta: {
          text: 'Get started',
          href: '/sign-up',
        },
      },
      {
        name: 'Starter',
        price: {
          monthly: 19,
          yearly: 190,
        },
        description: 'For small teams',
        features: ['5 projects', 'Standard features', 'Email support', 'Up to 3 team members'],
        cta: {
          text: 'Start trial',
          href: '/sign-up?plan=starter',
        },
      },
      {
        name: 'Business',
        price: {
          monthly: 79,
          yearly: 790,
        },
        description: 'For growing companies',
        features: [
          'Unlimited projects',
          'Advanced features',
          'Priority support',
          'Up to 20 team members',
          'Analytics',
        ],
        cta: {
          text: 'Start trial',
          href: '/sign-up?plan=business',
        },
        highlighted: true,
        badge: (
          <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
            Popular
          </span>
        ),
      },
      {
        name: 'Enterprise',
        price: {
          monthly: 299,
          yearly: 2990,
        },
        description: 'For large organizations',
        features: [
          'Unlimited everything',
          'Custom features',
          'Dedicated support',
          'Unlimited team members',
          'SLA',
          'Custom contracts',
        ],
        cta: {
          text: 'Contact us',
          href: '/contact',
        },
      },
    ],
  },
};

export const MinimalNoHeader: Story = {
  args: {
    tiers: defaultTiers,
  },
};

export const CustomCurrency: Story = {
  args: {
    title: 'Global pricing',
    description: 'Pricing in your local currency',
    tiers: [
      {
        name: 'Basic',
        price: {
          monthly: 99,
          yearly: 990,
          currency: '€',
        },
        description: 'Essential features for getting started',
        features: ['10 users', 'Basic support', '10GB storage', 'Basic analytics'],
        cta: {
          text: 'Subscribe',
          href: '/sign-up',
        },
      },
      {
        name: 'Premium',
        price: {
          monthly: 199,
          yearly: 1990,
          currency: '€',
        },
        description: 'Advanced features for professionals',
        features: [
          'Unlimited users',
          'Priority support',
          '100GB storage',
          'Advanced analytics',
          'Custom integrations',
        ],
        cta: {
          text: 'Subscribe',
          href: '/sign-up',
        },
        highlighted: true,
      },
    ],
  },
};

export const MobileViewport: Story = {
  args: {
    title: 'Choose the perfect plan',
    description: 'Start free, upgrade when you need more',
    tiers: defaultTiers,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletViewport: Story = {
  args: {
    title: 'Choose the perfect plan',
    description: 'Start with a free trial. No credit card required.',
    tiers: defaultTiers,
    showBillingToggle: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
