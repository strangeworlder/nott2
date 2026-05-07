import type { Meta, StoryObj } from '@storybook/react';
import { CharacterCard } from './CharacterCard';

const meta = {
  title: 'Molecules/CharacterCard',
  component: CharacterCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    name: 'Alex',
    suit: 'Spades',
    strikes: 0,
    genrePoints: 0,
    isActive: false,
    isDead: false,
    hasAceToken: false,
    hasActed: false,
  },
} satisfies Meta<typeof CharacterCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ActivePlayer: Story = {
  args: {
    name: 'Sam',
    suit: 'Hearts',
    isActive: true,
  },
};

export const WithStrikesAndGP: Story = {
  args: {
    name: 'Jordan',
    suit: 'Clubs',
    strikes: 2,
    genrePoints: 3,
  },
};

export const Dead: Story = {
  args: {
    name: 'Taylor',
    suit: 'Diamonds',
    strikes: 3,
    isDead: true,
  },
};

export const WithAceToken: Story = {
  args: {
    name: 'Casey',
    suit: 'Spades',
    hasAceToken: true,
  },
};

export const WithActedAceToken: Story = {
  args: {
    name: 'Casey',
    suit: 'Spades',
    hasAceToken: true,
    hasActed: true,
  },
};
