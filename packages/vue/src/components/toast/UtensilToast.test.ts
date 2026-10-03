import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilToast from './UtensilToast.vue'

describe('UtensilToast', () => {
  it('renders message text', () => {
    const wrapper = mount(UtensilToast, {
      props: { show: true, message: 'Hello world' },
    })
    expect(wrapper.text()).toContain('Hello world')
  })

  it('is hidden when show is false', () => {
    const wrapper = mount(UtensilToast, {
      props: { show: false, message: 'Hidden' },
    })
    expect(wrapper.find('.utensil-toast').exists()).toBe(false)
  })

  it('shows spinner when busy is true', () => {
    const wrapper = mount(UtensilToast, {
      props: { show: true, message: 'Loading', busy: true },
    })
    expect(wrapper.find('.utensil-spinner').exists()).toBe(true)
  })

  it('shows progress bar when progress is defined', () => {
    const wrapper = mount(UtensilToast, {
      props: { show: true, message: 'Uploading', progress: 0.5 },
    })
    expect(wrapper.find('.utensil-progress-bar').exists()).toBe(true)
  })

  it('renders the body as a button that calls onClick when activated', async () => {
    const onClick = vi.fn()
    const wrapper = mount(UtensilToast, {
      props: { show: true, message: 'Open me', onClick },
    })
    const body = wrapper.find('button.utensil-toast-content')
    expect(body.exists()).toBe(true)
    await body.trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders the body as plain content without onClick', () => {
    const wrapper = mount(UtensilToast, {
      props: { show: true, message: 'Read me' },
    })
    expect(wrapper.find('button.utensil-toast-content').exists()).toBe(false)
    expect(wrapper.find('div.utensil-toast-content').exists()).toBe(true)
  })

  it('shows close button when dismissible is true', () => {
    const wrapper = mount(UtensilToast, {
      props: { show: true, message: 'Dismiss me', dismissible: true },
    })
    expect(wrapper.find('.utensil-toast-close').exists()).toBe(true)
  })

  it('calls onDismiss when close button is clicked', async () => {
    const onDismiss = vi.fn()
    const wrapper = mount(UtensilToast, {
      props: { show: true, message: 'Dismiss me', dismissible: true, onDismiss },
    })
    await wrapper.find('.utensil-toast-close').trigger('click')
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('shows action button when action is provided', () => {
    const wrapper = mount(UtensilToast, {
      props: {
        show: true,
        message: 'Deleted',
        action: { label: 'Undo', onAction: vi.fn() },
      },
    })
    expect(wrapper.find('.utensil-button').exists()).toBe(true)
    expect(wrapper.text()).toContain('Undo')
  })

  it('calls onAction when action button is clicked', async () => {
    const onAction = vi.fn()
    const wrapper = mount(UtensilToast, {
      props: {
        show: true,
        message: 'Deleted',
        action: { label: 'Undo', onAction },
      },
    })
    await wrapper.find('.utensil-button').trigger('click')
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('hides spinner when progress is defined even if busy is true', () => {
    const wrapper = mount(UtensilToast, {
      props: { show: true, message: 'Uploading', busy: true, progress: 0.5 },
    })
    expect(wrapper.find('.utensil-spinner').exists()).toBe(false)
    expect(wrapper.find('.utensil-progress-bar').exists()).toBe(true)
  })

  it('has interactive class when action is provided', () => {
    const wrapper = mount(UtensilToast, {
      props: {
        show: true,
        message: 'Test',
        action: { label: 'Undo', onAction: vi.fn() },
      },
    })
    expect(wrapper.find('.utensil-toast').classes()).toContain('interactive')
  })

  it('has interactive class when dismissible', () => {
    const wrapper = mount(UtensilToast, {
      props: { show: true, message: 'Test', dismissible: true },
    })
    expect(wrapper.find('.utensil-toast').classes()).toContain('interactive')
  })
})
