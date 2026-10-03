# Utensil Reference Development

The reference app is a Vue 3 application that demonstrates every Utensil component. It is built with Utensil the same way a consumer app is, so it doubles as a working example of the setup described in `packages/vue/docs/SETUP.md`.

## Project Structure

- `src/features/` — the reference pages, one feature per page, each with its demos
- `src/app/` — cross-feature app infrastructure (route loading, theme state, the app's dialog, confirm and toast instances)
- `src/theme/` — the app's Utensil theme: config, icon map, color scales, text themes, typed wrappers and shared demo CSS
- `src/test/` — test setup for browser APIs jsdom lacks

Utensil is imported from the workspace packages (`utensil-vue/...`, `utensil-css/...`), never by relative path into `packages/`. Follow `packages/vue/docs/USAGE.md` for Utensil conventions — color, tokens, layout utilities versus scoped styles, typed wrappers, icon naming — and check the available skills before implementing any UI.

## The App

- The app shell is `src/App.vue`: side menu, topbar (page title and theme editor), and a scroller hosting the routed page
- Each reference page demonstrates an aspect of the design system or a group of components by category
- Pages are features at `src/features/<feature>/<Feature>Page.vue`, e.g. `src/features/dialogs/DialogsPage.vue`
- Pages are registered in `src/router.ts` (`referencePages`) and lazy-loaded at request time
- Each component demo on a page is a component in the feature's `demos/` subfolder, e.g. `src/features/dialogs/demos/ConfirmDemo.vue`
- Navigate to a page by URL path (e.g. `/dialogs`); every component demo has a linkable anchor (e.g. `/dialogs#confirm`)
- If you are not specifically testing the side menu, navigate to the page you need by URL

## Utensil Reference Theme

The theme is at `src/theme/` and configures Utensil for this application.

- **Theme config**: `src/theme/reference-theme.ts`
- **Icon map**: `src/theme/reference-icons.ts`
- **Typed wrappers**: `src/theme/components/`
- **Shared demo CSS**: `src/theme/reference-demos.css` — the `demo-page`/`demo-grid`/`demo-item` styles used by all pages, loaded with the theme CSS

### Variants

| Variant     | Color  |
| ----------- | ------ |
| `primary`   | blue   |
| `secondary` | grey   |
| `brand`     | blue   |
| `success`   | green  |
| `favorite`  | pink   |
| `warning`   | orange |
| `error`     | red    |

## Adding to the Reference Application

### Reference Page

- Select the appropriate page for your component demo and add a demo component to that feature's `demos/` folder.
- Create a new page if it makes sense: add `src/features/<feature>/<Feature>Page.vue` with a `<div class="demo-page">` root rendering the demo components, and register it in `referencePages` in `src/router.ts` (path, title, icon, group).

### Demo Components

Each component demo is its own component in the page feature's `demos/` folder, named `<Component>Demo.vue` ("Confirm" → `ConfirmDemo.vue`). The demo component's template root is a `ReferenceComponentDemo` and it owns all state, handlers, and scoped styles for that demo.

### ReferenceComponentDemo

Use `ReferenceComponentDemo` (`src/features/components/ReferenceComponentDemo.vue`) to wrap the component demo with a Demo/API tab switcher:

```vue
<ReferenceComponentDemo title="Component Name" anchor="component-name" description="Description text.">
  <div class="demo-grid">
    <!-- demo content -->
  </div>

  <template #api>
    <UtensilComponentNameDoc />
  </template>
</ReferenceComponentDemo>
```

Use a friendly name for the title ("Dropdown Menu" instead of "UtensilDropDownMenu").

Always pass `anchor` — the kebab-case of the title — so the demo can be linked directly (`/<page>#<anchor>`).

The API documentation usually sits next to the implemented component with the suffix 'Doc'.

Add the necessary imports to the demo component's `<script setup>`:

```ts
import UtensilComponentName from 'utensil-vue/components/<feature>/Utensil<ComponentName>.vue'
import UtensilComponentNameDoc from 'utensil-vue/components/<feature>/Utensil<ComponentName>Doc.vue'
import ReferenceComponentDemo from '@/features/components/ReferenceComponentDemo.vue'
```

If adding additional demo grids for different features within one demo component, use `.component-demo`, give it an `id`, and link the title with the shared `demo-anchor` style:

```vue
<div id="title" class="component-demo">
  <h3><a class="demo-anchor" href="#title">Title</a></h3>
  <p>Description text.</p>
  <div class="demo-grid">
    <!-- demo content -->
  </div>
</div>
```
