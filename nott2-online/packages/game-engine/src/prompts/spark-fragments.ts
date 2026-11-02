/**
 * @nott2/game-engine — Evocative Word Pools & Camera Questions
 *
 * Organized into four thematic axes:
 *   1. Universal / Playset (`default` Generic Slasher vs. `summercamp` Summer Camp Massacre)
 *   2. Suit (`Spades`, `Hearts`, `Clubs`, `Diamonds`)
 *   3. Act (`1`, `2`, `3`)
 *   4. Rank Group (`ace`, `low` 2–4, `mid` 5–7, `high` 8–10, `face` 11–13, `joker`)
 *
 * Provides two distinct word-bank flavors:
 *   - `activePlayerWords`: Abstract concepts + visceral nouns/verbs ("meat", "wound",
 *     "electronics", "clanking", "leverage", "paranoia", "alibi", "splinter") to spark
 *     the Active Player's narration.
 *   - `cameraCrewWords`: Sensory/atmospheric words ("dripping", "copper", "flicker",
 *     "rot", "echo", "shadow", "humid", "scraping") to spark the Camera Crew's framing,
 *     paired with the Act's official "Focus the Camera" questions from `NotT_2.md`.
 */

import type { Suit, Act, Rank, EffortLevel } from '../types';

export type RankGroup = 'ace' | 'low' | 'mid' | 'high' | 'face' | 'joker';

export interface RoleWordBucket {
  readonly activePlayer: readonly string[];
  readonly cameraCrew: readonly string[];
}

export interface CombinedFragmentPool {
  /** Merged & deduplicated 9-word-draw pool for the Active Player */
  readonly activePlayerWords: readonly string[];
  /** Merged & deduplicated 9-word-draw pool for the Camera Crew */
  readonly cameraCrewWords: readonly string[];
  /** Official Act-specific "Focus the Camera" questions from NotT_2.md */
  readonly cameraQuestions: readonly string[];
  /** Legacy aliases for backward compatibility */
  readonly wordPool: readonly string[];
  readonly sensoryPool: readonly string[];
}

// ── Official "Focus the Camera" Questions (NotT_2.md Phase 2 Step 2) ─────────

const FOCUS_CAMERA_QUESTIONS: Record<Act, readonly string[]> = {
  1: [
    'What does it look like?',
    'What does it smell like?',
    'How close is the Killer?',
    'Is it pitch black?',
    'How dark is it?',
  ],
  2: [
    'What sound makes you freeze?',
    'Where is the blood coming from?',
    'Who is watching you?',
  ],
  3: [
    'Why is there no hope?',
    'What part of your body hurts the most?',
    'How do you know you’re going to die?',
  ],
};

export function getFocusCameraQuestions(act: Act): readonly string[] {
  return FOCUS_CAMERA_QUESTIONS[act] ?? FOCUS_CAMERA_QUESTIONS[1];
}

// ── 1. Universal / Playset Word Pools ────────────────────────────────────────

const UNIVERSAL_DEFAULT: RoleWordBucket = {
  activePlayer: [
    'Threshold',
    'Electronics',
    'Clanking',
    'Meat',
    'Wound',
    'Latch',
    'Basement',
    'Deadbolt',
    'Splinter',
    'Friction',
    'Alibi',
    'Baggage',
    'Hardware',
    'Glass',
    'Impulse',
    'Tension',
    'Shortcut',
    'Machinery',
    'Locked',
    'Keyring',
    'Bravado',
    'Hesitation',
    'Cord',
    'Stairwell',
    'Ventilation',
    'Concrete',
    'Porcelain',
    'Plaster',
    'Cellar',
    'Fuse',
  ],
  cameraCrew: [
    'Flicker',
    'Dripping',
    'Copper',
    'Rot',
    'Echo',
    'Shadow',
    'Humid',
    'Scraping',
    'Silence',
    'Draft',
    'Static',
    'Condensation',
    'Silhouette',
    'Mildew',
    'Buzzing',
    'Glare',
    'Frost',
    'Footprints',
    'Claustrophobic',
    'Unseen',
    'Smoke',
    'Rust',
    'Hissing',
    'Damp',
    'Creaking',
    'Blindspot',
    'Reflection',
    'Chill',
    'Stagnant',
    'Ozone',
  ],
};

