import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { SelectableTile } from './SelectableTile';

describe('SelectableTile', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<SelectableTile>Face 1</SelectableTile>);
    expect(getByText('Face 1')).toBeTruthy();
  });

  it('handles clicks', () => {
    const handler = vi.fn();
    const { getByText } = render(<SelectableTile onClick={handler}>Click Me</SelectableTile>);
    fireEvent.click(getByText('Click Me'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('applies aria-pressed when selected', () => {
    const { getByRole, rerender } = render(<SelectableTile selected={true}>Toggle</SelectableTile>);
    expect(getByRole('button')).toHaveAttribute('aria-pressed', 'true');

    rerender(<SelectableTile selected={false}>Toggle</SelectableTile>);
    expect(getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('respects disabled state', () => {
    const handler = vi.fn();
    const { getByRole } = render(<SelectableTile disabled onClick={handler}>Disabled</SelectableTile>);
    const button = getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handler).not.toHaveBeenCalled();
  });
});
