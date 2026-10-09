# Utensil

> [!WARNING]
> **Internal and unsupported.** Utensil is built for Gobi Stories' own products. Until version 1.0.0 it is not an open
> project: any release may make breaking changes, releases are not announced, and there is no support. Don't depend
> on it.

Utensil is a design system that lets engineers who aren't designers build modern, elegant and accessible
interfaces. It provides:

- **[`@gobistories/utensil-css`](packages/css)** — a pure CSS color system built on three instruments (pen, pencil and paper),
  scalable design tokens, light and dark mode, high contrast and reduced motion support, cascade layers and layout
  utilities. Works with any stack.
- **[`@gobistories/utensil-vue`](packages/vue)** — a Vue 3 theme layer (reactive scoping, semantic variants, typed theme
  configuration) and an extensive library of accessible, themeable components.
- **An AI harness** — usage knowledge and skills shipped inside `@gobistories/utensil-vue`, so coding agents in your project
  build with Utensil the way it is meant to be used.
- **[A reference app](apps/reference)** — every component, with interactive demos, API docs and a theme designer.

```html
<body class="utensil-calculate utensil-mode blue-pen gray-pencil">
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

```vue
<UtensilTheme pen="error" scale="small">
  <MyAlert>Something went wrong.</MyAlert>
</UtensilTheme>
```

## Install

Utensil is published to its own registry, not to npmjs. Map the `@gobistories` scope to it in your project's
`.npmrc` (npm, pnpm and Bun all read it). Installing needs no credentials.

```ini
@gobistories:registry=https://europe-west1-npm.pkg.dev/gobi-tron-production/npm/
```

### CSS only

```bash
npm install @gobistories/utensil-css
```

```ts
import '@gobistories/utensil-css/utensil.css'
```

Generate a color scale from a single base color with `npx utensil-generate-color blue "#0093ee" > colors/blue.css`.
See the [@gobistories/utensil-css README](packages/css/README.md).

### Vue

```bash
npm install @gobistories/utensil-vue vue @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/vue-fontawesome
```

```ts
// main.ts — the layer order must load before any other CSS
import '@gobistories/utensil-vue/utensil-layers.css'
```

```ts
import UtensilButton from '@gobistories/utensil-vue/components/button/UtensilButton.vue'
```

`@gobistories/utensil-vue` brings `@gobistories/utensil-css` with it and forwards its files at the same subpaths (`@gobistories/utensil-vue/utensil-layers.css`,
`@gobistories/utensil-vue/colors/generate-css`, the `utensil-generate-color` command), so a Vue project only deals with
`@gobistories/utensil-vue`.

Components are imported directly by path. There is no barrel file, so your bundler only includes the components you
use, each with only its own CSS. The packages are ESM, built for bundlers such as Vite (`moduleResolution:
"bundler"`).

Create your theme with [SETUP.md](packages/vue/docs/SETUP.md), then build with [USAGE.md](packages/vue/docs/USAGE.md).

## AI harness

`@gobistories/utensil-vue` ships [Agent Skills](https://agentskills.io) in its `skills/` folder, versioned with the package:

| Skill                                    | Purpose                                                              |
| ---------------------------------------- | -------------------------------------------------------------------- |
| `utensil-usage`                          | Background knowledge: loads automatically for Utensil UI work        |
| `/utensil-find-components <needs>`       | Match a design's requirements to Utensil components                  |
| `/utensil-implement-component <Name>`    | Build a project-owned component following Utensil's principles       |
| `/utensil-document-component-api <Name>` | Generate API documentation for a project component                   |
| `/utensil-audit-component <Name>`        | Audit a project component against Utensil's patterns and standards   |
| `/utensil-setup-theme <ThemeName>`       | Create your project's theme: colors, variants, icons and typed roots |

Link them into your project with [skills-npm](https://github.com/antfu/skills-npm):

```bash
npm install -D skills-npm
npx skills-npm setup
```

`setup` adds `skills-npm` to your `prepare` script, so the skills are re-linked from `node_modules` into
`.claude/skills` (and other agents' skill folders) on every install, always matching the installed version of
`@gobistories/utensil-vue`. Commit the links and `skills-npm-lock.json` to share them with your team.

To give your agent Utensil's usage guide in every session, you can also import it in your project's `CLAUDE.md`:

```md
@node_modules/@gobistories/utensil-vue/docs/USAGE.md
```

## Documentation

| Guide                                                        | For                                                   |
| ------------------------------------------------------------ | ----------------------------------------------------- |
| [SETUP.md](packages/vue/docs/SETUP.md)                       | Creating your theme: colors, variants, icons, root    |
| [USAGE.md](packages/vue/docs/USAGE.md)                       | The color system, tokens, components, layers, theming |
| [COMPONENTS.md](packages/vue/docs/COMPONENTS.md)             | The component catalogue                               |
| [DEVELOPMENT.md](packages/vue/docs/DEVELOPMENT.md)           | Building components the Utensil way                   |
| [audit-checklist.md](packages/vue/docs/audit-checklist.md)   | The patterns components are audited against           |
| [docs/DEVELOPMENT-ADDENDUM.md](docs/DEVELOPMENT-ADDENDUM.md) | Building components in this repository                |
| [DEVELOPMENT.md](DEVELOPMENT.md)                             | Working on this repository: build, test, release      |

## License

MIT © Gobi Stories AS. See [LICENSE.md](LICENSE.md).