const UNIVERSAL_SUMMERCAMP: RoleWordBucket = {
  activePlayer: [
    'Timber',
    'Lantern',
    'Boathouse',
    'Generator',
    'Canoe',
    'Rope',
    'Kerosene',
    'Whistle',
    'Tackle',
    'Mud',
    'Curfew',
    'Paddle',
    'Screen-door',
    'Bunkhouse',
    'Flashlight',
    'Brush',
    'Winch',
    'Tarp',
    'Radio',
    'Firepit',
    'hatchet',
    'Poncho',
    'Pier',
    'Compass',
    'First-Aid',
    'Anchor',
    'Supply',
    'Outboard',
    'Locker',
    'Trail',
  ],
  cameraCrew: [
    'Downpour',
    'Pine',
    'Undertow',
    'Blackwater',
    'Sodden',
    'Fog',
    'Thunder',
    'Moss',
    'Lapping',
    'Muddy',
    'Mosquito',
    'Drowned',
    'Canopy',
    'Ravine',
    'Squelch',
    'Distant',
    'Woodsmoke',
    'Shivering',
    'Moonless',
    'Reeds',
    'Dripping',
    'Rotting',
    'Gust',
    'Shoreline',
    'Echoing',
    'Slick',
    'Cold',
    'Pitch-black',
    'Rustling',
    'Isolated',
  ],
};

// ── 2. Suit Word Pools ───────────────────────────────────────────────────────

const SUIT_POOLS: Record<Suit, RoleWordBucket> = {
  Spades: {
    activePlayer: [
      'Leverage',
      'Brute',
      'Barricade',
      'Collision',
      'Strain',
      'Deadweight',
      'Impact',
      'Wrench',
      'Shatter',
      'Momentum',
      'Chokehold',
      'Crush',
      'Unyielding',
      'Grit',
      'Muscle',
      'Crowbar',
      'Chain',
      'Padlock',
      'Shove',
      'Bruise',
      'Knuckles',
      'Iron',
      'Barrier',
      'Heave',
    ],
    cameraCrew: [
      'Groaning',
      'Splintering',
      'Heavy',
      'Buckling',
      'Metallic',
      'Cramped',
      'Tremor',
      'Thud',
      'Dust',
      'Jagged',
      'Rusted',
      'Towering',
      'Crunching',
      'Swollen',
      'Sweat',
      'Grinding',
      'Locked',
      'Raw',
    ],
  },
  Hearts: {
    activePlayer: [
      'Paranoia',
      'Betrayal',
      'Guilt',
      'Promises',
      'Grief',
      'Keepsake',
      'Secret',
      'Distrust',
      'Pulse',
      'Empathy',
      'Panic',
      'Memory',
      'Protective',
      'Atonement',
      'Heartbeat',
      'Tremble',
      'Confession',
      'Abandon',
      'Locket',
      'Photograph',
      'Denial',
      'Bond',
      'Nerve',
      'Instinct',
    ],
    cameraCrew: [
      'Watched',
      'Whisper',
      'Breathless',
      'Unbearable',
      'Mirror',
      'Haunted',
      'Fragile',
      'Pale',
      'Hollow',
      'Staring',
      'Eerie',
      'Voice',
      'Shiver',
      'Uncanny',
      'Looming',
      'Hushed',
      'Cold-sweat',
      'Shadowed',
    ],
  },
  Clubs: {
    activePlayer: [
      'Pattern',
      'Sabotage',
      'Evidence',
      'Mechanism',
      'Circuit',
      'Motive',
      'Calculated',
      'Cipher',
      'Blueprint',
      'Tripwire',
      'Forensic',
      'Methodical',
      'Rigged',
      'Anomaly',
      'Wiring',
      'Chemicals',
      'Journal',
      'Battery',
      'Switch',
      'Deduction',
      'Clue',
      'Lockpick',
      'Signal',
      'Archive',
    ],
    cameraCrew: [
      'Sparking',
      'Smudged',
      'Ticking',
      'Faint',
      'Humming',
      'Dimming',
      'Acrid',
      'Deliberate',
      'Scratched',
      'Yellowed',
      'Stained',
      'Ordered',
      'Surgical',
      'Blinking',
      'Taut',
      'Hidden',
      'Oily',
      'Clinical',
    ],
  },
  Diamonds: {
    activePlayer: [
      'Precarious',
      'Misstep',
      'Gambit',
      'Hairbreadth',
      'Snagged',
      'Exposed',
      'Haste',
      'Tightrope',
      'Fumble',
      'Split-second',
      'Stealth',
      'Reckless',
      'Feint',
      'Pocket',
      'Ledge',
      'Reflex',
      'Distraction',
      'Bluff',
      'Scramble',
      'Dodge',
      'Balance',
      'Sleight',
      'Escape',
      'Risk',
    ],
    cameraCrew: [
      'Creaking',
      'Slippery',
      'Wobbling',
      'Narrow',
      'Clattering',
      'Sweeping',
      'Rattling',
      'Teetering',
      'Glinting',
      'Squeaking',
      'Fragile',
      'Darting',
      'Tense',
      'Cornered',
      'Unsteady',
      'Sudden',
      'Exposed',
      'Sharp',
    ],
  },
};

