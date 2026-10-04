# utensil-vue

Utensil is a design system that provides a CSS color theme system, a Vue 3 theme configuration layer for reactivity and scoping, and an extensive component library — all designed so that non-designer engineers can build modern, elegant, and accessible interfaces.

Utensil ships as two packages:

| Package       | What it provides                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------------- |
| `utensil-css` | The CSS framework: color instruments, design tokens, cascade layers, utilities, color generator    |
| `utensil-vue` | The Vue 3 theme layer, the component library and composables, and the AI harness (docs and skills) |

`utensil-vue` depends on `utensil-css` and forwards everything from it at the same subpaths (`utensil-vue/utensil-layers.css`, `utensil-vue/colors/generate-css`, the `utensil-generate-color` command), so a Vue project installs and imports only `utensil-vue`.

## Install

```bash
npm install utensil-vue
npm install vue @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/vue-fontawesome
```

`vue` and the FontAwesome packages are peer dependencies. Both packages are ESM, built for bundlers such as Vite (`"moduleResolution": "bundler"`). There is no barrel file: import each component from its own path and your bundler includes only the JavaScript and CSS you use.

## Quick Start

Load the cascade layer order first, at your application entry point:

```ts
// main.ts
import 'utensil-vue/utensil-layers.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

Wrap your app in a theme root, and use components through typed wrappers bound to your theme:

```ts
// acme-theme/components/AcmeButton.ts
import UtensilButton from 'utensil-vue/components/button/UtensilButton.vue'
import type { AcmeThemeConfig } from '../acme-theme'

export const AcmeButton = UtensilButton<AcmeThemeConfig>
```

```vue
<template>
  <AcmeThemeRoot :mode="mode">
    <AcmeButton color="primary" icon="edit">Edit</AcmeButton>
  </AcmeThemeRoot>
</template>
```

[SETUP.md](docs/SETUP.md) walks through creating the theme (`AcmeThemeConfig`, the icon map, `AcmeThemeRoot`) step by step.

## What Utensil Provides

### CSS Theme System

A pure CSS color system built on color scales and three instruments — **pen**, **pencil**, and **paper** — that separate color intent from concrete values. You style your UI with the instruments' variables, then apply any color scale by adding a class. The entire color scheme of any element and its children can be changed with a single class swap.

```html
<body class="blue-pen gray-pencil">
  <button class="my-button">Click Me</button>
</body>
```

```css
.my-button {
  background: var(--pen-9);
  color: var(--pen-contrast);
  border-radius: var(--radius-3);
  padding: var(--space-2) var(--space-4);
}
```

No framework required. The CSS theme works with any stack.

### Vue Theme Configuration

A reactive theme layer for Vue 3 that adds scoped color changes, semantic variants, dark/light mode, scalable design tokens, and full TypeScript support. Theme changes cascade naturally down the component tree.

```vue
<UtensilTheme pen="error" scale="small">
  <MyAlert>Something went wrong.</MyAlert>
