<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilRangeSlider</h1>
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
      A range slider input for selecting a numeric value within a range. Supports custom steps, formatted labels, inline
      and block label placement, and a value display slot. Uses a native <code>&lt;input type="range"&gt;</code>
      under the hood with a custom track and fill overlay.
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
          <td><code>modelValue</code></td>
          <td><code>number</code></td>
          <td>—</td>
          <td>Current slider value (v-model binding). Required.</td>
        </tr>
        <tr>
          <td><code>min</code></td>
          <td><code>number</code></td>
          <td><code>0</code></td>
          <td>Minimum value. Ignored when <code>steps</code> is provided.</td>
        </tr>
        <tr>
          <td><code>max</code></td>
          <td><code>number</code></td>
          <td><code>100</code></td>
          <td>Maximum value. Ignored when <code>steps</code> is provided.</td>
        </tr>
        <tr>
          <td><code>step</code></td>
          <td><code>number</code></td>
          <td><code>1</code></td>
          <td>Step increment. Ignored when <code>steps</code> is provided.</td>
        </tr>
        <tr>
          <td><code>steps</code></td>
          <td><code>number[]</code></td>
          <td>—</td>
          <td>
            Predefined step values evenly spaced on the slider. Overrides <code>min</code>, <code>max</code>, and
            <code>step</code>. Requires at least 2 values.
          </td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disable the slider.</td>
        </tr>
        <tr>
          <td><code>id</code></td>
          <td><code>string</code></td>
          <td>auto-generated</td>
          <td>Custom id for the input element. Auto-generated if not provided.</td>
        </tr>
        <tr>
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Visible label text. Automatically wired to the input via <code>for</code>/<code>id</code>.</td>
        </tr>
        <tr>
          <td><code>labelPlacement</code></td>
          <td><code>'block' | 'inline'</code></td>
          <td><code>'block'</code></td>
          <td>Label layout. Block places the label above; inline places it beside the slider.</td>
        </tr>
        <tr>
          <td><code>showValue</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Show the current value next to the slider track.</td>
        </tr>
        <tr>
          <td><code>valueBadge</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Render the current value in a soft badge next to the track. Implies showing the value.</td>
        </tr>
        <tr>
          <td><code>unit</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>
            Appended to the displayed value (e.g. <code>'px'</code>). Ignored when <code>formatValue</code> is given.
          </td>
        </tr>
        <tr>
          <td><code>formatValue</code></td>
          <td><code>(value: number) =&gt; string</code></td>
          <td>—</td>
          <td>
            Custom formatter for the displayed value. Used in the value display, label, and <code>aria-valuetext</code>.
          </td>
        </tr>
        <tr>
          <td><code>showValuesInLabel</code></td>
          <td><code>boolean</code></td>
          <td>—</td>
          <td>
            Replace the label text with the formatted value while the user is interacting with the slider. The label
            auto-sizes to prevent layout shift.
          </td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Theme color for the fill, thumb, and value text.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td>—</td>
          <td>Relative scale override for sizing.</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Accessible label when no visible label is used.</td>
        </tr>
        <tr>
          <td><code>rounded</code></td>
          <td><code>boolean</code></td>
          <td>—</td>
          <td>Apply rounded corners to the track and fill.</td>
        </tr>
        <tr>
          <td><code>vertical</code></td>
          <td><code>boolean</code></td>
          <td>—</td>
          <td>
            Stand the slider upright with values increasing upward. Height comes from the container or
            <code>--range-slider-control-height</code>.
          </td>
        </tr>
        <tr>
          <td><code>visibleWhileInteracting</code></td>
          <td><code>boolean</code></td>
          <td>—</td>
          <td>
            Keeps the track and thumb visible while the slider is adjusted, punching through an ancestor hidden with
            <code>visibility: hidden</code>. The label and value stay hidden with the surface. Pair with the root's
            <code>.interacting</code> class (below) for surfaces that get out of the way during the adjustment.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>State Classes</h2>
    <p>
      The root element carries <code>.interacting</code> from pointer press to release or cancel — unlike
      <code>:active</code>, it survives the whole slide on touch. A parent can watch it (e.g.
      <code>:has(.utensil-range-slider.interacting)</code>) to hide a covering surface while the user adjusts, letting
      the content underneath show the change live.
    </p>

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
          <td><code>number</code></td>
          <td>
            Fires when the slider value changes (v-model binding). When using <code>steps</code>, emits the actual step
            value rather than an index.
          </td>
        </tr>
        <tr>
          <td><code>change</code></td>
          <td><code>number</code></td>
          <td>
            Fires when the value commits — on release for pointer drags, once per keyboard step. Use it to apply the
            result of a drag without reacting to every intermediate value.
          </td>
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
          <td><code>label</code></td>
          <td><code>{ value: number, formattedValue: string }</code></td>
          <td>Custom label content. Receives the current numeric value and the formatted string.</td>
        </tr>
        <tr>
          <td><code>value</code></td>
          <td><code>{ value: number }</code></td>
          <td>
            Custom value display next to the track. Only rendered when <code>showValue</code> is true or the slot is
            provided.
          </td>
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
          <td><code>--range-slider-control-width</code></td>
          <td><code>100%</code></td>
          <td>Width of the slider control area.</td>
        </tr>
        <tr>
          <td><code>--range-slider-label-width</code></td>
          <td>—</td>
          <td>Fixed width for the label. Useful for aligning multiple stacked sliders.</td>
        </tr>
        <tr>
          <td><code>--range-slider-value-width</code></td>
          <td><code>--space-6</code></td>
          <td>Minimum width for the value display area.</td>
        </tr>
        <tr>
          <td><code>--range-slider-control-height</code></td>
          <td><code>100%</code></td>
          <td>Height of the slider control area when <code>vertical</code>.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilRangeSlider v-model="volume" /&gt;

&lt;UtensilRangeSlider
  v-model="opacity"
  :min="0"
  :max="1"
  :step="0.01"
  label="Opacity"
  show-value
  :format-value="v =&gt; \`\${Math.round(v * 100)}%\`"
/&gt;</code></pre>

    <h3>Predefined Steps</h3>
    <pre><code>&lt;UtensilRangeSlider
  v-model="speed"
  :steps="[0.25, 0.5, 1, 1.5, 2, 3]"
  label="Playback Speed"
  show-values-in-label
  :format-value="v =&gt; \`\${v}x\`"
/&gt;</code></pre>

    <h3>Vertical</h3>
    <pre><code>&lt;!-- Height comes from the container --&gt;
&lt;div style="height: 160px"&gt;
  &lt;UtensilRangeSlider v-model="zoom" vertical /&gt;
&lt;/div&gt;</code></pre>

    <h3>Custom Value Slot</h3>
    <pre><code>&lt;UtensilRangeSlider v-model="size" :min="0" :max="100" :step="5"&gt;
  &lt;template #value="{ value }"&gt;
    &lt;UtensilBadge variation="soft"&gt;&#123;&#123; value &#125;&#125;px&lt;/UtensilBadge&gt;
  &lt;/template&gt;
&lt;/UtensilRangeSlider&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
