import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useLivePlay } from '../useLivePlay'
import * as contentLoader from '../../utils/contentLoader'

// Mock contentLoader
vi.mock('../../utils/contentLoader', () => ({
    getPlaysetConfig: vi.fn()
}))

describe('useLivePlay - Act 3 and Finale Logic', () => {
    const {
        fullReset,
        startAct3,
        triggerJokerEvent,
        currentAct,
        isEndgame,
        jokersAdded,
        areJokersAvailable,
        weaknessesFound,
        selectedPlayset,
        addNextReserve,
        cardsAddedFromReserve,
        act3Countdown,
        activeCard,
        visibleCards,
        selectedCardId,
        applyGameStateUpdates,
        rollMain,
        rollEffort,
        trophyTop
    } = useLivePlay()

    beforeEach(() => {
        fullReset()
        vi.clearAllMocks()
        selectedPlayset.value = 'default'
        vi.mocked(contentLoader.getPlaysetConfig).mockReturnValue({})
    })

    it('should automatically trigger Act 3 when 13 cards are added from reserve', () => {
        // Add 12 cards
        for (let i = 0; i < 12; i++) {
            addNextReserve()
        }
        expect(cardsAddedFromReserve.value).toBe(12)
        expect(currentAct.value).toBe(1) // Still Act 1 (or 2)

        // Add 13th card
        addNextReserve()
        expect(cardsAddedFromReserve.value).toBe(13)
        expect(currentAct.value).toBe(3)
        expect(isEndgame.value).toBe(true)
        expect(jokersAdded.value).toBe(false) // Jokers NOT added by timer
    })

    it('should correctly calculate Act 3 countdown', () => {
        expect(act3Countdown.value).toBe(13)

        addNextReserve()
        expect(act3Countdown.value).toBe(12)

        for (let i = 0; i < 11; i++) {
            addNextReserve()
        }
        expect(act3Countdown.value).toBe(1)

        addNextReserve()
        expect(act3Countdown.value).toBe(0)
    })

    it('should automatically trigger Act 3 and Jokers when 4 weaknesses are found', () => {
        startAct3()
        triggerJokerEvent()

        expect(currentAct.value).toBe(3)
        expect(jokersAdded.value).toBe(true)
    })

    it('should not add card from reserve when an Ace is resolved', () => {
        // Setup
        const ace = { id: 'ace-spades', rank: 1 as const, suit: 'Spades' as const }
        visibleCards.value = [ace]
        selectedCardId.value = ace.id

        // Force Failure (so we would normally add a card)
        trophyTop.value = { id: 'trophy', rank: 10, suit: 'Hearts' as const }
        rollMain.value = 1
        rollEffort.value = 1

        const initialReserveCount = cardsAddedFromReserve.value

        applyGameStateUpdates()

        expect(cardsAddedFromReserve.value).toBe(initialReserveCount)
    })

    it('should add card from reserve when a Number Card is resolved', () => {
        // Setup
        const two = { id: 'two-spades', rank: 2 as const, suit: 'Spades' as const }
        visibleCards.value = [two]
        selectedCardId.value = two.id

        // Force Failure
        trophyTop.value = { id: 'trophy', rank: 10, suit: 'Hearts' as const }
        rollMain.value = 1
        rollEffort.value = 1

        const initialReserveCount = cardsAddedFromReserve.value

        applyGameStateUpdates()

        expect(cardsAddedFromReserve.value).toBe(initialReserveCount + 1)
    })
})
