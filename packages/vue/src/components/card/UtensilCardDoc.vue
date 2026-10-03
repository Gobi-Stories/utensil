<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilCard</h1>
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
      Container that groups related content and actions. Supports multiple visual variations, semantic colors, and
      relative scaling. Use the <code>unstyled</code> variation for custom card styling.
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
          <td>Theme color applied to the card background and text.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td><code>'unstyled'</code></td>
          <td>Visual style. See Variations below.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td><code>1</code></td>
          <td>Relative size scaling.</td>
        </tr>
        <tr>
          <td><code>highlighted</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>When true, switches from pencil (muted) to pen (accent) colors across all variations.</td>
        </tr>
        <tr>
          <td><code>interactive</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Enables hover, focus, and active state styles. Adds cursor pointer and focus ring.</td>
        </tr>
        <tr>
          <td><code>shadow</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Reserved for shadow styling.</td>
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
          <td>Card content.</td>
        </tr>
      </tbody>
    </table>

    <h2>Variations</h2>
    <div class="text-ui ui-variations-reference">
      <UtensilBadge variation="solid" scale="giant">Solid</UtensilBadge>
      <UtensilBadge variation="soft" scale="giant">Soft</UtensilBadge>
      <UtensilBadge variation="surface" scale="giant">Surface</UtensilBadge>
      <UtensilBadge variation="outline" scale="giant">Outline</UtensilBadge>
      <UtensilBadge scale="giant">Unstyled</UtensilBadge>
    </div>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilCard variation="surface"&gt;
  &lt;p&gt;Grouped content goes here.&lt;/p&gt;
&lt;/UtensilCard&gt;</code></pre>

    <h3>Semantic Colors</h3>
    <pre><code>&lt;UtensilCard color="success" variation="soft"&gt;
  Operation completed.
&lt;/UtensilCard&gt;

&lt;UtensilCard color="error" variation="outline"&gt;
  Something went wrong.
&lt;/UtensilCard&gt;</code></pre>

    <h3>Highlighted</h3>
    <pre><code>&lt;UtensilCard variation="surface"&gt;
  Default pencil colors (muted).
&lt;/UtensilCard&gt;

&lt;UtensilCard variation="surface" highlighted&gt;
  Highlighted pen colors (accented).
&lt;/UtensilCard&gt;</code></pre>

    <h3>Interactive</h3>
    <pre><code>&lt;UtensilCard variation="surface" interactive&gt;
  Hoverable card with focus ring.
&lt;/UtensilCard&gt;

&lt;UtensilCard variation="surface" interactive highlighted&gt;
  Interactive and highlighted.
&lt;/UtensilCard&gt;</code></pre>

    <h3>Custom Styling with Unstyled</h3>
    <pre><code>&lt;UtensilCard variation="unstyled" style="box-shadow: var(--shadow-border-3)"&gt;
  Card with custom shadow only.
&lt;/UtensilCard&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
