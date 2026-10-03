<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilSkeleton</h1>
    </div>
    <p>
      Placeholder loading skeleton that displays an animated shimmer effect while content is loading. Renders with
      <code>role="status"</code> and <code>aria-busy="true"</code> for accessibility. Respects reduced motion
      preferences by disabling the shimmer animation.
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
          <td><code>width</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>CSS width of the skeleton (e.g. <code>'100%'</code>, <code>'200px'</code>).</td>
        </tr>
        <tr>
          <td><code>height</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>CSS height of the skeleton (e.g. <code>'var(--space-4)'</code>).</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Loading...'</code></td>
          <td>Accessible label announced by screen readers.</td>
        </tr>
        <tr>
          <td><code>rounded</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Applies a fully rounded border radius (pill shape).</td>
        </tr>
        <tr>
          <td><code>circle</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Makes the skeleton circular with a 1:1 aspect ratio. Only <code>width</code> is needed.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Text Lines</h3>
    <pre v-pre><code>&lt;UtensilSkeleton width="100%" height="var(--space-4)" /&gt;
&lt;UtensilSkeleton width="80%" height="var(--space-4)" /&gt;
&lt;UtensilSkeleton width="60%" height="var(--space-4)" /&gt;</code></pre>

    <h3>Circle Avatar</h3>
    <pre v-pre><code>&lt;UtensilSkeleton circle width="48px" /&gt;</code></pre>

    <h3>Rounded Pill</h3>
    <pre v-pre><code>&lt;UtensilSkeleton rounded width="100%" height="var(--space-5)" /&gt;</code></pre>

    <h3>Loading to Content Transition</h3>
    <pre v-pre><code>&lt;template v-if="loading"&gt;
  &lt;UtensilSkeleton circle width="48px" /&gt;
  &lt;UtensilSkeleton width="60%" height="var(--space-4)" /&gt;
&lt;/template&gt;
&lt;template v-else&gt;
  &lt;!-- Resolved content --&gt;
&lt;/template&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
