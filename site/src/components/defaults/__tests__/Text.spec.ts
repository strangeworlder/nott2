import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Text from '../Text.vue'

describe('Text.vue', () => {
    it('renders slot content', () => {
        const wrapper = mount(Text, {
            slots: {
                default: 'Hello World'
            }
        })
        expect(wrapper.text()).toContain('Hello World')
    })

    it('renders correct tag based on variant', () => {
        const wrapper = mount(Text, {
            props: {
                variant: 'h1'
            }
        })
        expect(wrapper.element.tagName).toBe('H1')
    })

    it('renders correct tag based on as prop', () => {
        const wrapper = mount(Text, {
            props: {
                as: 'span'
            }
        })
        expect(wrapper.element.tagName).toBe('SPAN')
    })

    it('applies color classes', () => {
        const wrapper = mount(Text, {
            props: {
                color: 'red'
            }
        })
        expect(wrapper.classes()).toContain('text-nott-red')
    })

    it('applies alignment classes', () => {
        const wrapper = mount(Text, {
            props: {
                align: 'center'
            }
        })
        expect(wrapper.classes()).toContain('text-center')
    })
})
