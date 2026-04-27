import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DieSelector } from './DieSelector';

describe('DieSelector', () => {
  it('renders correct number of faces for d4', () => {
    render(<DieSelector sides={4} value={null} onChange={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });

  it('renders correct number of faces for d10', () => {
    render(<DieSelector sides={10} value={null} onChange={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(10);
  });

  it('d10 faces start at 0, not 1', () => {
    render(<DieSelector sides={10} value={null} onChange={vi.fn()} />);
    expect(screen.getByLabelText('0')).toBeTruthy();
    expect(screen.queryByLabelText('10')).toBeNull();
  });

  it('calls onChange with clicked value', () => {
    const handler = vi.fn();
    render(<DieSelector sides={4} value={null} onChange={handler} />);
    fireEvent.click(screen.getByLabelText('3'));
    expect(handler).toHaveBeenCalledWith(3);
  });

  it('marks selected face as pressed', () => {
    render(<DieSelector sides={4} value={2} onChange={vi.fn()} />);
    const face = screen.getByLabelText('2');
    expect(face.getAttribute('aria-pressed')).toBe('true');
  });

  it('renders label when provided', () => {
    render(<DieSelector sides={4} value={null} onChange={vi.fn()} label="d4" />);
    expect(screen.getByText('d4')).toBeTruthy();
  });
});
