<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilSlideshow</h1>
    </div>
    <p>
      Headless slideshow primitive. Tracks the current index, exposes navigation methods and a left/right arrow key
      handler, and renders a window of indexes around the current one so consumers can pre-mount neighbours (useful for
      video preloading). Emits a <code>near-end</code> event when the current index approaches the end, suitable for
      driving pagination.
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
          <td><code>length</code></td>
          <td><code>number</code></td>
          <td>—</td>
          <td>Required. Total number of slides.</td>
        </tr>
        <tr>
          <td><code>modelValue</code></td>
          <td><code>number</code></td>
          <td><code>0</code></td>
          <td>Current slide index. Supports <code>v-model</code>.</td>
        </tr>
        <tr>
          <td><code>windowSize</code></td>
          <td><code>number</code></td>
          <td><code>3</code></td>
          <td>
            How many indexes are returned in the window slot scope, biased forward when
            <code>windowSize</code> is even.
          </td>
        </tr>
        <tr>
          <td><code>nearEndThreshold</code></td>
          <td><code>number</code></td>
          <td><code>5</code></td>
          <td><code>near-end</code> fires when <code>current &gt;= length - nearEndThreshold</code>.</td>
        </tr>
      </tbody>
    </table>

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
          <td>
            <code>{ current, window, hasNext, hasPrevious, next, previous, onKeydown }</code>
          </td>
          <td>
            Renders the slideshow content. <code>window</code> is an array of indexes to render. Bind
            <code>onKeydown</code> on the element that owns the slideshow's keys: the left and right arrows move to
            <code>previous</code>/<code>next</code>, and are left to the page at either end. Also exposed on the
            component instance, for keys owned by an element outside the slot.
          </td>
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
          <td>Fires when <code>next()</code> or <code>previous()</code> changes the index.</td>
        </tr>
        <tr>
          <td><code>near-end</code></td>
          <td><code>index: number</code></td>
          <td>Fires when the current index approaches the end of the list.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Slideshow</h3>
    <pre v-pre><code>&lt;UtensilSlideshow v-model="index" :length="items.length"&gt;
  &lt;template #default="{ current, window, next, previous, hasNext, hasPrevious, onKeydown }"&gt;
    &lt;div tabindex="0" @keydown="onKeydown"&gt;
      &lt;div v-for="i in window" :key="items[i].id" v-show="i === current"&gt;
        {{ items[i].title }}
      &lt;/div&gt;
    &lt;/div&gt;
    &lt;button :disabled="!hasPrevious" @click="previous"&gt;Prev&lt;/button&gt;
    &lt;button :disabled="!hasNext" @click="next"&gt;Next&lt;/button&gt;
  &lt;/template&gt;
&lt;/UtensilSlideshow&gt;</code></pre>

    <h3>Pagination</h3>
    <pre v-pre><code>&lt;UtensilSlideshow
  v-model="index"
  :length="items.length"
  :nearEndThreshold="5"
  @near-end="loadMore"
&gt;
  ...
&lt;/UtensilSlideshow&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
