import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ActionFooter from '../ActionFooter.vue'
import Button from '../Button.vue'

describe('ActionFooter.vue', () => {
    it('renders label in default button', () => {
        const wrapper = mount(ActionFooter, {
            props: {
                label: 'Next Step'
            }
        })
        expect(wrapper.text()).toContain('Next Step')
    })

    it('renders slot content', () => {
        const wrapper = mount(ActionFooter, {
            slots: {
                default: '<button>Custom Button</button>'
            }
        })
        expect(wrapper.text()).toContain('Custom Button')
        expect(wrapper.findComponent(Button).exists()).toBe(false)
    })

    it('passes disabled prop to button', () => {
        const wrapper = mount(ActionFooter, {
            props: {
                disabled: true
            }
        })
        const button = wrapper.findComponent(Button)
        expect(button.props('disabled')).toBe(true)
    })

    it('passes variant prop to button', () => {
        const wrapper = mount(ActionFooter, {
            props: {
                variant: 'secondary'
            }
        })
        const button = wrapper.findComponent(Button)
        expect(button.props('variant')).toBe('secondary')
    })

    it('emits click event', async () => {
        const wrapper = mount(ActionFooter)
        await wrapper.findComponent(Button).trigger('click')
        expect(wrapper.emitted('click')).toBeTruthy()
    })
})
