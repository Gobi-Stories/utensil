import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilCard from './UtensilCard.vue'

describe('UtensilCard', () => {
  it('renders with default classes', () => {
    const wrapper = mount(UtensilCard)
    const card = wrapper.find('.utensil-card')
    expect(card.exists()).toBe(true)
    expect(card.classes()).toContain('ui-unstyled')
    expect(card.classes()).toContain('pencil')
  })

  it('renders slot content', () => {
    const wrapper = mount(UtensilCard, {
      slots: { default: '<p>Card content</p>' },
    })
    expect(wrapper.find('p').text()).toBe('Card content')
  })

  it('applies variation class', () => {
    const wrapper = mount(UtensilCard, {
      props: { variation: 'surface' },
    })
    expect(wrapper.find('.utensil-card').classes()).toContain('ui-surface')
  })

  it('applies pencil class when not highlighted', () => {
    const wrapper = mount(UtensilCard, {
      props: { variation: 'surface' },
    })
    expect(wrapper.find('.utensil-card').classes()).toContain('pencil')
  })

  it('removes pencil class when highlighted is true', () => {
    const wrapper = mount(UtensilCard, {
      props: { variation: 'surface', highlighted: true },
    })
    expect(wrapper.find('.utensil-card').classes()).not.toContain('pencil')
  })

  it('applies pencil class when highlighted is false', () => {
    const wrapper = mount(UtensilCard, {
      props: { variation: 'soft', highlighted: false },
    })
    expect(wrapper.find('.utensil-card').classes()).toContain('pencil')
  })

  it('does not apply interactive class by default', () => {
    const wrapper = mount(UtensilCard)
    expect(wrapper.find('.utensil-card').classes()).not.toContain('interactive')
  })

  it('applies interactive class when interactive is true', () => {
    const wrapper = mount(UtensilCard, {
      props: { variation: 'surface', interactive: true },
    })
    expect(wrapper.find('.utensil-card').classes()).toContain('interactive')
  })

  it('applies both non-pencil and interactive classes when highlighted and interactive', () => {
    const wrapper = mount(UtensilCard, {
      props: { variation: 'outline', highlighted: true, interactive: true },
    })
    const classes = wrapper.find('.utensil-card').classes()
    expect(classes).not.toContain('pencil')
    expect(classes).toContain('interactive')
  })
})
