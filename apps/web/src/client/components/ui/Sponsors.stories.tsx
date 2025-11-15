import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Sponsors } from './Sponsors';

const meta = {
  title: 'UI/Sponsors',
  component: Sponsors,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
} satisfies Meta<typeof Sponsors>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FullWidth: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
};

export const InSection: Story = {
  decorators: [
    Story => (
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto">
          <h2 className="mb-8 text-center text-3xl font-bold">Our Sponsors</h2>
          <div className="flex justify-center">
            <Story />
          </div>
        </div>
      </section>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export const MobileViewport: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletViewport: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
