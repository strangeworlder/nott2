import type { Meta, StoryObj } from '@storybook/react';
import { StrikeIndicator } from './StrikeIndicator';

const meta: Meta<typeof StrikeIndicator> = {
  title: 'Molecules/StrikeIndicator',
  component: StrikeIndicator,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof StrikeIndicator>;

export const Zero: Story = { args: { strikes: 0 } };
export const One: Story = { args: { strikes: 1 } };
export const Two: Story = { args: { strikes: 2 } };
export const Three: Story = { args: { strikes: 3 } };
export const Dead: Story = { args: { isDead: true } };
export const AnimatedStrike: Story = { args: { strikes: 1, animated: true } };
