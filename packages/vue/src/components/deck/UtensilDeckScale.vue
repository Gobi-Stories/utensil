<template>
  <Transition v-bind="transitionProps" v-on="on" :appear="appear">
    <div v-if="shown" class="utensil-deck-scale">
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
  base: 'utensil-deck-scale',
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
  /*
   * Symmetric zoom: the incoming child scales up from underneath while the outgoing scales back down,
   * both crossfading. Compose with another transition to vary a single phase — e.g. an onboarding push
   * is `<UtensilDeckScale transitions="enter"><UtensilDeckSlide transitions="leave">`.
   *
   * Positioned for z-index; fills a deck item with a height, and takes its content's height otherwise.
   */
  .utensil-deck-scale {
    position: relative;
    height: 100%;
  }

  .utensil-deck-scale-leave-active {
    pointer-events: none;
  }

  .utensil-deck-scale-enter-active,
  .utensil-deck-scale-leave-active {
    transition:
      transform 0.45s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.45s ease;
  }

  .utensil-deck-scale-enter-from,
  .utensil-deck-scale-leave-to {
    transform: scale(0.9);
    opacity: 0.5;
  }

  .utensil-reduced-motion .utensil-deck-scale-enter-active,
  .utensil-reduced-motion .utensil-deck-scale-leave-active {
    transition: none;
  }
}
</style>
