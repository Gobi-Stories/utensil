<template>
  <div
    class="theme-editor"
    :class="[
      ...themeClasses,
      { 'with-labels': showLabels, 'with-menu-button': showMenuButton, 'with-paper-options': showPaperOptions },
    ]"
    :style="themeStyle"
    @contextmenu.prevent="!showMenuButton && onContextMenu($event)"
  >
    <div class="theme-editor-row">
      <div v-if="radiusScale !== undefined" class="color-input-group roundness-group">
        <UtensilRangeSlider
          :model-value="resolvedRadiusScale"
          :steps="radiusSteps"
          show-values-in-label
          :format-value="formatRadiusValue"
          :label="showLabels ? 'Roundness' : undefined"
          label-placement="inline"
          aria-label="Roundness"
          @update:model-value="(v) => emit('update:radiusScale', numberToRoundness(v))"
          rounded
        />
      </div>

      <div class="color-input-group">
        <label v-if="showLabels" :for="`pen-color-picker-${id}`" class="color-input-label">Pen</label>
        <UtensilColorPicker
          :id="`pen-color-picker-${id}`"
          :model-value="pen"
          :show-input="showInputs"
          placeholder="#0093ee"
          @update:model-value="(v) => emit('update:pen', v)"
        />
      </div>

      <div v-if="showSwapButton" class="color-input-group swap-group">
        <label
          v-if="showLabels"
          :for="`swap-button-${id}`"
          :id="`preset-dropdown-label-${id}`"
          class="color-input-label"
          @click="presetDropdown?.toggle()"
        >
          <span>Swap</span>
        </label>
        <UtensilButton
          :id="`swap-button-${id}`"
          icon="swap"
          iconOnly
          :variation="buttonVariation"
          scale="small"
          aria-label="Swap pen and pencil hues"
          class="swap-button utensil-tooltip-bottom"
          @click="swapColors"
        >
          Swap
        </UtensilButton>
      </div>

      <div class="color-input-group">
        <label v-if="showLabels" :for="`pencil-color-picker-${id}`" class="color-input-label">Pencil</label>
        <UtensilColorPicker
          :id="`pencil-color-picker-${id}`"
          :model-value="pencil"
          :show-input="showInputs"
          placeholder="#6b7280"
          @update:model-value="(v) => emit('update:pencil', v)"
        />
      </div>

      <div class="color-input-group">
        <label v-if="showLabels" :for="`paper-color-picker-${id}`" class="color-input-label">Paper</label>
        <UtensilColorPicker
          :id="`paper-color-picker-${id}`"
          :model-value="paper"
          :show-input="showInputs"
          placeholder="#ffffff"
          @update:model-value="(v) => emit('update:paper', v)"
        />
      </div>

      <div v-if="showMenuButton" class="color-input-group">
        <label
          v-if="showLabels"
          :id="`preset-dropdown-label-${id}`"
          class="color-input-label"
          @click="presetDropdown?.toggle()"
        >
          <span>Presets</span>
        </label>
        <UtensilDropdownMenu ref="presetMenu" :aria-labelledby="`preset-dropdown-label-${id}`">
          <template #trigger="{ toggle }">
            <UtensilButton
              :variation="buttonVariation"
              :icon="copied ? 'check' : 'palette'"
              icon-position="end"
              class="colors-button"
              scale="small"
              iconOnly
              @click="toggle"
            >
              {{ copied ? 'Copied' : 'Colors' }}
            </UtensilButton>
          </template>
          <template v-if="presets.length > 0">
            <UtensilMenuItem
              v-for="preset in presets"
              :key="preset.name"
              class="preset-menu-item"
              :label="preset.name"
              @click="applyPreset(preset)"
              :highlighted="presetIsActive(preset)"
            >
              <template #icon>
                <UtensilTheme :radius-scale="preset.radiusScale ?? 'normal'">
                  <div class="preset-container">
                    <div class="preset-swatch" :style="{ backgroundColor: preset.pen }" />
                  </div>
                </UtensilTheme>
              </template>
            </UtensilMenuItem>
            <UtensilMenuItem v-if="!showSwapButton" icon="swap" label="Swap Hues" @click="swapColors" color="pen" />
            <UtensilMenuDivider />
          </template>
          <UtensilMenuItem icon="copy" label="Copy Theme JSON" @click="copyColorsJson" />
          <UtensilMenuItem icon="palette" label="Copy Pen CSS" @click="copyPenCss" />
          <UtensilMenuItem icon="swatchbook" label="Copy Pencil CSS" @click="copyPencilCss" />
          <UtensilMenuItem icon="swatchbook" label="Copy Paper CSS" @click="copyPaperCss" />
          <UtensilMenuItem v-if="primaryColors" icon="copy" label="Copy All Colors CSS" @click="copyAllCss" />
        </UtensilDropdownMenu>
      </div>

      <UtensilDivider class="margin-inline-2" vertical />

      <div v-if="showContrastButton" class="color-input-group">
        <UtensilToggleContrastButton
          :id="`contrast-toggle-button-${id}`"
          :label="showLabels ? 'Contrast' : undefined"
          scale="small"
          :variation="buttonVariation"
        />
      </div>

      <div v-if="showReducedMotionButton" class="color-input-group">
        <UtensilToggleReducedMotionButton
          :id="`reduced-motion-toggle-button-${id}`"
          :label="showLabels ? 'Motion' : undefined"
          scale="small"
          :variation="buttonVariation"
        />
      </div>

      <div v-if="showModeButton" class="color-input-group">
        <UtensilToggleModeButton
          :id="`mode-toggle-button-${id}`"
          :label="showLabels ? 'Mode' : undefined"
          scale="small"
          :variation="buttonVariation"
        />
      </div>
    </div>

    <div v-if="showPaperOptions" class="paper-options-row">
      <div class="color-input-group">
        <span v-if="showLabels" class="color-input-label">Tint</span>
        <div class="mode-buttons">
          <UtensilButton :variation="tintIsManual ? 'solid' : 'outline'" scale="small" @click="setTintMode('slider')">
            Slider
          </UtensilButton>
          <UtensilButton
            :variation="themePaperOptions.tint === 'auto' ? 'solid' : 'outline'"
            scale="small"
            @click="setTintMode('auto')"
          >
            From Color
          </UtensilButton>
          <UtensilButton
            :variation="themePaperOptions.tint === 'direct' ? 'solid' : 'outline'"
            scale="small"
            @click="setTintMode('direct')"
          >
            Direct
          </UtensilButton>
        </div>
      </div>

      <div v-if="tintIsManual" class="color-input-group slider-group">
        <UtensilRangeSlider
          :model-value="paperTint"
          :min="0"
          :max="3"
          :step="0.05"
          show-values-in-label
          :format-value="formatOptionValue"
          label="Strength"
          label-placement="inline"
          aria-label="Paper tint strength"
          @update:model-value="setPaperTint"
          rounded
        />
      </div>

      <div class="color-input-group slider-group">
        <UtensilRangeSlider
          :model-value="themePaperOptions.stepContrast"
          :min="0.5"
          :max="3.5"
          :step="0.05"
          show-values-in-label
          :format-value="formatOptionValue"
          label="Step contrast"
          label-placement="inline"
          aria-label="Tone difference between adjacent paper steps"
          @update:model-value="setStepContrast"
          rounded
        />
      </div>

      <div class="color-input-group slider-group">
        <UtensilRangeSlider
          :model-value="textContrast.light"
          :min="4.5"
          :max="16"
          :step="0.5"
          show-values-in-label
          :format-value="formatTextContrast"
          label="Light text"
          label-placement="inline"
          aria-label="Contrast ratio of light-mode text (step 11) against the page"
          @update:model-value="(v) => setTextContrast('light', v)"
          rounded
        />
      </div>

      <div class="color-input-group slider-group">
        <UtensilRangeSlider
          :model-value="textContrast.dark"
          :min="4.5"
          :max="16"
          :step="0.5"
          show-values-in-label
          :format-value="formatTextContrast"
          label="Dark text"
          label-placement="inline"
          aria-label="Contrast ratio of dark-mode text (step 11) against the page"
          @update:model-value="(v) => setTextContrast('dark', v)"
          rounded
        />
      </div>
    </div>
  </div>

  <UtensilContextMenu v-if="!showMenuButton" v-model="contextMenuOpen" :position="contextMenuPosition">
    <template v-if="presets.length > 0">
      <UtensilMenuItem v-for="preset in presets" :key="preset.name" :label="preset.name" @click="applyPreset(preset)">
        <template #icon>
          <UtensilTheme :radius-scale="preset.radiusScale ?? 'normal'">
            <div class="preset-swatch" :style="{ backgroundColor: preset.pen }" />
          </UtensilTheme>
        </template>
      </UtensilMenuItem>
      <UtensilMenuDivider />
    </template>
    <UtensilMenuItem icon="copy" label="Copy Colors JSON" @click="copyColorsJson" />
    <UtensilMenuItem icon="palette" label="Copy Pen CSS" @click="copyPenCss" />
    <UtensilMenuItem icon="swatchbook" label="Copy Pencil CSS" @click="copyPencilCss" />
    <UtensilMenuItem icon="swatchbook" label="Copy Paper CSS" @click="copyPaperCss" />
    <UtensilMenuItem v-if="primaryColors" icon="copy" label="Copy All Colors CSS" @click="copyAllCss" />
  </UtensilContextMenu>
