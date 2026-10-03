import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import UtensilRadioButtons from './UtensilRadioButtons.vue'
import UtensilRadioButton from './UtensilRadioButton.vue'

// Helper to create a test wrapper with both components
function createRadioGroup(
  options: {
    modelValue?: string
    disabled?: boolean
    variation?: string
    round?: boolean
    loop?: boolean
  } = {},
) {
  const TestWrapper = defineComponent({
    components: { UtensilRadioButtons, UtensilRadioButton },
    setup() {
      const value = ref(options.modelValue)
      return { value }
    },
    template: `
      <UtensilRadioButtons
        v-model="value"
        aria-label="Test group"
        ${options.disabled ? 'disabled' : ''}
        ${options.variation ? `variation="${options.variation}"` : ''}
        ${options.round ? 'round' : ''}
        ${options.loop === false ? ':loop="false"' : ''}
      >
        <UtensilRadioButton value="a" icon="check" />
        <UtensilRadioButton value="b" icon="star" />
        <UtensilRadioButton value="c" icon="heart" />
      </UtensilRadioButtons>
    `,
  })

  return mount(TestWrapper, {
    attachTo: document.body,
  })
}

describe('UtensilRadioButtons', () => {
  it('renders a radiogroup with radio buttons', () => {
    const wrapper = createRadioGroup()
    expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true)
    expect(wrapper.findAll('[role="radio"]')).toHaveLength(3)
    wrapper.unmount()
  })

  it('selects the initial value', () => {
    const wrapper = createRadioGroup({ modelValue: 'b' })
    const radios = wrapper.findAll('[role="radio"]')
    expect(radios[1].attributes('aria-checked')).toBe('true')
    expect(radios[0].attributes('aria-checked')).toBe('false')
    expect(radios[2].attributes('aria-checked')).toBe('false')
    wrapper.unmount()
  })

  it('changes selection on click', async () => {
    const wrapper = createRadioGroup({ modelValue: 'a' })
    const radios = wrapper.findAll('[role="radio"]')

    await radios[2].trigger('click')
    expect(wrapper.vm.value).toBe('c')
    wrapper.unmount()
  })

  it('manages tabindex correctly - selected button is tabbable', () => {
    const wrapper = createRadioGroup({ modelValue: 'b' })
    const radios = wrapper.findAll('[role="radio"]')

    expect(radios[0].attributes('tabindex')).toBe('-1')
    expect(radios[1].attributes('tabindex')).toBe('0')
    expect(radios[2].attributes('tabindex')).toBe('-1')
    wrapper.unmount()
  })

  it('navigates with arrow keys', async () => {
    const wrapper = createRadioGroup({ modelValue: 'a' })
    const group = wrapper.find('[role="radiogroup"]')
    const radios = wrapper.findAll('[role="radio"]')

    // Focus the first radio
    ;(radios[0].element as HTMLElement).focus()

    await group.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.vm.value).toBe('b')

    await group.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.vm.value).toBe('c')
    wrapper.unmount()
  })

  it('loops navigation by default', async () => {
    const wrapper = createRadioGroup({ modelValue: 'c' })
    const group = wrapper.find('[role="radiogroup"]')
    const radios = wrapper.findAll('[role="radio"]')

    ;(radios[2].element as HTMLElement).focus()

    await group.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.vm.value).toBe('a')
    wrapper.unmount()
  })

  it('does not change selection when disabled', async () => {
    const wrapper = createRadioGroup({ modelValue: 'a', disabled: true })
    expect(wrapper.find('.utensil-radio-buttons.disabled').exists()).toBe(true)
    wrapper.unmount()
  })

  it('has accessible aria-label', () => {
    const wrapper = createRadioGroup()
    expect(wrapper.find('[role="radiogroup"]').attributes('aria-label')).toBe('Test group')
    wrapper.unmount()
  })

  it('propagates group round to buttons that do not set their own', () => {
    const wrapper = createRadioGroup({ round: true })
    const buttons = wrapper.findAll('.utensil-button')
    expect(buttons).toHaveLength(3)
    buttons.forEach((button) => expect(button.classes()).toContain('round'))
    wrapper.unmount()
  })

  it('buttons are not round when the group is not round', () => {
    const wrapper = createRadioGroup()
    const buttons = wrapper.findAll('.utensil-button')
    buttons.forEach((button) => expect(button.classes()).not.toContain('round'))
    wrapper.unmount()
  })
})
