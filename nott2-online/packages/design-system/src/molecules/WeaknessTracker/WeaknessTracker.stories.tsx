import type { Meta, StoryObj } from '@storybook/react';
import { WeaknessTracker } from './WeaknessTracker';

const meta = {
  title: 'Molecules/WeaknessTracker',
  component: WeaknessTracker,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof WeaknessTracker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoneFound: Story = { args: { found: new Set() } };
export const TwoFound: Story = { args: { found: new Set(['Spades', 'Hearts']) } };
export const AllFound: Story = { args: { found: new Set(['Spades', 'Hearts', 'Clubs', 'Diamonds']) } };
