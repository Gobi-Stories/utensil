---
name: summarize-component
description: Summarize a single Utensil component from its documentation
argument-hint: <ComponentName>
context: fork
model: sonnet
---

# Summarize Component

Produce a brief summary of a Utensil component by reading its documentation file.

## Arguments

- `ComponentName`: PascalCase name (e.g., "Button" or "UtensilButton")

## Step 1: Locate the documentation file

Normalize the name to include the `Utensil` prefix, then locate the component file under `packages/vue/src/components/`. The folder layout groups components by category, not by name, so don't assume the folder matches the component — find the actual `Utensil<Name>.vue` file.

If the caller's name isn't an exact match, use your judgment to resolve it to the intended component (close spelling, singular/plural, obvious synonyms). If genuinely ambiguous or nothing close exists, treat it as not found.

The documentation file, if any, sits next to the component as `Utensil<Name>Doc.vue`.

**Only read the Doc file.** Do not read the component source, tests, or any other files.

## Step 2: Extract the summary

If you determine the component is not documented, output:

```
| **{ComponentName}** | Undocumented | [Component](../src/components/<feature>/Utensil<Name>.vue) |
```

If the component Doc file **exists**, read it and extract:

1. **Name** — the `<h1>` text (e.g., `UtensilButton`)
2. **Description** — the first `<p>` after the `<h1>` (the brief description of what the component does)

A list of child components, if it has them:

1. **Name** - a `<h2>` with a child component name (e.g., `<h2>UtensilRadioButton</h2>`) followed by a description and documentation
2. **Description** - the first `<p>` after the `<h2>` (the brief description of the component)

Then output a single markdown table row for the component:

```markdown
| **{ComponentName}** | <description> | [Component](../src/components/<feature>/{ComponentName}.vue) \| [API Docs](../src/components/<feature>/{ComponentDoc}.vue) |
```

**and** additional markdown table rows for each documented child, if any. Specify the API Docs as the same file as the parent.

Links are relative to `packages/vue/docs/`, where the catalogue lives: `../src/components/...` is the component source in the `@gobistories/utensil-vue` package.

## Rules

- Do not read the component source file. Only read the Doc file.
- Do not provide any information beyond name, description, component file path, and documentation file path.
- Output exactly one mardown table row per component.