</template>

<script setup lang="ts">
import { computed, ref, watch, useId, useTemplateRef } from 'vue'
import UtensilColorPicker from '../components/color-picker/UtensilColorPicker.vue'
import UtensilContextMenu from '../components/context-menu/UtensilContextMenu.vue'
import UtensilDropdownMenu from '../components/dropdown-menu/UtensilDropdownMenu.vue'
import UtensilMenuDivider from '../components/menu/UtensilMenuDivider.vue'
import UtensilMenuItem from '../components/menu/UtensilMenuItem.vue'
import UtensilButton from '../components/button/UtensilButton.vue'
import { useTheme } from '../theme/useTheme'
import {
  radiusScaleMap,
  roundnessToNumber,
  numberToRoundness,
  type RadiusScaleProp,
  type ScaleProp,
  type UtensilUIVariation,
} from '../theme/utensil-theme'
import UtensilTheme from '../theme/UtensilTheme.vue'
import UtensilToggleContrastButton from '../components/theme-controls/UtensilToggleContrastButton.vue'
import UtensilToggleReducedMotionButton from '../components/theme-controls/UtensilToggleReducedMotionButton.vue'
import UtensilToggleModeButton from '../components/theme-controls/UtensilToggleModeButton.vue'
import UtensilRangeSlider from '../components/range-slider/UtensilRangeSlider.vue'
import { useCustomTheme, textContrastPair, type CustomThemeScaleNames, type PrimaryColorMap } from './use-custom-theme'
import {
  defaultPaperOptions,
  defaultTextContrast,
  type PaperOptions,
  type TextContrast,
} from 'utensil-css/colors/generate-colors'
import UtensilDivider from '../components/divider/UtensilDivider.vue'

