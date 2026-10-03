# Utensil Design System - Usage Guide

This guide covers how to use Utensil's color system, design tokens, components, and theming in your application.

## Importing Components

Import components directly from their file path. There are no barrel files for components — this ensures tree-shaking works correctly.

```ts
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'
import UtensilInput from 'utensil-vue/components/input/UtensilInput.vue'
import UtensilIcon from 'utensil-vue/components/icon/UtensilIcon.vue'
```

### Typed Components

Utensil components that accept theme props (colors, icons, variants) are generic. To avoid specifying your theme type on every usage, create typed wrappers:

```ts
// my-theme/components/MyButton.ts
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'
import type { MyThemeConfig } from '../my-theme'

export const MyButton = UtensilButton<MyThemeConfig>
```

You can then use `<MyButton color="primary" icon="save" />` with full autocomplete for your theme's colors, variants, and icons.

Without typed wrappers, you must annotate each usage:

```vue
<!-- @vue-generic {import('./my-theme').MyThemeConfig} -->
<UtensilButton color="primary" icon="save" />
```

### Styling Components

Every component's root element carries the kebab-case of the component name (`UtensilButton` → `.utensil-button`), so you can target it for layout and positioning.

When using typed wrappers and targetting components for style such as layout or positioning, you still target the base component class:

```css
/* my-theme/components/MyButton.css */
.utensil-button {
  /* Your styles */
}
```

This does not apply for your own custom components that aren't typed utensil components:

```css
/* acme/components/AcmeButton.css */
.acme-button {
  /* Your styles */
}
```

## Building Components Beyond Utensil

Utensil covers general-purpose primitives. When your project needs a component Utensil doesn't provide, build it in a local component library following Utensil's principles — so it fits naturally alongside Utensil components and can be upstreamed later if it matures into a reusable primitive.

### Convention

Place project-owned components at `src/lib/components/<feature>/<ComponentName>.vue`:

- No `Utensil` prefix — these are project-owned (use your own prefix if the project has one, e.g., `Acme`)
- Group related components in a feature directory
- Do not add to barrel files — import directly for tree-shaking
- Do not modify files under `node_modules/utensil-vue/` — the design system is installed from the `utensil-vue` package

If your project uses a different path convention, document it in your project's CLAUDE.md and the skills below will honour it.

### Skills

`utensil-vue` ships agent skills in its `skills/` folder. Once installed with skills-npm (see the `utensil-vue` README → "AI Harness"), these are available in your project:

| Skill                                               | Purpose                                                                                            |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `/utensil-usage`                                    | Background knowledge of Utensil's usage guide; loads automatically when you work on Utensil UI     |
| `/utensil-find-components <requirements>`           | Match design requirements to existing Utensil components                                           |
| `/utensil-implement-component <Name> <description>` | Create a new component in `src/lib/components/` following Utensil principles (tokens, a11y, theme) |
| `/utensil-document-component-api <Name>`            | Generate or update an adjacent `<Name>Doc.vue` API documentation file                              |
| `/utensil-audit-component <Name> [--fix]`           | Audit a component against Utensil patterns and standards; optionally fix recommendations           |
| `/utensil-setup-theme <ThemeName>`                  | Create your app's theme: colors, variants, icons, theme root, and typed wrappers (see SETUP.md)    |

`/utensil-implement-component` reads Utensil's DEVELOPMENT.md up-front so components land production-grade on the first pass. `/utensil-audit-component` uses the same checklist that Utensil's own components are audited against.

The skills are version-matched to the installed package: upgrading `utensil-vue` upgrades them.

## Pure CSS Usage

Utensil's CSS framework works without Vue or any framework, and ships on its own as the `utensil-css` package. Load its all-in-one stylesheet, which leads with the layer order — from a bundler:

```ts
import 'utensil-css/utensil.css' // or 'utensil-vue/utensil.css' in a Vue project
```

or with a `<link>` to the package file (`utensil.min.css` is the minified copy):

```html
<link rel="stylesheet" href="/node_modules/utensil-css/dist/utensil.css" />
```

It includes the gray color scale. Generate any other colors with `npx utensil-generate-color` (see SETUP.md) and load them after it.

Add the `.utensil-calculate` class alongside `.utensil-mode` to enable mode colors and scalable design tokens. The Vue theme components handle this internally.

```html
<body class="utensil-calculate utensil-mode blue-pen gray-pencil">
  <!-- Mode colors and design tokens are now available -->
</body>
```

