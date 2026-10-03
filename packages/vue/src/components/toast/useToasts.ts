import { ref, type Ref, nextTick } from 'vue'
import type { ThemeConfig } from '../../theme/utensil-theme'
import type { ToastOptions } from './utensil-toast'

export type ToastEntry<Theme extends ThemeConfig = ThemeConfig> = ToastOptions<Theme> & {
  id: number
  show?: boolean
  leaving: boolean
}

export interface ToastHandle {
  update: (options: ToastOptions) => void
  dismiss: () => void
  // Whether the toast is still on screen — false once it dismisses or leaves
  presented: () => boolean
}

export interface Toasts<Theme extends ThemeConfig = ThemeConfig> {
  toasts: Ref<ToastEntry<Theme>[]>
  add: (message: string, options?: ToastOptions<Theme>) => ToastHandle
  dismiss: (id: number) => void
  remove: (id: number) => void
}

export function useToasts<Theme extends ThemeConfig = ThemeConfig>(defaultDuration = 2000): Toasts<Theme> {
  const toasts = ref<ToastEntry<Theme>[]>([]) as Ref<ToastEntry<Theme>[]>
  let nextId = 0
  const timers = new Map<number, ReturnType<typeof setTimeout>>()

  // Starts the remove animation
  function dismiss(id: number) {
    const timer = timers.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }

    const index = toasts.value.findIndex((toast) => toast.id === id)
    if (index === -1) {
      return
    }

    // A toast dismissed before its deferred show has nothing to animate out —
    // and the pending show would resurrect a leaving entry — so it goes now
    if (!toasts.value[index].show) {
      remove(id)
      return
    }

    update(id, { show: false, leaving: true })
  }

  // Removes the toast from the stack
  function remove(id: number) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  function add(message: string, options?: ToastOptions<Theme>): ToastHandle {
    const id = nextId++
    const entry: ToastEntry<Theme> = {
      id,
      show: false,
      message,
      busy: false,
      dismissible: false,
      leaving: false,
      ...options,
    }

    // Allow toast to mount before we trigger the change
    nextTick(() => {
      // trigger the change so we don't lose the transition in
      nextTick(() => {
        update(id, { show: true })
      })
    })

    toasts.value = [...toasts.value, entry]

    const time = entry.time ?? defaultDuration
    if (time > 0 && entry.progress === undefined) {
      timers.set(
        id,
        setTimeout(() => dismiss(id), time),
      )
    }

    return {
      update: (options: ToastOptions) => update(id, options),
      dismiss: () => dismiss(id),
      presented: () => toasts.value.some((toast) => toast.id === id && !toast.leaving),
    }
  }

  function update(id: number, options: Partial<ToastEntry>) {
    const index = toasts.value.findIndex((toast) => toast.id === id)
    if (index === -1) {
      return
    }

    const current = toasts.value[index]
    const updated: ToastEntry<Theme> = {
      ...current,
      ...options,
    }
    const next = [...toasts.value]
    next[index] = updated
    toasts.value = next
  }

  return { toasts, add, dismiss, remove }
}
