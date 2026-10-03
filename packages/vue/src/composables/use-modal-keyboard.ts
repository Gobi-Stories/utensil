import type { MaybeRefOrGetter } from 'vue'
import { toValue, watch } from 'vue'
import { useFocusHome } from './use-focus-home'

// A modal owns the keyboard. Keys pressed in it never reach the page beneath, which is inert while
// it's open, and focus that drops out of it returns to the dialog. The dialog needs
// tabindex="-1" to take that focus.
export function useModalKeyboard(dialog: MaybeRefOrGetter<HTMLDialogElement | null | undefined>) {
  function contain(event: KeyboardEvent) {
    event.stopPropagation()
  }

  useFocusHome(dialog)

  watch(
    () => toValue(dialog),
    (element, _, onCleanup) => {
      if (!element) {
        return
      }

      element.addEventListener('keydown', contain)
      element.addEventListener('keyup', contain)

      onCleanup(() => {
        element.removeEventListener('keydown', contain)
        element.removeEventListener('keyup', contain)
      })
    },
    { immediate: true, flush: 'post' },
  )
}
