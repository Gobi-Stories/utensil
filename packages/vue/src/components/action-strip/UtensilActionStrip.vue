<template>
  <nav v-if="!sheetForm" v-bind="$attrs" class="utensil-action-strip strip-form" :aria-label="ariaLabel">
    <div v-if="$slots.header" class="strip-header">
      <slot name="header"></slot>
    </div>

    <UtensilScroller class="strip-scroll" envelope>
      <div class="strip-items">
        <slot></slot>
      </div>
    </UtensilScroller>

    <div class="strip-spacer"></div>

    <div v-if="$slots.footer" class="strip-footer">
      <slot name="footer"></slot>
    </div>
  </nav>

  <Transition v-else name="action-sheet">
    <div
      v-if="open"
      v-bind="$attrs"
      class="utensil-action-strip sheet-form"
      role="dialog"
      aria-modal="true"
      :aria-label="ariaLabel"
      @keydown.escape="open = false"
    >
      <div class="sheet-header">
        <UtensilCloseButton ref="closeRef" :description="closeLabel" @click="open = false" />
        <slot name="brand">
          <span class="sheet-title">{{ title }}</span>
        </slot>
      </div>

      <div class="sheet-scroll">
        <div class="sheet-grid">
          <slot></slot>
        </div>

        <div class="sheet-spacer"></div>

        <slot name="sheet"></slot>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import UtensilCloseButton from '../circle-button/UtensilCloseButton.vue'
import UtensilScroller from '../scroller/UtensilScroller.vue'

// Vertical strip of icon actions that becomes a sheet at small widths: the
// fixed-width column of app chrome hides, and the open model instead presents
// the same actions as a full-viewport grid with room for sheet-only content.
interface Props {
  ariaLabel?: string
  /** Sheet header title — the brand slot replaces it with custom content */
  title?: string
  /** Accessible label for the sheet's close button */
  closeLabel?: string
  /** Reference element measured for the strip/sheet switch; falls back to the window */
  container?: HTMLElement
  /** Width (px) at or below which the strip renders as the sheet form */
  sheetBreakpoint?: number
}

const props = withDefaults(defineProps<Props>(), {
  closeLabel: 'Close',
  sheetBreakpoint: 576,
})

// Class and attribute fallthrough is manual — this component renders one of two roots
defineOptions({ inheritAttrs: false })

// Whether the sheet form is showing — the consumer's launcher control opens it
const open = defineModel<boolean>('open', { default: false })

// Track container width reactively so the strip/sheet switch invalidates on
// resize. Falls back to window.innerWidth when no container is provided.
const containerWidth = ref(0)
let resizeObserver: ResizeObserver | null = null

function syncContainerWidth() {
  containerWidth.value = props.container?.clientWidth ?? window?.innerWidth ?? 0
}

watch(
  () => props.container,
  (container) => {
    resizeObserver?.disconnect()
    resizeObserver = null
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', syncContainerWidth)
    }

    syncContainerWidth()

    if (container) {
      resizeObserver = new ResizeObserver(() => syncContainerWidth())
      resizeObserver.observe(container)
    } else if (typeof window !== 'undefined') {
      window.addEventListener('resize', syncContainerWidth)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', syncContainerWidth)
  }
})

const sheetForm = computed(() => containerWidth.value <= props.sheetBreakpoint)

// A sheet left open only presents correctly at sheet widths — close it on leaving them
watch(sheetForm, (isSheet) => {
  if (!isSheet) {
    open.value = false
  }
})

// Keyboard users land on the close control when the sheet opens
const closeRef = ref<ComponentPublicInstance>()

watch(open, (isOpen) => {
  if (isOpen) {
    nextTick(() => closeRef.value?.$el?.focus())
  }
})
</script>

<style scoped>
@layer utensil {
  .utensil-action-strip {
    --background-color: var(--utensil-action-strip-background-color, var(--panel-solid));
    --width: var(--utensil-action-strip-width, calc(var(--space-9) + var(--space-5)));
    --header-height: var(--utensil-action-strip-header-height, var(--space-9));
    --gap: var(--utensil-action-strip-gap, var(--space-3));
    --inline-padding: var(--utensil-action-strip-inline-padding, var(--space-2));
    --header-margin: var(--utensil-action-strip-header-margin, var(--space-2));
  }

  /* --- Strip form: a permanent piece of app chrome at wide widths --- */

  .strip-form {
    display: flex;
    flex-direction: column;
    width: var(--width);
    min-width: var(--width);
    height: 100%;
    background-color: var(--background-color);
    border-inline-end: 1px solid var(--paper-9);
  }

  .strip-header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--header-height);
    min-height: var(--header-height);
    margin-block-end: var(--header-margin);
  }

  .strip-scroll {
    overflow-x: clip;
    overflow-y: auto;
  }

  .strip-items {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--gap);
    padding: 0 var(--inline-padding);
  }

  .strip-spacer {
    flex-grow: 1;
  }

  .strip-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--inline-padding);
    border-block-start: 1px solid var(--pencil-6);
  }

  /* --- Sheet form: full-viewport replacement at small widths --- */

  .sheet-form {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    background-color: var(--panel-solid);
  }

  .sheet-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    height: var(--header-height);
    min-height: var(--header-height);
    padding: 0 var(--space-3);
    border-block-end: 1px solid var(--pencil-6);
  }

  .sheet-title {
    font-size: var(--font-size-3);
    font-weight: 600;
    color: var(--pencil-12);
  }

  .sheet-scroll {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-2);
    flex-grow: 1;
    min-height: 0;
    overflow-y: auto;
    padding: var(--space-4);
  }

  .sheet-grid {
    /* Items read this to swap their strip padding for roomier grid tiles */
    --utensil-action-strip-item-padding: var(--space-4) var(--space-2);

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
    gap: var(--space-3);
  }

  .sheet-spacer {
    flex-grow: 1;
  }

  .action-sheet-enter-active,
  .action-sheet-leave-active {
    transition: opacity 0.15s ease;
  }

  .action-sheet-enter-from,
  .action-sheet-leave-to {
    opacity: 0;
  }

  .utensil-reduced-motion .action-sheet-enter-active,
  .utensil-reduced-motion .action-sheet-leave-active {
    transition: none;
  }
}
</style>
