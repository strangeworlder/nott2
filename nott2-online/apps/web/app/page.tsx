/**
 * Landing Page — /
 *
 * Server-rendered. The "poster" for Night of the Thirteenth 2.
 * Atmospheric hero with red-glow typography, two primary CTAs,
 * and links to demo + rules.
 *
 * This is the first thing every player sees. It should feel like
 * an opening credit sequence — dramatic, foreboding, inevitable.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Text } from '@nott2/design-system';
import './landing.css';

export const metadata: Metadata = {
  title: 'Night of the Thirteenth 2 — Online Play',
  description:
    'A director-less horror TTRPG for four players. The script is already written. Will you survive the Night of the Thirteenth?',
};

export default function LandingPage() {
  return (
    <main className="landing">
      {/* Atmospheric background grain */}
      <div className="landing__grain" aria-hidden />

      {/* Hero */}
      <section className="landing__hero">
        <Text variant="label" className="landing__eyebrow">A Horror TTRPG for 4 Players</Text>

        <Text variant="hero" as="h1" className="landing__title">
          Night of the<br />
          <Text variant="hero" as="span" className="landing__title-num">Thirteenth</Text>
        </Text>

        <Text variant="lead" as="p" className="landing__tagline">
          You are not heroes. You are victims in a slasher movie,<br />
          and the script is already written.
        </Text>

        <div className="landing__ctas">
          <Link href="/lobby" className="landing-btn landing-btn--primary">
            Create Game
          </Link>
          <Link href="/lobby?join=true" className="landing-btn landing-btn--secondary">
            Join Game
          </Link>
        </div>

        <div className="landing__secondary-links">
          <Link href="/demo" className="landing-link">Solo Demo</Link>
          <Text variant="body" as="span" color="muted" className="landing__dot">·</Text>
          <Link href="/rules" className="landing-link">Rules Reference</Link>
        </div>
      </section>

      {/* Decorative footer */}
      <footer className="landing__footer">
        <Text variant="micro" as="span" color="muted">Night of the Thirteenth 2</Text>
        <Text variant="micro" as="span" color="muted" className="landing__dot">·</Text>
        <Text variant="micro" as="span" color="muted">Online Play</Text>
      </footer>
    </main>
  );
}
