import { describe, it, expect, vi, afterEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import type { OutsideClickOptions } from './use-outside-click'
import { useOutsideClick } from './use-outside-click'

// MouseEvent stands in for PointerEvent, which the test DOM doesn't implement.
// detail 1 marks the click as pointer-paired; keyboard/programmatic clicks carry detail 0.
function press(element: Element) {
  const pointerdown = new MouseEvent('pointerdown', { bubbles: true, cancelable: true, composed: true })
  element.dispatchEvent(pointerdown)
  const click = new MouseEvent('click', { bubbles: true, cancelable: true, composed: true, detail: 1 })
  element.dispatchEvent(click)
  return { pointerdown, click }
}

// Everything each test mounts or appends, torn down even when an expectation throws —
// a leaked document listener would bleed into the following tests.
let wrappers: VueWrapper[] = []
let elements: Element[] = []

afterEach(() => {
  wrappers.forEach((wrapper) => wrapper.unmount())
  elements.forEach((element) => element.remove())
  wrappers = []
  elements = []
})

function mountTarget(options: OutsideClickOptions = {}, root: HTMLElement | ShadowRoot = document.body) {
  const onOutsideClick = vi.fn()
  const component = defineComponent({
    setup() {
      const target = ref<Element | null>(null)
      useOutsideClick(target, onOutsideClick, options)
      return { target }
    },
    template: `<div ref="target" class="target"><button class="inside" /></div>`,
  })

  const mountPoint = document.createElement('div')
  root.appendChild(mountPoint)
  const wrapper = mount(component, { attachTo: mountPoint })
  wrappers.push(wrapper)
  return { wrapper, onOutsideClick }
}

function createOutside(root: HTMLElement | ShadowRoot = document.body) {
  const outside = document.createElement('button')
  outside.className = 'outside'
  root.appendChild(outside)
  elements.push(outside)
  return outside
}

describe('useOutsideClick', () => {
  it('invokes the callback on an outside press and swallows its events', () => {
    const { onOutsideClick } = mountTarget()
    const outside = createOutside()

    const { pointerdown, click } = press(outside)

    expect(onOutsideClick).toHaveBeenCalledOnce()
    expect(pointerdown.defaultPrevented).toBe(true)
    expect(click.defaultPrevented).toBe(true)
  })

  it('lets a press inside the target through untouched', () => {
    const { wrapper, onOutsideClick } = mountTarget()

    const { pointerdown, click } = press(wrapper.find('.inside').element)

    expect(onOutsideClick).not.toHaveBeenCalled()
    expect(pointerdown.defaultPrevented).toBe(false)
    expect(click.defaultPrevented).toBe(false)
  })

  it('stops swallowing once when turns false after a dismissal', () => {
    const active = ref(true)
    const { onOutsideClick } = mountTarget({ when: active })
    onOutsideClick.mockImplementation(() => (active.value = false))
    const outside = createOutside()

    press(outside)
    const second = press(outside)

    expect(onOutsideClick).toHaveBeenCalledOnce()
    expect(second.pointerdown.defaultPrevented).toBe(false)
    expect(second.click.defaultPrevented).toBe(false)
  })

  it('dismisses without swallowing when swallow is off', () => {
    const { onOutsideClick } = mountTarget({ swallow: false })
    const outside = createOutside()

    const { pointerdown, click } = press(outside)

    expect(onOutsideClick).toHaveBeenCalledOnce()
    expect(pointerdown.defaultPrevented).toBe(false)
    expect(click.defaultPrevented).toBe(false)
  })

  it('ignores presses matching the ignore selectors', () => {
    const { onOutsideClick } = mountTarget({ ignore: ['.outside'] })
    const outside = createOutside()

    const { pointerdown } = press(outside)

    expect(onOutsideClick).not.toHaveBeenCalled()
    expect(pointerdown.defaultPrevented).toBe(false)
  })

  it('matches ignore selectors against ancestors of the pressed element', () => {
    const { onOutsideClick } = mountTarget({ ignore: ['.toolbar'] })
    const toolbar = document.createElement('div')
    toolbar.className = 'toolbar'
    const toggle = document.createElement('button')
    toolbar.appendChild(toggle)
    document.body.appendChild(toolbar)
    elements.push(toolbar)

    press(toggle)

    expect(onOutsideClick).not.toHaveBeenCalled()
  })

  it('leaves a press inside an open dialog alone — a higher layer is not outside', () => {
    const { onOutsideClick } = mountTarget()
    const dialog = document.createElement('dialog')
    dialog.setAttribute('open', '')
    const inDialog = document.createElement('button')
    dialog.appendChild(inDialog)
    document.body.appendChild(dialog)
    elements.push(dialog)

    const { pointerdown } = press(inDialog)

    expect(onOutsideClick).not.toHaveBeenCalled()
    expect(pointerdown.defaultPrevented).toBe(false)
  })

  it('dismisses on a press elsewhere inside the dialog hosting the target', () => {
    const dialog = document.createElement('dialog')
    dialog.setAttribute('open', '')
    document.body.appendChild(dialog)
    elements.push(dialog)
    const { onOutsideClick } = mountTarget({}, dialog)
    const beside = document.createElement('button')
    dialog.appendChild(beside)

    press(beside)

    expect(onOutsideClick).toHaveBeenCalledOnce()
  })

  it('dismisses on a press inside a closed dialog', () => {
    const { onOutsideClick } = mountTarget()
    const dialog = document.createElement('dialog')
    const inDialog = document.createElement('button')
    dialog.appendChild(inDialog)
    document.body.appendChild(dialog)
    elements.push(dialog)

    press(inDialog)

    expect(onOutsideClick).toHaveBeenCalledOnce()
  })

  it('stands down while when is false', () => {
    const when = ref(false)
    const { onOutsideClick } = mountTarget({ when })
    const outside = createOutside()

    press(outside)
    expect(onOutsideClick).not.toHaveBeenCalled()

    when.value = true
    press(outside)
    expect(onOutsideClick).toHaveBeenCalledOnce()
  })

  it('drops a pending swallow when its press never produced a click', () => {
    const { wrapper, onOutsideClick } = mountTarget()
    const outside = createOutside()

    // The dismissing press's click never lands (iOS Safari dispatch, presses ending in a drag)
    outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true, composed: true }))
    expect(onOutsideClick).toHaveBeenCalledOnce()

    const { click } = press(wrapper.find('.inside').element)

    expect(click.defaultPrevented).toBe(false)
  })

  it('dismisses on an outside keyboard activation without swallowing it', () => {
    const { onOutsideClick } = mountTarget()
    const outside = createOutside()

    const click = new MouseEvent('click', { bubbles: true, cancelable: true, composed: true, detail: 0 })
    outside.dispatchEvent(click)

    expect(onOutsideClick).toHaveBeenCalledOnce()
    expect(click.defaultPrevented).toBe(false)
  })

  it('leaves a keyboard activation inside the target alone', () => {
    const { wrapper, onOutsideClick } = mountTarget()

    const click = new MouseEvent('click', { bubbles: true, cancelable: true, composed: true, detail: 0 })
    wrapper.find('.inside').element.dispatchEvent(click)

    expect(onOutsideClick).not.toHaveBeenCalled()
    expect(click.defaultPrevented).toBe(false)
  })

  it('stops listening after unmount', () => {
    const { wrapper, onOutsideClick } = mountTarget()
    const outside = createOutside()

    wrapper.unmount()
    const { pointerdown } = press(outside)

    expect(onOutsideClick).not.toHaveBeenCalled()
    expect(pointerdown.defaultPrevented).toBe(false)
  })

  describe('inside a shadow root', () => {
    // Document-level listeners see shadow-tree events retargeted to the host, so these
    // exercise the composed-path decision rather than event.target.
    function createShadowRoot() {
      const host = document.createElement('div')
      document.body.appendChild(host)
      elements.push(host)
      return host.attachShadow({ mode: 'open' })
    }

    it('lets a press inside the target through', () => {
      const shadowRoot = createShadowRoot()
      const { wrapper, onOutsideClick } = mountTarget({}, shadowRoot)

      const { pointerdown, click } = press(wrapper.find('.inside').element)

      expect(onOutsideClick).not.toHaveBeenCalled()
      expect(pointerdown.defaultPrevented).toBe(false)
      expect(click.defaultPrevented).toBe(false)
    })

    it('dismisses on a press elsewhere in the shadow tree', () => {
      const shadowRoot = createShadowRoot()
      const { onOutsideClick } = mountTarget({}, shadowRoot)
      const outside = createOutside(shadowRoot)

      const { pointerdown } = press(outside)

      expect(onOutsideClick).toHaveBeenCalledOnce()
      expect(pointerdown.defaultPrevented).toBe(true)
    })

    it('matches ignore selectors inside the shadow tree', () => {
      const shadowRoot = createShadowRoot()
      const { onOutsideClick } = mountTarget({ ignore: ['.outside'] }, shadowRoot)
      const outside = createOutside(shadowRoot)

      press(outside)

      expect(onOutsideClick).not.toHaveBeenCalled()
    })
  })
})
