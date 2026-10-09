<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilReorderableListGroup</h1>
    </div>
    <p>
      Renderless provider that lets descendant <code>UtensilReorderableList</code> components with a matching
      <code>namespace</code> accept each other's items — the component form of
      <code>provideReorderableGroup()</code> for consumers that prefer a template wrapper over a composable call. It
      renders only its slot content. Has no props, events, or slot scope.
    </p>

    <!-- Slots -->
    <h2>Slots</h2>
    <table>
      <thead>
        <tr>
          <th>Slot</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>default</code></td>
          <td>The subtree containing the grouped lists. Lists may be nested at any depth.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Grouped Lists</h3>
    <pre v-pre><code>&lt;UtensilReorderableListGroup&gt;
  &lt;UtensilReorderableList namespace="cards" ...&gt;...&lt;/UtensilReorderableList&gt;
  &lt;UtensilReorderableList namespace="cards" ...&gt;...&lt;/UtensilReorderableList&gt;
&lt;/UtensilReorderableListGroup&gt;</code></pre>

    <h3>Composable Form</h3>
    <pre
      v-pre
    ><code>import { provideReorderableGroup } from '@gobistories/utensil-vue/components/reorderable-list/utensil-reorderable-list'

// In a common ancestor's setup
provideReorderableGroup()</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