You can scope scale changes by setting `--scale` on any element:

```html
<div style="--scale: 1.5">
  <!-- Spacing, font sizes, and radii scale up proportionally -->
</div>
```

## Color System

### Pen, Pencil, and Paper

All color in Utensil flows through three instruments:

- **Pen** — The accent color for emphasis and attention (buttons, links, active states)
- **Pencil** — The structural color for scaffolding and detail (borders, backgrounds, secondary text)
- **Paper** — The surface color everything sits on (pages, panels, cards, depth)

You style your UI using the instruments' CSS variables. The actual color is determined by the theme context:

```css
.my-card {
  background: var(--pencil-2);
  border: 1px solid var(--pencil-6);
  color: var(--pen-a11);
}

.my-card-title {
  color: var(--pencil-a11);
}
```

### Color Scale (1–12)

Pen and pencil have a 12-step scale designed for specific UI purposes:

| Steps | Purpose            | Typical usage                                         |
| ----- | ------------------ | ----------------------------------------------------- |
| 1–2   | Backgrounds        | Page background (`1`), subtle/nested background (`2`) |
| 3–5   | Component surfaces | Default (`3`), hover (`4`), active/selected (`5`)     |
| 6–8   | Borders            | Subtle (`6`), default (`7`), hover (`8`)              |
| 9–10  | Solid fills        | Primary button (`9`), hover state (`10`)              |
| 11–12 | Text               | Standard text (`11`), high-contrast text (`12`)       |

### Paper Scale (0–12)

Paper exists primarily for backgrounds and surfaces. Its scale is a depth ladder rather than a role scale — every step is a usable background, rising away from the page. Steps sit at uniform tone (CIELAB lightness) increments, identical in light and dark mode, so the perceived contrast between any two steps is the same in both modes:

| Step | Depth                                                             |
| ---- | ----------------------------------------------------------------- |
| 0    | Inset below the page (stage wells, recessed areas)                |
| 1    | The page itself                                                   |
| 2–12 | Surfaces above the page — each step one level of hierarchy higher |

The same scale also borders and details surfaces at the surface's own visual hierarchy, where a pencil border would read as foreign detail: a near step edges a card subtly (a `--paper-5` border on a `--paper-2` card), a farther step separates two adjacent surfaces (`--paper-9`).

Paper's alpha steps build **relative** hierarchy: `--paper-a4` elevates a surface four steps above its background, whatever that background is. Style a component's internal depth with paper alphas and the hierarchy is preserved when the base paper background changes.

### Alpha Values

Each step also has an alpha variant (`--pen-a1` through `--pen-a12`) that provides transparency. Alpha values blend naturally with any background and work seamlessly across light and dark modes.

**Prefer alpha values** for backgrounds, borders, and text. Use opaque values (`--pen-9`, `--pen-10`) only for solid fills like primary buttons.

```css
/* Preferred — blends with any background */
background: var(--pen-a3);
color: var(--pen-a11);
box-shadow: inset 0 0 0 1px var(--pen-a7);

/* Opaque — for solid fills */
background: var(--pen-9);
color: var(--pen-contrast);
```

### Semantic Color Variables

In addition to the numbered scale, a few semantic variables are available:

| Variable          | Use                                                    |
| ----------------- | ------------------------------------------------------ |
| `--pen-contrast`  | Text on step 9 solid backgrounds (e.g., button labels) |
| `--pen-surface`   | Background for `surface` variation components          |
| `--pen-indicator` | Checked states, highlighted tabs, notification dots    |
| `--pen-track`     | Slider tracks, progress bars                           |
| `--pen-brand`     | The exact brand color the scale was generated from     |

All semantic variables are also available for pencil (`--pencil-contrast`, etc.).

### Mode Colors

These variables adapt to light or dark mode automatically:

```css
background: var(--background); /* Page background */
background: var(--surface); /* Surface background */
background: var(--panel-solid); /* Popover/panel background */
background: var(--panel-translucent); /* Translucent panel */
background: var(--overlay); /* Overlay backdrop */
```

### Absolute Colors

For elements overlaying unknown backgrounds (images, video), use `--black-a*` and `--white-a*`. These remain stable regardless of light/dark mode.

### Changing Colors in Your UI

Apply colors to any element by setting a pen or pencil class:

```html
<div class="blue-pen gray-pencil">
  <!-- Everything inside uses blue for pen, gray for pencil -->
</div>
```

