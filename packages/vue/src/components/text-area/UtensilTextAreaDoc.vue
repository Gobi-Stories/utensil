<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilTextArea</h1>
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
          <td><code>description</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>
            Text under the text area, such as a hint or an error, that describes it. Drawn in the
            <code>warning</code> variant while <code>ariaInvalid</code>.
          </td>
        </tr>
        <tr>
          <td><code>reserveDescription</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Holds the description's line while there is none, so a message that comes and goes, such as an error shown
            once the field is left, doesn't move what follows.
          </td>
        </tr>
        <tr>
          <td><code>placeholder</code></td>
          <td><code>string</code></td>
          <td><code>''</code></td>
          <td>Placeholder text shown when empty.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>'surface' | 'soft' | 'outline' | 'unstyled'</code></td>
          <td><code>'surface'</code></td>
          <td>Visual style of the field. See Variations below.</td>
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
          <td>Disable the textarea. Drawn muted, with its label and description, and can't be resized.</td>
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
          <td>
            Sets <code>aria-required="true"</code>, for a field required by other means than <code>required</code>.
          </td>
        </tr>
        <tr>
          <td><code>ariaInvalid</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Sets <code>aria-invalid</code> and draws the text area's outline in the theme's
            <code>warning</code> variant. Give the error as its <code>description</code>, or point
            <code>ariaDescribedBy</code> at it, so it is announced with the text area.
          </td>
        </tr>
        <tr>
          <td><code>ariaDescribedBy</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Ids of more elements that describe the text area, read before its description.</td>
        </tr>
      </tbody>
    </table>

    <h2>Slots</h2>
    <table>
      <thead>
        <tr>
          <th>Slot</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>description</code></td>
          <td>Replaces the description's text, e.g. with a link.</td>
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
          <td>Fires on keydown, before <code>stopKeyboardPropagation</code> stops the event.</td>
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
      <UtensilBadge scale="giant">Unstyled</UtensilBadge>
    </div>
    <p>
      The variations are the ones buttons and boxes take: <code>surface</code> is filled and edged, <code>soft</code> is
      tinted in the pen, <code>outline</code> is an edge over whatever is behind it, and <code>unstyled</code> draws no
      fill or edge, for a field laid into a panel of its own. Each keeps its padding and the focus ring.
    </p>

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
          <td><code>focusEnd()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Focus the textarea with the caret after the last character, without scrolling it into view.</td>
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
          <td><code>--utensil-text-area-font-size</code></td>
          <td><code>--font-size-2</code></td>
          <td>Font size of the text and the label.</td>
        </tr>
        <tr>
          <td><code>--utensil-text-area-padding</code></td>
          <td>
            <code>--space-2</code> <code>--space-3</code>, <code>--space-3</code> <code>--space-4</code> under
            <code>.utensil-rounded</code>
          </td>
          <td>Padding around the text. The nearest rounded or squared theme sets it.</td>
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

    <h3>An Error Shown Once the Field Is Left</h3>
    <pre v-pre><code>&lt;UtensilTextArea
  v-model="bio"
  label="Bio"
  reserve-description
  :description="bioError"
  :aria-invalid="!!bioError"
  @blur="validateBio"
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
</script>

<style src="../../utensil-docs.css"></style>
