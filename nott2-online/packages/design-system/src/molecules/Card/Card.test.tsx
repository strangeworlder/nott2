import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Content</Card>);
    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('renders title when provided', () => {
    render(<Card title="My Section">Content</Card>);
    expect(screen.getByText('My Section')).toBeTruthy();
  });

  it('does not render title when not provided', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.querySelector('h3')).toBeFalsy();
  });

  it('applies an id', () => {
    const { container } = render(<Card id="card-1">Content</Card>);
    expect(container.querySelector('#card-1')).toBeTruthy();
  });

  // ── Complete prop ─────────────────────────────────────────────────────

  it('renders check_circle icon when complete', () => {
    render(<Card title="Setup" complete>Content</Card>);
    expect(screen.getByText('check_circle')).toBeTruthy();
  });

  it('does not render check_circle when not complete', () => {
    render(<Card title="Setup">Content</Card>);
    expect(screen.queryByText('check_circle')).toBeFalsy();
  });

  it('renders completion label when complete with completionLabel', () => {
    render(<Card title="Stakes" complete completionLabel="Sacrifice confirmed">Content</Card>);
    expect(screen.getByText('Sacrifice confirmed')).toBeTruthy();
    expect(screen.getByTestId('completion-indicator')).toBeTruthy();
  });

  it('does not render completion label when not complete', () => {
    render(<Card title="Stakes" completionLabel="Sacrifice confirmed">Content</Card>);
    expect(screen.queryByTestId('completion-indicator')).toBeFalsy();
  });

  it('still renders children when complete', () => {
    render(<Card title="Setup" complete>Important content</Card>);
    expect(screen.getByText('Important content')).toBeTruthy();
  });

  // ── Collapsible props ─────────────────────────────────────────────────

  it('renders collapse toggle when collapsible', () => {
    render(<Card collapsible>Content</Card>);
    expect(screen.getByRole('button', { name: /collapse/i })).toBeTruthy();
  });

  it('does not render collapse toggle when not collapsible', () => {
    render(<Card>Content</Card>);
    expect(screen.queryByRole('button', { name: /collapse|expand/i })).toBeFalsy();
  });

  it('shows "Show details" when collapsed', () => {
    render(<Card collapsible collapsed>Content</Card>);
    expect(screen.getByText('Show details')).toBeTruthy();
  });

  it('shows "Hide details" when not collapsed', () => {
    render(<Card collapsible collapsed={false}>Content</Card>);
    expect(screen.getByText('Hide details')).toBeTruthy();
  });

  it('sets aria-expanded correctly', () => {
    const { rerender } = render(<Card collapsible collapsed={false}>Content</Card>);
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('true');

    rerender(<Card collapsible collapsed>Content</Card>);
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('false');
  });

  it('calls onToggleCollapse when toggle is clicked', () => {
    const handler = vi.fn();
    render(<Card collapsible onToggleCollapse={handler}>Content</Card>);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledOnce();
  });

  // ── Combined: complete + collapsible ──────────────────────────────────

  it('supports complete and collapsible together', () => {
    render(
      <Card title="Strikes" complete completionLabel="All assigned" collapsible collapsed>
        Details
      </Card>
    );
    expect(screen.getByText('check_circle')).toBeTruthy();
    expect(screen.getByText('All assigned')).toBeTruthy();
    expect(screen.getByText('Show details')).toBeTruthy();
  });
});
