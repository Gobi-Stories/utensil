<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilPageIndicator</h1>
    </div>
    <p>
      A row of dots, one per page, with the current page drawn as a pill in the pen color. Each dot is a button that
      jumps to its page, so the indicator navigates as well as shows position. Pair it with a
      <code>UtensilDeck</code> or any paged content: bind the page index with <code>v-model</code> and drive the content
      from the same index.
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
          <td><code>count</code></td>
          <td><code>number</code></td>
          <td>—</td>
          <td>Required. How many pages there are.</td>
        </tr>
        <tr>
          <td><code>modelValue</code></td>
          <td><code>number</code></td>
          <td><code>0</code></td>
          <td>Zero-based index of the current page. Use <code>v-model</code>.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Accent color of the current page's marker.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td><code>1</code></td>
          <td>Relative scale of the markers and their spacing.</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Pages'</code></td>
          <td>Accessible name for the group.</td>
        </tr>
        <tr>
          <td><code>pageName</code></td>
          <td><code>string</code></td>
          <td><code>'Page'</code></td>
          <td>Noun in each marker's accessible name, read as "Page 2 of 5".</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Dims the indicator and stops the markers navigating.</td>
        </tr>
      </tbody>
    </table>

    <h2>Emits</h2>
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
          <td><code>index: number</code></td>
          <td>A marker was activated; the payload is its zero-based page index.</td>
        </tr>
      </tbody>
    </table>

    <h2>CSS Variables</h2>
    <table>
      <thead>
        <tr>
          <th>Variable</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>--utensil-page-indicator-dot-size</code></td>
          <td><code>var(--space-2)</code></td>
          <td>Diameter of each marker.</td>
        </tr>
        <tr>
          <td><code>--utensil-page-indicator-gap</code></td>
          <td><code>var(--space-2)</code></td>
          <td>Space between markers. Half of it on each side is also the marker's extra hit area.</td>
        </tr>
        <tr>
          <td><code>--utensil-page-indicator-current-width</code></td>
          <td><code>3 × dot size</code></td>
          <td>Width of the current page's pill.</td>
        </tr>
      </tbody>
    </table>

    <h2>Example</h2>
    <pre v-pre><code>&lt;UtensilDeck :current="screens[page]"&gt;…&lt;/UtensilDeck&gt;
&lt;UtensilPageIndicator v-model="page" :count="screens.length" pageName="Screen" ariaLabel="Screens" /&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
