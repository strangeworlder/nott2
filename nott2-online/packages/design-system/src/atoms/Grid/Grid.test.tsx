import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Grid } from './Grid';

describe('Grid', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Grid>
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    );
    expect(getByText('Item 1')).toBeTruthy();
    expect(getByText('Item 2')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Grid className="custom-grid">
        <div>Item 1</div>
      </Grid>
    );
    expect(container.firstChild).toHaveClass('custom-grid');
  });


});