export interface ThemePreset {
  name: string
  pen: string
  pencil: string
  paper?: string
  paperOptions?: PaperOptions
  textContrast?: TextContrast
  radiusScale?: RadiusScaleProp
}

const props = withDefaults(
  defineProps<{
    pen: string
    pencil: string
    paper: string
    buttonVariation?: UtensilUIVariation
    showInputs?: boolean
    showLabels?: boolean
    showSwapButton?: boolean
    showMenuButton?: boolean
    showContrastButton?: boolean
    showReducedMotionButton?: boolean
    showModeButton?: boolean
    showPaperOptions?: boolean
    scale?: ScaleProp
    presets?: ThemePreset[]
    primaryColors?: PrimaryColorMap
    radiusScale?: RadiusScaleProp
    paperOptions?: Required<PaperOptions>
    persist?: boolean
    scaleNames?: CustomThemeScaleNames
  }>(),
  {
    buttonVariation: 'text',
    showInputs: true,
    showLabels: true,
    showSwapButton: false,
    showContrastButton: true,
    showReducedMotionButton: true,
    showMenuButton: true,
    showModeButton: true,
    showPaperOptions: false,
    scale: 1,
    presets: () => [],
    // Explicit default: Vue casts an absent boolean prop to false, which would
    // silently disable useCustomTheme's own persist-by-default
    persist: true,
  },
)

const presetDropdown = useTemplateRef('presetMenu')

const id = useId()
const { classes: themeClasses, style: themeStyle } = useTheme({
  relativeScale: () => props.scale,
})

const emit = defineEmits<{
  'update:pen': [value: string]
  'update:pencil': [value: string]
  'update:paper': [value: string]
  'update:radiusScale': [value: RadiusScaleProp]
  'update:paperOptions': [value: Required<PaperOptions>]
  copied: [label: string]
}>()

const theme = useCustomTheme(props.pen, props.pencil, props.paper, props.radiusScale ?? 1, {
  primaryColors: props.primaryColors,
  persist: props.persist,
  paperOptions: props.paperOptions,
  scaleNames: props.scaleNames,
})

