<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilCallout</h1>
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
      Displays a short message to attract user attention. Used for notifications, warnings, and important contextual
      information. Supports an optional icon and multiple visual variations.
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
          <td>Theme color applied to the callout.</td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td><code>IconProp</code></td>
          <td>—</td>
          <td>Icon displayed before the content.</td>
        </tr>
        <tr>
          <td><code>iconColor</code></td>
          <td><code>ColorProp</code></td>
          <td>—</td>
          <td>Override color for the icon independently from the callout color.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>'soft' | 'surface' | 'outline'</code></td>
          <td><code>'soft'</code></td>
          <td>Visual style. See Variations below.</td>
        </tr>
        <tr>
          <td><code>textPencil</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Use pencil (neutral) color for text content instead of the pen color.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td><code>1</code></td>
          <td>Relative size scaling.</td>
        </tr>
        <tr>
          <td><code>role</code></td>
          <td><code>'alert' | 'status'</code></td>
          <td>—</td>
          <td>
            ARIA role for accessibility. Use <code>'alert'</code> for urgent messages announced by screen readers.
          </td>
        </tr>
        <tr>
          <td><code>center</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Vertically center-align the icon and content.</td>
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
          <td>Callout message content.</td>
        </tr>
      </tbody>
    </table>

    <h2>Variations</h2>
    <div class="text-ui ui-variations-reference">
      <UtensilBadge variation="soft" scale="giant">Soft</UtensilBadge>
      <UtensilBadge variation="surface" scale="giant">Surface</UtensilBadge>
      <UtensilBadge variation="outline" scale="giant">Outline</UtensilBadge>
    </div>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilCallout icon="info-circle"&gt;
  This is an informational callout.
&lt;/UtensilCallout&gt;</code></pre>

    <h3>Semantic Colors</h3>
    <pre><code>&lt;UtensilCallout color="success" icon="check-circle"&gt;
  Operation completed successfully.
&lt;/UtensilCallout&gt;

&lt;UtensilCallout color="error" icon="exclamation-circle" role="alert"&gt;
  An error occurred. Please try again.
&lt;/UtensilCallout&gt;</code></pre>

    <h3>Surface Variation with Pencil Text</h3>
    <pre><code>&lt;UtensilCallout variation="surface" color="warning" icon="exclamation-triangle" text-pencil&gt;
  Review the changes before continuing.
&lt;/UtensilCallout&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
