<template>
  <ReferenceComponentDemo
    title="Child Overrides"
    anchor="child-overrides"
    description="The child overrides pen only. Changing the child pen must not affect the parent; changing the parent pencil must flow through to the child; setting the child back to Inherit must fall back to the parent pen reactively."
  >
    <div class="demo-item">
      <div class="demo-content reactivity-stage">
        <div class="reactivity-controls flex column gap-2">
          <div class="control-row flex align-center gap-3">
            <span class="control-label">Parent pen</span>
            <ReferenceRadioGroup v-model="overrideParentPen" aria-label="Override demo parent pen">
              <ReferenceRadioGroupButton v-for="key in colorKeys" :key="key" :value="key" :label="choiceLabel(key)" />
            </ReferenceRadioGroup>
          </div>
          <div class="control-row flex align-center gap-3">
            <span class="control-label">Parent pencil</span>
            <ReferenceRadioGroup v-model="overrideParentPencil" aria-label="Override demo parent pencil">
              <ReferenceRadioGroupButton v-for="key in colorKeys" :key="key" :value="key" :label="choiceLabel(key)" />
            </ReferenceRadioGroup>
          </div>
          <div class="control-row flex align-center gap-3">
            <span class="control-label">Child pen</span>
            <ReferenceRadioGroup v-model="overrideChildPen" aria-label="Override demo child pen">
              <ReferenceRadioGroupButton v-for="key in colorKeys" :key="key" :value="key" :label="choiceLabel(key)" />
            </ReferenceRadioGroup>
          </div>
        </div>

        <ReferenceTheme :pen="overrideParentPenColor" :pencil="overrideParentPencilColor">
          <ThemeReadout title="Parent">
            <ReferenceTheme :pen="overrideChildPenColor">
              <ThemeReadout title="Child" note="pen overridden — pencil inherited" />
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
import { choiceLabel, colorChoices, colorKeys } from '../theme-reactivity'

const overrideParentPen = ref('blue')
const overrideParentPencil = ref('inherit')
const overrideChildPen = ref('red')
const overrideParentPenColor = computed(() => colorChoices[overrideParentPen.value])
const overrideParentPencilColor = computed(() => colorChoices[overrideParentPencil.value])
const overrideChildPenColor = computed(() => colorChoices[overrideChildPen.value])
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
