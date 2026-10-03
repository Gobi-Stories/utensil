import type { MaybeRefOrGetter } from 'vue'
import { ref, toValue, watch } from 'vue'

// A feature's keyboard map, owned by the element it's attached to. A key the map handles is the
// map's: by default its default action is prevented and it stops propagating, so nothing outside
// acts on it too. A key it doesn't handle — unbound, declined, or pressed where the map stands
// aside — travels on untouched. Keys an inner element already handled (default prevented) are
// left alone.
//
// Bindings name a key by its `event.key` value (`Space` stands for ' '), after any modifiers:
// `Ctrl+`, `Alt+`, `Shift+`, `Meta+`. Ctrl, Alt and Meta must match exactly. A named key
// (`ArrowLeft`, `F10`) matches Shift exactly too, but a character already carries Shift ('?'
// over '/'), so it matches case-insensitively and needs Shift only where the binding names it.

// Where a key is left to the element it was pressed in:
// - `typing`: text entry and form fields
// - `controls`: those plus buttons and links, which activate on their keys
// - `none`: never
export type IgnoredTargets = 'typing' | 'controls' | 'none'

// Returning false declines the key: it's left untouched, as if unbound
export type KeyHandler = (event: KeyboardEvent) => boolean | void

export interface KeyBinding {
  handler: KeyHandler
  preventDefault?: boolean
  stopPropagation?: boolean
  ignore?: IgnoredTargets
}

export interface KeysOptions {
  // The element the keys belong to. Without one, bind the returned `onKeydown` in a template.
  target?: MaybeRefOrGetter<HTMLElement | null | undefined>
  enabled?: MaybeRefOrGetter<boolean>
  // Defaults for every binding, each of which can override them
  preventDefault?: boolean
  stopPropagation?: boolean
  ignore?: IgnoredTargets
}

export interface Keys {
  onKeydown: (event: KeyboardEvent) => void
  start: () => void
  stop: () => void
}

interface ParsedBinding {
  key: string
  ctrl: boolean
  alt: boolean
  shift: boolean
  meta: boolean
  handler: KeyHandler
  preventDefault: boolean
  stopPropagation: boolean
  ignore: IgnoredTargets
}

const TYPING = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])'
const CONTROLS = `${TYPING}, button, a[href]`

function parse(name: string, binding: KeyHandler | KeyBinding, options: KeysOptions): ParsedBinding {
  const [, modifiers = '', key = name] = /^((?:(?:Ctrl|Alt|Shift|Meta)\+)*)(.+)$/.exec(name) ?? []
  const named = modifiers.split('+')
  const { handler, ...overrides } = typeof binding === 'function' ? { handler: binding } : binding

  return {
    key: key === 'Space' ? ' ' : key,
    ctrl: named.includes('Ctrl'),
    alt: named.includes('Alt'),
    shift: named.includes('Shift'),
    meta: named.includes('Meta'),
    handler,
    preventDefault: overrides.preventDefault ?? options.preventDefault ?? true,
    stopPropagation: overrides.stopPropagation ?? options.stopPropagation ?? true,
    ignore: overrides.ignore ?? options.ignore ?? 'typing',
  }
}

function matches(binding: ParsedBinding, event: KeyboardEvent): boolean {
  if (event.ctrlKey !== binding.ctrl || event.altKey !== binding.alt || event.metaKey !== binding.meta) {
    return false
  }

  if (binding.key.length === 1) {
    return event.key.toLowerCase() === binding.key.toLowerCase() && (!binding.shift || event.shiftKey)
  }

  return event.key === binding.key && event.shiftKey === binding.shift
}

function modifierCount(binding: ParsedBinding): number {
  return [binding.ctrl, binding.alt, binding.shift, binding.meta].filter(Boolean).length
}

function excluded(target: EventTarget | null, ignore: IgnoredTargets): boolean {
  if (ignore === 'none' || !(target instanceof HTMLElement)) {
    return false
  }

  return !!target.closest(ignore === 'typing' ? TYPING : CONTROLS)
}

export function useKeys(bindings: Record<string, KeyHandler | KeyBinding>, options: KeysOptions = {}): Keys {
  const { target, enabled = true } = options
  const listening = ref(true)

  // The most specific binding wins, so `Shift+S` isn't shadowed by `s`
  const parsed = Object.entries(bindings)
    .map(([name, binding]) => parse(name, binding, options))
    .sort((a, b) => modifierCount(b) - modifierCount(a))

  function onKeydown(event: KeyboardEvent) {
    if (!listening.value || !toValue(enabled) || event.defaultPrevented || event.isComposing) {
      return
    }

    const binding = parsed.find((candidate) => matches(candidate, event))
    if (!binding || excluded(event.target, binding.ignore) || binding.handler(event) === false) {
      return
    }

    if (binding.preventDefault) {
      event.preventDefault()
    }

    if (binding.stopPropagation) {
      event.stopPropagation()
    }
  }

  if (target !== undefined) {
    watch(
      () => toValue(target),
      (element, _, onCleanup) => {
        if (!element) {
          return
        }

        element.addEventListener('keydown', onKeydown)
        onCleanup(() => element.removeEventListener('keydown', onKeydown))
      },
      { immediate: true, flush: 'post' },
    )
  }

  return {
    onKeydown,
    start: () => (listening.value = true),
    stop: () => (listening.value = false),
  }
}
