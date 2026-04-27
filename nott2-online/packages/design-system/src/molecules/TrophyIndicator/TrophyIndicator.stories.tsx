import type { Meta, StoryObj } from '@storybook/react';
import { TrophyIndicator } from './TrophyIndicator';

const meta = {
  title: 'Molecules/TrophyIndicator',
  component: TrophyIndicator,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof TrophyIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NumberCard: Story = { args: { suit: 'Hearts', rank: 7 } };
export const TenOfSpades: Story = { args: { suit: 'Spades', rank: 10 } };
export const FaceCard: Story = { args: { suit: 'Diamonds', rank: 12 } };
export const Ace: Story = { args: { suit: 'Clubs', rank: 1 } };
