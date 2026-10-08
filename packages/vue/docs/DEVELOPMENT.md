# Building Components with Utensil

The principles and patterns that make a component a good Utensil component: design tokens, theme integration, accessibility, composition and API conventions. They apply wherever the component is built. Where it lives and what it is called follow the conventions of the project it is built in.

## Files and Naming

- The root element carries the kebab-case of the component name (`UtensilButton` → `.utensil-button`, `AcmeAssetCard` → `.acme-asset-card`), so parents can target it for layout
- Each component's directory is named after its feature, in kebab-case (`side-menu/`)

Group related components together (e.g., `side-menu/UtensilSideMenu.vue` and `side-menu/UtensilSideMenuItem.vue`).

Do NOT add to barrel files - components are imported directly for tree-shaking.

Update and compose existing components as needed. Don't wholesale duplicate their code into new components.

### Don't Cross-Import Between Component Directories

A component directory (`<feature>/`) is private to that component. Other components must not reach in to import its helpers, types, or composables — that creates hidden coupling between unrelated features and makes the helper's directory misleading about its real scope.

When two or more components need the same helper, factor it out to a shared location: vanilla TS utilities and their domain types into a library package of their own, Vue composables alongside the project's other composables.

Only the component itself may import from its own directory. If you find yourself reaching into a sibling component's folder, stop and promote the shared piece first.

## Component Structure

### Basic Component

```vue
<template>
  <div class="my-component">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// Props, logic
</script>

<style scoped>
.my-component {
  /* Use design tokens and pen/pencil variables */
}
</style>
```

### With Theme Props

Add the generic parameter when the component accepts theme-typed props (colors, icons, variants):

```vue
<template generic="Theme extends ThemeConfig">
  <div class="utensil-button" :class="[...themeClasses, variation, { disabled }]" :style="style">
    <slot></slot>
  </div>
</template>

<script setup lang="ts" generic="Theme extends ThemeConfig">
import { computed } from 'vue'
import type { ColorProp, ThemeConfig, ScaleProp, UtensilUIVariation } from 'utensil-vue/theme/utensil-theme'
import { useTheme } from 'utensil-vue/theme/useTheme'

export interface Props<Theme extends ThemeConfig> {
  color?: ColorProp<Theme>
  variation?: UtensilUIVariation
  scale?: ScaleProp
  disabled?: boolean
}

const props = withDefaults(defineProps<Props<Theme>>(), {
  variation: 'solid',
  color: 'pen',
  disabled: false,
})

const penColor = computed<ColorProp<Theme>>(() => props.color || 'pen')

const { classes: themeClasses, style } = useTheme({
  pen: penColor,
  relativeScale: () => props.scale,
})
</script>

<style scoped>
.utensil-button {
  /* styles */
}
</style>
```

### Props Interface

Export the props interface, so typed wrappers, docs and declaration builds can name it. For generic components it is generic itself, rather than closing over the component's `Theme` parameter:

```ts
export interface Props<Theme extends ThemeConfig> {
  color?: ColorProp<Theme>
  icon?: IconProp<Theme>
}

const props = withDefaults(defineProps<Props<Theme>>(), { color: 'pen' })
```

Export any local types the props interface references (e.g. `export type CalloutVariation = 'soft' | 'surface' | 'outline'`). Non-generic components export a plain `export interface Props`. Declaration builds (`vue-tsc` emitting `.d.ts`) fail with `TS4025 … private name 'Props'` when this is missed.

## Module Scope

Importing a module must never do work. Module scope holds declarations only: imports and exports, types, functions
and classes, constants of literal values, simple instantiations (`new Map()`, `Symbol()`), and `let` caches that start
empty.

Never at module scope, directly or through a call:

- I/O: `localStorage` and `sessionStorage`, cookies, network, the DOM (`document`, `window`), `matchMedia`, `navigator`
- listeners, timers and observers
- reactive effects (`watch`, `watchEffect`, `effectScope`) and refs initialised from any of the above

Work runs when a function is called. State shared across callers is created by the first call and cached:

