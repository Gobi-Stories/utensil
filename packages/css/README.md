# @gobistories/utensil-css

> [!WARNING]
> **Internal and unsupported.** Utensil is built for Gobi Stories' own products. Until version 1.0.0 it is not an open
> project: any release may make breaking changes, releases are not announced, and there is no support. Don't depend
> on it.

The Utensil CSS framework: a color system built on three instruments — **pen**, **pencil** and **paper** — plus
scalable design tokens, light and dark mode, high contrast and reduced motion support, cascade layers and layout
utilities. No framework required.

For the Vue 3 theme layer and component library built on it, see `@gobistories/utensil-vue`. It
includes `@gobistories/utensil-css` and forwards its files, so Vue projects install `@gobistories/utensil-vue` alone.

## Install

Utensil is published to its own registry, not to npmjs. Map the `@gobistories` scope to it in your project's
`.npmrc` (npm, pnpm and Bun all read it). Installing needs no credentials.

```ini
@gobistories:registry=https://europe-west1-npm.pkg.dev/gobi-tron-production/npm/
```

```bash
npm install @gobistories/utensil-css
```

## Use

### With a bundler

Import the layer order first, then the rest of the framework:

```ts
import '@gobistories/utensil-css/utensil-layers.css' // must load before any CSS that mentions the layers
import '@gobistories/utensil-css/theme/colors/gray.css'
import '@gobistories/utensil-css/theme/utensil-theme.css'
import '@gobistories/utensil-css/utensil-reset.css'
import '@gobistories/utensil-css/theme/text-themes.css'
import '@gobistories/utensil-css/utensil-utilities.css'
```

Or import everything at once:

```ts
import '@gobistories/utensil-css/utensil.css'
```

### In plain HTML

```html
<!-- utensil.min.css copied from node_modules/@gobistories/utensil-css/dist/ -->
<link rel="stylesheet" href="/utensil.min.css" />
<link rel="stylesheet" href="/colors/blue.css" />

<body class="utensil-calculate utensil-mode blue-pen gray-pencil">
  <button class="my-button">Click Me</button>
</body>
```

`.utensil-calculate` and `.utensil-mode` enable the mode colors and scalable design tokens. The pen and pencil
classes choose the colors, and can be changed on any element to recolor its subtree.

### Style with the instruments

```css
.my-button {
  background: var(--pen-9);
  color: var(--pen-contrast);
  border-radius: var(--radius-3);
  padding: var(--space-2) var(--space-4);
}

.my-button:hover {
  background: var(--pen-10);
}
```

Scale a section of UI with `--scale`:

```html
<div style="--scale: 1.25">…</div>
```

## Files

| Import                                             | Contents                                                       |
| -------------------------------------------------- | -------------------------------------------------------------- |
| `@gobistories/utensil-css/utensil-layers.css`      | Cascade layer order: `@layer utensil, app, utensil-utilities;` |
| `@gobistories/utensil-css/theme/utensil-theme.css` | Mode colors, design tokens, UI variations, theme states        |
| `@gobistories/utensil-css/theme/colors/gray.css`   | The base gray color scale                                      |
| `@gobistories/utensil-css/theme/text-themes.css`   | `ui` and `content` text themes                                 |
| `@gobistories/utensil-css/utensil-reset.css`       | Element reset                                                  |
| `@gobistories/utensil-css/utensil-utilities.css`   | Flex, spacing and shadow utility classes                       |
| `@gobistories/utensil-css/utensil.css`             | All of the above, in order (`utensil.min.css` minified)        |

## Generate color scales

Each color is a 12-step scale with alpha variants for light and dark mode, generated from a single base color with
APCA contrast targets.

```bash
npx utensil-generate-color blue "#0093ee" > src/theme/colors/blue.css
npx utensil-generate-color # without arguments, prints the options (paper anchoring, tint, contrast)
```

The generator runs on Node. It is also available in code:

```ts
import { generateColorCss } from '@gobistories/utensil-css/colors/generate-css'

const css = generateColorCss('blue', '#0093ee')
```

## Documentation

The full guides ship with `@gobistories/utensil-vue` in `docs/`: `USAGE.md` covers the color system, tokens, layers and utilities,
and `SETUP.md` covers building a theme.

## License

MIT © Gobi Stories AS. See [LICENSE.md](./LICENSE.md).