// ── 3. Act Word Pools ────────────────────────────────────────────────────────

const ACT_POOLS: Record<Act, RoleWordBucket> = {
  1: {
    activePlayer: [
      'Omen',
      'Unease',
      'Curiosity',
      'Routine',
      'Skepticism',
      'Preparation',
      'Errand',
      'Habit',
      'Distraction',
      'Dismissal',
      'Caution',
      'Arrival',
    ],
    cameraCrew: [
      'Foreshadow',
      'Creeping',
      'Isolation',
      'Goosebumps',
      'Quiet',
      'Dusk',
      'Uninvited',
      'Stillness',
      'Distant',
      'Dim',
      'Chilly',
      'Overlooked',
    ],
  },
  2: {
    activePlayer: [
      'Hunted',
      'Wounded',
      'Barricade',
      'Trap',
      'Weapon',
      'Pursuit',
      'Bleed',
      'Tourniquet',
      'Panic',
      'Scramble',
      'Desperate',
      'Ambush',
    ],
    cameraCrew: [
      'Bloodtrail',
      'Carnage',
      'Relentless',
      'Stalked',
      'Crimson',
      'Frantic',
      'Metallic',
      'Shattered',
      'Pounding',
      'Visceral',
      'Cornered',
      'Viscous',
    ],
  },
  3: {
    activePlayer: [
      'Finality',
      'Last-Stand',
      'Reckoning',
      'Survival',
      'Sacrifice',
      'Defiance',
      'Adrenaline',
      'Exhaustion',
      'Endgame',
      'Vengeance',
      'Broken',
      'All-In',
    ],
    cameraCrew: [
      'Abyss',
      'Dawn',
      'Unforgiving',
      'Smoke',
      'Ashes',
      'Rubble',
      'Breathless',
      'Dying',
      'Blinding',
      'Deafening',
      'Feral',
      'Doomed',
    ],
  },
};

// ── 4. Rank Group Word Pools ─────────────────────────────────────────────────

const RANK_GROUP_POOLS: Record<RankGroup, RoleWordBucket> = {
  ace: {
    activePlayer: [
      'History',
      'Outsider',
      'Regret',
      'Oath',
      'Debt',
      'Rumor',
      'Grudge',
      'Dare',
      'Reputation',
      'Gear',
      'Nickname',
      'Flaw',
    ],
    cameraCrew: [
      'Arrival',
      'First-Impression',
      'Posture',
      'Glance',
      'Banter',
      'Distance',
      'Weather',
      'Threshold',
      'Unspoken',
      'Contrast',
      'Vibe',
      'Framing',
    ],
  },
  low: {
    activePlayer: [
      'Obstruction',
      'Delay',
      'Noise',
      'Stumble',
      'Check',
      'Search',
      'Jammed',
      'Missing',
      'Detour',
      'Doubt',
    ],
    cameraCrew: [
      'Unsettling',
      'Trace',
      'Wrongness',
      'Draft',
      'Flicker',
      'Creak',
      'Ajar',
      'Stale',
      'Faint',
      'Odd',
    ],
  },
  mid: {
    activePlayer: [
      'Escalation',
      'Sabotaged',
      'Urgency',
      'Snare',
      'Severed',
      'Discovery',
      'Containment',
      'Rupture',
      'Warning',
      'Pressure',
    ],
    cameraCrew: [
      'Closing-In',
      'Dread',
      'Wet',
      'Smeared',
      'Echo',
      'Heavy',
      'Darkening',
      'Close',
      'Fresh',
      'Suffocating',
    ],
  },
  high: {
    activePlayer: [
      'Trapped',
      'Brink',
      'Lethal',
      'Siege',
      'Cut-Off',
      'Gamble',
      'Agony',
      'Collision',
      'Collapse',
      'Shatter',
    ],
    cameraCrew: [
      'Panic',
      'Breathless',
      'Deafening',
      'Spattering',
      'Choking',
      'Blinding',
      'Merciless',
      'Immediate',
      'Searing',
      'Violent',
    ],
  },
  face: {
    activePlayer: [
      'Butcher',
      'Mask',
      'Confrontation',
      'Blade',
      'Executioner',
      'Fury',
      'Clinch',
      'Evasion',
      'Counter',
      'Survival',
    ],
    cameraCrew: [
      'Unstoppable',
      'Terror',
      'Silhouette',
      'Monstrous',
      'Predatory',
      'Towering',
      'Cold-blooded',
      'Unblinking',
      'Gleaming',
      'Inevitable',
    ],
  },
  joker: {
    activePlayer: [
      'Cataclysm',
      'Revelation',
      'Climax',
      'Twist',
      'Deliverance',
      'Fate',
      'Weakness',
      'Finish',
      'Martyr',
      'Triumph',
    ],
    cameraCrew: [
      'Nightmare',
      'Inferno',
      'Daybreak',
      'Sirens',
      'Wreckage',
      'Final-Frame',
      'Silence',
      'Aftermath',
      'Shock',
      'Blood-red',
    ],
  },
};

