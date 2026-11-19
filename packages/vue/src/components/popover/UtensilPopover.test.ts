import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import UtensilPopover from './UtensilPopover.vue'

// jsdom lacks the Popover API and its :popover-open state
let open = new WeakSet<Element>()
beforeEach(() => {
  open = new WeakSet()
  HTMLElement.prototype.showPopover = vi.fn(function (this: HTMLElement) {
    open.add(this)
  })
  HTMLElement.prototype.hidePopover = vi.fn(function (this: HTMLElement) {
    open.delete(this)
  })
  const matches = Object.getOwnPropertyDescriptor(Element.prototype, 'matches')!.value as (selector: string) => boolean
  vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, selector: string) {
    return selector === ':popover-open' ? open.has(this) : matches.call(this, selector)
  })
})

function content(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('.utensil-popover-content')
}

describe('UtensilPopover', () => {
  it('is an auto popover by default, and a manual one when asked', () => {
    expect(content(mount(UtensilPopover)).attributes('popover')).toBe('auto')
    expect(content(mount(UtensilPopover, { props: { mode: 'manual' } })).attributes('popover')).toBe('manual')
  })

  it('opens and closes itself when uncontrolled', async () => {
    const wrapper = mount(UtensilPopover, {
      slots: { trigger: ({ toggle }: { toggle: () => void }) => h('button', { onClick: toggle }, 'Open') },
    })

    await wrapper.find('button').trigger('click')
    expect(open.has(content(wrapper).element)).toBe(true)
    expect(wrapper.vm.isOpen).toBe(true)

    await wrapper.find('button').trigger('click')
    expect(open.has(content(wrapper).element)).toBe(false)
  })

  it('asks its v-model to open when controlled, and follows it', async () => {
    const wrapper = mount(UtensilPopover, { props: { modelValue: false } })

    wrapper.vm.open()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(open.has(content(wrapper).element)).toBe(false)

    await wrapper.setProps({ modelValue: true })
    expect(open.has(content(wrapper).element)).toBe(true)

    await wrapper.setProps({ modelValue: false })
    expect(open.has(content(wrapper).element)).toBe(false)
  })
})
