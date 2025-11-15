import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TestimonialsGrid } from './TestimonialsGrid';

const meta = {
  title: 'Marketing/TestimonialsGrid',
  component: TestimonialsGrid,
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
} satisfies Meta<typeof TestimonialsGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultTestimonials = [
  {
    quote:
      'This product has completely transformed how our team works. The time savings and improved collaboration are incredible.',
    author: {
      name: 'Sarah Johnson',
      title: 'CTO',
      company: 'TechCorp',
      avatar: {
        src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        alt: 'Sarah Johnson',
      },
    },
    rating: 5,
  },
  {
    quote:
      'The best investment we made this year. Our productivity increased by 40% within the first month.',
    author: {
      name: 'Michael Chen',
      title: 'Product Manager',
      company: 'StartupXYZ',
      avatar: {
        src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        alt: 'Michael Chen',
      },
    },
    rating: 5,
  },
  {
    quote:
      'Outstanding support and a product that actually delivers on its promises. Highly recommended!',
    author: {
      name: 'Emily Rodriguez',
      title: 'Head of Engineering',
      company: 'InnovateLabs',
      avatar: {
        src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        alt: 'Emily Rodriguez',
      },
    },
    rating: 5,
  },
  {
    quote:
      'Simple, powerful, and exactly what we needed. The onboarding was smooth and we were up and running in no time.',
    author: {
      name: 'David Park',
      title: 'Founder & CEO',
      company: 'GrowthCo',
      avatar: {
        src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        alt: 'David Park',
      },
    },
    rating: 5,
  },
  {
    quote:
      'The analytics features alone are worth the price. We finally have visibility into what matters most.',
    author: {
      name: 'Jessica Martinez',
      title: 'Director of Operations',
      company: 'ScaleUp Inc',
      avatar: {
        src: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
        alt: 'Jessica Martinez',
      },
    },
    rating: 5,
  },
  {
    quote:
      'Absolutely game-changing. Our team collaboration has never been better. Cannot imagine going back to our old workflow.',
    author: {
      name: 'James Wilson',
      title: 'VP of Product',
      company: 'Enterprise Solutions',
      avatar: {
        src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        alt: 'James Wilson',
      },
    },
    rating: 5,
  },
];

export const Default: Story = {
  args: {
    title: 'Loved by teams worldwide',
    description: 'See what our customers have to say about their experience',
    testimonials: defaultTestimonials,
  },
};

export const ThreeColumns: Story = {
  args: {
    title: 'What our customers say',
    description: 'Join thousands of satisfied customers who trust our platform',
    testimonials: defaultTestimonials,
    columns: 3,
  },
};

export const TwoColumns: Story = {
  args: {
    title: 'Customer success stories',
    description: 'Real results from real customers',
    testimonials: defaultTestimonials.slice(0, 4),
    columns: 2,
  },
};

export const WithoutRatings: Story = {
  args: {
    title: 'What people are saying',
    description: 'Testimonials from our community',
    testimonials: defaultTestimonials.map(t => ({ ...t, rating: undefined })),
  },
};

export const WithoutAvatars: Story = {
  args: {
    title: 'Customer testimonials',
    description: 'Hear from the teams using our platform',
    testimonials: defaultTestimonials.map(t => ({
      ...t,
      author: {
        ...t.author,
        avatar: undefined,
      },
    })),
  },
};

export const MinimalNoHeader: Story = {
  args: {
    testimonials: defaultTestimonials.slice(0, 3),
  },
};

export const ShortTestimonials: Story = {
  args: {
    title: 'Quick wins',
    description: 'Fast feedback from our users',
    testimonials: [
      {
        quote: 'Best tool we have used. Simple and effective.',
        author: {
          name: 'Alex Thompson',
          title: 'Developer',
        },
        rating: 5,
      },
      {
        quote: 'Saved us countless hours. Worth every penny.',
        author: {
          name: 'Maria Garcia',
          title: 'Designer',
        },
        rating: 5,
      },
      {
        quote: 'Incredible value. Great support team too!',
        author: {
          name: 'Ryan Lee',
          title: 'Founder',
        },
        rating: 5,
      },
    ],
  },
};

export const DetailedTestimonials: Story = {
  args: {
    title: 'In-depth reviews',
    description: 'Detailed feedback from our power users',
    testimonials: [
      {
        quote:
          'We evaluated dozens of solutions before choosing this platform. The combination of powerful features, intuitive design, and outstanding customer support made it an easy decision. After six months of use, our team productivity has increased measurably, and we have reduced our operational costs significantly. The ROI has been outstanding, and we continue to discover new ways to leverage the platform for our business needs.',
        author: {
          name: 'Rebecca Foster',
          title: 'Director of Technology',
          company: 'Fortune 500 Company',
          avatar: {
            src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
            alt: 'Rebecca Foster',
          },
        },
        rating: 5,
      },
      {
        quote:
          'As a startup, we needed a solution that could scale with us from day one. This platform delivered exactly that. The onboarding process was seamless, and the learning curve was minimal. Our entire team was productive within the first week. The customer success team has been incredibly responsive, and the regular feature updates show that the company is committed to continuous improvement.',
        author: {
          name: 'Thomas Anderson',
          title: 'Co-founder & CTO',
          company: 'TechStartup',
          avatar: {
            src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
            alt: 'Thomas Anderson',
          },
        },
        rating: 5,
      },
    ],
    columns: 2,
  },
};

export const MixedRatings: Story = {
  args: {
    title: 'Honest feedback',
    description: 'What our customers really think',
    testimonials: [
      {
        quote: 'Excellent product with great features. Customer support is top-notch.',
        author: {
          name: 'Lisa Chen',
          title: 'Marketing Director',
        },
        rating: 5,
      },
      {
        quote: 'Very good overall. A few minor issues but the team is working on them.',
        author: {
          name: 'John Smith',
          title: 'Operations Manager',
        },
        rating: 4,
      },
      {
        quote: 'Solid product that gets the job done. Room for improvement in some areas.',
        author: {
          name: 'Amanda White',
          title: 'Project Lead',
        },
        rating: 4,
      },
    ],
  },
};

export const MobileViewport: Story = {
  args: {
    title: 'Loved by teams worldwide',
    description: 'See what our customers have to say',
    testimonials: defaultTestimonials,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletViewport: Story = {
  args: {
    title: 'Loved by teams worldwide',
    description: 'See what our customers have to say about their experience',
    testimonials: defaultTestimonials,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
