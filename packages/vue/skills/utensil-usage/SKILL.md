---
name: utensil-usage
description: Utensil Design System usage knowledge. Use whenever writing, changing or reviewing Vue UI or CSS in a project that uses utensil-vue or utensil-css — pen/pencil/paper color tokens, design tokens, UtensilTheme and theme roots, typed component wrappers, Utensil components, cascade layers and utility classes.
license: MIT
---

# Utensil Usage

This project builds its UI with the Utensil Design System:

- `utensil-css` — the color system (pen, pencil and paper instruments), scalable design tokens, cascade layers and utility classes.
- `utensil-vue` — the Vue 3 theme layer (`UtensilTheme`, theme roots, `useTheme`) and the component library.

Before writing or reviewing UI, read `references/USAGE.md` (in this skill's directory). It is the source of truth for colors, tokens, components, theming, keyboard handling and CSS conventions. For questions about creating or changing the project's theme (colors, variants, icons, text themes, theme root), also read `references/SETUP.md`.

## Conventions

- **Use Utensil components first.** Run `/utensil-find-components <requirements>` to match a design to existing components before building anything new.
- **Import components directly** from the package, e.g. `utensil-vue/components/button/UtensilButton.vue`. There are no barrel files; direct imports keep the bundle tree-shaken.
- **Use the project's typed wrappers** (e.g. `AcmeButton = UtensilButton<AcmeThemeConfig>`) for components with theme props (`color`, `icon`, variants), so values are checked against the project's theme. Create a wrapper when one is missing.
- **Use variant names** (`primary`, `success`, `error`…) rather than concrete color names.
- **Style with tokens**: `--pen-*`, `--pencil-*`, `--paper-*`, `--space-*`, `--radius-*`, `--font-size-*` — never hardcoded colors or sizes. Prefer alpha steps for backgrounds and borders.
- **Layout with utilities, identity in scoped CSS.** Never set the same property in both a utility class and scoped CSS.
- **The layer order loads first**: `import 'utensil-css/utensil-layers.css'` is the first line of the app entry point. If a utility or an override does not apply, check this first.
- **Project components** that Utensil does not provide live in the project's local library (default `src/lib/components/<feature>/<Name>.vue`, or the path in the project's CLAUDE.md). Build them with `/utensil-implement-component`, document them with `/utensil-document-component-api`, and audit them with `/utensil-audit-component`.
- **Never modify `node_modules/utensil-vue` or `node_modules/utensil-css`.** Component source and `<Name>Doc.vue` API docs can be read there (`node_modules/utensil-vue/src/components/`) for reference.
