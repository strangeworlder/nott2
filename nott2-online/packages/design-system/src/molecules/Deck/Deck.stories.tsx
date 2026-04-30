import type { Meta, StoryObj } from '@storybook/react';
import { Deck } from './Deck';

const meta: Meta<typeof Deck> = {
  title: 'Molecules/Deck',
  component: Deck,
  tags: ['autodocs'],
  args: { count: 12, label: 'Threat Deck' },
};
export default meta;
type Story = StoryObj<typeof Deck>;

// ── Face-down (default) ───────────────────────────────────────────────────────

export const Default: Story = {
  args: { count: 12, label: 'Threat Deck' },
};

export const Shuffled: Story = {
  args: { count: 12, label: 'Threat Deck', status: 'shuffled' },
};

export const Empty: Story = {
  args: { count: 0, label: 'Threat Deck', status: 'empty' },
};

export const Compact: Story = {
  args: { count: 8, label: 'Threat Deck', compact: true },
};

export const Interactive: Story = {
  args: { count: 12, label: 'Threat Deck', onClick: () => alert('Draw!') },
};

/** Pulsing amber/crimson glow — signals that cards can be drawn from this deck. */
export const Glowing: Story = {
  args: { count: 12, label: 'Threat Deck', glow: true },
};

/** Glowing + interactive — the full "draw from me" state used in gameplay. */
export const GlowingInteractive: Story = {
  name: 'Glowing / Interactive (Draw State)',
  args: { count: 12, label: 'Threat Deck', glow: true, onClick: () => alert('Draw!') },
};

export const NoLabel: Story = {
  args: { count: 5 },
};

export const NumberReserve: Story = {
  args: { count: 27, label: 'Number Reserve' },
};

export const FaceCardReserve: Story = {
  args: { count: 11, label: 'Face Card Reserve' },
};

export const SingleCard: Story = {
  args: { count: 1, label: 'Last Card' },
};

// ── Face-up top card ─────────────────────────────────────────────────────────

/** Trophy Pile: top card is face-up, remaining cards are face-down. Hover to see count. */
export const TrophyPile: Story = {
  name: 'Top Card / Trophy Pile',
  args: {
    count: 4,
    label: 'Trophy',
    topCard: { suit: 'Hearts', rank: 7 },
  },
};

/** Trophy Pile at the start of the game — a single card on an empty pile. */
export const TrophySingle: Story = {
  name: 'Top Card / Trophy (1 card)',
  args: {
    count: 1,
    label: 'Trophy',
    topCard: { suit: 'Spades', rank: 5 },
  },
};

/** Compact top-card variant — for use inside tight vertical sidebars. */
export const TrophyCompact: Story = {
  name: 'Top Card / Trophy (compact)',
  args: {
    count: 3,
    label: 'Trophy',
    topCard: { suit: 'Diamonds', rank: 10 },
    compact: true,
  },
};

/** Joker sits on top of the threat deck during the Finale. */
export const TopCardJoker: Story = {
  name: 'Top Card / Joker (Red)',
  args: {
    count: 2,
    label: 'Threat Deck',
    topCard: { joker: true, jokerColor: 'Red' },
  },
};
