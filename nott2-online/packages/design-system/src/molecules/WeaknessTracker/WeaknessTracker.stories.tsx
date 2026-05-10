import type { Meta, StoryObj } from '@storybook/react';
import { WeaknessTracker } from './WeaknessTracker';

const meta = {
  title: 'Molecules/WeaknessTracker',
  component: WeaknessTracker,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 32, backgroundColor: '#0a0a0a', borderRadius: 8, maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WeaknessTracker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoneFound: Story = { args: { found: new Set() } };
export const OneFound: Story = { args: { found: new Set(['Hearts']) } };
export const TwoFound: Story = { args: { found: new Set(['Spades', 'Hearts']) } };
export const AllFound: Story = { args: { found: new Set(['Spades', 'Hearts', 'Clubs', 'Diamonds']) } };
