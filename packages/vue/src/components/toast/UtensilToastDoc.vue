<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilToast</h1>
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
      A non-blocking feedback notification that appears briefly at the bottom of the viewport. Uses a transition for
      smooth enter/leave animation. Typically driven by a composable that sets the message and auto-clears it after a
      timeout.
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
          <td><code>message</code></td>
          <td><code>string</code></td>
          <td><code>''</code></td>
          <td>Text to display. The toast is visible when this is non-empty and hidden when empty.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td>—</td>
          <td>Theme color. When set, the toast uses a solid pen background instead of the default neutral style.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td>—</td>
          <td>Relative scale override for the toast.</td>
        </tr>
        <tr>
          <td><code>busy</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Shows a spinner before the message. Hidden when <code>progress</code> is defined.</td>
        </tr>
        <tr>
          <td><code>progress</code></td>
          <td><code>number</code></td>
          <td>—</td>
          <td>Shows a progress bar at the bottom of the toast. Value is 0–1 (multiplied by 100 internally).</td>
        </tr>
        <tr>
          <td><code>dismissible</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Shows a close button at the end of the toast.</td>
        </tr>
        <tr>
          <td><code>onDismiss</code></td>
          <td><code>() =&gt; void</code></td>
          <td>—</td>
          <td>
            Callback when the close button is clicked. When driven by <code>UtensilToastHost</code>, the entry's own
            <code>onDismiss</code> runs before the stack dismissal.
          </td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td><code>IconProp</code></td>
          <td>—</td>
          <td>Shows an icon before the message. Hidden when <code>busy</code> is true.</td>
        </tr>
        <tr>
          <td><code>action</code></td>
          <td><code>ToastAction</code></td>
          <td>—</td>
          <td>Shows a text button after the message. <code>{ label, onAction }</code>.</td>
        </tr>
        <tr>
          <td><code>position</code></td>
          <td><code>'fixed' | 'relative'</code></td>
          <td><code>'fixed'</code></td>
          <td>Positioning mode. Use <code>'relative'</code> when rendered inside a toast stack.</td>
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
          <td>Custom toast content. Overrides the <code>message</code> prop text.</td>
        </tr>
      </tbody>
    </table>

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
          <td><code>--toast-z-index</code></td>
          <td><code>var(--side-menu-z-index, 100)</code></td>
          <td>Z-index of the fixed-position toast element.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilToast :message="toastMessage" /&gt;</code></pre>

    <h3>With Color</h3>
    <pre><code>&lt;UtensilToast message="Changes saved!" color="success" /&gt;</code></pre>

    <h3>Busy Toast</h3>
    <pre><code>showToast('Processing...', { busy: true })</code></pre>

    <h3>Progress Toast</h3>
    <pre><code>showToast('Uploading...', { progress: 0.5 })</code></pre>

    <h3>Dismissible Toast</h3>
    <pre><code>showToast('Message', { dismissible: true, time: 0 })</code></pre>

    <h3>With Action</h3>
    <pre><code>showToast('Item deleted', {
  action: { label: 'Undo', onAction: () =&gt; undo() },
  time: 5000,
})</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
