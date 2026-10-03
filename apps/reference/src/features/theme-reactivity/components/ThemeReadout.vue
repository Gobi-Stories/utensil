<template>
  <div class="theme-readout">
    <div class="readout-header flex align-center gap-2">
      <span class="readout-title">{{ title }}</span>
      <span v-if="note" class="readout-note">{{ note }}</span>
    </div>
    <div class="readout-samples flex align-center gap-3">
      <span class="swatch pen-solid" title="--pen-9"></span>
      <span class="swatch pen-soft" title="--pen-a4"></span>
      <span class="swatch pencil-solid" title="--pencil-9"></span>
      <span class="swatch pencil-soft" title="--pencil-a4"></span>
      <ReferenceButton scale="small">Pen</ReferenceButton>
      <ReferenceButton scale="small" color="primary">Primary</ReferenceButton>
      <span class="scaled-chip">Scaled chip</span>
    </div>
    <div v-if="$slots.default" class="readout-children">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ReferenceButton } from '@/theme/components/ReferenceButton'

// Renders the theme context resolved at its point in the tree: pen/pencil
// swatches, themed buttons, and a chip sized by the scale/radius tokens.
interface Props {
  title: string
  note?: string
}

defineProps<Props>()
</script>

<style scoped>
.theme-readout {
  padding: var(--space-4);
  border: 1px solid var(--pencil-a7);
  border-radius: var(--radius-3);
  background: var(--surface);
}

.readout-header {
  margin-bottom: var(--space-3);
}

.readout-title {
  font-weight: 600;
  font-size: var(--font-size-2);
  color: var(--pencil-12);
}

.readout-note {
  font-size: var(--font-size-1);
  color: var(--pencil-a11);
}

.readout-samples {
  flex-wrap: wrap;
}

.swatch {
  width: var(--space-5);
  height: var(--space-5);
  border-radius: var(--radius-2);
}

.pen-solid {
  background: var(--pen-9);
}

.pen-soft {
  background: var(--pen-a4);
}

.pencil-solid {
  background: var(--pencil-9);
}

.pencil-soft {
  background: var(--pencil-a4);
}

.scaled-chip {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-3);
  background: var(--pen-a3);
  color: var(--pen-a11);
  font-size: var(--font-size-2);
}

.readout-children {
  margin-top: var(--space-4);
}
</style>
