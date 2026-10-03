<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilRadioGroup</h1>
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
      A composite radio group that manages single-selection across child components in a flexible layout. Provides
      keyboard navigation (arrow keys, Home, End) and roving tabindex. Uses <code>v-model</code> for the selected value.
      Use with <code>UtensilRadioGroupButton</code> for text-button children, or compose with custom children like
      <code>UtensilRadioCard</code> and <code>UtensilRadioButton</code>.
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
          <td><code>string</code></td>
          <td>—</td>
          <td>
            Selected value. Use with <code>v-model</code>. For non-string values (e.g. page-size numbers) coerce in the
            consumer.
          </td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Accessible label for the radio group.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td><code>'soft'</code></td>
          <td>Visual style applied to all children. Excludes <code>solid</code>.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Theme color applied to all children.</td>
        </tr>
        <tr>
          <td><code>onVariation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td>—</td>
          <td>
            Visual style for selected children, taking precedence over <code>variation</code>. May be
            <code>solid</code>.
          </td>
        </tr>
        <tr>
          <td><code>offVariation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td>—</td>
          <td>Visual style for unselected children, taking precedence over <code>variation</code>.</td>
        </tr>
        <tr>
          <td><code>onColor</code></td>
          <td><code>ColorProp</code></td>
          <td>—</td>
          <td>Theme color for selected children.</td>
        </tr>
        <tr>
          <td><code>offColor</code></td>
          <td><code>ColorProp</code></td>
          <td>—</td>
          <td>Theme color for unselected children.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td><code>1</code></td>
          <td>Relative size scaling for all children.</td>
        </tr>
        <tr>
          <td><code>radiusScale</code></td>
          <td><code>RadiusScaleProp</code></td>
          <td><code>1</code></td>
          <td>Override the border radius scale independently from size.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disables the entire group.</td>
        </tr>
        <tr>
          <td><code>multiple</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Toggles multiple values instead of picking one. Children render as checkboxes and the selected values bind
            via <code>v-model:selection</code> (<code>string[]</code>).
          </td>
        </tr>
        <tr>
          <td><code>loop</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Whether keyboard navigation wraps from last to first and vice versa.</td>
        </tr>
        <tr>
          <td><code>frame</code></td>
          <td><code>'plain' | 'segmented'</code></td>
          <td><code>'plain'</code></td>
          <td>
            Group chrome. <code>'segmented'</code> adds an inset frame with a raised selected option (segmented-control
            look). Per-button chrome is neutralized inside a segmented frame so the frame provides the visual grouping.
          </td>
        </tr>
        <tr>
          <td><code>invert</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Invert the background and button colors and visual heirarchy. Only used when <code>frame='segmented'</code>.
          </td>
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
          <td><code>update:modelValue</code></td>
          <td><code>string</code></td>
          <td>Fires when the selected value changes. Use with <code>v-model</code>.</td>
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
          <td>
            <code
              >{ value: string, setValue: (v: string) =&gt; void, variation: UtensilUIVariation, onVariation:
              UtensilUIVariation, offVariation: UtensilUIVariation, onColor: ColorProp, offColor: ColorProp, scale:
              ScaleProp, disabled: boolean, isTabbable: (v: string) =&gt; boolean }</code
            >
          </td>
          <td>Container for radio children. Scope exposes group state for custom children.</td>
        </tr>
      </tbody>
    </table>

    <h2>Variations</h2>
    <div class="text-ui ui-variations-reference">
      <UtensilBadge variation="soft" scale="giant">Soft</UtensilBadge>
      <UtensilBadge variation="text" scale="giant">Text</UtensilBadge>
      <UtensilBadge variation="outline" scale="giant">Outline</UtensilBadge>
      <UtensilBadge variation="surface" scale="giant">Surface</UtensilBadge>
      <UtensilBadge variation="overlay" scale="giant">Overlay</UtensilBadge>
    </div>
    <p>
      The <code>solid</code> variation is excluded from <code>variation</code>. Use <code>onVariation="solid"</code>
      to fill only the selected options.
    </p>

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
          <td><code>--utensil-radio-group-gap</code></td>
          <td><code>--space-1</code></td>
          <td>Gap between group items (plain frame).</td>
        </tr>
        <tr>
          <td><code>--utensil-radio-group-segmented-padding</code></td>
          <td><code>2px</code></td>
          <td>Inner padding of a segmented frame.</td>
        </tr>
        <tr>
          <td><code>--utensil-radio-group-segmented-gap</code></td>
          <td><code>2px</code></td>
          <td>Gap between options in a segmented frame.</td>
        </tr>
      </tbody>
    </table>

    <h2>Child Participation</h2>
    <p>
      <code>UtensilRadioGroup</code> provides context to children via <code>provide</code>/<code>inject</code>.
      Group-level props (variation, color, on/off variation, on/off color, scale, disabled) are inherited by children
      but can be overridden per-item.
    </p>

    <h3>Data Attributes</h3>
    <table>
      <thead>
        <tr>
          <th>Attribute</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>data-value</code></td>
          <td>Set on each radio child. Used by the parent for keyboard navigation and value selection.</td>
        </tr>
      </tbody>
    </table>

    <h2>UtensilRadioGroupButton</h2>
    <p>
      Text-button child for the radio group. Must be placed inside <code>UtensilRadioGroup</code>. Renders as a
      <code>UtensilButton</code> with pressed state.
    </p>

    <h3>Props</h3>
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
          <td><code>value</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Required. The value this item represents.</td>
        </tr>
        <tr>
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Text label to display. Falls back to <code>value</code> if not provided.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td>—</td>
          <td>Override the group variation for this item. Excludes <code>solid</code>.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Override the group color for this item.</td>
        </tr>
        <tr>
          <td><code>onVariation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td>—</td>
          <td>Override the variation for this item while selected.</td>
        </tr>
        <tr>
          <td><code>offVariation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td>—</td>
          <td>Override the variation for this item while unselected.</td>
        </tr>
        <tr>
          <td><code>onColor</code></td>
          <td><code>ColorProp</code></td>
          <td>—</td>
          <td>Override the color for this item while selected.</td>
        </tr>
        <tr>
          <td><code>offColor</code></td>
          <td><code>ColorProp</code></td>
          <td>—</td>
          <td>Override the color for this item while unselected.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td>—</td>
          <td>Override the group scale for this item.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disable this specific item.</td>
        </tr>
      </tbody>
    </table>

    <h3>Slots</h3>
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
          <td>Overrides the button content. Defaults to <code>label</code> or <code>value</code>.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilRadioGroup v-model="preset" aria-label="Date presets"&gt;
  &lt;UtensilRadioGroupButton value="today" label="Today" /&gt;
  &lt;UtensilRadioGroupButton value="7d" label="Last 7 days" /&gt;
  &lt;UtensilRadioGroupButton value="30d" label="Last 30 days" /&gt;
