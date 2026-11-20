import { describe, it, expect, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import UtensilPassword from './UtensilPassword.vue'

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

function mountPassword(props: Record<string, unknown> = {}) {
  wrapper = mount(UtensilPassword, { props: { label: 'Password', ...props }, attachTo: document.body })
  return wrapper
}

describe('UtensilPassword', () => {
  it('masks the password behind a toggle named for showing it', () => {
    const password = mountPassword()

    expect(password.find('input').attributes('type')).toBe('password')
    expect(password.find('button').attributes('aria-label')).toBe('Show password')
  })

  it('shows the password from its toggle, and renames the toggle for hiding it', async () => {
    const password = mountPassword()

    await password.find('button').trigger('click')

    expect(password.find('input').attributes('type')).toBe('text')
    expect(password.find('button').attributes('aria-label')).toBe('Hide password')
  })

  it('keeps the password shown while focus moves between the input and its toggle', async () => {
    const password = mountPassword()
    const input = password.find('input')
    const button = password.find('button')

    input.element.focus()
    await button.trigger('click')
    button.element.focus()
    await password.vm.$nextTick()

    expect(input.attributes('type')).toBe('text')
  })

  it('masks the password again when focus leaves the field', async () => {
    const outside = document.createElement('button')
    document.body.append(outside)
    const password = mountPassword()

    password.find('input').element.focus()
    await password.find('button').trigger('click')
    outside.focus()
    await password.vm.$nextTick()

    expect(password.find('input').attributes('type')).toBe('password')
    outside.remove()
  })

  it('takes the toggle names it is given', () => {
    const password = mountPassword({ showPasswordLabel: 'Passwort anzeigen' })

    expect(password.find('button').attributes('aria-label')).toBe('Passwort anzeigen')
  })

  it('is required only when asked, and takes a name of its own', () => {
    expect(mountPassword().find('input').attributes('required')).toBeUndefined()
    wrapper?.unmount()

    const password = mountPassword({ label: undefined, ariaLabel: 'New password', required: true })
    expect(password.find('input').attributes('required')).toBeDefined()
    expect(password.find('input').attributes('aria-label')).toBe('New password')
    expect(password.find('.utensil-password').attributes('aria-label')).toBeUndefined()
  })

  it('puts autocomplete on the input, not the wrapper', () => {
    const password = mountPassword({ autocomplete: 'new-password' })

    expect(password.find('input').attributes('autocomplete')).toBe('new-password')
    expect(password.find('.utensil-password').attributes('autocomplete')).toBeUndefined()
  })
})
