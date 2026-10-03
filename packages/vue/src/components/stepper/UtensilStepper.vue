<template generic="Theme extends ThemeConfig">
  <div
    class="utensil-stepper"
    :class="[themeClasses, { 'progress-connected': progressBar === 'connected' }]"
    :style="themeStyle"
    role="group"
    :aria-label="ariaLabel"
  >
    <div class="steps">
      <UtensilTheme
        v-for="(label, index) in normalizedSteps"
        :key="index"
        class="step"
        :class="stepClass(index)"
        :pen="isCompleted(index) ? completedPen : undefined"
      >
        <div class="indicator">
          <div class="indicator-circle" :class="indicatorClass(index)">
            <UtensilIcon v-if="isCompleted(index) && completedIcon" :icon="completedIcon" class="indicator-icon" />
            <span v-else class="indicator-number">{{ index + 1 }}</span>
          </div>
          <span v-if="label" class="step-label" :data-label="label">{{ label }}</span>
        </div>
        <div
          v-if="progressBar === 'connected' && index < normalizedSteps.length - 1"
          class="connector"
          :class="[progressSize]"
        ></div>
      </UtensilTheme>
    </div>
    <UtensilProgressBar
      v-if="progressBar === 'underline'"
      :value="progressValue"
      :color="color as ColorProp<ThemeConfig>"
      class="stepper-progress"
      :size="progressSize"
    />
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed } from 'vue'
import type { ColorProp, IconProp, ThemeConfig } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'
import UtensilTheme from '../../theme/UtensilTheme.vue'
import UtensilProgressBar from '../progress/UtensilProgressBar.vue'
import UtensilIcon from '../icon/UtensilIcon.vue'

export type StepperProgressBar = 'connected' | 'underline'
export type StepperVariation = 'solid' | 'outline' | 'surface' | 'soft'

export interface Props<Theme extends ThemeConfig> {
  steps: string[] | number
  activeStep?: number
  progressBar?: StepperProgressBar
  progressSize?: 'small' | 'medium' | 'large'
  variation?: StepperVariation
  color?: ColorProp<Theme>
  completedColor?: ColorProp<Theme>
  completedIcon?: IconProp<Theme>
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  activeStep: 0,
  progressBar: 'connected',
  progressSize: 'small',
  variation: 'solid',
  color: 'pen',
  ariaLabel: 'Progress steps',
})

const normalizedSteps = computed(() =>
  typeof props.steps === 'number' ? Array.from({ length: props.steps }, () => '') : props.steps,
)

const penColor = computed<ColorProp<Theme>>(() => props.color || 'pen')
const completedPen = computed<ColorProp<Theme> | undefined>(() => props.completedColor ?? penColor.value)

const { classes: themeClasses, style: themeStyle } = useTheme({
  pen: penColor,
})

const progressValue = computed(() => {
  if (normalizedSteps.value.length <= 1) return props.activeStep >= 1 ? 100 : 0
  return (props.activeStep / (normalizedSteps.value.length - 1)) * 100
})

function isCompleted(index: number): boolean {
  return index < props.activeStep
}

function isActive(index: number): boolean {
  return index === props.activeStep
}

function stepClass(index: number) {
  return {
    completed: isCompleted(index),
    active: isActive(index),
    upcoming: index > props.activeStep,
  }
}

function indicatorClass(index: number) {
  if (index > props.activeStep) return {}
  return { [`ui-${props.variation}`]: true }
}
</script>

<style scoped>
@layer utensil {
  .utensil-stepper {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    width: 100%;
  }

  .steps {
    display: flex;
    align-items: center;
  }

  .progress-connected .steps {
    justify-content: stretch;
  }

  .utensil-stepper:not(.progress-connected) .steps {
    justify-content: space-between;
  }

  .step {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .step:last-child {
    flex-shrink: 0;
  }

  .progress-connected .step:not(:last-child) {
    flex: 1;
  }

  .indicator {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-shrink: 0;
  }

  .indicator-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(var(--space-5) + var(--space-1));
    aspect-ratio: 1;
    border-radius: var(--radius-full);
    font-size: var(--font-size-1);
    font-weight: 600;
    outline: 3px solid transparent;
    outline-offset: 0;
    transition:
      background-color 0.2s ease,
      color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .upcoming .indicator-circle {
    background-color: var(--pencil-a3);
    color: var(--pencil-a11);
  }

  .active .indicator-circle {
    outline: 3px solid var(--pen-a4);
    outline-offset: 0;
  }

  .indicator-icon {
    font-size: var(--font-size-1);
  }

  .indicator-number {
    line-height: 1;
  }

  .step-label {
    font-size: var(--font-size-2);
    font-weight: 500;
    white-space: nowrap;
    color: var(--pencil-a11);
    transition: color 0.2s ease;
  }

  .step-label::after {
    content: attr(data-label);
    font-weight: 600;
    display: block;
    height: 0;
    overflow: hidden;
    visibility: hidden;
  }

  .active .step-label {
    color: var(--pen-a11);
    font-weight: 600;
  }

  .completed .step-label {
    color: var(--pen-a11);
  }

  .connector {
    flex: 1;
    height: 4px;
    margin-inline: var(--space-2);
    background-color: var(--pencil-a3);
    transition: background-color 0.2s ease;

    &.small {
      height: 2px;
    }

    &.large {
      height: 6px;
    }
  }

  .completed .connector {
    background-color: var(--pen-9);
  }

  .utensil-high-contrast .upcoming .indicator-circle {
    background-color: var(--pencil-a5);
    color: var(--pencil-12);
  }

  .utensil-high-contrast .active .indicator-circle {
    outline-color: var(--pen-a6);
  }

  .utensil-high-contrast .connector {
    background-color: var(--pencil-a5);
  }
}
</style>