```ts
let preferences: UserThemePreferences | undefined

export function useUserThemePreferences(): UserThemePreferences {
  // A detached scope keeps the watchers alive beyond the component that first calls this
  preferences ??= effectScope(true).run(createPreferences)!
  return preferences
}
```

Create shared Vue effects inside a detached `effectScope(true)`. Created lazily without one, they belong to the first
component that calls the function and stop when it unmounts.

Composables and helpers do their work when called, never when imported.

Why: an import that does work runs before its importer can prepare for it (an app migrating stored settings can't
run before a module that reads them on import), runs in every test and SSR context that merely imports it, and can't
be tree-shaken.

## Theme Integration

### useTheme Composable

Use `useTheme` when the component needs to change pen/pencil colors or scale based on props. Returns `classes` and `style` to apply to the root element:

```ts
const { classes: themeClasses, style } = useTheme({
  pen: () => props.color, // Change pen color based on prop
  pencil: () => props.scaffoldColor, // Change pencil color based on prop
  relativeScale: () => props.scale, // Scale relative to parent (preserves UI scale)
  scale: () => props.scale, // Override parent scale (rarely needed)
})
```

If the component just uses the inherited theme without changing it, `useTheme` is not needed - just use the CSS variables directly.

It's usually a mistake if you call `useTheme` without any parameters:

```ts
const { classes: themeClasses, style: themeStyle } = useTheme()
```

This indicates `useTheme` is unnecessary as no theme changes are being applied.

### Theme Prop Types

Use these types when exposing color, icon, or scale props to allow theme-aware configuration:

```ts
import type { ColorProp, IconProp, TextThemeProp, ScaleProp, RadiusScaleProp } from 'utensil-vue/theme/utensil-theme'

interface Props {
  color?: ColorProp<Theme> // 'pen' | 'pencil' | variant name
  icon?: IconProp<Theme> // Icon name from theme's icon map
  scale?: ScaleProp // number | 'tiny' | 'small' | 'normal' | 'large' | 'giant'
  radiusScale?: RadiusScaleProp // number | 'square' | 'sharp' | 'subtle' | 'normal' | 'round' | 'bubble' | 'pill' | 'circle'
}
```

Only add theme props if users are likely to customize that aspect of the component.

Don't introduce custom props that would sufficiently be covered by a theme prop. For example, don't implement a size prop if a scale Theme Prop would achieve the same thing.

Don't overcomplicate how you apply your color props. If you want to provide a color for certain states (`completedColor`) or only certain parts of the element tree, using `<UtensilTheme>` and it's pen prop is usually the simplest solution. Use a computed for default values.

### Icon Prop

If a configurable icon is likely to be used, provide an icon Theme Prop.

```
<template>
  <!-- etc... -->
  <UtensilIcon v-if="icon" :icon="icon" />
</template>

interface Props {
  // ...
  icon?: IconProp<Theme>
}
```

**Prefer an `icon` prop over an icon-only slot.** A typed `IconProp<Theme>` ties the consumer to the theme's icon map, gives autocomplete and type errors for unknown icon names, and keeps the component theme-aware. An icon-only slot pushes those responsibilities (theme typing, icon resolution, sizing/colour conventions) onto every consumer and discourages making the host component theme-generic.

Only use a slot when the consumer needs to render arbitrary content in that position — not just an icon.

Adding an icon prop usually means making the component theme-generic (`generic="Theme extends ThemeConfig"`) and providing typed wrappers in each theme's `components/` (e.g. `AcmeTask`).

### Rounded & Squared

- A simple convention to restrict the effect of `--radius-scale` on a component
- Provide `rounded` and `squared` boolean props
- Use `--radius-rounded` and `--radius-squared` in the component's CSS
- Only appropriate for some components that that may intrinsically need a shape (pills, badges)
- The radius scale still has an effect but is restricted to a smaller range

## Icons

An icon map is defined in the theme. If you need a new icon, add it to the theme's icon map. Do not change icon just because it isn't in the map.

You may create your own icons if there are no appropriate icons in the third party icon library. Implement them in a relevant `theme/icons/` folder or locally in your feature folder and use the svg directly in the default slot of UtensilIcon (or your typed wrapper).

