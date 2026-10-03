<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilDatePicker</h1>
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
      A date picker that composes a popover trigger with an inline calendar. Supports single date and date range
      selection, keyboard date entry, locale-aware formatting, and quick-select presets.
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
          <td><code>Date | null</code></td>
          <td><code>null</code></td>
          <td>Selected date in single mode (v-model binding).</td>
        </tr>
        <tr>
          <td><code>range</code></td>
          <td><code>DateRange | null</code></td>
          <td><code>null</code></td>
          <td>Selected date range in range mode (v-model:range binding).</td>
        </tr>
        <tr>
          <td><code>mode</code></td>
          <td><code>'single' | 'range'</code></td>
          <td><code>'single'</code></td>
          <td>Selection mode.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>'outline' | 'surface' | 'soft'</code></td>
          <td><code>'surface'</code></td>
          <td>Visual variation of the trigger input.</td>
        </tr>
        <tr>
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Label text for the trigger input.</td>
        </tr>
        <tr>
          <td><code>labelPlacement</code></td>
          <td><code>'block' | 'inline'</code></td>
          <td><code>'block'</code></td>
          <td>Where the label appears relative to the input.</td>
        </tr>
        <tr>
          <td><code>placeholder</code></td>
          <td><code>string</code></td>
          <td><code>'Select date'</code></td>
          <td>Placeholder text when no date is selected.</td>
        </tr>
        <tr>
          <td><code>locale</code></td>
          <td><code>string</code></td>
          <td><code>navigator.language</code></td>
          <td>BCP 47 locale string for formatting and input parsing.</td>
        </tr>
        <tr>
          <td><code>weekStartsOn</code></td>
          <td><code>number</code></td>
          <td><code>1</code></td>
          <td>First day of the week. 0 = Sunday, 1 = Monday, etc.</td>
        </tr>
        <tr>
          <td><code>numberOfMonths</code></td>
          <td><code>1 | 2</code></td>
          <td><code>1</code></td>
          <td>Number of calendar months displayed in the popover panel.</td>
        </tr>
        <tr>
          <td><code>min</code></td>
          <td><code>Date | null</code></td>
          <td><code>null</code></td>
          <td>Minimum selectable date.</td>
        </tr>
        <tr>
          <td><code>max</code></td>
          <td><code>Date | null</code></td>
          <td><code>null</code></td>
          <td>Maximum selectable date.</td>
        </tr>
        <tr>
          <td><code>disabledDates</code></td>
          <td><code>(date: Date) =&gt; boolean</code></td>
          <td>—</td>
          <td>Function that returns <code>true</code> for dates that should not be selectable.</td>
        </tr>
        <tr>
          <td><code>clearable</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Show a clear button when a date is selected.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td>—</td>
          <td>Accent color for the calendar selection.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td>—</td>
          <td>Scale of the calendar.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disable the picker entirely.</td>
        </tr>
        <tr>
          <td><code>placement</code></td>
          <td><code>PopoverPlacement</code></td>
          <td><code>'bottom-start'</code></td>
          <td>Popover placement relative to the trigger.</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Choose date'</code></td>
          <td>Accessible label for the trigger input.</td>
        </tr>
        <tr>
          <td><code>presets</code></td>
          <td><code>DatePreset[]</code></td>
          <td>—</td>
          <td>Quick selection presets shown below the calendar.</td>
        </tr>
        <tr>
          <td><code>triggerIcon</code></td>
          <td><code>IconProp</code></td>
          <td><code>'calendar'</code></td>
          <td>Icon displayed in the trigger input.</td>
        </tr>
        <tr>
          <td><code>datePreference</code></td>
          <td><code>'past' | 'future'</code></td>
          <td>—</td>
          <td>
            How to interpret 2-digit years in keyboard entry. <code>'past'</code> maps to 1900s,
            <code>'future'</code> to 2000s. Unset uses automatic heuristic.
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
          <td><code>Date | null</code></td>
          <td>Fires when a single date is selected or cleared.</td>
        </tr>
        <tr>
          <td><code>update:range</code></td>
          <td><code>DateRange</code></td>
          <td>Fires when a date range is selected or cleared.</td>
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
          <td><code>trigger</code></td>
          <td>
            <code>{ value, formatted, isOpen, toggle, open, close, disabled }</code>
          </td>
          <td>
            Replaces the default trigger input. Scope provides the current value (<code>Date</code> or
            <code>DateRange</code>), a <code>formatted</code> display string, popover state, and controls.
          </td>
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
          <td><code>open()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Open the popover programmatically.</td>
        </tr>
        <tr>
          <td><code>close()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Close the popover programmatically.</td>
        </tr>
        <tr>
          <td><code>toggle()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Toggle the popover open/closed.</td>
        </tr>
        <tr>
          <td><code>isOpen</code></td>
          <td><code>boolean</code></td>
          <td>Whether the popover is currently open.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Single Date</h3>
    <pre><code>&lt;UtensilDatePicker v-model="date" label="Start date" /&gt;</code></pre>

    <h3>Date Range with Dual Months</h3>
    <pre><code>&lt;UtensilDatePicker
  v-model:range="range"
  mode="range"
  :number-of-months="2"
  placeholder="Select date range"
/&gt;</code></pre>

    <h3>With Presets and Constraints</h3>
    <pre><code>&lt;UtensilDatePicker
  v-model:range="range"
  mode="range"
  :min="minDate"
  :max="maxDate"
  :presets="[
    { label: 'Last 7 days', value: { start: weekAgo, end: today } },
    { label: 'Last 30 days', value: { start: monthAgo, end: today } },
  ]"
/&gt;</code></pre>

    <h3>Custom Trigger</h3>
    <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
    <pre v-pre><code>&lt;UtensilDatePicker v-model="date"&gt;
  &lt;template #trigger="{ formatted, toggle, isOpen }"&gt;
    &lt;button @click="toggle"&gt;
      {{ formatted || 'Pick a date' }}
    &lt;/button&gt;
  &lt;/template&gt;
&lt;/UtensilDatePicker&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
