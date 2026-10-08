<template>
  <div
    ref="root"
    class="utensil-deck"
    :class="[`fit-${fit}`, { 'height-animated': heightAnimated }]"
    :style="contentHeight === undefined ? undefined : { height: `${contentHeight}px` }"
  >
    <div
      v-for="id in mounted"
      :key="id"
      :ref="(element) => setItem(id, element)"
      class="utensil-deck-item"
      :class="{ leaving: id !== current }"
      :inert="id !== current || undefined"
      :tabindex="focusOnChange ? -1 : undefined"
    >
      <slot
        :id="id"
        :active="id === current"
        :appear="id === current ? appearFor() : false"
        :reverse="reverse"
        :transitions="transitions"
        :transition-ended="() => settle(id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, useTemplateRef, watch } from 'vue'
import { UtensilDeckContextKey, type DeckTransitions } from './utensil-deck'

/** `container`: the deck fills the size its parent gives it. `content`: the deck is as tall as its active child. */
export type DeckFit = 'container' | 'content'

export interface Props {
  /** Identifier of the currently active child. */
  current: string
  /** Animate the initially-active child's entrance on first render. */
  appear?: boolean
  /**
   * Play transitions backwards (rewind). Provided to children via context so a consumer can set it
   * once on the deck instead of on every child; a child may still override with its own `reverse`.
   */
  reverse?: boolean
  /**
   * Which transitions are active — `both`, only `enter`, or only `leave`. Provided to children via
   * context; a child may override with its own `transitions`. Respects `reverse`.
   */
  transitions?: DeckTransitions
  /**
   * How the deck is sized. `container` fills the parent, which must give it a height. `content` sizes the deck
   * to the active child, so the page scrolls it; leaving children overlay it from the top.
   */
  fit?: DeckFit
  /** In a `content` deck, animate the deck's height to the incoming child's instead of snapping to it. */
  animateHeight?: boolean
  /**
   * When the current child changes while focus is in the deck, move focus to the incoming child once it has
   * entered: its first heading, or its item. Leaving children are inert, so focus would otherwise be lost.
   */
  focusOnChange?: boolean
}

const {
  current,
  appear = false,
  reverse = false,
  transitions = 'both',
  fit = 'container',
  animateHeight = false,
  focusOnChange = false,
} = defineProps<Props>()

provide(UtensilDeckContextKey, {
  reverse: computed(() => reverse),
  transitions: computed(() => transitions),
  // A direct child reports its id here; nested layers report through their parent layer instead.
  transitionEnd: (id?: string) => {
    if (id != null) settle(id)
  },
})

const emit = defineEmits<{
  /** A child finished transitioning in and is now the active child. */
  entered: [id: string]
  /** A child finished transitioning out and has been unmounted. */
  left: [id: string]
}>()

// Ids that were active and are still animating out. The deck keeps them mounted
// until each reports `transition-ended`, at which point they unmount.
const leaving = ref<string[]>([])
const firstRender = ref(true)

const root = useTemplateRef<HTMLElement>('root')
const items = new Map<string, HTMLElement>()
let focusPending = false

function setItem(id: string, element: unknown) {
  if (element instanceof HTMLElement) {
    items.set(id, element)
  } else {
    items.delete(id)
  }
}

// Mounted set is derived purely from `current` and the in-flight leavers — the deck never needs
// the full list of children. Stacking is DOM order (later = on top): leavers render last so an
// outgoing child paints over the incoming one — except when rewinding, where the incoming child
// must stay on top so a finishing leaver underneath can't flash over it at the end.
const mounted = computed(() => {
  const leavers = leaving.value.filter((id) => id && id !== current)
  const active = current ? [current] : []
  return reverse ? [...leavers, ...active] : [...active, ...leavers]
})

watch(
  () => current,
  (next, previous) => {
    if (next === previous) return
    // Runs before the leaving item turns inert, which drops its focus
    focusPending = focusOnChange && !!root.value?.contains(document.activeElement)
    // Returning to a child that is still leaving reactivates it rather than double-mounting.
    const reactivated = leaving.value.indexOf(next)
    if (reactivated !== -1) leaving.value.splice(reactivated, 1)
    if (previous && previous !== next && !leaving.value.includes(previous)) {
      leaving.value.push(previous)
    }
  },
)

// The initial active child only animates in when `appear` is set; later children always do.
function appearFor() {
  return firstRender.value ? appear : true
}

function settle(id: string) {
  if (id === current) {
    if (focusPending) {
      focusPending = false
      focusItem(id)
    }
    emit('entered', id)
    return
  }
  const index = leaving.value.indexOf(id)
  if (index !== -1) leaving.value.splice(index, 1)
  emit('left', id)
}

function focusItem(id: string) {
  const item = items.get(id)
  if (!item) return
  const heading = item.querySelector<HTMLElement>('h1, h2, h3, h4, h5, h6')
  if (heading && !heading.hasAttribute('tabindex')) {
    heading.setAttribute('tabindex', '-1')
  }
  ;(heading ?? item).focus({ preventScroll: true })
}

// A content deck animating its height holds the active item's height, and follows it as it changes
const contentHeight = ref<number>()
const heightAnimated = ref(false)
let resizeObserver: ResizeObserver | undefined

function observeActiveItem() {
  resizeObserver?.disconnect()
  resizeObserver = undefined
  const item = items.get(current)
  if (fit !== 'content' || !animateHeight || !item || typeof ResizeObserver === 'undefined') {
    contentHeight.value = undefined
    heightAnimated.value = false
    return
  }
  resizeObserver = new ResizeObserver(() => {
    // The first height is held without animating; later ones animate
    heightAnimated.value = contentHeight.value !== undefined
    contentHeight.value = item.offsetHeight
  })
  resizeObserver.observe(item)
}

watch([() => current, () => fit, () => animateHeight], () => nextTick(observeActiveItem))

onMounted(() => {
  firstRender.value = false
  observeActiveItem()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<style scoped>
@layer utensil {
  .utensil-deck {
    position: relative;
    width: 100%;
    /* Contain child stacking (e.g. reveal/flip z-index) within the deck. */
    isolation: isolate;
  }

  .utensil-deck.fit-container {
    height: 100%;
    overflow-x: hidden;
  }

  .utensil-deck.fit-container > .utensil-deck-item {
    position: absolute;
    inset: 0;
  }

  /* Clip only the inline axis, so the deck isn't a scroll container and a taller leaving child isn't cut off. */
  .utensil-deck.fit-content {
    overflow-x: clip;
  }

  .utensil-deck.fit-content > .utensil-deck-item {
    position: relative;
  }

  .utensil-deck.fit-content > .utensil-deck-item.leaving {
    position: absolute;
    inset-block-start: 0;
    inset-inline: 0;
  }

  .utensil-deck.height-animated {
    transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* An item takes focus only for screen readers and the keyboard to continue from */
  .utensil-deck-item:focus {
    outline: none;
  }

  .utensil-reduced-motion .utensil-deck.height-animated {
    transition: none;
  }
}
</style>

<!-- Unscoped: the heading is the child's content, which scoped styles don't reach -->
<style>
@layer utensil {
  /* A heading the deck focused is a place to continue from, not a control */
  .utensil-deck-item :where(h1, h2, h3, h4, h5, h6)[tabindex='-1']:focus {
    outline: none;
  }
}
</style>
