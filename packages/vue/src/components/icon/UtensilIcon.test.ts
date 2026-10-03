import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilIcon from './UtensilIcon.vue'

describe('UtensilIcon', () => {
  it('renders with root class when icon prop is provided', () => {
    const wrapper = mount(UtensilIcon, {
      props: { icon: 'star' },
    })
    expect(wrapper.find('.utensil-icon').exists()).toBe(true)
  })

  it('renders FontAwesomeIcon when icon prop is provided', () => {
    const wrapper = mount(UtensilIcon, {
      props: { icon: 'star' },
    })
    expect(wrapper.find('.utensil-icon.font-awesome').exists()).toBe(true)
  })

  it('renders slot content when no icon prop is provided', () => {
    const wrapper = mount(UtensilIcon, {
      slots: { default: '<svg><circle r="10" /></svg>' },
    })
    expect(wrapper.find('.utensil-icon.custom').exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('prefers icon prop over slot content', () => {
    const wrapper = mount(UtensilIcon, {
      props: { icon: 'star' },
      slots: { default: '<svg><circle r="10" /></svg>' },
    })
    expect(wrapper.find('.utensil-icon.font-awesome').exists()).toBe(true)
    expect(wrapper.find('.utensil-icon.custom').exists()).toBe(false)
  })

  it('renders nothing when neither icon nor slot is provided', () => {
    const wrapper = mount(UtensilIcon)
    expect(wrapper.find('.utensil-icon').exists()).toBe(false)
  })

  it('applies colored class when color prop is provided', () => {
    const wrapper = mount(UtensilIcon, {
      props: { icon: 'star', color: 'pen' },
    })
    expect(wrapper.find('.utensil-icon').classes()).toContain('colored')
  })

  it('applies colored class to custom slot when color prop is provided', () => {
    const wrapper = mount(UtensilIcon, {
      props: { color: 'pen' },
      slots: { default: '<svg><circle r="10" /></svg>' },
    })
    expect(wrapper.find('.utensil-icon.custom').classes()).toContain('colored')
  })

  it('sets aria-hidden on font-awesome icon', () => {
    const wrapper = mount(UtensilIcon, {
      props: { icon: 'star' },
    })
    expect(wrapper.find('.utensil-icon').attributes('aria-hidden')).toBe('true')
  })

  it('sets aria-hidden on custom slot icon', () => {
    const wrapper = mount(UtensilIcon, {
      slots: { default: '<svg><circle r="10" /></svg>' },
    })
    expect(wrapper.find('.utensil-icon.custom').attributes('aria-hidden')).toBe('true')
  })
})
