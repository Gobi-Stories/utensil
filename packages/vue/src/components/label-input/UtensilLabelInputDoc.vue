<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilLabelInput</h1>
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
      A label picker with autocomplete suggestions. Opens a popover with a text input that filters available labels and
      supports keyboard navigation. Useful for tagging content with predefined or custom labels.
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
          <td><code>availableLabels</code></td>
          <td><code>Label[]</code></td>
          <td><code>[]</code></td>
          <td>Labels to show as suggestions. Each label has a <code>title</code> and optional <code>icon</code>.</td>
        </tr>
        <tr>
          <td><code>omitLabels</code></td>
          <td><code>string[]</code></td>
          <td><code>[]</code></td>
          <td>Label titles to exclude from suggestions (e.g., already-selected labels).</td>
        </tr>
        <tr>
          <td><code>highlightLabels</code></td>
          <td><code>string[]</code></td>
          <td><code>[]</code></td>
          <td>Label titles to visually highlight in the suggestions list.</td>
        </tr>
        <tr>
          <td><code>triggerDescription</code></td>
          <td><code>string</code></td>
          <td><code>'Add label'</code></td>
          <td>Accessible description for the trigger button.</td>
        </tr>
        <tr>
          <td><code>lowerCaseInput</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Whether to lowercase the label before emitting.</td>
        </tr>
        <tr>
          <td><code>capitalizeUI</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Whether to capitalize the first letter of labels in the suggestion list.</td>
        </tr>
      </tbody>
    </table>

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
          <td><code>input</code></td>
          <td><code>string</code></td>
          <td>
            Fires when a label is selected or created. Payload is the label title (lowercased if
            <code>lowerCaseInput</code> is true).
          </td>
        </tr>
        <tr>
          <td><code>open</code></td>
          <td>—</td>
          <td>Fires when the popover opens.</td>
        </tr>
        <tr>
          <td><code>close</code></td>
          <td>—</td>
          <td>Fires when the popover closes.</td>
        </tr>
      </tbody>
    </table>

    <h2>Types</h2>
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Definition</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>Label</code></td>
          <td><code>{ title: string; icon?: IconProp }</code></td>
          <td>Exported type representing a label with a title and optional icon.</td>
        </tr>
      </tbody>
    </table>

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
          <td><code>--utensil-popover-padding</code></td>
          <td><code>--space-4</code></td>
          <td>Override the popover content padding.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilLabelInput
  :available-labels="[
    { title: 'featured', icon: 'star' },
    { title: 'breaking', icon: 'alert' },
  ]"
  @input="addLabel"
/&gt;</code></pre>

    <h3>With Omitted and Highlighted Labels</h3>
    <pre><code>&lt;UtensilLabelInput
  :available-labels="allLabels"
  :omit-labels="selectedLabels"
  :highlight-labels="['important']"
  trigger-description="Tag this item"
  @input="handleSelect"
/&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
