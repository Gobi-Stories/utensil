<template generic="Theme extends ThemeConfig">
  <Transition name="utensil-toast">
    <div
      v-if="show"
      class="utensil-toast"
      :class="[...themeClasses, { colored: !!color, interactive: hasInteraction, dismissible, 'has-action': !!action }]"
      :style="style"
      role="status"
      aria-live="polite"
    >
      <component
        :is="onClick ? 'button' : 'div'"
        class="utensil-toast-content"
        :class="{ activatable: !!onClick }"
        :type="onClick ? 'button' : undefined"
        @click="onClick"
      >
        <UtensilSpinner v-if="busy && progress === undefined" scale="micro" aria-hidden="true" />
        <UtensilIcon v-else-if="icon" :icon="icon" />
        <span class="utensil-toast-message"
          ><slot>{{ message }}</slot></span
        >
      </component>
      <UtensilButton v-if="action" class="utensil-toast-action" variation="text" scale="small" @click="action.onAction">
        {{ action.label }}
      </UtensilButton>
      <button v-if="dismissible" class="utensil-toast-close" aria-label="Close" @click="onDismiss()">
        <UtensilIcon icon="times" />
      </button>
      <UtensilProgressBar
        v-if="progress !== undefined"
        class="utensil-toast-progress"
        :value="progress * 100"
        size="small"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed } from 'vue'
import type { ColorProp, ThemeConfig, ScaleProp, IconProp } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'
import type { ToastAction } from './utensil-toast'
import UtensilSpinner from '../spinner/UtensilSpinner.vue'
import UtensilIcon from '../icon/UtensilIcon.vue'
import UtensilButton from '../button/UtensilButton.vue'
import UtensilProgressBar from '../progress/UtensilProgressBar.vue'

export interface Props<Theme extends ThemeConfig> {
  show?: boolean
  message?: string
  color?: ColorProp<Theme>
  scale?: ScaleProp
  busy?: boolean
  progress?: number
  dismissible?: boolean
  onDismiss?: () => void
  // Renders the body as a button that calls this when activated
  onClick?: () => void
  icon?: IconProp<Theme>
  action?: ToastAction
}

const {
  color,
  scale,
  action,
  dismissible,
  onClick,
  show = false,
  message = '',
  onDismiss = () => {},
} = defineProps<Props<Theme>>()

const penColor = computed<ColorProp<Theme> | undefined>(() => color)

const { classes: themeClasses, style } = useTheme({
  pen: penColor,
  relativeScale: () => scale,
})

const hasInteraction = computed(() => !!action || !!onClick || dismissible)
</script>

<style scoped>
@layer utensil {
  .utensil-toast {
    /* We don't expect much z-fighting with the side menu, but it's good to have a cvar for it */
    --offset: var(--utensil-toast-offset, 0);

    position: fixed;
    width: fit-content;
    display: inline-flex;
    align-items: center;
    inset-block-end: var(--space-5);
    inset-inline: 0;
    overflow: hidden;
    margin-inline: auto;
    background-color: var(--pencil-12);
    padding-block: var(--space-2);
    padding-inline: var(--space-5);
    border-radius: var(--radius-3);
    font-size: var(--font-size-2);
    font-weight: 500;
    line-height: var(--line-height-2);
    white-space: nowrap;
    color: var(--pencil-1);
    translate: 0 calc(var(--offset) * -1px);
    opacity: 1;
    transition:
      opacity 0.15s ease,
      translate 0.15s ease;
    pointer-events: none;

    &.dismissible {
      padding-inline-end: var(--space-2);
    }

    &.has-action {
      padding-block: var(--space-1);
      padding-inline-end: var(--space-2);
    }
  }

  .utensil-toast.interactive {
    pointer-events: auto;
  }

  /* When a color is specified, use solid pen styling */
  .utensil-toast.colored {
    background-color: var(--pen-9);
    color: var(--pen-contrast);
  }

  .utensil-toast-content {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .utensil-toast-message {
    flex: 1;
  }

  /* The activatable body is a button dressed as the plain content */
  .utensil-toast-content.activatable {
    appearance: none;
    margin: 0;
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    color: inherit;
    text-align: start;
    cursor: pointer;
  }

  .utensil-toast-content.activatable:hover .utensil-toast-message,
  .utensil-toast-content.activatable:focus-visible .utensil-toast-message {
    text-decoration: underline;
  }

  .utensil-toast-content.activatable:focus-visible {
    outline: 2px solid var(--pen-8);
    outline-offset: 2px;
    border-radius: var(--radius-2);
  }

  .utensil-toast-action {
    flex-shrink: 0;
    margin-inline-start: var(--space-2);
    color: var(--pen-1);
    font-weight: 700;
  }

  .utensil-toast-close {
    --close-size: 20px;

    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--close-size);
    height: var(--close-size);
    margin-inline-start: var(--space-4);
    border: none;
    border-radius: 50%;
    background-color: var(--white-a6);
    color: currentColor;
    font-size: 10px;
    cursor: pointer;
    transform: translateZ(0);
    transition:
      background-color 0.15s ease,
      transform 0.15s ease;

    &:hover {
      background-color: var(--white-a4);
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.9);
    }

    &:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 1px;
    }
  }

  .utensil-toast:not(.colored) .utensil-toast-close {
    background-color: var(--pencil-a4);

    &:hover {
      background-color: var(--pencil-a5);
    }
  }

  .utensil-toast-progress {
    position: absolute;
    inset-inline: 0;
    inset-block-end: 0;
  }

  /* Transition */
  .utensil-toast-enter-active {
    transition:
      opacity 0.15s ease,
      translate 0.15s ease;
  }

  .utensil-toast-leave-active {
    transition:
      opacity 0.3s ease,
      translate 0.3s ease;
  }

  .utensil-toast-enter-from,
  .utensil-toast-leave-to {
    opacity: 0;
    translate: 0 calc((var(--offset) * -1px) + 8px);
  }
}
</style>
