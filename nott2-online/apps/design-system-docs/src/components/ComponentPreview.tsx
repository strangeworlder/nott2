/**
 * ComponentPreview
 *
 * A container for rendering live design system components inside
 * documentation pages. Automatically applies the dark theme and
 * wraps children in a styled preview box.
 *
 * Usage in MDX:
 *   <ComponentPreview>
 *     <Button variant="primary">Click me</Button>
 *   </ComponentPreview>
 */

import React from 'react';
import { ThemeProvider } from './ThemeProvider';

interface ComponentPreviewProps {
  children: React.ReactNode;
  /** Arrange items in a column instead of a row */
  column?: boolean;
  /** Align items to the start instead of center */
  start?: boolean;
  /** Optional label shown above the preview */
  label?: string;
}

export function ComponentPreview({
  children,
  column = false,
  start = false,
  label,
}: ComponentPreviewProps) {
  const className = [
    'ds-preview',
    column && 'ds-preview--column',
    start && 'ds-preview--start',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div>
      {label && (
        <div
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#6a6a6a',
            marginBottom: 4,
          }}
        >
          {label}
        </div>
      )}
      <ThemeProvider>
        <div className={className}>{children}</div>
      </ThemeProvider>
    </div>
  );
}
