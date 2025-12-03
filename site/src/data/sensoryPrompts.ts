export interface SensoryPrompt {
    act: number;
    questions: string[];
}

export const sensoryPrompts: SensoryPrompt[] = [
    {
        act: 1,
        questions: [
            "What does it smell like?",
            "How close is the Killer?",
            "Is it pitch black?"
        ]
    },
    {
        act: 2,
        questions: [
            "What sound makes you freeze?",
            "Where is the blood coming from?",
            "Who is watching you?"
        ]
    },
    {
        act: 3,
        questions: [
            "Why is there no hope?",
            "What part of your body hurts the most?",
            "How do you know you're going to die?"
        ]
    }
];
