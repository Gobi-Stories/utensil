import { inject, type InjectionKey, type Ref, ref } from 'vue'

export interface ShowcaseContext {
  immersive: Ref<boolean>
}

export const showcaseContextKey: InjectionKey<ShowcaseContext> = Symbol('showcase-context')

const defaultContext: ShowcaseContext = {
  immersive: ref(false),
}

export function useShowcaseContext(): ShowcaseContext {
  return inject(showcaseContextKey, defaultContext)
}
