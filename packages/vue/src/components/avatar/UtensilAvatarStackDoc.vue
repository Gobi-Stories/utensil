<template>
  <article class="text-code utensil-api-doc">
    <h1>UtensilAvatarStack</h1>
    <p>
      Displays a row of overlapping avatars. Provides shared <code>radius</code> and <code>scale</code> to children via
      <code>provide</code>/<code>inject</code>, and includes an <code>append</code> slot for overflow counts or extra
      content.
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
          <td><code>overlap</code></td>
          <td><code>1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9</code></td>
          <td><code>2</code></td>
          <td>Spacing token index controlling how much avatars overlap. Higher values produce tighter stacking.</td>
        </tr>
        <tr>
          <td><code>radius</code></td>
          <td><code>'none' | 'small' | 'medium' | 'large' | 'full'</code></td>
          <td><code>'full'</code></td>
          <td>Shared border radius applied to all stacked avatars via context.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td><code>1</code></td>
          <td>Shared relative size scaling applied to all stacked avatars via context.</td>
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
          <td>—</td>
          <td>Avatar items to display in the stack.</td>
        </tr>
        <tr>
          <td><code>append</code></td>
          <td>—</td>
          <td>Content rendered after the avatars, typically an overflow count like "+12".</td>
        </tr>
      </tbody>
    </table>

    <h2>Child Participation</h2>
    <p>
      Child avatars receive shared <code>radius</code> and <code>scale</code> from the stack via
      <code>provide</code>/<code>inject</code> using the <code>UtensilAvatarStackContextKey</code>. Children that inject
      this context will automatically inherit the stack's configuration.
    </p>

    <h3>Provided Context</h3>
    <table>
      <thead>
        <tr>
          <th>Property</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>radius</code></td>
          <td><code>Ref&lt;AvatarRadius&gt;</code></td>
          <td>Shared border radius for all children.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>Ref&lt;ScaleProp&gt;</code></td>
          <td>Shared size scale for all children.</td>
        </tr>
      </tbody>
    </table>

    <h3>CSS Cvars from Parent</h3>
    <table>
      <thead>
        <tr>
          <th>Variable</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>--stack-overlap</code></td>
          <td>Negative margin applied to child avatars to create the overlapping effect.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilAvatarStack&gt;
  &lt;UtensilAvatar fallback="A" color="blue" /&gt;
  &lt;UtensilAvatar fallback="B" color="green" /&gt;
  &lt;UtensilAvatar fallback="C" color="orange" /&gt;
&lt;/UtensilAvatarStack&gt;</code></pre>

    <h3>With Overflow Count</h3>
    <pre><code>&lt;UtensilAvatarStack&gt;
  &lt;UtensilAvatar fallback="A" /&gt;
  &lt;UtensilAvatar fallback="B" /&gt;
  &lt;template #append&gt;+12&lt;/template&gt;
&lt;/UtensilAvatarStack&gt;</code></pre>

    <h3>Custom Overlap and Shared Config</h3>
    <pre><code>&lt;UtensilAvatarStack :overlap="4" radius="medium" scale="small"&gt;
  &lt;UtensilAvatar fallback="A" color="blue" /&gt;
  &lt;UtensilAvatar fallback="B" color="green" /&gt;
  &lt;UtensilAvatar fallback="C" color="orange" /&gt;
&lt;/UtensilAvatarStack&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
