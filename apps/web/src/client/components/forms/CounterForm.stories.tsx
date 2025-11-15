import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from '@storybook/test';
import { CounterForm } from './CounterForm';

const meta = {
  title: 'Forms/CounterForm',
  component: CounterForm,
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
    nextjs: {
      appDirectory: true,
      navigation: {
        push: fn(),
        refresh: fn(),
      },
    },
  },
  decorators: [
    Story => (
      <div className="w-96 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CounterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state of the CounterForm with increment value of 1
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify form elements are rendered
    const input = canvas.getByLabelText(/increment by/i);
    const button = canvas.getByRole('button', { name: /increment/i });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(input).toHaveValue(1);
    expect(button).not.toBeDisabled();
  },
};

/**
 * Form with minimum valid value (1)
 */
export const MinimumValue: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/increment by/i);

    await userEvent.clear(input);
    await userEvent.type(input, '1');

    expect(input).toHaveValue(1);
  },
};

/**
 * Form with maximum valid value (3)
 */
export const MaximumValue: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/increment by/i);

    await userEvent.clear(input);
    await userEvent.type(input, '3');

    expect(input).toHaveValue(3);
  },
};

/**
 * Form showing validation error for value below minimum
 */
export const ErrorBelowMinimum: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/increment by/i);
    const button = canvas.getByRole('button', { name: /increment/i });

    // Clear and enter invalid value
    await userEvent.clear(input);
    await userEvent.type(input, '0');

    // Try to submit
    await userEvent.click(button);

    // Wait for error message
    const errorMessage = await canvas.findByText(
      /value must be between 1 and 3/i,
    );
    expect(errorMessage).toBeInTheDocument();
  },
};

/**
 * Form showing validation error for value above maximum
 */
export const ErrorAboveMaximum: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/increment by/i);
    const button = canvas.getByRole('button', { name: /increment/i });

    // Clear and enter invalid value
    await userEvent.clear(input);
    await userEvent.type(input, '5');

    // Try to submit
    await userEvent.click(button);

    // Wait for error message
    const errorMessage = await canvas.findByText(
      /value must be between 1 and 3/i,
    );
    expect(errorMessage).toBeInTheDocument();
  },
};

/**
 * Form with a typical increment value of 2
 */
export const TypicalUsage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/increment by/i);

    await userEvent.clear(input);
    await userEvent.type(input, '2');

    expect(input).toHaveValue(2);
  },
};

/**
 * Full width layout variant
 */
export const FullWidth: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold">Counter Increment Form</h2>
          <Story />
        </div>
      </div>
    ),
  ],
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
 * Form in dark mode context
 */
export const DarkMode: Story = {
  decorators: [
    Story => (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="mx-auto max-w-md">
          <Story />
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
 * Form with keyboard navigation test
 */
export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/increment by/i);
    const button = canvas.getByRole('button', { name: /increment/i });

    // Tab to input
    await userEvent.tab();
    expect(input).toHaveFocus();

    // Use arrow keys to change value
    await userEvent.keyboard('[ArrowUp]');
    expect(input).toHaveValue(2);

    await userEvent.keyboard('[ArrowDown]');
    expect(input).toHaveValue(1);

    // Tab to button
    await userEvent.tab();
    expect(button).toHaveFocus();
  },
};
