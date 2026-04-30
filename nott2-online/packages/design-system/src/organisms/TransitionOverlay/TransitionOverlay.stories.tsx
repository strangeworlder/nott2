import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TransitionOverlay } from './TransitionOverlay';
import { DoomClockTransition } from '../../molecules/DoomClockTransition/DoomClockTransition';

const meta = {
  title: 'Organisms/TransitionOverlay',
  component: TransitionOverlay,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0a0a0a' }],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TransitionOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Overlay with a simple text transition. Click backdrop to dismiss. */
export const SimpleText: Story = {
  args: {
    visible: true,
    onDismiss: () => console.log('dismissed'),
    onExited: () => console.log('exited'),
    children: (
      <div style={{ color: '#e8e8e8', fontFamily: 'serif', fontSize: '2rem', textAlign: 'center' }}>
        Act 2 Begins
      </div>
    ),
  },
};

/**
 * Full integration: TransitionOverlay + DoomClockTransition.
 * Click backdrop to dismiss, or wait for auto-complete.
 */
export const WithDoomClock: Story = {
  args: {
    visible: true,
    onDismiss: () => {},
    onExited: () => {},
    children: null,
  },
  render: () => {
    const [visible, setVisible] = useState(true);
    return (
      <div>
        <button onClick={() => setVisible(true)} style={{ color: '#e8e8e8', padding: 12 }}>
          Show Transition
        </button>
        <TransitionOverlay
          visible={visible}
          onDismiss={() => setVisible(false)}
          onExited={() => console.log('exited')}
        >
          <DoomClockTransition
            from={5}
            to={6}
            onComplete={() => setVisible(false)}
          />
        </TransitionOverlay>
      </div>
    );
  },
};

/** Broken clock variant inside the overlay. */
export const WithBrokenClock: Story = {
  args: {
    visible: true,
    onDismiss: () => {},
    onExited: () => {},
    children: null,
  },
  render: () => {
    const [visible, setVisible] = useState(true);
    return (
      <div>
        <button onClick={() => setVisible(true)} style={{ color: '#e8e8e8', padding: 12 }}>
          Show Break Transition
        </button>
        <TransitionOverlay
          visible={visible}
          onDismiss={() => setVisible(false)}
          onExited={() => console.log('exited')}
        >
          <DoomClockTransition
            from={12}
            to={13}
            isBroken
            onComplete={() => setVisible(false)}
          />
        </TransitionOverlay>
      </div>
    );
  },
};