### Custom SVG Requirements

Custom SVGs passed to the UtensilIcon slot must follow these rules for consistent rendering:

- **Set a `viewBox`** — always include a `viewBox` attribute. Omitting it prevents proper scaling.
- **Use `currentColor`** — for filled icons set `fill="currentColor"` on the SVG element. For stroked icons set `fill="none"` and `stroke="currentColor"`. This allows the `color` prop to control the icon color.
- **No `width`/`height` attributes** — the wrapper sizes the SVG to `1em`. Setting explicit dimensions will conflict.
- **Stroked icons** — use `stroke-linecap="round"` and `stroke-linejoin="round"` for consistency with the design system.

## Design Tokens

Use Utensil's scalable design tokens - never hardcode colors or use legacy variables.

Prefer CSS logical properties (`inline`, `block`, `start`, `end`) over physical properties (`left`, `right`, `top`, `bottom`). This applies to padding, margin, border, inset, and related shorthands. Logical properties respect writing direction and flex/grid flow automatically.

```css
/* Preferred */
padding-inline: var(--space-3);
margin-block-end: var(--space-2);
border-inline-start: 2px solid var(--pen-a6);
inset-inline-start: 0;

/* Avoid */
padding-left: var(--space-3);
margin-bottom: var(--space-2);
border-left: 2px solid var(--pen-a6);
left: 0;
```

### Spacing

`--space-1` through `--space-9` for padding, margin, gap.

### Typography

- `--font-size-1` through `--font-size-9`
- `--line-height-1` through `--line-height-9`

Note that font weights for headings and text are provided by the text ui theme. Only override in specific circumstances, such as labels, etc.

### Border Radius

`--radius-1` through `--radius-6`
`--radius-full` for maximum circular radius

### UI Standards

| Property                    | Standard Value             |
| --------------------------- | -------------------------- |
| Border radius (interactive) | `--radius-3`               |
| Border radius (content)     | `--radius-2`               |
| Vertical padding            | `--space-2`                |
| Horizontal padding          | `--space-3` or `--space-4` |
| Font size                   | `--font-size-2`            |
| Inline gap                  | `--space-2`                |
| Stacked form fields         | `--space-5`                |
| Related content gap         | `--space-4`                |
| Section gap                 | `--space-6`                |

## Flex Utilities

`utensil-utilities.css` provides flex layout classes for simple, self-contained layouts. Use scoped CSS instead when requirements are complicated or shared. Responsive adjustments work on top of utilities: the utilities live in the `utensil-utilities` cascade layer, so unlayered scoped CSS in a `@media`/`@container` query overrides them (see USAGE.md → "Cascade Layers").

- `.flex` — `display: flex`. Modifiers: `.column`, `.center`, `.space-between`, `.space-around`, `.space-evenly`, `.justify-center`, `.justify-start`, `.justify-end`, `.align-center`, `.align-start`, `.align-end`, `.stretch`, `.align-baseline`, `.nowrap`
- `.flex.gap-n` — maps to `gap: var(--space-n)` (1–9)
- `.flex-grow`, `.flex-shrink`, `.align-self-start`, `.align-self-center`, `.align-self-end`
- `.padding-n`, `.padding-block-n`, `padding-inline-n` — maps to `--space-n` (1–9)
- `.margin-n`, `.margin-block-n`, `.margin-inline-n` — maps to `--space-n` (1–9)
- `.shadow-1` through `.shadow-6` — elevation shadows via `--shadow-n`
- `.shadow-border-1` through `.shadow-border-6` — border-style shadows via `--shadow-border-n`

Highlight variants (`--highlight-shadow-n`, `--highlight-shadow-border-n`) use the pen color instead of pencil for accent-tinted elevation. See USAGE.md for details.

## Color System

### Instrument Variables

- **Pen** (`--pen-*`): Primary/accent color for emphasis
- **Pencil** (`--pencil-*`): Secondary color for structure/scaffolding
- **Paper** (`--paper-*`): Surface color for backgrounds and depth — a 0–12 depth ladder rising from the page, whose steps also border and detail surfaces at their own hierarchy, and whose alpha steps elevate relative to any background (see USAGE.md → Paper Scale)

