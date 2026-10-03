---
name: utensil-implement-component
description: Implement a generic component in this project's local component library following Utensil Design System principles. Use when a project using utensil-vue needs a reusable UI component that Utensil does not provide.
license: MIT
argument-hint: <ComponentName> <description>
---

# Implement Component

Create a production-grade generic component in the consumer project's local component library, following Utensil Design System principles, patterns, and conventions.

Use this when the project needs a component that is not in Utensil. The result is a component usable today, and a candidate for upstreaming to Utensil later if it matures into a reusable primitive.

## Arguments

- `ComponentName`: PascalCase name (e.g., "UserAvatar", "SidebarItem"). Do not use the `Utensil` prefix — consumer components are project-owned. If the project uses its own prefix (e.g., `Acme`), keep it.
- `description`: What the component does and its key requirements

## Step 1: Determine the component directory

Default path: `src/lib/components/<feature>/<ComponentName>.vue`

`<feature>` is the kebab-case form of the component name (e.g., `UserAvatar` → `user-avatar/`). Group related components together in the same feature directory (e.g., `side-menu/SideMenu.vue` and `side-menu/SideMenuItem.vue`).

If the project's CLAUDE.md specifies a different path convention for local library components, follow that instead.

Do NOT add to barrel files — components are imported directly for tree-shaking.

Prefer composing and extending Utensil components over duplicating their code. Run `/utensil-find-components` or check `node_modules/utensil-vue/src/components/` for existing primitives before implementing from scratch. Import Utensil components from the package (`utensil-vue/components/<feature>/Utensil<Name>.vue`). Never modify files in `node_modules/utensil-vue/`.

## Step 2: Read the Utensil principles

Read and follow the Utensil contributing guide, `references/DEVELOPMENT.md` (in this skill's directory). It covers design tokens, theme integration, accessibility, composition patterns, and all conventions that make a component production-grade. Its file locations and the `Utensil` prefix apply to Utensil's own components; for this project use the location from Step 1 and the project's own naming.

Also read `references/USAGE.md` for how the project consumes Utensil (typed wrappers, tokens, cascade layers).

Apply these principles on the first pass — they are the quality bar, not a post-hoc fix list.

## Step 3: Implement the component

Follow the patterns in the guide. Key areas to get right on the first pass:

- **Design tokens** — use `--pen-*`, `--pencil-*`, `--space-*`, `--radius-*`, etc. for all spacing, sizing, and color. No hardcoded values.
- **Accessibility** — support `.utensil-high-contrast` and `.utensil-reduced-motion`. Provide `:focus-visible` focus styles for interactive elements. Use semantic HTML where possible; add ARIA attributes for non-semantic interactive elements.
- **Theme integration** — use `useTheme` only if the component changes pen/pencil/scale via props. Use `ColorProp<Theme>`, `IconProp<Theme>`, `ScaleProp` on theme-typed props with the `Theme extends ThemeConfig` generic.
- **UI variations** — if the component supports variations, use the `UtensilUIVariation` type and shared `ui-<variation>` classes from `utensil-css/theme/utensil-theme.css`.
- **Composition** — for composite components, use `provide`/`inject` for built-in children and expose the same API via slot scope for custom children.
- **CSS cvars** — namespace with the component name (e.g., `--user-avatar-size`) and fall back to design tokens.

Consumer components do NOT use the `Utensil` prefix unless the project convention dictates otherwise.

## Step 4: Write a unit test

Write a vitest unit test alongside the component file with a `.test.ts` suffix. Test the component's behaviour (props, slots, events, classes, emitted events) — not implementation details.

## Step 5: Document the component API

Run `/utensil-document-component-api <ComponentName>`.

This creates an adjacent `<ComponentName>Doc.vue` file documenting props, events, slots, exposed members, and CSS cvars.

## Step 6: Verify

Run the consumer project's verification commands. Check the project's `package.json` for the correct commands. Typically:

- `format`
- `lint`
- `typecheck`
- `test`

Fix any errors related to your work.

## Step 7: Audit

Run `/utensil-audit-component <ComponentName>` in a sub-agent (without `--fix`). Review the recommendations and apply the ones that genuinely improve the component. Re-run verification if you make changes.
