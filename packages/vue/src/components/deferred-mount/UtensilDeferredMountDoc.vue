<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilDeferredMount</h1>
    </div>
    <p>
      Defers mounting its content until the browser has painted, so cheap UI — navigation highlights, page chrome —
      isn't held behind a heavy subtree's first render. The surrounding view paints first and the deferred content
      mounts a configurable number of frames later. While waiting, the placeholder slot renders in its place.
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
          <td><code>active</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>
            Mount the content. Turning this on starts the deferral; turning it off unmounts the content immediately and
            re-arms the deferral for the next activation.
          </td>
        </tr>
        <tr>
          <td><code>frames</code></td>
          <td><code>number</code></td>
          <td><code>1</code></td>
          <td>Painted frames to let through before the content mounts.</td>
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
          <td>The deferred content. Mounted after the configured number of painted frames.</td>
        </tr>
        <tr>
          <td><code>placeholder</code></td>
          <td>Rendered in place of the content while it waits — a skeleton or empty state.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Heavy Grid Behind Page Chrome</h3>
    <pre v-pre><code>&lt;UtensilDeferredMount&gt;
  &lt;HeavyGrid :items="items" /&gt;
  &lt;template #placeholder&gt;
    &lt;GridSkeleton /&gt;
  &lt;/template&gt;
&lt;/UtensilDeferredMount&gt;</code></pre>

    <h3>Re-Arming on View Switches</h3>
    <pre v-pre><code>&lt;!-- The grid unmounts while the tool view is open and defers again on return --&gt;
&lt;UtensilDeferredMount :active="!toolOpen"&gt;
  &lt;AssetGrid :items="items" /&gt;
&lt;/UtensilDeferredMount&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
