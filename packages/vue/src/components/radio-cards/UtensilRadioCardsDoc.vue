<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilRadioCards</h1>
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
      A composite radio group that presents options as cards with radio indicators. Composes
      <code>UtensilRadioGroup</code> for keyboard navigation and roving tabindex, and <code>UtensilBox</code> for card
      styling. Uses <code>v-model</code> for the selected value.
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
          <td>Selected value. Use with <code>v-model</code>.</td>
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
          <td><code>'outline'</code></td>
          <td>Visual style applied to all child cards. Excludes <code>solid</code>.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Theme color applied to all child cards.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td><code>1</code></td>
          <td>Relative size scaling for all child cards.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disables the entire group.</td>
        </tr>
        <tr>
          <td><code>loop</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Whether keyboard navigation wraps from last to first and vice versa.</td>
        </tr>
        <tr>
          <td><code>indicatorPosition</code></td>
          <td><code>RadioIndicatorPosition</code></td>
          <td><code>'start'</code></td>
          <td>
            Position of the radio indicator within cards. Values: <code>start</code>, <code>end</code> (center-aligned),
            <code>start-start</code>, <code>start-end</code>, <code>end-start</code>, <code>end-end</code>
            (block-inline alignment).
          </td>
        </tr>
        <tr>
          <td><code>indicator</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>
            Whether to show the radio indicator in cards. Set to <code>false</code> for selection via card styling only.
          </td>
        </tr>
        <tr>
          <td><code>indicatorIcon</code></td>
          <td><code>IconProp</code></td>
          <td>—</td>
          <td>Icon to display instead of the radio dot SVG in all cards. Overridable per card.</td>
        </tr>
        <tr>
          <td><code>wireframe</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Suppress background changes on interaction for outline variation.</td>
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
          <td><code>{ value: string, setValue: (v: string) =&gt; void }</code></td>
          <td>Container for <code>UtensilRadioCard</code> children. Scope exposes the current value and a setter.</td>
        </tr>
      </tbody>
    </table>

    <h2>Variations</h2>
    <div class="text-ui ui-variations-reference">
      <UtensilBadge variation="outline" scale="giant">Outline</UtensilBadge>
      <UtensilBadge variation="surface" scale="giant">Surface</UtensilBadge>
      <UtensilBadge variation="soft" scale="giant">Soft</UtensilBadge>
      <UtensilBadge variation="text" scale="giant">Text</UtensilBadge>
    </div>
    <p>The <code>solid</code> variation is excluded from radio cards.</p>

    <h2>Indicator Positions</h2>
    <table>
      <thead>
        <tr>
          <th>Value</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>start</code></td>
          <td>Indicator at inline start, vertically centered (default).</td>
        </tr>
        <tr>
          <td><code>end</code></td>
          <td>Indicator at inline end, vertically centered.</td>
        </tr>
        <tr>
          <td><code>start-start</code></td>
          <td>Indicator at block start, inline start (top-left in LTR).</td>
        </tr>
        <tr>
          <td><code>start-end</code></td>
          <td>Indicator at block start, inline end (top-right in LTR).</td>
        </tr>
        <tr>
          <td><code>end-start</code></td>
          <td>Indicator at block end, inline start (bottom-left in LTR).</td>
        </tr>
        <tr>
          <td><code>end-end</code></td>
          <td>Indicator at block end, inline end (bottom-right in LTR).</td>
        </tr>
      </tbody>
    </table>

    <h2>UtensilRadioCard</h2>
    <p>
      Individual radio card child. Must be placed inside <code>UtensilRadioCards</code>. Renders as a card with a radio
      indicator and custom content.
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
          <td>Required. The value this card represents.</td>
        </tr>
        <tr>
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Text label. Use the default slot for rich content.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td>—</td>
          <td>Override the group variation for this card. Excludes <code>solid</code>.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Override the group color for this card.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td>—</td>
          <td>Override the group scale for this card.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disable this specific card.</td>
        </tr>
        <tr>
          <td><code>indicatorPosition</code></td>
          <td><code>RadioIndicatorPosition</code></td>
          <td>—</td>
          <td>Override the group indicator position for this card.</td>
        </tr>
        <tr>
          <td><code>indicator</code></td>
          <td><code>boolean</code></td>
          <td>—</td>
          <td>Override the group indicator visibility for this card.</td>
        </tr>
        <tr>
          <td><code>indicatorIcon</code></td>
          <td><code>IconProp</code></td>
          <td>—</td>
          <td>
            Override the group indicator icon for this card. Still overridable via the <code>indicator</code> slot.
          </td>
        </tr>
        <tr>
          <td><code>wireframe</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Suppress background changes on interaction for outline variation.</td>
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
          <td>Card content. Defaults to <code>label</code> or <code>value</code>.</td>
        </tr>
        <tr>
          <td><code>indicator</code></td>
          <td><code>{ selected: boolean, disabled: boolean }</code></td>
          <td>
            Custom indicator content. Defaults to the radio dot SVG. Only renders when <code>indicator</code> is true.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilRadioCards v-model="plan" aria-label="Select plan"&gt;
  &lt;UtensilRadioCard value="free" label="Free" /&gt;
  &lt;UtensilRadioCard value="pro" label="Pro" /&gt;
  &lt;UtensilRadioCard value="enterprise" label="Enterprise" /&gt;
&lt;/UtensilRadioCards&gt;</code></pre>

    <h3>Rich Content</h3>
    <pre><code>&lt;UtensilRadioCards v-model="plan" indicator-position="start-start"&gt;
  &lt;UtensilRadioCard value="free"&gt;
    &lt;strong&gt;Free&lt;/strong&gt;
    &lt;p&gt;Basic features for individuals&lt;/p&gt;
  &lt;/UtensilRadioCard&gt;
  &lt;UtensilRadioCard value="pro"&gt;
    &lt;strong&gt;Pro&lt;/strong&gt;
    &lt;p&gt;Advanced features for teams&lt;/p&gt;
  &lt;/UtensilRadioCard&gt;
&lt;/UtensilRadioCards&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
