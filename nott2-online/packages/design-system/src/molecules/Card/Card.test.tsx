import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
