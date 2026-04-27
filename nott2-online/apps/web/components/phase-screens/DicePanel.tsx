/**
 * DicePanel — d10 + d4 selectors for manual dice entry with optional 3-D roll.
 *
 * §3 of game rules: d13 = d10 (0-9) + d4 (1-4), clamped [1,13].
 * §8.7: Aptitude modifies d4 by ±1 after the roll.
 * §6.2: Genre Point reroll adds +1 to new d10.
 *
 * Uses design system DieSelector molecule for the die grids,
 * Button for APT/GP actions, Card for grouping.
 * Uses RandomDiceRoller to trigger a physics-based roll that auto-fills both dice.
 */

'use client';

import { useGameStore } from '../../store/game-store';
import { DieSelector, Button, Card } from '@nott2/design-system';
import type { D10Result, D4Result } from '@nott2/game-engine';
import RandomDiceRoller from './RandomDiceRoller';
import { getEffortLevel, calculateTotal, canUseAptitude } from '@nott2/game-engine';

const D10_VALUES: D10Result[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const EFFORT_LABELS: Record<string, { icon: string; label: string; desc: string }> = {
  'controlled':    { icon: '🎯', label: 'Controlled Effort', desc: 'No extra cost.' },
  'pushing-it':    { icon: '💨', label: 'Pushing It', desc: 'Minor cost — choose from 2-3 options.' },
  'overexertion':  { icon: '🔥', label: 'Overexertion', desc: 'Sacrifice happens regardless.' },
  'breaking-point':{ icon: '💀', label: 'Breaking Point', desc: 'Sacrifice + Twist. This earns a Strike.' },
};

export default function DicePanel() {
  const { gameState, rollDice, applyAptitude, useGenrePoint } = useGameStore();
  const { scene, deck } = gameState;

  const d10 = scene.rollMain;
  const d4 = scene.rollEffort;
  const modD4 = scene.modifiedEffort;
  const effectiveD4 = modD4 ?? d4;

  const total = d10 !== null && effectiveD4 !== null
    ? calculateTotal(d10, effectiveD4)
    : null;

  const effortLevel = effectiveD4 !== null ? getEffortLevel(effectiveD4) : null;
  const effortInfo = effortLevel ? EFFORT_LABELS[effortLevel] : null;

  const activePlayer = gameState.players.find(p => p.id === scene.activePlayerId);
  const activeChar = activePlayer
    ? gameState.characters.find(c => c.id === activePlayer.characterId)
    : null;

  const selectedCard = scene.selectedCardId
    ? deck.visibleCards.find(c => c.id === scene.selectedCardId) ?? null
    : null;

  const hasAptitude = activeChar && selectedCard
    ? canUseAptitude(activeChar.aptitude, selectedCard)
    : false;

  const canSpendGP = !scene.isGenrePointUsed && d10 !== null
    && (gameState.playerGenrePoints[scene.activePlayerId ?? ''] ?? 0) > 0;

  const hasRolled = d10 !== null && d4 !== null;

  return (
    <div className="stack">
      {/* 3-D physics roller — optional shortcut that fills both selectors */}
      <div className="dice-roller-section">
        <RandomDiceRoller
          onResult={(newD10, newD4) => rollDice(newD10, newD4)}
          disabled={false}
        />
        <div className="dice-roller-divider">
          <span>or select manually</span>
        </div>
      </div>

      {/* d10 selector — uses DS DieSelector with sides=10 */}
      <DieSelector
        sides={10}
        value={d10}
        onChange={v => rollDice(v as D10Result, (d4 ?? 1) as D4Result)}
        label="d10 (Main Die — 0 to 9)"
        color="red"
      />

      {/* d4 selector */}
      <DieSelector
        sides={4}
        value={d4}
        onChange={v => rollDice((d10 ?? 0) as D10Result, v as D4Result)}
        label="d4 (Effort Die — 1 to 4)"
        color="white"
      />

      {/* Effort Band */}
      {effortInfo && (
        <div className={`effort-band effort-band--${effortLevel}`}>
          <span className="effort-band__icon">{effortInfo.icon}</span>
          <span className="effort-band__label">{effortInfo.label}</span>
          <span className="effort-band__desc">{effortInfo.desc}</span>
        </div>
      )}

      {/* Aptitude modifier */}
      {hasAptitude && d4 !== null && !modD4 && (
        <Card title={`✨ Aptitude Match (${activeChar?.aptitude}) — Modify d4?`}>
          <div className="row">
            <Button variant="secondary" size="sm" onClick={() => applyAptitude(-1)} disabled={d4 <= 1}>
              −1 (Less Effort, Lower Total)
            </Button>
            <Button variant="secondary" size="sm" onClick={() => applyAptitude(1)} disabled={d4 >= 4}>
              +1 (More Effort, Higher Total)
            </Button>
          </div>
        </Card>
      )}

      {/* Modified effort display */}
      {modD4 !== null && (
        <div className="row">
          <span className="label-sm">Modified d4:</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700 }}>{modD4}</span>
          <span className="text-muted">(was {d4})</span>
        </div>
      )}

      {/* Total */}
      {total !== null && (
        <div className="row" style={{ justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="label-sm">Roll Total</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1 }}>
              {total}
            </div>
          </div>
        </div>
      )}

      {/* Genre Point reroll */}
      {canSpendGP && (
        <Card variant="instruction" title="🎭 Spend Genre Point? (Reroll + d10 +1)">
          <DieSelector
            sides={10}
            value={null}
            onChange={v => useGenrePoint(v as D10Result)}
            label="Pick your new d10 (will add +1)"
            color="red"
          />
        </Card>
      )}
    </div>
  );
}
