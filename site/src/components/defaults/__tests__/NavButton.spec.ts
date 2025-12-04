import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NavButton from '../NavButton.vue'

describe('NavButton.vue', () => {
    it('renders slot content', () => {
        const wrapper = mount(NavButton, {
            slots: {
                default: 'Home'
            }
        })
        expect(wrapper.text()).toContain('Home')
    })

    it('applies active classes', () => {
        const wrapper = mount(NavButton, {
            props: {
                active: true
            }
        })
        expect(wrapper.classes()).toContain('text-nott-red')
        expect(wrapper.classes()).toContain('border-nott-red')
    })

    it('renders diamond indicators when active', () => {
        const wrapper = mount(NavButton, {
            props: {
                active: true
            }
        })
        expect(wrapper.text()).toContain('◆')
    })

    it('does not render diamond indicators when inactive', () => {
        const wrapper = mount(NavButton, {
            props: {
                active: false
            }
        })
        expect(wrapper.text()).not.toContain('◆')
    })
})
