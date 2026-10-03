<template>
  <UtensilDrawer
    ref="drawerRef"
    class="utensil-side-menu"
    :class="{ 'can-scroll': canScroll }"
    :container="container"
    position="start"
    :start-closed="startClosed"
    :overlay="overlay"
    :overlay-breakpoint="overlayBreakpoint"
    :hidden-breakpoint="hiddenBreakpoint"
    :ignoreOutsideClickOn="ignoreOutsideClickOn"
  >
    <nav class="menu-content" :class="{ 'no-header': hideHeader }" :aria-label="ariaLabel">
      <div v-if="!hideHeader" class="menu-header" :class="{ absolute: absoluteHeader }">
        <UtensilButton
          v-if="collapsed || showToggleButton == 'always' || drawerMode == 'open'"
          class="menu-toggle"
          variation="text"
          color="pencil"
          icon="bars"
          @click="drawerRef?.toggle()"
          iconOnly
          aria-label="Toggle menu"
        />
        <div class="logo">
          <slot name="logo" :mode="drawerMode" :collapsed="collapsed"></slot>
        </div>
      </div>

      <UtensilScroller class="menu-scroll" envelope @update:canScroll="canScroll = $event">
        <slot :mode="drawerMode" :collapsed="collapsed"></slot>
      </UtensilScroller>

      <div class="menu-spacer"></div>

      <slot name="footer" :mode="drawerMode"></slot>
    </nav>
  </UtensilDrawer>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, provide, ref } from 'vue'
import UtensilButton from '../button/UtensilButton.vue'
import UtensilScroller from '../scroller/UtensilScroller.vue'
import UtensilDrawer from '../drawer/UtensilDrawer.vue'
import { sideMenuContextKey, type SideMenuMode } from './side-menu-keys'

interface Props {
  container: HTMLElement
  startClosed?: boolean
  ariaLabel?: string
  /** Overlay behaviour: responsive (below the breakpoint) or always floating over content. */
  overlay?: 'responsive' | 'always'
  overlayBreakpoint?: number
  hiddenBreakpoint?: number
  ignoreOutsideClickOn?: string[]
  // Hide the header (toggle + logo). The menu-content gains a small top padding to compensate.
  hideHeader?: boolean
  absoluteHeader?: boolean
  // Show the toggle button in the
  showToggleButton?: 'always' | 'collapsed'
  // Default for items: close the menu when an item is clicked (only while it floats over content).
  closeOnClick?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  overlay: 'responsive',
  overlayBreakpoint: 818,
  hiddenBreakpoint: 576,
  showToggleButton: 'always',
})

const drawerRef = ref<InstanceType<typeof UtensilDrawer>>()

// Track whether menu content is scrollable
const canScroll = ref(false)

const drawerMode = computed<SideMenuMode>(() => drawerRef.value?.mode ?? 'responsive')

// Track container width reactively — initialized synchronously to avoid a 0→actual flash
const containerWidth = ref(props.container.clientWidth)
const resizeObserver = new ResizeObserver((entries) => {
  containerWidth.value = entries[0].contentRect.width
})
resizeObserver.observe(props.container)
onBeforeUnmount(() => resizeObserver.disconnect())

const collapsed = computed(() => {
  if (drawerMode.value === 'open') {
    return false
  }

  if (drawerMode.value === 'closed') {
    return true
  }

  // In responsive mode, collapsed depends on whether the container is narrow enough
  return containerWidth.value <= props.overlayBreakpoint
})

// Item clicks only dismiss the floating menu — when it sits inline beside the content it stays.
function closeFromItem() {
  if (containerWidth.value <= props.overlayBreakpoint) {
    drawerRef.value?.close()
  }
}

provide(sideMenuContextKey, {
  mode: drawerMode,
  collapsed,
  closeOnClick: computed(() => props.closeOnClick ?? false),
  close: closeFromItem,
})

function toggle() {
  drawerRef.value?.toggle()
}

function open() {
  drawerRef.value?.open()
}

function close() {
  drawerRef.value?.close()
}

defineExpose({ toggle, open, close })
</script>

