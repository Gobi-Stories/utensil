<template>
  <component :is="scrollContainer" ref="scrollerRef" class="utensil-scroll-loader" v-bind="containerProps">
    <slot name="prepend" />
    <slot v-if="showEmpty" name="empty" />
    <template v-else-if="items">
      <slot :scrolled="scrollController.scrolled.value" />
    </template>
    <slot v-if="(loading || scrollController.loadingPage.value) && !hasError" name="loading">
      <div class="spinner">
        <UtensilSpinner />
      </div>
    </slot>
    <slot v-if="hasError" name="error" :retry="scrollController.retry">
      <div class="error">
        <span>Something went wrong.</span>
        <UtensilButton v-if="mayRetry" @click="scrollController.retry">Retry</UtensilButton>
      </div>
    </slot>
    <slot v-if="done" name="append" />
    <slot v-if="done" name="footer" />
  </component>
</template>

<script setup lang="ts">
import { ref, computed, toRef, onMounted, type Component } from 'vue'
import { useScrollController } from './use-scroll-controller'
import UtensilButton from '../button/UtensilButton.vue'
import UtensilSpinner from '../spinner/UtensilSpinner.vue'

export interface UtensilScrollLoaderProps {
  items?: unknown[]
  scroller?: Element
  scrollContainer?: string | Component
  containerProps?: Record<string, unknown>
  content?: Element
  bufferLength?: number
  load: () => Promise<void> | void
  done?: boolean
  horizontal?: boolean
  loading?: boolean
  hasError: boolean
  mayRetry?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<UtensilScrollLoaderProps>(), {
  items: () => [],
  scrollContainer: 'div',
  containerProps: () => ({}),
  bufferLength: 20,
  done: false,
  horizontal: false,
  loading: false,
  mayRetry: false,
  disabled: false,
})

defineSlots<{
  prepend?(): unknown
  default?(props: { scrolled: boolean }): unknown
  empty?(): unknown
  loading?(): unknown
  error?(props: { retry: () => void }): unknown
  append?(): unknown
  footer?(): unknown
}>()

// Template refs
const scrollerRef = ref<Element | null>(null)

// Computed to determine if empty slot should be shown
const showEmpty = computed(() => {
  return !!(props.items && props.items.length === 0 && !props.loading)
})

// Setup scroll controller
// The scroller/content props stay reactive — hosts often resolve their scroll container from a
// template ref after this component mounts.
const scrollController = useScrollController({
  items: toRef(props, 'items'),
  bufferLength: props.bufferLength,
  load: props.load,
  done: toRef(props, 'done'),
  hasError: toRef(props, 'hasError'),
  scroller: computed(() => props.scroller ?? scrollerRef.value),
  content: toRef(props, 'content'),
  horizontal: props.horizontal,
  disabled: toRef(props, 'disabled'),
})

// Set up default elements for scroll controller after mounting
onMounted(() => {
  if (!props.scroller && scrollerRef.value) {
    scrollController.setScroller(scrollerRef.value)
  }
  if (!props.content && scrollerRef.value) {
    scrollController.setContent(scrollerRef.value)
  }
})
</script>

<style scoped>
@layer utensil {
  .utensil-scroll-loader {
    position: relative;
  }

  .spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: var(--space-5);
  }

  .error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-4);
    padding: var(--space-5);
    color: var(--pencil-11);
    font-size: var(--font-size-2);
    text-align: center;
  }
}
</style>
