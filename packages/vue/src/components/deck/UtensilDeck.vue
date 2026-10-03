<template>
  <div class="utensil-deck">
    <template v-for="id in mounted" :key="id">
      <slot
        :id="id"
        :active="id === current"
        :appear="id === current ? appearFor() : false"
        :reverse="reverse"
        :transitions="transitions"
        :transition-ended="() => settle(id)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue'
import { UtensilDeckContextKey, type DeckTransitions } from './utensil-deck'

interface Props {
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
}

const { current, appear = false, reverse = false, transitions = 'both' } = defineProps<Props>()

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
    emit('entered', id)
    return
  }
  const index = leaving.value.indexOf(id)
  if (index !== -1) leaving.value.splice(index, 1)
  emit('left', id)
}

onMounted(() => {
  firstRender.value = false
})
</script>

<style scoped>
@layer utensil {
  .utensil-deck {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    /* Contain child stacking (e.g. reveal/flip z-index) within the deck. */
    isolation: isolate;
  }
}
</style>
