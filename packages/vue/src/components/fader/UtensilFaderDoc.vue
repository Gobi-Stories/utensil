<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilFader</h1>
    </div>
    <p>
      Fade transition wrapper for smooth show/hide animations. Wraps Vue's built-in
      <code>&lt;transition&gt;</code> component with configurable fade-in and fade-out behavior, optional delays, and a
      one-shot mode that disables the animation after the first appearance.
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
          <td><code>show</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Controls visibility of the slotted content.</td>
        </tr>
        <tr>
          <td><code>enabled</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>
            When <code>false</code>, the transition is bypassed entirely and content appears or disappears instantly.
          </td>
        </tr>
        <tr>
          <td><code>name</code></td>
          <td><code>string</code></td>
          <td><code>'utensil-fader'</code></td>
          <td>CSS transition name. Override to supply a custom transition class prefix.</td>
        </tr>
        <tr>
          <td><code>once</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>When <code>true</code>, the fade-in animation only runs once. Subsequent shows appear instantly.</td>
        </tr>
        <tr>
          <td><code>fadeIn</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Enables the fade-in animation when content appears.</td>
        </tr>
        <tr>
          <td><code>fadeOut</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>
            Enables the fade-out animation when content disappears. When off, the content is removed in the same update
            that hides it — no transition holds it on screen.
          </td>
        </tr>
        <tr>
          <td><code>inDelay</code></td>
          <td><code>number</code></td>
          <td><code>0</code></td>
          <td>
            Milliseconds after mount before fade-in activates. If <code>show</code> becomes <code>true</code> before
            this time elapses, the content appears instantly instead of fading. Useful for avoiding a flash of animation
            on fast initial loads.
          </td>
        </tr>
        <tr>
          <td><code>outDelay</code></td>
          <td><code>number</code></td>
          <td><code>0</code></td>
          <td>
            Milliseconds to wait after <code>show</code> becomes <code>false</code> before beginning the hide
            transition. If <code>show</code> returns to <code>true</code> during this window, the content stays visible.
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
          <td>Content to fade in and out. Must be a single root element (Vue transition requirement).</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Fade</h3>
    <pre v-pre><code>&lt;UtensilFader :show="visible"&gt;
  &lt;div&gt;This content fades in and out.&lt;/div&gt;
&lt;/UtensilFader&gt;</code></pre>

    <h3>Delayed Fade-out (Tooltip-style)</h3>
    <pre v-pre><code>&lt;UtensilFader :show="hovered" :out-delay="300"&gt;
  &lt;div class="tooltip"&gt;Stays visible briefly after hover ends&lt;/div&gt;
&lt;/UtensilFader&gt;</code></pre>

    <h3>Suppress Animation on Fast Mount</h3>
    <pre v-pre><code>&lt;UtensilFader :show="loaded" :in-delay="500"&gt;
  &lt;div&gt;Appears instantly if data loads within 500ms, fades in otherwise.&lt;/div&gt;
&lt;/UtensilFader&gt;</code></pre>

    <h3>One-shot Fade</h3>
    <pre v-pre><code>&lt;UtensilFader :show="visible" once&gt;
  &lt;div&gt;Fades in the first time, then shows instantly on subsequent toggles.&lt;/div&gt;
&lt;/UtensilFader&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
