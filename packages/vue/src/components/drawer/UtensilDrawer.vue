<template>
  <div
    ref="drawerRef"
    class="utensil-drawer"
    :class="[
      mode,
      positionClass,
      overlayClass,
      transitionClass,
      { 'mobile-sheet': mobileSheet || fullSheet, 'full-sheet': fullSheet, slide },
    ]"
    :style="cssVars"
    :role="ariaLabel ? 'region' : undefined"
    :aria-label="ariaLabel"
  >
    <div ref="panelRef" class="drawer-panel" :tabindex="focusOnOpen ? -1 : undefined" :inert="offscreen || undefined">
      <slot :open="open" :close="close" :toggle="toggle" :mode="mode" :everOpened="everOpened"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'
import { useExclusiveView } from '../../composables/use-exclusive-view'
import { useKeys } from '../../composables/use-keys'
import { useOutsideClick } from '../../composables/use-outside-click'

type DrawerMode = 'open' | 'closed' | 'responsive'
type LightDismiss = 'never' | 'overlay' | 'always'

interface Props {
  container?: HTMLElement
  position?: 'start' | 'end'
  overlay?: 'responsive' | 'always'
  width?: string
  collapsedWidth?: string
  startClosed?: boolean
  overlayBreakpoint?: number
  hiddenBreakpoint?: number
  mobileSheet?: boolean
  /** Mobile sheet that covers the entire viewport instead of the standard partial height */
  fullSheet?: boolean
  /** Takes inline space when open at non-mobile widths instead of overlaying sibling content */
  inline?: boolean
  /** Joins the surrounding exclusive view context: opening closes the other members and vice versa */
  exclusive?: boolean
  slide?: boolean
  transition?: 'open' | 'close' | 'always' | 'none'
  lightDismiss?: LightDismiss
  /** A light dismiss lets the press through to the page — the press that closes the drawer also starts interactions underneath */
  lightDismissThrough?: boolean
  /** Escape pressed within the open drawer closes it */
  closeOnEscape?: boolean
  /** Opening moves focus to the drawer, so the keyboard continues where the user asked to go */
  focusOnOpen?: boolean
  ariaLabel?: string
  ignoreOutsideClickOn?: string[] // CSS selectors to ignore on outside click. For example, a drawer toggle button
}

const props = withDefaults(defineProps<Props>(), {
  position: 'start',
  overlay: 'responsive',
  transition: 'close',
  lightDismiss: 'overlay',
  overlayBreakpoint: 818,
  hiddenBreakpoint: 576,
})

// Reactive open state: the model drives the mode when bound, and every internal
// state change (methods, light dismiss, exclusivity) writes back through it.
// The explicit undefined default stops Vue boolean-casting an absent model to
// false, which would break the responsive initial mode.
const openModel = defineModel<boolean | undefined>('open', { default: undefined })

const mode = ref<DrawerMode>(initialMode())

function initialMode(): DrawerMode {
  if (openModel.value !== undefined) {
    return openModel.value ? 'open' : 'closed'
  }

  return props.startClosed ? 'closed' : 'responsive'
}

watch(openModel, (open) => {
  if (open !== undefined) {
    mode.value = open ? 'open' : 'closed'
  }
})

// Once opened, stays true — lets slot content mount lazily but survive closes
const everOpened = ref(mode.value !== 'closed')

watch(mode, (current) => {
  if (current !== 'closed') {
    everOpened.value = true
  }
})

const positionClass = computed(() => `position-${props.position}`)
const overlayClass = computed(() => (props.inline ? 'overlay-inline' : `overlay-${props.overlay}`))
const transitionClass = computed(() => `transition-${props.transition}`)

const cssVars = computed(() => {
  const vars: Record<string, string> = {}
  if (props.width) vars['--utensil-drawer-width'] = props.width
  if (props.collapsedWidth) vars['--utensil-drawer-collapsed-width'] = props.collapsedWidth
  return vars
})

// Track container width reactively so isOverlaying invalidates on resize.
// Falls back to window.innerWidth when no container is provided.
const containerWidth = ref(0)
let resizeObserver: ResizeObserver | null = null

