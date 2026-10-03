---
name: summarize-utensil-components
description: Summarize all Utensil components across all reference sections
context: fork
allowed-tools: Write(packages/vue/docs/COMPONENTS.md)
---

# Summarize Utensil Components

Produce a catalogue summary of every component across all component reference sections, written to `packages/vue/docs/COMPONENTS.md`.

## Step 1: Identify component reference sections

Read `apps/reference/src/router.ts` — this is the only file you need to read. The `referencePages` array lists every reference page. Each page in the `Components` group is a component reference section. Do not read the page or demo files — that is handled by the sub-skill.

## Step 2: Create an agent team to `/summarize-component-section` for each section **concurrently**

For each page identified in Step 1, run an agent with the `/summarize-component-section` skill in the background, with the page name as the argument (e.g., `/summarize-component-section BasicUIPage`).

Run all agents together **in parallel** — each section summarizes different components so there are no conflicts between them.

You do not need to provide additional information to sub-agents, all information is in the sub-skill.

You do not need to read the skill.

## Step 3: Write the catalogue

After all agents complete, use the responses to collate all section summaries into `packages/vue/docs/COMPONENTS.md`:

```markdown
# Utensil Component Catalogue

Last updated: {CurrentDate}

Links are relative to this file: `../src/components/` is the component source in the `utensil-vue` package (`node_modules/utensil-vue/src/components/` in a consumer project).

## Basic UI

{ComponentTable}

## Content

{ComponentTable}

...etc...
```

Order sections in the same order the pages appear in `referencePages`.

Overwrite the file if it already exists. The catalogue ships in the `utensil-vue` package and is copied into the consumer skills' references at build time, so keep the link format consistent.
