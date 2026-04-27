import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Row } from './Row';

describe('Row', () => {
  it('renders children', () => {
    render(<Row><span>A</span><span>B</span></Row>);
    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.getByText('B')).toBeTruthy();
  });

  it('renders a div', () => {
    const { container } = render(<Row><span>x</span></Row>);
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('applies an id', () => {
    const { container } = render(<Row id="my-row"><span>x</span></Row>);
    expect(container.querySelector('#my-row')).toBeTruthy();
  });

  it('accepts extra className', () => {
    const { container } = render(<Row className="extra"><span>x</span></Row>);
    expect(container.querySelector('.extra')).toBeTruthy();
  });
});
