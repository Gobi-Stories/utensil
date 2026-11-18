import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilToggleSwitch from './UtensilToggleSwitch.vue'

describe('UtensilToggleSwitch', () => {
  it('renders a native checkbox with the switch role', () => {
    const wrapper = mount(UtensilToggleSwitch)
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('checkbox')
    expect(input.attributes('role')).toBe('switch')
  })

  it('reflects the on state on the input from the first render', () => {
    const wrapper = mount(UtensilToggleSwitch, { props: { modelValue: 'dark', onValue: 'dark', offValue: 'light' } })
    expect(wrapper.find<HTMLInputElement>('input').element.checked).toBe(true)
  })

  it('reflects the off state on the input', () => {
    const wrapper = mount(UtensilToggleSwitch, { props: { modelValue: false } })
    expect(wrapper.find<HTMLInputElement>('input').element.checked).toBe(false)
  })

  it('emits the on value when toggled on', async () => {
    const wrapper = mount(UtensilToggleSwitch, { props: { modelValue: 'light', onValue: 'dark', offValue: 'light' } })
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['dark'])
  })

  it('emits the off value when toggled off', async () => {
    const wrapper = mount(UtensilToggleSwitch, { props: { modelValue: true } })
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('toggles on Enter, preventing its default action so it toggles once', async () => {
    const wrapper = mount(UtensilToggleSwitch, { props: { modelValue: false } })
    const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true })
    wrapper.find('input').element.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('does not toggle when disabled', async () => {
    const wrapper = mount(UtensilToggleSwitch, { props: { modelValue: false, disabled: true } })
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('names the switch with its label', () => {
    const wrapper = mount(UtensilToggleSwitch, { props: { label: 'Dark mode' } })
    const label = wrapper.find('.utensil-toggle-switch-label')
    expect(label.text()).toBe('Dark mode')
    expect(label.attributes('for')).toBe(wrapper.find('input').attributes('id'))
  })

  it('uses the given id so an outside label can name it', () => {
    const wrapper = mount(UtensilToggleSwitch, { props: { id: 'dark-mode' } })
    expect(wrapper.find('input').attributes('id')).toBe('dark-mode')
  })

  it('names the switch with ariaLabel', () => {
    const wrapper = mount(UtensilToggleSwitch, { props: { ariaLabel: 'Mute' } })
    expect(wrapper.find('input').attributes('aria-label')).toBe('Mute')
  })

  it('hides the drawn switch from assistive technology', () => {
    const wrapper = mount(UtensilToggleSwitch)
    expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
  })
})
