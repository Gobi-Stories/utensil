# Utensil

Utensil is a design system published as two npm packages, with a reference app and an AI harness:

- `packages/css` — **utensil-css**: the framework-agnostic CSS (cascade layers, reset, pen/pencil/paper color theme, scalable tokens, text themes, utilities), the color scale generator (`src/colors/`) and the `utensil-generate-color` CLI (`src/bin/`)
- `packages/vue` — **utensil-vue**: the Vue 3 theme layer (`src/theme/`), components (`src/components/`), composables, lib utilities and theme editor; its docs (`docs/`) and the consumer skills (`skills/`) ship in the package
- `apps/reference` — the reference app showcasing every component; it imports the packages as a consumer does (`utensil-vue/...`, `utensil-css/...`)
- `fixtures/consumer` — a fresh consumer app used by `bun run verify:package` to test the packed tarballs
- `.claude/` — this harness (maintainer skills); `docs/STANDARDS.md` — repository development standards

## Knowledge

Read the guide that matches the task before starting:

| Task                                              | Read                                                                       |
| ------------------------------------------------- | -------------------------------------------------------------------------- |
| Using the color system, tokens, theme, components | `packages/vue/docs/USAGE.md`                                               |
| Creating or changing a theme                      | `packages/vue/docs/SETUP.md`                                               |
| Building or changing a component                  | `packages/vue/docs/DEVELOPMENT.md`, `packages/vue/docs/audit-checklist.md` |
| Finding an existing component                     | `packages/vue/docs/COMPONENTS.md` (catalogue)                              |
| Code standards, naming, testing, commits          | `docs/STANDARDS.md`                                                        |
| The reference app                                 | `apps/reference/DEVELOPMENT.md`                                            |
| Repo layout, builds, packaging, releases          | `DEVELOPMENT.md` (repository root)                                         |

## Consumer Compatibility

Both packages are used by other projects through npm. Everything a consumer can import or target is public API: module paths (`utensil-vue/components/<feature>/Utensil<Name>.vue`), exported names and types, props, events, slots, component root classes (`.utensil-<name>`), CSS cvars (`--utensil-<component>-*`), and utensil-css class, layer and token names. `utensil-vue` forwards every public `utensil-css` file at the same subpath (CSS `@import` forwards, generator re-exports, the CLI) so Vue apps depend on `utensil-vue` alone — add a forward when `utensil-css` gains a public file. Keep changes additive; call out anything breaking so it reaches the release notes. No barrel files — every module is a deep import so consumers can tree-shake.

## Skills

Components in `packages/vue/src/components`:

- `/implement-utensil-component <ComponentName> <description>` — create a new component
- `/update-utensil-component <ComponentName> <description>` — update an existing component
- `/find-utensil-components <requirements>` — find suitable components for a design

Reference app in `apps/reference`:

- `/update-reference-app <description>` — update the reference application
- `/implement-showcase-component <ComponentName> <description>` — implement a component and add a showcase demo

Documentation and audit:

- `/document-component-api <ComponentName>` — create or update a component's `Doc.vue` API documentation
- `/document-component-section <Page>` — document all components on a reference page
- `/document-utensil-components` — document all components across all reference pages
- `/audit-components <ComponentName> [--fix] [--rule number] | --rules` — audit a component against the checklist
- `/audit-component-section <Page> [--fix] [--rule number]` — audit all components on a reference page
- `/audit-utensil-components` — audit all components across all reference pages
- `/summarize-component <ComponentName>` — summarize a component for the catalogue
- `/summarize-component-section <Page>` — summarize all components on a reference page
- `/summarize-utensil-components` — rebuild `packages/vue/docs/COMPONENTS.md`

Design reference bundle (needs the reference app running at `http://localhost:12911`):

- `/bundle-design-reference` — harvest the reference app into a static HTML+CSS bundle in `temp/`
- `/bundle-reference-section <SectionName>` — harvest one reference page

Consumer-facing skills (`utensil-usage`, `utensil-find-components`, `utensil-implement-component`, `utensil-document-component-api`, `utensil-audit-component`, `utensil-setup-theme`) live in `packages/vue/skills/` and ship in the npm package for projects that use Utensil. They are written for a consumer project, not this repository. The build copies the relevant docs into each skill's `references/`.

## Project Scripts

Run from the repository root:

- `./check` — format, lint, typecheck and test everything
- `bun run format`, `bun run lint`, `bun run typecheck`, `bun run test`
- `bun run dev` — reference app at `http://localhost:12911` (or `docker compose up utensil-reference`)
- `bun run build` — build both packages
- `bun run verify:package` — pack both packages, install them into a fresh consumer and check types, build and tree-shaking
- `bun run release` — see `DEVELOPMENT.md`

You _MUST_ use `bun run test` (or `./check`) and _NOT_ `bun test`.
You _MUST_ use `bun run typecheck` and _NOT_ `npx vue-tsc --noEmit`.