function syncContainerWidth() {
  containerWidth.value = props.container?.clientWidth ?? window?.innerWidth ?? 0
}

function toggle() {
  if ('responsive' !== mode.value) {
    if ('open' === mode.value) {
      close()
    } else {
      open()
    }

    return
  }

  if (containerWidth.value > props.overlayBreakpoint) {
    close()
  } else {
    open()
  }
}

function open() {
  mode.value = 'open'
  openModel.value = true
}

function close() {
  mode.value = 'closed'
  openModel.value = false
}

defineExpose({ toggle, open, close, mode })

if (props.exclusive) {
  useExclusiveView({
    opened: computed({
      get: () => mode.value === 'open',
      set: (opened) => (opened ? open() : close()),
    }),
  })
}

const isOverlaying = computed(() => {
  if (props.overlay === 'always') {
    return true
  }

  return containerWidth.value <= props.overlayBreakpoint
})

const drawerRef = useTemplateRef('drawerRef')

useOutsideClick(drawerRef, close, {
  when: () =>
    mode.value === 'open' &&
    (props.lightDismiss === 'always' || (props.lightDismiss === 'overlay' && isOverlaying.value)),
  ignore: () => props.ignoreOutsideClickOn,
  swallow: () => !props.lightDismissThrough,
})

// A drawer closed out of sight leaves the tab order and the accessibility tree too. A collapsed
// strip stays in view, so it stays usable.
const offscreen = computed(() => {
  if (!props.inline && props.overlay === 'always') {
    return mode.value !== 'open'
  }

  return mode.value === 'closed' && (props.inline || props.slide)
})

// An open popover inside keeps Escape: the key's default action closes it
function holdsOpenPopover(element: HTMLElement): boolean {
  return Array.from(element.querySelectorAll('[popover]')).some((popover) => popover.matches(':popover-open'))
}

useKeys(
  {
    Escape: {
      handler: () => {
        if (mode.value !== 'open' || (drawerRef.value && holdsOpenPopover(drawerRef.value))) {
          return false
        }

        close()
      },
      ignore: 'none',
    },
  },
  { target: drawerRef, enabled: () => !!props.closeOnEscape },
)

const panelRef = useTemplateRef('panelRef')

// Mounting open counts as opening: a host can remount a drawer as it opens
watch(
  mode,
  async (current) => {
    if (current !== 'open' || !props.focusOnOpen) {
      return
    }

    await nextTick()
    const panel = panelRef.value

    if (panel && !panel.contains(document.activeElement)) {
      panel.focus({ preventScroll: true })
    }
  },
  { immediate: true },
)

// React to container becoming available (parent template refs may resolve after
// child onMounted) and to it changing thereafter. Falls back to window resize
// when no container is provided.
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
</script>

