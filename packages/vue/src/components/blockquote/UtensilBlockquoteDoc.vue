<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilBlockquote</h1>
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
      Displays a block-level quotation from another source with semantic HTML structure. Renders as a
      <code>&lt;blockquote&gt;</code> element with a left border accent and italic styling.
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
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Theme color applied to the border and text.</td>
        </tr>
        <tr>
          <td><code>weight</code></td>
          <td><code>'light' | 'regular' | 'medium' | 'bold'</code></td>
          <td><code>'regular'</code></td>
          <td>Font weight of the quotation text.</td>
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
          <td>Quotation content.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilBlockquote&gt;
  Perfect typography is certainly the most elusive of all arts.
&lt;/UtensilBlockquote&gt;</code></pre>

    <h3>Semantic Color with Weight</h3>
    <pre><code>&lt;UtensilBlockquote color="success" weight="medium"&gt;
  The only way to do great work is to love what you do.
&lt;/UtensilBlockquote&gt;</code></pre>

    <h3>Scaled</h3>
    <pre><code>&lt;UtensilBlockquote :scale="1.2" color="warning"&gt;
  With great power comes great responsibility.
&lt;/UtensilBlockquote&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