&lt;/UtensilRadioGroup&gt;</code></pre>

    <h3>With Variation and Color</h3>
    <pre><code>&lt;UtensilRadioGroup v-model="priority" variation="outline" color="success"&gt;
  &lt;UtensilRadioGroupButton value="low" label="Low" /&gt;
  &lt;UtensilRadioGroupButton value="medium" label="Medium" /&gt;
  &lt;UtensilRadioGroupButton value="high" label="High" /&gt;
&lt;/UtensilRadioGroup&gt;</code></pre>

    <h3>Distinct Selected and Unselected States</h3>
    <pre><code>&lt;UtensilRadioGroup
  v-model:selection="topics"
  multiple
  on-variation="solid"
  on-color="pen"
  off-variation="outline"
  off-color="pencil"
  aria-label="Topics"
&gt;
  &lt;UtensilRadioGroupButton value="news" label="News" /&gt;
  &lt;UtensilRadioGroupButton value="sport" label="Sport" /&gt;
  &lt;UtensilRadioGroupButton value="weather" label="Weather" /&gt;
&lt;/UtensilRadioGroup&gt;</code></pre>

    <h3>Segmented Frame (with consumer-side coercion for numeric values)</h3>
    <pre><code>// Consumer keeps the typed model and a string view for the radio group:
const pageSize = ref(50)
const pageSizeStr = computed({
  get: () =&gt; String(pageSize.value),
  set: (v) =&gt; (pageSize.value = Number(v)),
})

&lt;UtensilRadioGroup frame="segmented" v-model="pageSizeStr" aria-label="Page size"&gt;
  &lt;UtensilRadioGroupButton v-for="n in [25, 50, 100, 200]" :key="n" :value="String(n)" :label="String(n)" /&gt;
&lt;/UtensilRadioGroup&gt;</code></pre>

    <h3>With Custom Children via Slot Scope</h3>
    <pre><code>&lt;UtensilRadioGroup v-model="size" aria-label="Size"&gt;
  &lt;template #default="{ value, setValue, isTabbable }"&gt;
    &lt;UtensilRadioGroupButton value="small" label="S" /&gt;
    &lt;UtensilRadioGroupButton value="medium" label="M" /&gt;
    &lt;button
      role="radio"
      :data-value="'large'"
      :aria-checked="value === 'large'"
      :tabindex="isTabbable('large') ? 0 : -1"
      @click="setValue('large')"
    &gt;Custom L&lt;/button&gt;
  &lt;/template&gt;
&lt;/UtensilRadioGroup&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
