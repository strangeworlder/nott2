/**
 * Foundation/Typography
 *
 * Documents all font-family and font-size tokens, rendered live
 * so contributors can see exactly how each scale looks on screen.
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const fontFamilyTokens = [
  {
    token: 'font.display',
    value: "'Playfair Display', Georgia, serif",
    sample: 'Night falls. No one escapes.',
    description: 'Headlines, chapter titles, dramatic moments',
  },
  {
    token: 'font.body',
    value: "'Inter', system-ui, sans-serif",
    sample: 'Draw a card. Apply its effect to the current hunter.',
    description: 'All body copy, labels, UI text',
  },
];

const fontSizeTokens = [
  { token: 'fontSize.hero', value: 'clamp(3rem, 8vw, 6rem)', label: 'Hero' },
  { token: 'fontSize.h1', value: 'clamp(2rem, 5vw, 3.5rem)', label: 'H1' },
  { token: 'fontSize.h2', value: 'clamp(1.5rem, 3vw, 2.5rem)', label: 'H2' },
  { token: 'fontSize.h3', value: '1.25rem', label: 'H3' },
  { token: 'fontSize.body', value: '1rem', label: 'Body' },
  { token: 'fontSize.label', value: '0.875rem', label: 'Label' },
  { token: 'fontSize.micro', value: '0.625rem', label: 'Micro' },
];

const sectionHeader = (title: string, sub: string) => (
  <div style={{ marginBottom: 24 }}>
    <h2
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '1.5rem',
        color: '#e8e8e8',
        marginBottom: 4,
        fontWeight: 600,
      }}
    >
      {title}
    </h2>
    <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '0.875rem', color: '#6a6a6a', margin: 0 }}>
      {sub}
    </p>
  </div>
);

function TypographyScale() {
  return (
    <div style={{ maxWidth: 720 }}>
      {/* Font Families */}
      {sectionHeader(
        'Font Families',
        'Two typefaces: one dramatic (display), one legible (body).',
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
        {fontFamilyTokens.map(({ token, value, sample, description }) => (
          <div
            key={token}
            style={{
              padding: '20px 24px',
              border: '1px solid #2a2a2a',
              borderRadius: '4px',
              backgroundColor: '#141414',
            }}
          >
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: '#dc2626',
                marginBottom: 8,
              }}
            >
              {token}
            </div>
            <div
              style={{
                fontFamily: value,
                fontSize: '1.5rem',
                color: '#e8e8e8',
                lineHeight: 1.3,
                marginBottom: 8,
              }}
            >
              {sample}
            </div>
            <div
              style={{
                display: 'flex',
                gap: 16,
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                color: '#6a6a6a',
              }}
            >
              <span>{description}</span>
              <span style={{ marginLeft: 'auto' }}>{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Type Scale */}
      {sectionHeader(
        'Type Scale',
        'Sizes from vars.fontSize. Hero/H1/H2 use clamp() for fluid scaling.',
      )}
      <div
        style={{
          border: '1px solid #2a2a2a',
          borderRadius: '4px',
          overflow: 'hidden',
          backgroundColor: '#141414',
        }}
      >
        {fontSizeTokens.map(({ token, value, label }, i) => (
          <div
            key={token}
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr 160px',
              alignItems: 'center',
              gap: 16,
              padding: '16px 24px',
              borderBottom: i < fontSizeTokens.length - 1 ? '1px solid #2a2a2a' : undefined,
            }}
          >
            <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#dc2626' }}>
              {token}
            </div>
            <div
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: value,
                color: '#e8e8e8',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.2,
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                color: '#6a6a6a',
                textAlign: 'right',
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: 'Foundation/Typography',
  component: TypographyScale,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof TypographyScale>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {};
