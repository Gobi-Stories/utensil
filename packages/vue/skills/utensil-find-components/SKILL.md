---
name: utensil-find-components
description: Find suitable Utensil components for a design's requirements. Use before building UI in a project that uses @gobistories/utensil-vue, to match each requirement (date picker, search input, menu…) to existing Utensil components instead of writing new ones.
license: MIT
argument-hint: <requirements>
context: fork
model: haiku
---

# Find Utensil Components

Compare design requirements against the Utensil Component Catalogue and return a table of suitable components.

## Arguments

- `requirements`: A description of the UI components needed for a design (e.g., "date picker, search input, avatar list, loading spinner, dropdown menu")

## Step 1: Read the component catalogue

Read `references/COMPONENTS.md` (in this skill's directory) to get the full list of available components with their descriptions.

## Step 2: Match requirements to components

For each requirement described by the user:

1. Identify which Utensil components could fulfill the requirement
2. Consider both exact matches and compositional matches (e.g., a "tag input" could be served by `UtensilLabelInput` or `UtensilPill`)
3. Note when multiple components work together (e.g., `UtensilDropdownMenu` + `UtensilMenuItem`)

## Step 3: Output results

Output a markdown table with one row per requirement:

```markdown
| Requirement | Component | Notes |
| ----------- | --------- | ----- |
```

- **Requirement**: The user's original requirement text
- **Component**: The matching Utensil component name (or multiple if they compose together)
- **Notes**: Brief description of how the component fulfills the requirement

Then output a markdown list of the component location and documentation location, for example:

```markdown
- **UtensilRadioButtons**: node_modules/@gobistories/utensil-vue/src/components/radio-buttons/UtensilRadioButtons.vue
  - **API**: node_modules/@gobistories/utensil-vue/src/components/radio-buttons/UtensilRadioButtonsDoc.vue
  - **Import**: `@gobistories/utensil-vue/components/radio-buttons/UtensilRadioButtons.vue`
```

If a requirement has no suitable match, include it with "No match" in the Component column and suggest what would need to be built (potentially via `/utensil-implement-component`).

If a single requirement maps to multiple components (e.g., a composed solution), list each component on its own row with the same requirement text.

## Rules

- Only read `references/COMPONENTS.md`. Do not read component source files or documentation files.
- Be generous with matches — include components that partially fulfill a requirement and note the gap.
- Output only the table and any "no match" notes. No other commentary.
