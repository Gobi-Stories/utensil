import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import UtensilPopover from './UtensilPopover.vue'
import type { PopoverPlacement } from './utensil-popover'

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

  it('opens on mount when its v-model starts open', () => {
    const wrapper = mount(UtensilPopover, { props: { modelValue: true }, attachTo: document.body })
    expect(open.has(content(wrapper).element)).toBe(true)
    wrapper.unmount()
  })

  it('puts the offset on the side facing the trigger, as a physical margin beside it', () => {
    const style = (placement: PopoverPlacement) =>
      content(mount(UtensilPopover, { props: { placement, offset: 6 } })).attributes('style') ?? ''

    expect(style('right')).toContain('margin-left: 6px')
    expect(style('left-start')).toContain('margin-right: 6px')
    expect(style('bottom')).toContain('margin-block-start: 6px')
    expect(style('right')).not.toContain('margin-inline')
  })

  it('keeps the side it flipped to while it closes, rather than jumping back to its placement', async () => {
    const wrapper = mount(UtensilPopover, { props: { placement: 'bottom-start', offset: 6 } })
    const rect = (top: number, bottom: number) => ({ top, bottom, left: 0, right: 100 }) as DOMRect
    vi.spyOn(wrapper.element, 'getBoundingClientRect').mockReturnValue(rect(500, 530))
    vi.spyOn(content(wrapper).element, 'getBoundingClientRect').mockReturnValue(rect(300, 500))
    const toggle = (newState: string) => Object.assign(new Event('beforetoggle'), { newState })

    content(wrapper).element.dispatchEvent(toggle('closed'))
    await wrapper.vm.$nextTick()
    expect(content(wrapper).attributes('style')).toContain('margin-block-end: 6px')
    expect(wrapper.emitted('placement-change')?.[0]).toEqual(['top-start'])

    content(wrapper).element.dispatchEvent(toggle('open'))
    await wrapper.vm.$nextTick()
    expect(content(wrapper).attributes('style')).toContain('margin-block-start: 6px')
  })

  it('is as wide as its trigger to the fraction of a pixel', () => {
    let observed: ResizeObserverCallback | undefined
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          observed = callback
        }
        observe() {}
        disconnect() {}
      },
    )
    const wrapper = mount(UtensilPopover, { props: { width: 'anchor' } })
    observed?.([{ borderBoxSize: [{ inlineSize: 312.656 }] } as unknown as ResizeObserverEntry], {} as ResizeObserver)
    expect((content(wrapper).element as HTMLElement).style.getPropertyValue('--popover-anchor-width')).toBe('312.656px')
    vi.unstubAllGlobals()
  })
})
