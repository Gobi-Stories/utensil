<template generic="Theme extends ThemeConfig">
  <FileDropTarget
    class="utensil-file-drop-target"
    :class="{ [sizeMode]: true }"
    @drop="(files) => emit('drop', files)"
    :disabled="disabled"
  >
    <template #default="{ active }">
      <slot :active="active" />
    </template>
    <template #overlay>
      <div class="backdrop" :class="[...themeClasses, { 'rounded-corners': rounded }]" :style="themeStyle"></div>

      <div class="backdrop-content" :class="[...themeClasses]" :style="themeStyle">
        <div class="corner top-left">
          <div class="corner-label horizontal">Upload</div>
          <div class="corner-label vertical">Upload</div>
        </div>

        <div class="corner top-right">
          <div class="corner-label horizontal">Upload</div>
          <div class="corner-label vertical">Upload</div>
        </div>

        <div class="corner bottom-right">
          <div class="corner-label horizontal">Upload</div>
          <div class="corner-label vertical">Upload</div>
        </div>

        <div class="corner bottom-left">
          <div class="corner-label horizontal">Upload</div>
          <div class="corner-label vertical">Upload</div>
        </div>

        <div class="backdrop-dialog">
          <div class="content">
            <UtensilIcon icon="cloud-upload-alt" />
            <h3>Drop files to upload</h3>
            <p>Release to add files to the asset library</p>
          </div>
        </div>
      </div>
    </template>
  </FileDropTarget>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import UtensilIcon from '../icon/UtensilIcon.vue'
import { useTheme } from '../../theme/useTheme'
import FileDropTarget from './FileDropTarget.vue'
import type { ColorProp, ThemeConfig } from '../../theme/utensil-theme.ts'

export interface Props<Theme extends ThemeConfig> {
  disabled?: boolean
  sizeMode?: 'container' | 'viewport'
  rounded?: boolean
  pen?: ColorProp<Theme>
}

const { disabled = false, sizeMode = 'viewport', rounded = false, pen = undefined } = defineProps<Props<Theme>>()

const emit = defineEmits<{
  drop: [files: FileList]
}>()

const { classes: themeClasses, style: themeStyle } = useTheme({
  pen,
})
</script>

