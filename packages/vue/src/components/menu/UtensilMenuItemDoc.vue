<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilMenuItem</h1>
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
      An individual item inside a <code>UtensilMenu</code>. Supports labels, icons, keyboard shortcuts, color styling,
      and disabled state. Participates in the parent menu's keyboard navigation automatically via the
      <code>data-focusable</code> attribute.
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
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Display label for the menu item. Overridden by the default slot.</td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td><code>IconProp</code></td>
          <td>—</td>
          <td>Icon displayed before the label. Theme-typed.</td>
        </tr>
        <tr>
          <td><code>iconColor</code></td>
          <td><code>ColorProp</code></td>
          <td>—</td>
          <td>Colors the icon alone, leaving the label as is. Theme-typed. Useful for marking a state on the item.</td>
        </tr>
        <tr>
          <td><code>shortcut</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Keyboard shortcut hint displayed on the right side of the item.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disables the item. Prevents click, removes it from keyboard navigation, and applies reduced opacity.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td>—</td>
          <td>Applies a color to the item text and hover background. Theme-typed. Useful for destructive actions.</td>
        </tr>
        <tr>
          <td><code>highlighted</code></td>
          <td><code>boolean</code></td>
          <td>—</td>
          <td>Applies a persistent highlighted background using the current color.</td>
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
          <td><code>click</code></td>
          <td>—</td>
          <td>Fires when the item is clicked, or activated via Enter or Space. Does not fire when disabled.</td>
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
          <td>Custom label content. Overrides the <code>label</code> prop.</td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td>—</td>
          <td>Custom icon content. Overrides the <code>icon</code> prop.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilMenuItem label="Edit" icon="edit" @click="edit()" /&gt;

&lt;UtensilMenuItem
  icon="trash-alt"
  label="Delete"
  color="red"
  @click="remove()"
/&gt;</code></pre>

    <h3>With Shortcut and Custom Content</h3>
    <pre><code>&lt;UtensilMenuItem
  icon="download"
  label="Download"
  shortcut="Shift + D"
  @click="download()"
/&gt;

&lt;UtensilMenuItem icon="cut" @click="cut()"&gt;
  &lt;span&gt;Custom slot content&lt;/span&gt;
&lt;/UtensilMenuItem&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'

// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
