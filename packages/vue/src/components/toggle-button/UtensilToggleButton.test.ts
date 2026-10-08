import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilToggleButton from './UtensilToggleButton.vue'

describe('UtensilToggleButton', () => {
  it('renders with required icon prop', () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star' },
    })
    expect(wrapper.find('.utensil-toggle-button').exists()).toBe(true)
  })

  it('toggles model value on click', async () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', modelValue: false },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('toggles from true to false', async () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', modelValue: true },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('applies selected class to button when model is true', () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', modelValue: true },
    })
    expect(wrapper.find('button').classes()).toContain('selected')
  })

  it('does not apply selected class to button when model is false', () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', modelValue: false },
    })
    expect(wrapper.find('button').classes()).not.toContain('selected')
  })

  it('sets aria-pressed on the button', () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', modelValue: true },
    })
    expect(wrapper.find('button').attributes('aria-pressed')).toBe('true')
  })

  it('renders label when provided', () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', label: 'Star' },
    })
    expect(wrapper.find('.utensil-toggle-button-label').text()).toBe('Star')
  })

  it('does not render label when not provided', () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star' },
    })
    expect(wrapper.find('.utensil-toggle-button-label').exists()).toBe(false)
  })

  it('applies label-start class when labelPosition is start', () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', label: 'Star', labelPosition: 'start' },
    })
    expect(wrapper.find('.utensil-toggle-button').classes()).toContain('label-start')
  })

  it('applies label-end class when labelPosition is end', () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', label: 'Star', labelPosition: 'end' },
    })
    expect(wrapper.find('.utensil-toggle-button').classes()).toContain('label-end')
  })

  it('does not toggle when disabled', async () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', modelValue: false, disabled: true },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('stays clickable without toggling when aria-disabled', async () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', modelValue: false, ariaDisabled: true },
    })
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(button.attributes('aria-disabled')).toBe('true')
    expect(button.attributes('disabled')).toBeUndefined()
    expect(wrapper.find('.utensil-toggle-button').classes()).toContain('disabled')
  })

  it('applies disabled class when disabled', () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', disabled: true },
    })
    expect(wrapper.find('.utensil-toggle-button').classes()).toContain('disabled')
  })

  it('toggles when label is clicked', async () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', modelValue: false, label: 'Star' },
    })
    await wrapper.find('.utensil-toggle-button-label').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('defaults variation to soft', () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star' },
    })
    expect(wrapper.find('button').classes()).toContain('ui-soft')
  })

  it('passes variation prop to button', () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', variation: 'soft' },
    })
    expect(wrapper.find('button').classes()).toContain('ui-soft')
  })

  it('passes round prop to button', () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', round: true },
    })
    expect(wrapper.find('button').classes()).toContain('round')
  })

  it('uses text variation when solid and off', () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', variation: 'solid', modelValue: false },
    })
    expect(wrapper.find('button').classes()).toContain('ui-text')
    expect(wrapper.find('button').classes()).not.toContain('ui-solid')
  })

  it('uses solid variation when solid and on', () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', variation: 'solid', modelValue: true },
    })
    expect(wrapper.find('button').classes()).toContain('ui-solid')
    expect(wrapper.find('button').classes()).not.toContain('ui-text')
  })

  it('switches from text to solid when toggled on with solid variation', async () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', variation: 'solid', modelValue: false },
    })
    expect(wrapper.find('button').classes()).toContain('ui-text')
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('uses onVariation when on', () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', variation: 'outline', onVariation: 'solid', modelValue: true },
    })
    expect(wrapper.find('button').classes()).toContain('ui-solid')
    expect(wrapper.find('button').classes()).not.toContain('ui-outline')
  })

  it('ignores onVariation when off', () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', variation: 'outline', onVariation: 'solid', modelValue: false },
    })
    expect(wrapper.find('button').classes()).toContain('ui-outline')
  })

  it('uses offVariation when off', () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', variation: 'solid', offVariation: 'outline', modelValue: false },
    })
    expect(wrapper.find('button').classes()).toContain('ui-outline')
    expect(wrapper.find('button').classes()).not.toContain('ui-text')
  })

  it('ignores offVariation when on', () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', variation: 'solid', offVariation: 'outline', modelValue: true },
    })
    expect(wrapper.find('button').classes()).toContain('ui-solid')
  })

  it('switches between onColor and offColor with the model', async () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', color: 'error', onColor: 'success', offColor: 'pencil', modelValue: false },
    })
    expect(wrapper.findComponent({ name: 'UtensilButton' }).props('color')).toBe('pencil')
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.findComponent({ name: 'UtensilButton' }).props('color')).toBe('success')
  })

  it('falls back to color in both states without onColor and offColor', async () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', color: 'error', modelValue: false },
    })
    expect(wrapper.findComponent({ name: 'UtensilButton' }).props('color')).toBe('error')
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.findComponent({ name: 'UtensilButton' }).props('color')).toBe('error')
  })
})
