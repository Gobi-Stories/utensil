import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilModal from './UtensilModal.vue'

describe('UtensilModal', () => {
  it('applies the blur class by default', () => {
    const wrapper = mount(UtensilModal)
    expect(wrapper.find('.utensil-modal').classes()).toContain('blur')
  })

  it('has no blur class when the blur prop is unset', () => {
    const wrapper = mount(UtensilModal, { props: { blur: false } })
    expect(wrapper.find('.utensil-modal').classes()).not.toContain('blur')
  })

  it('lets Escape close the modal by default', () => {
    const wrapper = mount(UtensilModal)
    const cancel = new Event('cancel', { cancelable: true })
    wrapper.find('dialog').element.dispatchEvent(cancel)
    expect(cancel.defaultPrevented).toBe(false)
    expect(wrapper.emitted('closing')).toHaveLength(1)
  })

  it('holds the modal open on Escape when closeOnEscape is off', () => {
    const wrapper = mount(UtensilModal, { props: { closeOnEscape: false } })
    const cancel = new Event('cancel', { cancelable: true })
    wrapper.find('dialog').element.dispatchEvent(cancel)
    expect(cancel.defaultPrevented).toBe(true)
    expect(wrapper.emitted('closing')).toBeUndefined()
  })

  it('still closes on request when closeOnEscape is off', () => {
    const wrapper = mount(UtensilModal, { props: { closeOnEscape: false } })
    const dialog = wrapper.find('dialog').element as HTMLDialogElement
    let cancel: Event | undefined
    // requestClose fires cancel before closing, exactly as Escape does
    dialog.requestClose = () => {
      cancel = new Event('cancel', { cancelable: true })
      dialog.dispatchEvent(cancel)
    }
    ;(wrapper.vm as unknown as { close(): void }).close()

    expect(cancel?.defaultPrevented).toBe(false)
    expect(wrapper.emitted('closing')).toHaveLength(1)
  })
})