Or use the `UtensilTheme` component for reactive color changes:

```vue
<UtensilTheme pen="error">
  <p>This text follows the error color.</p>
</UtensilTheme>
```

Colors cascade down the DOM tree. Nested `UtensilTheme` components override only the properties they specify, inheriting everything else:

```xml
<UtensilTheme pen="blue" pencil="gray">
  <!-- blue pen, gray pencil -->
  <UtensilTheme pen="error">
    <!-- error pen, still gray pencil -->
  </UtensilTheme>
</UtensilTheme>
```

## Design Tokens

All spacing, sizing, and radii use scalable design tokens. These respond to the current `--scale` value, allowing entire sections of UI to be scaled up or down.

### Spacing

`--space-1` through `--space-9` for padding, margin, and gap.

### Typography

- `--font-size-1` through `--font-size-9`
- `--line-height-1` through `--line-height-9`
- `--letter-spacing-1` through `--letter-spacing-9`

### Border Radius

- `--radius-1` through `--radius-6` — scaled by `--radius-scale`
- `--radius-full` — maximum circular radius

### Shadows

Shadows provide elevation and depth. Two families are available — **borderless** for elements with their own border/radius (modals, dialogs, cards) and **bordered** for floating elements that need a subtle border (popovers, dropdowns, menus).

Each family has a **standard** variant using the pencil color and a **highlight** variant using the pen color for accent-tinted elevation.

| Token                                                         | Purpose                              |
| ------------------------------------------------------------- | ------------------------------------ |
| `--shadow-1` … `--shadow-6`                                   | Borderless elevation (pencil-tinted) |
| `--shadow-border-1` … `--shadow-border-6`                     | Bordered elevation (pencil-tinted)   |
| `--highlight-shadow-1` … `--highlight-shadow-6`               | Borderless elevation (pen-tinted)    |
| `--highlight-shadow-border-1` … `--highlight-shadow-border-6` | Bordered elevation (pen-tinted)      |

Lower numbers are subtle (inset, inner shadow), higher numbers are more pronounced (outer shadow, depth).

```css
/* Card with standard elevation */
box-shadow: var(--shadow-border-2);

/* Selected card with accent-tinted elevation */
box-shadow: var(--highlight-shadow-border-3);
```

### Common Defaults

For reference, these are the standard values used by Utensil components:

| Property                       | Token                      |
| ------------------------------ | -------------------------- |
| Interactive border radius      | `--radius-3`               |
| Interactive vertical padding   | `--space-2`                |
| Interactive horizontal padding | `--space-3` or `--space-4` |
| Font size                      | `--font-size-2`            |
| Inline gap (label + icon)      | `--space-2`                |
| Stacked form fields            | `--space-5`                |
| Related content gap            | `--space-4`                |
| Section gap                    | `--space-6`                |

## Components

### Common Props

Many components share a common set of theme props:

| Prop        | Type                                                                           | Effect               |
| ----------- | ------------------------------------------------------------------------------ | -------------------- |
| `color`     | Color name, variant name, or `'pen'` / `'pencil'`                              | Sets the pen color   |
| `variation` | `'solid'` \| `'outline'` \| `'surface'` \| `'soft'` \| `'text'` \| `'overlay'` | Sets visual weight   |
| `scale`     | Number or `'tiny'` \| `'small'` \| `'normal'` \| `'large'` \| `'giant'`        | Scales the component |
| `icon`      | Icon name from your theme                                                      | Shows an icon        |
| `disabled`  | `boolean`                                                                      | Disables interaction |

Not every component supports every prop — only what makes sense for that component.

#### Scale Values

| Name     | Value |
| -------- | ----- |
| `tiny`   | 0.75  |
| `small`  | 0.875 |
| `normal` | 1     |
| `large`  | 1.125 |
| `giant`  | 1.375 |

#### UI Variations

Variations control visual weight and hierarchy:

- **`solid`** — Filled background, highest prominence. Use for primary actions.
- **`soft`** — Subtle tinted background. Use for secondary actions.
- **`surface`** — Blends with page, subtle border. Use for cards and less prominent controls.
- **`outline`** — Border only, no fill. Use for tertiary actions.
- **`text`** — No chrome. Use for inline actions, toolbars, and links.
- **`unstyled`** — No default styles applied. Use when you need full custom styling.
- **`overlay`** - Contrasts on top of media with unknown colors and contrast.

### Available Components

