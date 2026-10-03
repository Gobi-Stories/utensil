<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilPill</h1>
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
      A pill-shaped label for tags, filters, and categories. Supports optional counts, removable mode with a close
      button, icons, and multiple visual variations.
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
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Pill text. Overridden by default slot.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td><code>'solid'</code></td>
          <td>Visual style. See Variations below.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Theme color applied to the pill.</td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td><code>IconProp</code></td>
          <td>—</td>
          <td>Icon displayed before the label.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td><code>1</code></td>
          <td>Relative size scaling.</td>
        </tr>
        <tr>
          <td><code>removable</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Shows a close button and emits <code>removed</code> on click.</td>
        </tr>
        <tr>
          <td><code>count</code></td>
          <td><code>number</code></td>
          <td>—</td>
          <td>Numeric count badge displayed after the label. Only shown when not removable.</td>
        </tr>
        <tr>
          <td><code>rounded</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Fully rounded (pill) corners.</td>
        </tr>
        <tr>
          <td><code>squared</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Squared corners.</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Accessible label for the remove button. Also sent as the <code>removed</code> event payload.</td>
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
          <td><code>removed</code></td>
          <td><code>string | undefined</code></td>
          <td>Fires when the close button is clicked. Payload is the <code>ariaLabel</code> value.</td>
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
          <td>Pill content. Overrides the <code>label</code> and <code>icon</code> props.</td>
        </tr>
      </tbody>
    </table>

    <h2>Variations</h2>
    <div class="text-ui ui-variations-reference">
      <UtensilBadge variation="solid" scale="giant">Solid</UtensilBadge>
      <UtensilBadge variation="soft" scale="giant">Soft</UtensilBadge>
      <UtensilBadge variation="text" scale="giant">Text</UtensilBadge>
      <UtensilBadge variation="outline" scale="giant">Outline</UtensilBadge>
      <UtensilBadge variation="surface" scale="giant">Surface</UtensilBadge>
      <UtensilBadge variation="overlay" scale="giant">Overlay</UtensilBadge>
    </div>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilPill label="Tag" /&gt;

&lt;UtensilPill color="success" variation="soft" label="Published" /&gt;</code></pre>

    <h3>With Count</h3>
    <pre><code>&lt;UtensilPill :count="12" label="Videos" /&gt;

&lt;UtensilPill icon="star" color="warning" :count="3" label="Featured" /&gt;</code></pre>

    <h3>Removable</h3>
    <pre><code>&lt;UtensilPill
  removable
  aria-label="JavaScript"
  label="JavaScript"
  @removed="handleRemove"
/&gt;</code></pre>

    <h3>With Icon</h3>
    <pre><code>&lt;UtensilPill icon="circle" color="success" label="Active" /&gt;

&lt;UtensilPill icon="tag" variation="outline" label="Tagged" /&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
