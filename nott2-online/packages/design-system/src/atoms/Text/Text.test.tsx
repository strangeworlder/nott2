import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Text } from './Text';

describe('Text', () => {
  it('renders children', () => {
    render(<Text>Hello</Text>);
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('renders as <p> by default', () => {
    const { container } = render(<Text>Body</Text>);
    expect(container.querySelector('p')).toBeTruthy();
  });

  it('renders as <h1> for h1 variant', () => {
    const { container } = render(<Text variant="h1">Title</Text>);
    expect(container.querySelector('h1')).toBeTruthy();
  });

  it('renders as <h2> for h2 variant', () => {
    const { container } = render(<Text variant="h2">Sub</Text>);
    expect(container.querySelector('h2')).toBeTruthy();
  });

  it('renders as <h3> for h3 variant', () => {
    const { container } = render(<Text variant="h3">Section</Text>);
    expect(container.querySelector('h3')).toBeTruthy();
  });

  it('renders as <div> for label variant', () => {
    const { container } = render(<Text variant="label">Label</Text>);
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('overrides tag via as prop', () => {
    const { container } = render(<Text as="span">Inline</Text>);
    expect(container.querySelector('span')).toBeTruthy();
  });

  it('applies an id', () => {
    const { container } = render(<Text id="my-text">Text</Text>);
    expect(container.querySelector('#my-text')).toBeTruthy();
  });

  it('renders dangerouslySetInnerHTML', () => {
    const { container } = render(
      <Text dangerouslySetInnerHTML={{ __html: '<strong>Bold</strong>' }} />
    );
    expect(container.querySelector('strong')).toBeTruthy();
  });
});
