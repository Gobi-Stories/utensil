<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilBadge</h1>
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
      A compact label for status indicators, counts, and categorization. Supports icons, multiple visual variations, and
      shape options.
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
          <td>Badge text. Overridden by default slot.</td>
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
          <td>Theme color applied to the badge.</td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td><code>IconProp</code></td>
          <td>—</td>
          <td>Icon displayed before the label.</td>
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
          <td>Squared corners with left-aligned content.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td><code>1</code></td>
          <td>Relative size scaling.</td>
        </tr>
        <tr>
          <td><code>radiusScale</code></td>
          <td><code>RadiusScaleProp</code></td>
          <td>—</td>
          <td>Override the border radius scale independently from size.</td>
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
          <td>Badge content. Overrides the <code>label</code> prop.</td>
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
    <pre><code>&lt;UtensilBadge label="New" /&gt;

&lt;UtensilBadge color="success" variation="soft"&gt;
  Published
&lt;/UtensilBadge&gt;</code></pre>

    <h3>With Icon</h3>
    <pre><code>&lt;UtensilBadge icon="star" label="Featured" /&gt;

&lt;UtensilBadge icon="check" color="success"&gt;
  Done
&lt;/UtensilBadge&gt;</code></pre>

    <h3>Shape Options</h3>
    <pre><code>&lt;UtensilBadge rounded&gt;Pill&lt;/UtensilBadge&gt;
&lt;UtensilBadge squared icon="tag"&gt;Category&lt;/UtensilBadge&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from './UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
