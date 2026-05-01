/**
 * ResolutionScreen — Dice rolling, aptitude toggle, genre point reroll.
 * Uses react-ttrpg-dice for 3D animated dice, with manual fallback.
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  PhasePanel, Card, Button, ActionFooter,
  DifficultyBadge, DiceResult, EffortBand, Icon,
} from '@nott2/design-system';
import { useGameStore } from '../../../store/game-store';
import DicePanel from '../DicePanel';
import { calculateTotal, getEffortLevel, canUseAptitude } from '@nott2/game-engine';

/** Shared palette — dark horror theme */
const SLASHER_THEME = {
  dieColor:    '#1c1c1c',
  numberColor: '#dc2626',
  accentColor: '#8a0000',
  roughness:   0.35,
  metalness:   0.15,
};

export function ResolutionScreen() {
  const { gameState, rollDice, applyAptitude, useGenrePoint, nextPhase } = useGameStore();
  const [use3D, setUse3D] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const hasRolled = gameState.scene.rollMain !== null && gameState.scene.rollEffort !== null;
  const [aptitudeChoice, setAptitudeChoice] = useState<-1 | 0 | 1>(0);

  const { scene, deck, characters, players } = gameState;
  const activePlayer = players.find(p => p.id === scene.activePlayerId);
  const activeChar = activePlayer ? characters.find(c => c.id === activePlayer.characterId) : null;
  const selectedCard = scene.selectedCardId
    ? deck.visibleCards.find(c => c.id === scene.selectedCardId) ?? null : null;
  const hasAptitude = activeChar && selectedCard ? canUseAptitude(activeChar.aptitude, selectedCard) : false;

  const trophyRank = deck.trophyTop?.rank ?? 1;
  const difficulty = selectedCard
    ? (() => { const r = selectedCard.rank; if (r === 1) return 1; if (r <= 10) return r; if (r === 11) return trophyRank + 1; if (r === 12) return trophyRank + 2; return trophyRank + 3; })()
    : scene.activeJoker ? trophyRank : null;

  const difficultyBreakdown = selectedCard && selectedCard.rank <= 10
    ? `Number card rank = ${selectedCard.rank}`
    : selectedCard && selectedCard.rank >= 11
    ? `Trophy (${trophyRank}) + ${selectedCard.rank - 10} = ${difficulty}`
    : scene.activeJoker ? `Trophy (${trophyRank}) + 0 = ${difficulty}` : undefined;

  const rawD4 = scene.rollEffort;
  const previewD4 = rawD4 !== null ? Math.max(1, Math.min(4, rawD4 + aptitudeChoice)) as 1|2|3|4 : null;
  const previewTotal = scene.rollMain !== null && previewD4 !== null ? calculateTotal(scene.rollMain, previewD4) : null;
  const previewEffort = previewD4 !== null ? getEffortLevel(previewD4) : null;

  const canSpendGP = hasRolled && !scene.isGenrePointUsed
    && (gameState.playerGenrePoints[scene.activePlayerId ?? ''] ?? 0) > 0;

  const [diceHook, setDiceHook] = useState<any>(null);
  useEffect(() => {
    import('react-ttrpg-dice').then(m => { setDiceHook(() => m.useDiceRoll); }).catch(() => { setUse3D(false); });
  }, []);

  const handleLockIn = () => {
    if (aptitudeChoice !== 0 && hasAptitude) applyAptitude(aptitudeChoice);
    nextPhase();
  };

  return (
    <PhasePanel title="The Roll" subtitle="Roll the d13 — d10 for luck, d4 for effort. Beat the difficulty to survive.">
      {difficulty !== null && <DifficultyBadge value={difficulty} breakdown={difficultyBreakdown} />}

      {use3D && diceHook ? (
        <ResolutionDiceRoller useDiceRoll={diceHook} slasherTheme={SLASHER_THEME}
          onResult={(d10, d4) => { rollDice(d10, d4); setAptitudeChoice(0); }}
          hasRolled={hasRolled} isRolling={isRolling} setIsRolling={setIsRolling}
          rollMain={gameState.scene.rollMain} rollEffort={gameState.scene.rollEffort} />
      ) : (<DicePanel />)}

      {hasRolled && !isRolling && scene.rollMain !== null && scene.rollEffort !== null && (
        <>
          <DiceResult d10={scene.rollMain} d4={previewD4 ?? scene.rollEffort}
            modifier={aptitudeChoice !== 0 ? { value: aptitudeChoice as -1 | 1, label: 'Aptitude' } : undefined}
            originalD4={aptitudeChoice !== 0 ? rawD4 ?? undefined : undefined} />
          {previewEffort && <EffortBand level={previewEffort as any} />}
        </>
      )}

      {hasRolled && !isRolling && hasAptitude && (
        <Card title={`Aptitude — ${activeChar!.aptitude}`}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: 12 }}>
            Your aptitude lets you adjust the Effort Die (d4) by ±1. Explore the options — your choice is only locked in when you proceed.
          </p>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            <Button variant={aptitudeChoice === -1 ? 'primary' : 'secondary'} size="sm"
              onClick={() => setAptitudeChoice(aptitudeChoice === -1 ? 0 : -1)} disabled={rawD4 !== null && rawD4 <= 1}>−1 Effort</Button>
            <Button variant={aptitudeChoice === 0 ? 'primary' : 'ghost'} size="sm"
              onClick={() => setAptitudeChoice(0)}>No Change</Button>
            <Button variant={aptitudeChoice === 1 ? 'primary' : 'secondary'} size="sm"
              onClick={() => setAptitudeChoice(aptitudeChoice === 1 ? 0 : 1)} disabled={rawD4 !== null && rawD4 >= 4}>+1 Effort</Button>
          </div>
        </Card>
      )}

      {canSpendGP && !isRolling && (
        <Card variant="instruction" title="Spend Genre Point? (Reroll d13, d10 gets +1)">
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: 8 }}>
            Spend 1 Genre Point to reroll. The new d10 gets +1. You must accept the result.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {use3D && diceHook ? (
              <GenrePointDiceRoller useDiceRoll={diceHook} slasherTheme={SLASHER_THEME}
                onResult={(d10) => { useGenrePoint(d10); setAptitudeChoice(0); }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 8 }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textAlign: 'center' }}>Select your new d10 (will add +1):</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                  {([0,1,2,3,4,5,6,7,8,9] as const).map(v => (
                    <Button key={v} variant="secondary" size="sm"
                      onClick={() => { useGenrePoint(v); setAptitudeChoice(0); }}>{v}</Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <ActionFooter label="Lock In Roll →" disabled={!hasRolled || isRolling}
        hint={hasRolled ? undefined : 'Roll both dice first'} onClick={handleLockIn} />
    </PhasePanel>
  );
}

// ── Sub-components (hooks cannot be called conditionally) ────────────────────

function ResolutionDiceRoller({ useDiceRoll, slasherTheme, onResult, hasRolled, isRolling, setIsRolling, rollMain, rollEffort }: {
  useDiceRoll: any; slasherTheme: Record<string, any>;
  onResult: (d10: any, d4: any) => void;
  hasRolled: boolean; isRolling: boolean; setIsRolling: (v: boolean) => void;
  rollMain: number | null; rollEffort: number | null;
}) {
  const { rollGroups, isRolling: diceIsRolling, DiceOverlayPortal } = useDiceRoll({
    sound: true, cameraAngle: { x: -1, z: -1 }, zIndex: 10000,
    onRollComplete: (result: any) => {
      const rawD10 = result.rolls.find((r: any) => r.group === 'd10')?.value ?? 0;
      const rawD4  = result.rolls.find((r: any) => r.group === 'd4')?.value  ?? 1;
      onResult((rawD10 % 10) as 0|1|2|3|4|5|6|7|8|9, Math.max(1, Math.min(4, rawD4)) as 1|2|3|4);
      setIsRolling(false);
    },
  });
  const handleRoll = () => { setIsRolling(true); rollGroups([
    { notation: '1d10', config: slasherTheme, label: 'd10' },
    { notation: '1d4',  config: slasherTheme, label: 'd4'  },
  ]); };
  return (
    <>
      {!hasRolled && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
          <button className="random-dice-btn" onClick={handleRoll} disabled={isRolling || diceIsRolling}
            aria-label={isRolling ? 'Dice are rolling…' : 'Roll the d13'} style={{ minWidth: 200 }}>
            <span className="random-dice-btn__icon" aria-hidden="true"><Icon name="casino" size={24} /></span>
            <span className="random-dice-btn__label">{isRolling ? 'Rolling…' : 'Roll the Dice'}</span>
          </button>
        </div>
      )}
      {DiceOverlayPortal}
    </>
  );
}

function GenrePointDiceRoller({ useDiceRoll, slasherTheme, onResult }: {
  useDiceRoll: any; slasherTheme: Record<string, any>; onResult: (d10: any) => void;
}) {
  const { rollGroups, isRolling, DiceOverlayPortal } = useDiceRoll({
    sound: true, cameraAngle: { x: -1, z: -1 }, zIndex: 10000,
    onRollComplete: (result: any) => {
      const rawD10 = result.rolls.find((r: any) => r.group === 'd10')?.value ?? 0;
      onResult((rawD10 % 10) as 0|1|2|3|4|5|6|7|8|9);
    },
  });
  return (
    <>
      <button className="random-dice-btn" onClick={() => rollGroups([{ notation: '1d10', config: slasherTheme, label: 'd10' }])}
        disabled={isRolling} aria-label={isRolling ? 'Rerolling…' : 'Spend Genre Point & Reroll'} style={{ minWidth: 200 }}>
        <span className="random-dice-btn__icon" aria-hidden="true"><Icon name="theater_comedy" size={24} /></span>
        <span className="random-dice-btn__label">{isRolling ? 'Rerolling…' : 'Spend & Reroll d10'}</span>
      </button>
      {DiceOverlayPortal}
    </>
  );
}
