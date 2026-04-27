/**
 * PhaseScreens — one component per phase.
 *
 * Design system usage:
 * - PhaseDisplay: cinematic full-bleed screens (Welcome, ActSetup, Win, Lose)
 * - PhasePanel: operational working-surface screens (all decision phases)
 * - Card: section grouping within operational screens
 * - Button: inline actions
 * - ActionFooter: primary page-level CTA
 * - PlayingCard: visible threat card display
 * - DieSelector (via DicePanel): dice entry
 * - StatusCallout: contextual info/warning/danger/highlight callouts
 * - ResultBanner: SUCCESS/FAILURE cinematic reveal
 * - EffortBand: d4 effort level display
 * - DifficultyBadge: difficulty number with breakdown
 * - DiceResult: d10 + d4 = Total display
 * - TrophyIndicator: trophy top card display
 * - WeaknessTracker: 4-pip weakness progress
 * - WaitingIndicator: multiplayer waiting states
 *
 * Phase flow note:
 * - 'resolve-scene' and 'fallout' both render FalloutScreen.
 *   FalloutScreen auto-advances from resolve-scene → fallout on mount,
 *   auto-applies deck changes, and presents everything in one unified screen.
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  PhaseDisplay, PhasePanel, Card, Button, ActionFooter, PlayingCard,
  StatusCallout, ResultBanner, EffortBand, DifficultyBadge, DiceResult,
  TrophyIndicator, WeaknessTracker, WaitingIndicator, Icon, suitToIconName,
} from '@nott2/design-system';
import { useGameStore, DEMO_PLAYER_ID } from '../../store/game-store';
import CardEntry from './CardEntry';
import DicePanel from './DicePanel';
import type { Suit, Rank } from '@nott2/game-engine';
import {
  calculateDifficulty, calculateTotal, isSuccessful, getEffortLevel,
  getScenePrompt, getJokerPrompt, getFaceCardPrefix, canUseAptitude,
} from '@nott2/game-engine';


const FACE_LABEL: Record<number, string> = { 11: 'Jack', 12: 'Queen', 13: 'King' };

function getRankLabel(rank: number) {
  if (rank === 1) return 'Ace';
  return FACE_LABEL[rank] ?? String(rank);
}

// ── Welcome ──────────────────────────────────────────────────────────────────
// Cinematic — uses PhaseDisplay as the full screen.

export function WelcomeScreen() {
  const { nextPhase } = useGameStore();
  return (
    <PhaseDisplay
      phase="welcome"
      subtitle="A director-less horror TTRPG for 4 players. You are not heroes — you are victims in a slasher movie, and the script is already written."
    >
      <ActionFooter label="Begin Setup →" onClick={nextPhase} />
    </PhaseDisplay>
  );
}

// ── Game Setup ───────────────────────────────────────────────────────────────

export function GameSetupScreen() {
  const { gameState, initGame, nextPhase } = useGameStore();
  const [classicSetup, setClassicSetup] = useState(false);
  const [finalGirl, setFinalGirl] = useState(false);
  const [names, setNames] = useState<Record<Suit, string>>({
    Spades:   gameState.characters.find(c => c.id === 'Spades')?.name ?? '',
    Hearts:   gameState.characters.find(c => c.id === 'Hearts')?.name ?? '',
    Clubs:    gameState.characters.find(c => c.id === 'Clubs')?.name ?? '',
    Diamonds: gameState.characters.find(c => c.id === 'Diamonds')?.name ?? '',
  });

  const handleStart = () => {
    initGame('default', { classicSetup, finalGirl }, names);
    nextPhase();
  };

  return (
    <PhasePanel
      title="Game Setup"
      subtitle="Name your characters and choose your rules modules."
      step={{ current: 1, total: 2 }}
    >
      <Card title="Character Names (Optional)">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {(['Spades', 'Hearts', 'Clubs', 'Diamonds'] as Suit[]).map(suit => (
            <div key={suit}>
              <label className="field-label" htmlFor={`name-${suit}`}>
                <Icon name={suitToIconName(suit)} size={16} /> {suit}
              </label>
              <input
                id={`name-${suit}`}
                type="text"
                className="field-select"
                value={names[suit]}
                onChange={e => setNames(n => ({ ...n, [suit]: e.target.value }))}
                placeholder={`The ${suit === 'Spades' ? 'Power' : suit === 'Hearts' ? 'Resolve' : suit === 'Clubs' ? 'Intellect' : 'Finesse'}`}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card title="Rules Modules">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
            <input type="checkbox" checked={classicSetup} onChange={e => setClassicSetup(e.target.checked)} style={{ marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Classic Setup</div>
              <div style={{ fontSize: '0.75rem', marginTop: 2, color: 'var(--color-text-muted)' }}>
                Curated deck: 2s, 3s, 4s in threat deck. Ordered reserve: 5–10. Starts with a random 10 as trophy.
              </div>
            </div>
          </label>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
            <input type="checkbox" checked={finalGirl} onChange={e => setFinalGirl(e.target.checked)} style={{ marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Final Girl</div>
              <div style={{ fontSize: '0.75rem', marginTop: 2, color: 'var(--color-text-muted)' }}>
                Increased lethality. Any face card encounter earns a Strike. Solo survivor triggers Act 3.
              </div>
            </div>
          </label>
        </div>
      </Card>

      <ActionFooter label="Initialize Decks →" onClick={handleStart} />
    </PhasePanel>
  );
}

// ── Act Setup ────────────────────────────────────────────────────────────────
// Cinematic — uses PhaseDisplay.

const ACT_COPY = {
  1: {
    title: 'Act I — The Setup',
    sub: 'The Killer is only a shadow. Four Aces sit on top of the Threat Deck — establishing shots for each character.',
    rules: 'Only Jacks can appear. Resolving a Face Card ends Act 1.',
  },
  2: {
    title: 'Act II — The Horror Story',
    sub: 'The Killer is active. People will die. Queens enter the mix when Face Cards are defeated.',
    rules: 'Act 2 ends when 4 weaknesses are found OR 13 reserve cards have been added.',
  },
  3: {
    title: 'Act III — The Climax',
    sub: 'The mask comes off. All Number Cards are removed from the Threat Deck. Every encounter is with the Killer.',
    rules: 'Only Face Cards remain. Every scene is a confrontation.',
  },
};

const FINALE_COPY = {
  title: 'The Finale',
  sub: 'All four weaknesses have been found. Both Jokers have been shuffled into the Threat Deck. This is the true ending.',
  rules: 'Red Joker: one character makes a final Test — success ends the night, failure kills them and reshuffles it. Black Joker: success removes the highest face card; failure adds a King. Then the Black Joker is removed permanently.',
};

export function ActSetupScreen() {
  const { gameState, nextPhase } = useGameStore() as any;
  const act = gameState.currentAct as 1 | 2 | 3;
  const isFinale = gameState.isEndgame;
  const copy = isFinale ? FINALE_COPY : (ACT_COPY[act] ?? ACT_COPY[1]);
  const finaleNext = !isFinale && gameState.pendingActSetups?.includes('finale');

  const label = finaleNext
    ? 'Continue to Finale →'
    : isFinale
    ? 'Begin the Finale →'
    : 'Begin Act →';

  return (
    <PhaseDisplay phase="act-setup" title={copy.title} subtitle={copy.sub}>
      <div className="stack" style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <Card variant="instruction" title="Key Rule">
          <p className="text-muted">{copy.rules}</p>
        </Card>
        <ActionFooter label={label} onClick={nextPhase} />
      </div>
    </PhaseDisplay>
  );
}

// ── Trophy Setup ──────────────────────────────────────────────────────────────

export function TrophySetupScreen() {
  const { gameState, setTrophyTop, nextPhase } = useGameStore();
  const [suit, setSuit] = useState<Suit>('Spades');
  const [rank, setRank] = useState<Rank>(10);

  return (
    <PhasePanel
      title="Trophy Pile Setup"
      subtitle="The Trophy Pile starts with one Number Card drawn face-up from the reserve. Enter the card you drew."
    >
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <span className="field-label">Trophy Card</span>
            <CardEntry
              onCard={(s, r) => { setSuit(s); setRank(r); setTrophyTop(s, r); }}
              includeFaceCards={false}
            />
          </div>
          {gameState.deck.trophyTop && (
            <TrophyIndicator
              suit={gameState.deck.trophyTop.suit}
              rank={gameState.deck.trophyTop.rank}
            />
          )}
        </div>
      </Card>
      <ActionFooter label="Continue →" onClick={nextPhase} />
    </PhasePanel>
  );
}

// ── Scene Setup ───────────────────────────────────────────────────────────────
//
// Sub-flow (§8.1):
//   1. Ensure ≥1 card visible (draw if table empty)
//   2. Select Active Player (auto during Prologue, manual otherwise — half-blind)
//   3. If only number cards visible and <2 cards: draw second card
//   4. Select card to challenge
//

export function SceneSetupScreen() {
  const {
    gameState, computed, autoDeal, drawCard,
    selectCard, selectJoker, setActivePlayer, nextPhase,
  } = useGameStore();
  // Multiplayer control — separate cast to avoid losing engine types above
  const { isHost, roomCode } = useGameStore() as any;
  const { deck, scene, characters } = gameState;
  // In multiplayer mode only the host controls scene setup.
  // In demo mode (no roomCode) the local player controls everything.
  const canControl = !roomCode || isHost;
  const { visibleCards } = deck;

  // ── Derive sub-state ──────────────────────────────────────────────────────

  const hasSpecialCard = visibleCards.some(c => c.rank >= 11 || c.rank === 1);
  const hasJokerOnTable = gameState.jokersAdded && (
    (!gameState.isBlackJokerRemoved) || true // Red joker always present once added
  );
  const mustChallengeImmediately = hasSpecialCard || (gameState.isEndgame && hasJokerOnTable);

  const needsFirstDraw = visibleCards.length === 0;
  const apSelected = scene.activePlayerId !== null;
  const needsApSelection = visibleCards.length >= 1 && !apSelected;
  const needsSecondDraw = apSelected && visibleCards.length < 2 && !mustChallengeImmediately && !gameState.isEndgame;
  const readyToChallenge = apSelected && (visibleCards.length >= 2 || mustChallengeImmediately);
  const canAdvance = readyToChallenge && (scene.selectedCardId !== null || scene.activeJoker !== null);

  // ── Prologue auto-AP ──────────────────────────────────────────────────────
  // When an Ace is drawn, the matching Aptitude character is auto-selected.
  const firstCard = visibleCards[0] ?? null;
  const isPrologueAce = firstCard?.rank === 1;

  // Auto-set AP during Prologue (Ace suit → character with matching aptitude)
  // Using a check inside render to avoid flicker — setActivePlayer is idempotent
  if (isPrologueAce && needsApSelection) {
    // Find the character whose aptitude matches the Ace's suit
    const matchingChar = characters.find(c => c.aptitude === firstCard.suit && !c.isDead);
    if (matchingChar) {
      // Schedule for next microtask to avoid setState-during-render
      setTimeout(() => setActivePlayer(matchingChar.id), 0);
    }
  }

  // ── Active player info ────────────────────────────────────────────────────
  const activePlayer = gameState.players.find(p => p.id === scene.activePlayerId);
  const activeChar = activePlayer
    ? characters.find(c => c.id === activePlayer.characterId)
    : null;

  const livingCharacters = characters.filter(c => !c.isDead);

  return (
    <PhasePanel
      title="Scene Setup"
      subtitle={
        computed.isPrologue
          ? 'Prologue — Aces on top. The matching Aptitude player takes the spotlight.'
          : needsFirstDraw
          ? 'Draw the first card from the Threat Deck.'
          : needsApSelection
          ? 'Choose who rises to the challenge. You can only see one card — choose wisely.'
          : needsSecondDraw
          ? 'Draw a second card to give the Active Player a choice.'
          : 'Select a card to challenge, then proceed.'
      }
    >
        {/* Visible cards on the table */}
        {visibleCards.length > 0 && (
          <Card title="Visible Threat Cards">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {visibleCards.map(card => {
                // Joker cards — drawn from the deck in Act 3 / Finale
                if (card.id === 'Joker-Black') {
                  if (gameState.isBlackJokerRemoved) return null;
                  return (
                    <div key={card.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <PlayingCard joker jokerColor="Black" selected={scene.activeJoker === 'Black'} onClick={readyToChallenge ? () => selectJoker('Black') : undefined} />
                      <span className="label-sm">Black Joker</span>
                    </div>
                  );
                }
                if (card.id === 'Joker-Red') {
                  return (
                    <div key={card.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <PlayingCard joker jokerColor="Red" selected={scene.activeJoker === 'Red'} onClick={readyToChallenge ? () => selectJoker('Red') : undefined} />
                      <span className="label-sm" style={{ color: 'var(--color-accent-bright)' }}>Red Joker</span>
                    </div>
                  );
                }
                // Regular card
                const isFace = card.rank >= 11;
                const isAce = card.rank === 1;
                const isSelected = scene.selectedCardId === card.id;
                return (
                  <div key={card.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <PlayingCard
                      suit={card.suit as any}
                      rank={card.rank as any}
                      selected={isSelected}
                      onClick={readyToChallenge ? () => selectCard(card.id) : undefined}
                    />
                    {isFace && (
                      <span className="label-sm" style={{ color: 'var(--color-accent-bright)' }}>⚠ Face Card</span>
                    )}
                    {isAce && (
                      <span className="label-sm" style={{ color: 'var(--color-text-muted)' }}>Ace — Prologue</span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Trophy top */}
        {deck.trophyTop && (
          <TrophyIndicator suit={deck.trophyTop.suit} rank={deck.trophyTop.rank} />
        )}

        {/* Step 1: Draw first card (table empty) */}
        {needsFirstDraw && canControl && (
          <Card title="Draw from Threat Deck">
            <CardEntry onCard={drawCard} includeFaceCards={true} includeAces={computed.isPrologue} />
          </Card>
        )}
        {needsFirstDraw && !canControl && (
          <WaitingIndicator message="Waiting for host to draw the first card…" />
        )}

        {/* Step 2: AP Selection (after first card visible, not during Prologue) */}
        {needsApSelection && !isPrologueAce && canControl && (() => {
          const available = gameState.turnOrder.available;
          const acted = gameState.turnOrder.acted;
          const roundInfo = acted.length > 0
            ? `Round progress: ${acted.length} of ${acted.length + available.length} have acted this round.`
            : '';
          return (
            <Card title="Who Rises to the Challenge?">
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: 12 }}>
                Choose the Active Player for this scene. This is a half-blind decision — you can only see one threat card.
                {firstCard && (
                  <> The visible card is <Icon name={suitToIconName(firstCard.suit)} size={14} />{getRankLabel(firstCard.rank)}.</>
                )}
              </p>
              {roundInfo && (
                <StatusCallout variant="info" icon="movie">{roundInfo}</StatusCallout>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {livingCharacters.map(c => {
                  const hasActed = acted.includes(c.id);
                  return (
                    <Button
                      key={c.id}
                      variant={hasActed ? 'ghost' : 'secondary'}
                      size="sm"
                      onClick={() => setActivePlayer(c.id)}
                      disabled={hasActed}
                    >
                      <Icon name={suitToIconName(c.id)} size={20} />
                      <span>{c.name}</span>
                      {c.strikes > 0 && (
                        <span style={{ color: 'var(--color-accent-bright)', fontSize: '0.7rem' }}>
                          {'✕'.repeat(c.strikes)}
                        </span>
                      )}
                      {hasActed && (
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Done</span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </Card>
          );
        })()}
        {needsApSelection && !isPrologueAce && !canControl && (
          <WaitingIndicator message="Waiting for host to choose the Active Player…" />
        )}

        {/* Prologue auto-AP indicator */}
        {isPrologueAce && apSelected && activeChar && (
          <StatusCallout variant="highlight" icon="theater_comedy">
            <Icon name={suitToIconName(activeChar.id)} size={16} /> <strong>{activeChar.name}</strong> must rise to the challenge — the Ace of {firstCard?.suit} demands it.
          </StatusCallout>
        )}

        {/* Active Player badge (non-prologue, after selection) */}
        {apSelected && activeChar && !isPrologueAce && (
          <StatusCallout variant="info" icon="movie">
            Active Player: <Icon name={suitToIconName(activeChar.id)} size={16} /> <strong>{activeChar.name}</strong>
            {activeChar.aptitude && scene.selectedCardId && (() => {
              const challengedCard = visibleCards.find(c => c.id === scene.selectedCardId);
              return challengedCard && activeChar.aptitude === challengedCard.suit ? (
                <span style={{ color: 'var(--color-success)', marginLeft: 8 }}><Icon name="auto_awesome" size={14} /> Aptitude match!</span>
              ) : null;
            })()}
          </StatusCallout>
        )}

        {/* Step 3: Draw second card (AP selected, only number cards on table) */}
        {needsSecondDraw && canControl && (
          <Card title="Draw Second Card">
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: 8 }}>
              Draw a second card to give {activeChar?.name ?? 'the AP'} a choice.
            </p>
            <CardEntry onCard={drawCard} includeFaceCards={true} includeAces={false} />
          </Card>
        )}
        {needsSecondDraw && !canControl && (
          <WaitingIndicator message="Waiting for host to draw a second card…" />
        )}

        {/* Step 4: Challenge button — host only in multiplayer */}
        {readyToChallenge && canControl && (
          <ActionFooter
            label="Challenge Selected Card →"
            disabled={!canAdvance}
            onClick={nextPhase}
            hint={canAdvance ? undefined : 'Select a card first'}
          />
        )}
        {readyToChallenge && !canControl && (
          <WaitingIndicator message="Waiting for host to start the challenge…" />
        )}
    </PhasePanel>
  );
}

// ── Conversation & Stakes ────────────────────────────────────────────────────

export function ConversationStakesScreen() {
  const { gameState, confirmSacrifice, escalate, nextPhase } = useGameStore();
  const { scene, deck } = gameState;

  const selectedCard = scene.selectedCardId
    ? deck.visibleCards.find(c => c.id === scene.selectedCardId) ?? null
    : null;

  const trophyRank = deck.trophyTop?.rank ?? 1;
  const difficulty = selectedCard
    ? (() => {
        const r = selectedCard.rank;
        if (r === 1) return 1;
        if (r <= 10) return r;
        if (r === 11) return trophyRank + 1;
        if (r === 12) return trophyRank + 2;
        return trophyRank + 3;
      })()
    : scene.activeJoker ? trophyRank : null;

  // ── Content system: use engine getScenePrompt ─────────────────────────────
  const isFace = selectedCard ? selectedCard.rank >= 11 : false;
  const isAce  = selectedCard ? selectedCard.rank === 1 : false;
  const suit   = selectedCard?.suit;
  const rank   = selectedCard?.rank;

  let prompt: string;
  if (scene.activeJoker) {
    prompt = getJokerPrompt(scene.activeJoker);
  } else if (isFace) {
    prompt = getFaceCardPrefix();
    if (suit && rank) {
      const facePrompt = getScenePrompt(suit, rank as Rank, !gameState.weaknessesFound.includes(suit));
      if (facePrompt) prompt = `${getFaceCardPrefix()} — ${facePrompt}`;
    }
  } else if (suit && rank) {
    prompt = getScenePrompt(suit, rank as Rank) ?? getFaceCardPrefix();
  } else {
    prompt = getFaceCardPrefix();
  }

  return (
    <PhasePanel
      title="Conversation & Stakes"
      subtitle="Focus the camera. Define the sacrifice. Then proceed to roll."
    >
        <Card variant="instruction" title="Scene Prompt">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', lineHeight: 1.6, color: 'var(--color-text)', fontStyle: 'italic' }}>
            &ldquo;{prompt}&rdquo;
          </p>
        </Card>

        {difficulty !== null && (
          <DifficultyBadge
            value={difficulty}
            breakdown={
              selectedCard && selectedCard.rank <= 10
                ? `Number card rank = ${selectedCard.rank}`
                : selectedCard && selectedCard.rank >= 11
                ? `Trophy (${trophyRank}) + ${selectedCard.rank - 10} = ${difficulty}`
                : scene.activeJoker
                ? `Trophy (${trophyRank}) + 0 = ${difficulty}`
                : undefined
            }
          />
        )}

        {!scene.escalationUsed && (
          <Card title="Escalation — Something Not Right">
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: 12 }}>
              Any non-AP player can add a terrifying detail. Once per scene.
            </p>
            <Button variant="secondary" size="sm" onClick={escalate}>Use Escalation</Button>
          </Card>
        )}

        {scene.escalationUsed && (
          <StatusCallout variant="warning" icon="warning">
            Escalation used this scene.
          </StatusCallout>
        )}

        <Card title="The Stakes — Define the Sacrifice">
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: 12 }}>
            &ldquo;If you push yourself, what are you willing to sacrifice?&rdquo; Define the Overexertion result — specific and a genuine loss.
          </p>
          {!scene.sacrificeConfirmed && (
            <Button variant="secondary" size="sm" onClick={confirmSacrifice}>
              Sacrifice Defined ✔
            </Button>
          )}
          {scene.sacrificeConfirmed && (
            <div style={{ color: 'var(--color-success)', fontSize: '0.75rem' }}>✔ Sacrifice confirmed.</div>
          )}
        </Card>

        <ActionFooter label="Proceed to Roll →" onClick={nextPhase} />
    </PhasePanel>
  );
}

// ── Resolution ────────────────────────────────────────────────────────────────
//
// Uses react-ttrpg-dice for 3D animated dice, triggered by a button press.
// A manual fallback (DicePanel with DieSelector) is available via toggle.

export function ResolutionScreen() {
  const { gameState, rollDice, applyAptitude, useGenrePoint, nextPhase } = useGameStore();
  const [use3D, setUse3D] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const hasRolled = gameState.scene.rollMain !== null && gameState.scene.rollEffort !== null;

  // ── Aptitude: explorable local state (not committed until Lock In) ────────
  const [aptitudeChoice, setAptitudeChoice] = useState<-1 | 0 | 1>(0);

  const { scene, deck, characters, players } = gameState;
  const activePlayer = players.find(p => p.id === scene.activePlayerId);
  const activeChar = activePlayer
    ? characters.find(c => c.id === activePlayer.characterId)
    : null;
  const selectedCard = scene.selectedCardId
    ? deck.visibleCards.find(c => c.id === scene.selectedCardId) ?? null
    : null;
  const hasAptitude = activeChar && selectedCard
    ? canUseAptitude(activeChar.aptitude, selectedCard)
    : false;

  // ── Difficulty ──────────────────────────────────────────────────────────────
  const trophyRank = deck.trophyTop?.rank ?? 1;
  const difficulty = selectedCard
    ? (() => {
        const r = selectedCard.rank;
        if (r === 1) return 1;
        if (r <= 10) return r;
        if (r === 11) return trophyRank + 1;
        if (r === 12) return trophyRank + 2;
        return trophyRank + 3;
      })()
    : scene.activeJoker ? trophyRank : null;

  const difficultyBreakdown = selectedCard && selectedCard.rank <= 10
    ? `Number card rank = ${selectedCard.rank}`
    : selectedCard && selectedCard.rank >= 11
    ? `Trophy (${trophyRank}) + ${selectedCard.rank - 10} = ${difficulty}`
    : scene.activeJoker
    ? `Trophy (${trophyRank}) + 0 = ${difficulty}`
    : undefined;

  // Preview values with aptitude applied
  const rawD4 = scene.rollEffort;
  const previewD4 = rawD4 !== null
    ? Math.max(1, Math.min(4, rawD4 + aptitudeChoice)) as 1|2|3|4
    : null;
  const previewTotal = scene.rollMain !== null && previewD4 !== null
    ? calculateTotal(scene.rollMain, previewD4)
    : null;
  const previewEffort = previewD4 !== null ? getEffortLevel(previewD4) : null;

  // Genre Point availability
  const canSpendGP = hasRolled && !scene.isGenrePointUsed
    && (gameState.playerGenrePoints[scene.activePlayerId ?? ''] ?? 0) > 0;

  // Lazy-load useDiceRoll to avoid SSR issues (Three.js/WebGL not available server-side)
  const [diceHook, setDiceHook] = useState<any>(null);
  useEffect(() => {
    import('react-ttrpg-dice').then(m => {
      setDiceHook(() => m.useDiceRoll);
    }).catch(() => {
      setUse3D(false);
    });
  }, []);

  /** Shared palette — dark horror theme */
  const slasherTheme = {
    dieColor:    '#1c1c1c',
    numberColor: '#dc2626',
    accentColor: '#8a0000',
    roughness:   0.35,
    metalness:   0.15,
  };

  /** Commit aptitude choice + advance */
  const handleLockIn = () => {
    if (aptitudeChoice !== 0 && hasAptitude) {
      applyAptitude(aptitudeChoice);
    }
    nextPhase();
  };

  return (
    <PhasePanel title="The Roll" subtitle="Roll the d13 — d10 for luck, d4 for effort. Beat the difficulty to survive.">
        {/* ── Target Difficulty ─────────────────────────────────────────── */}
        {difficulty !== null && (
          <DifficultyBadge
            value={difficulty}
            breakdown={difficultyBreakdown}
          />
        )}
        {use3D && diceHook ? (
          <ResolutionDiceRoller
            useDiceRoll={diceHook}
            slasherTheme={slasherTheme}
            onResult={(d10, d4) => { rollDice(d10, d4); setAptitudeChoice(0); }}
            hasRolled={hasRolled}
            isRolling={isRolling}
            setIsRolling={setIsRolling}
            rollMain={gameState.scene.rollMain}
            rollEffort={gameState.scene.rollEffort}
          />
        ) : (
          <DicePanel />
        )}

        {/* ── Result Summary ──────────────────────────────────────────────── */}
        {hasRolled && !isRolling && scene.rollMain !== null && scene.rollEffort !== null && (
          <>
            <DiceResult
              d10={scene.rollMain}
              d4={previewD4 ?? scene.rollEffort}
              modifier={aptitudeChoice !== 0 ? { value: aptitudeChoice as -1 | 1, label: 'Aptitude' } : undefined}
              originalD4={aptitudeChoice !== 0 ? rawD4 ?? undefined : undefined}
            />
            {previewEffort && (
              <EffortBand level={previewEffort as any} />
            )}
          </>
        )}

        {/* ── Aptitude Toggle ─────────────────────────────────────────────── */}
        {hasRolled && !isRolling && hasAptitude && (
          <Card title={`Aptitude — ${activeChar!.aptitude}`}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: 12 }}>
              Your aptitude lets you adjust the Effort Die (d4) by ±1.
              Explore the options — your choice is only locked in when you proceed.
            </p>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              <Button
                variant={aptitudeChoice === -1 ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setAptitudeChoice(aptitudeChoice === -1 ? 0 : -1)}
                disabled={rawD4 !== null && rawD4 <= 1}
              >
                −1 Effort
              </Button>
              <Button
                variant={aptitudeChoice === 0 ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setAptitudeChoice(0)}
              >
                No Change
              </Button>
              <Button
                variant={aptitudeChoice === 1 ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setAptitudeChoice(aptitudeChoice === 1 ? 0 : 1)}
                disabled={rawD4 !== null && rawD4 >= 4}
              >
                +1 Effort
              </Button>
            </div>
          </Card>
        )}

        {/* ── Genre Point Reroll ──────────────────────────────────────────── */}
        {canSpendGP && !isRolling && (
          <Card variant="instruction" title="Spend Genre Point? (Reroll d13, d10 gets +1)">
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: 8 }}>
              Spend 1 Genre Point to reroll. The new d10 gets +1. You must accept the result.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {use3D && diceHook ? (
                <GenrePointDiceRoller
                  useDiceRoll={diceHook}
                  slasherTheme={slasherTheme}
                  onResult={(d10) => { useGenrePoint(d10); setAptitudeChoice(0); }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 8 }}>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textAlign: 'center' }}>Select your new d10 (will add +1):</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                    {([0,1,2,3,4,5,6,7,8,9] as const).map(v => (
                      <Button
                        key={v}
                        variant="secondary"
                        size="sm"
                        onClick={() => { useGenrePoint(v); setAptitudeChoice(0); }}
                      >
                        {v}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        <ActionFooter
          label="Lock In Roll →"
          disabled={!hasRolled || isRolling}
          hint={hasRolled ? undefined : 'Roll both dice first'}
          onClick={handleLockIn}
        />
    </PhasePanel>
  );
}

/**
 * Inner component that actually calls the useDiceRoll hook.
 * Separated because hooks cannot be called conditionally (the hook
 * is lazy-loaded, so it may be null on first render).
 */
function ResolutionDiceRoller({
  useDiceRoll,
  slasherTheme,
  onResult,
  hasRolled,
  isRolling,
  setIsRolling,
  rollMain,
  rollEffort,
}: {
  useDiceRoll: any;
  slasherTheme: Record<string, any>;
  onResult: (d10: any, d4: any) => void;
  hasRolled: boolean;
  isRolling: boolean;
  setIsRolling: (v: boolean) => void;
  rollMain: number | null;
  rollEffort: number | null;
}) {
  const { rollGroups, isRolling: diceIsRolling, DiceOverlayPortal } = useDiceRoll({
    sound: true,
    cameraAngle: { x: -1, z: -1 },
    onRollComplete: (result: any) => {
      const rawD10 = result.rolls.find((r: any) => r.group === 'd10')?.value ?? 0;
      const rawD4  = result.rolls.find((r: any) => r.group === 'd4')?.value  ?? 1;
      const safeD10 = (rawD10 % 10) as 0|1|2|3|4|5|6|7|8|9;
      const safeD4  = Math.max(1, Math.min(4, rawD4)) as 1|2|3|4;
      onResult(safeD10, safeD4);
      setIsRolling(false);
    },
  });

  const handleRoll = () => {
    setIsRolling(true);
    rollGroups([
      { notation: '1d10', config: slasherTheme, label: 'd10' },
      { notation: '1d4',  config: slasherTheme, label: 'd4'  },
    ]);
  };

  return (
    <>
      {!hasRolled && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
          <button
            className="random-dice-btn"
            onClick={handleRoll}
            disabled={isRolling || diceIsRolling}
            aria-label={isRolling ? 'Dice are rolling…' : 'Roll the d13'}
            style={{ minWidth: 200 }}
          >
            <span className="random-dice-btn__icon" aria-hidden="true"><Icon name="casino" size={24} /></span>
            <span className="random-dice-btn__label">
              {isRolling ? 'Rolling…' : 'Roll the Dice'}
            </span>
          </button>
        </div>
      )}
      {/* 3-D physics overlay — rendered via portal, fullscreen during animation */}
      {DiceOverlayPortal}
    </>
  );
}

/**
 * Genre Point reroll — rolls only a d10 (d4 stays the same).
 * The result is passed back with +1 already applied by the store's useGenrePoint.
 */
function GenrePointDiceRoller({
  useDiceRoll,
  slasherTheme,
  onResult,
}: {
  useDiceRoll: any;
  slasherTheme: Record<string, any>;
  onResult: (d10: any) => void;
}) {
  const { rollGroups, isRolling, DiceOverlayPortal } = useDiceRoll({
    sound: true,
    cameraAngle: { x: -1, z: -1 },
    onRollComplete: (result: any) => {
      const rawD10 = result.rolls.find((r: any) => r.group === 'd10')?.value ?? 0;
      const safeD10 = (rawD10 % 10) as 0|1|2|3|4|5|6|7|8|9;
      onResult(safeD10);
    },
  });

  const handleRoll = () => {
    rollGroups([
      { notation: '1d10', config: slasherTheme, label: 'd10' },
    ]);
  };

  return (
    <>
      <button
        className="random-dice-btn"
        onClick={handleRoll}
        disabled={isRolling}
        aria-label={isRolling ? 'Rerolling…' : 'Spend Genre Point & Reroll'}
        style={{ minWidth: 200 }}
      >
        <span className="random-dice-btn__icon" aria-hidden="true"><Icon name="theater_comedy" size={24} /></span>
        <span className="random-dice-btn__label">
          {isRolling ? 'Rerolling…' : 'Spend & Reroll d10'}
        </span>
      </button>
      {DiceOverlayPortal}
    </>
  );
}

// ── Fallout ───────────────────────────────────────────────────────────────────
// Unified post-roll screen. Handles both 'resolve-scene' and 'fallout' phases.
// Auto-applies fallout on mount so the user lands on a fully populated screen
// with result, deck events, strike staging and genre points — all in one place.

// Structured fallout event — carries display metadata alongside the message.
type FalloutEventVariant = 'info' | 'success' | 'warning' | 'danger' | 'highlight';
type FalloutEvent = {
  text: string;
  variant: FalloutEventVariant;
  icon: 'emoji_events' | 'arrow_downward' | 'inventory_2' | 'bolt' | 'auto_awesome' | 'delete' | 'undo' | 'dangerous' | 'star' | 'shuffle' | 'warning';
};

/** Build structured deck-change descriptions based on card type, outcome, and effort. */
function describeFalloutEvents(
  card: { rank: number; suit: string; id: string } | null,
  joker: string | null,
  isSuccess: boolean,
  d4: number,
  trophyTop: { rank: number; suit: string } | null,
  weaknessesBefore: readonly string[],
): FalloutEvent[] {
  const events: FalloutEvent[] = [];
  const rankLabel = card ? getRankLabel(card.rank) : null;
  const cardLabel = card
    ? `${rankLabel} of ${card.suit}`
    : null;

  // ── Joker ──────────────────────────────────────────────────────────────
  if (joker === 'Red') {
    if (isSuccess) {
      events.push({ text: 'The Red Joker is defeated — you survived the Night!', variant: 'highlight', icon: 'star' });
    } else {
      events.push({ text: 'The Red Joker kills the Active Player. The Red Joker is shuffled back into the Threat Deck.', variant: 'danger', icon: 'dangerous' });
    }
    return events;
  }
  if (joker === 'Black') {
    if (isSuccess) {
      events.push({ text: 'Black Joker defeated — the highest face card is removed from the Threat Deck.', variant: 'success', icon: 'delete' });
    } else {
      events.push({ text: 'Black Joker failed — a random King is added from the Face Card Reserves to the Threat Deck.', variant: 'danger', icon: 'dangerous' });
    }
    events.push({ text: 'The Black Joker is permanently removed from the game.', variant: 'info', icon: 'delete' });
    events.push({ text: 'Threat Deck and Trophy Pile shuffled.', variant: 'info', icon: 'shuffle' });
    return events;
  }

  if (!card) return events;

  // ── Ace ─────────────────────────────────────────────────────────────────
  if (card.rank === 1) {
    events.push({ text: `${cardLabel} — Prologue card permanently retired (becomes turn-order token).`, variant: 'info', icon: 'delete' });
    if (d4 === 4) events.push({ text: 'Breaking Point (d4 = 4) — the Active Player earns a Strike.', variant: 'danger', icon: 'bolt' });
    return events;
  }

  // ── Number Card ────────────────────────────────────────────────────────
  if (card.rank <= 10) {
    if (isSuccess) {
      events.push({ text: `${cardLabel} placed on the Trophy Pile. New base difficulty for Face Cards: ${card.rank}.`, variant: 'success', icon: 'emoji_events' });
    } else {
      events.push({ text: `${cardLabel} returned to the bottom of the Threat Deck.`, variant: 'warning', icon: 'arrow_downward' });
    }
    events.push({ text: 'Next card drawn from the Number Reserve → added to bottom of the Threat Deck.', variant: 'info', icon: 'inventory_2' });
    if (d4 === 4) events.push({ text: 'Breaking Point (d4 = 4) — the Active Player earns a Strike.', variant: 'danger', icon: 'bolt' });
    return events;
  }

  // ── Face Card ──────────────────────────────────────────────────────────
  const faceLabel = getRankLabel(card.rank);
  const alreadyDefeated = weaknessesBefore.includes(card.suit);

  if (isSuccess) {
    if (!alreadyDefeated) {
      events.push({ text: `First defeat of a ${card.suit} Face Card — a Weakness has been found!`, variant: 'highlight', icon: 'auto_awesome' });
      events.push({ text: `${cardLabel} permanently removed from the game.`, variant: 'success', icon: 'delete' });
    } else {
      events.push({ text: `${faceLabel} of ${card.suit} — already defeated this suit. Card returned to the Threat Deck.`, variant: 'warning', icon: 'undo' });
    }
    const targetRank = d4 <= 2 ? 'Jack' : 'Queen';
    events.push({ text: `A random ${targetRank} added from Face Card Reserves to the Threat Deck (effort: ${d4}).`, variant: 'warning', icon: 'dangerous' });
    if (d4 === 4) events.push({ text: 'Breaking Point (d4 = 4) — the Active Player earns a Strike.', variant: 'danger', icon: 'bolt' });
  } else {
    events.push({ text: `Failed against the ${faceLabel} of ${card.suit}.`, variant: 'danger', icon: 'dangerous' });
    events.push({ text: 'Failure against the Killer — the Active Player earns a Strike.', variant: 'danger', icon: 'bolt' });
    events.push({ text: 'A random King added from Face Card Reserves to the Threat Deck.', variant: 'danger', icon: 'dangerous' });
    if (d4 === 4) events.push({ text: 'Breaking Point (d4 = 4) — an additional Strike is earned.', variant: 'danger', icon: 'bolt' });
  }

  events.push({ text: 'Threat Deck and Trophy Pile shuffled. New visible cards and trophy top will be drawn.', variant: 'info', icon: 'shuffle' });

  return events;
}

// ── Strike staging helper ──────────────────────────────────────────────────────
// Computes pending strikes from a Record<suitId, count>.
function sumPendingStrikes(pending: Record<string, number>): number {
  return Object.values(pending).reduce((a, b) => a + b, 0);
}

export function FalloutScreen() {
  const { gameState, applyFallout, assignStrike, awardGenrePoint, nextPhase } = useGameStore();
  const { scene, deck, characters, players } = gameState;

  // ── Auto-apply state ───────────────────────────────────────────────────
  // Fallout is applied automatically on mount — no user confirmation needed.
  const [applied, setApplied] = useState(false);
  const [events, setEvents] = useState<FalloutEvent[]>([]);

  // ── Staged strike assignment ───────────────────────────────────────────
  // Strikes are staged here and committed atomically when "Next Scene →" is clicked.
  const [pendingStrikes, setPendingStrikes] = useState<Record<string, number>>({});

  // ── Snapshot scene state before apply ─────────────────────────────────
  // We need card/joker/d4/success for the result banner and event list.
  // These are captured from scene state at mount time (before engine mutations).
  const snapshot = React.useRef<{
    selectedCard: { rank: number; suit: string; id: string } | null;
    joker: string | null;
    d4: number;
    d10: number;
    total: number;
    difficulty: number;
    success: boolean;
    effortLevel: string | null;
  } | null>(null);

  useEffect(() => {
    // Capture scene snapshot before calling applyFallout (which mutates deck state)
    const card = scene.selectedCardId
      ? deck.visibleCards.find(c => c.id === scene.selectedCardId) ?? null
      : null;
    const joker = scene.activeJoker ?? null;
    const d4 = (scene.modifiedEffort ?? scene.rollEffort) as number;
    const d10 = scene.rollMain as number;
    if (d4 == null || d10 == null) return;

    const threatCard = joker
      ? { id: `Joker-${joker}`, color: joker, isJoker: true as const }
      : (card as any);
    const difficulty = threatCard ? calculateDifficulty(threatCard, deck.trophyTop) : 0;
    const total = calculateTotal(d10 as any, d4 as any);
    const success = isSuccessful(total, difficulty);
    const effortLevel = getEffortLevel(d4 as any);

    snapshot.current = { selectedCard: card, joker, d4, d10, total, difficulty, success, effortLevel };

    const evts = describeFalloutEvents(
      card, joker, success, d4, deck.trophyTop, gameState.weaknessesFound,
    );

    // Apply deck changes immediately — no user confirmation needed.
    // We do NOT call nextPhase() here; the engine phase stays at 'resolve-scene'
    // (or 'fallout') while this screen is displayed. handleNextScene advances it.
    applyFallout();
    setEvents(evts);
    setApplied(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run exactly once on mount

  // ── Derived strike state ───────────────────────────────────────────────
  const strikesToAssign = gameState.strikesToAssign;
  const pendingTotal = Object.values(pendingStrikes).reduce((a, b) => a + b, 0);
  const remainingToStage = strikesToAssign - pendingTotal;
  const strikesReady = strikesToAssign === 0 || pendingTotal === strikesToAssign;

  const isFace = (snapshot.current?.selectedCard?.rank ?? 0) >= 11;

  const handleAddPendingStrike = (charId: string) => {
    if (remainingToStage <= 0) return;
    const char = characters.find(c => c.id === charId);
    if (!char) return;
    const current = pendingStrikes[charId] ?? 0;
    if (char.strikes + current >= 3) return;
    setPendingStrikes(p => ({ ...p, [charId]: current + 1 }));
  };

  const handleRemovePendingStrike = (charId: string) => {
    const current = pendingStrikes[charId] ?? 0;
    if (current <= 0) return;
    setPendingStrikes(p => ({ ...p, [charId]: current - 1 }));
  };

  // "Next Scene →" commits strikes and advances the engine through to the next scene.
  // The engine may still be at 'resolve-scene' (we didn't advance it in useEffect),
  // so we step through resolve-scene → fallout → scene-setup as needed.
  const handleNextScene = () => {
    for (const [charId, count] of Object.entries(pendingStrikes)) {
      for (let i = 0; i < count; i++) {
        assignStrike(charId as any);
      }
    }
    if (gameState.phase === 'resolve-scene') {
      nextPhase(); // resolve-scene → fallout
    }
    nextPhase(); // fallout → scene-setup (or act-setup / win / lose)
  };

  // While the useEffect hasn't run yet (first render), show nothing —
  // it executes synchronously in the microtask so this is imperceptible.
  if (!applied || !snapshot.current) return null;

  const { selectedCard, joker, d4, total, difficulty, success, effortLevel } = snapshot.current;

  return (
    <PhasePanel
      title="The Result"
      subtitle="Narrate the outcome, then resolve deck changes and proceed to the next scene."
    >
      {/* ── 1. Roll result ─────────────────────────────────────────────── */}
      <ResultBanner
        outcome={success ? 'success' : 'failure'}
        total={total}
        difficulty={difficulty ?? undefined}
      />

      {scene.modifiedEffort !== null && (
        <StatusCallout variant="highlight" icon="auto_awesome">
          Aptitude applied — Effort modified from <strong>{scene.rollEffort}</strong> to <strong>{scene.modifiedEffort}</strong>
        </StatusCallout>
      )}

      {effortLevel && <EffortBand level={effortLevel as any} />}

      {/* ── 2. Narration prompt ────────────────────────────────────────── */}
      <Card title="Narrate the Outcome">
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          {success
            ? 'Describe how your character overcomes the challenge. The table frames the shot.'
            : 'Describe how the challenge overcomes your character. Make it hurt, make it matter.'}
        </p>
      </Card>

      {/* ── 3. Deck changes ───────────────────────────────────────────── */}
      {events.length > 0 && (
        <Card title="Deck Changes">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {events.map((evt, i) => (
              <StatusCallout key={i} variant={evt.variant} icon={evt.icon}>
                {evt.text}
              </StatusCallout>
            ))}
          </div>
        </Card>
      )}

      {/* ── 4. Weakness tracker (face card only) ──────────────────────── */}
      {isFace && deck.weaknessesBySuit.size > 0 && (
        <Card variant="success" title="Weaknesses Found">
          <WeaknessTracker found={deck.weaknessesBySuit} />
        </Card>
      )}

      {/* ── 5. Strike assignment (staged, committed on Next Scene) ──────── */}
      {strikesToAssign > 0 && (
        <Card variant="failure" title={`Assign ${strikesToAssign} Strike${strikesToAssign > 1 ? 's' : ''}`}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: 12 }}>
            {remainingToStage > 0
              ? `${remainingToStage} strike${remainingToStage > 1 ? 's' : ''} left to assign. Strikes are committed when you click Next Scene.`
              : 'All strikes assigned — proceed when ready.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {characters.filter(c => !c.isDead).map(c => {
              const staged = pendingStrikes[c.id] ?? 0;
              const totalAfter = c.strikes + staged;
              return (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                    <Icon name={suitToIconName(c.id)} size={16} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{c.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {c.strikes}/3{staged > 0 ? ` → ${totalAfter}` : ''}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePendingStrike(c.id)}
                      disabled={staged <= 0}
                    >−</Button>
                    <Button
                      variant={staged > 0 ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => handleAddPendingStrike(c.id)}
                      disabled={remainingToStage <= 0 || totalAfter >= 3}
                    >+{staged > 0 ? ` ${staged}` : ''}</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ── 6. Genre Point (one-tap, optional) ────────────────────────── */}
      {!scene.isGenrePointAwarded && gameState.tableGenrePoints > 0 && (
        <Card title="Award Genre Point?">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {players.map(p => {
              const char = characters.find(c => c.id === p.characterId);
              if (!char || char.isDead) return null;
              return (
                <Button key={p.id} variant="secondary" size="sm" onClick={() => awardGenrePoint(p.id)}>
                  To <Icon name={suitToIconName(p.characterId)} size={16} /> {char.name}
                </Button>
              );
            })}
          </div>
        </Card>
      )}

      {/* ── 7. Act transition notice ───────────────────────────────────── */}
      {gameState.pendingActSetups.length > 0 && (
        <StatusCallout variant="warning" icon="warning">
          Act transition pending: {gameState.pendingActSetups.join(' → ')}
        </StatusCallout>
      )}

      {/* ── 8. Single exit button ─────────────────────────────────────── */}
      <ActionFooter
        label={!strikesReady ? `Assign ${remainingToStage} Strike${remainingToStage > 1 ? 's' : ''} first` : 'Next Scene →'}
        disabled={!strikesReady}
        onClick={handleNextScene}
      />
    </PhasePanel>
  );
}

// ── Win / Lose ────────────────────────────────────────────────────────────────
// Cinematic — uses PhaseDisplay.

export function WinScreen() {
  const { fullReset } = useGameStore();
  return (
    <PhaseDisplay
      phase="win"
      body="You see the dawn. The Killer falls. Against every horrible script, you survived the Night of the Thirteenth."
    >
      <ActionFooter label="Play Again" variant="secondary" onClick={fullReset} />
    </PhaseDisplay>
  );
}

export function LoseScreen() {
  const { fullReset } = useGameStore();
  return (
    <PhaseDisplay
      phase="lose"
      body="The Killer wins. Every character is dead. This was always how the script ended. Somewhere, the credits roll over your bodies."
    >
      <ActionFooter label="Start Over" onClick={fullReset} />
    </PhaseDisplay>
  );
}