### Color Scale (1-12)

Pen and pencil steps map to roles:

| Steps | Purpose               | Example                                              |
| ----- | --------------------- | ---------------------------------------------------- |
| 1-2   | Backgrounds           | `--pen-1` app bg, `--pen-2` subtle bg                |
| 3-5   | Component backgrounds | `--pen-3` default, `--pen-4` hover, `--pen-5` active |
| 6-8   | Borders               | `--pen-6` subtle, `--pen-7` default, `--pen-8` hover |
| 9-10  | Solid backgrounds     | `--pen-9` solid, `--pen-10` hover                    |
| 11-12 | Text                  | `--pen-11` low contrast, `--pen-12` high contrast    |

### Absolute Colors

Use `--black-*` and `--white-*` tokens for components that overlay arbitrary media (images, video) where the background is unknown and pen/pencil tokens cannot guarantee contrast. These are not theme-relative and remain stable regardless of light/dark mode.

### Alpha Values

Use `--pen-a1` through `--pen-a12` for transparency. Prefer alpha values for backgrounds and borders - they blend naturally across modes.

### Semantic Colors

```css
--pen-contrast    /* Text on step 9 solid backgrounds */
--pen-surface     /* Surface variation background */
--pen-indicator   /* Checkboxes, tabs, notification dots */
--pen-track       /* Sliders, progress bars */
```

### Mode Colors

```css
--background          /* Page background */
--overlay             /* Dark overlay background */
--screen              /* Light or dark overlay matching mode background */
--panel-solid         /* Solid panel */
--panel-translucent   /* Translucent panel */
--surface             /* Surface background */
```

Popover elements should typically use `--panel-solid` for their background.

## UI Variations

Type: `UtensilUIVariation = 'solid' | 'outline' | 'surface' | 'soft' | 'text' | 'overlay' | 'unstyled'`

Use UI variations for components that benefit from different visual weights - buttons, badges, avatars, cards, etc. Not all components need variations, and not all variations suit every component.

### Shared CSS Classes

Shared variation classes are defined in `utensil-theme.css` under `.utensil-theme`. Apply them with the `ui-` prefix:

```vue
<div :class="[`ui-${variation}`]"></div>
```

This gives the element the correct background, color, and border for the chosen variation. No component-scoped CSS is needed for the base appearance.

### Modifiers

Combine with modifier classes to adapt behaviour:

| Modifier       | Purpose                                               | Example                                        |
| -------------- | ----------------------------------------------------- | ---------------------------------------------- |
| `.interactive` | Adds hover and active states                          | Buttons, cards, menu items                     |
| `.selected`    | Pressed/checked resting state (one step above active) | Toggle buttons, radio cards                    |
| `.pencil`      | Resting state uses pencil tokens instead of pen       | Cards that switch to pen when highlighted      |
| `.disabled`    | Reduces opacity and disables pointer events           | Any interactive element in a disabled state    |
| `.wireframe`   | Keeps outline backgrounds transparent                 | Radio cards that shouldn't fill on interaction |
| `.thick`       | Uses 2px border width for outline                     | Selected outline radio cards                   |

```vue
<!-- Interactive button with selected state -->
<button :class="[`ui-${variation}`, 'interactive', { selected, disabled }]"></button>

<!-- Card that uses pencil at rest, pen when highlighted -->
<div :class="[`ui-${variation}`, { pencil: !highlighted, interactive }]"></div>
```

The modifiers compose naturally — `.selected.interactive` provides hover states that step down toward deselection, and `.pencil` resting states switch to pen on hover/active.

Components may still need scoped CSS for component-specific overrides (focus ring offsets, transforms, sub-element styling, alternative disabled treatments).

### Variation Reference

