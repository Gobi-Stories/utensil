<template>
  <div
    ref="itemRef"
    class="utensil-navigation-menu-item"
    :class="{ disabled, active: itemIsActive }"
    :data-state="hasContentSlot && itemIsActive ? 'open' : 'closed'"
    data-navigation-menu-item
    :data-value="value"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <template v-if="hasContentSlot">
      <button
        class="utensil-navigation-menu-trigger"
        :class="{ active: itemIsActive, disabled }"
        :data-state="itemIsActive ? 'open' : 'closed'"
        :aria-expanded="itemIsActive"
        :aria-haspopup="true"
        :disabled="disabled"
        :tabindex="disabled ? -1 : 0"
        :data-focusable="!disabled || undefined"
        type="button"
        @click="onTriggerClick"
        @keydown="onTriggerKeydown"
      >
        <slot name="trigger" />
        <svg
          class="trigger-icon"
          :class="{ rotated: itemIsActive }"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden="true"
        >
          <path d="M1 3L5 7L9 3" stroke="currentColor" stroke-width="1.5" fill="none" />
        </svg>
      </button>
      <div
        v-if="itemShouldRender"
        class="utensil-navigation-menu-content"
        :class="{ active: itemIsActive }"
        :data-state="itemIsActive ? 'open' : 'closed'"
        :data-motion="motionDirection"
        @mouseenter="onContentMouseEnter"
      >
        <slot name="content" />
      </div>
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, useSlots, onMounted, onBeforeUnmount, watch } from 'vue'
import { UtensilNavigationMenuContextKey } from './utensil-navigation-menu'

interface Props {
  /** Unique value for this item */
  value: string
  /** Whether this item is disabled */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const slots = useSlots()
const itemRef = ref<HTMLElement>()

const injectedMenuContext = inject(UtensilNavigationMenuContextKey)

if (!injectedMenuContext) {
  throw new Error('UtensilNavigationMenuItem must be used within UtensilNavigationMenu')
}

const menuContext = injectedMenuContext
const hasContentSlot = computed(() => !!slots.content)

const itemIsActive = computed(() => menuContext.isActive(props.value))
const itemShouldRender = computed(() => menuContext.shouldRender(props.value))
const motionDirection = computed(() => menuContext.getMotionDirection(props.value))

function onMouseEnter() {
  if (props.disabled) return
  menuContext.focusItem(props.value, itemRef.value ?? undefined)
}

function onMouseLeave() {
  menuContext.cancelPendingOpen(props.value)
}

function onTriggerClick() {
  if (props.disabled) return
  menuContext.toggle(props.value)
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (props.disabled) return

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    menuContext.toggle(props.value)
  }

  if (event.key === 'ArrowDown' && !itemIsActive.value) {
    event.preventDefault()
    menuContext.open(props.value)
  }
}

function onContentMouseEnter() {
  menuContext.cancelClose()
}

// Register/unregister with parent
onMounted(() => {
  menuContext.registerItem(props.value, hasContentSlot.value)
})

onBeforeUnmount(() => {
  menuContext.unregisterItem(props.value)
})

// Re-register when hasContent changes
watch(hasContentSlot, (hasContent) => {
  menuContext.registerItem(props.value, hasContent)
})

// Watch for disabled changes
watch(
  () => props.disabled,
  (disabled) => {
    if (disabled && itemIsActive.value) {
      menuContext.close(props.value)
    }
  },
)
</script>

<style scoped>
@layer utensil {
  .utensil-navigation-menu-item {
    position: relative;
  }

  .utensil-navigation-menu-item.disabled {
    pointer-events: none;
  }

  /* Trigger styles (absorbed from UtensilNavigationMenuTrigger) */
  .utensil-navigation-menu-trigger {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-2) var(--space-3);
    border: none;
    border-radius: var(--radius-2);
    background: transparent;
    color: var(--pencil-11);
    font-size: var(--font-size-2);
    font-weight: 500;
    line-height: var(--line-height-2);
    cursor: pointer;
    outline: 2px solid transparent;
    outline-offset: -2px;
    transition:
      background-color 0.1s ease,
      color 0.1s ease,
      outline-color 0.1s ease;
  }

  .utensil-navigation-menu-trigger:hover {
    background-color: var(--pencil-a3);
    color: var(--pencil-12);
  }

  .utensil-navigation-menu-trigger:focus-visible {
    outline-color: var(--pen-8);
  }

  .utensil-navigation-menu-trigger.active {
    background-color: var(--pencil-a4);
    color: var(--pencil-12);
  }

  .utensil-navigation-menu-trigger.disabled {
    opacity: 0.5;
    cursor: default;
  }

  .trigger-icon {
    flex-shrink: 0;
    transition: transform 0.15s ease;
  }

  .trigger-icon.rotated {
    transform: rotate(180deg);
  }

  /* Content styles (absorbed from UtensilNavigationMenuContent) */
  .utensil-navigation-menu-content {
    position: absolute;
    left: 0;
    top: 100%;
    margin-top: var(--space-1);
    padding: var(--space-4);
    min-width: 200px;
    background-color: var(--panel-solid);
    border-radius: var(--radius-3);
    box-shadow: var(--shadow-border-4);
    z-index: 10;

    /* Animation */
    opacity: 0;
    transform: translateY(-4px);
    pointer-events: none;
    transition:
      opacity 150ms ease,
      transform 150ms ease;
  }

  .utensil-navigation-menu-content.active {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  /* Directional animations */
  .utensil-navigation-menu-content[data-motion='from-start'] {
    animation: slideFromStart 150ms ease forwards;
  }

  .utensil-navigation-menu-content[data-motion='from-end'] {
    animation: slideFromEnd 150ms ease forwards;
  }

  .utensil-navigation-menu-content[data-motion='to-start'] {
    animation: slideToStart 150ms ease forwards;
  }

  .utensil-navigation-menu-content[data-motion='to-end'] {
    animation: slideToEnd 150ms ease forwards;
  }

  @keyframes slideFromStart {
    from {
      opacity: 0;
      transform: translateY(-4px) translateX(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0) translateX(0);
    }
  }

  @keyframes slideFromEnd {
    from {
      opacity: 0;
      transform: translateY(-4px) translateX(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0) translateX(0);
    }
  }

  @keyframes slideToStart {
    from {
      opacity: 1;
      transform: translateY(0) translateX(0);
    }
    to {
      opacity: 0;
      transform: translateY(-4px) translateX(-8px);
    }
  }

  @keyframes slideToEnd {
    from {
      opacity: 1;
      transform: translateY(0) translateX(0);
    }
    to {
      opacity: 0;
      transform: translateY(-4px) translateX(8px);
    }
  }

  /* Small viewports: full-width triggers */
  @container size-container (max-width: 576px) {
    .utensil-navigation-menu-trigger {
      width: 100%;
      justify-content: space-between;
    }

    /* Small viewports: content flows inline instead of absolute */
    .utensil-navigation-menu-content {
      position: relative;
      left: auto;
      top: auto;
      margin-top: 0;
      min-width: 0;
      width: 100%;
      box-shadow: none;
      border-radius: 0;
      border-top: 1px solid var(--pencil-a5);
      background-color: var(--pencil-a2);
    }
  }
}
</style>
