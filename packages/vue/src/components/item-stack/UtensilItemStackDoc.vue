<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilItemStack</h1>
    </div>
    <p>
      A vertical stack that animates its items in and out. A new item fades in while a gap opens for it; a removed item
      fades out in place while the remaining items glide together to close the gap, and reordered items glide to their
      new positions. Items are arbitrary elements — each direct child needs a stable <code>key</code> for the
      transitions to track it. Respects reduced motion preferences by dropping the movement and keeping only the fades.
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
          <td><code>tag</code></td>
          <td><code>string</code></td>
          <td><code>'div'</code></td>
          <td>Element the stack renders as.</td>
        </tr>
      </tbody>
    </table>

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
          <td>The stacked items. Every direct child must carry a stable <code>key</code>.</td>
        </tr>
      </tbody>
    </table>

    <!-- Cvars -->
    <h2>CSS Cvars</h2>
    <table>
      <thead>
        <tr>
          <th>Cvar</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>--utensil-item-stack-gap</code></td>
          <td><code>var(--space-2)</code></td>
          <td>Gap between stacked items.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Animated List</h3>
    <pre v-pre><code>&lt;UtensilItemStack&gt;
  &lt;div v-for="item in items" :key="item.id" class="card"&gt;
    {{ item.label }}
  &lt;/div&gt;
&lt;/UtensilItemStack&gt;</code></pre>

    <h3>Semantic List</h3>
    <pre v-pre><code>&lt;UtensilItemStack tag="ul"&gt;
  &lt;li v-for="entry in entries" :key="entry.id"&gt;{{ entry.text }}&lt;/li&gt;
&lt;/UtensilItemStack&gt;</code></pre>

    <h3>Wider Gap</h3>
    <pre v-pre><code>&lt;UtensilItemStack style="--utensil-item-stack-gap: var(--space-4)"&gt;
  ...
&lt;/UtensilItemStack&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
