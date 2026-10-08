<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilEntrance</h1>
    </div>
    <p>
      Applies a staggered fade-up entrance animation to each direct child element. Children appear one after another
      with a configurable delay between each. No participation from children is required — the component automatically
      detects and animates all direct children. Respects reduced motion preferences by skipping animations.
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
          <td><code>speed</code></td>
          <td><code>'normal' | 'fast'</code></td>
          <td><code>'normal'</code></td>
          <td>
            Preset timing and distance. <code>normal</code> is a gentle, staggered entrance (500ms, 120ms stagger, 80ms
            delay, 16px). <code>fast</code> fades every child up at once (280ms, no stagger or delay, 6px), for content
            that changes often, such as the steps of a workflow. <code>duration</code>, <code>stagger</code>,
            <code>delay</code> and <code>distance</code> override it.
          </td>
        </tr>
        <tr>
          <td><code>duration</code></td>
          <td><code>number</code></td>
          <td>by <code>speed</code></td>
          <td>Animation duration in milliseconds for each child.</td>
        </tr>
        <tr>
          <td><code>stagger</code></td>
          <td><code>number</code></td>
          <td>by <code>speed</code></td>
          <td>Delay in milliseconds between each child's animation start.</td>
        </tr>
        <tr>
          <td><code>delay</code></td>
          <td><code>number</code></td>
          <td>by <code>speed</code></td>
          <td>Initial delay in milliseconds before the first child animates.</td>
        </tr>
        <tr>
          <td><code>distance</code></td>
          <td><code>number</code></td>
          <td>by <code>speed</code></td>
          <td>Vertical translation distance in pixels.</td>
        </tr>
        <tr>
          <td><code>enabled</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Whether the entrance animation is active. When disabled, children render immediately.</td>
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
          <td>Content to animate. Each direct child element receives a staggered entrance animation.</td>
        </tr>
      </tbody>
    </table>

    <!-- Methods -->
    <h2>Methods</h2>
    <table>
      <thead>
        <tr>
          <th>Method</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>replay()</code></td>
          <td>Resets and replays the entrance animation for all children.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Hero Section</h3>
    <pre v-pre><code>&lt;UtensilEntrance&gt;
  &lt;p class="eyebrow"&gt;Welcome&lt;/p&gt;
  &lt;h1&gt;Page Title&lt;/h1&gt;
  &lt;p&gt;Subtitle text&lt;/p&gt;
  &lt;div class="actions"&gt;...&lt;/div&gt;
&lt;/UtensilEntrance&gt;</code></pre>

    <h3>Replay via Ref</h3>
    <pre v-pre><code>&lt;UtensilEntrance ref="entranceRef"&gt;
  &lt;div&gt;Content&lt;/div&gt;
&lt;/UtensilEntrance&gt;

entranceRef.value?.replay()</code></pre>

    <h3>Fast, for Workflow Steps</h3>
    <pre v-pre><code>&lt;UtensilEntrance :key="step" speed="fast"&gt;
  &lt;StepBody /&gt;
  &lt;StepActions /&gt;
&lt;/UtensilEntrance&gt;</code></pre>

    <h3>Disabled</h3>
    <pre v-pre><code>&lt;UtensilEntrance :enabled="false"&gt;
  &lt;p&gt;Renders immediately without animation.&lt;/p&gt;
&lt;/UtensilEntrance&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
