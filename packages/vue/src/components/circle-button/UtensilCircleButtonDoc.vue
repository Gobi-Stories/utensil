<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilCircleButton</h1>
      <UtensilPopoverPanel :offset="0">
        <template #trigger="{ toggle }">
          <UtensilBadge class="theme-props-badge" scale="large" @click="toggle">Theme Props</UtensilBadge>
        </template>
        <div class="theme-props-note">
          <span>Use a typed wrapper to use your theme values. See the Usage Guide.</span>
        </div>
      </UtensilPopoverPanel>
    </div>
    <p>
      A circular icon button for compact actions. Renders a round button with a single icon and screen-reader
      description. Supports all UI variations, theme colors, and relative scaling.
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
          <td><code>icon</code></td>
          <td><code>IconProp</code></td>
          <td><code>'times'</code></td>
          <td>Icon displayed inside the button.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td><code>'soft'</code></td>
          <td>Visual style. See Variations below.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pencil'</code></td>
          <td>Theme color applied to the button.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td><code>1</code></td>
          <td>Relative size scaling.</td>
        </tr>
        <tr>
          <td><code>description</code></td>
          <td><code>string</code></td>
          <td><code>'Button'</code></td>
          <td>Screen-reader accessible label.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disable the button.</td>
        </tr>
      </tbody>
    </table>

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
          <td><code>click</code></td>
          <td><code>MouseEvent</code></td>
          <td>Fires on click. Suppressed when <code>disabled</code>.</td>
        </tr>
      </tbody>
    </table>

    <h2>Variations</h2>
    <div class="text-ui ui-variations-reference">
      <UtensilBadge variation="solid" scale="giant">Solid</UtensilBadge>
      <UtensilBadge variation="soft" scale="giant">Soft</UtensilBadge>
      <UtensilBadge variation="text" scale="giant">Text</UtensilBadge>
      <UtensilBadge variation="outline" scale="giant">Outline</UtensilBadge>
      <UtensilBadge variation="surface" scale="giant">Surface</UtensilBadge>
      <UtensilBadge variation="overlay" scale="giant">Overlay</UtensilBadge>
    </div>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilCircleButton icon="plus" description="Add item" /&gt;

&lt;UtensilCircleButton
  icon="check"
  variation="solid"
  color="success"
  description="Accept"
/&gt;</code></pre>

    <h3>Scaled</h3>
    <pre><code>&lt;UtensilCircleButton icon="cog" scale="large" /&gt;

&lt;UtensilCircleButton icon="cog" :scale="0.8" /&gt;</code></pre>

    <h3>Overlay on Media</h3>
    <pre><code>&lt;UtensilCircleButton
  icon="circle-play"
  variation="overlay"
  :scale="2"
  description="Play video"
/&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
