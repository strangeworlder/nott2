import type { Meta, StoryObj } from '@storybook/react';
import { DoomClock } from './DoomClock';

const meta = {
  title: 'Molecules/DoomClock',
  component: DoomClock,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0a0a0a' }],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    current: {
      control: { type: 'range', min: 0, max: 13, step: 1 },
      description: 'Number of reserve cards added so far (0–13)',
    },
  },
} satisfies Meta<typeof DoomClock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Act 2 just started — clock is empty, 13 cards to go. */
export const Empty: Story = { args: { current: 0 } };

/** Mid-Act 2 — six cards added, the hour hand is climbing. */
export const HalfFull: Story = { args: { current: 6 } };

/** Clock reaches amber — the dread is building (10 cards). */
export const AmberWarning: Story = { args: { current: 10 } };

/** One card away from midnight — pulse ring visible (12 cards). */
export const NearlyFull: Story = { args: { current: 12 } };

/**
 * The 13th card. The clock was never meant to reach this hour.
 * The face shatters. Act 3 begins.
 */
export const Broken: Story = { args: { current: 13 } };

/** Interactive — drag the slider to watch the clock advance and break. */
export const Interactive: Story = {
  args: { current: 0 },
  render: (args) => <DoomClock {...args} />,
};
