<template>
  <a
    ref="linkRef"
    class="utensil-navigation-menu-link"
    :class="{ active, disabled: isDisabled }"
    :href="isDisabled ? undefined : href"
    :data-active="active || undefined"
    :aria-current="active ? 'page' : undefined"
    :aria-disabled="isDisabled || undefined"
    :tabindex="isDisabled ? -1 : 0"
    :data-focusable="!isDisabled || undefined"
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot />
  </a>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { UtensilNavigationMenuContextKey } from './utensil-navigation-menu'

interface Props {
  /** Link URL */
  href?: string
  /** Whether this link represents the current page */
  active?: boolean
  /** Whether this link is disabled */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  href: undefined,
  active: false,
  disabled: false,
})

const emit = defineEmits<{
  select: [event: Event]
}>()

const linkRef = ref<HTMLElement>()

const menuContext = inject(UtensilNavigationMenuContextKey, null)

const isDisabled = computed(() => props.disabled)

function onClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault()
    return
  }

  emit('select', event)

  // Close any open content panel but preserve focus tracking for arrow navigation
  if (menuContext) {
    menuContext.close()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (isDisabled.value) return

  if (event.key === 'Enter' || event.key === ' ') {
    // Let native behavior handle Enter for links
    if (event.key === ' ') {
      event.preventDefault()
      linkRef.value?.click()
    }
  }
}
</script>

<style scoped>
@layer utensil {
  .utensil-navigation-menu-link {
    display: inline-flex;
    align-items: center;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-2);
    color: var(--pencil-11);
    font-size: var(--font-size-2);
    font-weight: 500;
    line-height: var(--line-height-2);
    text-decoration: none;
    cursor: pointer;
    outline: 2px solid transparent;
    outline-offset: -2px;
    transition:
      background-color 0.1s ease,
      color 0.1s ease,
      outline-color 0.1s ease;
  }

  .utensil-navigation-menu-link:hover {
    background-color: var(--pencil-a3);
    color: var(--pencil-12);
  }

  .utensil-navigation-menu-link:focus-visible {
    outline-color: var(--pen-8);
  }

  .utensil-navigation-menu-link.active {
    color: var(--pen-11);
  }

  .utensil-navigation-menu-link.disabled {
    opacity: 0.5;
    cursor: default;
  }

  /* Small viewports: full-width links */
  @container size-container (max-width: 576px) {
    .utensil-navigation-menu-link {
      width: 100%;
    }
  }
}
</style>
