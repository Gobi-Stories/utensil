<template generic="Theme extends ThemeConfig">
  <Transition name="utensil-banner">
    <section
      v-if="isOpen"
      v-bind="$attrs"
      class="utensil-banner"
      :class="[...themeClasses, position]"
      :style="style"
      :aria-label="label"
    >
      <div class="utensil-banner-frame">
        <div class="utensil-banner-body" :class="[`ui-${variation}`, { centered, dismissible }]" :style="edgeStyle">
          <div class="utensil-banner-main">
            <div class="utensil-banner-message">
              <div v-if="icon" ref="startEdge" class="utensil-banner-icon">
                <UtensilIcon :icon="icon" />
              </div>
              <div class="utensil-banner-content" :role="role">
                <slot></slot>
              </div>
            </div>
            <div v-if="$slots.actions || dismissible" ref="endEdge" class="utensil-banner-end">
              <div v-if="$slots.actions" class="utensil-banner-actions">
                <slot name="actions"></slot>
              </div>
            </div>
          </div>
          <UtensilCloseButton
            v-if="dismissible"
            class="utensil-banner-dismiss"
            :description="dismissLabel"
            @click="dismiss"
          />
        </div>
      </div>
    </section>
  </Transition>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'
import type { ColorProp, IconProp, ScaleProp, ThemeConfig, UtensilUIVariation } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'
import UtensilIcon from '../icon/UtensilIcon.vue'
import UtensilCloseButton from '../circle-button/UtensilCloseButton.vue'

/** The page edge the banner attaches to. */
export type BannerPosition = 'top' | 'bottom'

export type BannerVariation = Extract<UtensilUIVariation, 'surface' | 'soft' | 'outline' | 'solid'>

export interface Props<Theme extends ThemeConfig> {
  /** Names the banner's region for assistive technology. */
  label: string
  /** The page edge the banner attaches to: its border, shadow, entrance and exit face the page from there. */
  position?: BannerPosition
  color?: ColorProp<Theme>
  variation?: BannerVariation
  /** Icon shown at the start of the banner. */
  icon?: IconProp<Theme>
  scale?: ScaleProp
  /** Shows a close button that closes the banner and emits `dismiss`. */
  dismissible?: boolean
  /** The close button's accessible name. */
  dismissLabel?: string
  /** Centers the content on the banner, between the icon and the actions and close button at its edges. */
  centered?: boolean
  /** Announces the content when the banner appears: `status` politely, `alert` at once. */
  role?: 'status' | 'alert'
  /** Whether the banner shows. Bind with `v-model:open` to control it; unbound, it shows until it is dismissed. */
  open?: boolean
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<Props<Theme>>(), {
  position: 'top',
  color: 'pen',
  variation: 'surface',
  icon: undefined,
  scale: undefined,
  dismissible: false,
  dismissLabel: 'Dismiss',
  centered: false,
  role: undefined,
  open: undefined,
})

const emit = defineEmits<{
  /** The close button was clicked. */
  dismiss: []
  /** The banner asks to close, from its close button. */
  'update:open': [open: boolean]
}>()

// A bound open prop is the owner's to change; unbound, the banner keeps its own state
const localOpen = ref(true)
const isOpen = computed(() => props.open ?? localOpen.value)

function dismiss() {
  if (props.open === undefined) {
    localOpen.value = false
  }
  emit('update:open', false)
  emit('dismiss')
}

const penColor = computed<ColorProp<Theme>>(() => props.color || 'pen')

const { classes: themeClasses, style } = useTheme({
  pen: penColor,
  relativeScale: () => props.scale,
})

// Centered content needs both sides as wide as the wider edge, even when the content leaves them no spare room
const startEdge = useTemplateRef<HTMLElement>('startEdge')
const endEdge = useTemplateRef<HTMLElement>('endEdge')
const edgeWidth = ref(0)
let edgeObserver: ResizeObserver | undefined

watch(
  () => [props.centered, startEdge.value, endEdge.value] as const,
  ([centered, start, end]) => {
    edgeObserver?.disconnect()
    edgeObserver = undefined
    const edges = [start, end].filter((edge) => !!edge)
    if (!centered || !edges.length || typeof ResizeObserver === 'undefined') {
      return
    }

    const observer = new ResizeObserver(() => {
      edgeWidth.value = Math.max(...edges.map((edge) => edge.offsetWidth))
    })
    edges.forEach((edge) => observer.observe(edge))
    edgeObserver = observer
  },
  { immediate: true, flush: 'post' },
)

onBeforeUnmount(() => edgeObserver?.disconnect())

const edgeStyle = computed(() =>
  props.centered && edgeWidth.value ? { '--utensil-banner-edge-width': `${edgeWidth.value}px` } : undefined,
)
</script>

