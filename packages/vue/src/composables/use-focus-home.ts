import type { MaybeRefOrGetter } from 'vue'
import { toValue, watch } from 'vue'

// Focus that drops out of an element — the focused control removed or hidden — returns to it,
// so keys keep landing inside rather than on the page body. The element needs tabindex="-1" to
// take that focus.
export function useFocusHome(home: MaybeRefOrGetter<HTMLElement | null | undefined>) {
  function recover() {
    const element = toValue(home)
    const active = document.activeElement

    if (element?.isConnected && (!active || active === document.body || !active.isConnected)) {
      element.focus({ preventScroll: true })
    }
  }

  function onFocusOut(event: FocusEvent) {
    if (event.relatedTarget) {
      return
    }

    // After the next frame: content that returns focus itself (e.g. a grid refocusing the item that
    // replaced a removed one) does it by then
    requestAnimationFrame(() => setTimeout(recover))
  }

  watch(
    () => toValue(home),
    (element, _, onCleanup) => {
      if (!element) {
        return
      }

      element.addEventListener('focusout', onFocusOut)
      onCleanup(() => element.removeEventListener('focusout', onFocusOut))
    },
    { immediate: true, flush: 'post' },
  )
}