<style scoped>
@layer utensil {
  .utensil-file-drop-target {
    --corner-vertical-offset: 36px;
    --corner-horizontal-offset: 40px;
    --text-vertical-offset: -22px;
    --text-horizontal-offset: -24px;
    isolation: isolate;
  }

  .backdrop {
    position: absolute;
    inset: 0;
    background: color-mix(in srgb, var(--pen-9) 88%, transparent);
    backdrop-filter: blur(1px);
  }

  .backdrop.rounded-corners {
    border-radius: var(--radius-5);
    inset: -1px;
  }

  @media (max-width: 656px) {
    .backdrop.rounded-corners {
      border-radius: 0;
    }
  }

  .backdrop-content {
    --corner-border: 1px solid color-mix(in srgb, var(--pen-contrast) 90%, transparent);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    line-height: normal;
  }

  .corner {
    position: absolute;
    width: 15%;
    min-width: 90px;
    max-width: 200px;
    aspect-ratio: 1;
  }

  .corner-label {
    position: absolute;
    margin-inline-end: -4px;
    margin-block-start: 1px;
    color: var(--pen-contrast);
    font-weight: 200;
    font-size: 14px;
    letter-spacing: 4px;
    text-transform: uppercase;
  }

  .corner-label.horizontal {
    writing-mode: horizontal-tb;
  }

  .corner-label.vertical {
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }

  .corner.top-left {
    top: var(--corner-vertical-offset);
    left: var(--corner-horizontal-offset);
    border-top: var(--corner-border);
    border-left: var(--corner-border);
  }

  .corner.top-left .corner-label.horizontal {
    top: var(--text-vertical-offset);
    right: 0;
  }

  .corner.top-left .corner-label.vertical {
    bottom: 0;
    left: var(--text-horizontal-offset);
    transform: scale(-1) translateY(4px);
  }

  .corner.top-right {
    top: var(--corner-vertical-offset);
    right: var(--corner-horizontal-offset);
    border-top: var(--corner-border);
    border-right: var(--corner-border);
  }

  .corner.top-right .corner-label.horizontal {
    top: var(--text-vertical-offset);
    left: 0;
  }

  .corner.top-right .corner-label.vertical {
    bottom: 0;
    right: var(--text-horizontal-offset);
  }

  .corner.bottom-right {
    bottom: var(--corner-vertical-offset);
    right: var(--corner-horizontal-offset);
    border-bottom: var(--corner-border);
    border-right: var(--corner-border);
  }

  .corner.bottom-right .corner-label.horizontal {
    bottom: var(--text-vertical-offset);
    left: 0;
  }

  .corner.bottom-right .corner-label.vertical {
    top: 0;
    right: var(--text-horizontal-offset);
  }

  .corner.bottom-left {
    bottom: var(--corner-vertical-offset);
    left: var(--corner-horizontal-offset);
    border-bottom: var(--corner-border);
    border-left: var(--corner-border);
  }

  .corner.bottom-left .corner-label.horizontal {
    bottom: var(--text-vertical-offset);
    right: 0;
  }

  .corner.bottom-left .corner-label.vertical {
    top: 0;
    left: var(--text-horizontal-offset);
    transform: scale(-1) translateY(4px);
  }

  .backdrop-dialog {
    text-align: center;
    color: var(--pen-contrast);
  }

  .backdrop-dialog .content {
    border: 2px solid color-mix(in srgb, var(--pen-contrast) 80%, transparent);
    border-radius: var(--radius-6);
    padding: var(--space-8) var(--space-9);
    background: color-mix(in srgb, var(--pen-contrast) 10%, transparent);
    backdrop-filter: blur(10px);
  }

  .backdrop-dialog .content .utensil-icon {
    margin-bottom: var(--space-5);
    opacity: 0.9;
    font-size: var(--space-8);
  }

  .backdrop-dialog .content h3 {
    color: var(--pen-contrast);
    margin: 0 0 var(--space-3) 0;
    font-size: var(--font-size-7);
    font-weight: 300;
    text-wrap: nowrap;
  }

  .backdrop-dialog .content p {
    margin: 0;
    color: var(--pen-contrast);
    opacity: 0.9;
    font-size: var(--font-size-3);
    font-weight: 500;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    text-wrap: nowrap;
  }

  @container (max-width: 600px) {
    .utensil-file-drop-target .corner {
      --corner-vertical-offset: 30px;
      --corner-horizontal-offset: 30px;
      width: 80px;
    }

    .utensil-file-drop-target .corner .corner-label {
      font-size: 12px;
    }

    .utensil-file-drop-target .backdrop-dialog .content {
      padding: var(--space-6) var(--space-7);
      margin: 0 var(--font-size-7);
    }

    .utensil-file-drop-target .backdrop-dialog .content .utensil-icon {
      font-size: var(--font-size-8);
      margin-bottom: var(--space-4);
    }

    .utensil-file-drop-target .backdrop-dialog .content h3 {
      font-size: var(--font-size-5);
    }

    .utensil-file-drop-target .backdrop-dialog .content p {
      font-size: 14px;
    }
  }

  @container (max-width: 480px) {
    .utensil-file-drop-target .backdrop-dialog .content {
      padding: var(--space-5) var(--font-size-7);
    }

    .utensil-file-drop-target .backdrop-dialog .content h3 {
      font-size: var(--font-size-4);
    }

    .utensil-file-drop-target .backdrop-dialog .content p {
      font-size: var(--font-size-2);
    }
  }

  @container (max-height: 450px) {
    .utensil-file-drop-target .corner.bottom-left .corner-label {
      display: none;
    }

    .utensil-file-drop-target .corner.bottom-right .corner-label {
      display: none;
    }
  }
}
</style>
