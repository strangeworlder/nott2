/**
 * ResultBanner
 *
 * Philosophical:
 * The jump scare of the game's interface — the single most dramatic moment in
 * every scene. SUCCESS or FAILURE lands like a film card, sudden and definitive.
 * Where everything else whispers, this shouts. It is the verdict after the dice
 * have spoken, and it should feel like a sentence being read aloud in a courtroom.
 *
 * Technical:
 * A bordered banner displaying the outcome (success or failure) with the roll
 * total vs difficulty breakdown. Used in ResolveSceneScreen.
 *
 * Props:
 * - outcome: 'success' | 'failure' (required).
 * - total: The player's roll total (optional, shown in breakdown).
 * - difficulty: The challenge difficulty (optional, shown in breakdown).
 * - id: Optional id attribute.
 */

import React from 'react';
import { bannerRecipe, bannerWord, bannerWordSuccess, bannerWordFailure, bannerDetail } from './ResultBanner.css';

interface ResultBannerProps {
  outcome: 'success' | 'failure';
  total?: number;
  difficulty?: number;
  id?: string;
}

export function ResultBanner({ outcome, total, difficulty, id }: ResultBannerProps) {
  const wordClass = [bannerWord, outcome === 'success' ? bannerWordSuccess : bannerWordFailure].join(' ');
  return (
    <div id={id} className={bannerRecipe({ outcome })} role="status" aria-live="assertive">
      <div className={wordClass}>{outcome === 'success' ? 'SUCCESS' : 'FAILURE'}</div>
      {total !== undefined && difficulty !== undefined && (
        <div className={bannerDetail}>Total {total} vs Difficulty {difficulty}</div>
      )}
    </div>
  );
}
