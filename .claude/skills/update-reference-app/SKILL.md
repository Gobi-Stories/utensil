---
name: update-reference-app
description: Update the Utensil reference application
---

Update the Utensil Reference Application as instructed by the user.

First confirm the answer to these questions:
@../../QUESTIONS.md

The reference application is implemented in `apps/reference/` (relative to the repository root).

- `apps/reference/src/features/` contains the reference pages (Basic UI, Dialogs, Popovers, Inputs, Color Scales, Date Pickers, etc) — each page is a feature at `apps/reference/src/features/<feature>/<Feature>Page.vue` with its component demos in a `demos/` subfolder, registered in `referencePages` in `apps/reference/src/router.ts`
- `apps/reference/src/theme/` configures the Reference App theme
- `apps/reference/src/theme/components/` contain type wrappers for Utensil components that have ThemeProps, and some reference specific components.
- `apps/reference/src/features/showcase/demo-components/` contain showcase demos for the Showcase page

The app imports the workspace packages as a consumer would (`utensil-vue/components/...`, `utensil-css/...`).

To understand how to use Utensil and its components, refer to:
@../../../packages/vue/docs/USAGE.md

If adding a component, find the component in `packages/vue/src/components/` and add its demo to the appropriate reference page — find or create the most relevant page.

Always use our own components in your examples. Ie, don't add custom buttons when we have UtensilButton / ReferenceButton.

For more information on the Reference Application and how it is organized and navigated, see @../../../apps/reference/DEVELOPMENT.md

When done, run `./check` from the repository root and fix any errors related to your work.

## Notes

- Shared demo css classes (`demo-page`, `demo-grid`, `demo-item`, `demo-content`, `demo-label`, etc) are defined in `apps/reference/src/theme/reference-demos.css`. Use these for consistent layouts.
- Demo labels are hidden by default, add `always-visible` to `demo-label` only if the feature of the component being demoed isn't obvious visually.

## Troubleshooting

External positioning and outer styling of Utensil components is supposed to be easy. If a component is not being styled as expected, do not use aggressive approaches such as `:deep()`. This points to a design issue with the component. You can call on a sub-agent to update the component, using the `/update-utensil-component` skill. Describe the issue and instruct them not to break compatibility with existing consumers of the published package.
