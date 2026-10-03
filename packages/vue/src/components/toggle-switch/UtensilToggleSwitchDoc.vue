<template>
  <article class="text-code utensil-api-doc">
    <h1>UtensilToggleSwitch</h1>
    <p>
      A toggle switch for binary on/off settings. Supports custom on/off values, optional labels with block or inline
      placement, and keyboard interaction via Enter key.
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
          <td><code>modelValue</code></td>
          <td><code>boolean | string | number</code></td>
          <td><code>false</code></td>
          <td>Current value (v-model). Compared against <code>onValue</code> to determine the toggle state.</td>
        </tr>
        <tr>
          <td><code>onValue</code></td>
          <td><code>boolean | string | number</code></td>
          <td><code>true</code></td>
          <td>Value emitted when toggled on.</td>
        </tr>
        <tr>
          <td><code>offValue</code></td>
          <td><code>boolean | string | number</code></td>
          <td><code>false</code></td>
          <td>Value emitted when toggled off.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disable the switch. Prevents toggling and reduces opacity.</td>
        </tr>
        <tr>
          <td><code>id</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Custom ID for the input element. Auto-generated if omitted.</td>
        </tr>
        <tr>
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Label text displayed alongside the switch. Automatically linked via the input ID.</td>
        </tr>
        <tr>
          <td><code>labelPlacement</code></td>
          <td><code>'block' | 'inline'</code></td>
          <td><code>'block'</code></td>
          <td>Label position relative to the switch. Block stacks vertically, inline places side by side.</td>
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
          <td><code>boolean | string | number</code></td>
          <td>Fires when toggled. Emits <code>onValue</code> or <code>offValue</code> depending on the new state.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilToggleSwitch v-model="enabled" /&gt;

&lt;UtensilToggleSwitch v-model="status" onValue="active" offValue="inactive" /&gt;</code></pre>

    <h3>With Labels</h3>
    <pre><code>&lt;UtensilToggleSwitch v-model="notifications" label="Notifications" /&gt;

&lt;UtensilToggleSwitch v-model="darkMode" label="Dark mode" label-placement="inline" /&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
