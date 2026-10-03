<template>
  <ReferenceComponentDemo
    title="useTheme Composable"
    anchor="use-theme-composable"
    description="A component passing its own props straight into useTheme() and applying the returned classes to its root — no wrapper theme component. Covers reactive plain-value props and the dynamic per-variant primary prop."
  >
    <div class="demo-item">
      <div class="demo-content reactivity-stage">
        <div class="reactivity-controls flex column gap-2">
          <div class="control-row flex align-center gap-3">
            <span class="control-label">Pen</span>
            <ReferenceRadioGroup v-model="composablePen" aria-label="Composable pen">
              <ReferenceRadioGroupButton v-for="key in colorKeys" :key="key" :value="key" :label="choiceLabel(key)" />
            </ReferenceRadioGroup>
          </div>
          <div class="control-row flex align-center gap-3">
            <span class="control-label">Primary</span>
            <ReferenceRadioGroup v-model="composablePrimary" aria-label="Composable primary variant">
              <ReferenceRadioGroupButton v-for="key in colorKeys" :key="key" :value="key" :label="choiceLabel(key)" />
            </ReferenceRadioGroup>
          </div>
          <div class="control-row flex align-center gap-3">
            <span class="control-label">Scale</span>
            <ReferenceRadioGroup v-model="composableScale" aria-label="Composable relative scale">
              <ReferenceRadioGroupButton v-for="key in scaleKeys" :key="key" :value="key" :label="choiceLabel(key)" />
            </ReferenceRadioGroup>
          </div>
        </div>

        <UseThemeBlock
          :pen="composablePenColor"
          :primary="composablePrimaryColor"
          :relativeScale="composableScaleValue"
        >
          <ThemeReadout title="useTheme() block" note="classes applied to its own root" />
        </UseThemeBlock>
      </div>
    </div>
  </ReferenceComponentDemo>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
import { ReferenceRadioGroup } from '@/theme/components/ReferenceRadioGroup'
import { ReferenceRadioGroupButton } from '@/theme/components/ReferenceRadioGroupButton'
import ThemeReadout from '../components/ThemeReadout.vue'
import UseThemeBlock from '../components/UseThemeBlock.vue'
import { choiceLabel, colorChoices, colorKeys, scaleChoices, scaleKeys } from '../theme-reactivity'

const composablePen = ref('inherit')
const composablePrimary = ref('inherit')
const composableScale = ref('inherit')
const composablePenColor = computed(() => colorChoices[composablePen.value])
const composablePrimaryColor = computed(() => colorChoices[composablePrimary.value])
const composableScaleValue = computed(() => scaleChoices[composableScale.value])
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
