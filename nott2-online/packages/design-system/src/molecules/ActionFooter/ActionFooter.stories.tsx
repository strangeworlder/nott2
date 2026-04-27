import type { Meta, StoryObj } from '@storybook/react';
import { ActionFooter } from './ActionFooter';

const meta: Meta<typeof ActionFooter> = {
  title: 'Molecules/ActionFooter',
  component: ActionFooter,
  tags: ['autodocs'],
  args: { label: 'Next Phase', onClick: () => {} },
};
export default meta;
type Story = StoryObj<typeof ActionFooter>;

export const Primary: Story = {};
export const WithHint: Story = { args: { label: 'Apply Fallout', hint: 'Make sure strikes are assigned first.' } };
export const Disabled: Story = { args: { label: 'Select a card first', disabled: true } };
export const Secondary: Story = { args: { label: 'Skip', variant: 'secondary' } };
export const Ghost: Story = { args: { label: 'Cancel', variant: 'ghost' } };
