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

  it('describes the text area with its description', () => {
    const wrapper = mount(UtensilTextArea, { props: { label: 'Bio', description: 'Up to 200 characters' } })
    const description = wrapper.find('p.description')

    expect(description.text()).toBe('Up to 200 characters')
    expect(wrapper.find('textarea').attributes('aria-describedby')).toBe(description.attributes('id'))
  })

  it('renders no description line by default', () => {
    const wrapper = mount(UtensilTextArea, { props: { label: 'Bio' } })

    expect(wrapper.find('p.description').exists()).toBe(false)
  })

  it('holds an empty description line when asked to reserve one', () => {
    const wrapper = mount(UtensilTextArea, { props: { label: 'Bio', reserveDescription: true } })

    expect(wrapper.find('p.description').text()).toBe('')
    expect(wrapper.find('textarea').attributes('aria-describedby')).toBeUndefined()
  })

  it('draws an invalid description as the error', () => {
    const wrapper = mount(UtensilTextArea, { props: { description: 'Too long', ariaInvalid: true } })

    expect(wrapper.find('p.description').classes()).toContain('invalid')
  })

  it('sets aria-required only when asked', () => {
    expect(mount(UtensilTextArea).find('textarea').attributes('aria-required')).toBeUndefined()
    expect(
      mount(UtensilTextArea, { props: { ariaRequired: true } })
        .find('textarea')
        .attributes('aria-required'),
    ).toBe('true')
  })

  it('is described by ariaDescribedBy and its description together', () => {
    const wrapper = mount(UtensilTextArea, { props: { ariaDescribedBy: 'hint', description: 'Up to 200 words.' } })
    const id = wrapper.find('p.description').attributes('id')
    expect(wrapper.find('textarea').attributes('aria-describedby')).toBe(`hint ${id}`)
  })

  it('draws its variation with the shared ui- class, in pencil but for soft', () => {
    const unstyled = mount(UtensilTextArea, { props: { variation: 'unstyled' } }).find('textarea')
    const soft = mount(UtensilTextArea, { props: { variation: 'soft' } }).find('textarea')

    expect(unstyled.classes()).toEqual(expect.arrayContaining(['ui-unstyled', 'pencil']))
    expect(soft.classes()).toContain('ui-soft')
    expect(soft.classes()).not.toContain('pencil')
  })

  it('is drawn muted and stops resizing while disabled', () => {
    const wrapper = mount(UtensilTextArea, { props: { disabled: true, resize: 'both' } })

    expect(wrapper.classes()).toContain('disabled')
    expect(wrapper.find('textarea').classes()).toContain('disabled')
    expect(wrapper.find('.utensil-text-area-control').classes()).toContain('resize-none')
  })
})
