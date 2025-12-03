import { ref, computed } from 'vue'
import { effortScale } from '../data/rules'
import type { Card as GameCard, Suit, Rank } from './useGameEngine'

export type LivePlayPhase =
    | 'welcome'
    | 'game-setup'
    | 'act-setup'
    | 'scene-setup'
    | 'conversation-stakes'
    | 'resolution'
    | 'resolve-scene'
    | 'fallout'
    | 'win'

export type Playset = 'default' | 'summercamp'

// Shared state (singleton)
const visibleCards = ref<GameCard[]>([])
const selectedCardId = ref<string | null>(null)

const strikes = ref(0)
const weaknessesFound = ref<Suit[]>([])
const isEndgame = ref(false)
const tableGenrePoints = ref(13)
const playerGenrePoints = ref(0)
const currentAct = ref(1)
const selectedPlayset = ref<Playset | null>(null)

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

// Face Card Reserves
const faceCardReserves = ref({
    11: 3, // Jacks (4 total - 1 in middle stack)
    12: 4, // Queens
    13: 4  // Kings
})
const lastAddedFaceCardRank = ref<number | null>(null)

// UI State that is tightly coupled to game flow
const currentPhase = ref<LivePlayPhase>('welcome')
const selectedJoker = ref<'Red' | 'Black' | null>(null)
const sacrificeConfirmed = ref(false)
const rollMain = ref<number | null>(null)
const rollEffort = ref<number | null>(null)

