<template>
  <ReferenceComponentDemo
    title="Nested Chain"
    anchor="nested-chain"
    description="Three levels, each overriding a different prop: outer mode, middle pen, inner pencil. A change at any level must reach every level below it that doesn't override that prop, and no level above it."
  >
    <div class="demo-item">
      <div class="demo-content reactivity-stage">
        <div class="reactivity-controls flex column gap-2">
          <div class="control-row flex align-center gap-3">
            <span class="control-label">Outer mode</span>
            <ReferenceRadioGroup v-model="chainMode" aria-label="Chain outer mode">
              <ReferenceRadioGroupButton v-for="key in modeKeys" :key="key" :value="key" :label="choiceLabel(key)" />
            </ReferenceRadioGroup>
          </div>
          <div class="control-row flex align-center gap-3">
            <span class="control-label">Middle pen</span>
            <ReferenceRadioGroup v-model="chainPen" aria-label="Chain middle pen">
              <ReferenceRadioGroupButton v-for="key in colorKeys" :key="key" :value="key" :label="choiceLabel(key)" />
            </ReferenceRadioGroup>
          </div>
          <div class="control-row flex align-center gap-3">
            <span class="control-label">Inner pencil</span>
            <ReferenceRadioGroup v-model="chainPencil" aria-label="Chain inner pencil">
              <ReferenceRadioGroupButton v-for="key in colorKeys" :key="key" :value="key" :label="choiceLabel(key)" />
            </ReferenceRadioGroup>
          </div>
        </div>

        <ReferenceTheme :mode="chainModeValue">
          <ThemeReadout title="Outer" note="mode override">
            <ReferenceTheme :pen="chainPenColor">
              <ThemeReadout title="Middle" note="pen override — mode inherited">
                <ReferenceTheme :pencil="chainPencilColor">
                  <ThemeReadout title="Inner" note="pencil override — mode and pen inherited" />
                </ReferenceTheme>
              </ThemeReadout>
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
import { choiceLabel, colorChoices, colorKeys, modeChoices, modeKeys } from '../theme-reactivity'

const chainMode = ref('inherit')
const chainPen = ref('green')
const chainPencil = ref('blue')
const chainModeValue = computed(() => modeChoices[chainMode.value])
const chainPenColor = computed(() => colorChoices[chainPen.value])
const chainPencilColor = computed(() => colorChoices[chainPencil.value])
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
