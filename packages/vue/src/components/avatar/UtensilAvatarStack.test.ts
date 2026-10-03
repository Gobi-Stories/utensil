import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilAvatarStack from './UtensilAvatarStack.vue'

describe('UtensilAvatarStack', () => {
  it('renders with root class', () => {
    const wrapper = mount(UtensilAvatarStack)
    expect(wrapper.find('.utensil-avatar-stack').exists()).toBe(true)
  })

  it('sets stack overlap CSS variable from prop', () => {
    const wrapper = mount(UtensilAvatarStack, {
      props: { overlap: 3 },
    })
    expect(wrapper.find('.utensil-avatar-stack').attributes('style')).toContain(
      '--stack-overlap: calc(-1 * var(--space-3))',
    )
  })

  it('defaults overlap to 2', () => {
    const wrapper = mount(UtensilAvatarStack)
    expect(wrapper.find('.utensil-avatar-stack').attributes('style')).toContain(
      '--stack-overlap: calc(-1 * var(--space-2))',
    )
  })

  it('renders default slot content', () => {
    const wrapper = mount(UtensilAvatarStack, {
      slots: { default: '<span class="child">A</span>' },
    })
    expect(wrapper.find('.child').exists()).toBe(true)
  })

  it('renders append slot content', () => {
    const wrapper = mount(UtensilAvatarStack, {
      slots: { append: '<span class="extra">+5</span>' },
    })
    expect(wrapper.find('.extra').exists()).toBe(true)
  })
})
