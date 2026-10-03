import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilDivider from './UtensilDivider.vue'

describe('UtensilDivider', () => {
  it('renders a horizontal separator by default', () => {
    const wrapper = mount(UtensilDivider)
    const el = wrapper.find('.utensil-divider')

    expect(el.exists()).toBe(true)
    expect(el.attributes('role')).toBe('separator')
    expect(el.attributes('aria-orientation')).toBe('horizontal')
    expect(el.classes()).not.toContain('vertical')
  })

  it('renders a vertical separator when vertical prop is true', () => {
    const wrapper = mount(UtensilDivider, {
      props: { vertical: true },
    })
    const el = wrapper.find('.utensil-divider')

    expect(el.attributes('aria-orientation')).toBe('vertical')
    expect(el.classes()).toContain('vertical')
  })

  it('renders label in horizontal orientation', () => {
    const wrapper = mount(UtensilDivider, {
      props: { label: 'or' },
    })
    const el = wrapper.find('.utensil-divider')

    expect(el.classes()).toContain('has-label')
    expect(wrapper.find('.utensil-divider-label').text()).toBe('or')
  })

  it('ignores label in vertical orientation', () => {
    const wrapper = mount(UtensilDivider, {
      props: { vertical: true, label: 'or' },
    })
    const el = wrapper.find('.utensil-divider')

    expect(el.classes()).not.toContain('has-label')
    expect(wrapper.find('.utensil-divider-label').exists()).toBe(false)
  })

  it('does not add has-label class when no label is provided', () => {
    const wrapper = mount(UtensilDivider)
    expect(wrapper.find('.utensil-divider').classes()).not.toContain('has-label')
  })
})
