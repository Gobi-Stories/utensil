---
name: utensil-document-component-api
description: Create or update the adjacent <Name>Doc.vue API documentation for a component, in the Utensil documentation format. Use after implementing or changing a component in a project that uses utensil-vue.
license: MIT
argument-hint: <ComponentName or path>
context: fork
---

# Document Component API

Create or update an API documentation component for a component.

## Arguments

- `ComponentName or path`: the component's file path, or its PascalCase name (e.g., "UserAvatar")

## Step 1: Locate the component and check for existing docs

Read `references/DEVELOPMENT.md` (in this skill's directory) for the component conventions this documentation describes (theme props, UI variations, CSS cvars, composite children).

Given a path, use it. Given a name, find `<ComponentName>.vue` in the project, outside `node_modules`; if more than one matches, ask which one.

Read the component file thoroughly. For composite components (parent + children), also read all child components in the same directory.

Then check if a doc component already exists beside it, as `<ComponentName>Doc.vue`.

- **If the doc component does not exist** — continue to Step 2 to create it from scratch.
- **If the doc component already exists** — read the existing doc and compare it against the current component source. Check for:
  - Props that were added, removed, renamed, or had their type/default changed
  - Events that were added or removed
  - Slots that were added, removed, or had scope changes
  - Variations that were added or removed
  - Exposed members that changed
  - CSS cvars that were added or removed
  - Child participation changes (for composite components)

  If the doc is already up to date, skip to Step 4. Otherwise, update the doc component to reflect the current API and then continue to Step 4.

## Step 2: Analyze the component API

Extract the following from the source code:

### Props

Read the `Props` interface and `withDefaults` / destructuring defaults. For each prop note:

- Name
- Type (use readable type names, not internal aliases)
- Default value
- Brief description

### Events

Read `defineEmits`. For each event note:

- Name
- Payload type
- When it fires

### Slots

Read all `<slot>` elements in the template. For each slot note:

- Name (or "default")
- Scope props (if scoped)
- Purpose

### UI Variations

If the component accepts a `variation` prop, list which variations are supported.

### Theme Props

Determine if the component uses `generic="Theme extends ThemeConfig"`. If yes, it uses Theme Props and consumers should create a typed wrapper.

### CSS Cvars

Find CSS custom properties that use the pattern `var(--<component-name>-*, <fallback>)` — these are the incoming cvars that parents can set. Document only the **incoming name** (e.g., `--user-avatar-size`), not the internal alias.

**Important:** Do not document Utensil design tokens (`--pen-*`, `--pencil-*`, `--space-*`, `--radius-*`, etc.) as cvars. Only document component-specific customization variables.

### Exposed Properties and Methods

Read `defineExpose`. For each exposed member note:

- Name
- Type (return type for methods, value type for properties)
- Brief description

### Child Participation (composite components only)

For composite components that have built-in child components:

1. **Slots designed for children** — which slots accept child components and what scope they expose
2. **CSS Cvars set by parent** — variables the parent sets that children should read
3. **Data attributes read by parent** — attributes like `data-focusable` that the parent uses for keyboard navigation or styling

## Step 3: Create the Doc component

Create the file beside the component, as `<ComponentName>Doc.vue`.

### Documentation CSS

The doc component uses CSS classes from Utensil's doc stylesheet, which `utensil-vue` exports as `utensil-vue/utensil-docs.css`. Import it in the doc component:

```vue
<style src="utensil-vue/utensil-docs.css"></style>
```

This gives access to the `.text-code` text theme, the `.utensil-api-doc` layout and all `.doc-*` classes.

### Structure

Use this template as a starting point. Remove sections that don't apply (e.g., no Cvars section if none exist, no Child Participation if not composite).

```vue
<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>{Name}</h1>
      <!-- Theme Props Flag -->
      <UtensilPopoverPanel :offset="0">
        <template #trigger="{ toggle }">
          <UtensilBadge class="theme-props-badge" scale="large" @click="toggle">Theme Props</UtensilBadge>
        </template>
        <div class="theme-props-note">
          <span>Create a typed wrapper for your theme. See the Utensil Usage Guide.</span>
        </div>
      </UtensilPopoverPanel>
    </div>
    <p>{Brief description of what the component does and when to use it.}</p>

    <!-- UI Variations (for each applicable, if any) -->
    <h2>Variations</h2>
    <div class="text-ui ui-variations-reference">
      <UtensilBadge variation="solid" scale="giant">Solid</UtensilBadge>
      <UtensilBadge variation="soft" scale="giant">Soft</UtensilBadge>
      <UtensilBadge variation="text" scale="giant">Text</UtensilBadge>
      <UtensilBadge variation="outline" scale="giant">Outline</UtensilBadge>
      <UtensilBadge variation="surface" scale="giant">Surface</UtensilBadge>
      <UtensilBadge variation="overlay" scale="giant">Overlay</UtensilBadge>
    </div>

    <!-- Props -->
    <h2>Props</h2>
    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Button text. Overridden by default slot.</td>
        </tr>
        <!-- ...more rows -->
      </tbody>
    </table>

    <!-- Events -->
    <h2>Events</h2>
    <table>
      <thead>
        <tr>
          <th>Event</th>
          <th>Payload</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>click</code></td>
          <td><code>MouseEvent</code></td>
          <td>Fires on click.</td>
        </tr>
      </tbody>
    </table>

    <!-- Provided Context (Composite parents only) -->
    <h2>Context</h2>
    <p>Brief list of all props that are included in the context so we don't need to redocument them</p>
    <!-- Any additional context that is not documented as a prop -->
    <table>
      <thead>
        <tr>
          <th>Property</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>label</code></td>
          <td>string</td>
          <td>—</td>
          <td>Button label content. Overrides the <code>label</code> prop.</td>
        </tr>
      </tbody>
    </table>

    <!-- Slots -->
    <h2>Slots</h2>
    <h3>#default</h3>
    <p>{Brief list of all context that is included in the scope so we don't need to redocument them}</p>
    <!-- Any additional scope that is not documented as context -->
    <table>
      <thead>
        <tr>
          <th>Scope</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>setValue()</code></td>
          <td>—</td>
          <td>Sets the radio group value.</td>
        </tr>
      </tbody>
    </table>

    <!-- Exposed (if defineExpose is used) -->
    <h2>Exposed</h2>
    <table>
      <thead>
        <tr>
          <th>Member</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>focus()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Focuses the element programmatically.</td>
        </tr>
      </tbody>
    </table>

    <!-- CSS Cvars (if any) -->
    <h2>CSS Cvars</h2>
    <table>
      <thead>
        <tr>
          <th>Variable</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>--user-avatar-size</code></td>
          <td><code>--space-6</code></td>
          <td>Override the avatar's size.</td>
        </tr>
      </tbody>
    </table>

    <!-- Child Participation (composite components only) -->
    <h2>{ChildComponentName}</h2>
    <p>{Brief description of the component and when to use it}</p>

    <!-- Same document section as parent, as applicable, but use <h3> for title -->
    <h3>Props</h3>
    <!-- etc -->

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UserAvatar :user="user" /&gt;

&lt;UserAvatar :user="user" scale="large" rounded /&gt;</code></pre>

    <!-- For composite components, add an example with native + custom children -->
    <h3>With Native and Custom Children</h3>
    <pre><code>&lt;UtensilMenu :active="open" @close="open = false"&gt;
  &lt;template #default="{ isFocused, focus, close }"&gt;
    &lt;UtensilMenuItem label="Copy" /&gt;
    &lt;UtensilMenuItem label="Paste" /&gt;
    &lt;div
      data-focusable
      @mouseenter="focus($el)"
      @click="doCustomAction(); close()"
    &gt;Custom action&lt;/div&gt;
  &lt;/template&gt;
&lt;/UtensilMenu&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from 'utensil-vue/components/badge/UtensilBadge.vue'
import UtensilPopoverPanel from 'utensil-vue/components/popover/UtensilPopoverPanel.vue'

// Typically no logic needed — pure documentation component.
</script>

<style src="utensil-vue/utensil-docs.css"></style>
```

### Rules

- **Do not style the outer container** (`<article>`) — it should inherit layout from its parent context.
- Use the `.text-code` class on the root element for typography.
- Use `<code>` for inline name references (props, events, types, variables).
- Use `<pre><code>` for multi-line code examples.
- Use `<em>` for emphasis labels like the Theme Props flag.
- Use `<table>` for structured API data (props, events, slots, cvars).
- Keep examples brief and practical — one or two examples showing real usage.
- For composite components, always include one example with both native children and custom children.
- Only document the public API — do not document internal implementation details.
- Remove any sections from the template that don't apply to the component.
- Import Utensil components from the package: `utensil-vue/components/<feature>/Utensil<Name>.vue`.
- For reference, every Utensil component has a `<Name>Doc.vue` alongside its source in `node_modules/utensil-vue/src/components/`; read one or two (e.g. `button/UtensilButtonDoc.vue`) to match the format.

## Step 4: Post Implementation

Run the project's format, lint, typecheck and test commands.

Fix any errors.
