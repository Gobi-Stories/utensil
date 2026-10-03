import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilMediaBadge from './UtensilMediaBadge.vue'

describe('UtensilMediaBadge', () => {
  it('renders with utensil-media-badge class on UtensilBadge', () => {
    const wrapper = mount(UtensilMediaBadge, {
      props: { mediaType: 'video' },
    })
    expect(wrapper.find('.utensil-media-badge').exists()).toBe(true)
    expect(wrapper.find('.utensil-badge').exists()).toBe(true)
  })

  it('renders capitalized media type as default text', () => {
    const wrapper = mount(UtensilMediaBadge, {
      props: { mediaType: 'video' },
    })
    expect(wrapper.text()).toContain('Video')
  })

  it('renders slot content instead of media type text', () => {
    const wrapper = mount(UtensilMediaBadge, {
      props: { mediaType: 'image' },
      slots: { default: 'Custom' },
    })
    expect(wrapper.text()).toBe('Custom')
  })

  it('renders icon for each media type', () => {
    const types = ['image', 'video', 'font', 'music']
    for (const mediaType of types) {
      const wrapper = mount(UtensilMediaBadge, {
        props: { mediaType },
      })
      const icon = wrapper.findComponent({ name: 'UtensilIcon' })
      expect(icon.exists()).toBe(true)
      expect(icon.props('icon')).toBe(mediaType)
    }
  })

  it('falls back to file icon for unknown media type', () => {
    const wrapper = mount(UtensilMediaBadge, {
      props: { mediaType: 'unknown' },
    })
    const icon = wrapper.findComponent({ name: 'UtensilIcon' })
    expect(icon.props('icon')).toBe('file')
  })

  it('applies squared class when squared prop is true', () => {
    const wrapper = mount(UtensilMediaBadge, {
      props: { mediaType: 'video', squared: true },
    })
    expect(wrapper.find('.utensil-badge').classes()).toContain('squared')
  })

  it('applies rounded class when rounded prop is true', () => {
    const wrapper = mount(UtensilMediaBadge, {
      props: { mediaType: 'video', rounded: true },
    })
    expect(wrapper.find('.utensil-badge').classes()).toContain('rounded')
  })

  it('handles empty media type string', () => {
    const wrapper = mount(UtensilMediaBadge, {
      props: { mediaType: '' },
    })
    const icon = wrapper.findComponent({ name: 'UtensilIcon' })
    expect(icon.props('icon')).toBe('file')
  })
})
