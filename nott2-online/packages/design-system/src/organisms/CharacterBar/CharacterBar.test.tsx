import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CharacterBar } from './CharacterBar';
import type { CharacterBarCharacter } from './CharacterBar';

const CHARACTERS: CharacterBarCharacter[] = [
  { id: 'Spades',   name: 'Alex',  strikes: 0, isDead: false },
  { id: 'Hearts',   name: 'Jamie', strikes: 1, isDead: false },
  { id: 'Clubs',    name: 'Sam',   strikes: 2, isDead: false },
  { id: 'Diamonds', name: 'Casey', strikes: 3, isDead: true },
];

describe('CharacterBar', () => {
  it('renders all characters', () => {
    render(
      <CharacterBar
        characters={CHARACTERS}
        activeCharacterId="Spades"
        genrePoints={{}}
        tableGenrePoints={3}
      />
    );
    expect(screen.getByText('Alex')).toBeTruthy();
    expect(screen.getByText('Jamie')).toBeTruthy();
    expect(screen.getByText('Sam')).toBeTruthy();
  });


  it('renders genre pool', () => {
    render(
      <CharacterBar
        characters={CHARACTERS}
        activeCharacterId={null}
        genrePoints={{}}
        tableGenrePoints={5}
      />
    );
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('renders GP badge when player has genre points', () => {
    render(
      <CharacterBar
        characters={CHARACTERS}
        activeCharacterId={null}
        genrePoints={{ Spades: 2 }}
        tableGenrePoints={2}
      />
    );
    expect(screen.getByText('2 GP')).toBeTruthy();
  });

  // ── Ace Turn Order Token ────────────────────────────────────────────────

  const WITH_TOKENS: CharacterBarCharacter[] = [
    { id: 'Spades',   name: 'Alex',  strikes: 0, isDead: false, hasAceToken: true, hasActed: false },
    { id: 'Hearts',   name: 'Jamie', strikes: 1, isDead: false, hasAceToken: true, hasActed: true },
    { id: 'Clubs',    name: 'Sam',   strikes: 2, isDead: false, hasAceToken: true, hasActed: false },
    { id: 'Diamonds', name: 'Casey', strikes: 3, isDead: true,  hasAceToken: true, hasActed: false },
  ];

  it('renders face-up Ace tokens for available players', () => {
    render(
      <CharacterBar
        characters={WITH_TOKENS}
        activeCharacterId={null}
        genrePoints={{}}
        tableGenrePoints={0}
      />
    );
    // Alex (available) and Sam (available) have face-up Aces showing "A".
    // Jamie (acted) and Casey (dead) have face-down Aces (card back, no "A").
    const aceLabels = screen.getAllByText('A');
    expect(aceLabels.length).toBe(2);
  });

  it('does not render Ace token when hasAceToken is false (Prologue)', () => {
    const { container } = render(
      <CharacterBar
        characters={CHARACTERS} // No hasAceToken props
        activeCharacterId={null}
        genrePoints={{}}
        tableGenrePoints={0}
      />
    );
    const aceCards = container.querySelectorAll('[class*="aceToken"]');
    expect(aceCards.length).toBe(0);
  });
});
