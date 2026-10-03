<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilTabs</h1>
    </div>
    <p>
      A composite tabs component for organizing content into switchable panels. Supports controlled and uncontrolled
      modes, horizontal and vertical orientation, automatic and manual activation, and full keyboard navigation.
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
          <td>&#8212;</td>
          <td>Selected tab value for controlled mode (v-model binding).</td>
        </tr>
        <tr>
          <td><code>defaultValue</code></td>
          <td><code>string</code></td>
          <td>&#8212;</td>
          <td>Initial selected tab value for uncontrolled mode.</td>
        </tr>
        <tr>
          <td><code>orientation</code></td>
          <td><code>'horizontal' | 'vertical'</code></td>
          <td><code>'horizontal'</code></td>
          <td>Tab layout direction. Affects keyboard navigation keys and flex direction.</td>
        </tr>
        <tr>
          <td><code>activationMode</code></td>
          <td><code>'automatic' | 'manual'</code></td>
          <td><code>'automatic'</code></td>
          <td>Automatic activates tabs on arrow-key focus. Manual requires click or Enter/Space.</td>
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
          <td>Fires when the selected tab changes (v-model binding).</td>
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
              >{ value: string, setValue: (value: string) =&gt; void, orientation: TabsOrientation, activationMode:
              TabsActivationMode }</code
            >
          </td>
          <td>
            Contains <code>UtensilTabsList</code> and <code>UtensilTabsContent</code> children. Scope allows custom
            children to participate.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Child Participation</h2>
    <p>
      Built-in children (<code>UtensilTabsList</code>, <code>UtensilTabsTrigger</code>, <code>UtensilTabsContent</code>)
      use <code>provide</code>/<code>inject</code> for convenience. Custom children can use the slot scope API instead.
    </p>

    <h3>Custom Trigger via Slot Scope</h3>
    <pre><code>&lt;UtensilTabs default-value="standard"&gt;
  &lt;UtensilTabsList&gt;
    &lt;template #default="{ value, setValue }"&gt;
      &lt;UtensilTabsTrigger value="standard"&gt;Standard&lt;/UtensilTabsTrigger&gt;
      &lt;button
        role="tab"
        :class="{ active: value === 'custom' }"
        :aria-selected="value === 'custom'"
        :tabindex="value === 'custom' ? 0 : -1"
        data-value="custom"
        @click="setValue('custom')"
      &gt;Custom Trigger&lt;/button&gt;
    &lt;/template&gt;
  &lt;/UtensilTabsList&gt;
  &lt;UtensilTabsContent value="standard"&gt;...&lt;/UtensilTabsContent&gt;
  &lt;UtensilTabsContent value="custom"&gt;...&lt;/UtensilTabsContent&gt;
&lt;/UtensilTabs&gt;</code></pre>

    <h2>Examples</h2>

    <h3>Basic Usage (Uncontrolled)</h3>
    <pre><code>&lt;UtensilTabs default-value="account"&gt;
  &lt;UtensilTabsList&gt;
    &lt;UtensilTabsTrigger value="account"&gt;Account&lt;/UtensilTabsTrigger&gt;
    &lt;UtensilTabsTrigger value="settings"&gt;Settings&lt;/UtensilTabsTrigger&gt;
  &lt;/UtensilTabsList&gt;
  &lt;UtensilTabsContent value="account"&gt;Account panel&lt;/UtensilTabsContent&gt;
  &lt;UtensilTabsContent value="settings"&gt;Settings panel&lt;/UtensilTabsContent&gt;
&lt;/UtensilTabs&gt;</code></pre>

    <h3>Controlled with v-model</h3>
    <pre><code>&lt;UtensilTabs v-model="activeTab"&gt;
  &lt;UtensilTabsList color="success"&gt;
    &lt;UtensilTabsTrigger value="published"&gt;Published&lt;/UtensilTabsTrigger&gt;
    &lt;UtensilTabsTrigger value="drafts"&gt;Drafts&lt;/UtensilTabsTrigger&gt;
  &lt;/UtensilTabsList&gt;
  &lt;UtensilTabsContent value="published"&gt;...&lt;/UtensilTabsContent&gt;
  &lt;UtensilTabsContent value="drafts"&gt;...&lt;/UtensilTabsContent&gt;
&lt;/UtensilTabs&gt;</code></pre>

    <h3>Vertical Orientation</h3>
    <pre><code>&lt;UtensilTabs default-value="general" orientation="vertical"&gt;
  &lt;UtensilTabsList&gt;
    &lt;UtensilTabsTrigger value="general"&gt;General&lt;/UtensilTabsTrigger&gt;
    &lt;UtensilTabsTrigger value="security"&gt;Security&lt;/UtensilTabsTrigger&gt;
  &lt;/UtensilTabsList&gt;
  &lt;UtensilTabsContent value="general"&gt;...&lt;/UtensilTabsContent&gt;
  &lt;UtensilTabsContent value="security"&gt;...&lt;/UtensilTabsContent&gt;
&lt;/UtensilTabs&gt;</code></pre>

    <hr />

    <div class="doc-header">
      <h1>UtensilTabsList</h1>
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
      The tab list container that holds <code>UtensilTabsTrigger</code> children. Provides keyboard navigation, size
      scaling, and accent color theming. Must be placed inside <code>UtensilTabs</code>.
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
          <td><code>size</code></td>
          <td><code>'1' | '2'</code></td>
          <td><code>'2'</code></td>
          <td>Size of the tab triggers. <code>'1'</code> is compact, <code>'2'</code> is default.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Accent color for the active tab indicator.</td>
        </tr>
        <tr>
          <td><code>loop</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Whether keyboard navigation wraps around from last to first trigger.</td>
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
            <code>{ value: string, setValue: (value: string) =&gt; void, activationMode: TabsActivationMode }</code>
          </td>
          <td>Contains <code>UtensilTabsTrigger</code> children. Scope allows custom triggers to participate.</td>
        </tr>
      </tbody>
    </table>

    <hr />

    <div class="doc-header">
      <h1>UtensilTabsTrigger</h1>
    </div>
    <p>
      A tab trigger button. Renders as a <code>&lt;button&gt;</code> with <code>role="tab"</code>. Must be placed inside
      <code>UtensilTabsList</code>.
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
          <td><code>value</code></td>
          <td><code>string</code></td>
          <td>&#8212;</td>
          <td>Unique value identifying this tab. Must match a corresponding <code>UtensilTabsContent</code> value.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disable the trigger, preventing click and keyboard activation.</td>
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
          <td>&#8212;</td>
          <td>Tab trigger label content.</td>
        </tr>
      </tbody>
    </table>

    <hr />

    <div class="doc-header">
      <h1>UtensilTabsContent</h1>
    </div>
    <p>
      A tab content panel. Renders as a <code>&lt;div&gt;</code> with <code>role="tabpanel"</code>. Only visible when
      the matching trigger is active. Must be placed inside <code>UtensilTabs</code>.
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
          <td><code>value</code></td>
          <td><code>string</code></td>
          <td>&#8212;</td>
          <td>Value matching the corresponding <code>UtensilTabsTrigger</code>.</td>
        </tr>
        <tr>
          <td><code>forceMount</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Force mount the panel even when inactive. Useful for animations or preserving state.</td>
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
          <td><code>{ selected: boolean }</code></td>
          <td>Tab panel content. Scope exposes selected state for custom rendering.</td>
        </tr>
      </tbody>
    </table>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
