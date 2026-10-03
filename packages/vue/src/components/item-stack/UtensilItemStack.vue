<template>
  <TransitionGroup :tag="tag" class="utensil-item-stack" name="utensil-item-stack" @before-leave="pinLeavingItem">
    <slot />
  </TransitionGroup>
</template>

<script setup lang="ts">
// A vertical stack that animates its items in and out: a new item fades in
// while a gap opens for it, a removed item fades out in place while its
// siblings glide together to close the gap. Items are arbitrary elements —
// each direct child needs a stable key for the transitions to track it.
interface Props {
  /** Element the stack renders as */
  tag?: string
}

const { tag = 'div' } = defineProps<Props>()

// A leaving item goes absolute so its gap can close — pin it to the spot and
// size it held in the flow, measured before the leave classes apply
function pinLeavingItem(el: Element) {
  if (!(el instanceof HTMLElement)) {
    return
  }

  el.style.insetBlockStart = `${el.offsetTop}px`
  el.style.insetInlineStart = `${el.offsetLeft}px`
  el.style.inlineSize = `${el.offsetWidth}px`
}
</script>

<!-- Unscoped: the transition classes land on slotted children, which carry the
     consumer's style scope -->
<style>
@layer utensil {
  .utensil-item-stack {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--utensil-item-stack-gap, var(--space-2));
  }

  .utensil-item-stack-move,
  .utensil-item-stack-enter-active,
  .utensil-item-stack-leave-active {
    transition:
      opacity 0.2s ease,
      transform 0.3s ease;
  }

  .utensil-item-stack-enter-from,
  .utensil-item-stack-leave-to {
    opacity: 0;
    transform: translateY(var(--space-2));
  }

  /* A leaving item drops out of the flow, held at its measured spot, so the gap
     it occupied closes underneath it while it fades */
  .utensil-item-stack > .utensil-item-stack-leave-active {
    position: absolute;
  }

  .utensil-reduced-motion .utensil-item-stack-move,
  .utensil-reduced-motion .utensil-item-stack-enter-active,
  .utensil-reduced-motion .utensil-item-stack-leave-active {
    transition: opacity 0.2s ease;
  }

  .utensil-reduced-motion .utensil-item-stack-enter-from,
  .utensil-reduced-motion .utensil-item-stack-leave-to {
    transform: none;
  }
}
</style>
