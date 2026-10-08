import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilButton from './UtensilButton.vue'

describe('UtensilButton', () => {
  it('suppresses click when disabled', async () => {
    const wrapper = mount(UtensilButton, { props: { label: 'Continue', disabled: true } })

    await wrapper.trigger('click')

    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('looks disabled when aria-disabled, but stays enabled and clickable', async () => {
    const wrapper = mount(UtensilButton, { props: { label: 'Continue', ariaDisabled: true } })

    await wrapper.trigger('click')

    expect(wrapper.classes()).toContain('disabled')
    expect(wrapper.classes()).not.toContain('interactive')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('disabled')).toBeUndefined()
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('leaves aria-disabled to a button that is truly disabled or busy', () => {
    const disabled = mount(UtensilButton, { props: { ariaDisabled: true, disabled: true } })
    const busy = mount(UtensilButton, { props: { ariaDisabled: true, busy: true } })

    expect(disabled.attributes('aria-disabled')).toBeUndefined()
    expect(busy.attributes('aria-disabled')).toBeUndefined()
  })

  it('does not submit its form while aria-disabled', async () => {
    const onSubmit = vi.fn((event: Event) => event.preventDefault())
    const wrapper = mount(
      {
        components: { UtensilButton },
        template: '<form @submit="onSubmit"><UtensilButton aria-disabled /></form>',
        setup: () => ({ onSubmit }),
      },
      { attachTo: document.body },
    )

    wrapper.find('button').element.click()

    expect(onSubmit).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})
