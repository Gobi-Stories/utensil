import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilAvatar from './UtensilAvatar.vue'

describe('UtensilAvatar', () => {
  it('renders with root class', () => {
    const wrapper = mount(UtensilAvatar, {
      props: { fallback: 'A' },
    })
    expect(wrapper.find('.utensil-avatar').exists()).toBe(true)
  })

  it('has role="img" with aria-label from alt', () => {
    const wrapper = mount(UtensilAvatar, {
      props: { alt: 'User photo', fallback: 'U' },
    })
    const el = wrapper.find('.utensil-avatar')
    expect(el.attributes('role')).toBe('img')
    expect(el.attributes('aria-label')).toBe('User photo')
  })

  it('falls back to fallback text for aria-label when alt is not provided', () => {
    const wrapper = mount(UtensilAvatar, {
      props: { fallback: 'JD' },
    })
    expect(wrapper.find('.utensil-avatar').attributes('aria-label')).toBe('JD')
  })

  it('renders fallback text when no src is provided', () => {
    const wrapper = mount(UtensilAvatar, {
      props: { fallback: 'AB' },
    })
    expect(wrapper.find('.utensil-avatar-fallback').text()).toBe('AB')
  })

  it('renders img element when src is provided', () => {
    const wrapper = mount(UtensilAvatar, {
      props: { src: 'https://example.com/photo.jpg', fallback: 'U' },
    })
    const img = wrapper.find('.utensil-avatar-image')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/photo.jpg')
  })

  it('defaults to soft variation', () => {
    const wrapper = mount(UtensilAvatar, {
      props: { fallback: 'A' },
    })
    expect(wrapper.find('.utensil-avatar').classes()).toContain('ui-soft')
  })

  it('applies solid variation', () => {
    const wrapper = mount(UtensilAvatar, {
      props: { fallback: 'A', variation: 'solid' },
    })
    expect(wrapper.find('.utensil-avatar').classes()).toContain('ui-solid')
  })

  it('defaults to full radius', () => {
    const wrapper = mount(UtensilAvatar, {
      props: { fallback: 'A' },
    })
    expect(wrapper.find('.utensil-avatar').classes()).toContain('radius-full')
  })

  it('applies radius class from prop', () => {
    const wrapper = mount(UtensilAvatar, {
      props: { fallback: 'A', radius: 'medium' },
    })
    expect(wrapper.find('.utensil-avatar').classes()).toContain('radius-medium')
  })

  it('marks image as loaded on load event', async () => {
    const wrapper = mount(UtensilAvatar, {
      props: { src: 'https://example.com/photo.jpg', fallback: 'U' },
    })
    await wrapper.find('.utensil-avatar-image').trigger('load')
    expect(wrapper.find('.utensil-avatar').classes()).toContain('loaded')
    expect(wrapper.find('.utensil-avatar-image').classes()).toContain('loaded')
  })

  it('emits load event when image loads', async () => {
    const wrapper = mount(UtensilAvatar, {
      props: { src: 'https://example.com/photo.jpg', fallback: 'U' },
    })
    await wrapper.find('.utensil-avatar-image').trigger('load')
    expect(wrapper.emitted('load')).toHaveLength(1)
  })

  it('emits error event when image fails', async () => {
    const wrapper = mount(UtensilAvatar, {
      props: { src: 'https://example.com/404.jpg', fallback: 'U' },
    })
    await wrapper.find('.utensil-avatar-image').trigger('error')
    expect(wrapper.emitted('error')).toHaveLength(1)
  })

  it('shows fallback when image has not loaded', () => {
    const wrapper = mount(UtensilAvatar, {
      props: { src: 'https://example.com/photo.jpg', fallback: 'U' },
    })
    expect(wrapper.find('.utensil-avatar-fallback').exists()).toBe(true)
  })

  it('hides fallback after image loads', async () => {
    const wrapper = mount(UtensilAvatar, {
      props: { src: 'https://example.com/photo.jpg', fallback: 'U' },
    })
    await wrapper.find('.utensil-avatar-image').trigger('load')
    expect(wrapper.find('.utensil-avatar-fallback').exists()).toBe(false)
  })

  it('renders custom fallback slot content', () => {
    const wrapper = mount(UtensilAvatar, {
      props: { fallback: 'U' },
      slots: { fallback: '<span class="custom-icon">★</span>' },
    })
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
  })
})
