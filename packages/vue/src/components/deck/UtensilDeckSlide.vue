<template>
  <Transition v-bind="transitionProps" v-on="on" :appear="appear">
    <div v-if="shown" class="utensil-deck-slide">
      <slot />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useDeckTransition } from './useDeckTransition'
import type { DeckTransitions } from './utensil-deck'

export interface Props {
  /** Whether this child is the active (current) one in the deck. */
  active: boolean
  /** Animate the entrance the first time the child is shown. */
  appear?: boolean
  /** Play the transition backwards. Defaults to the deck's `reverse` context, then `false`. */
  reverse?: boolean
  /** Which phases this layer animates; the rest it delegates to a nested child. Defaults to the deck's context, then `both`. */
  transitions?: DeckTransitions
  /** Declares which phases the nested child animates, so this layer waits for it on a delegated phase. */
  childTransitions?: DeckTransitions
  /** This child's deck id — pass it on direct deck children so the deck can settle the right one. */
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  appear: true,
  reverse: undefined,
  transitions: undefined,
  childTransitions: undefined,
  id: undefined,
})

const { shown, transitionProps, on } = useDeckTransition({
  base: 'utensil-deck-slide',
  active: () => props.active,
  appear: () => props.appear,
  reverse: () => props.reverse,
  transitions: () => props.transitions,
  childTransitions: () => props.childTransitions,
  id: () => props.id,
})
</script>

<style scoped>
@layer utensil {
  /* Positioned for z-index; fills a deck item with a height, and takes its content's height otherwise. */
  .utensil-deck-slide {
    position: relative;
    height: 100%;
  }

  /* The moving child sits on top while leaving — let clicks fall through to the other panel. */
  .utensil-deck-slide-leave-active,
  .utensil-deck-slide-rev-leave-active {
    pointer-events: none;
  }

  /* Shared timing for both directions. */
  .utensil-deck-slide-enter-active,
  .utensil-deck-slide-leave-active,
  .utensil-deck-slide-rev-enter-active,
  .utensil-deck-slide-rev-leave-active {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Forward: enter from the inline-end edge, leave toward the inline-start edge. */
  .utensil-deck-slide-enter-from {
    transform: translateX(100%);
  }

  .utensil-deck-slide-leave-to {
    transform: translateX(-100%);
  }

  /* Reverse: slide the other way (enter from start, leave to end); incoming sits on top. */
  .utensil-deck-slide-rev-enter-from {
    transform: translateX(-100%);
  }

  .utensil-deck-slide-rev-leave-to {
    transform: translateX(100%);
  }

  .utensil-deck-slide-rev-enter-active {
    z-index: 1;
  }

  .utensil-reduced-motion .utensil-deck-slide-enter-active,
  .utensil-reduced-motion .utensil-deck-slide-leave-active,
  .utensil-reduced-motion .utensil-deck-slide-rev-enter-active,
  .utensil-reduced-motion .utensil-deck-slide-rev-leave-active {
    transition: none;
  }
}
</style>
