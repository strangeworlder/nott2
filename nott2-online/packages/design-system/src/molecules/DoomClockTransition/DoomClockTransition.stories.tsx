import type { Meta, StoryObj } from '@storybook/react';
import { DoomClockTransition } from './DoomClockTransition';

const meta = {
  title: 'Molecules/DoomClockTransition',
  component: DoomClockTransition,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0a0a0a' }],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    from: {
      control: { type: 'range', min: 0, max: 12, step: 1 },
      description: 'Clock position before the tick',
    },
    to: {
      control: { type: 'range', min: 1, max: 13, step: 1 },
      description: 'Clock position after the tick',
    },
    isBroken: {
      control: 'boolean',
      description: 'Whether to show the break animation',
    },
  },
} satisfies Meta<typeof DoomClockTransition>;

export default meta;
type Story = StoryObj<typeof meta>;

/** First tick — hand sweeps from 12 o'clock to 1 o'clock. */
export const FirstTick: Story = {
  args: { from: 0, to: 1, onComplete: () => console.log('tick complete') },
};

/** Mid-game tick — hand sweeps from 6 to 7. */
export const MidTick: Story = {
  args: { from: 6, to: 7, onComplete: () => console.log('tick complete') },
};

/** Penultimate tick — amber warning zone. */
export const AmberTick: Story = {
  args: { from: 10, to: 11, onComplete: () => console.log('tick complete') },
};

/** Nearly midnight — the dread is palpable. */
export const FinalTick: Story = {
  args: { from: 11, to: 12, onComplete: () => console.log('tick complete') },
};

/** The clock breaks. The 13th hour arrives. */
export const ClockBreaks: Story = {
  args: { from: 12, to: 13, isBroken: true, onComplete: () => console.log('break complete') },
};

/** Interactive — drag the sliders to preview any tick. */
export const Interactive: Story = {
  args: { from: 0, to: 1, isBroken: false, onComplete: () => console.log('complete') },
};
