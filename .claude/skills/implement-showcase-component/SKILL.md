---
name: implement-showcase-component
description: Implement a component and add it to the showcase demo
argument-hint: <ComponentName> <description>
---

# Implement Showcase Component

Implement a component and create a showcase demo for it. The demo appears automatically on the reference app's Showcase page via hot reload.

First confirm the answer to these questions:
@../../QUESTIONS.md

## Arguments

- `ComponentName`: PascalCase name (e.g., "Skeleton", "AudioEqualizer", "CheckoutFlow")
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

### Reference components

Reference implementations in the demo use Reference-typed components (e.g., `ReferenceButton`, `ReferenceIcon`) not Utensil components directly. Import them from `@/theme/components/`.

### Showcase context

A `ShowcaseContext` is optionally available via provide/inject for demos that want to adapt to the showcase's presentation state:

```ts
import { useShowcaseContext } from '../showcase-context'

const { immersive } = useShowcaseContext()
```

- `immersive` (`Ref<boolean>`): Whether the parent container is providing a visually rich backdrop. When `true`, the background is busy and demos should tone down their own visual weight (e.g., use `surface` inputs instead of `outline` for inputs) to avoid competing with the surrounding presentation
- The context is optional — components work standalone with sensible defaults (immersive defaults to `false`)
- Only use when the component's appearance meaningfully benefits from adapting to the presentation context

## Step 3: Create the showcase demo

For components in `packages/vue/src/components/`, create a corresponding demo component at `apps/reference/src/features/showcase/demo-components/<DemoName>.vue`.

For reference implementations (already in `demo-components/`), the component itself is the demo — skip this step.

### Demo guidelines

- Provide realistic prop values and state management to showcase the component's functionality
- Include minimal surrounding UI to show the component in context (labels, helper text, layout containers)
- Keep the component as the focal point — don't add excessive wrapper UI
- Self-contained components (DataTable, VideoPlayer) may not need additional context
- The showcase container provides a styled card with padding, don't add an outer border or outer shadow to your demo container
- Use min-width: 100%, max-width: 100% and width to an ideal width between 300px and 500px for your demo or component
- Set a min-height if your content can change, to prevent layout shift
- The showcase container does not provide alignment. Align your content horizontally and vertically within your demo component
- The demo does not receive any props — it must be fully self-contained with its own state

### Demo example

```vue
<template>
  <div class="skeleton-demo">
    <h3 class="demo-title">Loading profile</h3>
    <UtensilSkeleton width="64px" height="64px" radius="circle" />
    <UtensilSkeleton width="180px" height="20px" />
    <UtensilSkeleton width="240px" height="14px" />
  </div>
</template>

<script setup lang="ts">
import UtensilSkeleton from '@gobistories/utensil-vue/components/skeleton/UtensilSkeleton.vue'
</script>

<style scoped>
.skeleton-demo {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: center;
}

.demo-title {
  font-size: var(--font-size-4);
  font-weight: 600;
  color: var(--pencil-12);
  margin-block-end: var(--space-3);
}
</style>
```

## Step 4: Add to the demo manifest

Add the new demo **second** in the manifest array in `apps/reference/src/features/showcase/demo-components/demo-manifest.ts` after the sign up demo:

```ts
export const demoManifest: DemoManifestEntry[] = [
  { path: './demo-components/SignUpFormDemo.vue', scroll: 'none' },
  { path: './demo-components/NewDemo.vue', scroll: 'none' }, // ← add second
  { path: './demo-components/SomeOtherDemo.vue', scroll: 'none' },
  // etc...
]
```

Set `scroll` based on the demo's content:

- `'none'` — content fits within the showcase card (most demos)
- `'vertical'` — content needs vertical scrolling (tall content like data tables)
- `'horizontal'` — content needs horizontal scrolling (wide content like timelines)

## Step 5: Reference Application

Implement a Reference demo within the reference application: add a demo component to the appropriate page feature's `demos/` folder in `apps/reference/src/features/` (see @../../../apps/reference/DEVELOPMENT.md).

## Step 6: Post implementation

Write a unit test for the component alongside the component file(s) in the same directory (for components in `packages/vue/src/components/`). Demo-only components in `demo-components/` do not need tests.

Check for errors from the repository root:

```bash
./check
```

For new components in `packages/vue/src/components/`, also run `bun run verify:package` and add a summary row to `packages/vue/docs/COMPONENTS.md`.

Fix any errors found related to your work.

Test in Chrome _if_ the user answered that you should do it. The showcase is at `http://localhost:12911/showcase` (`bun run dev` from the repository root) — the new demo should appear second in the paginator, after the sign up demo.

For components in `packages/vue/src/components/`: tell a sub-agent to run the /audit-component skill on the component. Don't use --fix. Consider the recommendations returned and update if required.
