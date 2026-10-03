<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilMenuDivider</h1>
    </div>
    <p>
      A visual separator for grouping related items inside a menu. Renders a thin horizontal line with
      <code>role="separator"</code> for accessibility. Has no props, events, or slots.
    </p>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilMenuItem label="Copy" @click="copy()" /&gt;
&lt;UtensilMenuItem label="Paste" @click="paste()" /&gt;
&lt;UtensilMenuDivider /&gt;
&lt;UtensilMenuItem label="Delete" color="red" @click="remove()" /&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
