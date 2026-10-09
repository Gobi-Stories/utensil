# Utensil

Utensil is a design system published as two npm packages, with a reference app and an AI harness:

- `packages/css` — **@gobistories/utensil-css**: the framework-agnostic CSS (cascade layers, reset, pen/pencil/paper color theme, scalable tokens, text themes, utilities), the color scale generator (`src/colors/`) and the `utensil-generate-color` CLI (`src/bin/`)
- `packages/vue` — **@gobistories/utensil-vue**: the Vue 3 theme layer (`src/theme/`), components (`src/components/`), composables, lib utilities and theme editor; its docs (`docs/`) and the consumer skills (`skills/`) ship in the package
- `apps/reference` — the reference app showcasing every component; it imports the packages as a consumer does (`@gobistories/utensil-vue/...`, `@gobistories/utensil-css/...`)
- `fixtures/consumer` — a fresh consumer app used by `bun run verify:package` to test the packed tarballs
- `.claude/` — this harness (maintainer skills); `docs/STANDARDS.md` — repository development standards

## Knowledge

Read the guide that matches the task before starting:

| Task                                              | Read                                                                                                                                                   |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Using the color system, tokens, theme, components | `packages/vue/docs/USAGE.md`                                                                                                                           |
| Creating or changing a theme                      | `packages/vue/docs/SETUP.md`                                                                                                                           |
| Building or changing a component                  | `packages/vue/docs/DEVELOPMENT.md` with `docs/DEVELOPMENT-ADDENDUM.md`; `packages/vue/docs/audit-checklist.md` with `docs/audit-checklist-addendum.md` |
| Finding an existing component                     | `packages/vue/docs/COMPONENTS.md` (catalogue)                                                                                                          |
| Code standards, naming, testing, commits          | `docs/STANDARDS.md`                                                                                                                                    |
| The reference app                                 | `apps/reference/DEVELOPMENT.md`                                                                                                                        |
| Repo layout, builds, packaging, releases          | `DEVELOPMENT.md` (repository root)                                                                                                                     |

Importing a module must never do work: no I/O, listeners, timers or reactive effects at module scope. State is created when a function is first called. See `docs/STANDARDS.md` → Module Scope; `packages/vue/src/no-import-side-effects.test.ts` enforces it.

## Consumer Compatibility

Both packages are used by other projects, installed from Utensil's own registry (`DEVELOPMENT.md` → Releasing). Everything a consumer can import or target is public API: module paths (`@gobistories/utensil-vue/components/<feature>/Utensil<Name>.vue`), exported names and types, props, events, slots, component root classes (`.utensil-<name>`), CSS cvars (`--utensil-<component>-*`), and `@gobistories/utensil-css` class, layer and token names. `@gobistories/utensil-vue` forwards every public `@gobistories/utensil-css` file at the same subpath (CSS `@import` forwards, generator re-exports, the CLI) so Vue apps depend on `@gobistories/utensil-vue` alone — add a forward when `@gobistories/utensil-css` gains a public file. No barrel files — every module is a deep import so consumers can tree-shake.

What a change to the public API may do depends on the current version (`packages/vue/package.json`):

- **Below 1.0.0** — Utensil is closed: only our own products use it, so breaking changes are allowed. Make them when the design needs them, rather than keeping a worse API for compatibility.
- **1.0.0 and above** — Utensil is open source: keep changes additive.

Either way, call out anything breaking in the commit message so it reaches the release notes.

## Skills

Components in `packages/vue/src/components`:

- `/implement-component <ComponentName> <description>` — create a new component
- `/update-component <ComponentName> <description>` — update an existing component
- `/find-components <requirements>` — find suitable components for a design
- `/promote-local <path> [ComponentOrComposable ...]` — promote a consumer's local Utensil folder (new components, wrappers, vendored fixes) into `@gobistories/utensil-vue`

Reference app in `apps/reference`:

- `/update-reference-app <description>` — update the reference application
- `/implement-showcase-component <ComponentName> <description>` — implement a component and add a showcase demo

Documentation and audit:

- `/document-component-api <ComponentName>` — create or update a component's `Doc.vue` API documentation
- `/document-component-section <Page>` — document all components on a reference page
- `/document-components` — document all components across all reference pages
- `/audit-component <ComponentName> [--fix] [--rule number] | --rules` — audit a component against the checklist
- `/audit-component-section <Page> [--fix] [--rule number]` — audit all components on a reference page
- `/audit-components` — audit all components across all reference pages
- `/summarize-component <ComponentName>` — summarize a component for the catalogue
- `/summarize-component-section <Page>` — summarize all components on a reference page
- `/summarize-components` — rebuild `packages/vue/docs/COMPONENTS.md`

Releases (only when the maintainer asks):

- `/release [patch | minor | major | x.y.z]` — walk the maintainer through releasing both packages to npm

Design reference bundle (needs the reference app running at `http://localhost:12911`):

- `/bundle-design-reference` — harvest the reference app into a static HTML+CSS bundle in `temp/`
- `/bundle-reference-section <SectionName>` — harvest one reference page

Consumer-facing skills (`utensil-usage`, `utensil-find-components`, `utensil-implement-component`, `utensil-document-component-api`, `utensil-audit-component`, `utensil-setup-theme`) live in `packages/vue/skills/` and ship in the npm package for projects that use Utensil. They are written for any consumer project, not this repository, and leave where components live and how they are named to the project. The build copies the relevant docs into each skill's `references/`.

Shared knowledge, one source: the docs in `packages/vue/docs/` ship to consumers, so they hold only what applies wherever a component is built (no repository paths, reference app or maintainer workflow). This repository's specifics live in `docs/DEVELOPMENT-ADDENDUM.md` and `docs/audit-checklist-addendum.md`. A maintainer skill with a shipped counterpart (`/audit-component`, `/document-component-api`) follows the shipped `SKILL.md` and adds only what differs here; never copy its text.

## Project Scripts

Run from the repository root:

- `./check` — format, lint, typecheck and test everything
- `bun run format`, `bun run lint`, `bun run typecheck`, `bun run test`
- `bun run dev` — reference app at `http://localhost:12911` (or `docker compose up utensil-reference`)
- `bun run build` — build both packages
- `bun run verify:package` — pack both packages, install them into a fresh consumer and check types, build and tree-shaking
- `bun run release` — see `DEVELOPMENT.md`, or `/release` for the guided walkthrough. Only when explicitly asked: releases are cut on a cadence and may bundle several changes, so never bump versions or release as part of a task.

You _MUST_ use `bun run test` (or `./check`) and _NOT_ `bun test`.
You _MUST_ use `bun run typecheck` and _NOT_ `npx vue-tsc --noEmit`.
