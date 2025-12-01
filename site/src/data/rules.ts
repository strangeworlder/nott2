export interface CardPrompt {
    rank: number;
    prompt: string;
}

export interface SuitPrompts {
    suit: string;
    theme: string;
    prompts: CardPrompt[];
}

export const fullPromptMatrix: SuitPrompts[] = [
    {
        suit: 'Spades',
        theme: 'Power (Physical threat)',
        prompts: [
            { rank: 1, prompt: 'ESTABLISHING SHOT. We see you handling a physical task with ease. What is it?' },
            { rank: 2, prompt: 'A heavy door slams shut behind you. What mechanism locks it?' },
            { rank: 3, prompt: 'The path is blocked by debris. What makes it too heavy to move alone?' },
            { rank: 4, prompt: 'You are forced to squeeze through a tight space. What scratches you?' },
            { rank: 5, prompt: 'A structure collapses nearby. What path does it cut off?' },
            { rank: 6, prompt: 'Something grabs your ankle. How do you shake it loose, and what mark does it leave?' },
            { rank: 7, prompt: 'You are thrown against a wall. What breaks?' },
            { rank: 8, prompt: 'A trap triggers. What physical pain do you suffer immediately?' },
            { rank: 9, prompt: 'You are pinned down. What weight is crushing you?' },
            { rank: 10, prompt: 'The environment itself attacks. How does the room try to kill you?' },
        ],
    },
    {
        suit: 'Hearts',
        theme: 'Resolve (Fear/Paranoia)',
        prompts: [
            { rank: 1, prompt: 'ESTABLISHING SHOT. We see you caring for someone or something. Who is it?' },
            { rank: 2, prompt: 'The lights flicker. What shadow moves when it shouldn\'t?' },
            { rank: 3, prompt: 'You hear a familiar voice. Who is it, and why can\'t they be here?' },
            { rank: 4, prompt: 'You find a personal item belonging to a victim. Why does it terrify you?' },
            { rank: 5, prompt: 'You feel watched. Where is the gaze coming from?' },
            { rank: 6, prompt: 'You are separated from the group for a moment. What whispers to you?' },
            { rank: 7, prompt: 'You see something impossible. Why do you doubt your own sanity?' },
            { rank: 8, prompt: 'A friend acts strangely. Why do you suddenly fear them?' },
            { rank: 9, prompt: 'You are paralyzed by a memory. What trauma resurfaces?' },
            { rank: 10, prompt: 'You realize you are alone, even if others are here. Why does no one help you?' },
        ],
    },
    {
        suit: 'Clubs',
        theme: 'Intellect (The Truth)',
        prompts: [
            { rank: 1, prompt: 'ESTABLISHING SHOT. We see you preparing for what\'s to come. What supply or exit are you checking?' },
            { rank: 2, prompt: 'You find a note. What cryptic warning does it give?' },
            { rank: 3, prompt: 'A device is broken. What part is missing?' },
            { rank: 4, prompt: 'You recognize a symbol. What dark history does it represent?' },
            { rank: 5, prompt: 'You find a map. What location is circled in blood?' },
            { rank: 6, prompt: 'You realize the plan is flawed. What critical detail did you miss?' },
            { rank: 7, prompt: 'You find a corpse. What clue reveals how they died?' },
            { rank: 8, prompt: 'A puzzle blocks the way. What terrible price must be paid to solve it?' },
            { rank: 9, prompt: 'You uncover a secret about the Killer. Why does it make things worse?' },
            { rank: 10, prompt: 'The truth is revealed. Why is there no escape?' },
        ],
    },
    {
        suit: 'Diamonds',
        theme: 'Finesse (Mistakes/Social)',
        prompts: [
            { rank: 1, prompt: 'ESTABLISHING SHOT. We see you at the center of attention. What are you saying or doing?' },
            { rank: 2, prompt: 'You trip over something. What noise echoes too loudly?' },
            { rank: 3, prompt: 'You drop a crucial item. Where does it fall?' },
            { rank: 4, prompt: 'You say the wrong thing. Who looks at you with suspicion?' },
            { rank: 5, prompt: 'You hesitate. What opportunity slips away?' },
            { rank: 6, prompt: 'Your hand slips. What do you accidentally activate?' },
            { rank: 7, prompt: 'You try to be quiet, but fail. What gives you away?' },
            { rank: 8, prompt: 'Your ego leads you into danger. What warning did you ignore?' },
            { rank: 9, prompt: 'You try to save someone, but make it worse. How?' },
            { rank: 10, prompt: 'You make a fatal mistake. Who pays the price for your error?' },
        ],
    },
];