export function getRankGroup(rank: Rank | null, isJoker = false): RankGroup {
  if (isJoker || rank === null) return 'joker';
  if (rank === 1) return 'ace';
  if (rank <= 4) return 'low';
  if (rank <= 7) return 'mid';
  if (rank <= 10) return 'high';
  return 'face';
}

function dedupe(items: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of items) {
    const key = item.trim().toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

/**
 * Combines the matching Universal/Playset, Suit, Act, and RankGroup buckets
 * into deduplicated word pools for the Active Player and Camera Crew, plus
 * the official Act-specific "Focus the Camera" questions.
 */
export function getCombinedFragmentPool(params: {
  suit?: Suit | null;
  act?: Act;
  rank?: Rank | null;
  isJoker?: boolean;
  playsetId?: string;
}): CombinedFragmentPool {
  const { suit = null, act = 1, rank = null, isJoker = false, playsetId = 'default' } = params;
  const universal = playsetId === 'summercamp' ? UNIVERSAL_SUMMERCAMP : UNIVERSAL_DEFAULT;
  const suitBucket = suit ? SUIT_POOLS[suit] : null;
  const actBucket = ACT_POOLS[act] ?? ACT_POOLS[1];
  const rankGroup = getRankGroup(rank, isJoker);
  const rankBucket = RANK_GROUP_POOLS[rankGroup];

  const activePlayerWords = dedupe([
    ...universal.activePlayer,
    ...(suitBucket ? suitBucket.activePlayer : []),
    ...actBucket.activePlayer,
    ...rankBucket.activePlayer,
  ]);

  const cameraCrewWords = dedupe([
    ...universal.cameraCrew,
    ...(suitBucket ? suitBucket.cameraCrew : []),
    ...actBucket.cameraCrew,
    ...rankBucket.cameraCrew,
  ]);

  const cameraQuestions = getFocusCameraQuestions(act);

  return {
    activePlayerWords,
    cameraCrewWords,
    cameraQuestions,
    wordPool: activePlayerWords,
    sensoryPool: cameraCrewWords,
  };
}

// ── Post-Roll Outcome Word Pool ──────────────────────────────────────────────

const EFFORT_OUTCOME_WORDS: Record<EffortLevel, readonly string[]> = {
  controlled: [
    'Clean',
    'Composed',
    'Precision',
    'Steady',
    'Unscathed',
    'Silent',
    'Methodical',
    'Poise',
    'Deliberate',
    'Intact',
    'Grace',
    'Resolve',
  ],
  'pushing-it': [
    'Scratch',
    'Clatter',
    'Delay',
    'Flicker',
    'Tear',
    'Tremor',
    'Stumble',
    'Spill',
    'Gasp',
    'Bruise',
    'Rattle',
    'Drop',
    'Sweat',
    'Creak',
    'Static',
  ],
  overexertion: [
    'Toll',
    'Sprain',
    'Shattered',
    'Abandoned',
    'Bleeding',
    'Separated',
    'Exhausted',
    'Sacrifice',
    'Exposed',
    'Broken',
    'Limp',
    'Darkness',
    'Scar',
    'Cost',
    'Ragged',
  ],
  'breaking-point': [
    'Catastrophe',
    'Ambush',
    'Blackout',
    'Trap',
    'Corpse',
    'Fire',
    'Locked-In',
    'Scream',
    'Shatter',
    'Betrayal',
    'Surrounded',
    'Bloodbath',
    'Collapse',
    'Doom',
    'Revelation',
  ],
};

export function getOutcomeWordPool(params: {
  effortLevel: EffortLevel | null;
  suit: Suit | null;
  act: Act;
  playsetId?: string;
}): readonly string[] {
  const { effortLevel, suit, act, playsetId = 'default' } = params;
  const base = getCombinedFragmentPool({ suit, act, rank: 6, playsetId });
  const effortWords = effortLevel ? EFFORT_OUTCOME_WORDS[effortLevel] : [];
  return dedupe([...effortWords, ...base.activePlayerWords, ...base.cameraCrewWords]);
}
