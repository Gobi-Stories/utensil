<template>
  <UtensilPopover
    ref="popoverRef"
    class="utensil-popover-panel"
    :model-value="modelValue"
    :placement="placement"
    :offset="offset"
    :width="width"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #trigger="slotProps">
      <slot name="trigger" v-bind="slotProps" />
    </template>
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </UtensilPopover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UtensilPopover from './UtensilPopover.vue'
import type { PopoverPlacement } from './utensil-popover'

interface Props {
  modelValue?: boolean
  placement?: PopoverPlacement
  offset?: number
  width?: 'auto' | 'anchor'
}

withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  placement: 'bottom-start',
  offset: 8,
  width: 'auto',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const popoverRef = ref<InstanceType<typeof UtensilPopover>>()

defineExpose({
  open: () => popoverRef.value?.open(),
  close: () => popoverRef.value?.close(),
  toggle: () => popoverRef.value?.toggle(),
  get isOpen() {
    return popoverRef.value?.isOpen
  },
})
</script>

<style scoped>
@layer utensil {
  /* Configure popover appearance via cvars */
  .utensil-popover-panel {
    --utensil-popover-background: var(--panel-solid);
    --utensil-popover-radius: var(--radius-3);
    --utensil-popover-shadow: var(--shadow-border-3);
    --utensil-popover-padding: var(--space-2);
    --utensil-popover-color: var(--pencil-12);
  }

  /* Reset margins for common content elements */
  .utensil-popover-panel :deep(p) {
    margin: 0 0 var(--space-2);
  }

  .utensil-popover-panel :deep(p:last-child) {
    margin-bottom: 0;
  }
}
</style>
