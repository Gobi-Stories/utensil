# Developing Utensil

This repository is a [bun](https://bun.sh) workspace holding the two published packages, the reference app and the
AI harness.

```
packages/css/            @gobistories/utensil-css: base CSS, theme CSS, color generator and CLI
packages/vue/            @gobistories/utensil-vue: components, composables, theme, theme editor
  docs/                  usage, setup, development guides, component catalogue, audit checklist (shipped)
  skills/                consumer agent skills (shipped)
apps/reference/          the reference app (private)
fixtures/consumer/       a fresh consumer app, installed from the packed tarballs by verify:package
scripts/                 workspace scripts: source aliases, package verification, release
docs/STANDARDS.md        development standards for this repository
.claude/                 the maintainer AI harness: knowledge router and skills
```

## Setup

```bash
bun install
```

## Scripts

Run from the repository root.

| Script                    | Does                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| `./check`                 | Format, lint, typecheck and test everything. Run before every commit                        |
| `bun run dev`             | Serve the reference app at http://localhost:12911                                           |
| `bun run build`           | Build `@gobistories/utensil-css` then `@gobistories/utensil-vue` into their `dist/` folders |
| `bun run build:reference` | Build the packages, then the reference app against their `dist/` output                     |
| `bun run test`            | Run all tests (use this, not `bun test`)                                                    |
| `bun run typecheck`       | Typecheck all projects (use this, not `npx vue-tsc --noEmit`)                               |
| `bun run verify:package`  | Build, pack and install both packages into a fresh consumer app and check it                |
| `bun run release <bump>`  | Prepare a release (see below)                                                               |

Generate a color scale in the repository with
`bun run --filter @gobistories/utensil-css generate-color <name> <hex> [options] > path/to/<name>.css`.

## The reference app

```bash
bun run dev
# or
docker compose up utensil-reference
```

Both serve at http://localhost:12911 (set `UTENSIL_REFERENCE_PORT` to change the Docker port). In development the
reference app resolves `@gobistories/utensil-vue/...` and `@gobistories/utensil-css/...` imports to the workspace source
(`scripts/source-aliases.ts`), so changes to the packages hot-reload. Production builds resolve the packages through
their `exports` to `dist/`, exactly as consumers do, so the reference app is also a full consumer of the published
output:

```bash
docker compose --profile product up --build utensil-reference-product   # http://localhost:12912
```

See [apps/reference/DEVELOPMENT.md](apps/reference/DEVELOPMENT.md) for adding pages and demos.

## How the packages are built

**@gobistories/utensil-css** ships its CSS files as source (`src/**/*.css`) behind subpath exports, plus `dist/utensil.css` and
`dist/utensil.min.css` bundling them in load order. The color generator and the `utensil-generate-color` CLI are
compiled to ESM with declarations.

**@gobistories/utensil-vue** is compiled by Vite in library mode with `preserveModules`: every module, component and API doc
component is its own file in `dist/`, and each compiled component imports only its own CSS
(`vite-plugin-lib-inject-css`). Consumers import by deep path (`@gobistories/utensil-vue/components/button/UtensilButton.vue`),
so bundlers include only what is used. `vue-tsc` emits the declarations, keeping the components' `Theme` generics, so
typed wrappers (`UtensilButton<AcmeThemeConfig>`) work. `@gobistories/utensil-css` and the peer dependencies stay external, except
`?inline` CSS imports, which are inlined as strings for `utensil-css-inline`.

`@gobistories/utensil-vue` forwards `@gobistories/utensil-css` so a Vue project depends on `@gobistories/utensil-vue` alone: each base CSS file has a
one-line `@import` forward at the same subpath (`packages/vue/src/utensil-layers.css`, `src/theme/utensil-theme.css`,
…), `src/colors/{colors,generate-colors,generate-css}.ts` re-export the generator, and `bin/generate-color.js`
forwards the CLI. `verify:package` installs the Vue fixture with an isolated linker, so anything a Vue app reaches
must be forwarded rather than found by hoisting. Add a forward when `@gobistories/utensil-css` gains a public file.

The package also ships its readable `src/` (minus tests) for agents and source maps, `docs/`, and `skills/`. The
build copies the docs each skill needs into `skills/<name>/references/` (`scripts/build-skills.ts`).

Because declarations are emitted from the components, a generic component exports its props interface:
`export interface Props<Theme extends ThemeConfig>`, used as `defineProps<Props<Theme>>()`, along with any local
types it references. See [docs/DEVELOPMENT-ADDENDUM.md](docs/DEVELOPMENT-ADDENDUM.md).

## Compatibility

Consumers depend on the public surface: deep import paths, component names and root class names, CSS variables and
cvars, cascade layer names, exported types and composables. Treat a change to any of these as breaking.

Until 1.0.0, Utensil is closed: only our own products use it, and breaking changes are allowed. A breaking release
bumps the minor version (`0.1.x` → `0.2.0`); everything else bumps the patch. From 1.0.0, when Utensil is open
sourced, changes are additive and a breaking change is a major release.

## Releasing

The packages are published to a public npm repository in Google Artifact Registry, not to npmjs:

```
https://europe-west1-npm.pkg.dev/gobi-tron-production/npm/
```

Anyone can install from it without credentials, once the `@gobistories` scope is mapped to it in their `.npmrc`.
Publishing needs a Google account with write access to the repository. Both packages set `publishConfig.registry`, so a
publish can't go to npmjs by mistake.

`@gobistories/utensil-css` and `@gobistories/utensil-vue` share one version and are released together:

```bash
bun run release patch   # or minor, major, or an explicit x.y.z
```

The release script requires a clean working tree. It bumps every workspace package to the new version, runs
`./check` and `verify:package`, then packs both packages into `temp/release/`. Review the tarballs, then commit, tag
and publish with the commands it prints. `bun pm pack` replaces `@gobistories/utensil-vue`'s `workspace:*` dependency
on `@gobistories/utensil-css` with the exact release version.

Publishing authenticates with a short-lived token that `npx google-artifactregistry-auth` writes to `~/.npmrc`, made
for an account with write access to the repository:

```bash
CLOUDSDK_CORE_ACCOUNT=<account> env -u GOOGLE_APPLICATION_CREDENTIALS npx google-artifactregistry-auth
```

`CLOUDSDK_CORE_ACCOUNT` picks the account for this command alone, so gcloud's active account can stay a development
account without write access (add the publishing account with `gcloud auth login <account> --no-activate`). The tool
prefers Application Default Credentials, hence `env -u GOOGLE_APPLICATION_CREDENTIALS`. Remove the token after
publishing: the registry rejects a request carrying an expired token rather than treating it as anonymous, so a stale
token breaks every install from it on that machine.

In Claude Code, `/release` walks you through the whole process: choosing the version, the script, reviewing the
tarballs, the commit and tag, then hands you the publish and `git push` steps and verifies the result.

## AI harness

- `.claude/CLAUDE.md` routes maintainers (and their agents) to the right knowledge and lists the internal skills.
- `packages/vue/skills/` holds the consumer skills shipped in the npm package. They read their docs from
  `references/`, generated at build from `packages/vue/docs/`.

## Standards

Follow [docs/STANDARDS.md](docs/STANDARDS.md). Commit messages take the form `<area>: <feature>: <message>`, e.g.
`vue: button: support icon-only round buttons`.
