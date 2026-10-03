<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilNullData</h1>
      <UtensilPopoverPanel :offset="0">
        <template #trigger="{ toggle }">
          <UtensilBadge class="theme-props-badge" scale="large" @click="toggle">Theme Props</UtensilBadge>
        </template>
        <div class="theme-props-note">
          <span>Use a typed wrapper to use your theme values. See the Usage Guide.</span>
        </div>
      </UtensilPopoverPanel>
    </div>
    <p>
      Empty state placeholder shown when there is no data to display. Provides a title, optional description, icon, and
      action buttons to guide the user.
    </p>

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
          <td><code>title</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Heading text displayed prominently. Required.</td>
        </tr>
        <tr>
          <td><code>description</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Supporting text below the title. When omitted, the default slot is rendered instead.</td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td><code>IconProp</code></td>
          <td>—</td>
          <td>Large icon displayed above the title.</td>
        </tr>
        <tr>
          <td><code>iconColor</code></td>
          <td><code>ColorProp</code></td>
          <td>—</td>
          <td>Override color for the icon. When omitted the icon uses a muted pencil color.</td>
        </tr>
      </tbody>
    </table>

    <h2>Slots</h2>
    <table>
      <thead>
        <tr>
          <th>Slot</th>
          <th>Scope</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>default</code></td>
          <td>—</td>
          <td>Rich description content. Rendered when the <code>description</code> prop is not set.</td>
        </tr>
        <tr>
          <td><code>actions</code></td>
          <td>—</td>
          <td>Action buttons displayed below the description. Lays out horizontally on wider containers.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilNullData
  title="No Items Found"
  description="There are no items to display."
  icon="inbox"
/&gt;</code></pre>

    <h3>With Custom Description</h3>
    <pre><code>&lt;UtensilNullData title="No Results" icon="search"&gt;
  &lt;p&gt;We couldn't find anything matching your search.&lt;/p&gt;
  &lt;p&gt;Try adjusting your filters.&lt;/p&gt;
&lt;/UtensilNullData&gt;</code></pre>

    <h3>With Actions</h3>
    <pre><code>&lt;UtensilNullData
  title="Get Started"
  description="Create your first project to begin."
  icon="plus-circle"
  iconColor="pen"
&gt;
  &lt;template #actions&gt;
    &lt;UtensilButton variation="solid" icon="plus"&gt;Create Project&lt;/UtensilButton&gt;
    &lt;UtensilButton variation="outline"&gt;Import Data&lt;/UtensilButton&gt;
  &lt;/template&gt;
&lt;/UtensilNullData&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