// When storage restored different values, emit them so the parent v-model stays in sync
if (theme.pen.value !== props.pen) emit('update:pen', theme.pen.value)
if (theme.pencil.value !== props.pencil) emit('update:pencil', theme.pencil.value)
if (theme.paper.value !== props.paper) emit('update:paper', theme.paper.value)
if (props.radiusScale !== undefined && theme.radiusScale.value !== props.radiusScale)
  emit('update:radiusScale', theme.radiusScale.value)

// Sync prop changes to the composable
watch(
  () => props.pen,
  (pen) => (theme.pen.value = pen),
)
watch(
  () => props.pencil,
  (pencil) => (theme.pencil.value = pencil),
)
watch(
  () => props.paper,
  (paper) => (theme.paper.value = paper),
)
watch(
  () => props.radiusScale,
  (value) => {
    if (value !== undefined) theme.radiusScale.value = value
  },
)
watch(
  () => props.persist,
  (value) => {
    if (value !== undefined) theme.persist.value = value
  },
)

const themePaperOptions = theme.paperOptions

// The sliders drive one mode each; writes replace the whole pair so the watchers fire
const textContrast = computed(() => textContrastPair(theme.textContrast.value ?? defaultTextContrast))

function setTextContrast(mode: 'light' | 'dark', value: number) {
  theme.textContrast.value = { ...textContrast.value, [mode]: value }
}

// The paper options round-trip through the optional v-model: storage-restored or
// preset-applied values emit outward, and outside changes flow back into the theme.
function samePaperOptions(a: Required<PaperOptions>, b: Required<PaperOptions>): boolean {
  return a.anchor === b.anchor && a.tint === b.tint && a.stepContrast === b.stepContrast
}

if (props.paperOptions && !samePaperOptions(props.paperOptions, themePaperOptions.value)) {
  emit('update:paperOptions', themePaperOptions.value)
}

watch(
  () => props.paperOptions,
  (value) => {
    if (value && !samePaperOptions(value, themePaperOptions.value)) themePaperOptions.value = value
  },
)
watch(themePaperOptions, (value) => {
  if (props.paperOptions && !samePaperOptions(props.paperOptions, value)) {
    emit('update:paperOptions', value)
  }
})

// --- Paper generation knobs (write through the paperOptions round-trip above) ---

const tintIsManual = computed(() => typeof themePaperOptions.value.tint === 'number')
const paperTint = computed(() => (typeof themePaperOptions.value.tint === 'number' ? themePaperOptions.value.tint : 1))

// Remember the slider position across mode switches so returning to Slider restores it
const lastManualTint = ref(1)
watch(
  () => themePaperOptions.value.tint,
  (tint) => {
    if (typeof tint === 'number') lastManualTint.value = tint
  },
  { immediate: true },
)

function setTintMode(mode: 'slider' | 'auto' | 'direct') {
  themePaperOptions.value = { ...themePaperOptions.value, tint: mode === 'slider' ? lastManualTint.value : mode }
}

function setPaperTint(tint: number) {
  themePaperOptions.value = { ...themePaperOptions.value, tint }
}

function setStepContrast(stepContrast: number) {
  themePaperOptions.value = { ...themePaperOptions.value, stepContrast }
}

function formatOptionValue(value: number): string {
  return value.toFixed(2)
}

function formatTextContrast(value: number): string {
  return `${value.toFixed(1)}:1`
}

function presetPaperOptions(preset: ThemePreset): Required<PaperOptions> {
  return { ...defaultPaperOptions, ...preset.paperOptions }
}

function presetIsActive(preset: ThemePreset): boolean {
  const presetOptions = presetPaperOptions(preset)
  return (
    preset.pen === props.pen &&
    preset.pencil === props.pencil &&
    (!preset.paper || preset.paper === props.paper) &&
    samePaperOptions(presetOptions, themePaperOptions.value) &&
    sameTextContrast(preset.textContrast ?? defaultTextContrast, textContrast.value)
  )
}

function sameTextContrast(a: TextContrast, b: TextContrast): boolean {
  const pairA = textContrastPair(a)
  const pairB = textContrastPair(b)
  return pairA.light === pairB.light && pairA.dark === pairB.dark
}

const radiusSteps = Object.values(radiusScaleMap)

const resolvedRadiusScale = computed(() => roundnessToNumber(props.radiusScale ?? 'normal'))