| Variation | Background      | Border                                 | Text             | Hover             | Active                         |
| --------- | --------------- | -------------------------------------- | ---------------- | ----------------- | ------------------------------ |
| solid     | `--pen-9`       | none                                   | `--pen-contrast` | `--pen-10`        | `filter: var(--active-filter)` |
| outline   | transparent     | `box-shadow: inset 0 0 0 1px --pen-a8` | `--pen-a11`      | `--pen-a2`        | `--pen-a3` + filter            |
| surface   | `--pen-surface` | `box-shadow: inset 0 0 0 1px --pen-a7` | `--pen-a11`      | border `--pen-a8` | `--pen-a3`, no filter          |
| soft      | `--pen-a3`      | none                                   | `--pen-a11`      | `--pen-a4`        | `--pen-a5` + filter            |
| text      | transparent     | none                                   | `--pen-11`       | `--pen-a3`        | `--pen-a4` + filter            |
| overlay   | `--black-a9`    | none                                   | `--white-a12`    | `--pen-a10`       | `--pen-a10` + filter           |
| unstyled  | not set         | not set                                | not set          | not set           | not set                        |

Use `box-shadow: inset 0 0 0 1px` for borders on interactive components where borders may toggle between states (hover, focus, active) to avoid layout shift.

The `unstyled` variation helps consumers to style the component directly. It may not be applicable where UI Variation styles are applied to nested elements.

To achieve the `unstyled` variation, don't apply border, box-shadow, color, background, or text color styles on the component's base class. Scope them to the variation classes.

If you need to define defaults (often `color` for text), use `:where(.component-name)` to lower specificity.

## Accessibility

Components should implement accessibility by default and aim for WCAG compliance, leveraging ARIA standards.

A `.screen-reader` class is globally available to hide elements from the UI but make them available to screen readers. Parents must have `position: relative`.

Components that make extensive use of the keyboard should provide an `aria-roledescription` and an `aria-describedby` that uses a unique id (`useId()`) to point to an element with the `.screen-reader` class applied that describes the keys in a friendly way:

Use arrow keys to navigate days.
Page Up for previous month, Page Down for next month.

### High Contrast Mode

The theme system supports a high contrast mode. This remaps the pen and pencil 11 color scales to 12.

Therefore, regular UI text should typically use `--pen-a11`, `--pencil-a11`, `--pen-11` and `--pencil-11` for text color so that it updates in high contrast mode. Unless you have a specific reason to use high contrast in either contrast mode.

Components may have other elements that need to change in high contrast mode. The component CSS can target the `.utensil-high-contrast` class to apply these changes:

```css
.utensil-high-contrast {
  .blockquote {
    /* Switch border from --pen-a6 to --pen-a9 in high contrast mode */
    border-left-color: var(--pen-a9);
  }
}
```

You do not need to implement a specific high contrast prop for components, just adapt to the high contrast class.

### Reduced Motion

Reduced motion applies to **motion animations** — transforms, slides, bounces, scaling, and positional movement. Incidental fades (short opacity transitions like image load-in) do not need reduced motion handling, as the sudden pop-in is typically more jarring than a subtle fade.

```css
.utensil-reduced-motion .utensil-panel {
  transition: none;
}
```

If you disable an animation for reduced motion, ensure the visual state is correct (typically the end of the animation).

### Theme Config Selectors

Use the theme config selectors to style components based on the theme configuration.

User accessibility config selectors are expected to be configured once (high contrast, reduce motion):

```css
.utensil-high-contrast .blockquote {
  border-left-color: var(--pen-a9);
}
```

Theme state config selectors may be nested, to apply to the nearest ancestor use unscoped css to define local variables:

```vue
/* UtensilMenu.vue */
<style>
.utensil-squared textarea {
  --utensil-menu-padding: var(--space-2) var(--space-3);
}

.utensil-rounded textarea {
  --utensil-menu-padding: var(--space-3) var(--space-4);
}
</style>

<style scoped>
.utensil-menu {
  padding: var(--utensil-menu-padding);
}
</style>
```

There is `.light-mode`, `.dark-mode`, `.utensil-rounded`, `.utensil-squared`, `.utensil-high-contrast` and `.utensil-reduced-motion`.

light and dark, and rounded and squared may both exist in the parent scope, so you should target both for alternatives.

### Interactive Elements

Non-semantic elements (`<div>`, `<span>`) used as interactive controls must be accessible:

