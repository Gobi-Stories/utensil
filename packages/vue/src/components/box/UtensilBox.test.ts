import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilBox from './UtensilBox.vue'

describe('UtensilBox', () => {
  it('renders with default classes', () => {
    const wrapper = mount(UtensilBox)
    const box = wrapper.find('.utensil-box')
    expect(box.exists()).toBe(true)
    expect(box.classes()).toContain('ui-unstyled')
    expect(box.classes()).toContain('pencil')
  })

  it('renders slot content', () => {
    const wrapper = mount(UtensilBox, {
      slots: { default: '<p>Box content</p>' },
    })
    expect(wrapper.find('p').text()).toBe('Box content')
  })

  it('applies variation class', () => {
    const wrapper = mount(UtensilBox, {
      props: { variation: 'surface' },
    })
    expect(wrapper.find('.utensil-box').classes()).toContain('ui-surface')
  })

  it('applies pencil class when not highlighted', () => {
    const wrapper = mount(UtensilBox, {
      props: { variation: 'surface' },
    })
    expect(wrapper.find('.utensil-box').classes()).toContain('pencil')
  })

  it('removes pencil class when highlighted is true', () => {
    const wrapper = mount(UtensilBox, {
      props: { variation: 'surface', highlighted: true },
    })
    expect(wrapper.find('.utensil-box').classes()).not.toContain('pencil')
  })

  it('applies pencil class when highlighted is false', () => {
    const wrapper = mount(UtensilBox, {
      props: { variation: 'soft', highlighted: false },
    })
    expect(wrapper.find('.utensil-box').classes()).toContain('pencil')
  })

  it('does not apply interactive class by default', () => {
    const wrapper = mount(UtensilBox)
    expect(wrapper.find('.utensil-box').classes()).not.toContain('interactive')
  })

  it('applies interactive class when interactive is true', () => {
    const wrapper = mount(UtensilBox, {
      props: { variation: 'surface', interactive: true },
    })
    expect(wrapper.find('.utensil-box').classes()).toContain('interactive')
  })

  it('applies both non-pencil and interactive classes when highlighted and interactive', () => {
    const wrapper = mount(UtensilBox, {
      props: { variation: 'outline', highlighted: true, interactive: true },
    })
    const classes = wrapper.find('.utensil-box').classes()
    expect(classes).not.toContain('pencil')
    expect(classes).toContain('interactive')
  })

  it('renders a div by default', () => {
    const wrapper = mount(UtensilBox)
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.attributes('type')).toBeUndefined()
  })

  it('renders as a button that does not submit forms', () => {
    const wrapper = mount(UtensilBox, { props: { as: 'button', interactive: true } })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('renders as a link, passing its attributes through', () => {
    const wrapper = mount(UtensilBox, { props: { as: 'a', interactive: true }, attrs: { href: '/somewhere' } })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/somewhere')
  })

  it('leaves focus to the element when only interactive', () => {
    const wrapper = mount(UtensilBox, { props: { interactive: true } })
    expect(wrapper.attributes('tabindex')).toBeUndefined()
    expect(wrapper.attributes('role')).toBeUndefined()
  })

  it('acts as a button when clickable', async () => {
    const wrapper = mount(UtensilBox, { props: { clickable: true }, slots: { default: '<input />' } })
    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.attributes('tabindex')).toBe('0')
    expect(wrapper.classes()).toContain('interactive')

    await wrapper.trigger('keydown', { key: 'Enter' })
    await wrapper.trigger('keydown', { key: 'a' })
    expect(wrapper.emitted('click')).toHaveLength(1)

    // Keys typed into a control inside the box stay the control's
    await wrapper.find('input').trigger('keydown', { key: ' ' })
    await wrapper.find('input').trigger('keyup', { key: ' ' })
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('clicks on Space release, as a native button does, unless focus moves off first', async () => {
    const wrapper = mount(UtensilBox, { props: { clickable: true } })

    await wrapper.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('click')).toBeUndefined()
    await wrapper.trigger('keyup', { key: ' ' })
    expect(wrapper.emitted('click')).toHaveLength(1)

    await wrapper.trigger('keydown', { key: ' ' })
    await wrapper.trigger('blur')
    await wrapper.trigger('keyup', { key: ' ' })
    expect(wrapper.emitted('click')).toHaveLength(1)

    // A release without its press, e.g. Space pressed elsewhere, doesn't click
    await wrapper.trigger('keyup', { key: ' ' })
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('blocks clicks and feedback when disabled', async () => {
    const onClick = vi.fn()
    const wrapper = mount(UtensilBox, {
      props: { clickable: true, disabled: true },
      attrs: { onClick },
    })
    expect(wrapper.classes()).toContain('disabled')
    expect(wrapper.classes()).not.toContain('interactive')
    expect(wrapper.attributes('aria-disabled')).toBe('true')

    await wrapper.trigger('click')
    await wrapper.trigger('keydown', { key: 'Enter' })
    await wrapper.trigger('keydown', { key: ' ' })
    await wrapper.trigger('keyup', { key: ' ' })
    expect(onClick).not.toHaveBeenCalled()
  })

  it('drops the href of a disabled link, so it cannot be followed', async () => {
    const wrapper = mount(UtensilBox, { props: { as: 'a', interactive: true }, attrs: { href: '/somewhere' } })
    expect(wrapper.attributes('href')).toBe('/somewhere')

    await wrapper.setProps({ disabled: true })
    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('lets attributes override its own, as a radio card sets its role and tab stop', () => {
    const wrapper = mount(UtensilBox, { props: { interactive: true }, attrs: { role: 'radio', tabindex: '-1' } })
    expect(wrapper.attributes('role')).toBe('radio')
    expect(wrapper.attributes('tabindex')).toBe('-1')
  })

  it('shows a selected state, pressed on a button and in pen colors', async () => {
    const wrapper = mount(UtensilBox, { props: { as: 'button', variation: 'surface', interactive: true } })
    expect(wrapper.attributes('aria-pressed')).toBeUndefined()

    await wrapper.setProps({ selected: false })
    expect(wrapper.attributes('aria-pressed')).toBe('false')
    expect(wrapper.classes()).toContain('pencil')

    await wrapper.setProps({ selected: true })
    expect(wrapper.attributes('aria-pressed')).toBe('true')
    expect(wrapper.classes()).toContain('selected')
    expect(wrapper.classes()).not.toContain('pencil')

    const div = mount(UtensilBox, { props: { selected: true } })
    expect(div.attributes('aria-pressed')).toBeUndefined()
    expect(div.classes()).toContain('selected')
  })

  it('elevates without an edge, rising two levels on hover', () => {
    const resting = mount(UtensilBox, { props: { variation: 'surface', elevation: 2 } })
    expect(resting.classes()).toContain('elevated')
    expect(resting.classes()).not.toContain('shadowed')
    expect(resting.attributes('style')).toContain('--box-elevation: var(--shadow-2)')
    expect(resting.attributes('style')).toContain('--box-elevation-hover: var(--shadow-4)')

    const highlighted = mount(UtensilBox, { props: { elevation: 5, highlighted: true } })
    expect(highlighted.attributes('style')).toContain('--box-elevation: var(--highlight-shadow-5)')
    expect(highlighted.attributes('style')).toContain('--box-elevation-hover: var(--highlight-shadow-6)')

    expect(mount(UtensilBox).classes()).not.toContain('elevated')
  })

  it('disables a native button', () => {
    const wrapper = mount(UtensilBox, { props: { as: 'button', disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('aria-disabled')).toBeUndefined()
  })

  it('draws a shadow border, in pen when highlighted, rising with a pen edge on hover', () => {
    const resting = mount(UtensilBox, { props: { shadow: 2 } })
    expect(resting.classes()).toContain('shadowed')
    expect(resting.attributes('style')).toContain('--box-shadow: inset 0 0 0 1px transparent, var(--shadow-border-2)')
    expect(resting.attributes('style')).toContain(
      '--box-shadow-hover: inset 0 0 0 1px var(--pen-a6), var(--shadow-border-4)',
    )

    const highlighted = mount(UtensilBox, { props: { shadow: 5, highlighted: true } })
    expect(highlighted.attributes('style')).toContain('inset 0 0 0 1px var(--pen-a7), var(--highlight-shadow-border-5)')
    expect(highlighted.attributes('style')).toContain('inset 0 0 0 1px var(--pen-a8), var(--highlight-shadow-border-6)')

    expect(mount(UtensilBox).classes()).not.toContain('shadowed')
  })
})
