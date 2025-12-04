import { describe, it, expect, beforeEach } from 'vitest'
import { useLivePlay } from '../useLivePlay'

describe('useLivePlay', () => {
    const {
        fullReset,
        toggleGenrePointUsage,
        playerGenrePoints,
        tableGenrePoints,
        isGenrePointUsed,
        awardGenrePoint,
        isGenrePointAwarded,
        toggleGenrePointAward
    } = useLivePlay()

    beforeEach(() => {
        fullReset()
    })

    it('should initialize with correct genre points', () => {
        expect(tableGenrePoints.value).toBe(13)
        expect(playerGenrePoints.value).toBe(0)
    })

    it('should award genre points correctly', () => {
        awardGenrePoint()
        expect(tableGenrePoints.value).toBe(12)
        expect(playerGenrePoints.value).toBe(1)
    })

    it('should toggle genre point award (refund/award)', () => {
        // Award
        toggleGenrePointAward()
        expect(isGenrePointAwarded.value).toBe(true)
        expect(tableGenrePoints.value).toBe(12)
        expect(playerGenrePoints.value).toBe(1)

        // Refund
        toggleGenrePointAward()
        expect(isGenrePointAwarded.value).toBe(false)
        expect(tableGenrePoints.value).toBe(13)
        expect(playerGenrePoints.value).toBe(0)
    })

    it('should toggle genre point usage (use/refund)', () => {
        // Give player a point first
        awardGenrePoint()
        expect(playerGenrePoints.value).toBe(1)
        expect(tableGenrePoints.value).toBe(12)

        // Use point
        toggleGenrePointUsage()
        expect(isGenrePointUsed.value).toBe(true)
        expect(playerGenrePoints.value).toBe(0)
        // Current logic (to be changed): returns to table
        // New logic: removed from game (table remains 12)

        // For now, let's assert the NEW desired behavior to fail first (TDDish)
        // or assert current behavior and then change. 
        // Let's assert the NEW behavior directly to confirm failure/fix cycle if I were running it, 
        // but here I'll just write the test for the desired state.
        expect(tableGenrePoints.value).toBe(12)

        // Refund (Toggle back off)
        toggleGenrePointUsage()
        expect(isGenrePointUsed.value).toBe(false)
        expect(playerGenrePoints.value).toBe(1)
        expect(tableGenrePoints.value).toBe(12)
    })
})
