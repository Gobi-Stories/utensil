<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilAvatar</h1>
      <UtensilPopoverPanel :offset="0">
        <template #trigger="{ toggle }">
          <UtensilBadge class="theme-props-badge" scale="large" @click="toggle">Theme Props</UtensilBadge>
        </template>
        <div class="theme-props-note">
          <span>Create a typed wrapper for your theme. See the Usage Guide.</span>
        </div>
      </UtensilPopoverPanel>
    </div>
    <p>
      Displays a user avatar with an image, icon, or text fallback. Automatically shows initials or custom fallback
      content when the image is unavailable or still loading.
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
          <td><code>src</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Image URL for the avatar.</td>
        </tr>
        <tr>
          <td><code>alt</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Alt text for the image. Falls back to the <code>fallback</code> value for the aria-label.</td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td><code>IconProp</code></td>
          <td>—</td>
          <td>Icon to display when no <code>src</code> is provided.</td>
        </tr>
        <tr>
          <td><code>fallback</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Text shown when the image is not loaded and no icon is set. Typically initials.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>'solid' | 'soft'</code></td>
          <td><code>'soft'</code></td>
          <td>Visual style for the fallback background.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Theme color applied to the avatar.</td>
        </tr>
        <tr>
          <td><code>radius</code></td>
          <td><code>'none' | 'small' | 'medium' | 'large' | 'full'</code></td>
          <td><code>'full'</code></td>
          <td>Border radius shape.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td><code>1</code></td>
          <td>Relative size scaling.</td>
        </tr>
        <tr>
          <td><code>delayMs</code></td>
          <td><code>number</code></td>
          <td><code>0</code></td>
          <td>Delay in milliseconds before revealing the loaded image. Useful for staggered transitions.</td>
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
          <td><code>load</code></td>
          <td>—</td>
          <td>Fires when the image loads successfully.</td>
        </tr>
        <tr>
          <td><code>error</code></td>
          <td>—</td>
          <td>Fires when the image fails to load.</td>
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
          <td><code>fallback</code></td>
          <td>—</td>
          <td>Custom fallback content. Overrides the <code>fallback</code> prop text.</td>
        </tr>
      </tbody>
    </table>

    <h2>Variations</h2>
    <div class="text-ui ui-variations-reference">
      <UtensilBadge variation="solid" scale="giant">Solid</UtensilBadge>
      <UtensilBadge variation="soft" scale="giant">Soft</UtensilBadge>
    </div>

    <h2>CSS Cvars</h2>
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
          <td><code>--utensil-avatar-size</code></td>
          <td><code>--space-7</code></td>
          <td>Override the avatar dimensions (width and height).</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilAvatar src="/photo.jpg" alt="Jane Doe" fallback="JD" /&gt;

&lt;UtensilAvatar fallback="AB" color="success" /&gt;</code></pre>

    <h3>With Custom Fallback</h3>
    <pre><code>&lt;UtensilAvatar variation="solid" color="success"&gt;
  &lt;template #fallback&gt;
    &lt;UtensilIcon icon="check" /&gt;
  &lt;/template&gt;
&lt;/UtensilAvatar&gt;</code></pre>

    <h3>Shape and Scale</h3>
    <pre><code>&lt;UtensilAvatar fallback="M" radius="medium" scale="large" /&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
