<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilTooltip</h1>
    </div>
    <p>
      A small text popover shown on hover and keyboard focus. Wraps its trigger content in the default slot and composes
      <code>UtensilPopover</code> for positioning. Text-only by design — use <code>UtensilPopover</code> directly for
      rich content.
    </p>

    <h2>Accessibility</h2>
    <p>
      The text is a <code>role="tooltip"</code> element shown on hover and keyboard focus. A tooltip adds to its
      trigger; it never names it. A trigger that has a name of its own (an icon button's description, a label's text)
      takes the tooltip as its description through <code>aria-describedby</code> and the slot's <code>tooltipId</code>.
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
          <td><code>text</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Tooltip text. An empty string disables the tooltip.</td>
        </tr>
        <tr>
          <td><code>placement</code></td>
          <td><code>'top' | 'bottom' | 'left' | 'right'</code></td>
          <td><code>'right'</code></td>
          <td>Preferred placement relative to the trigger.</td>
        </tr>
        <tr>
          <td><code>delay</code></td>
          <td><code>number</code></td>
          <td><code>200</code></td>
          <td>Delay in milliseconds before showing on hover or focus.</td>
        </tr>
        <tr>
          <td><code>offset</code></td>
          <td><code>number</code></td>
          <td><code>8</code></td>
          <td>Distance in pixels from the trigger.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Prevents the tooltip from showing.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>'inverted' | 'overlay'</code></td>
          <td><code>'inverted'</code></td>
          <td>
            <code>inverted</code> is opaque and contrasts with the page in both modes. <code>overlay</code> is
            translucent and dark in both modes, matching labels that sit over images and video.
          </td>
        </tr>
        <tr>
          <td><code>multiline</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Wraps long text at a readable measure instead of a single line.</td>
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
          <td><code>tooltipId</code></td>
          <td>
            The trigger content the tooltip is anchored to. Point the trigger's <code>aria-describedby</code> at
            <code>tooltipId</code>, the id of the tooltip's text, so it is read with the trigger.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Exposed</h2>
    <table>
      <thead>
        <tr>
          <th>Method</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>show()</code></td>
          <td>Opens the tooltip programmatically.</td>
        </tr>
        <tr>
          <td><code>hide()</code></td>
          <td>Closes the tooltip programmatically.</td>
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
          <td><code>--utensil-tooltip-max-width</code></td>
          <td><code>280px</code></td>
          <td>The width a <code>multiline</code> tooltip wraps at.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Icon Button Hint</h3>
    <pre v-pre><code>&lt;UtensilTooltip text="Delete story" placement="top"&gt;
  &lt;UtensilCircleButton icon="delete" description="Delete story" /&gt;
&lt;/UtensilTooltip&gt;</code></pre>

    <h3>Described Trigger</h3>
    <pre v-pre><code>&lt;UtensilTooltip text="Only owners can delete a story." placement="top"&gt;
  &lt;template #default="{ tooltipId }"&gt;
    &lt;UtensilButton aria-disabled="true" :aria-describedby="tooltipId"&gt;Delete&lt;/UtensilButton&gt;
  &lt;/template&gt;
&lt;/UtensilTooltip&gt;</code></pre>

    <h3>Long Explanation</h3>
    <pre v-pre><code>&lt;UtensilTooltip
  text="Of everyone who visited the page, the share who signed up."
  placement="top"
  multiline
&gt;
  &lt;template #default="{ tooltipId }"&gt;
    &lt;span tabindex="0" :aria-describedby="tooltipId"&gt;Conversion rate&lt;/span&gt;
  &lt;/template&gt;
&lt;/UtensilTooltip&gt;</code></pre>
    <p>For a term explained this way, <code>UtensilHintLabel</code> does all of it.</p>

    <h3>Over Media</h3>
    <pre v-pre><code>&lt;UtensilTooltip :text="title" :disabled="!truncated" placement="top" variation="overlay"&gt;
  &lt;template #default="{ tooltipId }"&gt;
    &lt;span class="media-label" tabindex="0" :aria-describedby="tooltipId"&gt;{{ title }}&lt;/span&gt;
  &lt;/template&gt;
&lt;/UtensilTooltip&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component - no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