<style scoped>
@layer utensil {
  /* Takes its own space in the page's layout, never covering content. The page's background under the variation's
     fill keeps it opaque whatever the variation. */
  .utensil-banner {
    display: grid;
    grid-template-rows: 1fr;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    background: var(--background);
    animation: utensil-banner-open var(--utensil-banner-duration, 0.3s) ease-out;
  }

  .utensil-banner.top {
    border-block-end: 1px solid var(--pencil-a6);
    box-shadow: 0 var(--space-1) var(--space-3) calc(var(--space-1) * -1)
      var(--utensil-banner-shadow-color, var(--black-a2));
  }

  .utensil-banner.bottom {
    border-block-start: 1px solid var(--pencil-a6);
    box-shadow: 0 calc(var(--space-1) * -1) var(--space-3) calc(var(--space-1) * -1)
      var(--utensil-banner-shadow-color, var(--black-a2));
  }

  /* Clips the body while the row grows and shrinks, so the banner makes and gives back its room rather than jumping */
  .utensil-banner-frame {
    min-height: 0;
    overflow: hidden;
  }

  /* The close button stays beside the message, while the actions wrap below it when there isn't room */
  .utensil-banner-body {
    display: flex;
    align-items: center;
    gap: var(--space-2) var(--space-3);
    padding: var(--utensil-banner-padding, var(--space-3) var(--space-4));
    font-size: var(--font-size-2);
    line-height: var(--line-height-2);
    animation: utensil-banner-slide-from-top var(--utensil-banner-duration, 0.3s) ease-out;
  }

  .utensil-banner.bottom .utensil-banner-body {
    animation-name: utensil-banner-slide-from-bottom;
  }

  /* Leaving, the banner shrinks away and slides back to its edge */
  .utensil-banner.utensil-banner-leave-active {
    animation: utensil-banner-close var(--utensil-banner-duration, 0.3s) ease-in forwards;
    pointer-events: none;
  }

  .utensil-banner.utensil-banner-leave-active .utensil-banner-body {
    animation: utensil-banner-slide-to-top var(--utensil-banner-duration, 0.3s) ease-in forwards;
  }

  .utensil-banner.bottom.utensil-banner-leave-active .utensil-banner-body {
    animation-name: utensil-banner-slide-to-bottom;
  }

  /* The edge's own line already separates the banner from the page */
  .utensil-banner-body:where(.ui-surface, .ui-outline) {
    box-shadow: none;
  }

  .utensil-banner-icon {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    font-size: var(--font-size-3);
    color: var(--pen-a11);
  }

  .utensil-banner-body.ui-solid .utensil-banner-icon {
    color: inherit;
  }

  /* The icon stays beside its content. Together they wrap onto their own line before they get too narrow to read,
     with the actions following. */
  .utensil-banner-main {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2) var(--space-3);
    min-width: 0;
  }

  .utensil-banner-message {
    display: flex;
    flex: 1 1 var(--utensil-banner-content-min-width, 20rem);
    align-items: center;
    gap: var(--space-3);
    min-width: 0;
  }

  .utensil-banner-content {
    flex: 1;
    min-width: 0;
  }

  .utensil-banner-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2);
  }

  /* Lays the actions out in the message's row unless the content is centered */
  .utensil-banner-end {
    display: contents;
  }

  .utensil-banner-dismiss {
    flex-shrink: 0;
  }

  /* Equal sides, each as wide as the wider needs, keep the content on the banner's center line. The content takes
     --utensil-banner-content-width, or its own width, up to what fits. */
  .utensil-banner-body.centered {
    display: grid;
    grid-template-columns:
      minmax(var(--utensil-banner-edge-width, auto), 1fr)
      minmax(0, var(--utensil-banner-content-width, max-content))
      minmax(var(--utensil-banner-edge-width, auto), 1fr);
  }

  /* Centered, the icon and content take columns of their own */
  .utensil-banner-body.centered :where(.utensil-banner-main, .utensil-banner-message) {
    display: contents;
  }

  .utensil-banner-body.centered .utensil-banner-icon {
    grid-area: 1 / 1;
    justify-self: start;
  }

  .utensil-banner-body.centered .utensil-banner-content {
    grid-area: 1 / 2;
  }

  /* The actions and close button share the end column, the actions leaving room for the button */
  .utensil-banner-body.centered .utensil-banner-end {
    display: flex;
    align-items: center;
    grid-area: 1 / 3;
    justify-self: end;
  }

  .utensil-banner-body.centered.dismissible .utensil-banner-end {
    padding-inline-end: calc(var(--space-6) + var(--space-3));
  }

  .utensil-banner-body.centered.dismissible .utensil-banner-end:empty {
    padding-inline-end: var(--space-6);
  }

  .utensil-banner-body.centered .utensil-banner-dismiss {
    grid-area: 1 / 3;
    justify-self: end;
  }

  /* Too narrow for equal sides, centered content wraps as the row layout does */
  @container size-container (max-width: 576px) {
    .utensil-banner-body.centered {
      display: flex;
    }

    .utensil-banner-body.centered :where(.utensil-banner-main, .utensil-banner-message) {
      display: flex;
    }

    .utensil-banner-body.centered .utensil-banner-end {
      display: contents;
    }
  }

  .utensil-reduced-motion .utensil-banner,
  .utensil-reduced-motion .utensil-banner-body,
  .utensil-reduced-motion .utensil-banner.utensil-banner-leave-active,
  .utensil-reduced-motion .utensil-banner.utensil-banner-leave-active .utensil-banner-body {
    animation: none;
  }

  .utensil-high-contrast .utensil-banner {
    border-color: var(--pencil-a9);
  }

  @keyframes utensil-banner-open {
    from {
      grid-template-rows: 0fr;
    }
  }

  @keyframes utensil-banner-close {
    to {
      grid-template-rows: 0fr;
    }
  }

  @keyframes utensil-banner-slide-from-top {
    from {
      transform: translateY(-100%);
    }
  }

  @keyframes utensil-banner-slide-from-bottom {
    from {
      transform: translateY(100%);
    }
  }

  @keyframes utensil-banner-slide-to-top {
    to {
      transform: translateY(-100%);
    }
  }

  @keyframes utensil-banner-slide-to-bottom {
    to {
      transform: translateY(100%);
    }
  }
}
</style>

<!-- Unscoped: the edge's shadow follows the mode of the nearest theme -->
<style>
@layer utensil {
  .light-mode .utensil-banner {
    --utensil-banner-shadow-color: var(--black-a2);
  }

  .dark-mode .utensil-banner {
    --utensil-banner-shadow-color: var(--black-a6);
  }
}
</style>
