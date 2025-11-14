import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from '@storybook/test';
import { Hello } from './Hello';

// Note: Hello is an async server component, so we need to handle it specially in Storybook
// We create a wrapper that resolves the component

const meta = {
  title: 'Forms/Hello',
  component: Hello,
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
            id: 'link-name',
            enabled: true,
          },
        ],
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    Story => (
      <div className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Hello>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default greeting with user email
 * This demonstrates the typical authenticated user greeting
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check for greeting emoji
    const greetingText = canvas.getByText(/👋/);
    expect(greetingText).toBeInTheDocument();

    // Check for the link to Pro version
    const proLink = canvas.getByRole('link', {
      name: /Next\.js Boilerplate Pro/i,
    });
    expect(proLink).toBeInTheDocument();
    expect(proLink).toHaveAttribute(
      'href',
      'https://nextjs-boilerplate.com/pro-saas-starter-kit',
    );
  },
};

/**
 * Full page dashboard view
 */
export const InDashboard: Story = {
  decorators: [
    Story => (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl p-8">
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <h1 className="mb-6 text-3xl font-bold text-gray-900">
              Welcome to Your Dashboard
            </h1>
            <Story />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">Statistics</h3>
              <p className="text-gray-600">View your metrics here</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">Recent Activity</h3>
              <p className="text-gray-600">Track your actions</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">Quick Actions</h3>
              <p className="text-gray-600">Perform common tasks</p>
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
 * Compact layout for sidebar or widget
 */
export const Compact: Story = {
  decorators: [
    Story => (
      <div className="w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="text-sm">
          <Story />
        </div>
      </div>
    ),
  ],
};

/**
 * Hero section variant
 */
export const HeroSection: Story = {
  decorators: [
    Story => (
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-12 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 text-4xl font-bold">
            <Story />
          </div>
          <p className="text-xl text-blue-100">
            Start exploring your personalized dashboard
          </p>
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Dark mode display
 */
export const DarkMode: Story = {
  decorators: [
    Story => (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="mx-auto max-w-2xl rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg">
          <div className="text-white">
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
 * Mobile viewport display
 */
export const MobileViewport: Story = {
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
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

/**
 * Card layout with welcome message
 */
export const WelcomeCard: Story = {
  decorators: [
    Story => (
      <div className="w-96 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100">
          <span className="text-3xl">👋</span>
        </div>
        <div className="mb-4">
          <Story />
        </div>
        <button
          type="button"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Get Started
        </button>
      </div>
    ),
  ],
};

/**
 * Profile header variant
 */
export const ProfileHeader: Story = {
  decorators: [
    Story => (
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="relative h-32 bg-gradient-to-r from-blue-400 to-indigo-500" />
        <div className="relative px-6 pb-6">
          <div className="-mt-16 mb-4">
            <div className="inline-block rounded-full border-4 border-white bg-gray-300 p-4">
              <svg
                className="size-16 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="text-xl font-semibold">
            <Story />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Edit Profile
            </button>
            <button
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Settings
            </button>
          </div>
        </div>
      </div>
    ),
  ],
};

/**
 * Minimal text-only variant
 */
export const MinimalText: Story = {
  decorators: [
    Story => (
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
        <Story />
      </div>
    ),
  ],
};

/**
 * Full width banner variant
 */
export const BannerVariant: Story = {
  decorators: [
    Story => (
      <div className="bg-blue-600 px-8 py-4 text-white">
        <div className="mx-auto max-w-7xl">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * With action buttons
 */
export const WithActions: Story = {
  decorators: [
    Story => (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <Story />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            View Dashboard
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Manage Account
          </button>
        </div>
      </div>
    ),
  ],
};

/**
 * Sidebar widget variant
 */
export const SidebarWidget: Story = {
  decorators: [
    Story => (
      <div className="w-64 space-y-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
            Account Info
          </h3>
          <div className="text-sm">
            <Story />
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
            Quick Stats
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Projects</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tasks</span>
              <span className="font-semibold">45</span>
            </div>
          </div>
        </div>
      </div>
    ),
  ],
};
