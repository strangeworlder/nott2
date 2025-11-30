import { ref } from 'vue'

export type Suit = 'Spades' | 'Hearts' | 'Clubs' | 'Diamonds'
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13
export type JokerColor = 'Red' | 'Black'

export interface Card {
    id: string
    suit: Suit
    rank: Rank
    isJoker?: boolean
    jokerColor?: JokerColor
}

const SUITS: Suit[] = ['Spades', 'Hearts', 'Clubs', 'Diamonds']

// Global State (Singleton pattern for simplicity in this app)
const threatDeck = ref<Card[]>([])
const numberReserve = ref<Card[]>([])
const faceCardReserve = ref<Card[]>([]) // Jacks, Queens, Kings not in deck
const trophyPile = ref<Card[]>([])
const currentCard = ref<Card | null>(null)
const strikes = ref(0)
const weaknessesFound = ref<Suit[]>([])
const isEndgame = ref(false)

export function useGameEngine() {

    // --- Helpers ---

    const createCard = (suit: Suit, rank: Rank): Card => ({
        id: `${suit}-${rank}-${Math.random().toString(36).substr(2, 9)}`,
        suit,
        rank
    })

    const shuffle = (deck: Card[]) => {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck
    }

    // --- Actions ---

    const initializeGame = () => {
        // Reset State
        threatDeck.value = []
        numberReserve.value = []
        faceCardReserve.value = []
        trophyPile.value = []
        currentCard.value = null
        strikes.value = 0
        weaknessesFound.value = []
        isEndgame.value = false

        // 1. Build Number Reserve (5s - 10s)
        const reserveCards: Card[] = []
        for (let r = 5; r <= 10; r++) {
            SUITS.forEach(s => reserveCards.push(createCard(s, r as Rank)))
        }
        // Rules say "Trophy Pile: Place a random 10 from Reserve face up to start."
        const tens = reserveCards.filter(c => c.rank === 10)
        const randomTen = tens[Math.floor(Math.random() * tens.length)]
        trophyPile.value.push(randomTen)

        // Remove that 10 from reserve
        const remainingReserve = reserveCards.filter(c => c.id !== randomTen.id)
        numberReserve.value = shuffle(remainingReserve)

        // 2. Build Threat Deck
        // "Shuffle 2s, 3s, 4s, and one Jack."
        const lowNumbers: Card[] = []
        for (let r = 2; r <= 4; r++) {
            SUITS.forEach(s => lowNumbers.push(createCard(s, r as Rank)))
        }

        // One Random Jack
        const allJacks: Card[] = SUITS.map(s => createCard(s, 11))
        const randomJack = allJacks[Math.floor(Math.random() * allJacks.length)]
        const otherJacks = allJacks.filter(c => c.id !== randomJack.id)

        // Combine and Shuffle
        const threatBottom = shuffle([...lowNumbers, randomJack])

        // "Place 4 Aces face up on top."
        const aces = shuffle(SUITS.map(s => createCard(s, 1)))

        // Final Deck: Aces on top, then the rest
        threatDeck.value = [...aces, ...threatBottom]

        // 3. Face Card Reserves
        const queens = SUITS.map(s => createCard(s, 12))
        const kings = SUITS.map(s => createCard(s, 13))
        faceCardReserve.value = [...otherJacks, ...queens, ...kings]
    }

    const drawCard = (): Card | null => {
        if (threatDeck.value.length === 0) return null
        const card = threatDeck.value.shift() || null
        currentCard.value = card
        return card
    }

    const addCardToBottom = (card: Card) => {
        threatDeck.value.push(card)
    }

    const addNextReserveToBottom = () => {
        if (numberReserve.value.length > 0) {
            const card = numberReserve.value.shift()
            if (card) threatDeck.value.push(card)
        }
    }

    const addRandomFaceCard = (rank: 11 | 12 | 13) => {
        // Find available face cards of that rank
        const available = faceCardReserve.value.filter(c => c.rank === rank)
        if (available.length === 0) return // None left

        const random = available[Math.floor(Math.random() * available.length)]
        // Remove from reserve
        faceCardReserve.value = faceCardReserve.value.filter(c => c.id !== random.id)

        threatDeck.value.push(random)
        shuffle(threatDeck.value)
    }

    const addKingToBottom = () => {
        const available = faceCardReserve.value.filter(c => c.rank === 13)
        if (available.length === 0) return

        const random = available[Math.floor(Math.random() * available.length)]
        faceCardReserve.value = faceCardReserve.value.filter(c => c.id !== random.id)
        threatDeck.value.push(random)
    }

    return {
        // State
        threatDeck,
        numberReserve,
        faceCardReserve,
        trophyPile,
        currentCard,
        strikes,
        weaknessesFound,
        isEndgame,

        // Actions
        initializeGame,
        drawCard,
        addCardToBottom,
        addNextReserveToBottom,
        addRandomFaceCard,
        addKingToBottom,
        shuffleDeck: () => shuffle(threatDeck.value),
        resetCurrentCard: () => { currentCard.value = null }
    }
}