function formatRadiusValue(value: number): string {
  const name = numberToRoundness(value)
  if (typeof name === 'string') return name.charAt(0).toUpperCase() + name.slice(1)
  return String(value)
}

const copied = ref(false)
const contextMenuOpen = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })

function onContextMenu(event: MouseEvent) {
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  contextMenuOpen.value = true
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // Silent fail
  }
}

function copyColorsJson() {
  const json = JSON.stringify({
    name: 'Custom',
    pen: props.pen,
    pencil: props.pencil,
    paper: props.paper,
    paperOptions: themePaperOptions.value,
    textContrast: textContrast.value,
    radiusScale: props.radiusScale,
  })
  copyToClipboard(json)
  emit('copied', 'Colors JSON')
  contextMenuOpen.value = false
}

function swapColors() {
  const { pen, pencil } = theme.swap()
  emit('update:pen', pen)
  emit('update:pencil', pencil)
}

function applyPreset(preset: ThemePreset) {
  emit('update:pen', preset.pen)
  emit('update:pencil', preset.pencil)
  if (preset.paper !== undefined) {
    emit('update:paper', preset.paper)
  }
  themePaperOptions.value = presetPaperOptions(preset)
  theme.textContrast.value = preset.textContrast ?? defaultTextContrast
  if (preset.radiusScale !== undefined) {
    emit('update:radiusScale', preset.radiusScale)
  }
  contextMenuOpen.value = false
}

function copyPenCss() {
  copyToClipboard(theme.penCss.value)
  emit('copied', 'Pen CSS')
  contextMenuOpen.value = false
}

function copyPencilCss() {
  copyToClipboard(theme.pencilCss.value)
  emit('copied', 'Pencil CSS')
  contextMenuOpen.value = false
}

function copyPaperCss() {
  copyToClipboard(theme.paperCss.value)
  emit('copied', 'Paper CSS')
  contextMenuOpen.value = false
}

function copyAllCss() {
  copyToClipboard(theme.allCss.value)
  emit('copied', 'All Colors CSS')
  contextMenuOpen.value = false
}
</script>

<style scoped>
.theme-editor {
  --labels-display: var(--theme-editor-labels-display, block);
  --utensil-range-slider-label-display: var(--labels-display);
  --utensil-toggle-contrast-button-label-display: var(--labels-display);
  --utensil-toggle-reduced-motion-button-label-display: var(--labels-display);
  --utensil-toggle-mode-button-label-display: var(--labels-display);
  --roundness-display: var(--theme-editor-roundness-display, unset);
  --roundness-min-width: var(--theme-editor-roundness-min-width, 100px);

  /* A column of rows so the editor shrink-wraps to its widest row */
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-2);
}

.theme-editor-row,
.paper-options-row {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: var(--space-3);
}

.style-container {
  display: contents;
}

.theme-editor.with-menu-button .theme-editor-row,
.theme-editor.with-menu-button .paper-options-row {
  justify-content: center;
}

.mode-buttons {
  display: flex;
  gap: var(--space-1);
}

.paper-options-row .slider-group {
  --range-slider-control-width: 80px;
}

.color-input-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-2);
}

.color-input-label {
  display: var(--labels-display);
  font-size: var(--font-size-2);
  font-weight: 500;
  color: var(--pencil-11);
  cursor: pointer;
}

.swap-group {
  align-self: center;
}

.roundness-group {
  display: var(--roundness-display);
  --range-slider-control-width: 50px;
  min-width: var(--roundness-min-width);
  margin-right: var(--space-1);
}

.roundness-preview {
  width: var(--space-5);
  height: var(--space-5);
  background-color: var(--pen-9);
  border-radius: var(--radius-3);
  flex-shrink: 0;
}

.preset-menu-item {
  position: relative;
}

.preset-container {
  position: relative;
  display: inline-flex;
  justify-content: center;
  overflow: visible;
  height: 1em;
  width: 1.25em;
  vertical-align: -0.175em;
  line-height: normal;
}

.preset-swatch {
  position: absolute;
  top: calc(-0.625 * 0.5em);
  flex-shrink: 0;
  height: 160%;
  aspect-ratio: 1;
  border-radius: var(--radius-1);
  transform: scale(0.625);
}

@container size-container (max-width: 900px) {
  /* .theme-editor {
    --labels-display: none;
  } */

  /* .roundness-group {
    min-width: auto;
  } */
}
</style>
