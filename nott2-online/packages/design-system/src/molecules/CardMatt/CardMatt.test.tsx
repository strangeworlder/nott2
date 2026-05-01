import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardMatt } from './CardMatt';

describe('CardMatt', () => {
  it('renders the title', () => {
    render(<CardMatt title="Visible Threats" />);
    expect(screen.getByText('Visible Threats')).toBeTruthy();
  });

  it('renders empty hint when count is 0', () => {
    render(<CardMatt count={0} emptyHint="Draw from deck" />);
    expect(screen.getByText('Draw from deck')).toBeTruthy();
  });

  it('hides empty hint when count > 0', () => {
    render(<CardMatt count={2} />);
    expect(screen.queryByText('Draw from deck')).toBeFalsy();
  });

  it('shows card count badge when count > 0', () => {
    render(<CardMatt count={3} />);
    expect(screen.getByText('3 cards')).toBeTruthy();
  });

  it('shows singular "card" for count 1', () => {
    render(<CardMatt count={1} />);
    expect(screen.getByText('1 card')).toBeTruthy();
  });

  it('forwards ref to the invisible inner target area div', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<CardMatt ref={ref} count={0} />);
    expect(ref.current).toBeTruthy();
    expect(ref.current?.tagName).toBe('DIV');
  });

  it('applies glow class when glow prop is true', () => {
    const { container: containerGlow } = render(<CardMatt glow={true} />);
    const { container: containerNoGlow } = render(<CardMatt glow={false} />);
    // Vanilla-extract hashes class names, so we compare the number of classes
    // on the surface div. The glow variant adds a second class to the surface.
    const surfaceGlow = containerGlow.querySelectorAll('[class]')[1] as HTMLElement;
    const surfaceNoGlow = containerNoGlow.querySelectorAll('[class]')[1] as HTMLElement;
    expect(surfaceGlow).toBeTruthy();
    expect(surfaceNoGlow).toBeTruthy();
    // Glowing surface should have more classes than non-glowing
    const glowClassCount = surfaceGlow.className.trim().split(/\s+/).length;
    const noGlowClassCount = surfaceNoGlow.className.trim().split(/\s+/).length;
    expect(glowClassCount).toBeGreaterThan(noGlowClassCount);
  });
});