To discover available components, read [COMPONENTS.md](./COMPONENTS.md) or list `node_modules/utensil-vue/src/components/` — each subdirectory contains one or more related components.

The library provides general-purpose UI primitives suitable for any application: buttons, form inputs, navigation, overlays, layout, display, media, data loading, and theme controls.

#### Component Categories

| Category              | What's included                                                                                                 |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |
| Buttons and actions   | Standard, circular, close, and toggle buttons                                                                   |
| Form inputs           | Text, password, search, textarea, checkbox, toggle switch, radio, select, sliders, date and color pickers       |
| Layout and navigation | Side menus, navigation menus, tabs, scrollers, dividers, maximizable containers                                 |
| Overlays and menus    | Popovers, dropdown menus, context menus, keyboard-navigable menus, listboxes, modals, dialogs, tooltips, toasts |
| Display               | Icons, badges, pills, avatars, cards, callouts, blockquotes, spinners, progress bars, data lists, empty states  |
| Media                 | Images, video, adaptive media containers, placeholders, media badges                                            |
| Data loading          | Resource loaders, infinite scroll loaders                                                                       |
| Data visualization    | Charts and visual data representations                                                                          |
| Utilities             | Fade transitions, file drop targets, color scale displays, skeleton loaders                                     |
| Theme controls        | Mode toggle, contrast toggle, reduced motion toggle, full theme control panel                                   |

### Popover Primitives

Components that need floating/overlay behavior should compose existing popover primitives rather than implementing their own positioning logic:

| Primitive                  | Purpose                                                           |
| -------------------------- | ----------------------------------------------------------------- |
| `UtensilPopover`           | Anchored floating panel, positioned relative to a trigger element |
| `UtensilPopoverPositioned` | Floating panel positioned at arbitrary x,y coordinates            |
| `UtensilMenu`              | Keyboard-navigable menu with focus management on items            |
| `UtensilListbox`           | Selection list with focus management on the trigger               |

These primitives are composed to build higher-level components. For example:

- Dropdown menu = `UtensilPopover` + `UtensilMenu`
- Context menu = `UtensilPopoverPositioned` + `UtensilMenu`
- Select = `UtensilPopover` + `UtensilListbox`

When building a new component that requires popover behavior, compose these primitives in the same way.

### Composite Components

Many components are composite — a parent component with child components designed to work together (e.g., Menu/MenuItem, Tabs/TabsTrigger/TabsContent, SideMenu/SideMenuItem). These are always designed to accept **custom children** alongside or instead of the built-in child components.

**How children participate in the component group:**

| Mechanism           | Purpose                                                                                                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Slot scope**      | The primary API for custom children — the parent exposes functions and state via slot scope (e.g., `isFocused`, `focus`, `close`)                                                         |
| **CSS Cvars**       | Parent sets CSS variables that children read with fallbacks for layout coordination (e.g., `--side-menu-item-tooltip-display`)                                                            |
| **Data attributes** | Children use data attributes for keyboard navigation and focus management (e.g., `data-focusable`) and can target data-attributes in the parent for CSS selectors (data-oriantation, etc) |

Custom children participate through slot scope and data attributes:

```vue
<UtensilMenu>
  <template #default="{ isFocused, focus, close }">
    <UtensilMenuItem label="Built-in" />
    <div
      data-focusable
      @mouseenter="focus($el)"
      @click="close()"
    >Custom item</div>
  </template>
</UtensilMenu>
```

For full details on composite component patterns, group components, and child communication, see DEVELOPMENT.md.

## Using UtensilTheme

The `UtensilTheme` component changes the theme context for everything inside it. It renders a wrapper `<div>` that applies the appropriate CSS classes and variables.

In practice, you'll typically use your own typed theme component (e.g., `AcmeTheme`) rather than `UtensilTheme` directly — see SETUP.md. The API is the same; the examples below use `UtensilTheme` for brevity.

### useTheme Composable

`useTheme()` is an alternative to `<UtensilTheme>` that allows scoped theme modifications without a wrapper element. It returns `classes` and `style` which you apply to the target element where the change should take effect.

```vue
<template>
  <section :class="classes" :style="style">
    <h2>Warning</h2>
    <p>Something needs attention.</p>
    <!-- All children inherit the theme change -->
  </section>
</template>

<script setup lang="ts">
import { useTheme } from 'utensil-vue/theme/useTheme'

const { classes, style } = useTheme({ pen: 'warning' })
</script>
```

