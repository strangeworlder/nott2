import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './Separator';
import { Text } from '../Text/Text';

const meta = {
  title: 'Atoms/Separator',
  component: Separator,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BetweenContent: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Text variant="h3">Act I — The Setup</Text>
      <Separator />
      <Text variant="body" color="muted">The night begins. Thirteen cards await their fate.</Text>
    </div>
  ),
};
