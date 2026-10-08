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
})
