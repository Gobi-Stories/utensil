---
name: utensil-setup-theme
description: Create a Utensil theme for a project — generated color scales, variants, text themes, icon map, theme root component and typed component wrappers. Use when setting up @gobistories/utensil-vue in a new project or adding a new theme to an existing one.
license: MIT
argument-hint: <ThemeName> [brand colors…]
---

# Set Up a Utensil Theme

Create a fully typed Utensil theme for this project and wire it into the application.

## Arguments

- `ThemeName`: The theme name (e.g., "Acme"). It becomes the `name` passed to the theme root and the `<name>-theme` CSS class, so its kebab-case form must be a valid CSS class name.
- `brand colors`: Optional hex colors with their roles (e.g., "primary #0093ee, error #e5484d").

## Step 1: Read the guides

Read `references/SETUP.md` (in this skill's directory) — this skill follows it step by step. Read `references/USAGE.md` for how the theme is used once it exists.

## Step 2: Confirm the inputs

Determine:

- The colors the theme needs and their hex values. Variants `success`, `warning`, `error` and `disabled` are required; add the project's own (e.g., `primary`, `secondary`, `brand`).
- The default pen and pencil colors.
- Any custom fonts or text themes.
- Where the theme lives. Default: `src/theme/`, unless the project's conventions say otherwise.

If brand colors are missing, ask the user for them. Never invent brand colors. Utensil provides `gray`; neutral colors may otherwise be chosen and stated as a default for the user to confirm.

Check that `@gobistories/utensil-vue` (it brings `@gobistories/utensil-css` with it) and the FontAwesome peer dependencies (`@fortawesome/fontawesome-svg-core`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/vue-fontawesome`) are installed. Install them if not.

## Step 3: Generate the color scales

For each color, generate its scale with the CLI. It runs on Node:

```bash
npx utensil-generate-color <name> <hex> > src/theme/colors/<name>.css
```

Use basic names (`blue`, `red`) for general-purpose colors and semantic names (`brand`) for specific purposes. Do not edit the generated files by hand.

## Step 4: Create the theme files

Follow SETUP.md sections 2–6, naming everything after the theme (shown here for "Acme"):

- `colors/*.css` — the generated scales (Step 3)
- `text-themes.css` — optional custom text themes and fonts
- `acme-theme.ts` — `AcmeThemeConfig` (colors, variants, text themes, icons), the variant map, text theme classes, default pen and pencil
- `acme-icons.ts` — the icon map: spread `utensilIconMap` first, then add icons imported from their deep FontAwesome paths. Name each key after the icon's role (`logout`), not its glyph.
- `acme-css-include.ts` — imports every color CSS file and the text themes
- `AcmeThemeRoot.vue` — wraps `UtensilThemeRoot` with the theme's configuration and `modal-host`, imports the CSS include, and calls `useUtensilIcons(document.head)`
- `components/Acme<Component>.ts` — typed wrappers (e.g., `export const AcmeButton = UtensilButton<AcmeThemeConfig>`) for the components with theme props the project uses. At minimum: button, icon.

## Step 5: Wire it into the application

1. Make `import '@gobistories/utensil-vue/utensil-layers.css'` the first line of the application entry point (e.g., `main.ts`), before any other import.
2. Wrap the application in the theme root, with user preferences from `useUserThemePreferences` (`@gobistories/utensil-vue/theme/useUserThemePreferences`):

```vue
<template>
  <AcmeThemeRoot :mode="mode" :contrast="contrast" :reduced-motion="reducedMotion">
    <RouterView />
  </AcmeThemeRoot>
</template>

<script setup lang="ts">
import AcmeThemeRoot from './theme/AcmeThemeRoot.vue'
import { useUserThemePreferences } from '@gobistories/utensil-vue/theme/useUserThemePreferences'

const { mode, contrast, reducedMotion } = useUserThemePreferences()
</script>
```

## Step 6: Verify

Run the project's format, lint, typecheck and test commands (see `package.json`) and fix any errors. Confirm a typed wrapper rejects a color that is not in the theme, e.g. `<AcmeButton color="not-a-color" />` fails typecheck.

Report the files created, the variant map, and any colors you defaulted that the user should confirm.
