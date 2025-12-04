import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TrophyPileTop from '../TrophyPileTop.vue'

describe('TrophyPileTop.vue', () => {
    it('renders nothing when trophyTop is null', () => {
        const wrapper = mount(TrophyPileTop, {
            props: {
                trophyTop: null,
                isRandomized: false
            }
        })
        expect(wrapper.text()).toBe('')
    })

    it('renders rank when trophyTop is present', () => {
        const wrapper = mount(TrophyPileTop, {
            props: {
                trophyTop: { suit: 'Hearts', rank: 10 },
                isRandomized: false
            }
        })
        expect(wrapper.text()).toContain('Top of the Trophy Pile')
        expect(wrapper.text()).toContain('10')
    })

    it('renders "Unknown" when randomized', () => {
        const wrapper = mount(TrophyPileTop, {
            props: {
                trophyTop: { suit: 'Hearts', rank: 10 },
                isRandomized: true
            }
        })
        expect(wrapper.text()).toContain('Top of the Trophy Pile')
        expect(wrapper.text()).toContain('Unknown')
    })

    it('renders rank when randomized but suit is Unknown (10U case)', () => {
        const wrapper = mount(TrophyPileTop, {
            props: {
                trophyTop: { suit: 'Unknown', rank: 10 },
                isRandomized: true
            }
        })
        expect(wrapper.text()).toContain('Top of the Trophy Pile')
        expect(wrapper.text()).toContain('10')
        expect(wrapper.text()).not.toContain('Unknown')
    })
})
