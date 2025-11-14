import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/locales/en.json';
import { LocaleSwitcher } from './LocaleSwitcher';

const meta = {
  title: 'UI/LocaleSwitcher',
  component: LocaleSwitcher,
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
            id: 'label',
            enabled: true,
          },
        ],
      },
    },
  },
  decorators: [
    Story => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
} satisfies Meta<typeof LocaleSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EnglishLocale: Story = {
  decorators: [
    Story => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};

export const FrenchLocale: Story = {
  decorators: [
    Story => (
      <NextIntlClientProvider locale="fr" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};

export const InHeader: Story = {
  decorators: [
    Story => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <header className="flex items-center justify-between bg-gray-900 p-4 text-white">
          <h1 className="text-xl font-bold">My Website</h1>
          <Story />
        </header>
      </NextIntlClientProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export const InNavigation: Story = {
  decorators: [
    Story => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <nav className="flex items-center space-x-4 border-b border-gray-200 p-4">
          <a href="#" className="text-blue-600 hover:underline">Home</a>
          <a href="#" className="text-blue-600 hover:underline">About</a>
          <a href="#" className="text-blue-600 hover:underline">Contact</a>
          <div className="ml-auto">
            <Story />
          </div>
        </nav>
      </NextIntlClientProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};
