import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SelectionButton from '../SelectionButton.vue'

describe('SelectionButton.vue', () => {
    it('renders slot content', () => {
        const wrapper = mount(SelectionButton, {
            slots: {
                default: 'Select Me'
            }
        })
        expect(wrapper.text()).toContain('Select Me')
    })

    it('applies selected classes', () => {
        const wrapper = mount(SelectionButton, {
            props: {
                selected: true
            }
        })
        expect(wrapper.classes()).toContain('bg-nott-white')
        expect(wrapper.classes()).toContain('text-nott-black')
    })

    it('applies disabled state', () => {
        const wrapper = mount(SelectionButton, {
            props: {
                disabled: true
            }
        })
        expect(wrapper.attributes('disabled')).toBeDefined()
        expect(wrapper.classes()).toContain('cursor-not-allowed')
    })

    it('applies variant classes', () => {
        const wrapper = mount(SelectionButton, {
            props: {
                variant: 'square'
            }
        })
        expect(wrapper.classes()).toContain('aspect-square')
    })

    it('applies color classes', () => {
        const wrapper = mount(SelectionButton, {
            props: {
                color: 'red',
                selected: true
            }
        })
        expect(wrapper.classes()).toContain('bg-nott-red')
    })
})
