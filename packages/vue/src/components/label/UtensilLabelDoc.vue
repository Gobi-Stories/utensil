<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilLabel</h1>
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
      A tight, monospace, uppercase tag for marking discriminators — operation types in an audit log, kinds on a row,
      tags on a request. Always rectangular, never interactive, never carries an icon. Use it when you want something
      scannable and "log-line" rather than something that conveys state (use <code>UtensilBadge</code>) or selection
      (use <code>UtensilPill</code>).
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
          <td><code>text</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Label text. Overridden by default slot.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td><code>'soft'</code></td>
          <td>Visual style. See Variations below.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Theme color applied to the label.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td><code>1</code></td>
          <td>Relative size scaling.</td>
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
          <td>Label content. Overrides the <code>text</code> prop.</td>
        </tr>
      </tbody>
    </table>

    <h2>Variations</h2>
    <div class="text-ui ui-variations-reference">
      <UtensilLabel variation="solid" scale="giant">Solid</UtensilLabel>
      <UtensilLabel variation="soft" scale="giant">Soft</UtensilLabel>
      <UtensilLabel variation="text" scale="giant">Text</UtensilLabel>
      <UtensilLabel variation="outline" scale="giant">Outline</UtensilLabel>
      <UtensilLabel variation="surface" scale="giant">Surface</UtensilLabel>
      <UtensilLabel variation="overlay" scale="giant">Overlay</UtensilLabel>
    </div>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilLabel text="get" /&gt;

&lt;UtensilLabel color="success"&gt;post&lt;/UtensilLabel&gt;</code></pre>

    <h3>Discriminating Operations in a Log</h3>
    <pre><code>&lt;UtensilLabel color="success"&gt;get&lt;/UtensilLabel&gt;
&lt;UtensilLabel color="warning"&gt;put&lt;/UtensilLabel&gt;
&lt;UtensilLabel color="error"&gt;delete&lt;/UtensilLabel&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilLabel from './UtensilLabel.vue'
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
