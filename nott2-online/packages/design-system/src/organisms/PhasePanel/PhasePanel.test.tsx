import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PhasePanel } from './PhasePanel';

describe('PhasePanel', () => {
  it('renders the title', () => {
    render(<PhasePanel title="Scene Setup"><div>Content</div></PhasePanel>);
    expect(screen.getByText('Scene Setup')).toBeTruthy();
  });

  it('renders subtitle when provided', () => {
    render(<PhasePanel title="Setup" subtitle="Draw a card."><div /></PhasePanel>);
    expect(screen.getByText('Draw a card.')).toBeTruthy();
  });

  it('renders children', () => {
    render(<PhasePanel title="Test"><div>Child content</div></PhasePanel>);
    expect(screen.getByText('Child content')).toBeTruthy();
  });

  it('renders step indicator when provided', () => {
    render(<PhasePanel title="Setup" step={{ current: 1, total: 2 }}><div /></PhasePanel>);
    expect(screen.getByText('Step 1 of 2')).toBeTruthy();
  });

  it('applies an id', () => {
    const { container } = render(<PhasePanel id="panel-1" title="Test"><div /></PhasePanel>);
    expect(container.querySelector('#panel-1')).toBeTruthy();
  });
});
