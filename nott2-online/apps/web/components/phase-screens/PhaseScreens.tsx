/**
 * PhaseScreens — one component per phase.
 *
 * Design system usage:
 * - PhaseDisplay: used for "cinematic" screens (Welcome, ActSetup, Win, Lose)
 *   that are full-bleed centered statements. NOT used for operational screens
 *   where the player is actively making decisions — those use .phase-panel for
 *   a clean working surface with their own Card/Button/ActionFooter layout.
 * - Card: section grouping for all operational screens
 * - Button: all inline actions
 * - ActionFooter: primary page-level CTA (always bottom of stack)
 * - PlayingCard: visible threat card display
 * - DieSelector (via DicePanel): dice entry
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  PhaseDisplay, Card, Button, ActionFooter, PlayingCard,
} from '@nott2/design-system';
import { useGameStore, DEMO_PLAYER_ID } from '../../store/game-store';
import CardEntry from './CardEntry';
import DicePanel from './DicePanel';
import type { Suit, Rank } from '@nott2/game-engine';
import {
  calculateDifficulty, calculateTotal, isSuccessful, getEffortLevel,
  getScenePrompt, getJokerPrompt, getFaceCardPrefix,
} from '@nott2/game-engine';

const SUIT_SYMBOL: Record<string, string> = { Spades: '♠', Hearts: '♥', Clubs: '♣', Diamonds: '♦' };
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
    <div className="phase-panel">
      <div className="label-sm" style={{ marginBottom: 8 }}>Step 1 of 2</div>
      <h2 className="phase-title">Game Setup</h2>
      <p className="phase-subtitle">Name your characters and choose your rules modules.</p>

      <div className="stack">
        <Card title="Character Names (Optional)">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {(['Spades', 'Hearts', 'Clubs', 'Diamonds'] as Suit[]).map(suit => (
              <div key={suit}>
                <label className="field-label" htmlFor={`name-${suit}`}>
                  {SUIT_SYMBOL[suit]} {suit}
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
          <div className="stack" style={{ gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={classicSetup} onChange={e => setClassicSetup(e.target.checked)} style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Classic Setup</div>
                <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: 2 }}>
                  Curated deck: 2s, 3s, 4s in threat deck. Ordered reserve: 5–10. Starts with a random 10 as trophy.
                </div>
              </div>
            </label>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={finalGirl} onChange={e => setFinalGirl(e.target.checked)} style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Final Girl</div>
                <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: 2 }}>
                  Increased lethality. Any face card encounter earns a Strike. Solo survivor triggers Act 3.
                </div>
              </div>
            </label>
          </div>
        </Card>

        <ActionFooter label="Initialize Decks →" onClick={handleStart} />
      </div>
    </div>
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

export function ActSetupScreen() {
  const { gameState, nextPhase } = useGameStore() as any;
  const act = gameState.currentAct as 1 | 2 | 3;
  const copy = ACT_COPY[act] ?? ACT_COPY[1];
  const finaleNext = gameState.pendingActSetups?.includes('finale');

  return (
    <PhaseDisplay phase="act-setup" title={copy.title} subtitle={copy.sub}>
      <div className="stack" style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <Card variant="instruction" title="Key Rule">
          <p className="text-muted">{copy.rules}</p>
        </Card>
        <ActionFooter
          label={finaleNext ? 'Continue to Finale Setup →' : 'Begin Act →'}
          onClick={nextPhase}
        />
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
    <div className="phase-panel">
      <h2 className="phase-title">Trophy Pile Setup</h2>
      <p className="phase-subtitle">
        The Trophy Pile starts with one Number Card drawn face-up from the reserve. Enter the card you drew.
      </p>
      <div className="stack">
        <Card>
          <div className="stack">
            <div>
              <span className="field-label">Trophy Card</span>
              <CardEntry
                onCard={(s, r) => { setSuit(s); setRank(r); setTrophyTop(s, r); }}
                includeFaceCards={false}
              />
            </div>
            {gameState.deck.trophyTop && (
              <div className="trophy-badge" style={{ justifyContent: 'center' }}>
                🏆 Trophy Top: {SUIT_SYMBOL[gameState.deck.trophyTop.suit]} {getRankLabel(gameState.deck.trophyTop.rank)}
              </div>
            )}
          </div>
        </Card>
        <ActionFooter label="Continue →" onClick={nextPhase} />
      </div>
    </div>
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
    <div className="phase-panel">
      <h2 className="phase-title">Scene Setup</h2>
      <p className="phase-subtitle">
        {computed.isPrologue
          ? 'Prologue — Aces on top. The matching Aptitude player takes the spotlight.'
          : needsFirstDraw
          ? 'Draw the first card from the Threat Deck.'
          : needsApSelection
          ? 'Choose who rises to the challenge. You can only see one card — choose wisely.'
          : needsSecondDraw
          ? 'Draw a second card to give the Active Player a choice.'
          : 'Select a card to challenge, then proceed.'}
      </p>

      <div className="stack">
        {/* Visible cards on the table */}
        {visibleCards.length > 0 && (
          <Card title="Visible Threat Cards">
            <div className="row" style={{ flexWrap: 'wrap', gap: 12 }}>
              {visibleCards.map(card => {
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
              {gameState.jokersAdded && !gameState.isBlackJokerRemoved && readyToChallenge && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <PlayingCard joker jokerColor="Black" selected={scene.activeJoker === 'Black'} onClick={() => selectJoker('Black')} />
                  <span className="label-sm">Black Joker</span>
                </div>
              )}
              {gameState.jokersAdded && readyToChallenge && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <PlayingCard joker jokerColor="Red" selected={scene.activeJoker === 'Red'} onClick={() => selectJoker('Red')} />
                  <span className="label-sm" style={{ color: 'var(--color-accent-bright)' }}>Red Joker</span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Trophy top */}
        {deck.trophyTop && (
          <div className="trophy-badge">
            🏆 Trophy Top: {SUIT_SYMBOL[deck.trophyTop.suit]} {getRankLabel(deck.trophyTop.rank)} (Rank {deck.trophyTop.rank})
          </div>
        )}

        {/* Step 1: Draw first card (table empty) */}
        {needsFirstDraw && canControl && (
          <Card title="Draw from Threat Deck">
            <CardEntry onCard={drawCard} includeFaceCards={true} includeAces={computed.isPrologue} />
          </Card>
        )}
        {needsFirstDraw && !canControl && (
          <div className="waiting-hint">Waiting for host to draw the first card…</div>
        )}

        {/* Step 2: AP Selection (after first card visible, not during Prologue) */}
        {needsApSelection && !isPrologueAce && canControl && (
          <Card title="👤 Who Rises to the Challenge?">
            <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: 12 }}>
              Choose the Active Player for this scene. This is a half-blind decision — you can only see one threat card.
              {firstCard && (
                <> The visible card is {SUIT_SYMBOL[firstCard.suit]}{getRankLabel(firstCard.rank)}.</>
              )}
            </p>
            <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
              {livingCharacters.map(c => (
                <button
                  key={c.id}
                  className="btn btn--secondary btn--sm"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    minWidth: 140, justifyContent: 'center',
                  }}
                  onClick={() => setActivePlayer(c.id)}
                >
                  <span style={{ fontSize: '1.25rem' }}>{SUIT_SYMBOL[c.id]}</span>
                  <span>{c.name}</span>
                  {c.strikes > 0 && (
                    <span style={{ color: 'var(--color-accent-bright)', fontSize: '0.7rem' }}>
                      {'✕'.repeat(c.strikes)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Card>
        )}
        {needsApSelection && !isPrologueAce && !canControl && (
          <div className="waiting-hint">Waiting for host to choose the Active Player…</div>
        )}

        {/* Prologue auto-AP indicator */}
        {isPrologueAce && apSelected && activeChar && (
          <div style={{
            padding: '10px 16px', borderRadius: 6,
            background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)',
            fontSize: '0.85rem', color: 'var(--color-text)',
          }}>
            {SUIT_SYMBOL[activeChar.id]} <strong>{activeChar.name}</strong> must rise to the challenge — the Ace of {firstCard?.suit} demands it.
          </div>
        )}

        {/* Active Player badge (non-prologue, after selection) */}
        {apSelected && activeChar && !isPrologueAce && (
          <div style={{
            padding: '10px 16px', borderRadius: 6,
            background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)',
            fontSize: '0.85rem', color: 'var(--color-text)',
          }}>
            🎬 Active Player: {SUIT_SYMBOL[activeChar.id]} <strong>{activeChar.name}</strong>
            {activeChar.aptitude && firstCard && activeChar.aptitude === firstCard.suit && (
              <span style={{ color: 'var(--color-success)', marginLeft: 8 }}>✨ Aptitude match!</span>
            )}
          </div>
        )}

        {/* Step 3: Draw second card (AP selected, only number cards on table) */}
        {needsSecondDraw && canControl && (
          <Card title="Draw Second Card">
            <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: 8 }}>
              Draw a second card to give {activeChar?.name ?? 'the AP'} a choice.
            </p>
            <CardEntry onCard={drawCard} includeFaceCards={true} includeAces={false} />
          </Card>
        )}
        {needsSecondDraw && !canControl && (
          <div className="waiting-hint">Waiting for host to draw a second card…</div>
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
          <div className="waiting-hint">Waiting for host to start the challenge…</div>
        )}
      </div>
    </div>
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
    <div className="phase-panel">
      <h2 className="phase-title">Conversation &amp; Stakes</h2>
      <p className="phase-subtitle">Focus the camera. Define the sacrifice. Then proceed to roll.</p>

      <div className="stack">
        <Card variant="instruction" title="Scene Prompt">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', lineHeight: 1.6, color: 'var(--color-text)', fontStyle: 'italic' }}>
            &ldquo;{prompt}&rdquo;
          </p>
        </Card>

        {difficulty !== null && (
          <div className="row">
            <div className="difficulty-badge">
              <div className="difficulty-badge__num">{difficulty}</div>
              <div className="difficulty-badge__label">Difficulty</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="label-sm" style={{ marginBottom: 4 }}>How it&apos;s calculated</div>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                {selectedCard && selectedCard.rank <= 10
                  ? `Number card rank = ${selectedCard.rank}`
                  : selectedCard && selectedCard.rank >= 11
                  ? `Trophy (${trophyRank}) + ${selectedCard.rank - 10} = ${difficulty}`
                  : scene.activeJoker
                  ? `Trophy (${trophyRank}) + 0 = ${difficulty}`
                  : '—'}
              </div>
            </div>
          </div>
        )}

        {!scene.escalationUsed && (
          <Card title="Escalation — Something Not Right">
            <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: 12 }}>
              Any non-AP player can add a terrifying detail. Once per scene.
            </p>
            <Button variant="secondary" size="sm" onClick={escalate}>Use Escalation</Button>
          </Card>
        )}

        {scene.escalationUsed && (
          <div style={{ padding: '8px 14px', borderRadius: 4, background: 'rgba(220,38,38,0.08)', border: '1px solid var(--color-accent)', fontSize: '0.75rem', color: 'var(--color-accent-bright)' }}>
            ⚠ Escalation used this scene.
          </div>
        )}

        <Card title="📜 The Stakes — Define the Sacrifice">
          <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: 12 }}>
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
      </div>
    </div>
  );
}