```vue
<div class="utensil-menu-item" role="button" tabindex="0" :aria-pressed="selected" :aria-disabled="disabled"></div>
```

- `role="button"` exposes the element as a button in the accessibility tree
- `tabindex="0"` makes it keyboard focusable
- `aria-pressed` indicates toggle state (for toggle buttons)
- `aria-disabled` indicates disabled state (prefer over removing from tab order)

When possible, use semantic HTML (`<button>`, `<a>`, `<input>`) instead of ARIA roles.

### Focus Ring

```css
.utensil-component {
  outline: 2px solid transparent;
  outline-offset: -2px; /* Or 3px for solid variation */
  transition: outline-color 0.1s ease;
}

.utensil-component:focus-visible {
  outline-color: var(--pen-8);
}

.utensil-component.solid {
  outline-offset: 3px; /* Offset from filled background */
}
```

### Input Focus

Inputs need more prominent focus indication:

```css
.utensil-input:focus {
  box-shadow: inset 0 0 0 2px var(--pen-8);
}
```

### Disabled State

```css
.utensil-component.disabled {
  opacity: 0.5;
  pointer-events: none;
}
```

When the element provides it's own prominent focus style, such as a pen based box-shadow or border, an outline should not be used.

Typically, hovering an interactive element should not disable it's focus style.

## CSS Component Cvars

Use CSS cvars to allow parent components to customize layout or display properties that may need adjustment in different contexts (header heights, margins, visibility of optional elements).

### Defining Cvars

```css
.utensil-side-menu {
  /* Define with fallback to design token */
  --header-height: var(--side-menu-header-height, var(--space-9));
  --section-margin: var(--side-menu-section-margin, var(--space-5));
}

.menu-header {
  height: var(--header-height);
}
```

### Using Cvars from Parent

```css
.parent-component {
  /* Configure child component */
  --side-menu-header-height: var(--space-8);
}
```

### Responsive Cvars

```css
@container (max-height: 674px) {
  --side-menu-title-display: none;
}
```

### Responsive behaviour via CSS Cvars

Components can read CSS Cvars to determine behaviour, allowing consumers to use CSS responsiveness to control component behaviour.

```css
/* Disable maximizer below 960px */
@container size-container (max-width: 960px) {
  .showcase-maximize {
    --utensil-maximizer-disabled: 1;
  }
}
```

```ts
const disabled = getComputedStyle(containerEl.value).getPropertyValue('--utensil-maximizer-disabled')
```

## Composite Components

For composite components (Menu/MenuItem, Tabs/TabItem), place in same directory with consistent naming:

```
side-menu/
  UtensilSideMenu.vue
  UtensilSideMenuItem.vue
```

### Child CSS Cvars

Parents can configure children via cvars:

```css
/* In parent component */
.utensil-side-menu {
  --side-menu-item-tooltip-display: none;
}

/* In child component */
.utensil-side-item {
  --tooltip-display: var(--side-menu-item-tooltip-display, none);
}
```

### Composite Children with Context

1. Define a typed context and injection key for the composite
2. Define a defaults object for the context
3. Parents configure children with a typed `provide` context that combines it's own props with the defaults
4. Child adapters use `inject` to access the context, and combine their props with the context and the defaults
5. Child adapters configure a concrete child via props using the context

This pattern allows:

- Parents to configure children
- Children to be tweaked independantly with props
- Children to be used independantly from the parent
- Multiple adapters to support different concrete child types

For example:

- `UtensilRadioButtons` provides context
- `UtensilRadioButton` injects the context
- `UtensilToggleButton` is configured by `UtensilRadioButton` via props

The order of precedence for configuration should always be:

1. Props
2. Context
3. Defaults

Components should **never** throw an error if the parent context does not exist, they use the defaults instead.