<style scoped>
@layer utensil {
  .utensil-side-menu {
    /* Component Cvars — map side-menu vars to drawer vars */
    --utensil-drawer-width: var(--side-menu-width, 260px);
    --utensil-drawer-collapsed-width: var(--side-menu-collapsed-width, calc(57px * var(--scale)));
    --utensil-drawer-z-index: var(--side-menu-z-index, unset);

    --background-color: var(--side-menu-background, var(--panel-solid));
    --box-shadow: var(--side-menu-box-shadow, unset);
    --border-color: var(--side-menu-border-color, var(--paper-9));
    --horizontal-padding: var(--side-menu-padding, var(--space-3));
    --header-height: var(--side-menu-header-height, var(--space-9));
    --header-margin: var(--side-menu-header-margin, var(--space-2));
    --section-margin: var(--side-menu-section-margin, var(--space-7));
    --title-display: var(--side-menu-title-display, block);
    --font-weight: var(--side-menu-font-weight, 500);

    background-color: var(--background);
    font-weight: var(--font-weight);
    line-height: normal;
  }

  .menu-content {
    background-color: var(--background-color);
    /* Ensures the menu remains a solid background color if given an alpha value. */
    background-image: linear-gradient(var(--background-color), var(--background-color));
    border-inline-end: 1px solid var(--border-color);
    box-shadow: var(--box-shadow);
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* With the header hidden, give the content a little breathing room at the top. */
  .menu-content.no-header {
    padding-top: var(--space-2);
  }

  .menu-header {
    height: var(--header-height);
    margin-block-end: var(--header-margin);
    padding: 0 var(--space-3);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-shrink: 0;

    &.absolute {
      position: absolute;

      .menu-toggle {
        z-index: calc(var(--utensil-drawer-z-index, 0) + 1);
      }
    }
  }

  .menu-scroll {
    display: flex;
    flex-direction: column;
    overflow-x: clip;
    overflow-y: auto;
  }

  .logo {
    margin-inline-start: var(--space-2);
    transition: opacity var(--side-menu-transition) ease;
  }

  .menu-spacer {
    flex-grow: 1;
  }
}
</style>

<!-- Unscoped: the .utensil-side-menu class on the UtensilDrawer root provides natural scoping.
     Sets CSS cvars that children read to adapt their own styling. -->
<style>
@layer utensil {
  .utensil-side-menu {
    /* Fade duration for menu content (logos, titles, labels, badges); children depend on it so
       reduced motion can zero it and content disappears instantly. */
    --side-menu-transition: 0.15s;
  }

  .utensil-reduced-motion .utensil-side-menu {
    --side-menu-transition: 0s;
  }

  .utensil-side-menu .menu-section {
    padding: 0 var(--horizontal-padding);
    margin-block-end: var(--section-margin);
  }

  .utensil-side-menu .menu-section h3 {
    font-size: var(--font-size-1);
    line-height: var(--line-height-1);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--pencil-11);
    margin: var(--space-2) var(--space-2);
  }

  .utensil-side-menu .section-title {
    display: var(--title-display);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--pencil-11);
    margin: var(--space-2) var(--space-2);
    transition: opacity var(--side-menu-transition) ease;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;
  }

  /* Closed state: hide collapsible content */
  .utensil-side-menu.closed {
    --side-menu-content-opacity: 0;
  }

  .utensil-side-menu.closed .logo {
    opacity: 0;
  }

  .utensil-side-menu.closed .section-title {
    opacity: 0;
  }

  /* When collapsed and scrollable, reduce horizontal padding */
  .utensil-side-menu.closed.can-scroll {
    --horizontal-padding: var(--space-2);
  }

  /* Medium viewports: overlay mode */
  @container size-container (max-width: 818px) {
    .utensil-side-menu.responsive {
      --side-menu-content-opacity: 0;
    }

    .utensil-side-menu.responsive .logo {
      opacity: 0;
    }

    .utensil-side-menu.responsive .section-title {
      opacity: 0;
    }

    .utensil-side-menu.closed .logo {
      opacity: 0;
    }

    .utensil-side-menu.closed .section-title {
      opacity: 0;
    }

    .utensil-side-menu:not(.open).can-scroll {
      --horizontal-padding: var(--space-2);
    }
  }

  /* Small viewports: hidden mode */
  @container size-container (max-width: 576px) {
    .utensil-side-menu.responsive {
      --side-menu-content-opacity: 0;
      --side-menu-icon-opacity: 0;
    }

    .utensil-side-menu.responsive .logo {
      opacity: 0;
    }

    .utensil-side-menu.responsive .section-title {
      opacity: 0;
    }

    .utensil-side-menu.closed .logo {
      opacity: 0;
    }

    .utensil-side-menu.closed .section-title {
      opacity: 0;
    }
  }
}
</style>
