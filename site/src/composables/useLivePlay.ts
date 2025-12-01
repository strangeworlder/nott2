import { ref, computed } from 'vue'
import { effortScale, faceCardPrompts, faceCardPrompt, fullPromptMatrix } from '../data/rules'
import type { Card as GameCard, Suit, Rank } from './useGameEngine'

// Shared state (singleton if we want state to persist across component mounts, 
// or we can export a function that creates new state. 
// Given the original component had local state, but we might want to preserve it if the user navigates away and back,
// let's keep it local to the composable instance for now, but if the user wants global state we can move it out.
// The original component had "Local State for Physical Play". 
// Let's make it a singleton so state is preserved if the component is unmounted/remounted, 
// which is often desired in a "Helper" tool.
// Actually, let's follow the pattern of `useGameEngine` which seems to use global state.
// But wait, `useGameEngine` in the file I saw had global state defined OUTSIDE the function.
// `LivePlayHelper.vue` was using its own local state.
// I will replicate the local state behavior by creating the state inside the function, 
// BUT if the user wants it to be a singleton, I should define it outside.
// For a "Live Play Helper", it's likely the user wants to keep state if they accidentally navigate away.
// However, to be safe and strictly follow the refactor, I will return a NEW state each time 
// UNLESS I see a reason to make it global. 
// The prompt says "externalize logic that can be externalized".
// I'll stick to the factory pattern (state inside function) to match the original component's lifecycle, 
// unless I see `useGameEngine` is being used as a singleton.
// `useGameEngine.ts` has `const threatDeck = ref<Card[]>([])` OUTSIDE the function.
// So `useGameEngine` IS a singleton.
// `LivePlayHelper.vue` was NOT using `useGameEngine`'s state, it was defining its own:
// `const currentCard = ref<GameCard | null>(null)`
// `const strikes = ref(0)`
// ...
// So `LivePlayHelper` was independent.
// I will create `useLivePlay` to manage this specific state. 
// I will make it a singleton to be helpful (preserving state is usually good), 
// but provide a `reset` function.

const currentCard = ref<GameCard | null>(null)
const strikes = ref(0)
const weaknessesFound = ref<Suit[]>([])
const isEndgame = ref(false)

// Manual Input State
const manualSuit = ref<Suit>('Spades')
const manualRank = ref<Rank>(1)
const manualJoker = ref<'Red' | 'Black' | null>(null)

// Deck Tracking State
const acesRemaining = ref(4)
// Middle Stack: 2s, 3s, 4s, and 1 Jack
const middleStack = ref<Record<number, number>>({ 2: 4, 3: 4, 4: 4, 11: 1 })
// Bottom Stack: Reserves (5-10) + Returned Cards + Added Face Cards
const bottomStack = ref<Record<number, number>>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
    11: 0, 12: 0, 13: 0
})
// Reserve Queue: The ordered list of cards waiting to be added to the Bottom Stack
const reserveQueue = ref<number[]>([
    5, 5, 5, 5,
    6, 6, 6, 6,
    7, 7, 7, 7,
    8, 8, 8, 8,
    9, 9, 9, 9,
    10, 10, 10
])

const drawnCards = ref<Set<string>>(new Set())
const trophyPile = ref<GameCard[]>([])
const trophyTop = ref<GameCard | null>(null)
const isTrophyTopRandomized = ref(true)

// UI State that is tightly coupled to game flow
const currentStep = ref(1)
const selectedJoker = ref<'Red' | 'Black' | null>(null)
const sacrificeConfirmed = ref(false)
const rollMain = ref<number | null>(null)
const rollEffort = ref<number | null>(null)
const targetDifficulty = ref<number | null>(null)
const manualOverride = ref(false)
const debugMode = ref(true)

