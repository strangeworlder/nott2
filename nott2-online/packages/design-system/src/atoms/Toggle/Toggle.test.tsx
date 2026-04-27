import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toggle } from './Toggle';

describe('Toggle — button variant', () => {
  it('shows labelOff when value is false', () => {
    render(<Toggle value={false} onChange={() => {}} labelOn="On" labelOff="Off" />);
    expect(screen.getByText('Off')).toBeTruthy();
  });

  it('shows labelOn when value is true', () => {
    render(<Toggle value={true} onChange={() => {}} labelOn="On" labelOff="Off" />);
    expect(screen.getByText('On')).toBeTruthy();
  });

  it('calls onChange with toggled value', () => {
    const handler = vi.fn();
    render(<Toggle value={false} onChange={handler} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledWith(true);
  });

  it('uses default labels when not provided', () => {
    render(<Toggle value={false} onChange={() => {}} />);
    expect(screen.getByText('Off')).toBeTruthy();
  });
});

describe('Toggle — switch variant', () => {
  it('renders with role=switch', () => {
    render(<Toggle value={false} onChange={() => {}} variant="switch" />);
    expect(screen.getByRole('switch')).toBeTruthy();
  });

  it('calls onChange when clicked', () => {
    const handler = vi.fn();
    render(<Toggle value={false} onChange={handler} variant="switch" />);
    fireEvent.click(screen.getByRole('switch'));
    expect(handler).toHaveBeenCalledWith(true);
  });
});
