import type { InjectionKey, Ref } from 'vue'
import { inject, onBeforeUnmount, provide, ref, watch } from 'vue'

// Coordinates views that display one at a time: opening any consumer closes every other
// consumer in the same context. Consumers pass in their open/close functions and/or open
// state and drive their visibility through the returned equivalents — how the view is
// actually shown is entirely theirs. provideExclusiveView() on a common parent creates
// the context; a descendant may call it again to start a nested context whose consumers
// are exclusive only to each other.

export type ExclusiveView = {
  open: () => void
  close: () => void
  opened: Ref<boolean>
}

const KEY = Symbol('ExclusiveViews') as InjectionKey<Map<symbol, () => void>>

export function provideExclusiveView() {
  provide(KEY, new Map())
}

export function useExclusiveView(view: Partial<ExclusiveView> = {}): ExclusiveView {
  const registry = inject(KEY)

  if (!registry) {
    throw new Error('Exclusive view context not provided — call provideExclusiveView() in an ancestor')
  }

  const id = Symbol()
  const opened = view.opened ?? ref(false)

  function open() {
    opened.value = true
    view.open?.()
  }

  function close() {
    opened.value = false
    view.close?.()
  }

  registry.set(id, close)
  onBeforeUnmount(() => registry.delete(id))

  // Reacts to the state rather than to open() so consumers flipping their own state
  // directly still close the others; sync flush keeps exclusivity within the same tick.
  watch(
    opened,
    (isOpen) => {
      if (!isOpen) return

      for (const [otherId, closeOther] of registry) {
        if (otherId !== id) closeOther()
      }
    },
    { flush: 'sync' },
  )

  return { open, close, opened }
}