This is primarily used within Utensil component implementations (see DEVELOPMENT.md) but can be useful in application code when you need to modify the theme context on an existing element without adding a wrapper div.

### Changing Colors

Pass a color name, variant name, or instrument to `pen` or `pencil`:

```vue
<!-- Use a specific color -->
<UtensilTheme pen="blue">
  <MyButton>Blue Action</MyButton>
</UtensilTheme>

<!-- Use a variant (maps to a color defined in your theme) -->
<UtensilTheme pen="error">
  <MyCallout>Something went wrong.</MyCallout>
</UtensilTheme>

<!-- Swap pen and pencil -->
<UtensilTheme pen="pencil" pencil="pen">
  <MyWidget />
</UtensilTheme>
```

### Changing Scale

```vue
<UtensilTheme scale="small">
  <!-- Everything inside is scaled down -->
  <MyToolbar />
</UtensilTheme>

<UtensilTheme scale="large">
  <!-- Everything inside is scaled up -->
  <MyHero />
</UtensilTheme>
```

### Changing Mode

```vue
<UtensilTheme mode="dark">
  <!-- Forces dark mode for this subtree -->
  <MySidebar />
</UtensilTheme>
```

### Component Color Props vs UtensilTheme

Many components accept a `color` prop as a shortcut. These are equivalent:

```vue
<!-- Using the color prop -->
<MyButton color="error">Delete</MyButton>

<!-- Using UtensilTheme -->
<UtensilTheme pen="error">
  <MyButton>Delete</MyButton>
</UtensilTheme>
```

Use the `color` prop for individual components. Use `UtensilTheme` when you want to color a group of components together.

### Switching Themes

You can nest a different `UtensilThemeRoot` to switch the entire theme for a section of your app. This loads the alternate theme's CSS and reconfigures variants, icons, and text themes for everything inside it.

## Theme Conventions

Your app's theme (see SETUP.md) is where Utensil is configured for your project. Keep application code on the theme's terms:

- **Use variant names, never concrete colors.** Write `color="primary"`, `pen="success"`, `color="warning"` — not `blue`, `green` or `orange`. Re-coloring the app then means changing one line in the variant map.
- **Always use typed wrappers.** Use your theme's typed wrapper (`AcmeButton`, `AcmeIcon`) rather than the bare generic Utensil component. If a wrapper doesn't exist yet, create one (see SETUP.md → "Create Typed Component Wrappers").
- **No emojis in UI copy or interface elements.** Use icons from the theme's icon map — add an icon to the map if none fits. SVG files or images are fine where more appropriate.

### Naming Icons in the Map

The icon map key names the icon's **role in your UI** — `upload`, `logout`, `add-folder` — not the glyph it happens to resolve to (`cloud-arrow-up`, `right-from-bracket`, `folder-plus`). Keep the glyph name on the import; the key is the purpose:

```ts
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons/faRightFromBracket'

export const acmeIconMap = {
  ...utensilIconMap,
  logout: faRightFromBracket, // key = purpose, import = glyph
}
```

Call sites then ask for `icon="logout"` — what it means — not what it currently looks like. Swapping the glyph changes only the import, and every call site stays correct. Use kebab-case keys without the `fa` prefix.

### Custom Icon SVG

- Prefer the icon library when it has a precisely suitable icon.
- Add it to the icon map if the library has a suitable icon that isn't mapped yet.
- Prefer a custom icon over a slightly-off icon from the library or map.
- Keep custom icon SVGs with your theme (e.g. `src/acme-theme/icons/`) and render them in the slot of your theme's icon component.

## Gestures

### useLongPress Composable

`useLongPress()` turns a held touch into a gesture at the system long-press time (500ms on iOS and Android). A finger that moves first stays a pan, one that lifts first stays a tap, and mouse and pen presses are ignored. While a press is held, the browser's own hold responses are quieted: the touch context menu is prevented, and once armed, touch panning is blocked so the gesture keeps the finger. Arming gives the short haptic bump the native long press would have, where the Vibration API exists.

Feed it the `pointerdown` of the element that owns the gesture. `holding` is true from the press until the gesture ends — bind it to a class that disables text selection and the iOS callout, which fires with no event to prevent.

```vue
<template>
  <div class="card" :class="{ holding }" @pointerdown="longPress.press($event)">...</div>
</template>

<script setup lang="ts">
import { useLongPress } from 'utensil-vue/composables/use-long-press'

const longPress = useLongPress(openMenu, { fire: 'release' })
const holding = longPress.holding
</script>

<style scoped>
.card.holding {
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}
</style>
```

