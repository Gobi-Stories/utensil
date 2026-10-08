<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilTextArea</h1>
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
      A multi-line text input with label support, resize control, and multiple visual variations. Wraps a native
      <code>&lt;textarea&gt;</code> element with theme-aware styling and keyboard behavior options.
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
          <td><code>id</code></td>
          <td><code>string</code></td>
          <td>auto-generated</td>
          <td>Custom id for the textarea element. Auto-generated if not provided.</td>
        </tr>
        <tr>
          <td><code>name</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Native textarea name attribute.</td>
        </tr>
        <tr>
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Visible label text. Automatically wired to the textarea via <code>for</code>/<code>id</code>.</td>
        </tr>
        <tr>
          <td><code>labelPlacement</code></td>
          <td><code>'block' | 'inline'</code></td>
          <td><code>'block'</code></td>
          <td>Label layout. Block places the label above; inline places it beside the textarea.</td>
        </tr>
        <tr>
          <td><code>placeholder</code></td>
          <td><code>string</code></td>
          <td><code>''</code></td>
          <td>Placeholder text shown when empty.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>'surface' | 'soft' | 'outline'</code></td>
          <td><code>'surface'</code></td>
          <td>Visual style variation.</td>
        </tr>
        <tr>
          <td><code>rows</code></td>
          <td><code>number</code></td>
          <td><code>5</code></td>
          <td>Number of visible text rows.</td>
        </tr>
        <tr>
          <td><code>maxlength</code></td>
          <td><code>number</code></td>
          <td>—</td>
          <td>Maximum number of characters allowed.</td>
        </tr>
        <tr>
          <td><code>resize</code></td>
          <td><code>'none' | 'vertical' | 'horizontal' | 'both'</code></td>
          <td><code>'vertical'</code></td>
          <td>Which directions the textarea can be resized.</td>
        </tr>
        <tr>
          <td><code>required</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Mark the textarea as required.</td>
        </tr>
        <tr>
          <td><code>autofocus</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Focus the textarea on mount.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disable the textarea.</td>
        </tr>
        <tr>
          <td><code>readonly</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Make the textarea read-only.</td>
        </tr>
        <tr>
          <td><code>stopKeyboardPropagation</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Stop keydown events from propagating beyond the textarea.</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Accessible label when no visible label is used.</td>
        </tr>
        <tr>
          <td><code>ariaRequired</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Sets <code>aria-required</code>.</td>
        </tr>
        <tr>
          <td><code>ariaInvalid</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Sets <code>aria-invalid</code> and draws the text area's outline in the theme's
            <code>warning</code> variant. Point <code>ariaDescribedBy</code> at the error message, so it is announced
            with the text area.
          </td>
        </tr>
        <tr>
          <td><code>ariaDescribedBy</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Sets <code>aria-describedby</code>.</td>
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
          <td>Fires on every keystroke (v-model binding).</td>
        </tr>
        <tr>
          <td><code>input</code></td>
          <td><code>string</code></td>
          <td>Fires on native input. Payload is the current value.</td>
        </tr>
        <tr>
          <td><code>change</code></td>
          <td><code>string</code></td>
          <td>Fires on native change (typically on blur after editing).</td>
        </tr>
        <tr>
          <td><code>keyup</code></td>
          <td><code>KeyboardEvent</code></td>
          <td>Fires on keyup.</td>
        </tr>
        <tr>
          <td><code>keydown</code></td>
          <td><code>KeyboardEvent</code></td>
          <td>Fires on keydown (after internal handling).</td>
        </tr>
        <tr>
          <td><code>blur</code></td>
          <td><code>FocusEvent</code></td>
          <td>Fires when the textarea loses focus.</td>
        </tr>
        <tr>
          <td><code>focus</code></td>
          <td><code>FocusEvent</code></td>
          <td>Fires when the textarea gains focus.</td>
        </tr>
      </tbody>
    </table>

    <h2>Variations</h2>
    <div class="text-ui ui-variations-reference">
      <UtensilBadge variation="surface" scale="giant">Surface</UtensilBadge>
      <UtensilBadge variation="soft" scale="giant">Soft</UtensilBadge>
      <UtensilBadge variation="outline" scale="giant">Outline</UtensilBadge>
    </div>

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
          <td><code>focus()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Focus the textarea programmatically.</td>
        </tr>
        <tr>
          <td><code>blur()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Blur the textarea programmatically.</td>
        </tr>
        <tr>
          <td><code>select()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Select all text in the textarea.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilTextArea v-model="description" placeholder="Enter a description..." /&gt;

&lt;UtensilTextArea
  v-model="notes"
  label="Notes"
  placeholder="Add notes..."
  variation="soft"
  :rows="4"
/&gt;</code></pre>

    <h3>With Resize Control</h3>
    <pre><code>&lt;UtensilTextArea
  v-model="content"
  resize="none"
  :rows="8"
  placeholder="Fixed-size editor"
/&gt;

&lt;UtensilTextArea
  v-model="content"
  resize="both"
  placeholder="Resize in any direction"
/&gt;</code></pre>

    <h3>Inline Label</h3>
    <pre><code>&lt;UtensilTextArea
  v-model="bio"
  label="Bio"
  label-placement="inline"
  :rows="3"
  :maxlength="500"
/&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
