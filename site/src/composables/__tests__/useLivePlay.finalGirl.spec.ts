import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useLivePlay } from '../useLivePlay'
import * as contentLoader from '../../utils/contentLoader'

// Mock contentLoader
vi.mock('../../utils/contentLoader', () => ({
    getPlaysetConfig: vi.fn()
}))

describe('useLivePlay - Final Girl Module', () => {
    const {
        addVisibleCard,
        strikesToAssign,
        manualRank,
        manualSuit,
        selectedPlayset,
        visibleCards,
        fullReset
    } = useLivePlay()

    beforeEach(() => {
        fullReset()
        vi.clearAllMocks()
    })

    it('should assign a strike when a Face Card is drawn and Final Girl module is active', () => {
        // Setup Final Girl module active
        selectedPlayset.value = 'summercamp'
        vi.mocked(contentLoader.getPlaysetConfig).mockReturnValue({
            rulesModules: { finalGirl: true }
        })

        // Setup Face Card (Jack)
        manualRank.value = 11
        manualSuit.value = 'Spades'

        // Action
        addVisibleCard()

        // Assert
        expect(strikesToAssign.value).toBe(1)
        expect(visibleCards.value.length).toBe(1)
    })

    it('should NOT assign a strike when a Number Card is drawn and Final Girl module is active', () => {
        // Setup Final Girl module active
        selectedPlayset.value = 'summercamp'
        vi.mocked(contentLoader.getPlaysetConfig).mockReturnValue({
            rulesModules: { finalGirl: true }
        })

        // Setup Number Card (10)
        manualRank.value = 10
        manualSuit.value = 'Spades'

        // Action
        addVisibleCard()

        // Assert
        expect(strikesToAssign.value).toBe(0)
        expect(visibleCards.value.length).toBe(1)
    })

    it('should NOT assign a strike when a Face Card is drawn and Final Girl module is INACTIVE', () => {
        // Setup Final Girl module inactive
        selectedPlayset.value = 'default'
        vi.mocked(contentLoader.getPlaysetConfig).mockReturnValue({
            rulesModules: { finalGirl: false }
        })

        // Setup Face Card (Jack)
        manualRank.value = 11
        manualSuit.value = 'Spades'

        // Action
        addVisibleCard()

        // Assert
        expect(strikesToAssign.value).toBe(0)
        expect(visibleCards.value.length).toBe(1)
    })
})
