import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilToastHost from './UtensilToastHost.vue'

describe('UtensilToastHost', () => {
  it('renders toasts from array', () => {
    const wrapper = mount(UtensilToastHost, {
      props: {
        toasts: [
          { id: 1, message: 'First', show: true, busy: false, dismissible: false, leaving: false },
          { id: 2, message: 'Second', show: true, busy: false, dismissible: false, leaving: false },
        ],
        dismiss: () => {},
        remove: () => {},
      },
    })
    const toasts = wrapper.findAll('.utensil-toast')
    expect(toasts).toHaveLength(2)
    // Toasts are reversed in DOM order so newer toasts stack on top
    expect(toasts[0].text()).toContain('Second')
    expect(toasts[1].text()).toContain('First')
  })

  it('calls dismiss with toast id when close button is clicked', async () => {
    const dismiss = vi.fn()
    const wrapper = mount(UtensilToastHost, {
      props: {
        toasts: [{ id: 42, message: 'Dismiss me', show: true, busy: false, dismissible: true, leaving: false }],
        dismiss,
        remove: () => {},
      },
    })
    await wrapper.find('.utensil-toast-close').trigger('click')
    expect(dismiss).toHaveBeenCalledWith(42)
  })

  it("calls the entry's onDismiss when the close button is clicked", async () => {
    const onDismiss = vi.fn()
    const dismiss = vi.fn()
    const wrapper = mount(UtensilToastHost, {
      props: {
        toasts: [{ id: 7, message: 'Mine', show: true, busy: false, dismissible: true, leaving: false, onDismiss }],
        dismiss,
        remove: () => {},
      },
    })
    await wrapper.find('.utensil-toast-close').trigger('click')
    expect(onDismiss).toHaveBeenCalled()
    expect(dismiss).toHaveBeenCalledWith(7)
  })

  it('renders empty when no toasts', () => {
    const wrapper = mount(UtensilToastHost, {
      props: {
        toasts: [],
        dismiss: () => {},
        remove: () => {},
      },
    })
    expect(wrapper.findAll('.utensil-toast')).toHaveLength(0)
  })
})
