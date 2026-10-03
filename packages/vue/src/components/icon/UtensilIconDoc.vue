<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilIcon</h1>
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
      Renders a Font Awesome icon from the theme's registered icon set, or a custom SVG provided via the default slot.
      When using the <code>icon</code> prop, icons are resolved via the theme's <code>icons</code> map using
      <code>provide</code>/<code>inject</code>. Unregistered icon names fall back to a question-mark icon and log a
      warning in development. When no <code>icon</code> prop is provided, the default slot is rendered allowing custom
      SVG icons.
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
          <td>—</td>
          <td>Name of the icon registered in the theme config. When provided, renders the Font Awesome icon.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td>—</td>
          <td>Theme color applied to the icon via <code>--pen-indicator</code>.</td>
        </tr>
        <tr>
          <td><code>role</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>ARIA role passed to the underlying element.</td>
        </tr>
      </tbody>
    </table>

    <h2>Slots</h2>
    <h3>#default</h3>
    <p>
      Custom icon content, typically an inline SVG. Used when no <code>icon</code> prop is provided. The wrapper matches
      Font Awesome's sizing (<code>1.25em</code> wide, <code>1em</code> tall) for consistent alignment. The child SVG is
      sized to <code>1em &times; 1em</code>.
    </p>

    <h2>Custom SVG Guidelines</h2>
    <p>To ensure custom SVGs render consistently alongside theme icons:</p>
    <table>
      <thead>
        <tr>
          <th>Requirement</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>viewBox</code></td>
          <td>
            Always set a <code>viewBox</code> attribute (e.g. <code>"0 0 24 24"</code>). Omitting it prevents proper
            scaling.
          </td>
        </tr>
        <tr>
          <td>Use <code>currentColor</code></td>
          <td>
            For filled icons, set <code>fill="currentColor"</code> on the SVG element. For stroked icons, set
            <code>fill="none"</code> and <code>stroke="currentColor"</code>. This allows the <code>color</code> prop to
            control the icon color.
          </td>
        </tr>
        <tr>
          <td>No width/height attributes</td>
          <td>
            Do not set <code>width</code> or <code>height</code> on the SVG element. The wrapper sizes the SVG to
            <code>1em</code>.
          </td>
        </tr>
        <tr>
          <td>Stroked paths</td>
          <td>
            For stroke-based icons, use <code>stroke="currentColor"</code> and <code>fill="none"</code> explicitly.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Theme Icon</h3>
    <pre><code>&lt;UtensilIcon icon="star" /&gt;

&lt;UtensilIcon icon="heart" color="error" /&gt;</code></pre>

    <h3>Custom SVG Icon</h3>
    <pre><code>&lt;!-- Filled icon --&gt;
&lt;UtensilIcon&gt;
  &lt;svg viewBox="0 0 512 512" fill="currentColor"&gt;
    &lt;path d="..." /&gt;
  &lt;/svg&gt;
&lt;/UtensilIcon&gt;

&lt;!-- Stroked icon --&gt;
&lt;UtensilIcon&gt;
  &lt;svg viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.6"&gt;
    &lt;circle cx="9" cy="7" r="4" /&gt;
  &lt;/svg&gt;
&lt;/UtensilIcon&gt;</code></pre>

    <h3>Conditional Rendering</h3>
    <pre><code>&lt;UtensilIcon v-if="icon" :icon="icon" /&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
