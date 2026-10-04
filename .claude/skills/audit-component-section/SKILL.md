---
name: audit-component-section
description: Audit all components in a reference section
argument-hint: <Page> [--fix] [--rule number]
context: fork
---

# Audit Component Section

Audit every component demonstrated in a reference section against Utensil Design System patterns and standards. A section is one reference page: a feature at `apps/reference/src/features/<feature>/` with `<Feature>Page.vue` and a `demos/` subfolder.

## Arguments

- `Page`: The reference page (e.g., "DialogsPage", "dialogs", or "Dialogs")
- All options (`--fix`, `--rule`) are passed through to each `/audit-component` invocation.

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

## Step 3: Run `/audit-component` for each component

For each component in the list, run an agent with the `/audit-component` skill. Run them **in parallel** — each agent only reads and (in fix mode) edits its own component files so there are no conflicts.

Pass through any `--fix` or `--rule` options to each invocation.

You do not need to provide additional information to sub-agents, all information is in the sub-skill.

You do not need to read the skill.

## Step 4: Collate results

After all components have been audited, collate all recommendations into a single summary table:

| Component     | #   | Recommended Pattern                                             |
| ------------- | --- | --------------------------------------------------------------- |
| UtensilButton | 6   | High contrast mode supported via `.utensil-high-contrast` class |
| UtensilButton | 10  | Focus ring or focus style with `:focus-visible`                 |
| ...           | ... | ...                                                             |

Report components with zero recommendations as passing audit.

```
## Audit Summary: <Page>

**X components audited. Y recommendations across Z components.**

| Component | # | Recommended Pattern |
|-----------|---|---------------------|
| ... | ... | ... |

### Components passing audit
- UtensilButton
- UtensilInput
```
