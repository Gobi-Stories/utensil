import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilConfirm from './UtensilConfirm.vue'

describe('UtensilConfirm', () => {
  // Mounted closed: jsdom has no showModal(), and the dialog renders either way.
  it('is an alert dialog named by its title and described by its message', () => {
    const wrapper = mount(UtensilConfirm, { props: { title: 'Delete story', message: 'This cannot be undone.' } })

    const dialog = wrapper.find('dialog')
    expect(dialog.attributes('role')).toBe('alertdialog')
    expect(dialog.attributes('aria-labelledby')).toBe(wrapper.find('.dialog-title').attributes('id'))
    const description = wrapper.find(`#${dialog.attributes('aria-describedby')}`)
    expect(description.text()).toBe('This cannot be undone.')
  })

  it('describes itself by custom message content', () => {
    const wrapper = mount(UtensilConfirm, {
      props: { title: 'Delete story' },
      slots: { message: '<p class="custom">Delete <b>Launch</b>?</p>' },
    })

    const description = wrapper.find(`#${wrapper.find('dialog').attributes('aria-describedby')}`)
    expect(description.find('.custom').text()).toBe('Delete Launch?')
  })
})
