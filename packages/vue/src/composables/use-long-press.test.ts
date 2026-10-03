import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { defineComponent } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { useLongPress, type LongPress, type LongPressOptions } from './use-long-press'

// The test DOM has no PointerEvent: a MouseEvent carries the pointer fields it lacks
interface PointerFields {
  pointerType?: string
  pointerId?: number
  isPrimary?: boolean
  x?: number
  y?: number
}

function pointer(
  type: string,
  { pointerType = 'touch', pointerId = 1, isPrimary = true, x = 0, y = 0 }: PointerFields = {},
) {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y })
  Object.defineProperties(event, {
    pointerType: { value: pointerType },
    pointerId: { value: pointerId },
    isPrimary: { value: isPrimary },
  })
  return event as unknown as PointerEvent
}

function cancelable(type: string) {
  const event = new Event(type, { cancelable: true })
  window.dispatchEvent(event)
  return event.defaultPrevented
}

let wrapper: VueWrapper | null = null

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  vi.useRealTimers()
})

function mountLongPress(options?: LongPressOptions) {
  const onLongPress = vi.fn()
  let longPress!: LongPress
  wrapper = mount(
    defineComponent({
      setup() {
        longPress = useLongPress(onLongPress, options)
        return () => null
      },
    }),
  )
  return { longPress, onLongPress }
}

