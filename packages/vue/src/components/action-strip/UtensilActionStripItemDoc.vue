<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilActionStripItem</h1>
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
      An entry in a <code>UtensilActionStrip</code>: an icon with its label rendered underneath. Renders as a native
      <code>&lt;button&gt;</code> with <code>aria-pressed</code> reflecting selection.
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
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>required</td>
          <td>Label shown underneath the icon.</td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td><code>IconProp</code></td>
          <td>required</td>
          <td>Icon name from the theme's icon map.</td>
        </tr>
        <tr>
          <td><code>iconColor</code></td>
          <td><code>ColorProp</code></td>
          <td><code>undefined</code></td>
          <td>Overrides the icon color.</td>
        </tr>
        <tr>
          <td><code>selected</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Marks the item as the active destination.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disables the item.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre
      v-pre
    ><code>&lt;UtensilActionStripItem label="Stories" icon="film" :selected="active" @click="go()" /&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'

// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
