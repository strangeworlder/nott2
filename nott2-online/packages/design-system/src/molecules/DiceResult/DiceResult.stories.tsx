import type { Meta, StoryObj } from '@storybook/react';
import { DiceResult } from './DiceResult';

const meta = {
  title: 'Molecules/DiceResult',
  component: DiceResult,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof DiceResult>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = { args: { d10: 7, d4: 3 } };
export const WithAptitudeBoost: Story = {
  args: { d10: 7, d4: 3, modifier: { value: 1, label: 'Aptitude' }, originalD4: 2 },
};
export const WithAptitudeReduce: Story = {
  args: { d10: 5, d4: 3, modifier: { value: -1, label: 'Aptitude' }, originalD4: 4 },
};
export const BreakingPoint: Story = { args: { d10: 9, d4: 4 } };
export const LowRoll: Story = { args: { d10: 0, d4: 1 } };
