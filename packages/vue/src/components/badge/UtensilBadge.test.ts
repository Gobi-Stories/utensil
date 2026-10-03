import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilBadge from './UtensilBadge.vue'

describe('UtensilBadge', () => {
  it('renders with root class', () => {
    const wrapper = mount(UtensilBadge)
    expect(wrapper.find('.utensil-badge').exists()).toBe(true)
  })

  it('renders label prop as text', () => {
    const wrapper = mount(UtensilBadge, {
      props: { label: 'New' },
    })
    expect(wrapper.text()).toBe('New')
  })

  it('renders slot content', () => {
    const wrapper = mount(UtensilBadge, {
      slots: { default: 'Custom Content' },
    })
    expect(wrapper.text()).toBe('Custom Content')
  })

  it('slot content takes priority over label prop', () => {
    const wrapper = mount(UtensilBadge, {
      props: { label: 'Label' },
      slots: { default: 'Slot' },
    })
    expect(wrapper.text()).toBe('Slot')
  })

  it('defaults to solid variation', () => {
    const wrapper = mount(UtensilBadge)
    expect(wrapper.find('.utensil-badge').classes()).toContain('ui-solid')
  })

  it('applies variation class', () => {
    const wrapper = mount(UtensilBadge, {
      props: { variation: 'soft' },
    })
    expect(wrapper.find('.utensil-badge').classes()).toContain('ui-soft')
  })

  it('applies squared class when squared prop is true', () => {
    const wrapper = mount(UtensilBadge, {
      props: { squared: true },
    })
    expect(wrapper.find('.utensil-badge').classes()).toContain('squared')
  })

  it('applies rounded class when rounded prop is true', () => {
    const wrapper = mount(UtensilBadge, {
      props: { rounded: true },
    })
    expect(wrapper.find('.utensil-badge').classes()).toContain('rounded')
  })

  it('does not render icon when icon prop is not provided', () => {
    const wrapper = mount(UtensilBadge)
    expect(wrapper.findComponent({ name: 'UtensilIcon' }).exists()).toBe(false)
  })

  it('renders icon when icon prop is provided', () => {
    const wrapper = mount(UtensilBadge, {
      props: { icon: 'star' },
    })
    expect(wrapper.findComponent({ name: 'UtensilIcon' }).exists()).toBe(true)
  })

  it('does not render label span when label is not provided and no slot', () => {
    const wrapper = mount(UtensilBadge)
    expect(wrapper.find('span').exists()).toBe(false)
  })
})
