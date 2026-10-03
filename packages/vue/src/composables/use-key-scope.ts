import type { InjectionKey, MaybeRefOrGetter } from 'vue'
import { inject, provide } from 'vue'
import { useFocusHome } from './use-focus-home'

// A region that owns its keys, such as an editor. Its element holds focus for the region: with
// tabindex="-1", a click on anything unfocusable inside lands on it, and focus that drops out of
// it returns to it. Descendants attach their useKeys maps to it, so the region's keys work from
// anywhere inside and nowhere outside.

type KeyScope = MaybeRefOrGetter<HTMLElement | null | undefined>

const KEY = Symbol('KeyScope') as InjectionKey<KeyScope>

export function provideKeyScope(element: KeyScope) {
  provide(KEY, element)
  useFocusHome(element)
}

export function useKeyScope(): KeyScope {
  const scope = inject(KEY)

  if (!scope) {
    throw new Error('Key scope not provided — call provideKeyScope() in an ancestor')
  }

  return scope
}
