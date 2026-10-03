import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilLabel from './UtensilLabel.vue'

describe('UtensilLabel', () => {
  it('renders with root class', () => {
    const wrapper = mount(UtensilLabel)
    expect(wrapper.find('.utensil-label').exists()).toBe(true)
  })

  it('renders text prop as content', () => {
    const wrapper = mount(UtensilLabel, {
      props: { text: 'GET' },
    })
    expect(wrapper.text()).toBe('GET')
  })

  it('renders slot content', () => {
    const wrapper = mount(UtensilLabel, {
      slots: { default: 'POST' },
    })
    expect(wrapper.text()).toBe('POST')
  })

  it('slot content takes priority over text prop', () => {
    const wrapper = mount(UtensilLabel, {
      props: { text: 'GET' },
      slots: { default: 'POST' },
    })
    expect(wrapper.text()).toBe('POST')
  })

  it('defaults to soft variation', () => {
    const wrapper = mount(UtensilLabel)
    expect(wrapper.find('.utensil-label').classes()).toContain('ui-soft')
  })

  it('applies variation class', () => {
    const wrapper = mount(UtensilLabel, {
      props: { variation: 'solid' },
    })
    expect(wrapper.find('.utensil-label').classes()).toContain('ui-solid')
  })
})