<style scoped>
@layer utensil {
  .utensil-drawer {
    --drawer-width: var(--utensil-drawer-width, 260px);
    --drawer-collapsed-width: var(--utensil-drawer-collapsed-width, 0px);
    --drawer-z-index: var(--utensil-drawer-z-index, unset);
    --drawer-transition: 0s;

    height: 100%;
    flex-shrink: 0;
    transition: width var(--drawer-transition) ease;
    overflow: hidden;
  }

  /* --- Drawer Panel --- */

  .drawer-panel {
    width: var(--drawer-width);
    height: 100%;
    display: flex;
    flex-direction: column;
    transition:
      width var(--drawer-transition) ease,
      transform var(--drawer-transition) ease;
    z-index: var(--drawer-z-index);
  }

  /* The panel takes focus only to lead the keyboard into it; it isn't a control */
  .drawer-panel:focus {
    outline: none;
  }

  /* --- Transition modes --- */

  /* transition: close — animate when closing only */
  .transition-close.closed,
  .transition-close.responsive {
    --drawer-transition: 0.3s;
  }

  /* transition: open — animate when opening only */
  .transition-open.open {
    --drawer-transition: 0.3s;
  }

  /* transition: always — animate both directions */
  .transition-always {
    --drawer-transition: 0.3s;
  }

  /* transition: none — no animations (default cvar is 0s) */

  /* --- Default inline layout: responsive overlay takes inline space when open --- */

  .overlay-responsive {
    width: var(--drawer-width);
  }

  /* --- Always-overlay: never takes inline space --- */

  .overlay-always {
    width: 0;
  }

  /* --- Inline: the drawer participates in the flow, pushing sibling content when
     open and clipping to zero width when closed. The panel tracks the root so
     percentage widths resolve against the surrounding layout. --- */

  .overlay-inline {
    width: var(--drawer-width);
  }

  .overlay-inline.closed {
    width: 0;
  }

  .overlay-inline .drawer-panel {
    width: 100%;
  }

  /* --- Always-overlay: panel is absolutely positioned so it overlays sibling
     content, and slides off-screen via transform. (overlay:responsive+slide
     keeps the panel in flow at wide viewports — see further down — so the outer
     container's overflow:hidden clips the panel as it shrinks.) --- */

  .overlay-always .drawer-panel {
    position: absolute;
    inset-block: 0;
    /* Floating panels must stack above their sibling content. */
    z-index: var(--drawer-z-index, 1);
  }

  .overlay-always.position-start .drawer-panel {
    inset-inline-start: 0;
    transform: translateX(-100%);
  }

  .overlay-always.position-end .drawer-panel {
    inset-inline-end: 0;
    transform: translateX(100%);
  }

  :dir(rtl) .overlay-always.position-start .drawer-panel {
    transform: translateX(100%);
  }

  :dir(rtl) .overlay-always.position-end .drawer-panel {
    transform: translateX(-100%);
  }

  /* --- Open state --- */

  .overlay-always.open .drawer-panel {
    transform: translateX(0);
  }

  /* --- Closed state --- */

  /* Responsive overlay (collapse mechanic): collapse to strip width */
  .overlay-responsive:not(.slide).closed {
    width: var(--drawer-collapsed-width);
  }

  .overlay-responsive:not(.slide).closed .drawer-panel {
    width: var(--drawer-collapsed-width);
  }

  /* Responsive overlay (slide mechanic, wide viewport): outer reduces to 0, panel
     keeps its full width and is clipped via overflow:hidden — content inside the
     panel never reflows. */
  .overlay-responsive.slide.closed {
    width: 0;
  }

  /* Always overlay: slide off-screen via transform */
  .overlay-always.closed.position-start .drawer-panel {
    transform: translateX(-100%);
  }

  .overlay-always.closed.position-end .drawer-panel {
    transform: translateX(100%);
  }

  :dir(rtl) .overlay-always.closed.position-start .drawer-panel {
    transform: translateX(100%);
  }

  :dir(rtl) .overlay-always.closed.position-end .drawer-panel {
    transform: translateX(-100%);
  }

  /* A closed overlay panel is translated off-screen, not removed — over adjacent
     content it must not capture pointer events meant for what's underneath */
  .overlay-always.closed .drawer-panel,
  .overlay-responsive.slide.closed .drawer-panel,
  .overlay-inline.closed .drawer-panel {
    pointer-events: none;
  }

  /* ======================================
     Responsive overlay: medium viewports
     ====================================== */

  @container size-container (max-width: 818px) {
    .overlay-responsive:not(.slide).responsive {
      width: var(--drawer-collapsed-width);
    }

    .overlay-responsive:not(.slide).responsive .drawer-panel {
      width: var(--drawer-collapsed-width);
      position: absolute;
      inset-block: 0;
    }

    .overlay-responsive:not(.slide).open {
      width: var(--drawer-collapsed-width);
    }

    .overlay-responsive:not(.slide).open .drawer-panel {
      width: var(--drawer-width);
      position: absolute;
      inset-block: 0;
      box-shadow: var(--shadow-border-5);
    }

    .overlay-responsive:not(.slide).closed {
      width: var(--drawer-collapsed-width);
    }

    .overlay-responsive:not(.slide).closed .drawer-panel {
      width: var(--drawer-collapsed-width);
      position: absolute;
      inset-block: 0;
    }

    .overlay-responsive:not(.slide).position-start .drawer-panel {
      inset-inline-start: 0;
    }

    .overlay-responsive:not(.slide).position-end .drawer-panel {
      inset-inline-end: 0;
    }

    /* Slide mechanic at narrow viewports: switch from inline-width animation to a
       true overlay (panel absolute, transform-based, like overlay:always) so the
       drawer doesn't squeeze content out of the viewport. */
    .overlay-responsive.slide {
      width: 0;
    }

    .overlay-responsive.slide .drawer-panel {
      position: absolute;
      inset-block: 0;
    }

    .overlay-responsive.slide.position-start .drawer-panel {
      inset-inline-start: 0;
      transform: translateX(-100%);
    }

    .overlay-responsive.slide.position-end .drawer-panel {
      inset-inline-end: 0;
      transform: translateX(100%);
    }

    :dir(rtl) .overlay-responsive.slide.position-start .drawer-panel {
      transform: translateX(100%);
    }

    :dir(rtl) .overlay-responsive.slide.position-end .drawer-panel {
      transform: translateX(-100%);
    }

    .overlay-responsive.slide.open .drawer-panel {
      transform: translateX(0);
    }
  }

  /* ======================================
     Responsive overlay: small viewports
     ====================================== */

  @container size-container (max-width: 576px) {
    .overlay-responsive:not(.slide).responsive {
      width: 0;
    }

    .overlay-responsive:not(.slide).responsive .drawer-panel {
      width: 0;
      overflow: hidden;
    }

    .overlay-responsive:not(.slide).open {
      width: 0;
    }

    .overlay-responsive:not(.slide).open .drawer-panel {
      width: var(--drawer-width);
      position: absolute;
      inset-block: 0;
      z-index: var(--drawer-z-index);
      box-shadow: var(--shadow-border-5);
      overflow: visible;
    }

    .overlay-responsive:not(.slide).open.position-start .drawer-panel {
      inset-inline-start: 0;
    }

    .overlay-responsive:not(.slide).open.position-end .drawer-panel {
      inset-inline-end: 0;
    }

    .overlay-responsive:not(.slide).closed {
      width: 0;
    }

    .overlay-responsive:not(.slide).closed .drawer-panel {
      width: 0;
      overflow: hidden;
    }
  }

  /* ======================================
     Mobile bottom sheet
     ====================================== */

  /* @media not @container — targets mobile devices, not available width */
  @media (max-width: 480px) {
    /* An inline drawer becomes a sheet on mobile: no inline space, absolute panel */
    .mobile-sheet.overlay-inline {
      width: 0;
    }

    .mobile-sheet.overlay-inline .drawer-panel {
      position: absolute;
    }

    /* Override slide-overlay position/transform to slide from bottom instead of side */
    .mobile-sheet.overlay-always .drawer-panel,
    .mobile-sheet.overlay-responsive.slide .drawer-panel,
    .mobile-sheet.overlay-inline .drawer-panel {
      width: 100%;
      height: 80%;
      inset-block-start: auto;
      inset-block-end: 0;
      inset-inline: 0;
      transform: translateY(100%);
      border-block-start: 1px solid var(--pencil-a6);
    }

    .mobile-sheet.overlay-always.open .drawer-panel,
    .mobile-sheet.overlay-responsive.slide.open .drawer-panel,
    .mobile-sheet.overlay-inline.open .drawer-panel {
      transform: translateY(0);
    }

    .mobile-sheet.overlay-always.closed .drawer-panel,
    .mobile-sheet.overlay-responsive.slide.closed .drawer-panel,
    .mobile-sheet.overlay-inline.closed .drawer-panel {
      transform: translateY(100%);
    }

    /* Full sheet: the panel covers the whole viewport instead of a partial sheet.
       Fixed positioning escapes the drawer's layout context so the sheet overlays
       the surrounding chrome, not just the nearest positioned ancestor. */
    .full-sheet.mobile-sheet .drawer-panel {
      position: fixed;
      height: 100%;
      border-block-start: none;
    }
  }

  .utensil-reduced-motion .utensil-drawer {
    --drawer-transition: 0s;
  }
}
</style>
