import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActBreakOverlay } from './ActBreakOverlay';

describe('ActBreakOverlay', () => {
  it('renders prologue content when visible', () => {
    render(
      <ActBreakOverlay visible act="prologue" onDismiss={vi.fn()} onExited={vi.fn()} />
    );
    expect(screen.getByText('The Setup')).toBeTruthy();
    expect(screen.getByRole('button', { name: /begin the night/i })).toBeTruthy();
  });

  it('renders act I content when visible', () => {
    render(
      <ActBreakOverlay visible act={1} onDismiss={vi.fn()} onExited={vi.fn()} />
    );
    expect(screen.getByText('I')).toBeTruthy();
    expect(screen.getByText('The Setup')).toBeTruthy();
    expect(screen.getByRole('button', { name: /begin act i/i })).toBeTruthy();
  });

  it('renders act II content when visible', () => {
    render(
      <ActBreakOverlay visible act={2} onDismiss={vi.fn()} onExited={vi.fn()} />
    );
    expect(screen.getByText('II')).toBeTruthy();
    expect(screen.getByText('The Horror Story')).toBeTruthy();
    expect(screen.getByRole('button', { name: /begin act ii/i })).toBeTruthy();
  });

  it('renders act III content when visible', () => {
    render(
      <ActBreakOverlay visible act={3} onDismiss={vi.fn()} onExited={vi.fn()} />
    );
    expect(screen.getByText('III')).toBeTruthy();
    expect(screen.getByText('The Climax')).toBeTruthy();
  });

  it('renders finale content when visible', () => {
    render(
      <ActBreakOverlay visible act="finale" onDismiss={vi.fn()} onExited={vi.fn()} />
    );
    expect(screen.getByText('FINALE')).toBeTruthy();
    expect(screen.getByText('The Night Ends Here')).toBeTruthy();
    expect(screen.getByRole('button', { name: /begin the finale/i })).toBeTruthy();
  });

  it('does not render when not visible', () => {
    render(
      <ActBreakOverlay visible={false} act={1} onDismiss={vi.fn()} onExited={vi.fn()} />
    );
    expect(screen.queryByText('The Setup')).toBeNull();
  });

  it('calls onDismiss when the button is clicked', () => {
    const onDismiss = vi.fn();
    render(
      <ActBreakOverlay visible act={1} onDismiss={onDismiss} onExited={vi.fn()} />
    );
    fireEvent.click(screen.getByRole('button', { name: /begin act i/i }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('has correct aria attributes', () => {
    render(
      <ActBreakOverlay visible act={2} onDismiss={vi.fn()} onExited={vi.fn()} />
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-label')).toContain('The Horror Story');
  });
});
