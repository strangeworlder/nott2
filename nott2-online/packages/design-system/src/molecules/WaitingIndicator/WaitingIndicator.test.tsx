import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WaitingIndicator } from './WaitingIndicator';

describe('WaitingIndicator', () => {
  it('renders default message', () => {
    render(<WaitingIndicator />);
    expect(screen.getByText('Waiting…')).toBeTruthy();
  });

  it('renders custom message', () => {
    render(<WaitingIndicator message="Waiting for host to draw…" />);
    expect(screen.getByText('Waiting for host to draw…')).toBeTruthy();
  });

  it('has role="status" and aria-live', () => {
    render(<WaitingIndicator />);
    const el = screen.getByRole('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });
});
