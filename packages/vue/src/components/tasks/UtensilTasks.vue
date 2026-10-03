<template>
  <UtensilPopoverPanel
    ref="popoverRef"
    class="utensil-tasks"
    :class="[{ visible }, `label-${labelPlacement}`]"
    :placement="placement"
    @update:model-value="emit('update:open', $event)"
  >
    <template #trigger="{ toggle, isOpen }">
      <span v-if="label && labelPlacement === 'block'" class="utensil-tasks-label">{{ label }}</span>
      <button
        type="button"
        class="utensil-tasks-trigger"
        :class="{ open: isOpen, empty: isEmpty }"
        :aria-expanded="isEmpty ? false : isOpen"
        :aria-disabled="isEmpty ? true : undefined"
        :aria-label="triggerAriaLabel"
        @click="!isEmpty && toggle()"
      >
        <span class="trigger-count">{{ count }}</span>
        <UtensilProgressBar
          v-if="count > 0"
          class="trigger-progress"
          :value="progress ?? 0"
          size="small"
          :color="errored ? 'error' : undefined"
        />
        <span v-else class="trigger-spacer" />
        <span v-if="label && labelPlacement === 'inline'" class="trigger-label">{{ label }}</span>
      </button>
    </template>

    <div class="utensil-tasks-list">
      <slot />
    </div>
  </UtensilPopoverPanel>
</template>

<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
import UtensilProgressBar from '../progress/UtensilProgressBar.vue'
import type { PopoverPlacement } from '../popover/utensil-popover'
import { provideUtensilTasksContextKey, type UtensilTasksContext } from './utensil-tasks'

interface Props {
  count: number
  progress?: number
  label?: string
  labelPlacement?: 'inline' | 'block'
  errored?: boolean
  placement?: PopoverPlacement
  alwaysVisible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  labelPlacement: 'inline',
  errored: false,
  placement: 'bottom-end',
  alwaysVisible: false,
})

const emit = defineEmits<{
  click: [payload: unknown]
  'update:open': [open: boolean]
}>()

const popoverRef = ref<InstanceType<typeof UtensilPopoverPanel>>()

const isEmpty = computed(() => !props.count)
const visible = computed(() => props.alwaysVisible || !isEmpty.value)

const triggerAriaLabel = computed(() => {
  const total = props.count
  const noun = total === 1 ? 'task' : 'tasks'
  return `${total} background ${noun}`
})

const context: UtensilTasksContext = {
  emitClick: (payload) => emit('click', payload),
}

provide(provideUtensilTasksContextKey(), context)

watch(isEmpty, (empty) => {
  if (empty) {
    popoverRef.value?.close()
  }
})

defineExpose({
  open: () => popoverRef.value?.open(),
  close: () => popoverRef.value?.close(),
  toggle: () => popoverRef.value?.toggle(),
})
</script>

<style scoped>
@layer utensil {
  .utensil-tasks {
    display: block;
    width: 100%;
    --utensil-popover-padding: 0;
    opacity: 0;
    transition: opacity 0.15s ease;

    &.visible {
      opacity: 1;
    }
  }

  .utensil-tasks.label-block {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    line-height: normal;
  }

  .utensil-tasks-label {
    font-size: var(--font-size-2);
    font-weight: 500;
    color: var(--pencil-11);
  }

  .utensil-tasks-trigger {
    display: flex;
    width: 100%;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border: none;
    border-radius: var(--radius-3);
    background-color: transparent;
    color: var(--pencil-12);
    font: inherit;
    font-size: var(--font-size-1);
    cursor: pointer;
    outline: 2px solid transparent;
    outline-offset: 2px;
    transition:
      background-color 0.15s ease,
      outline-color 0.1s ease;
  }

  .utensil-tasks-trigger:not(.empty):hover {
    background-color: var(--pencil-a3);
  }

  .utensil-tasks-trigger:focus-visible {
    outline-color: var(--pen-8);
  }

  .utensil-tasks-trigger.open {
    background-color: var(--pencil-a3);
  }

  .utensil-tasks-trigger.empty {
    cursor: default;
    color: var(--pencil-11);
  }

  .utensil-tasks-trigger.empty:hover,
  .utensil-tasks-trigger.empty.open {
    background-color: transparent;
  }

  .trigger-count {
    font-weight: 600;
    text-align: center;
  }

  .trigger-progress,
  .trigger-spacer {
    flex-grow: 1;
    min-width: 0;
    width: unset;
  }

  .trigger-label {
    max-width: 40%;
    width: max-content;
    text-align: start;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .utensil-tasks-list {
    display: flex;
    flex-direction: column;
    min-width: 280px;
    max-width: 360px;
    max-height: 360px;
    overflow-y: auto;
    padding: var(--space-1);
    gap: var(--space-1);
  }
}
</style>
