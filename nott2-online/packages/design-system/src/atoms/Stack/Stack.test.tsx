import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stack } from './Stack';

describe('Stack', () => {
  it('renders children', () => {
    render(<Stack><div>A</div><div>B</div></Stack>);
    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.getByText('B')).toBeTruthy();
  });

  it('renders a div', () => {
    const { container } = render(<Stack><span>x</span></Stack>);
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('applies an id', () => {
    const { container } = render(<Stack id="my-stack"><span>x</span></Stack>);
    expect(container.querySelector('#my-stack')).toBeTruthy();
  });

  it('accepts extra className', () => {
    const { container } = render(<Stack className="extra"><span>x</span></Stack>);
    expect(container.querySelector('.extra')).toBeTruthy();
  });
});
