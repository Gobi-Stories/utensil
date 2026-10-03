---
name: update-utensil-component
description: Update an existing component in the Utensil component library
argument-hint: <ComponentName> <description>
---

# Update Utensil Component

Update a production-grade Utensil component with changes.

## Arguments

- `ComponentName`: PascalCase name (e.g., "Dropdown" or "UtensilDropdown")
- `description`: What changes to make

## File Location

Components are located at:

- Utensil primitives: `packages/vue/src/components/<feature>/<Prefix><ComponentName>.vue`

## Utensil Development Guide

Read and follow the Utensil contributing guide for all component patterns, conventions, and standards, plus the repository's development standards:

@../../../packages/vue/docs/DEVELOPMENT.md
@../../../docs/STANDARDS.md

## Consumer Compatibility

Utensil is published to npm and used by other projects. Treat the component's file path, props, events, slots, root class, CSS cvars and exported types as public API. Prefer additive changes; if a breaking change is unavoidable, call it out to the user so it can be noted in the release.

## Unit Tests

Update or write a vitest unit test for the component alongside the component file(s) in the same directory, with a `.test` suffix.

## API Documentation

Update the adjacent doc file with your changes. The file will be named `<ComponentName>Doc.vue` and located in the same directory as the component.

Read (don't use) the document-component-api skill to see the API documentation template.

If no document file exists, create one.

If the component's summary changes, update its row in `packages/vue/docs/COMPONENTS.md`.

## Utensil Reference Application

If implementing or updating a reference demo see @../../../apps/reference/DEVELOPMENT.md for notes about the reference application.

## Steps

1. Make the requested changes following the contributing guide above.
2. Update the Reference application if there are new features to demonstrate (or features were removed).
3. From the repository root, run `./check` (format, lint, typecheck, test) and `bun run verify:package`. Fix any errors related to your work.
