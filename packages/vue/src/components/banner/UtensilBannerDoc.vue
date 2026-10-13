<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilBanner</h1>
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
      A banner across the top or bottom edge of a page, for a message the user can act on without being interrupted. It
      sits in the page's layout and takes its own space, so it never covers content, and its surface is opaque whatever
      its variation. It grows into place when it appears, shrinks away when it closes, and never takes focus.
    </p>

    <UtensilCallout icon="exclamation-triangle">
      Place the banner where it belongs in the layout, as the first or last child of a column that fills the viewport,
      and give the page beside it the remaining space.
    </UtensilCallout>

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
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>required</td>
          <td>Names the banner's region for assistive technology.</td>
        </tr>
        <tr>
          <td><code>position</code></td>
          <td><code>'top' | 'bottom'</code></td>
          <td><code>'top'</code></td>
          <td>
            The page edge the banner attaches to. Its border and shadow face the page from that edge, and it slides in
            from it.
          </td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Theme color of the banner's fill and icon.</td>
        </tr>
        <tr>
          <td><code>variation</code></td>
          <td><code>'surface' | 'soft' | 'outline' | 'solid'</code></td>
          <td><code>'surface'</code></td>
          <td>Visual weight of the banner's fill.</td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td><code>IconProp</code></td>
          <td>—</td>
          <td>Icon shown at the start of the banner.</td>
        </tr>
        <tr>
          <td><code>scale</code></td>
          <td><code>ScaleProp</code></td>
          <td>—</td>
          <td>Scale relative to the parent.</td>
        </tr>
        <tr>
          <td><code>dismissible</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Shows a close button at the end of the banner, which closes it and emits <code>dismiss</code>.</td>
        </tr>
        <tr>
          <td><code>dismissLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Dismiss'</code></td>
          <td>The close button's accessible name.</td>
        </tr>
        <tr>
          <td><code>centered</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Centers the content on the banner, with the icon at its start and the actions and close button at its end.
            The content takes <code>--utensil-banner-content-width</code>, or its own width, up to what fits.
          </td>
        </tr>
        <tr>
          <td><code>role</code></td>
          <td><code>'status' | 'alert'</code></td>
          <td>—</td>
          <td>
            Announces the banner's content when it appears: <code>status</code> waits for a pause, <code>alert</code>
            interrupts. Leave it unset for a banner that's on the page from the start.
          </td>
        </tr>
        <tr>
          <td><code>open</code></td>
          <td><code>boolean</code></td>
          <td>—</td>
          <td>
            Whether the banner shows. Bind with <code>v-model:open</code> to control it; left unbound, the banner shows
            until its close button closes it. Opening grows it into place and closing shrinks it away.
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
          <td><code>dismiss</code></td>
          <td>—</td>
          <td>The close button was clicked.</td>
        </tr>
        <tr>
          <td><code>update:open</code></td>
          <td><code>boolean</code></td>
          <td>The close button asks the banner to close (<code>false</code>), for <code>v-model:open</code>.</td>
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
          <td>—</td>
          <td>The banner's message or content.</td>
        </tr>
        <tr>
          <td><code>actions</code></td>
          <td>—</td>
          <td>Buttons after the content. They wrap below it when the banner is narrow.</td>
        </tr>
      </tbody>
    </table>

    <h2>CSS Custom Properties</h2>
    <table>
      <thead>
        <tr>
          <th>Property</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>--utensil-banner-padding</code></td>
          <td><code>var(--space-3) var(--space-4)</code></td>
          <td>Padding inside the banner.</td>
        </tr>
        <tr>
          <td><code>--utensil-banner-content-min-width</code></td>
          <td><code>20rem</code></td>
          <td>Narrowest the icon and content get together before the actions wrap below them.</td>
        </tr>
        <tr>
          <td><code>--utensil-banner-content-width</code></td>
          <td><code>max-content</code></td>
          <td>Width of <code>centered</code> content, up to what fits between the banner's edges.</td>
        </tr>
        <tr>
          <td><code>--utensil-banner-duration</code></td>
          <td><code>0.3s</code></td>
          <td>How long the banner takes to grow into place and to shrink away. Reduced motion skips both.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Notice</h3>
    <pre><code>&lt;UtensilBanner label="Maintenance" icon="calendar" dismissible @dismiss="rememberDismissed"&gt;
  The service will be unavailable on Sunday from 02:00 to 03:00 UTC.
&lt;/UtensilBanner&gt;</code></pre>

    <h3>Announced, and Controlled</h3>
    <pre><code>&lt;UtensilBanner v-model:open="offline" label="Connection" color="warning" icon="exclamation-triangle" role="status"&gt;
  You're offline. Changes will be saved when you reconnect.
&lt;/UtensilBanner&gt;</code></pre>

    <h3>Question at the Bottom</h3>
    <pre><code>&lt;div class="page flex column"&gt;
  &lt;main class="flex-grow"&gt;…&lt;/main&gt;
  &lt;UtensilBanner position="bottom" label="Quick question" dismissible dismiss-label="Not now" @dismiss="close"&gt;
    How likely are you to use this again?
    &lt;template #actions&gt;
      &lt;UtensilButton label="Answer" @click="answer" /&gt;
    &lt;/template&gt;
  &lt;/UtensilBanner&gt;
&lt;/div&gt;</code></pre>

    <h3>Centered Form</h3>
    <pre><code>&lt;UtensilBanner position="bottom" label="Feedback" centered dismissible style="--utensil-banner-content-width: 48rem"&gt;
  &lt;FeedbackForm /&gt;
&lt;/UtensilBanner&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilCallout from '../callout/UtensilCallout.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
