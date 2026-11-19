import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import UtensilTheme from '../../theme/UtensilTheme.vue'
import type { ThemeConfig, UtensilColors } from '../../theme/utensil-theme'
import UtensilInput from './UtensilInput.vue'

// Utensil's default theme maps every variant to gray; a theme with an orange warning tells the pens apart
interface TestThemeConfig extends ThemeConfig {
  color: UtensilColors & { orange: true }
}

const TestTheme = UtensilTheme<TestThemeConfig>

describe('UtensilInput', () => {
  it('is valid by default', () => {
    const wrapper = mount(UtensilInput, { props: { modelValue: 'sam@example.com' } })

    expect(wrapper.find('.utensil-input-control').classes()).not.toContain('invalid')
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('false')
  })

  it('marks an invalid input and announces its description as the error', () => {
    const wrapper = mount(UtensilInput, {
      props: { modelValue: 'sam@', ariaInvalid: true, description: 'Enter a valid email address.' },
    })

    const input = wrapper.find('input')
    const description = wrapper.find('p.description')
    expect(wrapper.find('.utensil-input-control').classes()).toContain('invalid')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(description.text()).toBe('Enter a valid email address.')
    expect(input.attributes('aria-describedby')).toBe(description.attributes('id'))
  })

  it('takes the warning variant as its pen only while invalid', async () => {
    const wrapper = mount({
      props: { invalid: Boolean },
      setup: (props: { invalid: boolean }) => () =>
        h(TestTheme, { variants: { warning: 'orange' } }, () => h(UtensilInput, { ariaInvalid: props.invalid })),
    })
    const control = () => wrapper.find('.utensil-input-control').classes()
    const validClasses = control()

    await wrapper.setProps({ invalid: true })

    expect(control().filter((name) => !validClasses.includes(name) && name !== 'invalid')).not.toHaveLength(0)

    await wrapper.setProps({ invalid: false })

    expect(control()).toEqual(validClasses)
  })

  it('renders no description line by default', () => {
    const wrapper = mount(UtensilInput, { props: { label: 'Website' } })

    expect(wrapper.find('p.description').exists()).toBe(false)
  })

  it('holds an empty description line when asked to reserve one', () => {
    const wrapper = mount(UtensilInput, { props: { label: 'Website', reserveDescription: true } })

    expect(wrapper.find('p.description').exists()).toBe(true)
    expect(wrapper.find('p.description').text()).toBe('')
    expect(wrapper.find('input').attributes('aria-describedby')).toBeUndefined()
  })

  it('describes the input with a description shown in the reserved line', () => {
    const wrapper = mount(UtensilInput, {
      props: { label: 'Website', reserveDescription: true, description: 'Enter a web address', ariaInvalid: true },
    })
    const description = wrapper.find('p.description')

    expect(description.text()).toBe('Enter a web address')
    expect(wrapper.find('input').attributes('aria-describedby')).toBe(description.attributes('id'))
  })

  it('limits the input to its maxlength', () => {
    const wrapper = mount(UtensilInput, { props: { label: 'First name', maxlength: 64 } })

    expect(wrapper.find('input').attributes('maxlength')).toBe('64')
  })

  it('draws a decorative icon that is no button', () => {
    const wrapper = mount(UtensilInput, { props: { icon: 'search' } })

    expect(wrapper.find('.icon-box .utensil-icon').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('makes an icon with an iconClick listener a named button after the input', async () => {
    const wrapper = mount(UtensilInput, {
      props: { icon: 'eye', iconPosition: 'end', iconLabel: 'Show password', onIconClick: () => {} },
    })

    const button = wrapper.find('button')
    expect(button.attributes('type')).toBe('button')
    expect(button.attributes('aria-label')).toBe('Show password')
    // After the input in the DOM, so after it in the tab order
    const input = wrapper.find('input').element
    expect(input.compareDocumentPosition(button.element) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    // Enter and Space on a button fire click
    await button.trigger('click')
    expect(wrapper.emitted('iconClick')).toHaveLength(1)
  })

  it('disables the icon button with the input', () => {
    const wrapper = mount(UtensilInput, {
      props: { icon: 'eye', iconLabel: 'Show password', disabled: true, onIconClick: () => {} },
    })

    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })
})
