<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilListbox</h1>
    </div>
    <p>
      A list of options to choose from, the <code>listbox</code> under a select or a combobox. It keeps track of the
      option the keyboard is on and scrolls it into view, but leaves the keys to its host: the host calls its exposed
      methods from its own keydown handler, as <code>UtensilSelectBase</code> does from the select's trigger. It draws
      only the scrolling list; the options are the host's.
    </p>

    <h2>Accessibility</h2>
    <p>
      The root is <code>role="listbox"</code>, named by <code>ariaLabelledby</code> or <code>ariaLabel</code>, and
      <code>aria-multiselectable</code> when <code>multiselectable</code>. The option the keyboard is on is marked with
      <code>data-focused</code> rather than DOM focus: the host keeps DOM focus and points its
      <code>aria-activedescendant</code> at the exposed <code>activeDescendant</code>. Each option needs an id,
      <code>role="option"</code> and <code>aria-selected</code>. Where DOM focus stays on another element, such as a
      combobox trigger, give each option <code>tabindex="-1"</code>, which keeps it in the accessibility tree, and
      cancel its <code>mousedown</code> (<code>@mousedown.prevent</code>), so pressing it leaves focus where it is.
      <code>UtensilSelectOption</code> does both. A listbox that takes focus itself, with <code>tabindex="0"</code>,
      shows a focus ring.
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
          <td><code>focusedValue</code></td>
          <td><code>string | null</code></td>
          <td><code>null</code></td>
          <td>
            The value of the option the keyboard is on, bound with <code>v-model:focusedValue</code>. Setting it moves
            there and scrolls it into view, including the value it starts with.
          </td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Names the list where there is no visible label.</td>
        </tr>
        <tr>
          <td><code>ariaLabelledby</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Id of the element that names the list, such as a visible label. Takes precedence over ariaLabel.</td>
        </tr>
        <tr>
          <td><code>multiselectable</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Whether more than one option can be chosen.</td>
        </tr>
        <tr>
          <td><code>full</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Shows every option, however many, rather than scrolling past the maximum height.</td>
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
          <td><code>update:focusedValue</code></td>
          <td><code>string | null</code></td>
          <td>The keyboard moved to another option, or off them all.</td>
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
          <td><code>focusedValue</code>, <code>setFocusedValue(value)</code></td>
          <td>
            The options. Call <code>setFocusedValue</code> from an option's pointer events to move the keyboard there.
          </td>
        </tr>
      </tbody>
    </table>

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
          <td><code>focusNext()</code>, <code>focusPrev()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Move to the next or previous option, stopping at the ends.</td>
        </tr>
        <tr>
          <td><code>focusFirst()</code>, <code>focusLast()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Move to the first or last option.</td>
        </tr>
        <tr>
          <td><code>setFocusedValue(value)</code></td>
          <td><code>(value: string | null) =&gt; void</code></td>
          <td>Move to the option with a value, or off them all with <code>null</code>.</td>
        </tr>
        <tr>
          <td><code>typeahead(character)</code></td>
          <td><code>(character: string) =&gt; boolean</code></td>
          <td>
            Move to the next option whose text starts with what has been typed in quick succession; one character typed
            again moves on through the options that start with it. Returns whether an option matched.
          </td>
        </tr>
        <tr>
          <td><code>reset()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Move off every option and forget what was typed, as when the list closes.</td>
        </tr>
        <tr>
          <td><code>focusedValue</code></td>
          <td><code>string | null</code></td>
          <td>The value of the option the keyboard is on.</td>
        </tr>
        <tr>
          <td><code>activeDescendant</code></td>
          <td><code>string | null</code></td>
          <td>The id of that option, for the host's <code>aria-activedescendant</code>.</td>
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
          <td><code>--utensil-listbox-max-height</code></td>
          <td><code>240px</code> × <code>--scale</code></td>
          <td>The height the list scrolls past. <code>full</code> overrides it.</td>
        </tr>
      </tbody>
    </table>

    <h2>Child Participation</h2>
    <p>
      The listbox finds its options in the DOM. An option the keyboard can reach carries <code>data-focusable</code> and
      its value in <code>data-value</code>; one without <code>data-focusable</code>, or with
      <code>aria-disabled="true"</code>, is passed over and can't be moved to. Its text is what type-ahead matches.
    </p>

    <h2>Examples</h2>

    <h3>A List the Host Drives</h3>
    <pre v-pre><code>&lt;UtensilListbox
  ref="listbox"
  v-model:focused-value="focused"
  aria-label="Fruit"
  tabindex="0"
  :aria-activedescendant="listbox?.activeDescendant ?? undefined"
  @keydown.down.prevent="listbox?.focusNext()"
  @keydown.up.prevent="listbox?.focusPrev()"
  @keydown.enter.prevent="chosen = focused"
&gt;
  &lt;div
    v-for="option in options"
    :id="`fruit-${option.value}`"
    :key="option.value"
    role="option"
    :aria-selected="chosen === option.value"
    :data-value="option.value"
    data-focusable
    @click="chosen = option.value"
  &gt;{{ option.label }}&lt;/div&gt;
&lt;/UtensilListbox&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component - no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
