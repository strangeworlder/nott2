import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Deck } from './Deck';

describe('Deck', () => {
  it('renders the card count', () => {
    render(<Deck count={12} />);
    expect(screen.getByText('12')).toBeTruthy();
  });

  it('renders the label when provided', () => {
    render(<Deck count={8} label="Threat Deck" />);
    expect(screen.getByText('Threat Deck')).toBeTruthy();
  });

  it('does not render a label when omitted', () => {
    const { container } = render(<Deck count={5} />);
    expect(container.querySelector('[class*="deckLabel"]')).toBeNull();
  });

  it('renders status badge for shuffled', () => {
    render(<Deck count={10} status="shuffled" />);
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText(/shuffled/i)).toBeTruthy();
  });

  it('renders status badge for empty', () => {
    render(<Deck count={0} status="empty" />);
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText(/empty/i)).toBeTruthy();
  });

  it('does not render a status badge when status is null', () => {
    render(<Deck count={5} status={null} />);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('fires onClick when clicked', () => {
    const handler = vi.fn();
    render(<Deck count={8} onClick={handler} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handler).toHaveBeenCalledOnce();
  });

  it('fires onClick on Enter key', () => {
    const handler = vi.fn();
    render(<Deck count={8} onClick={handler} />);
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does not render button role when onClick is omitted', () => {
    render(<Deck count={5} />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('caps visual card layers at 5', () => {
    const { container } = render(<Deck count={20} />);
    // Select only the card layer divs (which have inline style for offset)
    const layers = container.querySelectorAll('[aria-hidden="true"][style]');
    expect(layers.length).toBe(5);
  });

  it('renders fewer layers when count is low', () => {
    const { container } = render(<Deck count={3} />);
    const layers = container.querySelectorAll('[aria-hidden="true"][style]');
    expect(layers.length).toBe(3);
  });

  it('renders empty state with dash when count is 0', () => {
    const { container } = render(<Deck count={0} />);
    expect(container.textContent).toContain('—');
  });

  it('has correct aria-label with label', () => {
    render(<Deck count={12} label="Threat Deck" onClick={() => {}} />);
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Threat Deck, 12 cards');
  });

  it('has correct aria-label for singular count', () => {
    render(<Deck count={1} label="Reserve" onClick={() => {}} />);
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Reserve, 1 card');
  });

  it('forwards id attribute', () => {
    const { container } = render(<Deck count={5} id="test-deck" />);
    expect(container.querySelector('#test-deck')).toBeTruthy();
  });

  // ── topCard prop ──────────────────────────────────────────────────────────

  it('renders a PlayingCard on top when topCard is provided', () => {
    render(<Deck count={3} label="Trophy" topCard={{ suit: 'Hearts', rank: 7 }} />);
    // PlayingCard renders the rank label in both corners — use getAllByText
    const rankLabels = screen.getAllByText('7');
    expect(rankLabels.length).toBeGreaterThan(0);
  });

  it('renders the same number of layers whether or not topCard is provided', () => {
    const { container: withTop } = render(
      <Deck count={3} topCard={{ suit: 'Spades', rank: 5 }} />
    );
    const { container: withoutTop } = render(<Deck count={3} />);
    const layersWith = withTop.querySelectorAll('[aria-hidden="true"][style]');
    const layersWithout = withoutTop.querySelectorAll('[aria-hidden="true"][style]');
    // Unified loop — same number of wrapper divs in both cases
    expect(layersWith.length).toBe(layersWithout.length);
  });

  it('shows count in hover badge when topCard is provided (no count overlay)', () => {
    const { container } = render(
      <Deck count={5} topCard={{ suit: 'Hearts', rank: 3 }} />
    );
    // Count "5" should NOT appear as a standalone overlay (it moves to hover badge)
    // Hover badge text includes "5 cards"
    expect(container.textContent).toContain('5 cards');
  });

  it('does not render a topCard when count is 0', () => {
    render(<Deck count={0} topCard={{ suit: 'Hearts', rank: 7 }} />);
    // Should show empty state, no "7" rank label
    expect(screen.queryByText('7')).toBeNull();
  });

  it('renders a joker top card when topCard.joker is true', () => {
    render(<Deck count={2} topCard={{ joker: true, jokerColor: 'Red' }} />);
    expect(screen.getByText('JOKER')).toBeTruthy();
  });

  // ── glow prop ─────────────────────────────────────────────────────────────

  it('applies an extra class when glow is true', () => {
    const { container: withGlow } = render(<Deck count={10} glow />);
    const { container: withoutGlow } = render(<Deck count={10} />);
    // The deckRoot has one child: the stack div. glow adds an extra class to it.
    const stackWith    = withGlow.firstElementChild?.children[0];
    const stackWithout = withoutGlow.firstElementChild?.children[0];
    const classCountWith    = stackWith?.className.split(' ').filter(Boolean).length ?? 0;
    const classCountWithout = stackWithout?.className.split(' ').filter(Boolean).length ?? 0;
    expect(classCountWith).toBeGreaterThan(classCountWithout);
  });

  it('does not add extra glow class when glow is false (default)', () => {
    const { container: withGlow } = render(<Deck count={10} glow={false} />);
    const { container: withoutGlow } = render(<Deck count={10} />);
    const stackWith    = withGlow.firstElementChild?.children[0];
    const stackWithout = withoutGlow.firstElementChild?.children[0];
    expect(stackWith?.className).toBe(stackWithout?.className);
  });
});