**Boolean props that inherit from context must default to `undefined`.** Vue casts an absent boolean prop to `false`, so `prop ?? context ?? default` short-circuits at `false` and the child silently never inherits from the context. Keep the prop tri-state by giving it an explicit `undefined` default in the destructure — `const { myBool = undefined as boolean | undefined } = defineProps<Props>()` — so an absent prop stays `undefined` and `??` falls through to the context (see `UtensilRadioCard`'s `indicator`). Provide the context value as a reactive ref (`provide(KEY, { myBool: computed(() => myBool) })`).

When the context contains Theme Props (e.g. `IconProp<Theme>`), the context interface and injection key must be generic. Use a lazy singleton function to preserve the shared Symbol reference while carrying the `Theme` type parameter. See Utensil's `components/radio-cards/utensil-radio-cards.ts` for an example.

### Group Components

Group components allow props to be configured once in a group rather than on each child.

Implementation is the same as Composite Components with Context but without functionality.

When implemeting a Group component:

1. Name it after the child with an appropriate suffix, e.g. `UtensilButtonGroup` for `UtensilButton`
2. Name the adapter after the child with an appropriate prefix, e.g `UtensilGroupButton`

For example:

- `UtensilAvatarStack` provides context
- `UtensilStackedAvatar` injects the context
- `UtensilAvatar` is configured by `UtensilStackedAvatar` via props

### Support Custom Composite Children via Slot Scope

**Always provide context properties in a slot scope** so custom child components can participate without injecting context.

Context injection = convenience for built-in children. Slot scope = API for custom children.

### Named Slots Over Nested Components

Composite components should use **named slots** (`#trigger`, `#content`) on the item component rather than requiring consumers to nest separate wrapper components. This reduces the number of components consumers must import and makes items easier to replace with custom implementations.

```vue
<!-- Preferred: named slots on item -->
<UtensilNavigationMenuItem value="products">
  <template #trigger>Products</template>
  <template #content>
    <div class="grid">...</div>
  </template>
</UtensilNavigationMenuItem>

<!-- Avoid: separate wrapper components -->
<UtensilNavigationMenuItem value="products">
  <UtensilNavigationMenuTrigger>Products</UtensilNavigationMenuTrigger>
  <UtensilNavigationMenuContent>...</UtensilNavigationMenuContent>
</UtensilNavigationMenuItem>
```

### Presentational Built-in Children

Centralize logic in the root component; built-in children consume the root's API and are purely presentational. This makes children easy to replace with custom components — a custom child only needs to call the same methods that built-in children use, via slots scope instead of injected context.

```vue
<!-- Root centralizes logic and exposes it via slot scope -->
<UtensilNavigationMenu>
  <template #default="{ toggle, focusItem, cancelPendingOpen }">
    <!-- Built-in child: presentational, delegates to context -->
    <UtensilNavigationMenuItem value="standard">
      <template #trigger>Standard</template>
      <template #content>...</template>
    </UtensilNavigationMenuItem>
    <!-- Custom child: uses the same API via slot scope -->
    <div @mouseenter="focusItem('custom')" @mouseleave="cancelPendingOpen('custom')">
      <button @click="toggle('custom')">Custom</button>
    </div>
  </template>
</UtensilNavigationMenu>
```

### Communicate to Children via CSS

Prefer styling children by targeting their class directly if possible. For slotted children, use an unscoped `<style>` block — the parent class provides natural scoping:

```css
/* Unscoped — scoped CSS won't match slotted children */
<style>
.utensil-avatar-stack > .utensil-avatar {
  margin-left: var(--stack-overlap);
}
</style>
```

When the child needs to use the value in its own styles, define CSS variables in the parent that children read with fallbacks.

Avoid using `:deep()` selectors.

See the `unstyled` UI Variation for a note on stylability.

## Slots & Context

Name API functions after **what they do**, not how they might be invoked. A child component may call them from hover, keyboard, or programmatic triggers — the name should make sense in all contexts (e.g., `focusItem` not `handleItemHover`).

```vue
<!-- Parent exposes functions via slot scope -->
<slot :is-focused="isFocused" :focus="focus" :close="close" />

<!-- Custom child can use slot scope directly -->
<UtensilMenu :active="open" @close="close">
  <template #default="{ isFocused, focus, close }">
    <UtensilMenuItem label="Built-in" />  <!-- uses injected context -->
    <div
      data-focusable
      @mouseenter="focus($el)"
      @click="close()"
    >Custom item</div>  <!-- uses slot scope -->
  </template>
</UtensilMenu>
```

## Responsive Design

- Components must handle their internal responsive design internally.
- Parents will only handle external layout, not internal elements
- A `size-container` is always provided by the parent UI and can be targetted within components:

```css
@container size-container (max-width: 576px) {
  /* etc */
}
```

### Width Behavior

Components whose layout is a single line/row and that could reasonably stretch (toolbars, status indicators, list items, headers) should default to `width: 100%` so the parent layout controls the natural width. Use `flex-grow: 1` on the flexible inner element and add a same-growing spacer when that element is conditionally absent so the layout stays stable.

```vue
<template>
  <button class="my-bar">
    <span class="count">{{ count }}</span>
    <ProgressBar v-if="hasProgress" class="progress" :value="progress" />
    <span v-else class="spacer" />
    <span v-if="label" class="label">{{ label }}</span>
  </button>
</template>

<style scoped>
.my-bar {
  display: flex;
  width: 100%;
  align-items: center;
  gap: var(--space-2);
}

.progress,
.spacer {
  flex-grow: 1;
  min-width: 0;
}
</style>
```

This lets the parent (header bar, sidebar slot, popover content) decide the width via its own layout. Consumers that want a smaller fixed size can wrap the component or set a width — the default doesn't trap them at an arbitrary intrinsic width.

Components whose width is intrinsic to their content (badges, pills, icon buttons, tooltips) should keep their natural inline sizing instead.

## Verification

Run the project's format, lint, typecheck and test commands before finishing. Check styling, colors and layout in the running UI, in light and dark mode, with high contrast and reduced motion.

Demos and examples never use a browser native `alert` or `confirm`: they block execution and complicate testing.

## Popover Composition

When building components with floating/overlay behavior, compose existing primitives:

| Primitive                  | Purpose                           |
| -------------------------- | --------------------------------- |
| `UtensilPopover`           | Anchored to trigger element       |
| `UtensilPopoverPositioned` | Positioned at x,y coordinates     |
| `UtensilMenu`              | Navigable menu (focus on items)   |
| `UtensilListbox`           | Selection list (focus on trigger) |

**Examples:**

- `UtensilDropdownMenu` = `UtensilPopover` + `UtensilMenu`
- `UtensilContextMenu` = `UtensilPopoverPositioned` + `UtensilMenu`
- `UtensilSelectBase` = `UtensilPopover` + `UtensilListbox`

## Model Components

Study these Utensil components (their source ships in `utensil-vue`'s `src/components/`):

- `UtensilButton` - UI variations, theme props, icons, busy/disabled states
- `UtensilInput` - Input styling, surface/soft variations, icon positioning
- `UtensilSideMenu` / `UtensilSideMenuItem` - CSS cvars, responsive behavior, parent-child communication

## Basic Rules

- Prefer putting absolute positioned elements later in the dom than using z-index

## Checklist

- [ ] Root component element has kebab-case class matching component name
- [ ] Scoped styles with root element class
- [ ] Design tokens for all spacing, sizing, colors
- [ ] No hardcoded colors or legacy variables
- [ ] Proper TypeScript types for all props, with an exported `Props` interface (generic over `Theme` when it uses theme props)
- [ ] Implement high contrast and reduced motion using theme state css
- [ ] Unit test in an adjacent `<Name>.test.ts`
- [ ] Create API documentation in an adjacent file with the suffix 'Doc'
- [ ] The project's format, lint, typecheck and test pass

**If interactive:**

- [ ] Focus ring or focus style with `:focus-visible`
- [ ] Disabled state styling
- [ ] Keyboard accessible (`tabindex="0"` for non-semantic elements)
- [ ] ARIA attributes (`role`, `aria-pressed`, `aria-disabled`, etc.)

**If needed:**

- [ ] Generic `Theme extends ThemeConfig` (when using theme prop types)
- [ ] `useTheme` (when component changes pen/pencil/scale based on props)
- [ ] UI variations (when different visual weights are useful)
- [ ] CSS cvars (for layout properties parents may need to adjust)
