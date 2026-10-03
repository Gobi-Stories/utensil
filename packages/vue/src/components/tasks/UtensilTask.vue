<template generic="Theme extends ThemeConfig">
  <div
    class="utensil-task"
    :class="{ interactive: true }"
    role="button"
    tabindex="0"
    @click="handleClick"
    @keydown.enter.prevent="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <div class="task-header">
      <UtensilIcon v-if="icon" class="task-icon" :icon="icon" />
      <div class="task-title">{{ title }}</div>
      <div v-if="state" class="task-state">{{ state }}</div>
    </div>

    <div v-if="$slots.default" class="task-body">
      <slot />
    </div>

    <UtensilProgressBar
      v-if="progress !== undefined"
      class="task-progress"
      :value="progress"
      size="small"
      :color="errored ? 'error' : undefined"
    />
    <div v-if="$slots.actions" class="task-actions" @click.stop>
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import UtensilIcon from '../icon/UtensilIcon.vue'
import UtensilProgressBar from '../progress/UtensilProgressBar.vue'
import type { IconProp, ThemeConfig } from '../../theme/utensil-theme'
import { useUtensilTasksContext } from './utensil-tasks'

export interface Props<Theme extends ThemeConfig> {
  title: string
  icon?: IconProp<Theme>
  state?: string
  progress?: number
  errored?: boolean
  payload?: unknown
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  errored: false,
})

const emit = defineEmits<{
  click: [payload: unknown]
}>()

const context = useUtensilTasksContext()

function handleClick() {
  context.emitClick(props.payload)
  emit('click', props.payload)
}
</script>

<style scoped>
@layer utensil {
  .utensil-task {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-3);
    border-radius: var(--radius-2);
    background-color: transparent;
    cursor: pointer;
    outline: 2px solid transparent;
    outline-offset: -2px;
    transition:
      background-color 0.15s ease,
      outline-color 0.1s ease;
  }

  .utensil-task:hover {
    background-color: var(--pen-a3);
  }

  .utensil-task:focus-visible {
    outline-color: var(--pen-8);
  }

  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-1);
    min-width: 0;
  }

  .task-icon {
    flex-shrink: 0;
    color: var(--pencil-11);
    font-size: var(--font-size-1);
  }

  .task-title {
    flex: 1;
    min-width: 0;
    font-size: var(--font-size-2);
    font-weight: 500;
    color: var(--pencil-12);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .task-state {
    flex-shrink: 0;
    font-size: var(--font-size-1);
    color: var(--pencil-11);
  }

  .task-body {
    font-size: var(--font-size-1);
    color: var(--pencil-11);
  }

  .task-progress {
    width: 100%;
  }

  .task-actions {
    display: flex;
    gap: var(--space-2);
    justify-content: flex-end;
  }
}
</style>
