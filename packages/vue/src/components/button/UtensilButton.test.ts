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

  it('looks and is announced disabled when aria-disabled, stays focusable and emits no click', async () => {
    const wrapper = mount(UtensilButton, { props: { label: 'Continue', ariaDisabled: true } })

    // Enter and Space activate a button through the same click
    wrapper.element.click()
    await wrapper.trigger('click')

    expect(wrapper.classes()).toContain('disabled')
    expect(wrapper.classes()).not.toContain('interactive')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('disabled')).toBeUndefined()
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('looks unavailable when blocked, but is announced as an ordinary button and emits click', async () => {
    const wrapper = mount(UtensilButton, { props: { label: 'Continue', blocked: true } })

    await wrapper.trigger('click')

    expect(wrapper.classes()).toContain('disabled')
    expect(wrapper.classes()).not.toContain('interactive')
    expect(wrapper.attributes('aria-disabled')).toBeUndefined()
    expect(wrapper.attributes('disabled')).toBeUndefined()
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('is described by its reason while blocked', async () => {
    const wrapper = mount(UtensilButton, { props: { blocked: true, blockedDescribedBy: 'why' } })
    expect(wrapper.attributes('aria-describedby')).toBe('why')

    await wrapper.setProps({ blocked: false })
    expect(wrapper.attributes('aria-describedby')).toBeUndefined()
  })

  it('adds a blocked reason to the description the consumer gives', () => {
    const wrapper = mount(UtensilButton, {
      props: { blocked: true, blockedDescribedBy: 'why' },
      attrs: { 'aria-describedby': 'hint' },
    })
    expect(wrapper.attributes('aria-describedby')).toBe('hint why')
  })

  it('passes other attributes and classes to the button', () => {
    const wrapper = mount(UtensilButton, { attrs: { id: 'go', class: 'extra', 'data-test': 'x' } })
    expect(wrapper.attributes('id')).toBe('go')
    expect(wrapper.attributes('data-test')).toBe('x')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['extra', 'utensil-button']))
  })

  it('is not a toggle unless pressed is set', () => {
    const wrapper = mount(UtensilButton)
    expect(wrapper.attributes('aria-pressed')).toBeUndefined()
    expect(wrapper.attributes('aria-checked')).toBeUndefined()
    expect(wrapper.classes()).not.toContain('selected')
  })

  it('announces a toggle that is off as not pressed', () => {
    const wrapper = mount(UtensilButton, { props: { pressed: false } })
    expect(wrapper.attributes('aria-pressed')).toBe('false')
    expect(wrapper.classes()).not.toContain('selected')
  })

  it('announces a toggle that is on as pressed and draws it selected', () => {
    const wrapper = mount(UtensilButton, { props: { pressed: true } })
    expect(wrapper.attributes('aria-pressed')).toBe('true')
    expect(wrapper.classes()).toContain('selected')
  })

  it('leaves aria-disabled to a button that is truly disabled or busy', () => {
    const disabled = mount(UtensilButton, { props: { ariaDisabled: true, disabled: true } })
    const busy = mount(UtensilButton, { props: { ariaDisabled: true, busy: true } })

    expect(disabled.attributes('aria-disabled')).toBeUndefined()
    expect(busy.attributes('aria-disabled')).toBeUndefined()
  })

  it.each(['aria-disabled', 'blocked'])('does not submit its form while %s', (state) => {
    const onSubmit = vi.fn((event: Event) => event.preventDefault())
    const wrapper = mount(
      {
        components: { UtensilButton },
        template: `<form @submit="onSubmit"><UtensilButton ${state} /></form>`,
        setup: () => ({ onSubmit }),
      },
      { attachTo: document.body },
    )

    wrapper.find('button').element.click()

    expect(onSubmit).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})
