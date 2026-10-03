<template>
  <ReferenceComponentDemo
    title="Scale and Radius"
    anchor="scale-and-radius"
    description="The parent sets absolute scale and radius scale; the child applies a relative scale on top, so the child's effective scale is the product of both."
  >
    <div class="demo-item">
      <div class="demo-content reactivity-stage">
        <div class="reactivity-controls flex column gap-2">
          <div class="control-row flex align-center gap-3">
            <span class="control-label">Parent scale</span>
            <ReferenceRadioGroup v-model="sizeScale" aria-label="Size demo parent scale">
              <ReferenceRadioGroupButton v-for="key in scaleKeys" :key="key" :value="key" :label="choiceLabel(key)" />
            </ReferenceRadioGroup>
          </div>
          <div class="control-row flex align-center gap-3">
            <span class="control-label">Roundness</span>
            <ReferenceRadioGroup v-model="sizeRadius" aria-label="Size demo roundness">
              <ReferenceRadioGroupButton v-for="key in radiusKeys" :key="key" :value="key" :label="choiceLabel(key)" />
            </ReferenceRadioGroup>
          </div>
          <div class="control-row flex align-center gap-3">
            <span class="control-label">Child relative</span>
            <ReferenceRadioGroup v-model="sizeChildScale" aria-label="Size demo child relative scale">
              <ReferenceRadioGroupButton v-for="key in scaleKeys" :key="key" :value="key" :label="choiceLabel(key)" />
            </ReferenceRadioGroup>
          </div>
        </div>

        <ReferenceTheme :scale="sizeScaleValue" :radius-scale="sizeRadiusValue">
          <ThemeReadout title="Parent" note="absolute scale and roundness">
            <ReferenceTheme :relative-scale="sizeChildScaleValue">
              <ThemeReadout title="Child" note="relative scale — compounds with the parent" />
            </ReferenceTheme>
          </ThemeReadout>
        </ReferenceTheme>
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
import { choiceLabel, radiusChoices, radiusKeys, scaleChoices, scaleKeys } from '../theme-reactivity'

const sizeScale = ref('inherit')
const sizeRadius = ref('inherit')
const sizeChildScale = ref('inherit')
const sizeScaleValue = computed(() => scaleChoices[sizeScale.value])
const sizeRadiusValue = computed(() => radiusChoices[sizeRadius.value])
const sizeChildScaleValue = computed(() => scaleChoices[sizeChildScale.value])
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
</style>
