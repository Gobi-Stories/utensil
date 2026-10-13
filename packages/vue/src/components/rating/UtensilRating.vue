<template generic="Theme extends ThemeConfig">
  <div
    ref="root"
    class="utensil-rating"
    :class="[...themeClasses, ratingStyle, { disabled, readonly, compact, wrap, wrapped }]"
    :style="[style, layout]"
    :role="readonly ? 'img' : 'radiogroup'"
    :aria-label="readonly ? readonlyLabel : label"
  >
    <div class="utensil-rating-options" @pointerleave="previewed = undefined">
      <component
        :is="readonly ? 'span' : 'label'"
        v-for="option in options"
        :key="option.value"
        class="utensil-rating-option"
        :class="{ filled: option.filled, checked: option.value === model }"
        @pointerenter="preview($event, option.value)"
      >
        <input
          v-if="!readonly"
          type="radio"
          :name="name"
          :value="option.value"
          :checked="option.value === model"
          :disabled="disabled"
          :aria-label="option.label"
          @change="model = option.value"
        />
        <span
          v-if="ratingStyle === 'numbers'"
          class="utensil-rating-mark"
          :class="[option.filled ? 'ui-solid' : 'ui-outline', { interactive: !readonly && !disabled }]"
          aria-hidden="true"
        >
          <span class="utensil-rating-number">{{ option.value }}</span>
        </span>
        <span v-else class="utensil-rating-mark" aria-hidden="true">
          <UtensilIcon :icon="option.icon" />
        </span>
        <span
          v-if="option.part"
          class="utensil-rating-mark utensil-rating-part"
          :class="{ 'ui-solid': ratingStyle === 'numbers' }"
          :style="{ '--utensil-rating-part': option.part }"
          aria-hidden="true"
        >
          <span v-if="ratingStyle === 'numbers'" class="utensil-rating-number">{{ option.value }}</span>
          <UtensilIcon v-else :icon="option.filledIcon" />
        </span>
      </component>
    </div>
    <div v-if="!compact && (minLabel || maxLabel)" class="utensil-rating-labels" aria-hidden="true">
      <span>{{ minLabel }}</span>
      <span>{{ maxLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed, onBeforeUnmount, ref, useId, useTemplateRef, watch } from 'vue'
import type { ColorProp, IconProp, ScaleProp, ThemeConfig } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'
import UtensilIcon from '../icon/UtensilIcon.vue'

/** How each point on the scale is drawn. */
export type RatingStyle = 'numbers' | 'smilies' | 'stars'

export interface Props<Theme extends ThemeConfig> {
  /** Names the rating for assistive technology. */
  label: string
  /** The lowest rating. */
  min?: number
  /** The highest rating. */
  max?: number
  /** How each point is drawn: outline above the rating, filled at or below it. */
  ratingStyle?: RatingStyle
  /** What the lowest rating means, shown under it and read with it. */
  minLabel?: string
  /** What the highest rating means, shown under it and read with it. */
  maxLabel?: string
  color?: ColorProp<Theme>
  scale?: ScaleProp
  disabled?: boolean
  /**
   * Shows the rating without letting it be chosen, read as one image: its value, or the scale when there's none. A
   * rating between two points, such as an average of 3.4, partly fills the point above it.
   */
  readonly?: boolean
  /** Smaller points packed together, without the end labels, which are still read. */
  compact?: boolean
  /**
   * Points that would shrink below --utensil-rating-min-point-size wrap onto further rows instead, the rows as even as
   * the scale allows, so each point stays big enough to choose easily.
   */
  wrap?: boolean
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  min: 1,
  max: 5,
  ratingStyle: 'stars',
  minLabel: undefined,
  maxLabel: undefined,
  color: 'pen',
  scale: undefined,
  disabled: false,
  readonly: false,
  compact: false,
  wrap: false,
})

/** The chosen rating, undefined until one is chosen. Read-only, it may fall between two points. */
const model = defineModel<number | undefined>()

interface RatingIcons {
  filled: IconProp<Theme>
  outline: IconProp<Theme>
}

const STAR: RatingIcons = { filled: 'rating-star', outline: 'rating-star-outline' }

// From the most negative point to the most positive
const SMILIES: RatingIcons[] = [
  { filled: 'rating-very-negative', outline: 'rating-very-negative-outline' },
  { filled: 'rating-negative', outline: 'rating-negative-outline' },
  { filled: 'rating-neutral', outline: 'rating-neutral-outline' },
  { filled: 'rating-positive', outline: 'rating-positive-outline' },
  { filled: 'rating-very-positive', outline: 'rating-very-positive-outline' },
]

const name = useId()

// A smiley by the point's place on the scale, so any length of scale runs from very negative to very positive
function smiley(value: number): RatingIcons {
  const span = props.max - props.min
  const position = span > 0 ? (value - props.min) / span : 0.5
  return SMILIES[Math.round(position * (SMILIES.length - 1))]
}

