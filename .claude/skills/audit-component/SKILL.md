---
name: audit-component
description: Audit a single Utensil component against the Utensil patterns and standards, including this repository's own rules
argument-hint: <ComponentName> [--fix] [--rule number] | --rules
context: fork
---

# Audit Component

Audit a single Utensil component, or a reference app component, against established patterns, rules, and guidance.

Read `packages/vue/skills/utensil-audit-component/SKILL.md` and follow it: options, workflow, judgement guidelines, output and fix mode. This repository adds the rules and locations below.

## Locating the component

- A name starting with `Utensil` is in `packages/vue/src/components/`.
- A name starting with `Reference` or ending with `Page` is in `apps/reference/src/features/`.

## Preparation

The shipped skill reads build copies in its `references/`. Read the sources, with this repository's addenda:

1. `packages/vue/docs/DEVELOPMENT.md`, then `docs/DEVELOPMENT-ADDENDUM.md`
2. `packages/vue/docs/audit-checklist.md` and `docs/audit-checklist-addendum.md`: one checklist, one numbering. `--rules` lists both and `--rule` takes a number from either.
3. `packages/vue/docs/USAGE.md`

## Judgement guidelines

On top of the shipped skill's:

- **Utensil components**: Items 32 and 65 (location, relative imports) always apply, and item 8 (reference examples)
- **Reference app components and demos**: Items 52–53 (Reference-typed components, no native `alert`/`confirm`)

## Fix mode

Verify with `./check` at the repository root.
