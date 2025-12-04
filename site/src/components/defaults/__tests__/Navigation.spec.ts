import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Navigation from '../Navigation.vue'

describe('Navigation.vue', () => {
    it('renders slot content', () => {
        const wrapper = mount(Navigation, {
            slots: {
                default: '<div>Nav Item</div>'
            }
        })
        expect(wrapper.text()).toContain('Nav Item')
    })

    it('renders as a nav element', () => {
        const wrapper = mount(Navigation)
        expect(wrapper.element.tagName).toBe('NAV')
    })
})
