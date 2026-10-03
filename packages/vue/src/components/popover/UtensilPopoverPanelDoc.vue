<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilPopoverPanel</h1>
    </div>
    <p>
      A styled popover that anchors to a trigger element. Wraps <code>UtensilPopover</code> with default panel
      appearance (solid background, rounded corners, shadow, padding). Supports controlled mode via
      <code>v-model</code> or uncontrolled mode with exposed methods. Light dismiss (click outside or Escape) closes it
      automatically.
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
          <td><code>modelValue</code></td>
          <td><code>boolean</code></td>
          <td><code>undefined</code></td>
          <td>Whether the popover is open. When provided, the component runs in controlled mode.</td>
        </tr>
        <tr>
          <td><code>placement</code></td>
          <td><code>PopoverPlacement</code></td>
          <td><code>'bottom-start'</code></td>
          <td>Position of the popover relative to the trigger. Automatically flips when near viewport edges.</td>
        </tr>
        <tr>
          <td><code>offset</code></td>
          <td><code>number</code></td>
          <td><code>8</code></td>
          <td>Gap in pixels between the trigger and the popover.</td>
        </tr>
        <tr>
          <td><code>width</code></td>
          <td><code>'auto' | 'anchor'</code></td>
          <td><code>'auto'</code></td>
          <td>
            Width behavior. <code>'auto'</code> sizes to content. <code>'anchor'</code> matches the trigger element
            width.
          </td>
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
          <td><code>update:modelValue</code></td>
          <td><code>boolean</code></td>
          <td>Emitted when the open state changes in controlled mode.</td>
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
          <td><code>trigger</code></td>
          <td>
            <code>isOpen</code>, <code>actualPlacement</code>, <code>toggle</code>, <code>open</code>,
            <code>close</code>
          </td>
          <td>The element that anchors and toggles the popover.</td>
        </tr>
        <tr>
          <td><code>default</code></td>
          <td><code>close</code>, <code>actualPlacement</code></td>
          <td>Popover content. Use <code>close</code> to dismiss the popover from within.</td>
        </tr>
      </tbody>
    </table>

    <!-- Exposed -->
    <h2>Exposed</h2>
    <table>
      <thead>
        <tr>
          <th>Member</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>open()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Opens the popover.</td>
        </tr>
        <tr>
          <td><code>close()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Closes the popover.</td>
        </tr>
        <tr>
          <td><code>toggle()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Toggles the popover open or closed.</td>
        </tr>
        <tr>
          <td><code>isOpen</code></td>
          <td><code>boolean</code></td>
          <td>Whether the popover is currently open.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilPopoverPanel&gt;
  &lt;template #trigger="{ toggle }"&gt;
    &lt;UtensilButton @click="toggle"&gt;Toggle Popover&lt;/UtensilButton&gt;
  &lt;/template&gt;
  &lt;p&gt;Popover content here.&lt;/p&gt;
&lt;/UtensilPopoverPanel&gt;</code></pre>

    <h3>Controlled with v-model</h3>
    <pre><code>&lt;UtensilPopoverPanel v-model="isOpen" placement="bottom-end"&gt;
  &lt;template #trigger="{ toggle }"&gt;
    &lt;UtensilButton @click="toggle"&gt;
      &#x7B;&#x7B; isOpen ? 'Close' : 'Open' &#x7D;&#x7D;
    &lt;/UtensilButton&gt;
  &lt;/template&gt;
  &lt;template #default="{ close }"&gt;
    &lt;p&gt;Content with a close button.&lt;/p&gt;
    &lt;UtensilButton size="small" @click="close"&gt;Done&lt;/UtensilButton&gt;
  &lt;/template&gt;
&lt;/UtensilPopoverPanel&gt;</code></pre>

    <h3>Anchor Width Matching</h3>
    <pre><code>&lt;UtensilPopoverPanel width="anchor"&gt;
  &lt;template #trigger="{ toggle }"&gt;
    &lt;UtensilButton style="width: 200px" @click="toggle"&gt;
      Select Option
    &lt;/UtensilButton&gt;
  &lt;/template&gt;
  &lt;p&gt;This popover matches the trigger width.&lt;/p&gt;
&lt;/UtensilPopoverPanel&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
