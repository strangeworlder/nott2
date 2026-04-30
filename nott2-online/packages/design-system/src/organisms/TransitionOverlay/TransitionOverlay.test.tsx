import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TransitionOverlay } from './TransitionOverlay';

describe('TransitionOverlay', () => {
  it('renders children when visible', () => {
    render(
      <TransitionOverlay visible onDismiss={vi.fn()} onExited={vi.fn()}>
        <div>Transition Content</div>
      </TransitionOverlay>
    );
    expect(screen.getByText('Transition Content')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    render(
      <TransitionOverlay visible={false} onDismiss={vi.fn()} onExited={vi.fn()}>
        <div>Hidden Content</div>
      </TransitionOverlay>
    );
    expect(screen.queryByText('Hidden Content')).toBeNull();
  });

  it('calls onDismiss when backdrop is clicked', () => {
    const onDismiss = vi.fn();
    render(
      <TransitionOverlay visible onDismiss={onDismiss} onExited={vi.fn()}>
        <div>Content</div>
      </TransitionOverlay>
    );
    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('does not call onDismiss when content is clicked', () => {
    const onDismiss = vi.fn();
    render(
      <TransitionOverlay visible onDismiss={onDismiss} onExited={vi.fn()}>
        <div>Inner Content</div>
      </TransitionOverlay>
    );
    fireEvent.click(screen.getByText('Inner Content'));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('has correct aria attributes', () => {
    render(
      <TransitionOverlay visible onDismiss={vi.fn()} onExited={vi.fn()}>
        <div>A11y test</div>
      </TransitionOverlay>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-label')).toBe('Game transition');
  });
});
