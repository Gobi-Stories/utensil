# Utensil Reference

@../DEVELOPMENT.md

Standalone showcase and reference application for Utensil. Displays all Utensil components with interactive demos and API documentation.

The app is a private workspace package that uses `@gobistories/utensil-css` and `@gobistories/utensil-vue` exactly as a consumer would, through package imports (`@gobistories/utensil-vue/components/<feature>/Utensil<Name>.vue`, `@gobistories/utensil-css/utensil-layers.css`). In dev and tests those imports resolve to the workspace source (`packages/*/src`) for hot reload; production builds (`bun run build:reference`) resolve them to the packages' built `dist/`, the same files consumers install.

Maintainer skills and the repository router are in the root `.claude/` — see `.claude/CLAUDE.md` for the full set.

## Project Scripts

Run from the repository root:

- `bun run dev` — serve the app at `http://localhost:12911` (or `docker compose up utensil-reference`)
- `./check` — format, lint, typecheck and test
- `bun run build:reference` — build the packages, then the app

You _MUST_ use `bun run typecheck` and _NOT_ `npx vue-tsc --noEmit`.
You _MUST_ use `bun run test` and _NOT_ `bun test`.
