<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilDivider</h1>
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
      Horizontal or vertical separator line with an optional centered label. Uses the <code>pencil</code> color by
      default and renders a <code>role="separator"</code> element with the appropriate <code>aria-orientation</code>.
    </p>

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
          <td><code>vertical</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Renders the divider vertically instead of horizontally. The label is hidden in vertical mode.</td>
        </tr>
        <tr>
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Optional text displayed centered on the divider line. Only shown in horizontal mode.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pencil'</code></td>
          <td>Theme color applied to the divider line and label text.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Horizontal</h3>
    <pre v-pre><code>&lt;UtensilDivider /&gt;</code></pre>

    <h3>With Label</h3>
    <pre v-pre><code>&lt;UtensilDivider label="or" /&gt;</code></pre>

    <h3>Vertical</h3>
    <pre v-pre><code>&lt;div style="display: flex; align-items: center; gap: 8px; height: 40px"&gt;
  &lt;span&gt;Left&lt;/span&gt;
  &lt;UtensilDivider vertical /&gt;
  &lt;span&gt;Right&lt;/span&gt;
&lt;/div&gt;</code></pre>

    <h3>Colored with Label</h3>
    <pre v-pre><code>&lt;UtensilDivider label="section" color="primary" /&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'

// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
