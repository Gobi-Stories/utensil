import { ref, computed, onMounted, onUnmounted, watch, type Ref } from 'vue'

export interface UseScrollControllerOptions {
  items: Ref<unknown[]>
  bufferLength?: number
  load: () => Promise<void> | void
  done: Ref<boolean>
  hasError: Ref<boolean>
  scroller?: Ref<Element | null | undefined>
  content?: Ref<Element | null | undefined>
  horizontal?: boolean
  disabled?: Ref<boolean>
}

export function useScrollController(options: UseScrollControllerOptions) {
  const { items, bufferLength = 20, load, done, hasError, scroller, content, horizontal = false, disabled } = options

  const loadingPage = ref(false)
  const scrolled = ref(false)
  const destroyed = ref(false)

  // Default refs for when elements aren't provided
  const defaultScrollerRef = ref<Element | null>(null)
  const defaultContentRef = ref<Element | null>(null)

  // Computed properties for determining actual scroller and content elements
  const _scroller = computed(() => {
    if (scroller?.value) {
      return scroller.value
    }
    return defaultScrollerRef.value
  })

  // Computed properties for determining actual scroller and content elements
  const _content = computed(() => {
    if (content?.value) {
      return content.value
    }
    if (defaultContentRef.value) {
      return defaultContentRef.value
    }
    return _scroller.value
  })

  // Check if scroller is fulfilled (has enough content below the fold)
  const scrollerFulfilled = (): boolean => {
    const scrollerEl = _scroller.value
    if (!scrollerEl || !items.value?.length) return true

    let scrollExtent: number
    let position: number

    if (!horizontal) {
      scrollExtent = scrollerEl.scrollHeight
      position = scrollerEl.scrollTop + scrollerEl.clientHeight
    } else {
      scrollExtent = scrollerEl.scrollWidth
      position = scrollerEl.scrollLeft + scrollerEl.clientWidth
    }

    const triggerMargin = (scrollExtent / items.value.length) * bufferLength
    const offscreenContent = scrollExtent - position

    return offscreenContent > triggerMargin
  }

  // Check if content is fulfilled (content extends below visible area)
  const contentFulfilled = (): boolean => {
    const contentEl = _content.value
    const scrollerEl = _scroller.value

    if (!contentEl || !scrollerEl || !items.value?.length) return true

    const { width, height, bottom: contentBottom } = contentEl.getBoundingClientRect()
    const { bottom: scrollerBottom } = scrollerEl.getBoundingClientRect()

    const scrollExtent = horizontal ? width : height
    const triggerMargin = (scrollExtent / items.value.length) * bufferLength
    const offscreenContent = contentBottom - scrollerBottom

    return offscreenContent > triggerMargin
  }

  // Main fill function that loads more content when needed
  const fill = async (retry = false): Promise<void> => {
    if (disabled?.value) {
      return
    }

    if (destroyed.value) {
      return
    }

    if (!items.value || !items.value.length) {
      return
    }

    if (done.value) {
      return
    }

    if (loadingPage.value) {
      return
    }

    if (hasError.value && !retry) {
      return
    }

    const scrollerEl = _scroller.value
    const contentEl = _content.value

    if (!scrollerEl) {
      return
    }

    const scrollerIsContent = scrollerEl === contentEl
    const fulfilled = scrollerIsContent ? scrollerFulfilled() : contentFulfilled()

    if (!fulfilled) {
      const lengthBeforeLoad = items.value.length
      loadingPage.value = true
      try {
        await load()
      } finally {
        loadingPage.value = false
      }
      // A load that added nothing can't make progress — stop instead of spinning the main
      // thread. When the items eventually land, the items watcher resumes the fill.
      if (items.value.length === lengthBeforeLoad) {
        return
      }
      // Recursively fill until satisfied
      await fill()
    }
  }

  // The fulfilled checks read geometry (scrollHeight, getBoundingClientRect),
  // which forces a synchronous layout whenever the DOM is dirty. Triggers
  // burst while a grid mounts — watchers, scroll and resize events — so fills
  // coalesce into at most one geometry read per animation frame instead of
  // thrashing layout between patches.
  let fillFrame: number | undefined
  let fillRetry = false

  const scheduleFill = (retry = false) => {
    fillRetry = fillRetry || retry
    if (fillFrame !== undefined) {
      return
    }
    fillFrame = requestAnimationFrame(() => {
      fillFrame = undefined
      const retrying = fillRetry
      fillRetry = false
      void fill(retrying)
    })
  }

  // Update function called on scroll and resize
  const update = () => {
    scrolled.value = true
    scheduleFill()
  }

  // Retry function for manual retries
  const retry = () => scheduleFill(true)

  // Set up event listeners
  onMounted(() => {
    window.addEventListener('resize', update)

    // Initial fill
    scheduleFill()
  })

  onUnmounted(() => {
    destroyed.value = true
    window.removeEventListener('resize', update)

    if (fillFrame !== undefined) {
      cancelAnimationFrame(fillFrame)
      fillFrame = undefined
    }

    const scrollerEl = _scroller.value
    if (scrollerEl) {
      scrollerEl.removeEventListener('scroll', update)
    }
  })

  // Watch for scroller changes to update event listeners
  watch(
    _scroller,
    (newScroller, oldScroller) => {
      if (oldScroller) {
        oldScroller.removeEventListener('scroll', update)
      }
      if (newScroller) {
        newScroller.addEventListener('scroll', update)
      }
    },
    { immediate: true },
  )

  watch(items, () => {
    scheduleFill()
  })

  // Watch for done changes
  watch(done, (isDone) => {
    if (!isDone) {
      scheduleFill()
    }
  })

  // Fills skipped while disabled (e.g. the host hidden with items changing
  // underneath) are caught up when the controller re-enables
  if (disabled) {
    watch(disabled, (isDisabled) => {
      if (!isDisabled) {
        scheduleFill()
      }
    })
  }

  return {
    loadingPage: computed(() => loadingPage.value),
    scrolled: computed(() => scrolled.value),
    retry,
    fill,
    // Refs for setting default elements
    setScroller: (el: Element | null) => {
      defaultScrollerRef.value = el
    },
    setContent: (el: Element | null) => {
      defaultContentRef.value = el
    },
  }
}
