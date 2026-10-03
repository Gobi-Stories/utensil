import { onBeforeUnmount, readonly, ref, type Ref } from 'vue'

// Touch long press: a finger held still arms after the system long-press time, a finger that
// moves first is a pan and stays with the browser, and one that lifts first is a tap. Mouse and
// pen presses are not long presses and are ignored — press-and-move logic for them belongs to the
// consumer. From the press until the gesture ends, the browser's own hold responses are quieted:
// the touch contextmenu (Android's element sheet) is stopped before any handler sees it, so
// nothing opens under the finger, and once armed, touch panning is blocked so the gesture keeps
// the finger. iOS raises its callout without an event, so consumers hold `holding` against
// `user-select: none` and `-webkit-touch-callout: none` in CSS. Arming gives the short haptic bump
// the quieted native long press would have, where the Vibration API exists.
//
// 'hold' fires the moment the timer elapses with the finger still down, for gestures that go on
// from there (a drag); the consumer ends them with release(). 'release' fires after the finger
// lifts and its event sequence has run, for surfaces the gesture opens (a menu): a popover opened
// any earlier is light-dismissed by the release's own pointerup, and the click the release
// synthesizes is swallowed so nothing underneath activates.

export interface LongPressOptions {
  /** Hold time before a still press arms; 500ms is the iOS and Android system long press */
  duration?: number
  /** Movement during the hold that turns the press into a pan instead */
  tolerance?: number
  /** When the callback fires: at the hold time with the finger down, or once it lifts */
  fire?: 'hold' | 'release'
}

export interface LongPress {
  /** A touch is held or armed — true from the press until the gesture ends */
  holding: Readonly<Ref<boolean>>
  /** Starts a hold from a pointerdown; ignored unless it's the primary touch and no hold is in flight */
  press(event: PointerEvent): void
  /** Ends the gesture — abandons a pending hold, or hands an armed one back to the browser */
  release(): void
}

const DEFAULT_DURATION = 500
const DEFAULT_TOLERANCE = 8
const ARM_BUMP_MS = 20

export function useLongPress(
  onLongPress: (event: PointerEvent) => void,
  { duration = DEFAULT_DURATION, tolerance = DEFAULT_TOLERANCE, fire = 'hold' }: LongPressOptions = {},
): LongPress {
  const holding = ref(false)
  let press: PointerEvent | null = null
  let armed = false
  let timer = 0
  let cleanups: Array<() => void> = []

  function listen<Kind extends keyof WindowEventMap>(
    kind: Kind,
    handler: (event: WindowEventMap[Kind]) => void,
    options?: AddEventListenerOptions,
  ) {
    window.addEventListener(kind, handler, options)
    cleanups.push(() => window.removeEventListener(kind, handler, options))
  }

  function start(event: PointerEvent) {
    if (press || event.pointerType !== 'touch' || !event.isPrimary) return
    press = event
    holding.value = true
    listen('pointermove', onPointerMove)
    listen('pointerup', onPointerEnd)
    listen('pointercancel', onPointerEnd)
    // The browser raises its own contextmenu on a touch hold at its own threshold, either side of
    // ours; captured at the window it never reaches the page's handlers
    listen(
      'contextmenu',
      (contextEvent) => {
        contextEvent.preventDefault()
        contextEvent.stopPropagation()
      },
      { capture: true },
    )
    // Armed, the gesture owns the finger; before that the browser is free to pan
    listen(
      'touchmove',
      (touchEvent) => {
        if (armed) touchEvent.preventDefault()
      },
      { passive: false },
    )
    timer = window.setTimeout(arm, duration)
  }

  function arm() {
    armed = true
    if (typeof navigator.vibrate === 'function') navigator.vibrate(ARM_BUMP_MS)
    if (fire === 'hold') onLongPress(press as PointerEvent)
  }

  function onPointerMove(event: PointerEvent) {
    if (!press || armed || event.pointerId !== press.pointerId) return
    if (Math.hypot(event.clientX - press.clientX, event.clientY - press.clientY) > tolerance) release()
  }

  function onPointerEnd(event: PointerEvent) {
    if (!press || event.pointerId !== press.pointerId) return
    if (!armed) {
      release()
      return
    }
    // An armed hold is the consumer's gesture until they release it
    if (fire !== 'release') return
    const held = press
    release()
    if (event.type !== 'pointerup') return
    swallowNextClick()
    // After the release's own event sequence, so a surface opened now survives it
    window.setTimeout(() => onLongPress(held), 0)
  }

  function swallowNextClick() {
    const block = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
    }
    window.addEventListener('click', block, { capture: true })
    // The synthesized click lands in the release's own task; a gesture the browser consumed sends none
    window.setTimeout(() => window.removeEventListener('click', block, { capture: true }), 0)
  }

  function release() {
    clearTimeout(timer)
    cleanups.forEach((cleanup) => cleanup())
    cleanups = []
    press = null
    armed = false
    holding.value = false
  }

  onBeforeUnmount(release)

  return { holding: readonly(holding), press: start, release }
}
