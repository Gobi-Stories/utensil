<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilCheckbox</h1>
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
      A checkbox input with theme color support, indeterminate state, and configurable label positioning. Renders an SVG
      checkbox with animated transitions for check and indeterminate indicators.
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
          <td>Theme color applied to the checkbox when checked or indeterminate.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td><code>1</code></td>
          <td>Relative scale factor for the checkbox size.</td>
        </tr>
        <tr>
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Label text displayed next to the checkbox. Overridden by the default slot.</td>
        </tr>
        <tr>
          <td><code>labelPosition</code></td>
          <td><code>'start' | 'end'</code></td>
          <td><code>'end'</code></td>
          <td>Where to place the label relative to the checkbox.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disable the checkbox. Prevents toggling and reduces opacity.</td>
        </tr>
        <tr>
          <td><code>indeterminate</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Show the indeterminate (dash) indicator instead of a checkmark. Useful for "select all" patterns.</td>
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
          <td><code>update:modelValue</code></td>
          <td><code>boolean</code></td>
          <td>Fires when the checkbox is toggled (v-model binding).</td>
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
          <td>Custom label content. Rendered when no <code>label</code> prop is provided.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilCheckbox v-model="accepted" label="Accept terms" /&gt;

&lt;UtensilCheckbox v-model="notify" color="success" label="Enable notifications" /&gt;</code></pre>

    <h3>Indeterminate (Select All)</h3>
    <pre><code>&lt;UtensilCheckbox
  v-model="selectAll"
  :indeterminate="someButNotAll"
  label="Select all"
/&gt;</code></pre>

    <h3>Custom Slot Content</h3>
    <pre><code>&lt;UtensilCheckbox v-model="agreed"&gt;
  I agree to the &lt;a href="/terms"&gt;terms&lt;/a&gt;
&lt;/UtensilCheckbox&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
