import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Header from '../Header.vue'

describe('Header.vue', () => {
    it('renders title', () => {
        const wrapper = mount(Header)
        expect(wrapper.text()).toContain('NIGHT OF THE THIRTEENTH')
    })

    it('renders slot content', () => {
        const wrapper = mount(Header, {
            slots: {
                default: '<div class="subtitle">Subtitle</div>'
            }
        })
        expect(wrapper.find('.subtitle').exists()).toBe(true)
        expect(wrapper.text()).toContain('Subtitle')
    })
})