</UtensilTheme>
```

### Component Library

An extensive library of accessible, themeable Vue 3 components — buttons, inputs, menus, dialogs, popovers, tabs, data display, media, and more. Components follow consistent patterns for variations, color, scale, and keyboard navigation.

### AI Harness

Utensil includes structured documentation and agent skills so AI agents build with Utensil following its patterns and conventions. The development guide, setup guide, and usage guide serve as both human and AI-agent references. See "AI Harness" below.

## Core Concepts

### Pen, Pencil, and Paper

At the heart of Utensil's color system:

- **Pen** — The primary color used for emphasis and focus. You draw attention with a pen.
- **Pencil** — The secondary color used for structure and scaffolding. You sketch structure with a pencil.
- **Paper** — The surface color used for backgrounds and depth. Everything is drawn on paper.

Components are styled with instrument variables (`--pen-9`, `--pencil-a3`, `--paper-2`), making them agnostic to concrete colors. The actual color is determined by the theme context, which can be changed at any level of the DOM.

### Semantic Variants

Colors can be referenced by semantic name — `success`, `warning`, `error` — which map to concrete colors defined in your theme. This means changing your error color from red to crimson is a single-line change in your theme config. Use the built in variants, and add your own.

### Color Scale

Color scales can be generated from a single base color (recommended), or hand rolled.

Each color provides a 12-step scale with alpha variants, designed for specific UI purposes: backgrounds (1-2), component surfaces (3-5), borders (6-8), solid fills (9-10), and text (11-12). Alpha values blend naturally across light and dark modes.

Utensil includes simple tools to generate color scales from a single base color using contrast targets based on the [APCA](https://apcacontrast.com/) algorithm.

You can generate color scales using:

- the theme designer in the Utensil reference app
- the `utensil-generate-color` command (`npx utensil-generate-color blue "#0093ee"`)
- `generateColorCss()` from `utensil-vue/colors/generate-css`, or the `useColorGenerator()` composable from `utensil-vue/colors/use-color-generator`, at runtime

### Scalable Design Tokens

Spacing, font sizes, line heights, and border radii are all relative to a `scale` value. An entire section of UI can be scaled up or down without breaking proportions.

## Benefits

- **Simple and approachable** — Style with pen and pencil. Apply a color with a class. No design expertise needed.
- **Progressive opt-in** — Use as much or as little as you need, from pure CSS to the full Vue component library.
- **Light and dark mode** — The color system works across modes. Components adapt automatically.
- **Cross-mode overlays** — Alpha color values and absolute color tokens ensure elements look correct when overlaid on unknown or mixed-mode backgrounds.
- **Accessible by default** — The component library is built with accessibility as a first-class concern: focus management, keyboard navigation, ARIA attributes, high contrast support, and reduced motion support.
- **Customizable** — Define your own theme with your own colors, variants, icons, and text themes. The component library works with any theme configuration. Design with the reference app's theme designer and export the CSS to your codebase.
- **Type-safe theming** — Define your colors, variants, and icons in TypeScript. Invalid values are caught at compile time, and your IDE provides full autocomplete.
- **Scoped and composable** — Theme changes cascade and nest. Override the pen color for a subtree without affecting the rest of the page.

## Architecture

Utensil is built in opt-in layers, each adding capability:

| Layer                       | What it provides                                           |
| --------------------------- | ---------------------------------------------------------- |
| **Color Scales** (CSS)      | Concrete color values, pen/pencil classes — works anywhere |
| **Theme CSS**               | Mode colors, scalable design tokens, dark/light support    |
| **Theme Component** (Vue)   | Reactive scoping, variants, TypeScript integration         |
| **Component Library** (Vue) | Ready-to-use accessible UI components                      |

You can use just the CSS layers for a non-Vue project, or the full stack for a complete design system with Vue 3.

## AI Harness

`utensil-vue` ships agent skills in its `skills/` folder, in the [Agent Skills](https://agentskills.io) format, together with the docs they draw on. They are version-matched to the package: upgrading `utensil-vue` upgrades the skills.

| Skill                                               | Purpose                                                                          |
| --------------------------------------------------- | -------------------------------------------------------------------------------- |
| `/utensil-usage`                                    | Background knowledge of the usage guide; loads automatically for Utensil UI work |
| `/utensil-find-components <requirements>`           | Match design requirements to existing Utensil components                         |
| `/utensil-implement-component <Name> <description>` | Build a project-owned component following Utensil principles                     |
| `/utensil-document-component-api <Name>`            | Generate or update a component's `<Name>Doc.vue` API documentation               |
| `/utensil-audit-component <Name> [--fix]`           | Audit a component against Utensil patterns and standards                         |
| `/utensil-setup-theme <ThemeName>`                  | Create your app's theme, theme root, and typed wrappers                          |

Link them into your project with [skills-npm](https://github.com/antfu/skills-npm), which symlinks skills from `node_modules` into `.claude/skills` (Claude Code) and `.agents/skills` (other agents):

```bash
npm install -D skills-npm
npx skills-npm setup
```

`setup` adds `skills-npm` to your `prepare` script, so the links are refreshed on every install and always match the
installed version of `utensil-vue`. Commit the links and `skills-npm-lock.json` to share them with your team.

You can also bring the usage guide into every session by importing it from your agent's project instructions (e.g. `CLAUDE.md` or `AGENTS.md`), where your agent supports imports:

```md
@node_modules/utensil-vue/docs/USAGE.md
```

## Further Reading

- [SETUP.md](docs/SETUP.md) — Creating your own theme: colors, variants, icons, and theme root
- [USAGE.md](docs/USAGE.md) — Using the color system, components, and theming in your application
- [DEVELOPMENT.md](docs/DEVELOPMENT.md) — Building components the Utensil way: patterns, conventions, and checklist
- [COMPONENTS.md](docs/COMPONENTS.md) — The component catalogue

## License

MIT © Gobi Stories AS
