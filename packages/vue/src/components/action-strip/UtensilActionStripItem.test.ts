import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilActionStripItem from './UtensilActionStripItem.vue'

describe('UtensilActionStripItem', () => {
  it('renders the label under the icon', () => {
    const wrapper = mount(UtensilActionStripItem, {
      props: { label: 'Stories', icon: 'cog' },
    })

    expect(wrapper.find('.item-label').text()).toBe('Stories')
    expect(wrapper.find('.item-icon').exists()).toBe(true)
  })

  it('is a real button with pressed state when selected', () => {
    const wrapper = mount(UtensilActionStripItem, {
      props: { label: 'Stories', icon: 'cog', selected: true },
    })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.classes()).toContain('selected')
    expect(wrapper.attributes('aria-pressed')).toBe('true')
  })

  it('disables interaction when disabled', () => {
    const wrapper = mount(UtensilActionStripItem, {
      props: { label: 'Stories', icon: 'cog', disabled: true },
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('emits click when activated', async () => {
    const wrapper = mount(UtensilActionStripItem, {
      props: { label: 'Stories', icon: 'cog' },
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