// ── Resolution ────────────────────────────────────────────────────────────────
//
// Uses react-ttrpg-dice for 3D animated dice by default.
// A manual fallback (DicePanel with DieSelector) is available via toggle.

export function ResolutionScreen() {
  const { gameState, rollDice, nextPhase } = useGameStore();
  const [use3D, setUse3D] = useState(true);
  const hasRolled = gameState.scene.rollMain !== null && gameState.scene.rollEffort !== null;

  // Lazy-load DiceOverlay to avoid SSR issues (Three.js/WebGL not available server-side)
  const [DiceOverlay, setDiceOverlay] = useState<React.ComponentType<any> | null>(null);
  useEffect(() => {
    import('react-ttrpg-dice').then(m => {
      setDiceOverlay(() => m.DiceOverlay);
    }).catch(() => {
      setUse3D(false);
    });
  }, []);

  /** Shared palette — matches slasherTheme in RandomDiceRoller.tsx */
  const slasherTheme = {
    dieColor:    '#1c1c1c', // near-black dark grey body
    numberColor: '#dc2626', // striking red (--color-accent-bright)
    accentColor: '#8a0000', // deep crimson edges / accent
    roughness:   0.35,
    metalness:   0.15,
  };

  const handleDiceResult = (result: import('react-ttrpg-dice').RollResult) => {
    // Groups are labelled 'd10' and 'd4' — library returns 10 for the "0" face.
    const rawD10 = result.rolls.find(r => r.group === 'd10')?.value ?? 0;
    const rawD4  = result.rolls.find(r => r.group === 'd4')?.value  ?? 1;
    // Remap 10 → 0 (standard d10 "0" pip), clamp d4 to 1-4
    const safeD10 = (rawD10 % 10) as 0|1|2|3|4|5|6|7|8|9;
    const safeD4  = Math.max(1, Math.min(4, rawD4)) as 1|2|3|4;
    rollDice(safeD10, safeD4);
  };

  return (
    <div className="phase-panel">
      <h2 className="phase-title">The Roll</h2>
      <div className="row" style={{ alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <p className="phase-subtitle" style={{ margin: 0 }}>Roll the d13 (d10 + d4).</p>
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => setUse3D(v => !v)}
          style={{ fontSize: '0.7rem', marginLeft: 'auto' }}
        >
          {use3D ? 'Use Manual Entry' : 'Use 3D Dice'}
        </button>
      </div>
      <div className="stack">
        {use3D && DiceOverlay ? (
          <div style={{ borderRadius: 8, overflow: 'hidden', minHeight: 260, background: '#0a0a0a' }}>
            <DiceOverlay
              roll="1d10 + 1d4"
              groups={[
                { notation: '1d10', config: slasherTheme, label: 'd10' },
                { notation: '1d4',  config: slasherTheme, label: 'd4'  },
              ]}
              onRollComplete={handleDiceResult}
            />
          </div>
        ) : (
          <DicePanel />
        )}
        {hasRolled && (
          <div style={{ fontSize: '0.8rem', color: 'var(--color-success)', textAlign: 'center' }}>
            ✔ Rolled: d10={gameState.scene.rollMain} | d4={gameState.scene.rollEffort}
          </div>
        )}
        <ActionFooter
          label="Lock In Roll →"
          disabled={!hasRolled}
          hint={hasRolled ? undefined : 'Roll both dice first'}
          onClick={nextPhase}
        />
      </div>
    </div>
  );
}

// ── Resolve Scene ─────────────────────────────────────────────────────────────

export function ResolveSceneScreen() {
  const { gameState, nextPhase } = useGameStore();
  const { scene, deck } = gameState;

  const selectedCard = scene.selectedCardId
    ? deck.visibleCards.find(c => c.id === scene.selectedCardId) ?? null
    : null;
  const joker = scene.activeJoker
    ? { id: `Joker-${scene.activeJoker}`, color: scene.activeJoker, isJoker: true as const }
    : null;

  const threatCard = joker ?? selectedCard;
  const d4 = scene.modifiedEffort ?? scene.rollEffort;
  const d10 = scene.rollMain;

  const total = d10 !== null && d4 !== null ? calculateTotal(d10, d4) : null;
  const difficulty = threatCard ? calculateDifficulty(threatCard, deck.trophyTop) : null;
  const success = total !== null && difficulty !== null ? isSuccessful(total, difficulty) : null;
  const effortLevel = d4 !== null ? getEffortLevel(d4) : null;

  const EFFORT_LABELS: Record<string, string> = {
    'controlled':    '1 — Controlled Effort: You kept your cool. Narrate exactly how you want.',
    'pushing-it':    '2 — Pushing It: Choose a minor cost from 2-3 options suggested by the table.',
    'overexertion':  '3 — Overexertion: The Sacrifice happens regardless of success or failure.',
    'breaking-point':'4 — Breaking Point: Sacrifice + a new Twist. This is a Strike.',
  };

  return (
    <div className="phase-panel">
      <h2 className="phase-title">The Result</h2>
      <div className="stack">
        {success !== null && (
          <div className={`result-banner result-banner--${success ? 'success' : 'failure'}`}>
            <div className="result-banner__word">{success ? 'SUCCESS' : 'FAILURE'}</div>
            <div className="result-banner__detail">Total {total} vs Difficulty {difficulty}</div>
          </div>
        )}

        {effortLevel && (
          <div className={`effort-band effort-band--${effortLevel}`}>
            <span className="effort-band__label">{EFFORT_LABELS[effortLevel]}</span>
          </div>
        )}

        {d4 === 4 && (
          <div style={{ padding: '12px 16px', borderRadius: 4, background: 'rgba(220,38,38,0.1)', border: '1px solid var(--color-accent-bright)', color: 'var(--color-accent-bright)', fontSize: '0.875rem', fontWeight: 600 }}>
            ⚡ Breaking Point — this earns a Strike regardless of outcome.
          </div>
        )}

        <Card title="Narrate the Outcome">
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>
            {success
              ? 'Describe how your character overcomes the challenge. The table frames the shot.'
              : 'Describe how the challenge overcomes your character. Make it hurt, make it matter.'}
          </p>
        </Card>

        <ActionFooter label="Apply Fallout →" onClick={nextPhase} />
      </div>
    </div>
  );
}

// ── Fallout ───────────────────────────────────────────────────────────────────

export function FalloutScreen() {
  const { gameState, applyFallout, assignStrike, awardGenrePoint, nextPhase } = useGameStore();
  const { scene, deck, strikesToAssign, characters, players } = gameState;
  const [falloutApplied, setFalloutApplied] = useState(false);

  const selectedCard = scene.selectedCardId
    ? deck.visibleCards.find(c => c.id === scene.selectedCardId) ?? null
    : null;
  const isFace = selectedCard ? selectedCard.rank >= 11 : false;

  const handleApplyFallout = () => {
    applyFallout();
    setFalloutApplied(true);
  };

  return (
    <div className="phase-panel">
      <h2 className="phase-title">Fallout</h2>
      <p className="phase-subtitle">Update the decks and assign consequences.</p>

      <div className="stack">
        {!falloutApplied && (
          <ActionFooter label="⚙ Apply Deck Changes" onClick={handleApplyFallout} />
        )}

        {falloutApplied && (
          <>
            <div style={{ color: 'var(--color-success)', fontWeight: 600 }}>✔ Deck state updated.</div>

            {isFace && deck.weaknessesBySuit.size > 0 && (
              <Card variant="success" title="Weaknesses Found">
                <div className="weakness-row">
                  {(['Spades', 'Hearts', 'Clubs', 'Diamonds'] as Suit[]).map(s => (
                    <div key={s} className={`weakness-pip ${deck.weaknessesBySuit.has(s) ? 'weakness-pip--found' : ''}`}>
                      {SUIT_SYMBOL[s]} {s}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {strikesToAssign > 0 && (
              <Card variant="failure" title={`⚡ Assign ${strikesToAssign} Strike${strikesToAssign > 1 ? 's' : ''}`}>
                <div className="row">
                  {characters.filter(c => !c.isDead).map(c => (
                    <Button key={c.id} variant="secondary" size="sm" onClick={() => assignStrike(c.id)}>
                      {SUIT_SYMBOL[c.id]} {c.name} ({c.strikes}/3)
                    </Button>
                  ))}
                </div>
              </Card>
            )}

            {!scene.isGenrePointAwarded && gameState.tableGenrePoints > 0 && (
              <Card title="🎭 Award Genre Point?">
                <div className="row">
                  {players.map(p => {
                    const char = characters.find(c => c.id === p.characterId);
                    if (!char || char.isDead) return null;
                    return (
                      <Button key={p.id} variant="secondary" size="sm" onClick={() => awardGenrePoint(p.id)}>
                        To {SUIT_SYMBOL[p.characterId]} {char.name}
                      </Button>
                    );
                  })}
                </div>
              </Card>
            )}

            {gameState.pendingActSetups.length > 0 && (
              <div style={{ padding: '12px 16px', borderRadius: 4, background: 'rgba(220,38,38,0.1)', border: '1px solid var(--color-accent)', color: 'var(--color-accent-bright)', fontSize: '0.875rem', fontWeight: 600 }}>
                ⚠ Act transition pending: {gameState.pendingActSetups.join(' → ')}
              </div>
            )}

            <ActionFooter
              label={strikesToAssign > 0 ? `Assign ${strikesToAssign} Strike(s) first` : 'Next Scene →'}
              disabled={strikesToAssign > 0}
              onClick={nextPhase}
            />
          </>
        )}
      </div>
    </div>
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