`fire` picks when the callback runs:

- `'hold'` (default) fires the moment the hold time elapses with the finger still down, for gestures that carry on from there such as a drag. The gesture stays owned until you call `release()`, typically when the drag ends.
- `'release'` fires after the finger lifts and its event sequence has run, for surfaces the gesture opens such as a menu. A popover opened any earlier is light-dismissed by the release's own `pointerup`, and the click the release synthesizes is swallowed so nothing underneath activates.

`duration` and `tolerance` (movement in pixels that turns the hold into a pan) override the defaults. `UtensilReorderableList` uses the hold mode for touch drags.

## Keyboard

Keys belong to the element they're pressed in. A feature binds its keys on its own element, never on `document` or `window`. A key it handles is kept: its default action is prevented and it stops propagating, so nothing further out acts on it too. A key it doesn't handle travels on.

Modals (`UtensilModal`, `UtensilStage`) own the keyboard while open: no key pressed in one reaches the page beneath, and focus that drops out of one (the focused control removed or hidden) returns to the dialog, so its keys keep landing inside.

A `UtensilDrawer` closed out of sight is inert, so Tab never reaches its content. A drawer the user opens to work in takes `focusOnOpen`, which leads focus into it, and `closeOnEscape`, which closes it on Escape pressed within. A `UtensilContextMenu` hands focus back to where it opened from once it closes.

Capture-phase listeners on `document` or `window` are for generic DOM behavior only, never feature keys: observers such as input modality, outside-click dismissal, and swallowing the events a finished gesture leaves behind.

### useKeys Composable

`useKeys()` maps keys to handlers and attaches them to `target`:

```vue
<template>
  <div ref="editor" tabindex="-1">...</div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useKeys } from 'utensil-vue/composables/use-keys'

const keys = useKeys(
  {
    Space: togglePlayback,
    ArrowLeft: () => nudge(-1),
    'Shift+F10': openMenu,
    Delete: { handler: remove, ignore: 'controls' },
  },
  { target: useTemplateRef('editor'), enabled: () => !loading.value },
)
</script>
```

Without a `target`, bind the returned `onKeydown` in a template (`@keydown="keys.onKeydown"`). `stop()` and `start()` pause and resume the map; `enabled` does the same reactively.

- **Key names** are `event.key` values (`Space` stands for `' '`) after any `Ctrl+`, `Alt+`, `Shift+`, `Meta+`. Ctrl, Alt and Meta match exactly. A named key matches Shift exactly; a character matches in either case and needs Shift only where the binding names it. The most specific binding wins.
- **Declining**: a handler that returns `false` leaves the key untouched, as if unbound, e.g. an arrow at the end of a list.
- **`ignore`** leaves keys to the element they're pressed in: `typing` (default) for text entry and form fields, `controls` for those plus buttons and links, `none` for nowhere.
- **`preventDefault`** and **`stopPropagation`** (both default `true`) can be turned off for the whole map or per binding.
- Keys an inner element already handled (default prevented) and keys pressed mid IME composition are left alone.

### Key Scopes

A region whose keys work from anywhere inside it, such as an editor, provides a key scope on its root element. Its descendants attach their key maps to the scope rather than to their own elements:

```vue
<!-- EditorPage.vue -->
<template>
  <div ref="editor" class="editor" tabindex="-1" role="region" aria-label="Editor">...</div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { provideKeyScope } from 'utensil-vue/composables/use-key-scope'

const editor = useTemplateRef('editor')
provideKeyScope(editor)
onMounted(() => editor.value?.focus({ preventScroll: true }))
</script>
```

```ts
// A panel inside the editor
useKeys({ Space: togglePlayback }, { target: useKeyScope() })
```

The scope element holds focus for the region: with `tabindex="-1"`, a click on anything unfocusable inside lands on it, and focus that drops out of it (the focused control removed or hidden) returns to it. Give it a role and a label, or it's announced by its whole content when it takes focus, and focus it on mount if its keys should work before the first click.

## Flex Utility Classes

Utensil provides CSS utility classes for quick flex layouts. These are available globally when Utensil CSS is loaded.

```xml
<div class="flex column gap-4">
  <div class="flex gap-2 align-center">
    <MyIcon />
    <span>Label</span>
  </div>
  <div class="flex space-between">
    <MyButton>Cancel</MyButton>
    <MyButton>Save</MyButton>
  </div>
</div>
```