export const faceCardPrompt = "The Killer is here. How do they corner you, and what makes them look unstoppable?";

export interface FaceCardPromptDetails {
    firstTime: string;
    recurring: string;
}

export interface SuitFacePrompts {
    suit: string;
    jack: FaceCardPromptDetails;
    queen: FaceCardPromptDetails;
    king: FaceCardPromptDetails;
}

export const faceCardPrompts: SuitFacePrompts[] = [
    {
        suit: 'Spades', // Power
        jack: { // Superficial
            firstTime: 'What is the first thing you notice about their silhouette?',
            recurring: 'How does that silhouette loom over you right now?'
        },
        queen: { // In-between
            firstTime: 'What weapon are they dragging or carrying?',
            recurring: 'How do they use that weapon to block your path?'
        },
        king: { // Disturbing
            firstTime: 'What wound should have killed them, but didn\'t?',
            recurring: 'How does that wound look even worse now?'
        }
    },
    {
        suit: 'Hearts', // Resolve
        jack: { // Superficial
            firstTime: 'What is wrong with their face (or mask)?',
            recurring: 'How does that face stare at you?'
        },
        queen: { // In-between
            firstTime: 'What sound do they make that isn\'t human?',
            recurring: 'How close is that sound now?'
        },
        king: { // Disturbing
            firstTime: 'What part of their body is moving wrong?',
            recurring: 'How does it twist or snap as they move?'
        }
    },
    {
        suit: 'Clubs', // Intellect
        jack: { // Superficial
            firstTime: 'What are they wearing that looks out of place?',
            recurring: 'How is that clothing stained or torn?'
        },
        queen: { // In-between
            firstTime: 'How do they know exactly where you are hiding?',
            recurring: 'What gave you away this time?'
        },
        king: { // Disturbing
            firstTime: 'They speak. What do they say that reveals they know your secrets?',
            recurring: 'Why does that voice paralyze you?'
        }
    },
    {
        suit: 'Diamonds', // Finesse
        jack: { // Superficial
            firstTime: 'How do they move silently?',
            recurring: 'Why didn\'t you hear them approach?'
        },
        queen: { // In-between
            firstTime: 'They are toying with you. What do they do to show they are in control?',
            recurring: 'How do they humiliate you before striking?'
        },
        king: { // Disturbing
            firstTime: 'They appear where they shouldn\'t be. How did they get there?',
            recurring: 'Why is there no escape?'
        }
    }
];

export interface Fallout {
    level: number;
    title: string;
    description: string;
    mechanic: string;
}

export const falloutScale: Fallout[] = [
    {
        level: 1,
        title: 'Controlled Effort',
        description: 'Safe and effective.',
        mechanic: 'You kept your cool. You narrate the outcome (Success or Failure) exactly how you want it. You look capable, or your failure is tragic and noble.',
    },
    {
        level: 2,
        title: 'Pushing It',
        description: 'Effort with minor costs.',
        mechanic: 'You exerted yourself. You narrate the core outcome. The other players suggest 2-3 potential "costs" (scratches, noise, lost time). You choose one to include.',
    },
    {
        level: 3,
        title: 'Overexertion',
        description: 'Guaranteed consequence.',
        mechanic: 'You pushed too hard. Whether you Succeeded or Failed, the Consequence you agreed upon in Step 3 happens. If Success: You get what you wanted, but the bad thing happens. If Failure: You don\'t get what you wanted, and the bad thing happens.',
    },
    {
        level: 4,
        title: 'Breaking Point',
        description: 'Disaster strikes.',
        mechanic: 'You lost control. The Agreed Consequence happens, AND it gets worse. The other players suggest "The Twist"—a new, horrible piece of information or immediate danger. You choose which Twist becomes true. (This counts as a Strike).',
    },
];

