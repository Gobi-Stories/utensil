<template>
  <ReferenceComponentDemo
    title="Variant Remap"
    anchor="variant-remap"
    description="The right block remaps the primary variant through the variants prop. Primary-colored components inside must follow the remap reactively; the block outside must not change."
  >
    <div class="demo-item">
      <div class="demo-content reactivity-stage">
        <div class="reactivity-controls flex column gap-2">
          <div class="control-row flex align-center gap-3">
            <span class="control-label">Primary</span>
            <ReferenceRadioGroup v-model="remapPrimary" aria-label="Primary variant remap">
              <ReferenceRadioGroupButton v-for="key in colorKeys" :key="key" :value="key" :label="choiceLabel(key)" />
            </ReferenceRadioGroup>
          </div>
        </div>

        <div class="side-by-side flex gap-4">
          <ThemeReadout title="Outside" note="theme variants" />
          <ReferenceTheme :variants="remapVariants">
            <ThemeReadout title="Inside" note="primary remapped" />
          </ReferenceTheme>
        </div>
      </div>
    </div>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceTheme } from '@/theme/ReferenceTheme'
import { ReferenceRadioGroup } from '@/theme/components/ReferenceRadioGroup'
import { ReferenceRadioGroupButton } from '@/theme/components/ReferenceRadioGroupButton'
import ThemeReadout from '../components/ThemeReadout.vue'
import { choiceLabel, colorChoices, colorKeys } from '../theme-reactivity'

const remapPrimary = ref('green')
const remapVariants = computed(() => {
  const color = colorChoices[remapPrimary.value]
  return color && { primary: color }
})
</script>

<style scoped>
.demo-content.reactivity-stage {
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}

.reactivity-controls {
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--pencil-a6);
  margin-bottom: var(--space-2);
}

.control-row {
  flex-wrap: wrap;
}

.control-label {
  min-width: 96px;
  font-size: var(--font-size-1);
  font-weight: 500;
  color: var(--pencil-a11);
}

.side-by-side {
  flex-wrap: wrap;
}

.side-by-side > * {
  flex: 1 1 280px;
}
</style>
