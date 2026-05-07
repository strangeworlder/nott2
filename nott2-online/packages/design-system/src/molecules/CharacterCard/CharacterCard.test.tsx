import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CharacterCard } from './CharacterCard';

describe('CharacterCard', () => {
  it('renders the character name and suit', () => {
    render(<CharacterCard name="Alex" suit="Spades" strikes={0} />);
    expect(screen.getByText('Alex')).toBeInTheDocument();
    // 'Spades' renders as an icon, but we can check the aria-label
    expect(screen.getByLabelText('Alex — 0 strikes')).toBeInTheDocument();
  });

  it('renders strikes indicator accurately', () => {
    render(<CharacterCard name="Sam" suit="Hearts" strikes={2} />);
    expect(screen.getByLabelText('Sam — 2 strikes')).toBeInTheDocument();
    expect(screen.getByLabelText('2 of 3 strikes')).toBeInTheDocument();
  });

  it('renders genre points when greater than 0', () => {
    render(<CharacterCard name="Jordan" suit="Clubs" strikes={1} genrePoints={3} />);
    expect(screen.getByText('3 GP')).toBeInTheDocument();
  });

  it('does not render genre points when 0', () => {
    render(<CharacterCard name="Jordan" suit="Clubs" strikes={1} genrePoints={0} />);
    expect(screen.queryByText('0 GP')).not.toBeInTheDocument();
  });

  it('shows the active state via aria-current', () => {
    const { container } = render(<CharacterCard name="Morgan" suit="Diamonds" strikes={0} isActive />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-current', 'true');
  });

  it('shows the dead state properly', () => {
    render(<CharacterCard name="Taylor" suit="Spades" strikes={3} isDead />);
    expect(screen.getByLabelText('Taylor — 3 strikes — dead')).toBeInTheDocument();
    expect(screen.getByLabelText('Character eliminated')).toBeInTheDocument();
  });

  it('renders the ace token when hasAceToken is true', () => {
    const { container } = render(<CharacterCard name="Casey" suit="Hearts" strikes={0} hasAceToken />);
    // PlayingCard ace token should be in the DOM
    const cardRank = container.querySelector('.nott2-card-rank'); // from PlayingCard
    // Wait, PlayingCard uses generic text 'A'.
    expect(screen.getByText('A')).toBeInTheDocument();
  });
});
