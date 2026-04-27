import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('renders title', () => {
    render(<Header />);
    expect(screen.getByText('Night of the Thirteenth 2')).toBeTruthy();
  });

  it('renders custom title', () => {
    render(<Header title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeTruthy();
  });

  it('renders act badge', () => {
    render(<Header act={2} phase="scene-setup" />);
    expect(screen.getByLabelText('Act 2')).toBeTruthy();
  });

  it('renders Finale indicator when isEndgame', () => {
    render(<Header isEndgame />);
    expect(screen.getByText(/Finale/)).toBeTruthy();
  });

  it('renders room code when provided', () => {
    render(<Header roomCode="AB12CD" />);
    expect(screen.getByText('AB12CD')).toBeTruthy();
  });

  it('calls onReset when reset clicked', () => {
    const onReset = vi.fn();
    render(<Header onReset={onReset} />);
    screen.getByLabelText('Reset game').click();
    expect(onReset).toHaveBeenCalledOnce();
  });
});
