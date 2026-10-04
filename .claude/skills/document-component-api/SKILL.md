---
name: document-component-api
description: Document a Utensil component's API
argument-hint: <ComponentName>
context: fork
---

# Document Component API

Create or update the API documentation component for a Utensil component.

Read `packages/vue/skills/utensil-document-component-api/SKILL.md` and follow it, with these differences for this repository:

- **Component** (`ComponentName`: e.g. "Button" or "UtensilButton"): find the actual `Utensil<ComponentName>.vue` file under `packages/vue/src/components/`. Folders group components by category, not by name, so don't assume the folder matches the component. If the name isn't an exact match, resolve it to the intended component (close spelling, singular/plural, obvious synonyms); if genuinely ambiguous, ask.
- **Guide**: read `packages/vue/docs/DEVELOPMENT.md` and `docs/DEVELOPMENT-ADDENDUM.md` (the shipped skill's `references/` are build copies).
- **Doc file**: `Utensil<ComponentName>Doc.vue` beside the component, titled `Utensil{Name}`.
- **Imports are relative**, as everywhere in `packages/vue/src`: `<style src="../../utensil-docs.css"></style>`, and Utensil components from their folders (`../badge/UtensilBadge.vue`, `../popover/UtensilPopoverPanel.vue`).
- **Examples** use the component itself (`<UtensilButton label="Save" />`).
- **Verify** with `./check` at the repository root.

Doc components ship as readable source in the `utensil-vue` package (consumers' agents read them as API docs) but are not compiled into `dist/`.
