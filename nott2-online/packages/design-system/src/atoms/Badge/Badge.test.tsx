import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Act I</Badge>);
    expect(screen.getByText('Act I')).toBeTruthy();
  });

  it('renders as a span', () => {
    const { container } = render(<Badge>Label</Badge>);
    expect(container.querySelector('span')).toBeTruthy();
  });

  it('renders all variants without throwing', () => {
    const variants = ['default', 'outline', 'red', 'success', 'warning'] as const;
    variants.forEach(variant => {
      expect(() => render(<Badge variant={variant}>Test</Badge>)).not.toThrow();
    });
  });

  it('applies an id', () => {
    const { container } = render(<Badge id="badge-1">Act</Badge>);
    expect(container.querySelector('#badge-1')).toBeTruthy();
  });
});
