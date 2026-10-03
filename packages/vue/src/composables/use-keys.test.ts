import { describe, it, expect, vi, afterEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import type { KeyBinding, KeyHandler, Keys, KeysOptions } from './use-keys'
import { useKeys } from './use-keys'

function press(element: Element, key: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init })
  element.dispatchEvent(event)
  return event
}

let wrappers: VueWrapper[] = []

afterEach(() => {
  wrappers.forEach((wrapper) => wrapper.unmount())
  wrappers = []
})

function mountKeys(bindings: Record<string, KeyHandler | KeyBinding>, options: Omit<KeysOptions, 'target'> = {}) {
  const outside = vi.fn()
  let keys: Keys | undefined
  const shown = ref(true)

  const component = defineComponent({
    setup() {
      const root = ref<HTMLElement | null>(null)
      keys = useKeys(bindings, { ...options, target: root })
      return { root, outside, shown }
    },
    template: `
      <div @keydown="outside">
        <div v-if="shown" ref="root" class="root" tabindex="-1">
          <input class="field" />
          <button class="control" />
          <div class="text" contenteditable="true" />
        </div>
      </div>
    `,
  })

  const wrapper = mount(component, { attachTo: document.body })
  wrappers.push(wrapper)
  const find = (selector: string) => wrapper.find(selector).element
  return { wrapper, find, outside, shown, keys: keys as Keys }
}

describe('useKeys', () => {
  it('handles a bound key and keeps it: default prevented, propagation stopped', async () => {
    const toggle = vi.fn()
    const { find, outside } = mountKeys({ Space: toggle })
    await nextTick()

    const event = press(find('.root'), ' ')

    expect(toggle).toHaveBeenCalledOnce()
    expect(event.defaultPrevented).toBe(true)
    expect(outside).not.toHaveBeenCalled()
  })

  it('leaves unbound keys untouched', async () => {
    const { find, outside } = mountKeys({ Space: vi.fn() })
    await nextTick()

    const event = press(find('.root'), 'Enter')

    expect(event.defaultPrevented).toBe(false)
    expect(outside).toHaveBeenCalledOnce()
  })

  it('leaves a key its handler declines untouched', async () => {
    const { find, outside } = mountKeys({ ArrowRight: () => false })
    await nextTick()

    const event = press(find('.root'), 'ArrowRight')

    expect(event.defaultPrevented).toBe(false)
    expect(outside).toHaveBeenCalledOnce()
  })

  it('lets bindings keep the default action or the propagation', async () => {
    const { find, outside } = mountKeys(
      {
        Escape: { handler: vi.fn(), preventDefault: false },
        Tab: vi.fn(),
      },
      { stopPropagation: false },
    )
    await nextTick()

    expect(press(find('.root'), 'Escape').defaultPrevented).toBe(false)
    expect(press(find('.root'), 'Tab').defaultPrevented).toBe(true)
    expect(outside).toHaveBeenCalledTimes(2)
  })

  it('leaves keys to text entry, and to controls where asked', async () => {
    const space = vi.fn()
    const arrow = vi.fn()
    const { find } = mountKeys({ Space: { handler: space, ignore: 'controls' }, ArrowLeft: arrow })
    await nextTick()

    press(find('.field'), ' ')
    press(find('.text'), ' ')
    press(find('.control'), ' ')
    press(find('.field'), 'ArrowLeft')
    press(find('.control'), 'ArrowLeft')

    expect(space).not.toHaveBeenCalled()
    expect(arrow).toHaveBeenCalledOnce()
  })

  it('takes keys from text entry where told to', async () => {
    const escape = vi.fn()
    const { find } = mountKeys({ Escape: escape }, { ignore: 'none' })
    await nextTick()

    press(find('.field'), 'Escape')

    expect(escape).toHaveBeenCalledOnce()
  })

  it('matches Ctrl, Alt and Meta exactly', async () => {
    const space = vi.fn()
    const save = vi.fn()
    const { find } = mountKeys({ Space: space, 'Ctrl+s': save })
    await nextTick()

    press(find('.root'), ' ', { ctrlKey: true })
    press(find('.root'), 's')
    press(find('.root'), 's', { ctrlKey: true })

    expect(space).not.toHaveBeenCalled()
    expect(save).toHaveBeenCalledOnce()
  })

  it('matches a character in either case, and Shift only where the binding names it', async () => {
    const select = vi.fn()
    const selectAll = vi.fn()
    const { find } = mountKeys({ s: select, 'Shift+S': selectAll })
    await nextTick()

    press(find('.root'), 's')
    press(find('.root'), 'S', { shiftKey: true })

    expect(select).toHaveBeenCalledOnce()
    expect(selectAll).toHaveBeenCalledOnce()
  })

  it('matches Shift exactly on a named key', async () => {
    const menu = vi.fn()
    const next = vi.fn()
    const { find } = mountKeys({ 'Shift+F10': menu, ArrowRight: next })
    await nextTick()

    press(find('.root'), 'F10')
    press(find('.root'), 'ArrowRight', { shiftKey: true })

    expect(menu).not.toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })

  it('leaves keys an inner element handled, and keys mid-composition', async () => {
    const space = vi.fn()
    const { find } = mountKeys({ Space: space })
    await nextTick()
    find('.root').addEventListener('keydown', (event) => event.preventDefault(), { capture: true, once: true })

    press(find('.root'), ' ')
    press(find('.root'), ' ', { isComposing: true })

    expect(space).not.toHaveBeenCalled()
  })

  it('stops and starts listening, and stands aside while disabled', async () => {
    const space = vi.fn()
    const enabled = ref(true)
    const { find, keys } = mountKeys({ Space: space }, { enabled })
    await nextTick()

    keys.stop()
    press(find('.root'), ' ')
    keys.start()
    enabled.value = false
    press(find('.root'), ' ')
    enabled.value = true
    press(find('.root'), ' ')

    expect(space).toHaveBeenCalledOnce()
  })

  it('follows its target, letting go of an element that leaves', async () => {
    const space = vi.fn()
    const { find, shown } = mountKeys({ Space: space })
    await nextTick()
    const first = find('.root')

    shown.value = false
    await nextTick()
    press(first, ' ')
    shown.value = true
    await nextTick()
    press(find('.root'), ' ')

    expect(space).toHaveBeenCalledOnce()
  })

  it('hands its handler to a template without a target', () => {
    const space = vi.fn()
    const component = defineComponent({
      setup() {
        const keys = useKeys({ Space: space })
        return { onKeydown: keys.onKeydown }
      },
      template: `<div class="root" tabindex="-1" @keydown="onKeydown" />`,
    })
    const wrapper = mount(component, { attachTo: document.body })
    wrappers.push(wrapper)

    const event = press(wrapper.find('.root').element, ' ')

    expect(space).toHaveBeenCalledOnce()
    expect(event.defaultPrevented).toBe(true)
  })
})
