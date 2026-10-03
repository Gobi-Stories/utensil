<template>
  <div class="utensil-null-data">
    <UtensilIcon v-if="icon" class="null-icon" :class="{ colored: !!iconColor }" :icon="icon" :color="iconColor" />
    <div class="null-content">
      <h3 v-if="title" class="null-title" :class="{ 'no-margin': !description && !$slots.default }">{{ title }}</h3>
      <p v-if="description" class="null-description">{{ description }}</p>
      <div v-else-if="$slots.default" class="null-description">
        <slot></slot>
      </div>
      <div v-if="$slots.actions" class="null-actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import type { ColorProp, IconProp, ThemeConfig } from '../../theme/utensil-theme'
import UtensilIcon from '../icon/UtensilIcon.vue'

export interface Props<Theme extends ThemeConfig> {
  title: string
  description?: string
  icon?: IconProp<Theme>
  iconColor?: ColorProp<Theme>
}

defineProps<Props<Theme>>()
</script>

<style scoped>
@layer utensil {
  .utensil-null-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--space-8) var(--space-5);
    min-height: 240px;
    color: var(--pencil-a11);
    line-height: normal;
  }

  .utensil-null-data .null-icon {
    font-size: var(--font-size-10);
    margin-bottom: var(--space-8);

    &:not(.colored) {
      color: var(--pencil-8);
    }
  }

  .utensil-null-data .null-title {
    color: var(--pencil-a11);
    margin-bottom: var(--space-5);
  }

  .utensil-null-data .null-title.no-margin {
    margin-bottom: 0;
  }

  .utensil-null-data .null-description,
  .utensil-null-data .null-description p {
    margin-bottom: var(--space-2);
    font-size: var(--font-size-2);
    text-wrap: balance;
  }

  .utensil-null-data .null-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    margin-top: var(--space-6);
  }

  @container (min-width: 480px) {
    .utensil-null-data .null-actions {
      flex-direction: row;
      justify-content: center;
    }
  }
}
</style>
