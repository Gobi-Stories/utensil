<template>
  <div
    v-if="forceMount || isSelected"
    class="utensil-tabs-content"
    :class="{ hidden: !isSelected }"
    role="tabpanel"
    :id="contentId"
    :aria-labelledby="triggerId"
    :data-state="isSelected ? 'active' : 'inactive'"
    :data-orientation="orientation"
    :hidden="!isSelected"
  >
    <slot :selected="isSelected" />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { UtensilTabsContextKey, makeTriggerId, makeContentId } from './utensil-tabs'

interface Props {
  /** Value matching the corresponding trigger */
  value: string
  /** Force mount the content even when inactive (useful for animations) */
  forceMount?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  forceMount: false,
})

const tabsContext = inject(UtensilTabsContextKey)
if (!tabsContext) {
  throw new Error('UtensilTabsContent must be used within UtensilTabs')
}

const { value: currentValue, baseId, orientation } = tabsContext

const isSelected = computed(() => currentValue.value === props.value)
const triggerId = computed(() => makeTriggerId(baseId, props.value))
const contentId = computed(() => makeContentId(baseId, props.value))
</script>

<style scoped>
@layer utensil {
  .utensil-tabs-content {
    position: relative;
    outline: none;
    flex-grow: 1;
  }

  .utensil-tabs-content:focus-visible {
    outline: 2px solid var(--pen-8);
    outline-offset: -2px;
  }

  .utensil-tabs-content.hidden {
    display: none;
  }
}
</style>