export function useLivePlay() {

    // Computed Helpers
    const selectedSuit = computed(() => currentCard.value?.suit || null)
    const selectedRank = computed(() => currentCard.value?.rank || null)
    const isFaceCard = computed(() => (selectedRank.value || 0) > 10)
    const isFirstTime = computed(() => {
        if (!selectedSuit.value || !isFaceCard.value) return true
        return !weaknessesFound.value.includes(selectedSuit.value)
    })

    const isMiddleStackEmpty = computed(() => {
        return Object.values(middleStack.value).every(count => count === 0)
    })

    const cardName = computed(() => {
        if (selectedJoker.value) return `${selectedJoker.value} Joker`
        if (!currentCard.value) return 'Unknown Card'
        const rankName = getRankName(currentCard.value.rank)
        return `${rankName} of ${currentCard.value.suit}`
    })

    const getRankName = (rank: number) => {
        if (rank === 1) return 'Ace'
        if (rank === 11) return 'Jack'
        if (rank === 12) return 'Queen'
        if (rank === 13) return 'King'
        return rank.toString()
    }

    const currentPrompt = computed(() => {
        if (selectedJoker.value === 'Red') return "THE FINAL TEST. The Killer has you dead to rights. How do you escape death?"
        if (selectedJoker.value === 'Black') return "THE TWIST. One last desperate attempt. What do you sacrifice to survive?"

        const card = currentCard.value
        if (!card) return null

        if (isFaceCard.value) {
            const faceData = faceCardPrompts.find(s => s.suit === card.suit)
            if (!faceData) return null

            if (card.rank === 11) return `${faceCardPrompt} ${isFirstTime.value ? faceData.jack.firstTime : faceData.jack.recurring}`
            if (card.rank === 12) return `${faceCardPrompt} ${isFirstTime.value ? faceData.queen.firstTime : faceData.queen.recurring}`
            if (card.rank === 13) return `${faceCardPrompt} ${isFirstTime.value ? faceData.king.firstTime : faceData.king.recurring}`

            return faceCardPrompt
        }

        const suitData = fullPromptMatrix.find(s => s.suit === card.suit)
        return suitData?.prompts.find(p => p.rank === card.rank)?.prompt
    })

    const rollTotal = computed(() => {
        if (rollMain.value === null || rollEffort.value === null) return 0
        return rollMain.value + rollEffort.value
    })

    const isSuccess = computed(() => {
        if (rollMain.value === null || rollEffort.value === null) return false

        const total = rollMain.value + rollEffort.value

        if (isFaceCard.value || selectedJoker.value) {
            if (targetDifficulty.value === null) return false
            return total >= targetDifficulty.value
        } else {
            if (selectedRank.value === null) return false
            return total >= selectedRank.value
        }
    })

    const effortResult = computed(() => {
        if (!rollEffort.value) return null
        return effortScale.find(f => f.level === rollEffort.value)
    })

    const availableTrophyRanks = computed(() => {
        const ranks = trophyPile.value.map(c => c.rank)
        return [...new Set(ranks)].sort((a, b) => b - a)
    })

    // Methods
    const isRankAvailable = (rank: Rank) => {
        if (acesRemaining.value > 0) {
            return rank === 1
        }
        if (!isMiddleStackEmpty.value) {
            return middleStack.value[rank] > 0
        }
        return bottomStack.value[rank] > 0
    }

    const isSuitAvailable = (rank: Rank, suit: Suit) => {
        if (drawnCards.value.has(`${rank}-${suit}`)) return false
        return true
    }

    const updateDeckState = (rank: Rank, suit: Suit, action: 'draw' | 'add' | 'return') => {
        const cardId = `${rank}-${suit}`

        if (action === 'draw') {
            drawnCards.value.add(cardId)

            if (rank === 1) {
                acesRemaining.value--
            } else if (middleStack.value[rank] > 0) {
                middleStack.value[rank]--
            } else {
                bottomStack.value[rank]--
            }
        } else if (action === 'add') {
            if (rank >= 11 && rank <= 13) bottomStack.value[rank]++
        } else if (action === 'return') {
            drawnCards.value.delete(cardId)

            if (rank === 1) {
                bottomStack.value[rank]++
            }
            else if (!isMiddleStackEmpty.value && ((rank >= 2 && rank <= 4) || rank === 11)) {
                middleStack.value[rank]++
            }
            else {
                bottomStack.value[rank]++
            }
        }
    }

    const addNextReserve = () => {
        const nextRank = reserveQueue.value.shift()
        if (nextRank) {
            bottomStack.value[nextRank]++
        }
    }

    const shuffleThreatDeck = () => {
        for (const rank in middleStack.value) {
            const r = Number(rank)
            bottomStack.value[r] += middleStack.value[r]
            middleStack.value[r] = 0
        }
    }

    const shuffleTrophyPile = () => {
        if (trophyPile.value.length === 0) return
        const randomIndex = Math.floor(Math.random() * trophyPile.value.length)
        trophyTop.value = trophyPile.value[randomIndex]
        isTrophyTopRandomized.value = true
    }

    const setManualCard = () => {
        if (manualJoker.value) {
            selectedJoker.value = manualJoker.value
            currentCard.value = null
        } else {
            selectedJoker.value = null
            currentCard.value = {
                id: 'manual',
                suit: manualSuit.value,
                rank: manualRank.value
            }
            updateDeckState(manualRank.value, manualSuit.value, 'draw')
        }
    }

    const setTrophyTop = (rank: number) => {
        const card = trophyPile.value.find(c => c.rank === rank)
        if (card) {
            trophyTop.value = card
            if (isFaceCard.value) {
                let modifier = 0
                const currentRank = currentCard.value?.rank || 0
                if (currentRank === 11) modifier = 1
                if (currentRank === 12) modifier = 2
                if (currentRank === 13) modifier = 3
                targetDifficulty.value = card.rank + modifier
            } else {
                targetDifficulty.value = card.rank
            }
        }
    }

    const reset = () => {
        currentStep.value = 1
        selectedJoker.value = null
        sacrificeConfirmed.value = false
        rollMain.value = null
        rollEffort.value = null
        targetDifficulty.value = null
    }

    const fullReset = () => {
        strikes.value = 0
        weaknessesFound.value = []
        isEndgame.value = false
        acesRemaining.value = 4
        middleStack.value = { 2: 4, 3: 4, 4: 4, 11: 1 }
        bottomStack.value = {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
            11: 0, 12: 0, 13: 0
        }
        reserveQueue.value = [
            5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10
        ]
        drawnCards.value = new Set()
        trophyPile.value = []
        trophyTop.value = null
        reset()
    }

    const startGame = () => {
        strikes.value = 0
        weaknessesFound.value = []
        acesRemaining.value = 4
        middleStack.value = { 2: 4, 3: 4, 4: 4, 11: 1 }
        bottomStack.value = {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
            11: 0, 12: 0, 13: 0
        }
        reserveQueue.value = [
            5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10
        ]
        drawnCards.value = new Set()

        const initialTrophy: GameCard = { id: 'initial-trophy', suit: 'Unknown', rank: 10 }
        trophyPile.value = [initialTrophy]
        trophyTop.value = initialTrophy
        isTrophyTopRandomized.value = true

        currentStep.value = 2
    }

    const revealHiddenTen = () => {
        const unknownTen = trophyPile.value.find(c => c.rank === 10 && c.suit === 'Unknown')
        if (!unknownTen) return

        const knownTens = trophyPile.value.filter(c => c.rank === 10 && c.suit !== 'Unknown')
        const knownSuits = new Set(knownTens.map(c => c.suit))

        if (knownSuits.size === 3) {
            const allSuits: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds']
            const missingSuit = allSuits.find(s => !knownSuits.has(s))
            if (missingSuit) {
                unknownTen.suit = missingSuit
            }
        }
    }

    const applyGameStateUpdates = () => {
        if (isSuccess.value) {
            if (isFaceCard.value) {
                if (isFirstTime.value) {
                    if (currentCard.value) {
                        weaknessesFound.value.push(currentCard.value.suit)
                        if (weaknessesFound.value.length === 4) {
                            isEndgame.value = true
                        }
                    }
                } else {
                    if (currentCard.value) updateDeckState(currentCard.value.rank, currentCard.value.suit, 'return')
                }

                if (rollEffort.value && rollEffort.value <= 2) {
                    updateDeckState(11, 'Spades', 'add')
                } else if (rollEffort.value && rollEffort.value >= 3) {
                    updateDeckState(12, 'Spades', 'add')
                }

                shuffleThreatDeck()
                shuffleTrophyPile()
            } else {
                if (!isEndgame.value) addNextReserve()
                if (currentCard.value) {
                    trophyPile.value.push(currentCard.value)
                    revealHiddenTen()
                    trophyTop.value = currentCard.value
                    isTrophyTopRandomized.value = false
                }
            }
        } else {
            if (isFaceCard.value) {
                strikes.value++
                updateDeckState(13, 'Spades', 'add')
                if (currentCard.value) updateDeckState(currentCard.value.rank, currentCard.value.suit, 'return')

                shuffleThreatDeck()
                shuffleTrophyPile()
            } else {
                if (currentCard.value) updateDeckState(currentCard.value.rank, currentCard.value.suit, 'return')
                if (!isEndgame.value) addNextReserve()
            }
        }
    }

    const startNextScene = () => {
        applyGameStateUpdates()
        currentCard.value = null
        selectedJoker.value = null
        manualJoker.value = null
        manualSuit.value = 'Spades'
        manualRank.value = acesRemaining.value > 0 ? 1 : 2
        currentStep.value = 2
        sacrificeConfirmed.value = false
        rollMain.value = null
        rollEffort.value = null
        targetDifficulty.value = null
    }

    return {
        // State
        currentCard,
        strikes,
        weaknessesFound,
        isEndgame,
        manualSuit,
        manualRank,
        manualJoker,
        acesRemaining,
        middleStack,
        bottomStack,
        reserveQueue,
        drawnCards,
        trophyPile,
        trophyTop,
        isTrophyTopRandomized,
        currentStep,
        selectedJoker,
        sacrificeConfirmed,
        rollMain,
        rollEffort,
        targetDifficulty,
        manualOverride,
        debugMode,

        // Computed
        selectedSuit,
        selectedRank,
        isFaceCard,
        isFirstTime,
        cardName,
        currentPrompt,
        rollTotal,
        isSuccess,
        effortResult,
        availableTrophyRanks,
        isMiddleStackEmpty,

        // Methods
        isRankAvailable,
        isSuitAvailable,
        updateDeckState,
        addNextReserve,
        shuffleThreatDeck,
        shuffleTrophyPile,
        setManualCard,
        setTrophyTop,
        reset,
        fullReset,
        startGame,
        applyGameStateUpdates,
        startNextScene,
        getRankName
    }
}
