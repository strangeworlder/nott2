import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultBanner } from './ResultBanner';

describe('ResultBanner', () => {
  it('renders SUCCESS for success outcome', () => {
    render(<ResultBanner outcome="success" />);
    expect(screen.getByText('SUCCESS')).toBeTruthy();
  });

  it('renders FAILURE for failure outcome', () => {
    render(<ResultBanner outcome="failure" />);
    expect(screen.getByText('FAILURE')).toBeTruthy();
  });

  it('renders total and difficulty when provided', () => {
    render(<ResultBanner outcome="success" total={8} difficulty={6} />);
    expect(screen.getByText('Total 8 vs Difficulty 6')).toBeTruthy();
  });

  it('does not render breakdown when values are missing', () => {
    render(<ResultBanner outcome="failure" />);
    expect(screen.queryByText(/Total/)).toBeNull();
  });

  it('has role="status"', () => {
    render(<ResultBanner outcome="success" />);
    expect(screen.getByRole('status')).toBeTruthy();
  });
});
