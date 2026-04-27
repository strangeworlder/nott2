import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Separator } from './Separator';

describe('Separator', () => {
  it('renders an hr element', () => {
    const { container } = render(<Separator />);
    expect(container.querySelector('hr')).toBeTruthy();
  });

  it('has role=separator', () => {
    const { container } = render(<Separator />);
    expect(container.querySelector('[role="separator"]')).toBeTruthy();
  });
});
