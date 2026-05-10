import type { Meta, StoryObj } from '@storybook/react';
import { DieChip } from './DieChip';

const meta = {
  title: 'Atoms/DieChip',
  component: DieChip,
  parameters: { layout: 'centered', backgrounds: { default: 'dark' } },
  tags: ['autodocs'],
} satisfies Meta<typeof DieChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const D10Default: Story = { args: { die: 'd10', value: 7 } };
export const D4Default: Story = { args: { die: 'd4', value: 3 } };
export const D10Modified: Story = {
  args: { die: 'd10', value: 8, modified: true, originalValue: 5 },
};
export const D4Modified: Story = {
  args: { die: 'd4', value: 3, modified: true, originalValue: 2 },
};
export const D10Zero: Story = { args: { die: 'd10', value: 0 } };
export const D4Max: Story = { args: { die: 'd4', value: 4 } };

export const AllVariants: Story = {
  args: { die: 'd10', value: 0 },
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      <DieChip die="d10" value={7} />
      <DieChip die="d4" value={3} />
      <DieChip die="d10" value={8} modified originalValue={5} />
      <DieChip die="d4" value={3} modified originalValue={2} />
    </div>
  ),
};
