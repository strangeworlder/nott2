import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EffortBand } from './EffortBand';

describe('EffortBand', () => {
  it('renders the level label', () => {
    render(<EffortBand level="controlled" />);
    expect(screen.getByText('Controlled')).toBeTruthy();
  });

  it('renders the description by default', () => {
    render(<EffortBand level="controlled" />);
    expect(screen.getByText('No extra cost.')).toBeTruthy();
  });

  it('hides description when showDescription=false', () => {
    render(<EffortBand level="controlled" showDescription={false} />);
    expect(screen.queryByText('No extra cost.')).toBeNull();
  });

  it('renders all levels without error', () => {
    const levels = ['controlled', 'pushing-it', 'overexertion', 'breaking-point'] as const;
    for (const l of levels) {
      const { unmount } = render(<EffortBand level={l} />);
      expect(screen.getByRole('status')).toBeTruthy();
      unmount();
    }
  });
});
