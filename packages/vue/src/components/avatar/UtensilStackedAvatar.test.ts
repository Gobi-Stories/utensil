import { describe, it, expect } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import UtensilAvatarStack from './UtensilAvatarStack.vue'
import UtensilStackedAvatar from './UtensilStackedAvatar.vue'

function mountInStack(stackProps: Record<string, unknown> = {}, avatarProps: Record<string, unknown> = {}) {
  const SlotComponent = defineComponent({
    components: { UtensilStackedAvatar },
    template: '<UtensilStackedAvatar v-bind="avatarProps" />',
    setup() {
      return { avatarProps }
    },
  })
  return mount(UtensilAvatarStack, {
    props: stackProps,
    slots: {
      default: SlotComponent,
    },
  })
}

describe('UtensilStackedAvatar', () => {
  it('renders a UtensilAvatar inside the stack', () => {
    const wrapper = mountInStack({}, { fallback: 'A' })
    expect(wrapper.find('.utensil-avatar').exists()).toBe(true)
  })

  it('always uses solid variation', () => {
    const wrapper = mountInStack({}, { fallback: 'A' })
    expect(wrapper.find('.utensil-avatar').classes()).toContain('ui-solid')
  })

  it('inherits radius from stack', () => {
    const wrapper = mountInStack({ radius: 'medium' }, { fallback: 'A' })
    expect(wrapper.find('.utensil-avatar').classes()).toContain('radius-medium')
  })

  it('allows per-avatar radius override', () => {
    const wrapper = mountInStack({ radius: 'full' }, { fallback: 'A', radius: 'small' })
    expect(wrapper.find('.utensil-avatar').classes()).toContain('radius-small')
  })

  it('defaults to full radius', () => {
    const wrapper = mountInStack({}, { fallback: 'A' })
    expect(wrapper.find('.utensil-avatar').classes()).toContain('radius-full')
  })

  it('falls back to defaults when used outside UtensilAvatarStack', () => {
    const wrapper = mount(UtensilStackedAvatar, {
      props: { fallback: 'A' },
    })
    const avatar = wrapper.find('.utensil-avatar')
    expect(avatar.classes()).toContain('ui-solid')
    expect(avatar.classes()).toContain('radius-full')
  })
})