describe('useLongPress', () => {
  it('arms a still touch at the hold time and holds on until released', () => {
    const { longPress, onLongPress } = mountLongPress()
    const press = pointer('pointerdown')
    longPress.press(press)
    expect(longPress.holding.value).toBe(true)
    vi.advanceTimersByTime(499)
    expect(onLongPress).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(onLongPress).toHaveBeenCalledExactlyOnceWith(press)
    // The armed gesture is the consumer's until they end it — its release is theirs to handle
    window.dispatchEvent(pointer('pointerup'))
    expect(longPress.holding.value).toBe(true)
    longPress.release()
    expect(longPress.holding.value).toBe(false)
  })

  it('hands a touch that moves during the hold back to the browser as a pan', () => {
    const { longPress, onLongPress } = mountLongPress()
    longPress.press(pointer('pointerdown'))
    window.dispatchEvent(pointer('pointermove', { x: 6, y: 0 }))
    expect(longPress.holding.value).toBe(true)
    window.dispatchEvent(pointer('pointermove', { x: 9, y: 0 }))
    expect(longPress.holding.value).toBe(false)
    vi.advanceTimersByTime(500)
    expect(onLongPress).not.toHaveBeenCalled()
  })

  it('lets a touch that lifts or is taken over before the hold stay a tap', () => {
    const { longPress, onLongPress } = mountLongPress()
    longPress.press(pointer('pointerdown'))
    window.dispatchEvent(pointer('pointerup'))
    expect(longPress.holding.value).toBe(false)
    longPress.press(pointer('pointerdown'))
    window.dispatchEvent(pointer('pointercancel'))
    expect(longPress.holding.value).toBe(false)
    vi.advanceTimersByTime(500)
    expect(onLongPress).not.toHaveBeenCalled()
  })

  it('ignores mouse presses, extra fingers, and other pointers while holding', () => {
    const { longPress, onLongPress } = mountLongPress()
    longPress.press(pointer('pointerdown', { pointerType: 'mouse' }))
    longPress.press(pointer('pointerdown', { isPrimary: false }))
    expect(longPress.holding.value).toBe(false)
    longPress.press(pointer('pointerdown'))
    window.dispatchEvent(pointer('pointerup', { pointerId: 2 }))
    window.dispatchEvent(pointer('pointermove', { pointerId: 2, x: 50, y: 50 }))
    expect(longPress.holding.value).toBe(true)
    vi.advanceTimersByTime(500)
    expect(onLongPress).toHaveBeenCalledOnce()
    longPress.release()
  })

  it('gives the haptic bump as the hold arms', () => {
    const vibrate = vi.fn()
    Object.defineProperty(navigator, 'vibrate', { value: vibrate, configurable: true })
    try {
      const { longPress } = mountLongPress()
      longPress.press(pointer('pointerdown'))
      vi.advanceTimersByTime(499)
      expect(vibrate).not.toHaveBeenCalled()
      vi.advanceTimersByTime(1)
      expect(vibrate).toHaveBeenCalledOnce()
      longPress.release()
    } finally {
      Reflect.deleteProperty(navigator, 'vibrate')
    }
  })

  it('quiets the touch contextmenu from the press until the gesture ends', () => {
    const { longPress } = mountLongPress()
    longPress.press(pointer('pointerdown'))
    expect(cancelable('contextmenu')).toBe(true)
    vi.advanceTimersByTime(500)
    expect(cancelable('contextmenu')).toBe(true)
    longPress.release()
    expect(cancelable('contextmenu')).toBe(false)
  })

  it('stops the touch contextmenu before any handler while holding', () => {
    const { longPress } = mountLongPress()
    const target = document.createElement('div')
    document.body.appendChild(target)
    const handler = vi.fn()
    target.addEventListener('contextmenu', handler)
    try {
      longPress.press(pointer('pointerdown'))
      target.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
      vi.advanceTimersByTime(500)
      target.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
      expect(handler).not.toHaveBeenCalled()
      longPress.release()
      target.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
      expect(handler).toHaveBeenCalledOnce()
    } finally {
      target.remove()
    }
  })

  it('blocks touch panning only once armed', () => {
    const { longPress } = mountLongPress()
    longPress.press(pointer('pointerdown'))
    expect(cancelable('touchmove')).toBe(false)
    vi.advanceTimersByTime(500)
    expect(cancelable('touchmove')).toBe(true)
    longPress.release()
    expect(cancelable('touchmove')).toBe(false)
  })

  it('takes a custom hold time and tolerance', () => {
    const { longPress, onLongPress } = mountLongPress({ duration: 200, tolerance: 20 })
    longPress.press(pointer('pointerdown'))
    window.dispatchEvent(pointer('pointermove', { x: 15, y: 0 }))
    vi.advanceTimersByTime(200)
    expect(onLongPress).toHaveBeenCalledOnce()
    longPress.release()
  })

  it('fires on release after the hold when asked, past the release events, swallowing its click', () => {
    const { longPress, onLongPress } = mountLongPress({ fire: 'release' })
    const press = pointer('pointerdown')
    longPress.press(press)
    vi.advanceTimersByTime(500)
    expect(onLongPress).not.toHaveBeenCalled()
    expect(longPress.holding.value).toBe(true)
    window.dispatchEvent(pointer('pointerup'))
    expect(longPress.holding.value).toBe(false)
    expect(onLongPress).not.toHaveBeenCalled()
    const click = new MouseEvent('click', { bubbles: true, cancelable: true })
    window.dispatchEvent(click)
    expect(click.defaultPrevented).toBe(true)
    vi.advanceTimersByTime(0)
    expect(onLongPress).toHaveBeenCalledExactlyOnceWith(press)
    // Only the release's own click is swallowed
    const later = new MouseEvent('click', { bubbles: true, cancelable: true })
    window.dispatchEvent(later)
    expect(later.defaultPrevented).toBe(false)
  })

  it('never fires a release-mode hold the browser took over', () => {
    const { longPress, onLongPress } = mountLongPress({ fire: 'release' })
    longPress.press(pointer('pointerdown'))
    vi.advanceTimersByTime(500)
    window.dispatchEvent(pointer('pointercancel'))
    expect(longPress.holding.value).toBe(false)
    vi.advanceTimersByTime(0)
    expect(onLongPress).not.toHaveBeenCalled()
  })

  it('releases on unmount', () => {
    const { longPress, onLongPress } = mountLongPress()
    longPress.press(pointer('pointerdown'))
    wrapper?.unmount()
    wrapper = null
    expect(longPress.holding.value).toBe(false)
    expect(cancelable('contextmenu')).toBe(false)
    vi.advanceTimersByTime(500)
    expect(onLongPress).not.toHaveBeenCalled()
  })
})
