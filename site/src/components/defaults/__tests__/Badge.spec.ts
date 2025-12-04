import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from '../Badge.vue'

describe('Badge.vue', () => {
    it('renders slot content', () => {
        const wrapper = mount(Badge, {
            slots: {
                default: 'New'
            }
        })
        expect(wrapper.text()).toContain('New')
    })

    it('applies default variant', () => {
        const wrapper = mount(Badge)
        expect(wrapper.classes()).toContain('bg-nott-white/10')
    })

    it('applies red variant', () => {
        const wrapper = mount(Badge, {
            props: {
                variant: 'red'
            }
        })
        expect(wrapper.classes()).toContain('text-nott-red')
        expect(wrapper.classes()).toContain('bg-nott-red/10')
    })
})
