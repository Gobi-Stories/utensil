import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilDialog from './UtensilDialog.vue'

describe('UtensilDialog', () => {
  it('renders a footer message before the buttons', () => {
    // Mounted closed: jsdom has no showModal(), and the footer renders either way.
    const wrapper = mount(UtensilDialog, { slots: { message: '<p class="notice">Something went wrong</p>' } })

    const footer = wrapper.find('.dialog-footer')
    expect(footer.find('.footer-message .notice').text()).toBe('Something went wrong')
    expect(footer.element.firstElementChild?.classList.contains('footer-message')).toBe(true)
  })

  it('has no message container without a message', () => {
    const wrapper = mount(UtensilDialog)

    expect(wrapper.find('.footer-message').exists()).toBe(false)
  })
})