### Available Classes

**Layout**: `.flex`, `.column`, `.nowrap`, `.flex-block` (`width: 100%`)

**Justify**: `.center`, `.space-between`, `.space-around`, `.space-evenly`, `.justify-center`, `.justify-start`, `.justify-end`

**Align**: `.align-center`, `.align-start`, `.align-end`, `.stretch`, `.align-baseline`

**Gap**: `.gap-1` through `.gap-9` (maps to `--space-1` through `--space-9`)

**Flex items**: `.flex-grow`, `.flex-shrink`, `.align-self-start`, `.align-self-center`, `.align-self-end`, `.align-self-stretch`

**Text align**: `.text-start`, `.text-center`, `.text-end`

**Spacing**: `.padding-n`, `.padding-block-n`, `.padding-inline-n`, `.margin-n`, `.margin-block-n`, `.margin-inline-n` (1–9)

**Shadows**: `.shadow-1` through `.shadow-6` (elevation shadows), `.shadow-border-1` through `.shadow-border-6` (border-style shadows)

For more complex layouts, write scoped CSS using the design tokens directly.

Utilities live in the `utensil-utilities` cascade layer, so your unlayered component CSS can override them — including inside `@media`/`@container` queries for responsive adjustments. See "Cascade Layers" below.

## Layout Utilities vs Scoped Styles

Split an element's styling between utility classes and your scoped CSS **by concern**:

- **Layout structure → utility classes, in the template.** How an element arranges its children and sits in its parent: `display`, direction, `gap`, alignment, `width: 100%`. Developers read the template to understand structure, so keeping layout there keeps the structure readable in one place.
- **Visual style → scoped CSS.** The element's own identity: color, border, background, typography, shadow, transitions, and any fine spacing that belongs to that identity.

An element often has both. A styled button that also lays out an icon and a label carries its layout in the class list and its visual identity in the scoped block — that is separation of concerns, not fragmentation:

```vue
<template>
  <button class="provider-button flex center gap-3 flex-block">
    <span class="provider-button-logo">…</span>
    <span class="provider-button-label">…</span>
  </button>
</template>

<style scoped>
/* the button's own visual identity — no layout here */
.provider-button {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--pencil-a7);
  border-radius: var(--radius-3);
  background: var(--surface);
  color: var(--pencil-12);
  font-size: var(--font-size-2);
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}
</style>
```

Prefer the composed shorthands where they exist: `flex center` centers on both axes (no need for `align-center justify-center`), and `flex-block` is `width: 100%`.

**Never set the same property in both a utility and the scoped block.** Once `gap` is a utility (`gap-3`), it must not also appear in the scoped rule: utilities live in the `utensil-utilities` cascade layer, so the scoped rule always wins and silently disables the utility. Give every property exactly one home. A structural property with no utility (e.g. `text-align` beyond the provided classes) simply stays in scoped CSS.

The exception is a deliberate responsive override: scoped CSS inside a `@media` or `@container` query may override a utility to adapt the layout — see "Cascade Layers" below.

**The same trap applies across files: when locally targeting an element that also carries a class styled elsewhere, include both classes in the selector.** An element often wears a class from another scope alongside your own — a shared layout class (`panel-section` from a shared layout stylesheet) or a child component's root class. A single-class selector ties with the other file's rule on specificity, and the winner falls to style-injection order, which can differ between lazy-loaded chunks in development and the production bundle. Compound both classes so your override out-specifies instead of ties:

```css
/* ties with .my-layout .panel-section — the winner depends on chunk load order */
.account-details {
  padding: var(--space-4);
}

/* out-specifies it — the override is deterministic */
.account-details.panel-section {
  padding: var(--space-4);
}
```

If your local rule merely repeats the other file's values, delete it instead — the other rule already owns those properties.

Utensil classes are not in this trap: Utensil's styles live in the `utensil` cascade layer, so your unlayered rule wins regardless of injection order. The same goes for shared CSS scoped to the `app` layer — a single-class local rule overrides it deterministically.

## CSS Component Variables (Cvars)

Some components expose CSS variables that allow you to customize their layout from a parent. These are always prefixed with the component name and have sensible defaults.

```css
/* Customize side menu header height from a parent */
.my-layout {
  --side-menu-header-height: var(--space-8);
}
```

Check individual component source files for available cvars.

## Text Themes

Utensil provides text themes that style typographic elements (headings, paragraphs, lists, code). Your theme root sets a default text theme. You can switch text themes for content sections:

```html
<article class="text-content">
  <h1>Article Title</h1>
  <p>Body text with appropriate sizing and spacing.</p>
</article>
```

The `ui` text theme is optimized for interface text. The `content` text theme is optimized for reading.

## Cascade Layers

All Utensil CSS is scoped to cascade layers, declared in `utensil-layers.css`:

```css
@layer utensil, app, utensil-utilities;
```

Later layers beat earlier ones regardless of selector specificity, and CSS outside any layer beats all layers. From weakest to strongest:

1. **`utensil`** — the reset, theme, color scales, and all component styles
2. **`app`** — optional layer for your shared CSS (see below)
3. **`utensil-utilities`** — the utility classes
4. **Unlayered CSS** — everything you write in components; always wins

Because your component CSS is unlayered, it overrides Utensil component styles and utilities without specificity tricks — a single class selector is enough.

The layer order must be established before any other CSS loads — importing `utensil-layers.css` first at the application entry point is a configuration requirement of using Utensil (see SETUP.md → "Load the Layer Order First"). If a layering problem appears (a utility not applying, your CSS not winning), check that import first.

### Overriding Utilities (Responsive Design)

Utility classes sit in the `utensil-utilities` layer, so your unlayered component CSS overrides them. Use utilities for the base layout and override them locally with `@media` or `@container` queries:

```vue
<template>
  <div class="toolbar flex gap-4 align-center">…</div>
</template>

<style scoped>
@container size-container (max-width: 576px) {
  .toolbar {
    flex-direction: column; /* beats the .flex row direction */
    gap: var(--space-2); /* beats .gap-4 */
  }
}
</style>
```

Utilities also beat Utensil component styles (`utensil-utilities` sits above `utensil`). This is by design: adding a utility like `.padding-3` to a Utensil component root adjusts it just like any other element.

### The `app` Layer

Shared CSS used across sub-features (a console layout, shared slide presentation, demo page chrome) would normally defeat utility classes on the elements it styles — counterintuitive when a developer adds `.align-end` and nothing happens because shared CSS set the property first. Scope shared CSS to the `app` layer instead: it still overrides Utensil's component styles, but utilities keep working on top of it, and local component CSS overrides everything as usual.

Start any file that declares `@layer app` rules by restating the layer order, so the file is self-correct even if it happens to load first:

```css
/* console.css */
@layer utensil, app, utensil-utilities;

@layer app {
  .console-panel {
    padding: var(--space-5);
    background: var(--panel-translucent);
  }
}
```

### Cautions

- **Bare element selectors**: unlayered CSS beats Utensil's component styles, and that includes element selectors — a global `button { … }` rule overrides `.utensil-button` styling. Keep global element styling inside the `app` layer (or scoped) so components keep their look.
- **`!important` inverts the layer order**: for `!important` declarations the precedence reverses — a layered `!important` beats an unlayered one, and earlier layers beat later ones. An `!important` rule in the `app` layer is therefore stronger than it looks; avoid `!important` as always.

## Writing Custom CSS

When writing your own styles, follow these conventions to mske the most of Utensil:

```css
.my-widget {
  /* Use design tokens, not hardcoded values */
  padding: var(--space-3);
  border-radius: var(--radius-3);
  font-size: var(--font-size-2);
  gap: var(--space-2);

  /* Use pen/pencil, not specific colors */
  background: var(--pen-a3);
  color: var(--pen-a11);
  box-shadow: var(--shadow-border-2);
}

.my-widget:hover {
  background: var(--pen-a4);
}
```

### High Contrast Support

Utensil's high contrast mode remaps step 11 to step 12 for text. Normally you should use `--pen-a11` or `--pencil-a11` or `11` for text, then high contrast works automatically.

For other elements that need high contrast adjustments, target the `.utensil-high-contrast` class:

```css
.utensil-high-contrast .my-widget {
  border-color: var(--pen-a9);
}
```

### Responsive Design

In layouts, define a container called `size-container` and Utensil components will automatically use it for responsive behavior.

```css
.side-panel {
  container-type: size;
  container-name: size-container;
}
```

### Mode-Specific Styles

Target `.light-mode` or `.dark-mode` when you need mode-specific overrides:

```css
.light-mode .my-widget {
  box-shadow: 0 1px 3px var(--black-a2);
}

.dark-mode .my-widget {
  box-shadow: 0 1px 3px var(--black-a4);
}
```
