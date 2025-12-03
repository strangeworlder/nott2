import { marked } from 'marked'
import type { Suit } from '../composables/useGameEngine'
import promptsData from './default/prompts.json'

export type PromptDefinition =
    | string
    | { firstTime: string, recurring: string }

export interface SuitData {
    suit: string
    theme?: string
    prompts: Record<number | string, PromptDefinition>
}

export interface CardPromptSet {
    faceCardPrefix: string;
    suits: SuitData[];
}

export const cardPrompts: CardPromptSet = promptsData as unknown as CardPromptSet



export function getScenePrompt(
    card: { rank: number, suit: Suit } | null,
    selectedJoker: 'Red' | 'Black' | null,
    isFirstTime: boolean
): string | null {
    if (selectedJoker) {
        const jokerSuit = cardPrompts.suits.find(s => s.suit === 'Joker')
        if (!jokerSuit) return null
        const prompt = jokerSuit.prompts[selectedJoker] as string
        return prompt ? marked.parse(prompt) as string : null
    }

    if (!card) return null

    const suitData = cardPrompts.suits.find(s => s.suit === card.suit)
    if (!suitData) return null

    const promptDef = suitData.prompts[card.rank]
    if (!promptDef) return null

    if (typeof promptDef === 'string') {
        return marked.parse(promptDef) as string
    } else {
        // Face Card
        const specificPrompt = isFirstTime ? promptDef.firstTime : promptDef.recurring
        return marked.parse(`${cardPrompts.faceCardPrefix} ${specificPrompt}`) as string
    }
}
