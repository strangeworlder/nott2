import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusCallout } from './StatusCallout';

describe('StatusCallout', () => {
  it('renders children', () => {
    render(<StatusCallout>Escalation used.</StatusCallout>);
    expect(screen.getByText('Escalation used.')).toBeTruthy();
  });

  it('renders with role="status"', () => {
    render(<StatusCallout>Hello</StatusCallout>);
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('renders icon when provided', () => {
    const { container } = render(<StatusCallout icon="warning">Warning</StatusCallout>);
    // Icon is now rendered as a Material Symbol <span>
    const iconSpan = container.querySelector('.material-symbols-rounded');
    expect(iconSpan).toBeTruthy();
    expect(iconSpan?.textContent).toBe('warning');
  });

  it('applies an id', () => {
    const { container } = render(<StatusCallout id="callout-1">Text</StatusCallout>);
    expect(container.querySelector('#callout-1')).toBeTruthy();
  });

  it('renders all variants without error', () => {
    const variants = ['info', 'warning', 'danger', 'success', 'highlight'] as const;
    for (const v of variants) {
      const { unmount } = render(<StatusCallout variant={v}>Text</StatusCallout>);
      expect(screen.getByRole('status')).toBeTruthy();
      unmount();
    }
  });
});
