import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilCheckbox from './UtensilCheckbox.vue'

describe('UtensilCheckbox', () => {
  it('renders the checkbox', () => {
    const wrapper = mount(UtensilCheckbox)
    expect(wrapper.find('.utensil-checkbox').exists()).toBe(true)
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
  })

  it('toggles model value on click', async () => {
    const wrapper = mount(UtensilCheckbox, {
      props: { modelValue: false },
    })
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('toggles from true to false', async () => {
    const wrapper = mount(UtensilCheckbox, {
      props: { modelValue: true },
    })
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('applies checked class when model is true', () => {
    const wrapper = mount(UtensilCheckbox, {
      props: { modelValue: true },
    })
    expect(wrapper.find('.utensil-checkbox').classes()).toContain('checked')
  })

  it('does not apply checked class when model is false', () => {
    const wrapper = mount(UtensilCheckbox, {
      props: { modelValue: false },
    })
    expect(wrapper.find('.utensil-checkbox').classes()).not.toContain('checked')
  })

  it('renders label when provided', () => {
    const wrapper = mount(UtensilCheckbox, {
      props: { label: 'Accept terms' },
    })
    expect(wrapper.find('.utensil-checkbox-label').text()).toBe('Accept terms')
  })

  it('does not render label span when not provided', () => {
    const wrapper = mount(UtensilCheckbox)
    expect(wrapper.find('.utensil-checkbox-label').exists()).toBe(false)
  })

  it('renders slot content when no label prop', () => {
    const wrapper = mount(UtensilCheckbox, {
      slots: { default: '<span class="custom">Custom</span>' },
    })
    expect(wrapper.find('.custom').exists()).toBe(true)
  })

  it('applies label-start class when labelPosition is start', () => {
    const wrapper = mount(UtensilCheckbox, {
      props: { label: 'Test', labelPosition: 'start' },
    })
    expect(wrapper.find('.utensil-checkbox').classes()).toContain('label-start')
  })

  it('does not apply label-start class when labelPosition is end', () => {
    const wrapper = mount(UtensilCheckbox, {
      props: { label: 'Test', labelPosition: 'end' },
    })
    expect(wrapper.find('.utensil-checkbox').classes()).not.toContain('label-start')
  })

  it('does not toggle when disabled', async () => {
    const wrapper = mount(UtensilCheckbox, {
      props: { modelValue: false, disabled: true },
    })
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('applies disabled class when disabled', () => {
    const wrapper = mount(UtensilCheckbox, {
      props: { disabled: true },
    })
    expect(wrapper.find('.utensil-checkbox').classes()).toContain('disabled')
  })

  it('sets disabled attribute on input when disabled', () => {
    const wrapper = mount(UtensilCheckbox, {
      props: { disabled: true },
    })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('applies indeterminate class', () => {
    const wrapper = mount(UtensilCheckbox, {
      props: { indeterminate: true },
    })
    expect(wrapper.find('.utensil-checkbox').classes()).toContain('indeterminate')
  })

  it('shows dash indicator when indeterminate', () => {
    const wrapper = mount(UtensilCheckbox, {
      props: { indeterminate: true },
    })
    const indicator = wrapper.find('.indicator')
    expect(indicator.attributes('d')).toBe('M4 8h8')
  })

  it('shows checkmark indicator when not indeterminate', () => {
    const wrapper = mount(UtensilCheckbox, {
      props: { indeterminate: false },
    })
    const indicator = wrapper.find('.indicator')
    expect(indicator.attributes('d')).toBe('M4 8l3 3 5-6')
  })

  it('toggles via enter key', async () => {
    const wrapper = mount(UtensilCheckbox, {
      props: { modelValue: false },
    })
    await wrapper.find('input').trigger('keydown.enter')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })
})
