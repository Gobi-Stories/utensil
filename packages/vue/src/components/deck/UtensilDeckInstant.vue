<template>
  <Transition v-bind="transitionProps" v-on="on" :appear="appear">
    <div v-if="shown" class="utensil-deck-instant">
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
  /** Accepted for contract parity — an instant child never animates. */
  appear?: boolean
  /** Accepted for contract parity — an instant child has no animation to reverse. */
  reverse?: boolean
  /** Accepted for contract parity — an instant child has no transitions to select. */
  transitions?: DeckTransitions
  /** Accepted for contract parity — an instant child has no nested transition to wait for. */
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
  base: 'utensil-deck-instant',
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
   * No transition: the deck swaps children immediately. Useful for tab-like view switching, and as
   * the natural baseline when motion is undesirable. With no CSS transition declared, Vue resolves the
   * enter/leave on the next frame, so the deck unmounts the outgoing child right away.
   */
  .utensil-deck-instant {
    position: relative;
    height: 100%;
  }
}
</style>
