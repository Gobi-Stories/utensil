<template generic="Theme extends ThemeConfig">
  <UtensilBox
    class="utensil-card"
    :class="{ 'media-bleed': mediaBleed, 'footer-divider': footerDivider }"
    :color="color"
    :variation="variation"
    :scale="scale"
    :radiusScale="radiusScale"
    :shadow="shadow"
    :elevation="elevation"
    :highlighted="highlighted"
    :selected="selected"
    :interactive="interactive"
    :clickable="clickable"
    :disabled="disabled"
    :wireframe="wireframe"
    :as="as"
  >
    <div v-if="$slots.media" class="utensil-card-media">
      <slot name="media"></slot>
    </div>

    <div v-if="hasHeader()" class="utensil-card-header">
      <slot name="header">
        <UtensilTheme v-if="icon" class="utensil-card-icon" :pen="iconColor">
          <UtensilIcon :icon="icon" />
        </UtensilTheme>
        <div v-if="title || $slots.title || description" class="utensil-card-heading">
          <component :is="titleElement" v-if="title || $slots.title" class="utensil-card-title">
            <slot name="title">{{ title }}</slot>
          </component>
          <div v-if="description" class="utensil-card-description">{{ description }}</div>
        </div>
      </slot>
      <div v-if="$slots['header-end']" class="utensil-card-header-end">
        <slot name="header-end"></slot>
      </div>
    </div>

    <div v-if="$slots.default" class="utensil-card-content">
      <slot></slot>
    </div>

    <div v-if="$slots.footer || $slots.actions" class="utensil-card-footer">
      <div class="utensil-card-footer-start">
        <slot name="footer"></slot>
      </div>
      <div v-if="$slots.actions" class="utensil-card-actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </UtensilBox>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { useSlots, type Component } from 'vue'
import type {
  ColorProp,
  IconProp,
  RadiusScaleProp,
  ScaleProp,
  ThemeConfig,
  UtensilUIVariation,
} from '../../theme/utensil-theme'
import UtensilTheme from '../../theme/UtensilTheme.vue'
import UtensilIcon from '../icon/UtensilIcon.vue'
import UtensilBox, { type BoxShadow } from '../box/UtensilBox.vue'

/** The title's element: a heading at the level that fits the page's outline, or `div` for no heading. */
export type CardTitleElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'

export interface Props<Theme extends ThemeConfig> {
  /** Heading shown in the header. */
  title?: string
  /** The title's element. */
  titleElement?: CardTitleElement
  /** Supporting text under the title. */
  description?: string
  /** Icon shown at the start of the header. */
  icon?: IconProp<Theme>
  /** Color of the header icon. Defaults to the card's pen. */
  iconColor?: ColorProp<Theme>
  /** Theme color, used when highlighted. */
  color?: ColorProp<Theme>
  variation?: UtensilUIVariation
  scale?: ScaleProp
  radiusScale?: RadiusScaleProp
  /** Edges and elevation from the theme's shadow-border scale. */
  shadow?: BoxShadow
  /** Elevation from the theme's shadow scale, keeping the variation's border. */
  elevation?: BoxShadow
  /** Pen colors instead of the resting pencil colors, and a pen edge on a shadowed card. */
  highlighted?: boolean
  /** The chosen state of a card that toggles. */
  selected?: boolean
  /** Hover and active feedback. */
  interactive?: boolean
  /** A card that acts as a button: a button role, keyboard focus, and Enter or Space to click. */
  clickable?: boolean
  /** Muted, and blocks clicks. */
  disabled?: boolean
  /** Keep outline backgrounds transparent on interaction. */
  wireframe?: boolean
  /** The element or component to render: `button` or a link component for an interactive card. */
  as?: string | Component
  /** Media that reaches the card's top and side edges, for image-led cards, instead of sitting inside its padding. */
  mediaBleed?: boolean
  /** A divider between the content and the footer. */
  footerDivider?: boolean
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  titleElement: 'div',
  variation: 'surface',
  shadow: undefined,
  elevation: undefined,
  selected: undefined,
  as: 'div',
})

const slots = useSlots()

// Called while rendering: slots aren't reactive, so a computed would miss slots added later
function hasHeader() {
  return !!(slots.header || slots['header-end'] || slots.title || props.title || props.description || props.icon)
}
</script>

