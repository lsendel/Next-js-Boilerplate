import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DemoBanner } from './DemoBanner';

const meta = {
  title: 'UI/DemoBanner',
  component: DemoBanner,
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
} satisfies Meta<typeof DemoBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sticky: Story = {
  decorators: [
    Story => (
      <div>
        <Story />
        <div className="p-8">
          <h1 className="text-2xl font-bold">Sample Page Content</h1>
          <p className="mt-4">Scroll down to see the banner stick to the top.</p>
          {Array.from({ length: 50 }).map((_, i) => (
            <p key={i} className="mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Line {i + 1}
            </p>
          ))}
        </div>
      </div>
    ),
  ],
};

export const WithMobileViewport: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const WithTabletViewport: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
