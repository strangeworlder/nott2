import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeTruthy();
  });

  it('renders as a button element', () => {
    const { container } = render(<Button>Go</Button>);
    expect(container.querySelector('button')).toBeTruthy();
  });

  it('fires onClick when clicked', () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Go</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does not fire onClick when disabled', () => {
    const handler = vi.fn();
    render(<Button disabled onClick={handler}>Go</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveProperty('disabled', true);
  });

  it('applies type="submit" when specified', () => {
    const { container } = render(<Button type="submit">Submit</Button>);
    const btn = container.querySelector('button');
    expect(btn?.getAttribute('type')).toBe('submit');
  });

  it('applies an id', () => {
    const { container } = render(<Button id="cta">Go</Button>);
    expect(container.querySelector('#cta')).toBeTruthy();
  });
});
