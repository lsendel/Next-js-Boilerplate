import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HeroWithImage } from './HeroWithImage';

const meta = {
  title: 'Marketing/HeroWithImage',
  component: HeroWithImage,
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
          {
            id: 'link-name',
            enabled: true,
          },
        ],
      },
    },
  },
} satisfies Meta<typeof HeroWithImage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default hero with image on the right
 */
export const Default: Story = {
  args: {
    title: 'Build faster with our Next.js boilerplate',
    description:
      'A production-ready Next.js starter with authentication, database, testing, and deployment configured. Save weeks of setup and start building your product today.',
    image: {
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&h=900&fit=crop',
      alt: 'Developer working on a laptop with code on screen',
    },
    primaryCta: {
      text: 'Get started',
      href: '/start',
    },
    secondaryCta: {
      text: 'View demo',
      href: '/demo',
    },
  },
};

/**
 * Image on the left side
 */
export const ImageLeft: Story = {
  args: {
    title: 'Beautiful applications, effortlessly',
    description:
      'Create stunning user interfaces with our component library. Fully customizable, accessible, and optimized for performance.',
    image: {
      src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=900&fit=crop',
      alt: 'Modern web application dashboard interface',
    },
    primaryCta: {
      text: 'Explore components',
      href: '/components',
    },
    secondaryCta: {
      text: 'Read docs',
      href: '/docs',
    },
    imagePosition: 'left',
  },
};

/**
 * Image on the right side (explicit)
 */
export const ImageRight: Story = {
  args: {
    title: 'Ship production-ready apps in days',
    description:
      'Everything you need to build modern web applications. Authentication, payments, analytics, and more - all pre-configured and ready to use.',
    image: {
      src: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1600&h=900&fit=crop',
      alt: 'Team collaborating on a project with laptops and documents',
    },
    primaryCta: {
      text: 'Start free trial',
      href: '/trial',
    },
    secondaryCta: {
      text: 'See pricing',
      href: '/pricing',
    },
    imagePosition: 'right',
  },
};

/**
 * With badge element
 */
export const WithBadge: Story = {
  args: {
    title: 'The future of web development',
    description:
      'Experience the next generation of development tools. Built for speed, designed for developers, optimized for production.',
    image: {
      src: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1600&h=900&fit=crop',
      alt: 'Modern office workspace with multiple monitors',
    },
    primaryCta: {
      text: 'Get started',
      href: '/start',
    },
    secondaryCta: {
      text: 'Learn more',
      href: '/about',
    },
    badge: (
      <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
        New release v2.0
      </span>
    ),
  },
};

/**
 * Single CTA only
 */
export const SingleCta: Story = {
  args: {
    title: 'Join thousands of developers',
    description:
      'Build better applications faster with our comprehensive development platform. Trusted by startups and enterprises worldwide.',
    image: {
      src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=900&fit=crop',
      alt: 'Team of developers collaborating in a modern office',
    },
    primaryCta: {
      text: 'Join now',
      href: '/signup',
    },
  },
};

/**
 * Product screenshot
 */
export const ProductScreenshot: Story = {
  args: {
    title: 'See your metrics at a glance',
    description:
      'Beautiful dashboards and real-time analytics. Track what matters most to your business with customizable charts and reports.',
    image: {
      src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop',
      alt: 'Analytics dashboard showing charts and graphs',
    },
    primaryCta: {
      text: 'View demo',
      href: '/demo',
    },
    secondaryCta: {
      text: 'Start free trial',
      href: '/trial',
    },
  },
};

/**
 * SaaS product hero
 */
export const SaasProduct: Story = {
  args: {
    title: 'Streamline your workflow',
    description:
      'Automate repetitive tasks, collaborate with your team, and ship features faster. Everything you need in one powerful platform.',
    image: {
      src: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1600&h=900&fit=crop',
      alt: 'Person using laptop with productivity tools',
    },
    primaryCta: {
      text: 'Get started free',
      href: '/signup',
    },
    secondaryCta: {
      text: 'Book a demo',
      href: '/demo',
    },
    badge: (
      <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
        ✓ Free 14-day trial
      </span>
    ),
    imagePosition: 'left',
  },
};

/**
 * Mobile app showcase
 */
export const MobileApp: Story = {
  args: {
    title: 'Your business, in your pocket',
    description:
      'Manage everything on the go with our mobile app. Available on iOS and Android. Sync seamlessly across all your devices.',
    image: {
      src: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1600&h=900&fit=crop',
      alt: 'Hand holding smartphone showing mobile application',
    },
    primaryCta: {
      text: 'Download app',
      href: '/download',
    },
    secondaryCta: {
      text: 'Learn more',
      href: '/features',
    },
  },
};

/**
 * E-commerce hero
 */
export const Ecommerce: Story = {
  args: {
    title: 'Launch your online store today',
    description:
      'Beautiful storefront, powerful tools, and seamless checkout. Everything you need to sell online and grow your business.',
    image: {
      src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&h=900&fit=crop',
      alt: 'Shopping bags and packages for e-commerce',
    },
    primaryCta: {
      text: 'Start selling',
      href: '/signup',
    },
    secondaryCta: {
      text: 'View examples',
      href: '/examples',
    },
    badge: (
      <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-700">
        🎉 0% transaction fees for first month
      </span>
    ),
  },
};

/**
 * Agency/Service hero
 */
export const Agency: Story = {
  args: {
    title: 'Transform your business with expert guidance',
    description:
      'Partner with our team of experienced consultants. We help companies accelerate growth, optimize operations, and achieve their goals.',
    image: {
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&h=900&fit=crop',
      alt: 'Business team in a strategy meeting',
    },
    primaryCta: {
      text: 'Schedule consultation',
      href: '/contact',
    },
    secondaryCta: {
      text: 'Our services',
      href: '/services',
    },
    imagePosition: 'left',
  },
};

/**
 * Mobile viewport
 */
export const MobileView: Story = {
  args: {
    title: 'Build faster with our Next.js boilerplate',
    description:
      'A production-ready starter with everything configured. Start building today.',
    image: {
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
      alt: 'Developer working on a laptop',
    },
    primaryCta: {
      text: 'Get started',
      href: '/start',
    },
    secondaryCta: {
      text: 'View demo',
      href: '/demo',
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
    title: 'Build faster with our Next.js boilerplate',
    description:
      'A production-ready Next.js starter with authentication, database, testing, and deployment configured.',
    image: {
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop',
      alt: 'Developer working on a laptop',
    },
    primaryCta: {
      text: 'Get started',
      href: '/start',
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