export const basicRules = {
    d13: {
        title: 'The d13',
        description: 'Roll a d10 (0-9) and a d4 (1-4). Add them together for a result between 1 and 13.',
        note: 'd10 is the Main Die. d4 is the Fallout Die.',
    },
    gameLoop: [
        {
            step: '1. The Setup',
            description: 'Reveal a Threat Card. The Active Player answers the prompt based on the suit.',
        },
        {
            step: '2. The Conversation',
            description: 'Focus the Camera (ask sensory questions) and Escalate ("Something\'s not right...").',
        },
        {
            step: '3. The Stakes',
            description: 'Define the Consequence of failure (Overexertion).',
        },
        {
            step: '4. The Resolution',
            description: 'Roll d13. Compare Total vs Threat Number for Success/Failure. Check d4 for Fallout.',
        },
    ],
    strikes: {
        title: 'Three Strikes',
        triggers: [
            'Fail any Test against the Killer.',
            'Roll a 4 (The Twist) on the Fallout Scale (Success or Failure).',
        ],
        consequence: 'On the 3rd Strike, the character dies.',
    },
    genrePoints: {
        title: 'Genre Points',
        description: 'Spend 1 GP to reroll the entire d13 and add +1 to the Main Die. You must accept the new result.',
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
            success: 'Remove Threat Card to Trophy Pile (new Base Difficulty). Add next Number Reserve card to bottom of Threat Deck.',
            failure: 'Threat Card goes to bottom of Threat Deck. Add next Number Reserve card to bottom of Threat Deck.',
        },
        faceCards: {
            title: 'Face Cards (The Killer)',
            success: 'Based on Fallout (d4): 1-2 adds a Jack, 3-4 adds a Queen. (If Reserve empty: Jack->Queen->King->None). First time defeating a suit removes it (Weakness Found). If already defeated, it stays in deck. Shuffle Threat Deck & Trophy Pile after any confrontation.',
            failure: 'Gain a Strike. Add a King to bottom of Threat Deck. Shuffle Threat Deck & Trophy Pile after any confrontation.',
        },
    },
    endgame: {
        title: 'The Endgame',
        trigger: 'Defeat a Face Card of all 4 suits.',
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
        description: 'Your Aptitude represents your character\'s natural strengths. When doing a Test matching your Aptitude’s suit, you can modify your Fallout Die (d4) by +1 or -1. Increase (+1) to push for Success (higher Total) at greater risk. Decrease (-1) to play it safe (lower Fallout) but risk Failure (lower Total).',
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
            examples: ['The Jock', 'The Protective', 'The Townie', 'The Greaser', 'The Sheriff', 'The Father', 'The Rival'],
        },
        {
            suit: 'Hearts',
            aptitude: 'Resolve',
            examples: ['The Final Them', 'The Babysitter', 'The Pure', 'The Sibling', 'The Atoner', 'The New Kid', 'The Sheriff’s Child'],
        },
        {
            suit: 'Clubs',
            aptitude: 'Intellect',
            examples: ['The Genre Savant', 'The Reporter', 'The Skeptic', 'The Loner', 'The Bookworm', 'The Techie', 'The Conspiracy Nut'],
        },
        {
            suit: 'Diamonds',
            aptitude: 'Finesse',
            examples: ['The Rebel', 'The Class Clown', 'The Royal Bee', 'The Thief', 'The Rich Kid', 'The Cheerleader', 'The Slacker'],
        },
    ],
};
