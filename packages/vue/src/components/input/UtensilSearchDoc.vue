<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilSearch</h1>
    </div>
    <p>
      Specialized search input with built-in debouncing support. Wraps <code>UtensilInput</code> with
      <code>type="search"</code> and a search icon. Pressing <code>Escape</code> clears the field.
    </p>

    <!-- Props -->
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
          <td><code>''</code></td>
          <td>The search query value (v-model).</td>
        </tr>
        <tr>
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Accessible label for the input.</td>
        </tr>
        <tr>
          <td><code>labelPlacement</code></td>
          <td><code>'block' | 'inline'</code></td>
          <td>—</td>
          <td>Controls whether the label appears above or beside the input.</td>
        </tr>
        <tr>
          <td><code>placeholder</code></td>
          <td><code>string</code></td>
          <td><code>'Search...'</code></td>
          <td>Placeholder text shown when the field is empty.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>'surface' | 'soft' | 'outline'</code></td>
          <td>—</td>
          <td>Visual style variation.</td>
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
          <td>When true, debounces the <code>update:modelValue</code> emission during typing with a 500ms delay.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disables the search input.</td>
        </tr>
        <tr>
          <td><code>autofocus</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Automatically focuses the input on mount.</td>
        </tr>
      </tbody>
    </table>

    <!-- Events -->
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
          <td><code>string</code></td>
          <td>
            Fires when the search value changes. Debounced by 500ms during typing when <code>debounce</code> is true.
            Also fires immediately on blur, change, search submit, and Escape clear.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Variations -->
    <h2>Variations</h2>
    <div class="text-ui ui-variations-reference">
      <UtensilBadge variation="surface" scale="giant">Surface</UtensilBadge>
      <UtensilBadge variation="soft" scale="giant">Soft</UtensilBadge>
      <UtensilBadge variation="outline" scale="giant">Outline</UtensilBadge>
    </div>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilSearch v-model="query" /&gt;

&lt;UtensilSearch
  v-model="query"
  placeholder="Search products..."
  variation="soft"
/&gt;</code></pre>

    <h3>With Debounce</h3>
    <pre><code>&lt;UtensilSearch v-model="query" :debounce="true" /&gt;</code></pre>

    <h3>With Label</h3>
    <pre><code>&lt;UtensilSearch v-model="query" label="Search" /&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
</script>

<style src="../../utensil-docs.css"></style>
