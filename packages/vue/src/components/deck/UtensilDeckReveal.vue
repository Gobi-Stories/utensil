<template>
  <Transition v-bind="transitionProps" v-on="on" :appear="appear">
    <div v-if="shown" class="utensil-deck-reveal">
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
  base: 'utensil-deck-reveal',
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
   * The incoming child wipes over the outgoing one with an expanding circular reveal; the outgoing
   * fades out beneath it. This transition is asymmetric (clip in, fade out), so its reverse is the
   * mirror: the outgoing clips closed (shrinks) on top while the incoming fades in beneath it.
   *
   * Positioned for z-index; fills a deck item with a height, and takes its content's height otherwise.
   */
  .utensil-deck-reveal {
    position: relative;
    height: 100%;
  }

  /* The moving child sits on top while leaving — let clicks fall through to the other panel. */
  .utensil-deck-reveal-leave-active,
  .utensil-deck-reveal-rev-leave-active {
    pointer-events: none;
  }

  /* Forward: incoming clips open over the outgoing, which fades out. */
  .utensil-deck-reveal-enter-active {
    transition: clip-path 0.55s ease;
    z-index: 1;
  }

  .utensil-deck-reveal-enter-from {
    clip-path: circle(0% at 50% 50%);
  }

  .utensil-deck-reveal-enter-to {
    clip-path: circle(150% at 50% 50%);
  }

  .utensil-deck-reveal-leave-active {
    transition: opacity 0.55s ease;
  }

  .utensil-deck-reveal-leave-to {
    opacity: 0;
  }

  /* Reverse: incoming fades in (beneath), outgoing clips closed on top. */
  .utensil-deck-reveal-rev-enter-active {
    transition: opacity 0.55s ease;
  }

  .utensil-deck-reveal-rev-enter-from {
    opacity: 0;
  }

  .utensil-deck-reveal-rev-leave-active {
    transition: clip-path 0.55s ease;
    z-index: 1;
  }

  .utensil-deck-reveal-rev-leave-from {
    clip-path: circle(150% at 50% 50%);
  }

  .utensil-deck-reveal-rev-leave-to {
    clip-path: circle(0% at 50% 50%);
  }

  .utensil-reduced-motion .utensil-deck-reveal-enter-active,
  .utensil-reduced-motion .utensil-deck-reveal-leave-active,
  .utensil-reduced-motion .utensil-deck-reveal-rev-enter-active,
  .utensil-reduced-motion .utensil-deck-reveal-rev-leave-active {
    transition: none;
  }
}
</style>
