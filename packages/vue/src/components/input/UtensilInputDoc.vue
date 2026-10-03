<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilInput</h1>
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
      A flexible text input with label support, icon placement, description text, and multiple visual variations. Wraps
      a native <code>&lt;input&gt;</code> element with theme-aware styling and keyboard behavior options.
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
          <td><code>type</code></td>
          <td><code>string</code></td>
          <td><code>'text'</code></td>
          <td>
            Native input type (<code>text</code>, <code>email</code>, <code>number</code>, <code>password</code>, etc.).
          </td>
        </tr>
        <tr>
          <td><code>id</code></td>
          <td><code>string</code></td>
          <td>auto-generated</td>
          <td>Custom id for the input element. Auto-generated if not provided.</td>
        </tr>
        <tr>
          <td><code>name</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Native input name attribute.</td>
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
          <td>Label layout. Block places the label above; inline places it beside the input.</td>
        </tr>
        <tr>
          <td><code>description</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>
            Helper text shown below the input. Overridden by the <code>description</code> slot. When present (as prop or
            slot) and <code>ariaDescribedBy</code> is not set, the input's <code>aria-describedby</code> is
            automatically wired to it.
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
          <td><code>'surface' | 'soft' | 'outline'</code></td>
          <td><code>'surface'</code></td>
          <td>Visual style variation.</td>
        </tr>
        <tr>
          <td><code>height</code></td>
          <td><code>'normal' | 'large'</code></td>
          <td><code>'normal'</code></td>
          <td>Controls vertical padding. Large increases block padding for a taller input.</td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td><code>IconProp</code></td>
          <td>—</td>
          <td>Icon to display inside the input.</td>
        </tr>
        <tr>
          <td><code>iconPosition</code></td>
          <td><code>'start' | 'end'</code></td>
          <td><code>'start'</code></td>
          <td>Where to place the icon relative to the input text.</td>
        </tr>
        <tr>
          <td><code>required</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Mark the input as required.</td>
        </tr>
        <tr>
          <td><code>autocomplete</code></td>
          <td><code>string</code></td>
          <td><code>'off'</code></td>
          <td>Native autocomplete hint.</td>
        </tr>
        <tr>
          <td><code>autofocus</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Focus the input on mount.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disable the input.</td>
        </tr>
        <tr>
          <td><code>min</code></td>
          <td><code>string | number</code></td>
          <td>—</td>
          <td>Minimum value (for <code>number</code>, <code>date</code>, etc.).</td>
        </tr>
        <tr>
          <td><code>max</code></td>
          <td><code>string | number</code></td>
          <td>—</td>
          <td>Maximum value (for <code>number</code>, <code>date</code>, etc.).</td>
        </tr>
        <tr>
          <td><code>size</code></td>
          <td><code>string | number</code></td>
          <td>—</td>
          <td>Native size attribute (visible character width).</td>
        </tr>
        <tr>
          <td><code>readonly</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Make the input read-only.</td>
        </tr>
        <tr>
          <td><code>pattern</code></td>
          <td><code>string</code></td>
          <td><code>'.+'</code></td>
          <td>Native pattern for validation.</td>
        </tr>
        <tr>
          <td><code>blurOnEnterKey</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Blur the input when Enter is pressed.</td>
        </tr>
        <tr>
          <td><code>stopKeyboardPropagation</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Stop keydown events from propagating beyond the input.</td>
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
          <td>Sets <code>aria-invalid</code>.</td>
        </tr>
        <tr>
          <td><code>ariaDescribedBy</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>
            Sets <code>aria-describedby</code>. Takes precedence over the auto-generated id from the
            <code>description</code> prop/slot.
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
          <td><code>search</code></td>
          <td><code>string</code></td>
          <td>Fires on native search event (for <code>type="search"</code>).</td>
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
          <td>Fires when the input loses focus.</td>
        </tr>
        <tr>
          <td><code>focus</code></td>
          <td><code>FocusEvent</code></td>
          <td>Fires when the input gains focus.</td>
        </tr>
        <tr>
          <td><code>iconClick</code></td>
          <td>—</td>
          <td>Fires when the icon is clicked. The icon becomes a button when a listener is attached.</td>
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
          <td><code>action</code></td>
          <td>—</td>
          <td>
            Content rendered in an overlay box at the end of the input (or start when icon is at end). Useful for clear
            buttons or inline actions.
          </td>
        </tr>
        <tr>
          <td><code>description</code></td>
          <td>—</td>
          <td>Helper text rendered below the input. Overrides the <code>description</code> prop.</td>
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
          <td><code>focus(options?)</code></td>
          <td><code>(options?: FocusOptions) =&gt; void</code></td>
          <td>
            Focus the input programmatically. Options forward to the native focus (e.g. <code>preventScroll</code>).
          </td>
        </tr>
        <tr>
          <td><code>blur()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Blur the input programmatically.</td>
        </tr>
        <tr>
          <td><code>select()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Select all text in the input.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilInput v-model="name" placeholder="Enter your name" /&gt;

&lt;UtensilInput
  v-model="email"
  type="email"
  label="Email"
  placeholder="you@example.com"
  variation="outline"
/&gt;</code></pre>

    <h3>With Icon and Action Slot</h3>
    <pre><code>&lt;UtensilInput
  v-model="query"
  icon="search"
  icon-position="start"
  placeholder="Search..."
  blur-on-enter-key
&gt;
  &lt;template #action&gt;
    &lt;UtensilCloseButton v-if="query" @click="query = ''" /&gt;
  &lt;/template&gt;
&lt;/UtensilInput&gt;</code></pre>

    <h3>Inline Label</h3>
    <pre><code>&lt;UtensilInput
  v-model="value"
  label="Width"
  label-placement="inline"
  type="number"
  min="0"
  max="1920"
/&gt;</code></pre>

    <h3>With Description</h3>
    <pre><code>&lt;UtensilInput v-model="handle" label="Handle" description="This is shown publicly on your profile." /&gt;

&lt;UtensilInput v-model="apiKey" label="API Key"&gt;
  &lt;template #description&gt;
    Find your key in &lt;a href="/settings"&gt;account settings&lt;/a&gt;.
  &lt;/template&gt;
&lt;/UtensilInput&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
