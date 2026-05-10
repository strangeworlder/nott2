import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DieChip } from './DieChip';

describe('DieChip', () => {
  it('renders the value', () => {
    render(<DieChip die="d10" value={7} />);
    expect(screen.getByText('7')).toBeTruthy();
  });

  it('renders the die label (D10)', () => {
    render(<DieChip die="d10" value={5} />);
    expect(screen.getByText('D10')).toBeTruthy();
  });

  it('renders the die label (D4)', () => {
    render(<DieChip die="d4" value={3} />);
    expect(screen.getByText('D4')).toBeTruthy();
  });

  it('shows original value when modified', () => {
    render(<DieChip die="d4" value={3} modified originalValue={2} />);
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('hides ghost row when not modified', () => {
    const { container } = render(<DieChip die="d10" value={7} />);
    const ghost = container.querySelector('[aria-hidden="true"]');
    expect(ghost).toBeTruthy();
    expect(ghost!.textContent).toBe('\u00A0');
  });

  it('has accessible aria-label', () => {
    const { container } = render(<DieChip die="d10" value={7} />);
    expect(container.querySelector('[aria-label="D10: 7"]')).toBeTruthy();
  });

  it('has accessible aria-label with modification', () => {
    const { container } = render(<DieChip die="d4" value={3} modified originalValue={4} />);
    expect(container.querySelector('[aria-label="D4: 3 (was 4)"]')).toBeTruthy();
  });

  it('supports custom label', () => {
    render(<DieChip die="d10" value={5} label="Luck" />);
    expect(screen.getByText('Luck')).toBeTruthy();
  });

  it('renders both die variants without throwing', () => {
    expect(() => render(<DieChip die="d10" value={0} />)).not.toThrow();
    expect(() => render(<DieChip die="d4" value={1} />)).not.toThrow();
  });
});
