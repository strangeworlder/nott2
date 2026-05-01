import type { Meta, StoryObj } from '@storybook/react';
import { CardMatt } from './CardMatt';

const meta: Meta<typeof CardMatt> = {
  title: 'Molecules/CardMatt',
  component: CardMatt,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#0a0a0a' }] },
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof CardMatt>;

/** Default empty state — dashed border, "Draw from deck" hint */
export const Empty: Story = {
  args: { title: 'Visible Threats', count: 0 },
};

/** With 1 card — count badge shows "1 card" */
export const OneCard: Story = {
  args: { title: 'Visible Threats', count: 1 },
};

/** With multiple cards — count badge shows "3 cards" */
export const MultipleCards: Story = {
  args: { title: 'Visible Threats', count: 3 },
};

/** Custom title and hint */
export const CustomLabels: Story = {
  args: {
    title: 'Battlefield',
    count: 0,
    emptyHint: 'Deploy units here',
  },
};

/** Tall matt — demonstrates minimum height and scalability */
export const TallMatt: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640, margin: '0 auto', height: 400 }}>
        <Story />
      </div>
    ),
  ],
  args: { title: 'Visible Threats', count: 5 },
};

/** Glowing matt — signals to the player that a card should be selected */
export const Glowing: Story = {
  args: { title: 'Visible Threats', count: 2, glow: true },
};
