---
name: implement-component
description: Implement a new component for the Utensil component library
argument-hint: <ComponentName> <description>
---

# Implement Utensil Component

Create a production-grade Utensil component in `@gobistories/utensil-vue`.

First confirm the answer to these questions:
@../../QUESTIONS.md

## Arguments

- `ComponentName`: PascalCase name (e.g., "Dropdown" or "UtensilDropdown")
- `description`: What the component does and key requirements

## Step 1: Determine the component directory

Choose based on the component's nature:

| Category                    | Directory                                               | When to use                                                                                                                                   |
| --------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Generic reusable primitives | `packages/vue/src/components/<feature>/`                | Basic building blocks usable across any application (Input, Button, Skeleton, CheckboxGroup, RadioCards, Accordion, Tooltip)                  |
| Reference implementations   | `apps/reference/src/features/showcase/demo-components/` | Non-functional mockups showing component composition, not meant for production (SignUpForm, UserProfileEditor, DashboardLayout, CheckoutFlow) |

## Step 2: Implement the component

### Utensil Component Guide

Read and follow the Utensil component guide for all component patterns, conventions, and standards, its addendum for this repository, and the repository's development standards:

@../../../packages/vue/docs/DEVELOPMENT.md
@../../../docs/DEVELOPMENT-ADDENDUM.md
@../../../docs/STANDARDS.md

Every component is a public module of `@gobistories/utensil-vue`: consumers import it directly as `@gobistories/utensil-vue/components/<feature>/Utensil<Name>.vue`, so the file path, root class, cvars and exported types are public API from the moment it ships.

## Step 3: Implement a test

Write a vitest unit test for the component alongside the component file(s) in the same directory, with a `.test` suffix.

## Step 4: Document the component

Run the skill /document-component-api <ComponentName>.

This creates an adjacent file with the suffix 'Doc' (ie UtensilInputDoc.vue for UtensilInput.vue).

## Step 5: Reference Application

Implement a Reference demo within the reference application: add a demo component to the appropriate page feature's `demos/` folder in `apps/reference/src/features/`.

If implementing a reference demo see @../../../apps/reference/DEVELOPMENT.md for notes about the reference application.

## Step 6: Post implementation

From the repository root, format, lint, typecheck and test:

```bash
./check
```

Then confirm the package still builds and installs cleanly for consumers:

```bash
bun run verify:package
```

Fix any errors found related to your work.

Test in Chrome _if_ the user answered that you should do it. The reference app runs at `http://localhost:12911` (`bun run dev` from the repository root, or `docker compose up utensil-reference`).

Tell a sub-agent to run the /audit-component skill on the component. Don't use --fix. Consider the recommendations returned and update if required.

## Step 7: Completion

Add a summary of the component to `packages/vue/docs/COMPONENTS.md` to make it discoverable, in the same table format as its section.
