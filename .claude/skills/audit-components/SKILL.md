---
name: audit-components
description: Audit all Utensil components across all reference sections
context: fork
---

# Audit Utensil Components

Run audits for every component across all component reference sections.

## Step 1: Identify component sections

Read `apps/reference/src/router.ts` — this is the only file you need to read. The `referencePages` array lists every reference page. Each page in the `Components` group is a component reference section. Do not read the page or demo files — that is handled by the sub-skill.

## Step 2: Create an agent team to `/audit-component-section` for each section **concurrently**

For each page identified in Step 1, run an agent with the `/audit-component-section` skill in the background, with the page name as the argument (e.g., `/audit-component-section BasicUIPage`).

Run all agents together **in parallel** — each section audits different components so there are no conflicts between them.

You do not need to provide additional information to sub-agents, all information is in the sub-skill.

You do not need to read the skill.

## Step 3: Collate results

After all agents complete, collate all section summaries into a single report and save it to `temp/AUDIT-RESULTS.md` (create `temp/` if needed; it is gitignored):

```
# Utensil Component Audit Results

**Total: X components audited. Y recommendations across Z components.**

## <Page>

| Component | # | Recommended Pattern |
|-----------|---|---------------------|
| ... | ... | ... |

### Components passing audit
- ...

## <NextPage>
...
```

Overwrite the file if it exists.
