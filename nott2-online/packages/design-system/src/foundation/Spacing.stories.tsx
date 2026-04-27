/**
 * Foundation/Spacing
 *
 * Documents spacing, border-radius, and shadow tokens in one place
 * since they all relate to spatial and depth composition.
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const spaceTokens = [
  { token: 'space.xs', value: '4px' },
  { token: 'space.sm', value: '8px' },
  { token: 'space.md', value: '16px' },
  { token: 'space.lg', value: '24px' },
  { token: 'space.xl', value: '32px' },
  { token: 'space.2xl', value: '48px' },
  { token: 'space.3xl', value: '64px' },
];

const radiusTokens = [
  { token: 'radius.sm', value: '2px', label: 'Sharp' },
  { token: 'radius.md', value: '4px', label: 'Default' },
  { token: 'radius.lg', value: '8px', label: 'Soft' },
  { token: 'radius.full', value: '9999px', label: 'Pill' },
];

const shadowTokens = [
  { token: 'shadow.glow', value: '0 0 20px rgba(138, 0, 0, 0.4)', label: 'Glow' },
  { token: 'shadow.glowIntense', value: '0 0 40px rgba(138, 0, 0, 0.6)', label: 'Glow Intense' },
  { token: 'shadow.glowGreen', value: '0 0 20px rgba(45, 90, 45, 0.4)', label: 'Glow Green' },
];

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2
    style={{
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: '1.5rem',
      color: '#e8e8e8',
      marginBottom: 4,
      fontWeight: 600,
    }}
  >
    {children}
  </h2>
);

const SectionSub = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '0.875rem', color: '#6a6a6a', marginTop: 0, marginBottom: 24 }}>
    {children}
  </p>
);

function SpacingTokens() {
  return (
    <div style={{ maxWidth: 640 }}>
      {/* Spacing */}
      <SectionTitle>Spacing</SectionTitle>
      <SectionSub>
        Used for padding, gap, margin. All values are based on a 4px grid.
      </SectionSub>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 48 }}>
        {spaceTokens.map(({ token, value }) => (
          <div
            key={token}
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr 60px',
              alignItems: 'center',
              gap: 16,
              padding: '10px 16px',
              border: '1px solid #2a2a2a',
              borderRadius: '4px',
              backgroundColor: '#141414',
            }}
          >
            <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#dc2626' }}>
              {token}
            </span>
            <div
              style={{
                height: 8,
                backgroundColor: '#8a0000',
                borderRadius: 2,
                width: value,
                maxWidth: '100%',
              }}
            />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: '#6a6a6a',
                textAlign: 'right',
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Radius */}
      <SectionTitle>Border Radius</SectionTitle>
      <SectionSub>
        Controls corner rounding. The system favours sharp corners for a gritty feel.
      </SectionSub>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
        {radiusTokens.map(({ token, value, label }) => (
          <div key={token} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 64,
                height: 64,
                backgroundColor: '#1a1a1a',
                border: '2px solid #8a0000',
                borderRadius: value,
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#dc2626' }}>
                {token}
              </div>
              <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '0.75rem', color: '#e8e8e8' }}>
                {label}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#6a6a6a' }}>
                {value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shadows */}
      <SectionTitle>Shadows & Glows</SectionTitle>
      <SectionSub>
        Box-shadow values used for atmospheric depth and focus states.
      </SectionSub>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {shadowTokens.map(({ token, value, label }) => (
          <div
            key={token}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              padding: '16px 24px',
              border: '1px solid #2a2a2a',
              borderRadius: '4px',
              backgroundColor: '#141414',
            }}
          >
            <div
              style={{
                width: 64,
                height: 40,
                borderRadius: '4px',
                backgroundColor: '#1a1a1a',
                boxShadow: value,
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#dc2626', marginBottom: 2 }}>
                {token}
              </div>
              <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '0.875rem', color: '#e8e8e8', marginBottom: 2 }}>
                {label}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#6a6a6a', wordBreak: 'break-all' }}>
                {value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: 'Foundation/Spacing',
  component: SpacingTokens,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof SpacingTokens>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tokens: Story = {};
