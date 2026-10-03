<template>
  <Transition v-bind="transitionProps" v-on="on" :appear="appear">
    <div v-if="shown" class="utensil-deck-fade">
      <slot />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useDeckTransition } from './useDeckTransition'
import type { DeckTransitions } from './utensil-deck'

interface Props {
  /** Whether this child is the active (current) one in the deck. */
  active: boolean
  /** Animate the entrance the first time the child is shown. */
  appear?: boolean
  /** Accepted for contract parity — a symmetric crossfade looks the same played backwards. */
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
  base: 'utensil-deck-fade',
  symmetric: true,
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
  .utensil-deck-fade {
    position: absolute;
    inset: 0;
  }

  .utensil-deck-fade-leave-active {
    pointer-events: none;
  }

  .utensil-deck-fade-enter-active,
  .utensil-deck-fade-leave-active {
    transition: opacity 0.35s ease;
  }

  .utensil-deck-fade-enter-from,
  .utensil-deck-fade-leave-to {
    opacity: 0;
  }
}
</style>
