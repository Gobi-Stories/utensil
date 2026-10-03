# Development Standards

Standards for all code in the Utensil repository. Component-specific patterns (tokens, theme integration, accessibility, composition) live in the contributing guide at `packages/vue/docs/DEVELOPMENT.md`.

Apply SOLID principles throughout.

## Naming

| Symbol            | Convention         |
| ----------------- | ------------------ |
| Instance Variable | `lowerCamelCase`   |
| Interface Names   | `UpperCamelCase`   |
| Static Modules    | `UpperCamelCase`   |
| Properties        | `lowerCamelCase`   |
| Static Constants  | `UPPER_SNAKE_CASE` |

- Use expressive names.
- Avoid abbreviations (`btn`, `idx`) unless colloquial outside of coding (`url`, `id`, `rgb`) or mathematical (`x`, `y`, `i`, `n`).
- Avoid generic names like `callback` or `handler` unless explicitly abstract.
- Don't add symbol type abbreviations to names — the type is self-evident from context. No `Fn`/`Function` suffixes on functions, no `I` prefix on interfaces, no `T` prefix on type parameters, etc.
- Name type parameters with the same expressiveness as value parameters: `<Theme>` not `<T>`, `<Element>` not `<E>`. Single letters are acceptable only for mathematical generics (`T` in a truly unconstrained generic container, `K`/`V` in a map).
- Avoid prefixing names with their type.
- Don't suffix return type names with `Result` if the rest of the name is already a sufficient noun.

## Code Organization

- Organize by feature, not by type: a component directory (`components/<feature>/`) holds the component, its children, its helpers, its test and its API doc.
- Shared code is promoted rather than reached into: vanilla TypeScript utilities to `packages/vue/src/lib/<package>/`, Vue composables to `packages/vue/src/composables/`, color generation to `packages/css/src/colors/`.
- Use kebab-case filenames with a feature prefix: `tabs/utensil-tabs.ts` not `tabs/context.ts`. Vue components use PascalCase with the `Utensil` prefix.
- Types and injection keys go in a file named after the feature: `tabs/utensil-tabs.ts`.

## Barrel Files

- Do not use barrel files. Every module is a public deep import (`utensil-vue/components/button/UtensilButton.vue`) so consumers' bundlers can tree-shake everything they don't use.

## Public API

Both packages are published to npm. A module's path, its exported names and types, a component's props, events, slots, root class and CSS cvars, and the CSS class and variable names in `utensil-css` are all public API.

- Prefer additive changes.
- Never rename or move a public module, class or cvar without calling it out as a breaking change for the release.

## Interface Design

- Design interfaces around what we need, not what libraries provide.
- Name interfaces by responsibility, implementations by how they work.
- Create adapters for third-party SDKs and platform APIs. Pure utility libraries may be used directly.
- Define types where they are implemented. Do not create local single-use interfaces to wrap a dependency — depend on the implementation's type directly.
- Do not use `Pick<>` to narrow dependency types in function signatures. Depend on the concrete type directly.
- Accept the specific type you need, not a grab-bag object that happens to contain it. If you need a URL, accept a `string` — not a config object or `Pick<Config, 'url'>`.
- Functions and constructors accept dependencies as individual typed parameters, not as a single options/dependencies object. Optional behaviour flags may be grouped in an options object.

## Error Handling

- Validate at boundaries (user input, storage, remote responses).
- Validate data as a separate concern from checking or using it. Guard the shape first, then use the narrowed value.
- Fail fast with clear error messages.
- Define domain errors as classes extending `Error`. Use `instanceof` to determine handling.
- Never swallow errors without meaningful handling.

## TypeScript

- Use `unknown` instead of `any`. Fix types with validators rather than type assertions.
- Type assertions (`as string`, `as number`, etc.) are a code smell indicating a missing type guard. Validate first with `typeof` or a type predicate (`value is Type`), then use the narrowed value — never cast past `unknown`.
- Use `as const` for literal types and `satisfies` to validate object shapes.
- Treat all external input (storage, parsed values, remote responses) as `unknown` and validate with type guards:
  ```ts
  function isThemeMode(value: unknown): value is ThemeMode {
    return value === 'light' || value === 'dark'
  }
  ```

## Testing

- Use vitest. Component tests use `@vue/test-utils` with jsdom.
- Test behaviour, not implementation: props, slots, events, classes and keyboard interaction. Mock at boundaries only (browser APIs jsdom lacks, timers).
- Unit tests are co-located with source: `<name>.test.ts`.
- Never perform real I/O.
- Run tests with `bun run test` (or `./check`), never `bun test`.

## Comments

- Avoid comments where code is self-explanatory through naming and structure.
- Do comment when code is counter-intuitive, provides backwards compatibility, or works around external issues (browser, library).
- Never comment out code then commit it — we have git history. Remove the code if it is unused.
- Comment the present state, not the change that produced it. No "now works", "no longer needed", "changed from X", "previously…". A comment is read in the present tense by someone who never saw the prior version; the change itself belongs in the commit message.

## Git Conventions

Commit messages name the area and feature:

```
<area>: <feature>: <message>
```

Areas: `css`, `vue`, `reference`, `harness` (AI knowledge and skills), `repo` (tooling, build, release).

Examples: `vue: tabs: keep focus on the active trigger after removal`, `css: utilities: add align-self utilities`.

- Keep commits atomic — the codebase should not be knowingly broken at any commit.
- Avoid meaningless commit messages. Use `git commit --amend` or a fixup for small corrections.

## Module Scope

Importing a module must never do work. Module scope holds declarations only: imports and exports, types, functions
and classes, constants of literal values, simple instantiations (`new Map()`, `Symbol()`), and `let` caches that start
empty.

Never at module scope, directly or through a call:

- I/O: `localStorage` and `sessionStorage`, cookies, network, the DOM (`document`, `window`), `matchMedia`, `navigator`
- listeners, timers and observers
- reactive effects (`watch`, `watchEffect`, `effectScope`) and refs initialised from any of the above

Work runs when a function is called. State shared across callers is created by the first call and cached:

```ts
let preferences: UserThemePreferences | undefined

export function useUserThemePreferences(): UserThemePreferences {
  // A detached scope keeps the watchers alive beyond the component that first calls this
  preferences ??= effectScope(true).run(createPreferences)!
  return preferences
}
```

Create shared Vue effects inside a detached `effectScope(true)`. Created lazily without one, they belong to the first
component that calls the function and stop when it unmounts.

Entry points (an app's `main.ts`, a CLI `bin`) are the only exception: starting work is their job.

Why: an import that does work runs before its importer can prepare for it (a consumer migrating stored settings can't
run before a module that reads them on import), runs in every test and SSR context that merely imports it, and can't
be tree-shaken.

Enforced: `packages/vue/src/no-import-side-effects.test.ts` imports every module and fails if Utensil code touches
storage, listeners, `matchMedia` or timers on import.

## Do's & Don'ts

**Do:**

- Include the feature name in filenames so IDE tabs are distinguishable
- Export specifically named symbols rather than `default` (Vue single-file components excepted)
- Pass minimum information to functions, constructors, and component props — request only what is needed

**Don't:**

- Do work at module scope (see Module Scope)
- Execute I/O in constructors or factory functions
- Rely on non-constant global variables
- Add additional boolean flags when presence/absence of a value suffices
- Use dangling conditionals — always use braces and a new line
