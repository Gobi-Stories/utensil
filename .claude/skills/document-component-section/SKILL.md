---
name: document-component-section
description: Document all components in a reference section
argument-hint: <Page>
context: fork
---

# Document Component Section

Run API documentation for every component demonstrated in a reference section. A section is one reference page: a feature at `apps/reference/src/features/<feature>/` with `<Feature>Page.vue` and a `demos/` subfolder.

## Arguments

- `Page`: The reference page (e.g., "DialogsPage", "dialogs", or "Dialogs")

## Step 1: Read the page and its demos

Resolve the argument to the page's feature folder — fuzzy match is fine ("dialogs", "Dialogs", and "DialogsPage" all resolve to `apps/reference/src/features/dialogs/`).

Read the `<Feature>Page.vue` file and each demo component in the feature's `demos/` subfolder, and identify every component demo block. These appear in two forms:

1. **Already documented** — a demo component whose template root is `<ReferenceComponentDemo>` with a `<template #api>` slot
2. **Not yet documented** — a plain `<div class="component-demo">` block with an `<h3>` and `<p>`

## Step 2: Build the component list

For each demo block, extract the Utensil component name (with `Utensil` prefix). The component name can be inferred from:

- The `title` prop on `<ReferenceComponentDemo title="Button">` → `UtensilButton`
- The `<h3>` text inside `<div class="component-demo">` → e.g., `<h3>Radio Buttons</h3>` → `UtensilRadioButtons`

Some components will have multiple demo blocks. Pay attention to the actual component being demonstrated. Sometimes the same component is being demonstrated in multiple demo blocks to show different features.

Build a list of all unique component names found on the page.

## Step 3: Run `/document-component-api` for each component

For each component in the list, run an agent with the `/document-component-api` skill. Run them **in parallel** — each agent writes to its own `Utensil<Name>Doc.vue` file so there are no conflicts.

The `/document-component-api` skill handles both creating new documentation and updating existing documentation, so run it for every component regardless of whether it already has docs.

You do not need to provide additional information to sub-agents, all information is in the sub-skill.

You do not need to read the skill.

## Step 4: Verify

After all components have been processed, run type checking from the repository root:

```bash
bun run typecheck
```

Fix any errors.
