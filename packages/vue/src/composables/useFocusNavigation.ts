import { ref, type Ref, onBeforeUnmount } from 'vue'

export interface FocusNavigationOptions {
  /** Selector for focusable items (default: [data-focusable]:not([aria-disabled="true"])) */
  selector?: string
  /** Whether to wrap around at ends (default: true) */
  wrap?: boolean
  /** Orientation for arrow key handling (default: vertical) */
  orientation?: 'vertical' | 'horizontal'
}

export interface SetFocusedOptions {
  /** Whether to also move DOM focus to the element (default: false) */
  focus?: boolean
}

const DEFAULT_SELECTOR = '[data-focusable]:not([aria-disabled="true"])'

export function useFocusNavigation(containerRef: Ref<HTMLElement | undefined>, options: FocusNavigationOptions = {}) {
  const { selector = DEFAULT_SELECTOR, wrap = true, orientation = 'vertical' } = options

  const focusedElement = ref<HTMLElement | null>(null)

  /** Get all navigable items in the container */
  function getItems(): HTMLElement[] {
    if (!containerRef.value) return []
    return Array.from(containerRef.value.querySelectorAll<HTMLElement>(selector))
  }

  /** Set focus on an element (updates data-focused attribute) */
  function setFocused(element: HTMLElement | null, options?: SetFocusedOptions) {
    // Remove data-focused from previous element
    if (focusedElement.value && focusedElement.value !== element) {
      focusedElement.value.removeAttribute('data-focused')
    }

    focusedElement.value = element

    if (element) {
      element.setAttribute('data-focused', '')
      if (options?.focus) {
        element.focus()
      }
    }
  }

  /** Clear focus from all items */
  function clearFocus() {
    if (focusedElement.value) {
      focusedElement.value.removeAttribute('data-focused')
      focusedElement.value = null
    }
  }

  /** Focus the next item in the list */
  function focusNext(options?: SetFocusedOptions) {
    const items = getItems()
    if (items.length === 0) return

    const currentIndex = focusedElement.value ? items.indexOf(focusedElement.value) : -1
    let nextIndex: number

    if (currentIndex === -1) {
      nextIndex = 0
    } else if (currentIndex < items.length - 1) {
      nextIndex = currentIndex + 1
    } else {
      nextIndex = wrap ? 0 : currentIndex
    }

    const nextElement = items[nextIndex]
    if (nextElement) {
      setFocused(nextElement, options)
    }
  }

  /** Focus the previous item in the list */
  function focusPrev(options?: SetFocusedOptions) {
    const items = getItems()
    if (items.length === 0) return

    const currentIndex = focusedElement.value ? items.indexOf(focusedElement.value) : items.length
    let prevIndex: number

    if (currentIndex === -1 || currentIndex === items.length) {
      prevIndex = items.length - 1
    } else if (currentIndex > 0) {
      prevIndex = currentIndex - 1
    } else {
      prevIndex = wrap ? items.length - 1 : 0
    }

    const prevElement = items[prevIndex]
    if (prevElement) {
      setFocused(prevElement, options)
    }
  }

  /** Focus the first item in the list */
  function focusFirst(options?: SetFocusedOptions) {
    const items = getItems()
    if (items.length === 0) return

    const firstElement = items[0]
    if (firstElement) {
      setFocused(firstElement, options)
    }
  }

  /** Focus the last item in the list */
  function focusLast(options?: SetFocusedOptions) {
    const items = getItems()
    if (items.length === 0) return

    const lastElement = items[items.length - 1]
    if (lastElement) {
      setFocused(lastElement, options)
    }
  }

  /** Handle keyboard navigation */
  function handleKeydown(event: KeyboardEvent): boolean {
    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'

    switch (event.key) {
      case nextKey:
        event.preventDefault()
        focusNext({ focus: true })
        return true
      case prevKey:
        event.preventDefault()
        focusPrev({ focus: true })
        return true
      case 'Home':
        event.preventDefault()
        focusFirst({ focus: true })
        return true
      case 'End':
        event.preventDefault()
        focusLast({ focus: true })
        return true
      default:
        return false
    }
  }

  // Clean up data-focused attribute when unmounting
  onBeforeUnmount(() => {
    clearFocus()
  })

  return {
    focusedElement,
    setFocused,
    clearFocus,
    focusNext,
    focusPrev,
    focusFirst,
    focusLast,
    handleKeydown,
    getItems,
  }
}
