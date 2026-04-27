import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Icon, suitToIconName } from './Icon';

describe('Icon', () => {
  // ── Custom SVG icons (card suits) ─────────────────────────────────────────

  it('renders an SVG element for custom suit icons', () => {
    const { container } = render(<Icon name="spades" />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('has aria-hidden for accessibility (SVG mode)', () => {
    const { container } = render(<Icon name="hearts" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies default size 24 to SVG icons', () => {
    const { container } = render(<Icon name="clubs" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('24');
    expect(svg?.getAttribute('height')).toBe('24');
  });

  it('accepts custom size for SVG icons', () => {
    const { container } = render(<Icon name="diamonds" size={48} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('48');
  });

  it('applies an id to SVG icons', () => {
    const { container } = render(<Icon name="spades" id="spade-icon" />);
    expect(container.querySelector('#spade-icon')).toBeTruthy();
  });

  it('renders all custom suit icons without throwing', () => {
    const names = ['spades', 'hearts', 'diamonds', 'clubs'] as const;
    names.forEach(name => {
      expect(() => render(<Icon name={name} />)).not.toThrow();
    });
  });

  // ── Material Symbol icons ─────────────────────────────────────────────────

  it('renders a span element for Material Symbol icons', () => {
    const { container } = render(<Icon name="schedule" />);
    const span = container.querySelector('span');
    expect(span).toBeTruthy();
    expect(span?.textContent).toBe('schedule');
  });

  it('applies the material-symbols-rounded class', () => {
    const { container } = render(<Icon name="warning" />);
    const span = container.querySelector('span');
    expect(span?.classList.contains('material-symbols-rounded')).toBe(true);
  });

  it('has aria-hidden for accessibility (Material mode)', () => {
    const { container } = render(<Icon name="check" />);
    const span = container.querySelector('span');
    expect(span?.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies size via font-size style for Material icons', () => {
    const { container } = render(<Icon name="star" size={32} />);
    const span = container.querySelector('span');
    expect(span?.style.fontSize).toBe('32px');
  });

  it('applies an id to Material icons', () => {
    const { container } = render(<Icon name="bolt" id="bolt-icon" />);
    expect(container.querySelector('#bolt-icon')).toBeTruthy();
  });

  it('renders common Material Symbol icons without throwing', () => {
    const names = [
      'schedule', 'chevron_right', 'chevron_left', 'expand_more', 'refresh',
      'group', 'person', 'check', 'close', 'warning', 'bolt', 'star',
      'casino', 'emoji_events', 'theater_comedy',
    ] as const;
    names.forEach(name => {
      expect(() => render(<Icon name={name} />)).not.toThrow();
    });
  });

  // ── suitToIconName utility ────────────────────────────────────────────────

  it('maps suit names to icon names', () => {
    expect(suitToIconName('Spades')).toBe('spades');
    expect(suitToIconName('Hearts')).toBe('hearts');
    expect(suitToIconName('Clubs')).toBe('clubs');
    expect(suitToIconName('Diamonds')).toBe('diamonds');
  });

  it('defaults to spades for unknown suit names', () => {
    expect(suitToIconName('Unknown')).toBe('spades');
  });
});
