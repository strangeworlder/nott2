import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DieSelector from '../DieSelector.vue'

describe('DieSelector.vue', () => {
    it('renders correct number of buttons', () => {
        const wrapper = mount(DieSelector, {
            props: {
                sides: 6,
                modelValue: null
            }
        })
        expect(wrapper.findAll('button').length).toBe(6)
    })

    it('renders label', () => {
        const wrapper = mount(DieSelector, {
            props: {
                sides: 6,
                modelValue: null,
                label: 'Select Die'
            }
        })
        expect(wrapper.text()).toContain('Select Die')
    })

    it('emits update:modelValue when clicked', async () => {
        const wrapper = mount(DieSelector, {
            props: {
                sides: 6,
                modelValue: null
            }
        })
        await wrapper.findAll('button')[0].trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
    })

    it('applies selected classes', () => {
        const wrapper = mount(DieSelector, {
            props: {
                sides: 6,
                modelValue: 3
            }
        })
        const buttons = wrapper.findAll('button')
        expect(buttons[2].classes()).toContain('bg-nott-white') // 3rd button (index 2) should be selected
        expect(buttons[0].classes()).toContain('bg-nott-black') // 1st button should not
    })

    it('applies color prop', () => {
        const wrapper = mount(DieSelector, {
            props: {
                sides: 6,
                modelValue: 1,
                color: 'red'
            }
        })
        const buttons = wrapper.findAll('button')
        expect(buttons[0].classes()).toContain('bg-nott-red')
    })
})
