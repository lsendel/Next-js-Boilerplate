import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from '@storybook/test';
import { CurrentCount } from './CurrentCount';

const meta = {
  title: 'Forms/CurrentCount',
  component: CurrentCount,
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
        ],
      },
    },
  },
  argTypes: {
    count: {
      control: { type: 'number' },
      description: 'The current count value to display',
    },
  },
  decorators: [
    Story => (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CurrentCount>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state showing zero count
 */
export const Zero: Story = {
  args: {
    count: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const countDisplay = canvas.getByText(/count: 0/i);
    expect(countDisplay).toBeInTheDocument();
  },
};

/**
 * Display with a small positive count
 */
export const SmallPositiveCount: Story = {
  args: {
    count: 5,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const countDisplay = canvas.getByText(/count: 5/i);
    expect(countDisplay).toBeInTheDocument();
  },
};

/**
 * Display with a large positive count
 */
export const LargePositiveCount: Story = {
  args: {
    count: 1234,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const countDisplay = canvas.getByText(/count: 1234/i);
    expect(countDisplay).toBeInTheDocument();
  },
};

/**
 * Display with a very large count
 */
export const VeryLargeCount: Story = {
  args: {
    count: 999999,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const countDisplay = canvas.getByText(/count: 999999/i);
    expect(countDisplay).toBeInTheDocument();
  },
};

/**
 * Display with a negative count
 */
export const NegativeCount: Story = {
  args: {
    count: -10,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const countDisplay = canvas.getByText(/count: -10/i);
    expect(countDisplay).toBeInTheDocument();
  },
};

/**
 * Display in a dashboard context
 */
export const InDashboard: Story = {
  args: {
    count: 42,
  },
  decorators: [
    Story => (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              Dashboard Statistics
            </h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-blue-50 p-4">
                <h3 className="mb-2 text-sm font-semibold uppercase text-gray-600">
                  Current Count
                </h3>
                <div className="text-2xl font-bold text-blue-600">
                  <Story />
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-green-50 p-4">
                <h3 className="mb-2 text-sm font-semibold uppercase text-gray-600">
                  Total Users
                </h3>
                <div className="text-2xl font-bold text-green-600">
                  Count: 156
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-purple-50 p-4">
                <h3 className="mb-2 text-sm font-semibold uppercase text-gray-600">
                  Active Sessions
                </h3>
                <div className="text-2xl font-bold text-purple-600">
                  Count: 23
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Display with large text styling
 */
export const LargeText: Story = {
  args: {
    count: 100,
  },
  decorators: [
    Story => (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="text-4xl font-bold text-blue-600">
          <Story />
        </div>
      </div>
    ),
  ],
};

/**
 * Display in a card with icon
 */
export const WithIcon: Story = {
  args: {
    count: 78,
  },
  decorators: [
    Story => (
      <div className="w-64 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Counter Value</h3>
          <svg
            className="size-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div className="text-3xl font-bold text-gray-900">
          <Story />
        </div>
        <div className="mt-2 text-sm text-gray-500">Updated just now</div>
      </div>
    ),
  ],
};

/**
 * Mobile viewport display
 */
export const MobileViewport: Story = {
  args: {
    count: 25,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Tablet viewport display
 */
export const TabletViewport: Story = {
  args: {
    count: 50,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

/**
 * Dark mode display
 */
export const DarkMode: Story = {
  args: {
    count: 33,
  },
  decorators: [
    Story => (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="mx-auto max-w-md rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg">
          <h3 className="mb-2 text-sm font-semibold uppercase text-gray-400">
            Current Counter
          </h3>
          <div className="text-3xl font-bold text-white">
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
  },
};

/**
 * Comparison view with multiple counts
 */
export const ComparisonView: Story = {
  args: {
    count: 150,
  },
  decorators: [
    Story => (
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
            Yesterday
          </div>
          <div className="text-xl font-bold text-gray-700">Count: 120</div>
        </div>
        <div className="rounded-lg border-2 border-blue-500 bg-blue-50 p-4 text-center">
          <div className="mb-1 text-xs font-semibold uppercase text-blue-600">
            Today
          </div>
          <div className="text-xl font-bold text-blue-700">
            <Story />
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
            Goal
          </div>
          <div className="text-xl font-bold text-gray-700">Count: 200</div>
        </div>
      </div>
    ),
  ],
};

/**
 * Animated counter transition (illustrative)
 */
export const AnimatedTransition: Story = {
  args: {
    count: 88,
  },
  decorators: [
    Story => (
      <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">
          Live Counter
        </h3>
        <div className="text-5xl font-bold text-indigo-600 transition-all duration-300 hover:scale-110">
          <Story />
        </div>
      </div>
    ),
  ],
};
