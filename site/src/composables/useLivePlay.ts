import { ref, computed } from 'vue'
import { effortScale, faceCardPrompts, faceCardPrompt, fullPromptMatrix } from '../data/rules'
import type { Card as GameCard, Suit, Rank } from './useGameEngine'

// Shared state (singleton)
const visibleCards = ref<GameCard[]>([])
const selectedCardId = ref<string | null>(null)

const strikes = ref(0)
const weaknessesFound = ref<Suit[]>([])
const isEndgame = ref(false)
const tableGenrePoints = ref(13)
const playerGenrePoints = ref(0)

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
const isGenrePointUsed = ref(false)
const isGenrePointAwarded = ref(false)

export function useLivePlay() {

    // Computed Helpers
    const activeCard = computed(() => {
        if (selectedJoker.value) return null // Joker takes precedence in UI logic usually, but let's be careful
        if (!selectedCardId.value) return null
        return visibleCards.value.find(c => c.id === selectedCardId.value) || null
    })

    const selectedSuit = computed(() => activeCard.value?.suit || null)
    const selectedRank = computed(() => activeCard.value?.rank || null)
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
        if (!activeCard.value) return 'Unknown Card'
        const rankName = getRankName(activeCard.value.rank)
        return `${rankName} of ${activeCard.value.suit}`
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

        const card = activeCard.value
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
        let total = rollMain.value + rollEffort.value
        if (isGenrePointUsed.value) total += 1
        return total
    })

    const isSuccess = computed(() => {
        if (rollMain.value === null || rollEffort.value === null) return false

        const total = rollTotal.value

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
        // Return all visible cards to the deck first
        visibleCards.value.forEach(card => {
            updateDeckState(card.rank, card.suit, 'return')
        })
        visibleCards.value = []
        selectedCardId.value = null

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

    const addVisibleCard = () => {
        if (manualJoker.value) {
            // Jokers are special, they don't go into visibleCards usually, 
            // but for simplicity let's handle them as a separate state or just set selectedJoker
            // If user adds a Joker, it usually overrides everything.
            selectedJoker.value = manualJoker.value
            selectedCardId.value = null
        } else {
            const newCard: GameCard = {
                id: `${manualRank.value}-${manualSuit.value}`,
                suit: manualSuit.value,
                rank: manualRank.value
            }
            // Avoid duplicates
            if (!visibleCards.value.find(c => c.id === newCard.id)) {
                visibleCards.value.push(newCard)
                updateDeckState(manualRank.value, manualSuit.value, 'draw')
            }
        }
    }

    const selectCard = (id: string) => {
        selectedCardId.value = id
        selectedJoker.value = null
    }

    const setTrophyTop = (rank: number) => {
        const card = trophyPile.value.find(c => c.rank === rank)
        if (card) {
            trophyTop.value = card
            if (isFaceCard.value) {
                let modifier = 0
                const currentRank = activeCard.value?.rank || 0
                if (currentRank === 11) modifier = 1
                if (currentRank === 12) modifier = 2
                if (currentRank === 13) modifier = 3
                targetDifficulty.value = card.rank + modifier
            } else {
                targetDifficulty.value = card.rank
            }
        }
    }

    const awardGenrePoint = () => {
        if (tableGenrePoints.value > 0) {
            tableGenrePoints.value--
            playerGenrePoints.value++
        }
    }

    const toggleGenrePointAward = () => {
        if (isGenrePointAwarded.value) {
            // Refund
            isGenrePointAwarded.value = false
            playerGenrePoints.value--
            tableGenrePoints.value++
        } else {
            // Award
            if (tableGenrePoints.value > 0) {
                isGenrePointAwarded.value = true
                tableGenrePoints.value--
                playerGenrePoints.value++
            }
        }
    }

    const toggleGenrePointUsage = () => {
        if (isGenrePointUsed.value) {
            // Refund
            isGenrePointUsed.value = false
            playerGenrePoints.value++
            tableGenrePoints.value--
        } else {
            // Use
            if (playerGenrePoints.value > 0) {
                isGenrePointUsed.value = true
                playerGenrePoints.value--
                tableGenrePoints.value++
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
        isGenrePointUsed.value = false
        isGenrePointAwarded.value = false
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
        tableGenrePoints.value = 13
        playerGenrePoints.value = 0
        visibleCards.value = []
        selectedCardId.value = null
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
        tableGenrePoints.value = 13
        playerGenrePoints.value = 0
        visibleCards.value = []
        selectedCardId.value = null

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
                    if (activeCard.value) {
                        weaknessesFound.value.push(activeCard.value.suit)
                        if (weaknessesFound.value.length === 4) {
                            isEndgame.value = true
                        }
                    }
                } else {
                    if (activeCard.value) updateDeckState(activeCard.value.rank, activeCard.value.suit, 'return')
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
                if (activeCard.value) {
                    trophyPile.value.push(activeCard.value)
                    revealHiddenTen()
                    trophyTop.value = activeCard.value
                    isTrophyTopRandomized.value = false
                }
            }
        } else {
            if (isFaceCard.value) {
                strikes.value++
                updateDeckState(13, 'Spades', 'add')
                if (activeCard.value) updateDeckState(activeCard.value.rank, activeCard.value.suit, 'return')

                shuffleThreatDeck()
                shuffleTrophyPile()
            } else {
                if (activeCard.value) updateDeckState(activeCard.value.rank, activeCard.value.suit, 'return')
                if (!isEndgame.value) addNextReserve()
            }
        }
    }



    const hasFaceCardOnTable = computed(() => {
        return visibleCards.value.some(c => c.rank > 10)
    })

    const getNextValidCard = (): { rank: Rank, suit: Suit } => {
        // 1. Check Aces
        if (acesRemaining.value > 0) {
            const suits: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds']
            const availableSuit = suits.find(s => !drawnCards.value.has(`1-${s}`))
            if (availableSuit) return { rank: 1, suit: availableSuit }
        }

        // 2. Check Middle Stack (2-4, 11)
        // We want to find the lowest rank that has cards available
        const middleRanks = [2, 3, 4, 11]
        for (const rank of middleRanks) {
            if (middleStack.value[rank] > 0) {
                const suits: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds']
                const availableSuit = suits.find(s => !drawnCards.value.has(`${rank}-${s}`))
                if (availableSuit) return { rank: rank as Rank, suit: availableSuit }
            }
        }

        // 3. Check Bottom Stack
        // Iterate through all ranks 1-13
        for (let rank = 1; rank <= 13; rank++) {
            if (bottomStack.value[rank] > 0) {
                const suits: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds']
                const availableSuit = suits.find(s => !drawnCards.value.has(`${rank}-${s}`))
                if (availableSuit) return { rank: rank as Rank, suit: availableSuit }
            }
        }

        // Fallback (should rarely happen unless deck is empty)
        return { rank: 1, suit: 'Spades' }
    }

    const startNextScene = () => {
        applyGameStateUpdates()

        // Remove the active card from visible cards
        if (selectedCardId.value) {
            visibleCards.value = visibleCards.value.filter(c => c.id !== selectedCardId.value)
        }

        selectedCardId.value = null
        selectedJoker.value = null
        manualJoker.value = null

        // Smart Auto-Selection for next draw
        const nextCard = getNextValidCard()
        manualSuit.value = nextCard.suit
        manualRank.value = nextCard.rank

        currentStep.value = 2
        sacrificeConfirmed.value = false
        rollMain.value = null
        rollEffort.value = null
        targetDifficulty.value = null
        isGenrePointUsed.value = false
        isGenrePointAwarded.value = false
    }

    return {
        // State
        activeCard, // Renamed from currentCard
        visibleCards, // New
        selectedCardId, // New
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
        tableGenrePoints,
        playerGenrePoints,
        isGenrePointUsed,
        isGenrePointAwarded,

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
        hasFaceCardOnTable, // New

        // Methods
        isRankAvailable,
        isSuitAvailable,
        updateDeckState,
        addNextReserve,
        shuffleThreatDeck,
        shuffleTrophyPile,
        addVisibleCard, // New
        selectCard, // New
        setTrophyTop,
        reset,
        fullReset,
        startGame,
        applyGameStateUpdates,
        startNextScene,
        getRankName,
        awardGenrePoint,
        toggleGenrePointUsage,
        toggleGenrePointAward,
        getNextValidCard // New
    }
}
