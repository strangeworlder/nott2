import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActionFooter } from './ActionFooter';

describe('ActionFooter', () => {
  it('renders label', () => {
    render(<ActionFooter label="Next Phase" />);
    expect(screen.getByRole('button', { name: 'Next Phase' })).toBeTruthy();
  });

  it('renders hint text when provided', () => {
    render(<ActionFooter label="Go" hint="Choose a card first" />);
    expect(screen.getByText('Choose a card first')).toBeTruthy();
  });

  it('fires onClick when clicked', () => {
    const handler = vi.fn();
    render(<ActionFooter label="Go" onClick={handler} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('is disabled when prop set', () => {
    render(<ActionFooter label="Go" disabled />);
    expect(screen.getByRole('button')).toHaveProperty('disabled', true);
  });
});
