import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { children: 'Continue' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Debug: Story = { args: { variant: 'debug', children: 'Debug Mode' } };
export const Disabled: Story = { args: { variant: 'primary', disabled: true } };
export const Block: Story = {
  args: { variant: 'primary', block: true },
  parameters: { layout: 'padded' },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Button key={size} {...args} size={size}>{size.toUpperCase()}</Button>
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      {(['primary', 'secondary', 'ghost', 'debug'] as const).map((variant) => (
        <Button key={variant} {...args} variant={variant}>{variant}</Button>
      ))}
    </div>
  ),
};
