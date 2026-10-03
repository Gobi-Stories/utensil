import type { InjectionKey } from 'vue'
import { inject } from 'vue'

export interface UtensilTasksContext {
  emitClick: (payload: unknown) => void
}

const KEY = Symbol('UtensilTasksContext') as InjectionKey<UtensilTasksContext>

export function provideUtensilTasksContextKey(): InjectionKey<UtensilTasksContext> {
  return KEY
}

const defaults: UtensilTasksContext = {
  emitClick: () => {},
}

export function useUtensilTasksContext(): UtensilTasksContext {
  return inject(KEY, defaults)
}
