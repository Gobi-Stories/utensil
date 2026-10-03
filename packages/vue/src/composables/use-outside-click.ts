import type { MaybeRefOrGetter } from 'vue'
import { onBeforeUnmount, onMounted, toValue } from 'vue'

// Light dismiss for floating surfaces: a press outside the target invokes the callback and the
// press's events are swallowed so the element under the pointer is never activated — only the
// next click interacts with the page again. With swallow disabled the press flows on to the
// page, so the same press that dismisses can also start an interaction underneath (e.g. a
// drag on content the surface floats over). A keyboard or programmatic activation outside
// (a click with no press) also dismisses, but isn't swallowed — the activation completes.
// Outside is decided on the event's composed path, not its target: document-level listeners
// see events from inside a shadow tree (e.g. a web component) retargeted to the shadow host,
// which would misclassify every press inside the host as outside the target.
// A press inside an open dialog the target isn't part of is on a higher layer, not outside —
// interacting with a modal must not dismiss the surfaces it opened over.

export interface OutsideClickOptions {
  // Gates handling — presses pass through untouched while false
  when?: MaybeRefOrGetter<boolean>
  // Selectors that don't count as outside, e.g. the toggle button that opens the target
  ignore?: MaybeRefOrGetter<string[] | undefined>
  // Whether a dismissing press is swallowed, or left to act on the page underneath
  swallow?: MaybeRefOrGetter<boolean>
}

export function useOutsideClick(
  target: MaybeRefOrGetter<Element | null | undefined>,
  onOutsideClick: () => void,
  { when = true, ignore, swallow = true }: OutsideClickOptions = {},
) {
  let swallowClick = false

  function outsidePress(event: Event): boolean {
    if (!toValue(when)) {
      return false
    }

    const element = toValue(target)
    if (!element) {
      return false
    }

    const path = event.composedPath()
    if (path.includes(element)) {
      return false
    }

    // The innermost open dialog the press ran through, if any — its layer owns the press
    const layer = path.find((node): node is HTMLDialogElement => node instanceof HTMLDialogElement && node.open)
    if (layer && !layer.contains(element)) {
      return false
    }

    const pathMatches = (selector: string) => path.some((node) => node instanceof Element && node.matches(selector))
    return !toValue(ignore)?.some(pathMatches)
  }

  function onPress(event: Event) {
    // A new press supersedes a pending swallow — the paired click may never have fired
    // (iOS Safari click dispatch, presses that end in a drag)
    swallowClick = false

    if (!outsidePress(event)) {
      return
    }

    if (toValue(swallow)) {
      event.preventDefault()
      event.stopPropagation()
      swallowClick = true
    }

    onOutsideClick()
  }

  function onClick(event: Event) {
    if (swallowClick) {
      swallowClick = false
      event.preventDefault()
      event.stopPropagation()
      return
    }

    // detail 0 marks an activation with no press to capture (keyboard, el.click())
    if (event instanceof MouseEvent && event.detail === 0 && outsidePress(event)) {
      onOutsideClick()
    }
  }

  onMounted(() => {
    document.addEventListener('pointerdown', onPress, { capture: true })
    document.addEventListener('click', onClick, { capture: true })
  })

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onPress, { capture: true })
    document.removeEventListener('click', onClick, { capture: true })
  })
}
