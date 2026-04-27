import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<Icon name="spades" />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('has aria-hidden for accessibility', () => {
    const { container } = render(<Icon name="hearts" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies default size 24', () => {
    const { container } = render(<Icon name="clubs" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('24');
    expect(svg?.getAttribute('height')).toBe('24');
  });

  it('accepts custom size', () => {
    const { container } = render(<Icon name="diamonds" size={48} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('48');
  });

  it('applies an id', () => {
    const { container } = render(<Icon name="skull" id="skull-icon" />);
    expect(container.querySelector('#skull-icon')).toBeTruthy();
  });

  it('renders all icon names without throwing', () => {
    const names = ['spades','hearts','diamonds','clubs','clock','users','skull','star','check','x'] as const;
    names.forEach(name => {
      expect(() => render(<Icon name={name} />)).not.toThrow();
    });
  });
});
