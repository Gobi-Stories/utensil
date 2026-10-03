---
name: summarize-component-section
description: Summarize all components in a reference section
argument-hint: <Page>
context: fork
model: sonnet
---

# Summarize Component Section

Summarize every component demonstrated in a reference section. A section is one reference page: a feature at `apps/reference/src/features/<feature>/` with `<Feature>Page.vue` and a `demos/` subfolder.

## Arguments

- `Page`: The reference page (e.g., "DialogsPage", "dialogs", or "Dialogs")

## Step 1: Read the page and its demos

Resolve the argument to the page's feature folder — fuzzy match is fine ("dialogs", "Dialogs", and "DialogsPage" all resolve to `apps/reference/src/features/dialogs/`).

Read the `<Feature>Page.vue` file and each demo component in the feature's `demos/` subfolder, and identify every component demo block. These appear as:

1. **Single or Parent Composite Component** — a demo component whose template root is `<ReferenceComponentDemo>` with a `<template #api>` slot
2. **Child Composite Component** — wrapped in a plain `<div class="component-demo">` with an `<h3>` and `<p>`

## Step 2: Build the component list

For each demo block, extract the Utensil component name (with `Utensil` prefix). The component name can be inferred from:

- The `title` prop on `<ReferenceComponentDemo title="Button">` → `UtensilButton`

Some components will have multiple demo blocks. Pay attention to the actual component being demonstrated. Sometimes the same component is being demonstrated in multiple demo blocks to show different features.

Build a list of all unique component names found on the page.

## Step 3: Run `/summarize-component` for each component

For each component in the list, run an agent with the `/summarize-component` skill. Run them **in parallel** — summarize is read-only so there are no conflicts.

You do not need to provide additional information to sub-agents, all information is in the sub-skill.

You do not need to read the skill.

## Step 4: Collate results

After all components have been summarized, collate the results into a section summary using the returned markdown table rows, for example:

```markdown
## Basic UI

| Component         | Description                                           | Docs                                                                                                                 |
| ----------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **UtensilButton** | An interactive button element for triggering actions. | [Component](../src/components/button/UtensilButton.vue) \| [API Docs](../src/components/button/UtensilButtonDoc.vue) |
| **UtensilInput**  | Undocumented                                          | [Component](../src/components/input/UtensilInput.vue)                                                                |
```

Use the page name (without `Page`) as the section heading, formatted with spaces between words (e.g., `BasicUIPage` → `Basic UI`).

Output this collated section summary as your result.

## Rules

- Do not summarize the section yourself, only collate the results of the sub-agents.
- Do not include the page file path in the output.

```

```
