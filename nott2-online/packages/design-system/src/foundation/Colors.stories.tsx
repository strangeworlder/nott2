/**
 * Foundation/Colors
 *
 * Documents all color tokens defined in the darkTheme.
 * Groups them by semantic role so designers and developers can see
 * the full palette at a glance.
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Raw token values mirrored from theme.css.ts — kept in sync manually so
// we can render swatches without needing Vanilla Extract at story-render time.
const colorTokens: { token: string; value: string; description: string }[] = [
  { token: 'color.background', value: '#0a0a0a', description: 'Page / root background' },
  { token: 'color.surface', value: '#141414', description: 'Card and panel surfaces' },
  { token: 'color.surfaceElevated', value: '#1a1a1a', description: 'Modals and elevated surfaces' },
  { token: 'color.accent', value: '#8a0000', description: 'Primary brand accent (blood red)' },
  { token: 'color.accentBright', value: '#dc2626', description: 'Hover / active state of accent' },
  { token: 'color.text', value: '#e8e8e8', description: 'Primary body text' },
  { token: 'color.textMuted', value: '#6a6a6a', description: 'Secondary / placeholder text' },
  { token: 'color.success', value: '#2d5a2d', description: 'Positive feedback (survival green)' },
  { token: 'color.border', value: '#2a2a2a', description: 'Default border / divider' },
  { token: 'color.borderActive', value: '#8a0000', description: 'Focused / selected border' },
];

interface SwatchProps {
  token: string;
  value: string;
  description: string;
}

function Swatch({ token, value, description }: SwatchProps) {
  const isLight = value === '#e8e8e8';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '12px 16px',
        borderRadius: '4px',
        border: '1px solid #2a2a2a',
        backgroundColor: '#141414',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '4px',
          backgroundColor: value,
          border: '1px solid #3a3a3a',
          flexShrink: 0,
          boxShadow: value === '#8a0000' || value === '#dc2626'
            ? '0 0 12px rgba(138,0,0,0.5)'
            : undefined,
        }}
        aria-label={`Color swatch: ${value}`}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            color: '#dc2626',
            marginBottom: 2,
          }}
        >
          {token}
        </div>
        <div
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '0.875rem',
            color: '#e8e8e8',
            marginBottom: 2,
          }}
        >
          {description}
        </div>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            color: '#6a6a6a',
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function ColorPalette() {
  return (
    <div style={{ maxWidth: 640 }}>
      <h2
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '1.5rem',
          color: '#e8e8e8',
          marginBottom: 4,
          fontWeight: 600,
        }}
      >
        Color Tokens
      </h2>
      <p
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '0.875rem',
          color: '#6a6a6a',
          marginBottom: 24,
        }}
      >
        All colors come from the <code style={{ color: '#dc2626' }}>vars.color</code> contract.
        Playsets override these values without touching component code.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {colorTokens.map((c) => (
          <Swatch key={c.token} {...c} />
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: 'Foundation/Colors',
  component: ColorPalette,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof ColorPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Palette: Story = {};
