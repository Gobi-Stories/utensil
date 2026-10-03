<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilScroller</h1>
    </div>
    <p>
      Scrollable container with optional envelope shadow indicators that reveal when content overflows beyond the
      visible area. Supports both vertical and horizontal scrolling. The component uses
      <code>IntersectionObserver</code> to detect scroll position and applies inset box-shadow cues at the start and end
      edges.
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
          <td><code>envelope</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Enables shadow indicators at the scroll edges to signal overflowing content.</td>
        </tr>
        <tr>
          <td><code>horizontal</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Switches envelope shadows from vertical (top/bottom) to horizontal (left/right).</td>
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
          <td><code>update:canScroll</code></td>
          <td><code>boolean</code></td>
          <td>
            Emitted when the scrollability state changes. <code>true</code> when content overflows in either direction,
            <code>false</code> when all content is visible. Requires <code>envelope</code> to be enabled.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Slots -->
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
          <td>
            Scrollable content. The consumer is responsible for setting overflow and dimensions on either the scroller
            or the content.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Vertical with Envelope</h3>
    <pre v-pre><code>&lt;UtensilScroller envelope class="my-scroller"&gt;
  &lt;div class="long-list"&gt;
    &lt;div v-for="item in items" :key="item.id"&gt;{{ item.name }}&lt;/div&gt;
  &lt;/div&gt;
&lt;/UtensilScroller&gt;</code></pre>

    <h3>Horizontal with Scroll Detection</h3>
    <pre v-pre><code>&lt;UtensilScroller horizontal envelope @update:canScroll="hasOverflow = $event"&gt;
  &lt;div class="horizontal-strip"&gt;
    &lt;div v-for="tab in tabs" :key="tab.id"&gt;{{ tab.label }}&lt;/div&gt;
  &lt;/div&gt;
&lt;/UtensilScroller&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
