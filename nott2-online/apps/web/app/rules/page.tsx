/**
 * Rules Reference Page — /rules
 *
 * Server-rendered. A clean, printable reference of the core game rules.
 * Opens in a new tab from the game page header.
 *
 * Content is a curated summary — players shouldn't need to read a wall
 * of text during play. Organised by phase with quick-reference tables.
 */

import type { Metadata } from 'next';
import { darkTheme } from '@nott2/design-system/src/tokens/theme.css';
import { Text } from '@nott2/design-system/src/atoms/Text/Text';
import './rules.css';

export const metadata: Metadata = {
  title: 'Rules Reference — Night of the Thirteenth 2',
  description: 'Quick reference for Night of the Thirteenth 2 game rules. Phases, dice, effort levels, and card mechanics.',
};

export default function RulesPage() {
  return (
    <main className={`rules-page ${darkTheme}`}>
      <header className="rules-header">
        <a href="/" className="rules-back">← Home</a>
        <Text variant="h1" color="red" glow className="rules-title">Rules Reference</Text>
        <Text variant="micro" color="muted" as="span" className="rules-subtitle">Night of the Thirteenth 2</Text>
      </header>

      <article className="rules-body">

        {/* Overview */}
        <section className="rules-section">
          <Text variant="h2" border="bottom">The Game</Text>
          <Text variant="body" color="muted">A director-less horror TTRPG for 4 players. One player per character (Spades, Hearts, Clubs, Diamonds). No GM. The table narrates collectively. You are victims in a slasher movie — the script is already written.</Text>
        </section>

        {/* The Dice */}
        <section className="rules-section">
          <Text variant="h2" border="bottom">The Roll — d13</Text>
          <Text variant="body" color="muted">Every challenge is resolved with a <strong>d13</strong> = d10 (0–9) + d4 (1–4), clamped to [1–13].</Text>
          <Text variant="body" color="muted">Roll <strong>equal to or over the Difficulty</strong> to succeed.</Text>

          <Text variant="label" color="muted">Effort Levels (d4)</Text>
          <table className="rules-table">
            <thead><tr><th>d4</th><th>Level</th><th>Cost</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Controlled Effort</td><td>No cost. Narrate freely.</td></tr>
              <tr><td>2</td><td>Pushing It</td><td>Minor cost — choose from 2–3 table suggestions.</td></tr>
              <tr><td>3</td><td>Overexertion</td><td>The Sacrifice happens regardless of success or failure.</td></tr>
              <tr className="rules-table__danger"><td>4</td><td>Breaking Point</td><td>Sacrifice + new Twist. Earns a Strike.</td></tr>
            </tbody>
          </table>
        </section>

        {/* Difficulty */}
        <section className="rules-section">
          <Text variant="h2" border="bottom">Difficulty</Text>
          <table className="rules-table">
            <thead><tr><th>Card Type</th><th>Difficulty</th></tr></thead>
            <tbody>
              <tr><td>Ace (Prologue)</td><td>1</td></tr>
              <tr><td>Number Card (2–10)</td><td>= Card Rank</td></tr>
              <tr><td>Jack (Face Card)</td><td>Trophy Rank + 1</td></tr>
              <tr><td>Queen (Face Card)</td><td>Trophy Rank + 2</td></tr>
              <tr><td>King (Face Card)</td><td>Trophy Rank + 3</td></tr>
              <tr><td>Joker</td><td>= Trophy Rank</td></tr>
            </tbody>
          </table>
        </section>

        {/* Acts */}
        <section className="rules-section">
          <Text variant="h2" border="bottom">Acts</Text>
          <div className="rules-acts">
            <div className="rules-act">
              <Text variant="micro" color="muted" as="div" className="rules-act__num">Act I</Text>
              <Text variant="h3" as="div" className="rules-act__name">The Setup</Text>
              <Text variant="body" color="muted" as="p">4 Aces on top of the Threat Deck — one per character. Only Jacks appear. Resolving a Face Card ends Act 1.</Text>
            </div>
            <div className="rules-act rules-act--2">
              <Text variant="micro" color="muted" as="div" className="rules-act__num">Act II</Text>
              <Text variant="h3" as="div" className="rules-act__name">The Horror Story</Text>
              <Text variant="body" color="muted" as="p">The Killer is active. People will die. More and more Face Cards get added to the Threat Deck.</Text>
            </div>
            <div className="rules-act rules-act--3">
              <Text variant="micro" color="muted" as="div" className="rules-act__num">Act III</Text>
              <Text variant="h3" color="red" as="div" className="rules-act__name">The Climax</Text>
              <Text variant="body" color="muted" as="p">All Number Cards removed from Threat Deck. Only Face Cards remain. Every scene is a direct confrontation. The Finale begins when all 4 weaknesses are found.</Text>
            </div>
          </div>
        </section>

        {/* Phase Sequence */}
        <section className="rules-section">
          <Text variant="h2" border="bottom">Scene Sequence</Text>
          <ol className="rules-phases">
            <li><strong>Scene Setup</strong> — Draw cards, fill the table (max 2 visible). Select the challenge card. Face Cards must be selected if visible.</li>
            <li><strong>Conversation &amp; Stakes</strong> — Role-play the scene. One non-AP player may use Escalation once. Define the Sacrifice.</li>
            <li><strong>Resolution</strong> — Roll d13. AP may use Aptitude (±1 to d4 if suit matches) after the roll.</li>
            <li><strong>Resolve Scene</strong> — Narrate the outcome. Apply Effort cost.</li>
            <li><strong>Fallout</strong> — Apply deck changes, assign Strikes, award Genre Points, then start the next scene.</li>
          </ol>
        </section>

        {/* Aptitude */}
        <section className="rules-section">
          <Text variant="h2" border="bottom">Aptitude</Text>
          <table className="rules-table">
            <thead><tr><th>Suit</th><th>Aptitude</th><th>Applies to</th></tr></thead>
            <tbody>
              <tr><td>♠ Spades</td><td>Power</td><td>Any Spades card</td></tr>
              <tr><td>♥ Hearts</td><td>Resolve</td><td>Any Hearts card</td></tr>
              <tr><td>♣ Clubs</td><td>Intellect</td><td>Any Clubs card</td></tr>
              <tr><td>♦ Diamonds</td><td>Finesse</td><td>Any Diamonds card</td></tr>
            </tbody>
          </table>
          <Text variant="body" color="muted">When the active player's Aptitude matches the challenge card, they may modify their d4 by ±1 <em>after</em> rolling, once per roll.</Text>
        </section>

        {/* Genre Points */}
        <section className="rules-section">
          <Text variant="h2" border="bottom">Genre Points</Text>
          <Text variant="body" color="muted">The table starts with <strong>13 Genre Points</strong> in a shared pool. Players earn them during play (escalation, great roleplay). They may spend one to reroll the d10 and add +1 to the new result.</Text>
          <Text variant="body" color="muted">Spending a Genre Point is once per roll, before Aptitude is applied.</Text>
        </section>

        {/* Strikes */}
        <section className="rules-section">
          <Text variant="h2" border="bottom">Strikes &amp; Death</Text>
          <Text variant="body" color="muted">A character receives a Strike from:</Text>
          <ul className="rules-list">
            <li>A d4 result of 4 (Breaking Point)</li>
            <li>Losing against a Face Card</li>
          </ul>
          <Text variant="body" color="muted">At <strong>3 Strikes</strong>, the character dies. They are removed from the game. If all characters die, the players lose.</Text>
        </section>

        {/* Jokers */}
        <section className="rules-section">
          <Text variant="h2" border="bottom">Jokers (Endgame)</Text>
          <Text variant="body" color="muted">When The Finale begins (4 weaknesses found), two Jokers are added to the Threat Deck:</Text>
          <ul className="rules-list">
            <li><strong>Red Joker</strong> — The End. Immediate lose condition if drawn and failed.</li>
            <li><strong>Black Joker</strong> — The Twist. Removed from deck on first encounter.</li>
          </ul>
        </section>

      </article>
    </main>
  );
}
