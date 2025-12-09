/**
 * rules
 *
 * Philosophical:
 * The Codex. A static repository of the game's laws. It holds the definitions
 * of "Effort", "Strikes", and "Roles" that govern the players' interactions.
 *
 * Technical:
 * Exports static data structures defining the core rules text and mechanics explanations.
 */
export interface Effort {
  level: number;
  title: string;
  description: string;
  mechanic: string;
}

export const effortScale: Effort[] = [
  {
    level: 1,
    title: 'Controlled Effort',
    description: 'Safe and effective.',
    mechanic:
      'You kept your cool. You narrate the outcome (Success or Failure) exactly how you want it. You look capable, or your failure is tragic and noble.',
  },
  {
    level: 2,
    title: 'Pushing It',
    description: 'Effort with minor costs.',
    mechanic:
      'You exerted yourself. You narrate the core outcome. The other players suggest 2-3 potential "costs" (scratches, noise, lost time). You choose one to include.',
  },
  {
    level: 3,
    title: 'Overexertion',
    description: 'Guaranteed sacrifice.',
    mechanic:
      "You pushed too hard. Whether you Succeeded or Failed, the Sacrifice you agreed upon in Step 3 happens. If Success: You get what you wanted, but you pay the price. If Failure: You don't get what you wanted, and you still pay the price.",
  },
  {
    level: 4,
    title: 'Breaking Point',
    description: 'Disaster strikes.',
    mechanic:
      'You lost control. The Agreed Sacrifice happens, AND it gets worse. The other players suggest "The Twist"—a new, horrible piece of information or immediate danger. You choose which Twist becomes true. (This counts as a Strike).',
  },
];

export const basicRules = {
  d13: {
    title: 'The d13',
    description:
      'Roll a d10 (0-9) and a d4 (1-4). Add them together for a result between 1 and 13.',
    note: 'd10 is the Main Die. d4 is the Effort Die.',
  },
  gameLoop: [
    {
      step: '1. The Setup',
      description: 'Reveal a Threat Card. The Active Player answers the prompt based on the suit.',
    },
    {
      step: '2. The Conversation',
      description:
        'Focus the Camera (ask sensory questions) and Escalate ("Something\'s not right...").',
    },
    {
      step: '3. The Stakes',
      description: 'Define the Sacrifice of failure (Overexertion).',
    },
    {
      step: '4. The Resolution',
      description:
        'Roll d13. Compare Total vs Threat Number for Success/Failure. Check d4 for Effort.',
    },
  ],
  strikes: {
    title: 'Three Strikes',
    triggers: [
      'Fail any Test against the Killer.',
      'Roll a 4 (The Twist) on the Effort Scale (Success or Failure).',
    ],
    consequence: 'On the 3rd Strike, the character dies.',
  },
  genrePoints: {
    title: 'Genre Points',
    description:
      'Spend 1 GP to reroll the entire d13 and add +1 to the Main Die. You must accept the new result.',
  },
  deckRules: {
    title: 'The Decks',
    threat: {
      title: 'Threat Deck',
      setup: 'Shuffle 2s, 3s, 4s, and one Jack. Place 4 Aces face up on top.',
      mechanic: 'Top card is the current Threat. If face down, reveal it.',
    },
    reserves: {
      title: 'Reserves',
      piles: [
        'Number Reserve: 5s-10s',
        'Face Card Reserves: Jacks, Queens, Kings',
        'Jokers: Kept separate',
      ],
    },
    trophy: {
      title: 'Trophy Pile',
      setup: 'Start with a random 10 from Number Reserve.',
      mechanic: 'Top card sets Base Difficulty for Tests against the Killer.',
    },
  },
  deckUpdates: {
    title: 'Updating the Game State',
    numberCards: {
      title: 'Number Cards',
      success:
        'Remove Threat Card to Trophy Pile (new Base Difficulty). Add next Number Reserve card to bottom of Threat Deck.',
      failure:
        'Threat Card goes to bottom of Threat Deck. Add next Number Reserve card to bottom of Threat Deck.',
    },
    faceCards: {
      title: 'Face Cards (The Killer)',
      success:
        'Based on Effort (d4): 1-2 adds a Jack, 3-4 adds a Queen. (If Reserve empty: Jack->Queen->King->None). First time defeating a suit removes it (Weakness Found). If already defeated, it stays in deck. Shuffle Threat Deck & Trophy Pile after any confrontation.',
      failure:
        'Gain a Strike. Add a King to bottom of Threat Deck. Shuffle Threat Deck & Trophy Pile after any confrontation.',
    },
  },
  endgame: {
    title: 'Act 3: The Finale',
    trigger: 'Defeat a Face Card of all 4 suits (Triggers Act 3).',
    setup: 'Remove all Number Cards. Shuffle in both Jokers.',
    redJoker: {
      title: 'Red Joker (The End)',
      effect: 'The Final Test. Shuffle Trophy Pile; Difficulty = Top of Trophy Pile.',
      success: 'Survivors Win.',
      failure: 'Character Dies. Joker reshuffled.',
    },
    blackJoker: {
      title: 'Black Joker (The Twist)',
      effect: 'One last desperate attempt. Difficulty = Top of Trophy Pile.',
      success: 'Remove highest Face Card.',
      failure: 'Add another King.',
    },
  },
};

export const characterRules = {
  creationSteps: [
    'Choose a Name.',
    'Come up with a clear Archetype.',
    'Think of a reason "Why are you here?".',
    'Select an Aptitude (Power, Resolve, Intellect or Finesse).',
  ],
  aptitudes: {
    description:
      "Your Aptitude represents your character's natural strengths. When doing a Test matching your Aptitude’s suit, you can modify your Effort Die (d4) by +1 or -1. Increase (+1) to push for Success (higher Total) at greater risk. Decrease (-1) to play it safe (lower Effort) but risk Failure (lower Total).",
    list: [
      { suit: 'Spades', name: 'Power', description: 'Physical threat' },
      { suit: 'Hearts', name: 'Resolve', description: 'Fear/Paranoia' },
      { suit: 'Clubs', name: 'Intellect', description: 'The Truth' },
      { suit: 'Diamonds', name: 'Finesse', description: 'Mistakes/Social' },
    ],
  },
  archetypes: [
    {
      suit: 'Spades',
      aptitude: 'Power',
      examples: [
        'The Jock',
        'The Protective',
        'The Townie',
        'The Greaser',
        'The Sheriff',
        'The Father',
        'The Rival',
      ],
    },
    {
      suit: 'Hearts',
      aptitude: 'Resolve',
      examples: [
        'The Final Them',
        'The Babysitter',
        'The Pure',
        'The Sibling',
        'The Atoner',
        'The New Kid',
        'The Sheriff’s Child',
      ],
    },
    {
      suit: 'Clubs',
      aptitude: 'Intellect',
      examples: [
        'The Genre Savant',
        'The Reporter',
        'The Skeptic',
        'The Loner',
        'The Bookworm',
        'The Techie',
        'The Conspiracy Nut',
      ],
    },
    {
      suit: 'Diamonds',
      aptitude: 'Finesse',
      examples: [
        'The Rebel',
        'The Class Clown',
        'The Royal Bee',
        'The Thief',
        'The Rich Kid',
        'The Cheerleader',
        'The Slacker',
      ],
    },
  ],
};
