import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DemoBadge } from './DemoBadge';

const meta = {
  title: 'UI/DemoBadge',
  component: DemoBadge,
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
} satisfies Meta<typeof DemoBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomViewport: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const InContext: Story = {
  decorators: [
    Story => (
      <div className="relative min-h-screen bg-gray-100">
        <div className="p-8">
          <h1 className="text-2xl font-bold">Sample Page Content</h1>
          <p className="mt-4">
            The demo badge appears fixed at the bottom right of the viewport.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};
