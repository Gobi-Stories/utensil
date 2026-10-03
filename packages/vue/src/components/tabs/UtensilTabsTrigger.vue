<template>
  <button
    ref="triggerRef"
    class="utensil-tabs-trigger"
    :class="{ active: isSelected }"
    type="button"
    role="tab"
    :id="triggerId"
    :aria-selected="isSelected"
    :aria-controls="contentId"
    :data-state="isSelected ? 'active' : 'inactive'"
    :data-value="value"
    :disabled="disabled"
    :tabindex="isSelected ? 0 : -1"
    @click="onClick"
    @keydown="onKeydown"
  >
    <span class="utensil-tabs-trigger-inner">
      <slot />
    </span>
    <!-- Hidden duplicate for consistent width regardless of font-weight -->
    <span class="utensil-tabs-trigger-inner-hidden" aria-hidden="true">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted, onBeforeUnmount } from 'vue'
import { UtensilTabsContextKey, makeTriggerId, makeContentId } from './utensil-tabs'

interface Props {
  /** Unique value identifying this tab */
  value: string
  /** Whether this tab is disabled */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const tabsContext = inject(UtensilTabsContextKey)
if (!tabsContext) {
  throw new Error('UtensilTabsTrigger must be used within UtensilTabs')
}

const { value: currentValue, setValue, baseId, registerTrigger, unregisterTrigger, activationMode } = tabsContext

const triggerRef = ref<HTMLElement>()

const isSelected = computed(() => currentValue.value === props.value)
const triggerId = computed(() => makeTriggerId(baseId, props.value))
const contentId = computed(() => makeContentId(baseId, props.value))

function onClick() {
  if (!props.disabled) {
    setValue(props.value)
  }
}

function onKeydown(event: KeyboardEvent) {
  // In manual mode, Space and Enter activate the tab
  if (activationMode.value === 'manual' && (event.key === ' ' || event.key === 'Enter')) {
    event.preventDefault()
    if (!props.disabled) {
      setValue(props.value)
    }
  }
}

// Register/unregister with parent
onMounted(() => {
  if (triggerRef.value) {
    registerTrigger(props.value, triggerRef.value)
  }
})

onBeforeUnmount(() => {
  unregisterTrigger(props.value)
})
</script>

<style scoped>
@layer utensil {
  .utensil-tabs-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
    user-select: none;
    box-sizing: border-box;
    height: var(--tab-height);
    padding-left: var(--tab-padding-x);
    padding-right: var(--tab-padding-x);
    background: none;
    border: none;
    font: inherit;
    cursor: pointer;
    color: var(--pencil-a11);
    outline: none;
  }

  .utensil-tabs-trigger:hover:not(:disabled) {
    color: var(--pencil-12);
  }

  .utensil-tabs-trigger:hover:not(:disabled) .utensil-tabs-trigger-inner {
    background-color: var(--pencil-a3);
  }

  .utensil-tabs-trigger:focus-visible .utensil-tabs-trigger-inner {
    outline: 2px solid var(--pen-8);
    outline-offset: -2px;
  }

  .utensil-tabs-trigger:focus-visible:hover .utensil-tabs-trigger-inner {
    background-color: var(--pen-a3);
  }

  .utensil-tabs-trigger.active {
    color: var(--pencil-12);
  }

  /* Active indicator */
  .utensil-tabs-trigger.active::before {
    box-sizing: border-box;
    content: '';
    height: 2px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--pen-indicator);
  }

  /* Vertical orientation */
  .utensil-tabs[data-orientation='vertical'] .utensil-tabs-trigger {
    justify-content: flex-end;
  }

  .utensil-tabs[data-orientation='vertical'] .utensil-tabs-trigger.active::before {
    width: 2px;
    height: auto;
    top: 0;
    bottom: 0;
    left: auto;
    right: 0;
  }

  /* High contrast mode */
  .utensil-high-contrast {
    .utensil-tabs-list .utensil-tabs-trigger.active::before {
      background-color: var(--pen-12);
    }
  }

  .utensil-tabs-trigger:disabled {
    opacity: 0.5;
    cursor: default;
  }

  .utensil-tabs-trigger-inner,
  .utensil-tabs-trigger-inner-hidden {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: var(--tab-inner-padding-y) var(--tab-inner-padding-x);
    border-radius: var(--tab-inner-border-radius);
  }

  .utensil-tabs-trigger-inner {
    position: absolute;
    transition: background-color 0.15s ease;
  }

  /* Inactive state - slightly lighter weight appearance */
  .utensil-tabs-trigger[data-state='inactive'] .utensil-tabs-trigger-inner {
    letter-spacing: var(--tab-inactive-letter-spacing, normal);
  }

  /* Active state - medium weight */
  .utensil-tabs-trigger[data-state='active'] .utensil-tabs-trigger-inner {
    font-weight: var(--font-weight-medium, 500);
    letter-spacing: var(--tab-active-letter-spacing, normal);
  }

  /* Hidden element maintains width for active state font-weight */
  .utensil-tabs-trigger-inner-hidden {
    visibility: hidden;
    font-weight: var(--font-weight-medium, 500);
    letter-spacing: var(--tab-active-letter-spacing, normal);
  }
}
</style>