function optionLabel(value: number): string {
  const meaning = value === props.min ? props.minLabel : value === props.max ? props.maxLabel : undefined
  return meaning ? `${value}, ${meaning}` : String(value)
}

// Read to a tenth, so an average such as 3.4166… reads as 3.4
const readonlyLabel = computed(() =>
  model.value === undefined
    ? `${props.label}: ${optionLabel(props.min)} to ${optionLabel(props.max)}`
    : `${props.label}: ${Math.round(model.value * 10) / 10} of ${props.max}`,
)

// The point a mouse is over, filled up to as it would be once chosen
const previewed = ref<number>()

function preview(event: PointerEvent, value: number) {
  if (event.pointerType !== 'touch' && !props.disabled && !props.readonly) {
    previewed.value = value
  }
}

const options = computed(() =>
  Array.from({ length: Math.max(props.max - props.min + 1, 0) }, (_, index) => {
    const value = props.min + index
    const shown = previewed.value ?? model.value
    const filled = shown !== undefined && value <= shown
    // A rating between two points, such as an average of 3.4, fills the point above it by its fraction
    const part = shown !== undefined && !filled && value - 1 < shown ? shown - (value - 1) : 0
    const icons = props.ratingStyle === 'smilies' ? smiley(value) : STAR
    return {
      value,
      filled,
      part,
      label: optionLabel(value),
      icon: filled ? icons.filled : icons.outline,
      filledIcon: icons.filled,
    }
  }),
)

// Wrapping, the columns that fit the rating's width at the points' smallest, spread evenly over the rows they need
const root = useTemplateRef<HTMLElement>('root')
const columns = ref<number>()

function fitColumns(width: number) {
  const option = root.value?.querySelector('.utensil-rating-option')
  const list = root.value?.querySelector('.utensil-rating-options')
  if (!option || !list) {
    return
  }

  const gap = parseFloat(getComputedStyle(list).columnGap) || 0
  const smallest = parseFloat(getComputedStyle(option).minWidth) || 0
  const count = options.value.length
  const fits = Math.max(1, Math.floor((width + gap) / (smallest + gap)))
  columns.value = Math.ceil(count / Math.ceil(count / fits))
}

let observer: ResizeObserver | undefined

