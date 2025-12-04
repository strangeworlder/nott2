import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PlayingCard from '../PlayingCard.vue'

describe('PlayingCard.vue', () => {
    it('renders rank and suit', () => {
        const wrapper = mount(PlayingCard, {
            props: {
                suit: 'Spades',
                rank: 1
            }
        })
        expect(wrapper.text()).toContain('Ace')
        expect(wrapper.text()).toContain('Spades')
        expect(wrapper.text()).toContain('♠')
    })

    it('renders Joker', () => {
        const wrapper = mount(PlayingCard, {
            props: {
                isJoker: true,
                jokerColor: 'Red'
            }
        })
        expect(wrapper.text()).toContain('Joker')
        expect(wrapper.text()).toContain('Red')
        expect(wrapper.text()).toContain('★')
    })

    it('applies selected ring', () => {
        const wrapper = mount(PlayingCard, {
            props: {
                suit: 'Hearts',
                rank: 10,
                selected: true
            }
        })
        expect(wrapper.classes()).toContain('ring-4')
        expect(wrapper.classes()).toContain('ring-nott-red')
    })

    it('applies correct color for red suits', () => {
        const wrapper = mount(PlayingCard, {
            props: {
                suit: 'Hearts',
                rank: 5
            }
        })
        expect(wrapper.find('.text-nott-red').exists()).toBe(true)
    })
})
