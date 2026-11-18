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

  it('is named by its title', () => {
    const wrapper = mount(UtensilDialog, { props: { title: 'Rename story' } })

    const title = wrapper.find('.dialog-title')
    expect(wrapper.find('dialog').attributes('aria-labelledby')).toBe(title.attributes('id'))
    expect(title.text()).toBe('Rename story')
  })

  it('leaves its name to the consumer without a title', () => {
    const wrapper = mount(UtensilDialog, { attrs: { 'aria-label': 'Settings' } })

    expect(wrapper.find('dialog').attributes('aria-labelledby')).toBeUndefined()
    expect(wrapper.find('dialog').attributes('aria-label')).toBe('Settings')
  })
})
