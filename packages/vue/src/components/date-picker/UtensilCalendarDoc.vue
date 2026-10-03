<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilCalendar</h1>
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
      An inline calendar grid for selecting a single date or a date range. Supports locale-aware month/weekday names,
      min/max constraints, disabled dates, dual-month layout, year picker, and full keyboard navigation.
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
          <td><code>locale</code></td>
          <td><code>string</code></td>
          <td><code>navigator.language</code></td>
          <td>BCP 47 locale string for month and weekday names.</td>
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
          <td>Number of months displayed side by side.</td>
        </tr>
        <tr>
          <td><code>min</code></td>
          <td><code>Date | null</code></td>
          <td><code>null</code></td>
          <td>Minimum selectable date. Days before this are disabled.</td>
        </tr>
        <tr>
          <td><code>max</code></td>
          <td><code>Date | null</code></td>
          <td><code>null</code></td>
          <td>Maximum selectable date. Days after this are disabled.</td>
        </tr>
        <tr>
          <td><code>disabledDates</code></td>
          <td><code>(date: Date) =&gt; boolean</code></td>
          <td>—</td>
          <td>Function that returns <code>true</code> for dates that should not be selectable.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td>—</td>
          <td>Accent color for selected days and range highlights.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td>—</td>
          <td>Scale of the calendar.</td>
        </tr>
        <tr>
          <td><code>showAdjacentDays</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Show leading/trailing days from adjacent months. Automatically disabled when <code>min</code> or
            <code>max</code> is set.
          </td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disable the entire calendar.</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Calendar'</code></td>
          <td>Accessible label for the calendar container.</td>
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
          <td>Fires when a single date is selected.</td>
        </tr>
        <tr>
          <td><code>update:range</code></td>
          <td><code>DateRange</code></td>
          <td>
            Fires when a range selection changes. First click sets <code>start</code> with <code>end: null</code>;
            second click completes the range.
          </td>
        </tr>
        <tr>
          <td><code>dayClick</code></td>
          <td><code>Date</code></td>
          <td>Fires whenever a day is clicked, regardless of mode.</td>
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
          <td><code>navigatePrev()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Navigate to the previous month.</td>
        </tr>
        <tr>
          <td><code>navigateNext()</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Navigate to the next month.</td>
        </tr>
        <tr>
          <td><code>currentMonth</code></td>
          <td><code>{ year: number, month: number }</code></td>
          <td>The currently displayed month (0-based month).</td>
        </tr>
      </tbody>
    </table>

    <h2>Keyboard Navigation</h2>
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>Arrow keys</code></td>
          <td>Move focus between days.</td>
        </tr>
        <tr>
          <td><code>Home / End</code></td>
          <td>Jump to first / last day of the month.</td>
        </tr>
        <tr>
          <td><code>Page Up / Down</code></td>
          <td>Navigate to previous / next month.</td>
        </tr>
        <tr>
          <td><code>Shift + Page Up / Down</code></td>
          <td>Navigate to previous / next year.</td>
        </tr>
        <tr>
          <td><code>Enter / Space</code></td>
          <td>Select the focused day.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Single Date Selection</h3>
    <pre><code>&lt;UtensilCalendar v-model="date" /&gt;</code></pre>

    <h3>Date Range with Dual Months</h3>
    <pre><code>&lt;UtensilCalendar
  v-model:range="range"
  mode="range"
  :number-of-months="2"
/&gt;</code></pre>

    <h3>Constrained with Disabled Weekends</h3>
    <pre><code>&lt;UtensilCalendar
  v-model="date"
  :min="minDate"
  :max="maxDate"
  :disabled-dates="(d) =&gt; d.getDay() === 0 || d.getDay() === 6"
/&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
