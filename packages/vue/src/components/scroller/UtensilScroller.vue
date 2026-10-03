<template>
  <div
    class="utensil-scroller utensil-scrollbar"
    :class="{
      'has-envelope': envelope,
      horizontal: horizontal,
      'show-start-envelope': showScrollStart,
      'show-end-envelope': showScrollEnd,
    }"
  >
    <div v-if="envelope" class="scroll-start" ref="scrollStart"></div>
    <slot />
    <div v-if="envelope" class="scroll-end" ref="scrollEnd"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  envelope?: boolean
  horizontal?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  envelope: false,
  horizontal: false,
})

const emit = defineEmits<{
  'update:canScroll': [boolean]
}>()

const scrollStart = ref<HTMLElement>()
const scrollEnd = ref<HTMLElement>()
const showScrollStart = ref(false)
const showScrollEnd = ref(false)

// Content is scrollable if either end is not visible
const canScroll = computed(() => showScrollStart.value || showScrollEnd.value)

watch(
  canScroll,
  (value) => {
    emit('update:canScroll', value)
  },
  { immediate: true },
)

let scrollStartObserver: IntersectionObserver | null = null
let scrollEndObserver: IntersectionObserver | null = null

onMounted(() => {
  if (props.envelope && scrollStart.value && scrollEnd.value) {
    scrollStartObserver = new IntersectionObserver((entries) => {
      showScrollStart.value = !!entries[0].rootBounds && !entries[0].isIntersecting
    })
    scrollStartObserver.observe(scrollStart.value)

    scrollEndObserver = new IntersectionObserver((entries) => {
      showScrollEnd.value = !!entries[0].rootBounds && !entries[0].isIntersecting
    })
    scrollEndObserver.observe(scrollEnd.value)
  }
})

onBeforeUnmount(() => {
  scrollStartObserver?.disconnect()
  scrollEndObserver?.disconnect()
})
</script>

<style scoped>
@layer utensil {
  .utensil-scroller {
    --border-color: var(--pencil-a4);
  }

  /* The scroller consumes its own horizontal overscroll — reaching an end must
     not hand the swipe on to the browser's page navigation */
  .utensil-scroller.horizontal {
    overscroll-behavior-x: contain;
  }

  .utensil-scroller.has-envelope {
    transition: box-shadow 0.1s ease-out;
  }

  .utensil-scroller:not(.horizontal).show-start-envelope {
    box-shadow:
      inset 0 4px 2px -2px var(--border-color),
      inset 0 0 0 0 var(--border-color);
  }

  .utensil-scroller:not(.horizontal).show-end-envelope {
    box-shadow:
      inset 0 0 0 0 var(--border-color),
      inset 0 -4px 2px -2px var(--border-color);
  }

  .utensil-scroller:not(.horizontal).show-start-envelope.show-end-envelope {
    box-shadow:
      inset 0 4px 2px -2px var(--border-color),
      inset 0 -4px 2px -2px var(--border-color);
  }

  .utensil-scroller.horizontal.show-start-envelope {
    box-shadow: inset 4px 0 2px -2px var(--border-color);
  }

  .utensil-scroller.horizontal.show-end-envelope {
    box-shadow: inset -4px 0 2px -2px var(--border-color);
  }

  .utensil-scroller.horizontal.show-start-envelope.show-end-envelope {
    box-shadow:
      inset 4px 0 2px -2px var(--border-color),
      inset -4px 0 2px -2px var(--border-color);
  }

  .utensil-scroller.horizontal .scroll-end {
    margin-inline-start: -1px;
  }
}
</style>
