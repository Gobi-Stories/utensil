import { describe, it, expect, vi } from 'vitest'
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

  it('announces a toggle that is off as not pressed', () => {
    const wrapper = mount(UtensilToggleButton, { props: { icon: 'star', modelValue: false } })
    expect(wrapper.find('button').attributes('aria-pressed')).toBe('false')
  })

  it('is a radio with aria-checked, and no aria-pressed, in the radio role', async () => {
    const wrapper = mount(UtensilToggleButton, { props: { icon: 'star', modelValue: false, role: 'radio' } })
    const button = wrapper.find('button')
    expect(button.attributes('role')).toBe('radio')
    expect(button.attributes('aria-checked')).toBe('false')
    expect(button.attributes('aria-pressed')).toBeUndefined()
    expect(button.classes()).not.toContain('selected')

    await wrapper.setProps({ modelValue: true })
    expect(button.attributes('aria-checked')).toBe('true')
    expect(button.classes()).toContain('selected')
  })

  it('renders label when provided', () => {
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', label: 'Star' },
    })
    expect(wrapper.find('.utensil-toggle-button-label').text()).toBe('Star')
  })

  it('names the button by its label, and hides the visible copy so it is read once', () => {
    const wrapper = mount(UtensilToggleButton, { props: { icon: 'star', label: 'Star' } })

    expect(wrapper.find('button').text()).toBe('Star')
    expect(wrapper.find('.utensil-toggle-button-label').attributes('aria-hidden')).toBe('true')
  })

  it('reads the visible label where something else names the button', () => {
    const named = mount(UtensilToggleButton, {
      props: { icon: 'star', label: 'Star' },
      attrs: { 'aria-label': 'Favorite' },
    })
    const slotted = mount(UtensilToggleButton, {
      props: { icon: 'star', label: 'Star' },
      slots: { default: 'Favorite' },
    })

    expect(named.find('.utensil-toggle-button-label').attributes('aria-hidden')).toBeUndefined()
    expect(slotted.find('.utensil-toggle-button-label').attributes('aria-hidden')).toBeUndefined()
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

  it('stays focusable but neither toggles nor emits click when aria-disabled', async () => {
    const onClick = vi.fn()
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', modelValue: false, ariaDisabled: true },
      attrs: { onClick },
    })
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(onClick).not.toHaveBeenCalled()
    expect(button.attributes('aria-disabled')).toBe('true')
    expect(button.attributes('disabled')).toBeUndefined()
    expect(wrapper.find('.utensil-toggle-button').classes()).toContain('disabled')
  })

  it('emits click without toggling when blocked, announced as an ordinary toggle described by its reason', async () => {
    const onClick = vi.fn()
    const wrapper = mount(UtensilToggleButton, {
      props: { icon: 'star', modelValue: false, blocked: true, blockedDescribedBy: 'why' },
      attrs: { onClick },
    })
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(onClick).toHaveBeenCalledOnce()
    expect(button.attributes('aria-disabled')).toBeUndefined()
    expect(button.attributes('aria-pressed')).toBe('false')
    expect(button.attributes('aria-describedby')).toBe('why')
    expect(wrapper.find('.utensil-toggle-button').classes()).toEqual(expect.arrayContaining(['disabled', 'blocked']))
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
