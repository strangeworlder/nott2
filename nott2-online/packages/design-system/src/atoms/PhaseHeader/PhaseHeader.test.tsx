import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PhaseHeader } from './PhaseHeader';

describe('PhaseHeader', () => {
  it('renders the title', () => {
    render(<PhaseHeader title="Scene Setup" />);
    expect(screen.getByText('Scene Setup')).toBeTruthy();
  });

  it('renders subtitle when provided', () => {
    render(<PhaseHeader title="Setup" subtitle="Draw a card." />);
    expect(screen.getByText('Draw a card.')).toBeTruthy();
  });

  it('does not render subtitle when omitted', () => {
    const { container } = render(<PhaseHeader title="Setup" />);
    expect(container.querySelector('p')).toBeNull();
  });

  it('renders step indicator when provided', () => {
    render(<PhaseHeader title="Setup" step={{ current: 1, total: 3 }} />);
    expect(screen.getByText('Step 1 of 3')).toBeTruthy();
  });

  it('does not render step when omitted', () => {
    render(<PhaseHeader title="Setup" />);
    expect(screen.queryByText(/Step/)).toBeNull();
  });

  it('applies an id', () => {
    const { container } = render(<PhaseHeader id="header-1" title="Test" />);
    expect(container.querySelector('#header-1')).toBeTruthy();
  });
});
