import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SceneDossier } from './SceneDossier';

describe('SceneDossier', () => {
  it('renders header metadata, difficulty, and side-by-side prompts in script mode', () => {
    render(
      <SceneDossier
        mode="script"
        suitIcon="spades"
        suitTheme="Power (Physical threat)"
        activeCharacterName="Alex"
        activeCharacterSuit="spades"
        archetypes={['The Jock', 'The Protective']}
        difficulty={7}
        difficultyBreakdown="Number card rank = 7"
        directorPrompt="A sudden violent impact hurls you into the wall."
        cameraPrompt="Who hears the crash from the next space over?"
      />,
    );

    expect(screen.getByTestId('dossier-header')).toBeTruthy();
    expect(screen.getByText('Power (Physical threat)')).toBeTruthy();
    expect(screen.getByText('Alex')).toBeTruthy();
    expect(screen.getByText('The Jock')).toBeTruthy();
    expect(screen.getByTestId('dossier-difficulty')).toBeTruthy();
    expect(screen.getByText('7')).toBeTruthy();
    expect(screen.getByText(/A sudden violent impact/i)).toBeTruthy();
    expect(screen.getByText(/Who hears the crash/i)).toBeTruthy();
  });

  it('triggers onEscalate when the escalation button is clicked and shows stamp when escalated', () => {
    const onEscalate = vi.fn();
    const { rerender } = render(
      <SceneDossier
        mode="script"
        suitTheme="Resolve (Fear/Paranoia)"
        onEscalate={onEscalate}
        escalated={false}
      />,
    );

    const btn = screen.getByRole('button', { name: /Something’s not right/i });
    fireEvent.click(btn);
    expect(onEscalate).toHaveBeenCalledTimes(1);

    rerender(
      <SceneDossier
        mode="script"
        suitTheme="Resolve (Fear/Paranoia)"
        onEscalate={onEscalate}
        escalated={true}
      />,
    );

    expect(screen.getByText(/Scene Escalated/i)).toBeTruthy();
  });

  it('renders stakes stage and fires onBackToScene when back button is clicked', () => {
    const onBack = vi.fn();
    render(
      <SceneDossier
        mode="stakes"
        suitTheme="Intellect (The Truth)"
        difficulty={5}
        stakesGuidance="Act 1 Stakes — Keep the sacrifice grounded."
        onBackToScene={onBack}
      />,
    );

    expect(screen.getByTestId('dossier-stakes-stage')).toBeTruthy();
    expect(screen.getByText(/Act 1 Stakes/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Back to Scene/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders aftermath stage with fate items, strikes slot, and genre point slot', () => {
    render(
      <SceneDossier
        mode="aftermath"
        fateItems={[
          { icon: 'emoji_events', text: '5 of Clubs placed on Trophy Pile.', tone: 'success' },
          { icon: 'bolt', text: 'Breaking Point Strike earned.', tone: 'danger' },
        ]}
        strikesSlot={<div>Assign 1 Strike control</div>}
        genrePointSlot={<div>Award GP control</div>}
      />,
    );

    expect(screen.getByTestId('dossier-aftermath-stage')).toBeTruthy();
    expect(screen.getByText('5 of Clubs placed on Trophy Pile.')).toBeTruthy();
    expect(screen.getByText('Breaking Point Strike earned.')).toBeTruthy();
    expect(screen.getByText('Assign 1 Strike control')).toBeTruthy();
    expect(screen.getByText('Award GP control')).toBeTruthy();
  });

  it('shows the sacrifice triggered banner when sacrificeTriggered is true', () => {
    render(
      <SceneDossier
        mode="script"
        sacrificeTriggered={true}
        directorPrompt="You pushed too hard."
      />,
    );

    expect(screen.getByTestId('dossier-sacrifice-banner')).toBeTruthy();
    expect(screen.getByText(/Agreed Sacrifice Triggered:/i)).toBeTruthy();
  });
});
