import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import UtensilTooltip from './UtensilTooltip.vue'

describe('UtensilTooltip', () => {
  it('renders the trigger slot', () => {
    const wrapper = mount(UtensilTooltip, {
      props: { text: 'Helpful hint' },
      slots: { default: '<button>Trigger</button>' },
    })
    expect(wrapper.find('button').text()).toBe('Trigger')
  })

  it('renders the tooltip text content', () => {
    const wrapper = mount(UtensilTooltip, { props: { text: 'Helpful hint' } })
    expect(wrapper.find('.utensil-tooltip-content').text()).toBe('Helpful hint')
  })

  it('is inverted by default', () => {
    const wrapper = mount(UtensilTooltip, { props: { text: 'Helpful hint' } })
    expect(wrapper.find('.utensil-tooltip-content').classes()).toContain('inverted')
  })

  it('applies the overlay variation when requested', () => {
    const wrapper = mount(UtensilTooltip, { props: { text: 'Full title', variation: 'overlay' } })
    const classes = wrapper.find('.utensil-tooltip-content').classes()
    expect(classes).toContain('overlay')
    expect(classes).not.toContain('inverted')
  })

  it('is single line by default', () => {
    const wrapper = mount(UtensilTooltip, { props: { text: 'Helpful hint' } })
    expect(wrapper.find('.utensil-tooltip-content').classes()).not.toContain('multiline')
  })

  it('applies the multiline class when requested', () => {
    const wrapper = mount(UtensilTooltip, { props: { text: 'A longer explanation', multiline: true } })
    expect(wrapper.find('.utensil-tooltip-content').classes()).toContain('multiline')
  })

  it('is a tooltip whose id the trigger can be described by', () => {
    const wrapper = mount(UtensilTooltip, {
      props: { text: 'Only owners can delete a story.' },
      slots: {
        default: `<template #default="{ tooltipId }"><button :aria-describedby="tooltipId">Delete</button></template>`,
      },
    })
    const content = wrapper.find('.utensil-tooltip-content')
    expect(content.attributes('role')).toBe('tooltip')
    expect(wrapper.find('button').attributes('aria-describedby')).toBe(content.attributes('id'))
  })

  it('is a manual popover, so it leaves other open popovers alone', () => {
    const wrapper = mount(UtensilTooltip, { props: { text: 'Helpful hint' } })
    expect(wrapper.find('.utensil-popover-content').attributes('popover')).toBe('manual')
  })
})

describe('UtensilTooltip showing and hiding', () => {
  let wrapper: VueWrapper | undefined

  beforeAll(() => {
    // jsdom lacks the Popover API: track it with an attribute
    HTMLElement.prototype.showPopover = function () {
      this.setAttribute('data-open', '')
    }
    HTMLElement.prototype.hidePopover = function () {
      this.removeAttribute('data-open')
    }
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    vi.useRealTimers()
  })

  function mountTooltip(props: Record<string, unknown> = {}) {
    vi.useFakeTimers()
    wrapper = mount(UtensilTooltip, {
      props: { text: 'Helpful hint', ...props },
      slots: { default: '<button>Trigger</button>' },
      attachTo: document.body,
    })
    return wrapper
  }

  const isOpen = (w: VueWrapper) => w.find('.utensil-popover-content').attributes('data-open') !== undefined
  const root = (w: VueWrapper) => w.find('.utensil-tooltip')

  it('shows after its delay on hover', async () => {
    const tooltip = mountTooltip()
    await root(tooltip).trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(150)
    expect(isOpen(tooltip)).toBe(false)
    await vi.advanceTimersByTimeAsync(100)
    expect(isOpen(tooltip)).toBe(true)
  })

  it('stays open while the pointer crosses onto it, and hides once it has left', async () => {
    const tooltip = mountTooltip({ delay: 0 })
    await root(tooltip).trigger('mouseenter')
    expect(isOpen(tooltip)).toBe(true)

    await root(tooltip).trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(50)
    await root(tooltip).trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(200)
    expect(isOpen(tooltip)).toBe(true)

    await root(tooltip).trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(200)
    expect(isOpen(tooltip)).toBe(false)
  })

  it('stays open while focused, though the pointer leaves', async () => {
    const tooltip = mountTooltip({ delay: 0 })
    await root(tooltip).trigger('focusin')
    await root(tooltip).trigger('mouseenter')
    await root(tooltip).trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(200)
    expect(isOpen(tooltip)).toBe(true)

    await root(tooltip).trigger('focusout')
    await vi.advanceTimersByTimeAsync(200)
    expect(isOpen(tooltip)).toBe(false)
  })

  it('hides on Escape, which goes no further, until the pointer or focus comes back', async () => {
    const tooltip = mountTooltip({ delay: 0 })
    await root(tooltip).trigger('focusin')
    const behind = vi.fn()
    document.addEventListener('keydown', behind)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(isOpen(tooltip)).toBe(false)
    expect(behind).not.toHaveBeenCalled()
    document.removeEventListener('keydown', behind)

    await root(tooltip).trigger('mouseenter')
    expect(isOpen(tooltip)).toBe(true)
  })

  it('never shows while disabled or empty, even from a pending delay', async () => {
    const tooltip = mountTooltip()
    await root(tooltip).trigger('mouseenter')
    await tooltip.setProps({ disabled: true })
    await vi.advanceTimersByTimeAsync(300)
    expect(isOpen(tooltip)).toBe(false)

    await tooltip.setProps({ disabled: false, text: '' })
    await vi.advanceTimersByTimeAsync(300)
    expect(isOpen(tooltip)).toBe(false)
  })

  it('hides when disabled while open', async () => {
    const tooltip = mountTooltip({ delay: 0 })
    await root(tooltip).trigger('mouseenter')
    await tooltip.setProps({ disabled: true })
    expect(isOpen(tooltip)).toBe(false)
  })

  it('shows from show() until a press elsewhere', async () => {
    const tooltip = mountTooltip()
    ;(tooltip.vm as unknown as { show: () => void }).show()
    await nextTick()
    expect(isOpen(tooltip)).toBe(true)

    // jsdom lacks PointerEvent
    const press = Object.assign(new MouseEvent('pointerdown', { bubbles: true }), { pointerType: 'touch' })
    document.body.dispatchEvent(press)
    await vi.advanceTimersByTimeAsync(200)
    expect(isOpen(tooltip)).toBe(false)
  })
})
