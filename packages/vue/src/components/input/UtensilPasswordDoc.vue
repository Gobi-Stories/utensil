<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilPassword</h1>
    </div>
    <p>
      Password input with built-in visibility toggle. Shows a lock icon when unfocused, and an eye/eye-slash icon when
      focused to toggle between masked and plain text. Wraps <code>UtensilInput</code> internally.
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
          <td><code>string</code></td>
          <td>—</td>
          <td>The bound value. Use with <code>v-model</code>.</td>
        </tr>
        <tr>
          <td><code>id</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>HTML <code>id</code> attribute for the underlying input element.</td>
        </tr>
        <tr>
          <td><code>name</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>HTML <code>name</code> attribute for the underlying input element.</td>
        </tr>
        <tr>
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Label text displayed alongside the input.</td>
        </tr>
        <tr>
          <td><code>labelPlacement</code></td>
          <td><code>'block' | 'inline'</code></td>
          <td>—</td>
          <td>
            Controls whether the label appears above (<code>block</code>) or beside (<code>inline</code>) the input.
          </td>
        </tr>
        <tr>
          <td><code>placeholder</code></td>
          <td><code>string</code></td>
          <td><code>'Enter password'</code></td>
          <td>Placeholder text shown when the input is empty.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>'surface' | 'soft' | 'outline'</code></td>
          <td>—</td>
          <td>Visual style variation passed to the underlying <code>UtensilInput</code>.</td>
        </tr>
        <tr>
          <td><code>height</code></td>
          <td><code>'normal' | 'large'</code></td>
          <td><code>'normal'</code></td>
          <td>Controls vertical padding. Passed to the underlying <code>UtensilInput</code>.</td>
        </tr>
        <tr>
          <td><code>debounce</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Whether to debounce the model update.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disables the input.</td>
        </tr>
        <tr>
          <td><code>autofocus</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Automatically focuses the input on mount.</td>
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
          <td>Fires on each keystroke with the current value.</td>
        </tr>
        <tr>
          <td><code>change</code></td>
          <td><code>string</code></td>
          <td>Fires when the value changes and the input loses focus.</td>
        </tr>
        <tr>
          <td><code>focus</code></td>
          <td><code>FocusEvent</code></td>
          <td>Fires when the input receives focus. Switches the icon to eye/eye-slash.</td>
        </tr>
        <tr>
          <td><code>blur</code></td>
          <td><code>FocusEvent</code></td>
          <td>Fires when the input loses focus. Hides the password and resets the icon to lock.</td>
        </tr>
      </tbody>
    </table>

    <h2>Variations</h2>
    <div class="text-ui ui-variations-reference">
      <UtensilBadge variation="surface" scale="giant">Surface</UtensilBadge>
      <UtensilBadge variation="soft" scale="giant">Soft</UtensilBadge>
      <UtensilBadge variation="outline" scale="giant">Outline</UtensilBadge>
    </div>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilPassword v-model="password" /&gt;

&lt;UtensilPassword
  v-model="password"
  label="Password"
  placeholder="Create a password"
  variation="surface"
/&gt;</code></pre>

    <h3>With Label Placement</h3>
    <pre><code>&lt;UtensilPassword
  v-model="password"
  label="Password"
  label-placement="inline"
/&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
</script>

<style src="../../utensil-docs.css"></style>
