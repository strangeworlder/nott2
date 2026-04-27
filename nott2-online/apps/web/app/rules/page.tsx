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
import './rules.css';

export const metadata: Metadata = {
  title: 'Rules Reference — Night of the Thirteenth 2',
  description: 'Quick reference for Night of the Thirteenth 2 game rules. Phases, dice, effort levels, and card mechanics.',
};

export default function RulesPage() {
  return (
    <main className="rules-page">
      <header className="rules-header">
        <a href="/" className="rules-back">← Home</a>
        <h1 className="rules-title">Rules Reference</h1>
        <span className="rules-subtitle">Night of the Thirteenth 2</span>
      </header>

      <article className="rules-body">

        {/* Overview */}
        <section className="rules-section">
          <h2>The Game</h2>
          <p>A director-less horror TTRPG for 4 players. One player per character (Spades, Hearts, Clubs, Diamonds). No GM. The table narrates collectively. You are victims in a slasher movie — the script is already written.</p>
        </section>

        {/* The Dice */}
        <section className="rules-section">
          <h2>The Roll — d13</h2>
          <p>Every challenge is resolved with a <strong>d13</strong> = d10 (0–9) + d4 (1–4), clamped to [1–13].</p>
          <p>Roll <strong>equal to or over the Difficulty</strong> to succeed.</p>

          <h3>Effort Levels (d4)</h3>
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
          <h2>Difficulty</h2>
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
          <h2>Acts</h2>
          <div className="rules-acts">
            <div className="rules-act">
              <div className="rules-act__num">Act I</div>
              <div className="rules-act__name">The Setup</div>
              <p>4 Aces on top of the Threat Deck — one per character. Only Jacks appear. Resolving a Face Card ends Act 1.</p>
            </div>
            <div className="rules-act rules-act--2">
              <div className="rules-act__num">Act II</div>
              <div className="rules-act__name">The Horror Story</div>
              <p>The Killer is active. People will die. More and more Face Cards get added to the Threat Deck.</p>
            </div>
            <div className="rules-act rules-act--3">
              <div className="rules-act__num">Act III</div>
              <div className="rules-act__name">The Climax</div>
              <p>All Number Cards removed from Threat Deck. Only Face Cards remain. Every scene is a direct confrontation.</p>
            </div>
          </div>
        </section>

        {/* Phase Sequence */}
        <section className="rules-section">
          <h2>Scene Sequence</h2>
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
          <h2>Aptitude</h2>
          <table className="rules-table">
            <thead><tr><th>Suit</th><th>Aptitude</th><th>Applies to</th></tr></thead>
            <tbody>
              <tr><td>♠ Spades</td><td>Power</td><td>High-rank (6–10) Spades cards</td></tr>
              <tr><td>♥ Hearts</td><td>Resolve</td><td>Low-rank (2–5) Hearts cards</td></tr>
              <tr><td>♣ Clubs</td><td>Intellect</td><td>High-rank Clubs cards</td></tr>
              <tr><td>♦ Diamonds</td><td>Finesse</td><td>Low-rank Diamonds cards</td></tr>
            </tbody>
          </table>
          <p>When the active player's Aptitude matches the challenge card, they may modify their d4 by ±1 <em>after</em> rolling, once per roll.</p>
        </section>

        {/* Genre Points */}
        <section className="rules-section">
          <h2>Genre Points</h2>
          <p>The table starts with <strong>13 Genre Points</strong> in a shared pool. Players earn them during play (escalation, great roleplay). They may spend one to reroll the d10 and add +1 to the new result.</p>
          <p>Spending a Genre Point is once per roll, before Aptitude is applied.</p>
        </section>

        {/* Strikes */}
        <section className="rules-section">
          <h2>Strikes &amp; Death</h2>
          <p>A character receives a Strike from:</p>
          <ul className="rules-list">
            <li>A d4 result of 4 (Breaking Point)</li>
            <li>Losing against a Face Card</li>
            <li>Final Girl module: any Face Card encounter</li>
          </ul>
          <p>At <strong>3 Strikes</strong>, the character dies. They are removed from the game. If all characters die, the players lose.</p>
        </section>

        {/* Jokers */}
        <section className="rules-section">
          <h2>Jokers (Endgame)</h2>
          <p>When Act 3 begins, two Jokers are added to the Threat Deck:</p>
          <ul className="rules-list">
            <li><strong>Red Joker</strong> — The End. Immediate lose condition if drawn and failed.</li>
            <li><strong>Black Joker</strong> — The Twist. Removed from deck on first encounter.</li>
          </ul>
        </section>

      </article>
    </main>
  );
}