watch(
  [() => props.wrap, root, () => options.value.length],
  ([wrap, element]) => {
    observer?.disconnect()
    observer = undefined
    columns.value = undefined
    if (wrap && element && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(([entry]) => fitColumns(entry.contentRect.width))
      observer.observe(element)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => observer?.disconnect())

const wrapped = computed(() => columns.value !== undefined && columns.value < options.value.length)

const layout = computed(() => ({
  '--utensil-rating-points': options.value.length,
  ...(props.wrap ? { '--utensil-rating-columns': columns.value ?? options.value.length } : {}),
}))

const penColor = computed<ColorProp<Theme>>(() => props.color || 'pen')

const { classes: themeClasses, style } = useTheme({
  pen: penColor,
  relativeScale: () => props.scale,
})
</script>

<style scoped>
@layer utensil {
  /* Each point's full size, which it shrinks from when the rating has less room. An icon is 1.25em wide, as
     UtensilIcon draws every icon. */
  .utensil-rating {
    --utensil-rating-point-size: calc(var(--utensil-rating-icon-size, var(--font-size-6)) * 1.25 + 2 * var(--space-1));
    --utensil-rating-point-gap: max(var(--space-1), var(--utensil-rating-gap, var(--space-1)));

    display: inline-flex;
    flex-direction: column;
    gap: var(--space-1);
    max-width: 100%;
  }

  .utensil-rating.compact {
    --utensil-rating-point-size: calc(var(--utensil-rating-icon-size, var(--font-size-5)) * 1.25 + 2 * var(--space-1));
  }

  .utensil-rating.numbers {
    --utensil-rating-point-size: var(--utensil-rating-number-size, var(--space-7));
  }

  .utensil-rating.numbers.compact {
    --utensil-rating-point-size: var(--utensil-rating-number-size, var(--space-6));
  }

  /* The points take their full size when there's room and shrink together when there isn't, so the rating fits any
     width. A rating stretched wider than its points spreads them, so the first and last sit under the end labels. The
     points are never closer than --space-1, so they stay apart however little room there is. */
  .utensil-rating-options {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, var(--utensil-rating-point-size));
    justify-content: space-between;
    column-gap: var(--utensil-rating-point-gap);
  }

  /* Wrapping, the rating is as wide as its points in one row at full size, or the room it has, whichever is less,
     however many rows they take: so the rows it measures to choose don't change the width it measures */
  .utensil-rating.wrap {
    container-type: inline-size;
    contain-intrinsic-inline-size: calc(
      var(--utensil-rating-points) * var(--utensil-rating-point-size) + (var(--utensil-rating-points) - 1) *
        var(--utensil-rating-point-gap)
    );
  }

  /* Each point takes its share of a row of --utensil-rating-columns, between its smallest and full size. The rows are
     centered on each other, so a shorter last row sits in the middle. */
  .utensil-rating.wrap .utensil-rating-options {
    display: flex;
    flex-wrap: wrap;
    row-gap: var(--space-2);
  }

  .utensil-rating.wrapped .utensil-rating-options {
    justify-content: center;
  }

  /* A shade under the exact share, so rounding never pushes a row's last point onto the next */
  .utensil-rating.wrap .utensil-rating-option {
    width: clamp(
      var(--utensil-rating-min-point-size, var(--space-6)),
      (100cqi - (var(--utensil-rating-columns) - 1) * var(--utensil-rating-point-gap)) / var(--utensil-rating-columns) -
        0.1px,
      var(--utensil-rating-point-size)
    );
    min-width: var(--utensil-rating-min-point-size, var(--space-6));
  }

  .utensil-rating.compact .utensil-rating-options {
    justify-content: start;
  }

  /* Each point measures itself, so what it draws scales down with it */
  .utensil-rating-option {
    position: relative;
    display: flex;
    container-type: inline-size;
    cursor: pointer;
  }

  /* The radio keeps its semantics and keyboard behavior; the mark beside it is what shows */
  .utensil-rating-option input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
    pointer-events: none;
  }

  .utensil-rating-mark {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    min-width: 0;
    border-radius: var(--radius-3);
    line-height: 1;
    outline: 2px solid transparent;
    outline-offset: 2px;
    transition:
      color 0.15s ease,
      transform 0.15s ease,
      outline-color 0.1s ease;
    /* Scales on its own layer, so the icon doesn't shift by a pixel as it grows */
    will-change: transform;
  }

  .utensil-rating:where(.stars, .smilies) .utensil-rating-mark {
    padding: var(--space-1);
    font-size: calc((100cqi - 2 * var(--space-1)) / 1.25);
    color: var(--pencil-a10);
  }

  .utensil-rating:where(.stars, .smilies) .utensil-rating-option.filled .utensil-rating-mark {
    color: var(--pen-indicator);
  }

  .utensil-rating:where(.stars, .smilies):not(.disabled, .readonly) .utensil-rating-option:hover .utensil-rating-mark {
    transform: scale(1.1);
  }

  /* The filled rendition over the point a rating between two points reaches into, cut to the fraction it reaches
     from the scale's start. Stars and smilies are cut across the icon, inside the mark's padding. */
  .utensil-rating-part {
    --utensil-rating-part-inset: calc((1 - var(--utensil-rating-part)) * 100%);

    position: absolute;
    inset: 0;
    clip-path: inset(0 var(--utensil-rating-part-inset) 0 0);
  }

  .utensil-rating:where(.stars, .smilies) .utensil-rating-part {
    --utensil-rating-part-inset: calc(var(--space-1) + (1 - var(--utensil-rating-part)) * (100% - 2 * var(--space-1)));
  }

  .utensil-rating-part:dir(rtl) {
    clip-path: inset(0 0 0 var(--utensil-rating-part-inset));
  }

  .utensil-rating:where(.stars, .smilies) .utensil-rating-mark.utensil-rating-part {
    color: var(--pen-indicator);
  }

  .utensil-rating.numbers .utensil-rating-mark {
    aspect-ratio: 1;
    border-radius: var(--radius-full);
    font-size: min(var(--font-size-2), 50cqi);
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }

  .utensil-rating.numbers.compact .utensil-rating-mark {
    font-size: min(var(--font-size-1), 50cqi);
  }

  /* Trimmed to its digits, cap height to baseline, so they center in the circle rather than sitting high above the
     font's descent */
  .utensil-rating-number {
    display: block;
    text-box: trim-both cap alphabetic;
  }

  .utensil-rating-option input:focus-visible + .utensil-rating-mark {
    outline-color: var(--pen-8);
  }

  /* Clear of a filled circle */
  .utensil-rating.numbers .utensil-rating-mark {
    outline-offset: 3px;
  }

  .utensil-rating.disabled {
    opacity: 0.5;
  }

  .utensil-rating.disabled .utensil-rating-option {
    cursor: not-allowed;
  }

  .utensil-rating.readonly .utensil-rating-option {
    cursor: default;
  }

  .utensil-rating-labels {
    display: flex;
    justify-content: space-between;
    gap: var(--space-3);
    font-size: var(--font-size-1);
    color: var(--pencil-a11);
  }

  .utensil-high-contrast .utensil-rating:where(.stars, .smilies) .utensil-rating-mark {
    color: var(--pencil-12);
  }

  .utensil-high-contrast .utensil-rating:where(.stars, .smilies) .utensil-rating-option.filled .utensil-rating-mark,
  .utensil-high-contrast .utensil-rating:where(.stars, .smilies) .utensil-rating-mark.utensil-rating-part {
    color: var(--pen-11);
  }

  .utensil-reduced-motion .utensil-rating-mark {
    transition: none;
  }

  .utensil-reduced-motion .utensil-rating .utensil-rating-option:hover .utensil-rating-mark {
    transform: none;
  }
}
</style>
