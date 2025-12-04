import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CurrentThreat from '../CurrentThreat.vue'

describe('CurrentThreat.vue', () => {
    it('renders "No active threat" when no card or joker is active', () => {
        const wrapper = mount(CurrentThreat, {
            props: {
                activeCard: null,
                selectedJoker: null,
                cardName: ''
            }
        })
        expect(wrapper.text()).toContain('No active threat')
    })

    it('renders active card details correctly', () => {
        const wrapper = mount(CurrentThreat, {
            props: {
                activeCard: { suit: 'Spades', rank: 1 }, // Ace of Spades
                selectedJoker: null,
                cardName: 'The Killer'
            }
        })
        expect(wrapper.text()).toContain('A♠')
        expect(wrapper.text()).toContain('Current Threat')
        expect(wrapper.text()).toContain('The Killer')
    })

    it('renders red joker correctly', () => {
        const wrapper = mount(CurrentThreat, {
            props: {
                activeCard: null,
                selectedJoker: 'Red',
                cardName: 'Chaos'
            }
        })
        expect(wrapper.text()).toContain('🃏')
        expect(wrapper.find('.text-nott-red').exists()).toBe(true)
        expect(wrapper.text()).toContain('Chaos')
    })

    it('renders black joker correctly', () => {
        const wrapper = mount(CurrentThreat, {
            props: {
                activeCard: null,
                selectedJoker: 'Black',
                cardName: 'Doom'
            }
        })
        expect(wrapper.text()).toContain('🃏')
        expect(wrapper.find('.text-nott-white').exists()).toBe(true)
        expect(wrapper.text()).toContain('Doom')
    })
})
