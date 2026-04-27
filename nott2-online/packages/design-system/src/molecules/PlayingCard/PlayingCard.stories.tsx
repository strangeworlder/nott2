import type { Meta, StoryObj } from '@storybook/react';
import { PlayingCard } from './PlayingCard';

const meta: Meta<typeof PlayingCard> = {
  title: 'Molecules/PlayingCard',
  component: PlayingCard,
  tags: ['autodocs'],
  args: { suit: 'Spades', rank: 1 },
};
export default meta;
type Story = StoryObj<typeof PlayingCard>;

export const Ace: Story = { args: { suit: 'Spades', rank: 1 } };
export const Seven: Story = { args: { suit: 'Hearts', rank: 7 } };
export const Jack: Story = { args: { suit: 'Clubs', rank: 11 } };
export const Queen: Story = { args: { suit: 'Diamonds', rank: 12 } };
export const King: Story = { args: { suit: 'Spades', rank: 13 } };
export const RedJoker: Story = { args: { joker: true, jokerColor: 'Red' } };
export const BlackJoker: Story = { args: { joker: true, jokerColor: 'Black' } };
export const Selected: Story = { args: { suit: 'Hearts', rank: 5, selected: true } };
export const FaceDown: Story = { args: { suit: 'Spades', rank: 1, faceDown: true } };
export const Compact: Story = { args: { suit: 'Diamonds', rank: 10, compact: true } };