const manualOverride = ref(false)
const debugMode = ref(true)
const isGenrePointUsed = ref(false)
const isEndgameInitialized = ref(false)
const isGenrePointAwarded = ref(false)
const isGameWon = ref(false)
const isBlackJokerRemoved = ref(false)

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



    const targetDifficulty = computed(() => {
        if (!trophyTop.value) return null
        if (isFaceCard.value) {
            let modifier = 0
            const currentRank = activeCard.value?.rank || 0
            if (currentRank === 11) modifier = 1
            if (currentRank === 12) modifier = 2
            if (currentRank === 13) modifier = 3
            return trophyTop.value.rank + modifier
        }
        return trophyTop.value.rank
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
            isTrophyTopRandomized.value = false
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
        currentPhase.value = 'welcome'
        selectedJoker.value = null
        manualJoker.value = null
        sacrificeConfirmed.value = false
        rollMain.value = null
        rollEffort.value = null
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
        faceCardReserves.value = { 11: 3, 12: 4, 13: 4 }
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
        isEndgameInitialized.value = false
        isGameWon.value = false
        isBlackJokerRemoved.value = false
        currentAct.value = 1
        selectedPlayset.value = null
    }

    const startGame = () => {
        strikes.value = 0
        weaknessesFound.value = []
        isEndgame.value = false
        isEndgameInitialized.value = false
        isGameWon.value = false
        isBlackJokerRemoved.value = false
        currentAct.value = 1
        acesRemaining.value = 4
        middleStack.value = { 2: 4, 3: 4, 4: 4, 11: 1 }
        bottomStack.value = {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
            11: 0, 12: 0, 13: 0
        }
        faceCardReserves.value = { 11: 3, 12: 4, 13: 4 }
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

        currentPhase.value = 'scene-setup'
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

    const addFaceCardToThreatDeck = (targetRank: number, effort: number | null = null) => {
        // Helper to try adding a specific rank
        const tryAdd = (rank: number): boolean => {
            if (faceCardReserves.value[rank as 11 | 12 | 13] > 0) {
                faceCardReserves.value[rank as 11 | 12 | 13]--
                updateDeckState(rank as Rank, 'Spades', 'add') // Suit doesn't matter for count, but we need one
                lastAddedFaceCardRank.value = rank
                return true
            }
            return false
        }

        // Reset last added
        lastAddedFaceCardRank.value = null

        // Substitution Logic
        if (targetRank === 11) { // Need Jack
            if (tryAdd(11)) return
            if (tryAdd(12)) return // No Jacks? Add Queen
            tryAdd(13)             // No Queens? Add King
        } else if (targetRank === 12) { // Need Queen
            if (tryAdd(12)) return
            if (tryAdd(13)) return // No Queens? Add King
            tryAdd(11)             // No Kings? Add Jack
        } else if (targetRank === 13) { // Need King
            if (tryAdd(13)) return

            // If No Kings, substitution depends on Effort
            // High Effort (3-4) -> Worse Consequence (Queen first)
            // Low Effort (1-2) -> Lesser Consequence (Jack first)
            // If effort is null (shouldn't happen in this context but safe fallback), default to Queen (worse)

            if (effort && effort <= 2) {
                if (tryAdd(11)) return // Try Jack
                tryAdd(12)             // Then Queen
            } else {
                if (tryAdd(12)) return // Try Queen
                tryAdd(11)             // Then Jack
            }
        }
    }

    const applyGameStateUpdates = () => {
        if (isSuccess.value) {
            // Joker Success Logic
            if (selectedJoker.value === 'Red') {
                isGameWon.value = true
                currentPhase.value = 'win'
                return
            }
            if (selectedJoker.value === 'Black') {
                // Remove highest face card
                // We need to find the highest rank in the threat deck (bottomStack + middleStack)
                // Actually, "Removes the highest face card from the deck"
                // We don't track individual cards in the deck perfectly, but we track counts.
                // Let's try to remove a King, then Queen, then Jack from reserves/deck state.
                // Since we don't have a "deck" array, we just decrement the counts in bottomStack/middleStack?
                // Or just assume it's done narratively?
                // The instructions say "Removes the highest face card from the deck".
                // We should probably try to decrement a King from bottomStack if possible.

                // For now, we'll just handle the Joker removal itself.
                // The instruction text will tell the user what to do.
                selectedJoker.value = null // Removed from game
                isBlackJokerRemoved.value = true
                return
            }

            if (isFaceCard.value) {
                if (isFirstTime.value) {
                    if (activeCard.value) {
                        weaknessesFound.value.push(activeCard.value.suit)
                        if (weaknessesFound.value.length === 4) {
                            isEndgame.value = true
                            currentAct.value = 3
                            currentPhase.value = 'act-setup'
                        }
                        // CRITICAL FIX: Remove the weakness card from visibleCards so it isn't returned to the deck
                        visibleCards.value = visibleCards.value.filter(c => c.id !== activeCard.value?.id)
                    }
                } else {
                    // Fix: Do NOT manually return the card here. shuffleThreatDeck returns ALL visible cards.
                    // if (activeCard.value) updateDeckState(activeCard.value.rank, activeCard.value.suit, 'return')
                }

                if (rollEffort.value && rollEffort.value <= 2) {
                    addFaceCardToThreatDeck(11, rollEffort.value) // Add Jack
                } else if (rollEffort.value && rollEffort.value >= 3) {
                    addFaceCardToThreatDeck(12, rollEffort.value) // Add Queen
                }

                shuffleThreatDeck()
                shuffleTrophyPile()

                // Act 1 -> Act 2 Transition
                if (currentAct.value === 1) {
                    currentAct.value = 2
                }
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
            // Joker Failure Logic
            if (selectedJoker.value === 'Red') {
                // Shuffle back
                // We don't need to do anything state-wise other than NOT removing it.
                // It stays in the "deck" conceptually.
                return
            }
            if (selectedJoker.value === 'Black') {
                // Add King
                addFaceCardToThreatDeck(13)
                selectedJoker.value = null // Removed from game
                isBlackJokerRemoved.value = true
                return
            }

            if (isFaceCard.value) {
                strikes.value++
                addFaceCardToThreatDeck(13, rollEffort.value) // Add King
                // Fix: Do NOT manually return the card here. shuffleThreatDeck returns ALL visible cards.
                // if (activeCard.value) updateDeckState(activeCard.value.rank, activeCard.value.suit, 'return')

                shuffleThreatDeck()
                shuffleTrophyPile()

                // Act 1 -> Act 2 Transition
                if (currentAct.value === 1) {
                    currentAct.value = 2
                }
            } else {
                if (activeCard.value) updateDeckState(activeCard.value.rank, activeCard.value.suit, 'return')
                if (!isEndgame.value) addNextReserve()
            }
        }
    }

    const pendingFalloutRank = computed(() => {
        if (!isFaceCard.value) return null

        // Determine target rank based on success/failure and effort
        let targetRank = 0
        if (isSuccess.value) {
            // Success: Effort 1-2 -> Jack (11), Effort 3-4 -> Queen (12)
            if (rollEffort.value && rollEffort.value <= 2) targetRank = 11
            else if (rollEffort.value && rollEffort.value >= 3) targetRank = 12
        } else {
            // Failure: Always King (13)
            targetRank = 13
        }

        if (targetRank === 0) return null

        // Check reserves (read-only)
        const reserves = faceCardReserves.value
        const check = (r: number) => reserves[r as 11 | 12 | 13] > 0 ? r : null

        // Exact mirror of addFaceCardToThreatDeck substitution logic
        if (targetRank === 11) { // Need Jack
            return check(11) || check(12) || check(13)
        }
        if (targetRank === 12) { // Need Queen
            return check(12) || check(13) || check(11)
        }
        if (targetRank === 13) { // Need King
            if (check(13)) return 13

            // Effort logic for King substitution
            const effort = rollEffort.value
            if (effort && effort <= 2) {
                return check(11) || check(12)
            } else {
                return check(12) || check(11)
            }
        }
        return null
    })

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

    const startEndgame = () => {
        // Clear number cards from tracking for debug accuracy
        acesRemaining.value = 0
        // Keep Jacks (11) in middle stack, clear others
        middleStack.value = { 2: 0, 3: 0, 4: 0, 11: middleStack.value[11] }

        // Clear 1-10 from bottomStack, keep Face Cards
        for (let i = 1; i <= 10; i++) {
            bottomStack.value[i] = 0
        }
        reserveQueue.value = [] // No more reserves
        rollMain.value = null
        rollEffort.value = null
        isGenrePointUsed.value = false
        isGenrePointAwarded.value = false
        sacrificeConfirmed.value = false

        // Start the loop
        currentPhase.value = 'scene-setup'
        isEndgameInitialized.value = true
    }

    const startNextScene = () => {
        applyGameStateUpdates()

        if (isGameWon.value) return

        // Remove the active card from visible cards
        if (selectedCardId.value) {
            visibleCards.value = visibleCards.value.filter(c => c.id !== selectedCardId.value)
        }

        selectedCardId.value = null
        selectedJoker.value = null
        manualJoker.value = null

        if (isEndgame.value && !isEndgameInitialized.value) {
            currentPhase.value = 'act-setup'
            return
        }

        // Smart Auto-Selection for next draw
        const nextCard = getNextValidCard()
        manualSuit.value = nextCard.suit
        manualRank.value = nextCard.rank

        currentPhase.value = 'scene-setup'
        sacrificeConfirmed.value = false
        rollMain.value = null
        rollEffort.value = null
        isGenrePointUsed.value = false
        isGenrePointAwarded.value = false
    }

    const nextPhase = () => {
        switch (currentPhase.value) {
            case 'welcome':
                currentPhase.value = 'game-setup'
                break
            case 'game-setup':
                currentPhase.value = 'act-setup'
                break
            case 'act-setup':
                currentPhase.value = 'scene-setup'
                break
            case 'scene-setup':
                currentPhase.value = 'conversation-stakes'
                break
            case 'conversation-stakes':
                currentPhase.value = 'resolution'
                break
            case 'resolution':
                currentPhase.value = 'resolve-scene'
                break
            case 'resolve-scene':
                currentPhase.value = 'fallout'
                break
            case 'fallout':
                startNextScene()
                break
        }
    }

    const prevPhase = () => {
        switch (currentPhase.value) {
            case 'game-setup':
                currentPhase.value = 'welcome'
                break
            case 'act-setup':
                if (currentAct.value === 1) currentPhase.value = 'game-setup'
                break
            case 'scene-setup':
                // Cannot go back to game setup from scene setup easily without reset
                break
            case 'conversation-stakes':
                currentPhase.value = 'scene-setup'
                break
            case 'resolution':
                currentPhase.value = 'conversation-stakes'
                break
            case 'resolve-scene':
                currentPhase.value = 'resolution'
                break
            case 'fallout':
                currentPhase.value = 'resolve-scene'
                break
        }
    }

    return {
        // State
        activeCard, // Renamed from currentCard
        visibleCards, // New
        selectedCardId, // New
        strikes,
        weaknessesFound,
        isEndgame,
        isGameWon, // New
        isBlackJokerRemoved, // New
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
        currentPhase,
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
        currentAct,
        selectedPlayset,

        // Computed
        selectedSuit,
        selectedRank,
        isFaceCard,
        isFirstTime,
        cardName,

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
        startEndgame, // New
        applyGameStateUpdates,
        startNextScene,
        getRankName,
        awardGenrePoint,
        toggleGenrePointUsage,
        toggleGenrePointAward,
        getNextValidCard, // New
        faceCardReserves, // New
        lastAddedFaceCardRank, // New
        pendingFalloutRank, // New
        nextPhase, // New
        prevPhase // New
    }
}
