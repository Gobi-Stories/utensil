<template>
  <Transition v-bind="transitionProps" v-on="on" :appear="appear">
    <div v-if="shown" class="utensil-deck-flip">
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
  base: 'utensil-deck-flip',
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
  .utensil-deck-flip {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
  }

  /* The moving child sits on top while leaving — let clicks fall through to the other panel. */
  .utensil-deck-flip-leave-active,
  .utensil-deck-flip-rev-leave-active {
    pointer-events: none;
  }

  /* Shared timing; the incoming face flips in above the outgoing one in both directions. */
  .utensil-deck-flip-enter-active,
  .utensil-deck-flip-leave-active,
  .utensil-deck-flip-rev-enter-active,
  .utensil-deck-flip-rev-leave-active {
    transition:
      transform 0.5s ease,
      opacity 0.5s ease;
  }

  .utensil-deck-flip-enter-active,
  .utensil-deck-flip-rev-enter-active {
    z-index: 1;
  }

  /* Forward. */
  .utensil-deck-flip-enter-from {
    transform: perspective(1200px) rotateY(90deg);
    opacity: 0;
  }

  .utensil-deck-flip-leave-to {
    transform: perspective(1200px) rotateY(-90deg);
    opacity: 0;
  }

  /* Reverse: spin the other way. */
  .utensil-deck-flip-rev-enter-from {
    transform: perspective(1200px) rotateY(-90deg);
    opacity: 0;
  }

  .utensil-deck-flip-rev-leave-to {
    transform: perspective(1200px) rotateY(90deg);
    opacity: 0;
  }

  .utensil-reduced-motion .utensil-deck-flip-enter-active,
  .utensil-reduced-motion .utensil-deck-flip-leave-active,
  .utensil-reduced-motion .utensil-deck-flip-rev-enter-active,
  .utensil-reduced-motion .utensil-deck-flip-rev-leave-active {
    transition: none;
  }
}
</style>
