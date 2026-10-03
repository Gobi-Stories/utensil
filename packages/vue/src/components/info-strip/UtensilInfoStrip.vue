<template generic="Theme extends ThemeConfig">
  <dl
    class="utensil-info-strip"
    :class="[
      ...themeClasses,
      `ui-${variation}`,
      orientation,
      `align-${align}`,
      `label-${labelPlacement}`,
      { pencil: !color, dividers },
    ]"
    :style="style"
  >
    <slot></slot>
  </dl>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed } from 'vue'
import type { ColorProp, UtensilUIVariation, ScaleProp, ThemeConfig } from '../../theme/utensil-theme'
import { useTheme } from '../../theme/useTheme'

// A non-interactive strip of labelled values (stats). Each child is a UtensilInfoStripItem — a
// prominent value with a small label. Layout that affects the items (alignment, label placement)
// is passed down as inherited CSS custom properties, so custom children participate too.
export type InfoStripVariation = Extract<UtensilUIVariation, 'soft' | 'surface' | 'outline' | 'unstyled'>
export type InfoStripOrientation = 'horizontal' | 'vertical'
export type InfoStripAlign = 'center' | 'start'
export type InfoStripLabelPlacement = 'top' | 'bottom'

export interface Props<Theme extends ThemeConfig> {
  /** Surface treatment of the container box. `unstyled` drops the box (no padding, background or border). */
  variation?: InfoStripVariation
  /** Lay items out in a row (default) or stacked in a column. */
  orientation?: InfoStripOrientation
  /** How each item aligns its value and label. */
  align?: InfoStripAlign
  /** Whether the label sits above the value (default) or below it. */
  labelPlacement?: InfoStripLabelPlacement
  /** Draw a separator between items. */
  dividers?: boolean
  /** Theme colour for the strip; defaults to the neutral pencil palette. */
  color?: ColorProp<Theme>
  /** Relative scale applied to the whole strip. */
  scale?: ScaleProp
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  variation: 'surface',
  orientation: 'horizontal',
  align: 'center',
  labelPlacement: 'top',
  dividers: false,
})

const penColor = computed<ColorProp<Theme>>(() => props.color || 'pen')

const { classes: themeClasses, style } = useTheme({
  pen: penColor,
  relativeScale: () => props.scale,
})
</script>

<style scoped>
@layer utensil {
  .utensil-info-strip {
    /* Coordination cvars read by UtensilInfoStripItem (and custom children). */
    --info-strip-item-align: center;
    --info-strip-label-order: 0;

    display: flex;
    gap: var(--space-2);
    margin: 0;
    text-align: center;
  }

  .utensil-info-strip:not(.ui-unstyled) {
    padding: var(--space-3) var(--space-2);
    border-radius: var(--radius-4);
  }

  .utensil-info-strip.horizontal {
    flex-direction: row;
  }

  /* A vertical strip is a slim bar: segments stacked and centred (each keeping its label above the
     value), sized to its content rather than stretching — a vertically-contained icon strip. */
  .utensil-info-strip.vertical {
    flex-direction: column;
    width: fit-content;
    /* Segments carry their own block padding, so the strip adds none of its own — the space above the
       first segment and below the last then matches the gaps around the dividers. */
    gap: 0;
    padding-block: 0;
  }

  .utensil-info-strip.align-start {
    --info-strip-item-align: flex-start;
    text-align: start;
  }

  .utensil-info-strip.label-bottom {
    --info-strip-label-order: 1;
  }
}
</style>

<style>
@layer utensil {
  /* Slotted-item rules: unscoped so they reach children rendered in the consumer's slot. The
     .utensil-info-strip class keeps them naturally scoped to this component. */
  .utensil-info-strip.horizontal > * {
    flex: 1 1 0;
    min-width: 0;
  }

  .utensil-info-strip.vertical > * {
    width: 100%;
    /* Breathing room around each segment's content, since a content-width strip can't rely on the
       roomy widths that flex:1 gives horizontal segments. */
    padding: var(--space-2) var(--space-4);
  }

  .utensil-info-strip.dividers.horizontal > * + * {
    border-inline-start: 1px solid var(--pencil-a6);
  }

  .utensil-info-strip.dividers.vertical > * + * {
    border-block-start: 1px solid var(--pencil-a6);
  }
}
</style>
