<template>
  <ReferenceComponentDemo
    title="Parent Context"
    anchor="parent-context"
    description="A single theme wrapper with every prop reactive. The nested child declares no overrides, so it must track the parent exactly. With all controls on Inherit, both blocks follow the app root theme — the topbar mode, color, and roundness controls flow all the way in."
  >
    <div class="demo-item">
      <div class="demo-content reactivity-stage">
        <div class="reactivity-controls flex column gap-2">
          <div class="control-row flex align-center gap-3">
            <span class="control-label">Pen</span>
            <ReferenceRadioGroup v-model="parentPen" aria-label="Parent pen">
              <ReferenceRadioGroupButton v-for="key in colorKeys" :key="key" :value="key" :label="choiceLabel(key)" />
            </ReferenceRadioGroup>
          </div>
          <div class="control-row flex align-center gap-3">
            <span class="control-label">Pencil</span>
            <ReferenceRadioGroup v-model="parentPencil" aria-label="Parent pencil">
              <ReferenceRadioGroupButton v-for="key in colorKeys" :key="key" :value="key" :label="choiceLabel(key)" />
            </ReferenceRadioGroup>
          </div>
          <div class="control-row flex align-center gap-3">
            <span class="control-label">Mode</span>
            <ReferenceRadioGroup v-model="parentMode" aria-label="Parent mode">
              <ReferenceRadioGroupButton v-for="key in modeKeys" :key="key" :value="key" :label="choiceLabel(key)" />
            </ReferenceRadioGroup>
          </div>
          <div class="control-row flex align-center gap-3">
            <span class="control-label">Contrast</span>
            <ReferenceRadioGroup v-model="parentContrast" aria-label="Parent contrast">
              <ReferenceRadioGroupButton
                v-for="key in contrastKeys"
                :key="key"
                :value="key"
                :label="choiceLabel(key)"
              />
            </ReferenceRadioGroup>
          </div>
          <div class="control-row flex align-center gap-3">
            <span class="control-label">Scale</span>
            <ReferenceRadioGroup v-model="parentScale" aria-label="Parent scale">
              <ReferenceRadioGroupButton v-for="key in scaleKeys" :key="key" :value="key" :label="choiceLabel(key)" />
            </ReferenceRadioGroup>
          </div>
        </div>

        <ReferenceTheme
          :pen="parentPenColor"
          :pencil="parentPencilColor"
          :mode="parentModeValue"
          :contrast="parentContrastValue"
          :scale="parentScaleValue"
        >
          <ThemeReadout title="Parent" note="all props reactive">
            <ReferenceTheme>
              <ThemeReadout title="Child" note="no overrides — tracks the parent" />
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
import {
  choiceLabel,
  colorChoices,
  colorKeys,
  contrastChoices,
  contrastKeys,
  modeChoices,
  modeKeys,
  scaleChoices,
  scaleKeys,
} from '../theme-reactivity'

const parentPen = ref('inherit')
const parentPencil = ref('inherit')
const parentMode = ref('inherit')
const parentContrast = ref('inherit')
const parentScale = ref('inherit')
const parentPenColor = computed(() => colorChoices[parentPen.value])
const parentPencilColor = computed(() => colorChoices[parentPencil.value])
const parentModeValue = computed(() => modeChoices[parentMode.value])
const parentContrastValue = computed(() => contrastChoices[parentContrast.value])
const parentScaleValue = computed(() => scaleChoices[parentScale.value])
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
