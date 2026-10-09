---
name: utensil-implement-component
description: Implement a new component following Utensil Design System principles, with a unit test and API documentation. Use when a project using @gobistories/utensil-vue needs a UI component that Utensil does not provide.
license: MIT
argument-hint: <ComponentName> <description>
---

# Implement Component

Create a production-grade component following Utensil Design System principles, patterns, and conventions: tested, documented and audited.

Use this when the project needs a component that is not in Utensil. A component built this way also meets Utensil's bar for contributions, should the project ever want to contribute it.

## Arguments

- `ComponentName`: PascalCase name (e.g., "UserAvatar", "SidebarItem"), with whatever prefix the project's conventions give it.
- `description`: What the component does and its key requirements

## Step 1: Determine where the component goes

Where the component lives and how it is named are the project's decisions. Take them from, in order:

1. The user's request, if it names a location.
2. The project's conventions, including where its existing components live.
3. Otherwise, ask the user.

Put the component in a directory named after its feature in kebab-case (e.g., `UserAvatar` → `user-avatar/`), and group related components together (e.g., `side-menu/SideMenu.vue` and `side-menu/SideMenuItem.vue`).

Do NOT add to barrel files — components are imported directly for tree-shaking.

Prefer composing and extending Utensil components over duplicating their code. Run `/utensil-find-components` or check `node_modules/@gobistories/utensil-vue/src/components/` for existing primitives before implementing from scratch. Import Utensil components from the package (`@gobistories/utensil-vue/components/<feature>/Utensil<Name>.vue`). Never modify files in `node_modules/@gobistories/utensil-vue/`.

## Step 2: Read the Utensil principles

Read and follow Utensil's component guide, `references/DEVELOPMENT.md` (in this skill's directory). It covers design tokens, theme integration, accessibility, composition patterns, and all conventions that make a component production-grade.

Also read `references/USAGE.md` for how the project consumes Utensil (typed wrappers, tokens, cascade layers).

Apply these principles on the first pass — they are the quality bar, not a post-hoc fix list.

## Step 3: Implement the component

Follow the patterns in the guide. Key areas to get right on the first pass:

- **Design tokens** — use `--pen-*`, `--pencil-*`, `--space-*`, `--radius-*`, etc. for all spacing, sizing, and color. No hardcoded values.
- **Accessibility** — support `.utensil-high-contrast` and `.utensil-reduced-motion`. Provide `:focus-visible` focus styles for interactive elements. Use semantic HTML where possible; add ARIA attributes for non-semantic interactive elements.
- **Theme integration** — use `useTheme` only if the component changes pen/pencil/scale via props. Use `ColorProp<Theme>`, `IconProp<Theme>`, `ScaleProp` on theme-typed props with the `Theme extends ThemeConfig` generic.
- **UI variations** — if the component supports variations, use the `UtensilUIVariation` type and shared `ui-<variation>` classes from the Utensil theme CSS (`@gobistories/utensil-vue/theme/utensil-theme.css`).
- **Composition** — for composite components, use `provide`/`inject` for built-in children and expose the same API via slot scope for custom children.
- **CSS cvars** — namespace with the component name (e.g., `--user-avatar-size`) and fall back to design tokens.

## Step 4: Write a unit test

Write a vitest unit test alongside the component file with a `.test.ts` suffix. Test the component's behaviour (props, slots, events, classes, emitted events) — not implementation details.

## Step 5: Document the component API

Run `/utensil-document-component-api <path to the component>`.

This creates an adjacent `<ComponentName>Doc.vue` file documenting props, events, slots, exposed members, and CSS cvars.

## Step 6: Verify

Run the consumer project's verification commands. Check the project's `package.json` for the correct commands. Typically:

- `format`
- `lint`
- `typecheck`
- `test`

Fix any errors related to your work.

## Step 7: Audit

Run `/utensil-audit-component <path to the component>` (without `--fix`), in a sub-agent if your agent supports one. Review the recommendations and apply the ones that genuinely improve the component. Re-run verification if you make changes.
