<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilPopover</h1>
    </div>
    <p>
      An unstyled popover primitive that anchors to a trigger element using CSS anchor positioning. Provides open/close
      behavior, light dismiss, viewport-aware flip, and animated transitions. Use this as a building block for tooltips,
      hover cards, and custom popover UIs. For a pre-styled panel, use <code>UtensilPopoverPanel</code> instead.
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
          <td>
            Position relative to the trigger. Automatically flips when near viewport edges. One of
            <code>'top'</code>, <code>'top-start'</code>, <code>'top-end'</code>, <code>'bottom'</code>,
            <code>'bottom-start'</code>, <code>'bottom-end'</code>, <code>'left'</code>, <code>'left-start'</code>,
            <code>'left-end'</code>, <code>'right'</code>, <code>'right-start'</code>, <code>'right-end'</code>.
          </td>
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
            width via a <code>ResizeObserver</code>.
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
          <td>Emitted when the open state changes. Used for <code>v-model</code> binding.</td>
        </tr>
        <tr>
          <td><code>placement-change</code></td>
          <td><code>PopoverPlacement</code></td>
          <td>Emitted when the actual placement differs from the requested placement due to viewport flipping.</td>
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
          <td>The element that anchors the popover. Use scope props to control open state.</td>
        </tr>
        <tr>
          <td><code>default</code></td>
          <td><code>close</code>, <code>actualPlacement</code></td>
          <td>Popover content rendered in the top layer. Completely unstyled.</td>
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
        <tr>
          <td><code>actualPlacement</code></td>
          <td><code>PopoverPlacement</code></td>
          <td>The resolved placement after viewport flipping. Matches <code>placement</code> prop unless flipped.</td>
        </tr>
      </tbody>
    </table>

    <!-- CSS Cvars -->
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
          <td><code>--utensil-popover-background</code></td>
          <td><code>transparent</code></td>
          <td>Background color of the popover content area.</td>
        </tr>
        <tr>
          <td><code>--utensil-popover-border</code></td>
          <td><code>none</code></td>
          <td>Border shorthand for the popover content area.</td>
        </tr>
        <tr>
          <td><code>--utensil-popover-radius</code></td>
          <td><code>0</code></td>
          <td>Border radius of the popover content area.</td>
        </tr>
        <tr>
          <td><code>--utensil-popover-shadow</code></td>
          <td><code>none</code></td>
          <td>Box shadow of the popover content area.</td>
        </tr>
        <tr>
          <td><code>--utensil-popover-padding</code></td>
          <td><code>0</code></td>
          <td>Padding inside the popover content area.</td>
        </tr>
        <tr>
          <td><code>--utensil-popover-color</code></td>
          <td><code>inherit</code></td>
          <td>Text color of the popover content area.</td>
        </tr>
        <tr>
          <td><code>--utensil-popover-inset</code></td>
          <td><code>1px</code></td>
          <td>Inset compensation for aligning shadow borders between trigger and popover.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Custom Tooltip</h3>
    <pre><code>&lt;UtensilPopover&gt;
  &lt;template #trigger="{ toggle }"&gt;
    &lt;UtensilButton @click="toggle"&gt;Hover me&lt;/UtensilButton&gt;
  &lt;/template&gt;
  &lt;div class="my-tooltip"&gt;Tooltip content&lt;/div&gt;
&lt;/UtensilPopover&gt;</code></pre>

    <h3>Controlled with Placement Detection</h3>
    <pre><code>&lt;UtensilPopover
  v-model="isOpen"
  placement="top"
  @placement-change="onFlip"
&gt;
  &lt;template #trigger="{ toggle, actualPlacement }"&gt;
    &lt;UtensilButton @click="toggle"&gt;
      Placed: &#x7B;&#x7B; actualPlacement &#x7D;&#x7D;
    &lt;/UtensilButton&gt;
  &lt;/template&gt;
  &lt;template #default="{ close }"&gt;
    &lt;div class="my-card"&gt;
      &lt;p&gt;Custom content&lt;/p&gt;
      &lt;button @click="close"&gt;Dismiss&lt;/button&gt;
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/UtensilPopover&gt;</code></pre>

    <h3>Styling via CSS Cvars</h3>
    <pre><code>.my-popover {
  --utensil-popover-background: var(--panel-solid);
  --utensil-popover-radius: var(--radius-3);
  --utensil-popover-shadow: var(--shadow-border-3);
  --utensil-popover-padding: var(--space-3);
}</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