<style scoped>
@layer utensil {
  /* Compound with the box's class, so it out-specifies the box's padding and radius; a cvar would leak into nested
     boxes. Content is rounder than its contents and less round than controls (--radius-3). */
  .utensil-card.utensil-box {
    padding: var(--utensil-card-padding, var(--space-5));
    border-radius: var(--utensil-card-radius, var(--radius-2));
  }

  .utensil-card {
    display: flex;
    flex-direction: column;
    gap: var(--utensil-card-gap, var(--space-4));
    min-width: 0;
  }

  .utensil-card-media {
    overflow: hidden;
    border-radius: var(--radius-1);
  }

  /* Bleeds through the card's padding to its top and side edges, rounded with the card's top corners */
  .utensil-card.media-bleed > .utensil-card-media {
    margin-block-start: calc(-1 * var(--utensil-card-padding, var(--space-5)));
    margin-inline: calc(-1 * var(--utensil-card-padding, var(--space-5)));
    border-radius: 0;
    border-start-start-radius: inherit;
    border-start-end-radius: inherit;
  }

  /* header-end wraps below the heading when the heading would get narrower than its minimum */
  .utensil-card-header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .utensil-card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--utensil-card-icon-size, var(--space-7));
    height: var(--utensil-card-icon-size, var(--space-7));
    border-radius: var(--radius-1);
    background: var(--pen-a4);
    color: var(--pen-a11);
    font-size: var(--font-size-3);
  }

  .utensil-card-heading {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    flex: 1 1 var(--utensil-card-heading-min-width, 16rem);
    min-width: 0;
  }

  .utensil-card-title {
    margin: 0;
    font-size: var(--utensil-card-title-size, var(--font-size-3));
    font-weight: var(--utensil-card-title-weight, 600);
    color: var(--pencil-12);
  }

  .utensil-card-description {
    font-size: var(--utensil-card-description-size, var(--font-size-2));
    line-height: var(--line-height-2);
    color: var(--pencil-a11);
  }

  /* On a solid or overlay fill, the header takes the variation's text color */
  .utensil-card:where(.ui-solid, .ui-overlay) :where(.utensil-card-title, .utensil-card-description) {
    color: inherit;
  }

  .utensil-card-header-end {
    flex-shrink: 0;
    margin-inline-start: auto;
  }

  .utensil-card-content {
    min-width: 0;
  }

  /* Pinned to the bottom when the card is stretched, e.g. in a grid of cards */
  .utensil-card-footer {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-block-start: auto;
  }

  .utensil-card.footer-divider > .utensil-card-footer {
    padding-block-start: var(--utensil-card-gap, var(--space-4));
    border-block-start: 1px solid var(--pencil-a6);
  }

  .utensil-card:where(.ui-solid, .ui-overlay).footer-divider > .utensil-card-footer {
    border-block-start-color: color-mix(in oklab, currentColor 30%, transparent);
  }

  /* Controls in the header and footer stay above a stretched link */
  .utensil-card-header-end,
  .utensil-card-actions {
    position: relative;
  }

  .utensil-card-footer-start {
    flex-grow: 1;
    min-width: 0;
  }

  .utensil-card-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-shrink: 0;
  }
}
</style>

<!-- Unscoped: slotted media and links aren't reached by scoped styles; .utensil-card scopes them -->
<style>
@layer utensil {
  .utensil-card-media > :where(img, video, picture) {
    display: block;
    width: 100%;
  }

  /* A stretched link: .utensil-card-link on a link in the card makes the whole card follow it */
  .utensil-card:has(.utensil-card-link) {
    position: relative;
  }

  .utensil-card .utensil-card-link {
    color: inherit;
    text-decoration: none;
    outline: none;
  }

  .utensil-card .utensil-card-link::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }

  /* The card shows the link's focus ring around itself */
  .utensil-card.utensil-box:has(.utensil-card-link:focus-visible) {
    outline: 2px solid var(--pen-8);
    outline-offset: -2px;
  }

  .utensil-card.utensil-box.ui-solid:has(.utensil-card-link:focus-visible) {
    outline-offset: 3px;
  }

  /* A disabled card doesn't follow its link */
  .utensil-card.disabled .utensil-card-link::after {
    content: none;
  }

  /* Controls in the content and footer stay above the link, positioned after it */
  .utensil-card:has(.utensil-card-link)
    :where(.utensil-card-content, .utensil-card-footer-start)
    :where(a, button, input, select, textarea, label, [tabindex]) {
    position: relative;
  }
}
</style>
