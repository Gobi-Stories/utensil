import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import UtensilTheme from '../../theme/UtensilTheme.vue'
import type { ThemeConfig, UtensilColors } from '../../theme/utensil-theme'
import UtensilTextArea from './UtensilTextArea.vue'

// Utensil's default theme maps every variant to gray; a theme with an orange warning tells the pens apart
interface TestThemeConfig extends ThemeConfig {
  color: UtensilColors & { orange: true }
}

const TestTheme = UtensilTheme<TestThemeConfig>

describe('UtensilTextArea', () => {
  it('binds its value with v-model', async () => {
    const wrapper = mount(UtensilTextArea, { props: { modelValue: 'Hello' } })

    expect(wrapper.find('textarea').element.value).toBe('Hello')

    await wrapper.find('textarea').setValue('Hello there')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Hello there'])
  })

  it('labels the text area', () => {
    const wrapper = mount(UtensilTextArea, { props: { label: 'Notes' } })

    expect(wrapper.find('label').attributes('for')).toBe(wrapper.find('textarea').attributes('id'))
  })

  it('is valid by default', () => {
    const wrapper = mount(UtensilTextArea)

    expect(wrapper.find('.utensil-text-area-control').classes()).not.toContain('invalid')
    expect(wrapper.find('textarea').attributes('aria-invalid')).toBe('false')
  })

  it('marks an invalid text area', () => {
    const wrapper = mount(UtensilTextArea, { props: { ariaInvalid: true, ariaDescribedBy: 'notes-error' } })

    expect(wrapper.find('.utensil-text-area-control').classes()).toContain('invalid')
    expect(wrapper.find('textarea').attributes('aria-invalid')).toBe('true')
    expect(wrapper.find('textarea').attributes('aria-describedby')).toBe('notes-error')
  })

  it('takes the warning variant as its pen only while invalid', async () => {
    const wrapper = mount({
      props: { invalid: Boolean },
      setup: (props: { invalid: boolean }) => () =>
        h(TestTheme, { variants: { warning: 'orange' } }, () => h(UtensilTextArea, { ariaInvalid: props.invalid })),
    })
    const control = () => wrapper.find('.utensil-text-area-control').classes()
    const validClasses = control()

    await wrapper.setProps({ invalid: true })

    expect(control().filter((name) => !validClasses.includes(name) && name !== 'invalid')).not.toHaveLength(0)

    await wrapper.setProps({ invalid: false })

    expect(control()).toEqual(validClasses)
  })
})
