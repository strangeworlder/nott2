/**
 * Foundation/Motion
 *
 * Documents all transition tokens and demonstrates their feel via interactive
 * hover boxes, so designers can test motion timing without needing to wire
 * up a full component interaction.
 */

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const transitionTokens = [
  {
    token: 'transition.fast',
    value: '150ms ease-out',
    description: 'Micro-interactions: tooltips, ripples, badge flashes',
  },
  {
    token: 'transition.normal',
    value: '200ms ease-out',
    description: 'Default: button hover, border color, opacity fades',
  },
  {
    token: 'transition.slow',
    value: '400ms ease-out',
    description: 'Dramatic reveals: panel open/close, modal entry',
  },
];

function DemoBox({ token, value, description }: { token: string; value: string; description: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        padding: '20px 24px',
        border: '1px solid #2a2a2a',
        borderRadius: '4px',
        backgroundColor: '#141414',
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#dc2626', marginBottom: 4 }}>
          {token}
        </div>
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '0.875rem', color: '#e8e8e8', marginBottom: 4 }}>
          {description}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#6a6a6a' }}>{value}</div>
      </div>

      {/* Interactive demo */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          height: 48,
          borderRadius: '4px',
          backgroundColor: hovered ? '#8a0000' : '#1a1a1a',
          border: `1px solid ${hovered ? '#dc2626' : '#2a2a2a'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: `background-color ${value}, border-color ${value}`,
          boxShadow: hovered ? '0 0 20px rgba(138,0,0,0.4)' : 'none',
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '0.8rem',
          color: hovered ? '#e8e8e8' : '#6a6a6a',
          userSelect: 'none',
        }}
      >
        {hovered ? 'Feel the timing ↑' : 'Hover to preview →'}
      </div>
    </div>
  );
}

function MotionScale() {
  return (
    <div style={{ maxWidth: 600 }}>
      <h2
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '1.5rem',
          color: '#e8e8e8',
          marginBottom: 4,
          fontWeight: 600,
        }}
      >
        Motion Tokens
      </h2>
      <p
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '0.875rem',
          color: '#6a6a6a',
          marginBottom: 24,
        }}
      >
        Hover each box to feel the transition in real time. All durations use{' '}
        <code style={{ color: '#dc2626' }}>ease-out</code> — movements that start fast and
        decelerate feel authoritative and deliberate.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {transitionTokens.map((t) => (
          <DemoBox key={t.token} {...t} />
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: 'Foundation/Motion',
  component: MotionScale,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof MotionScale>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Transitions: Story = {};
