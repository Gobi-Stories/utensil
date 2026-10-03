<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilConfirm</h1>
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
      A confirmation dialog that wraps UtensilDialog to guard user actions. The trigger element is placed in the default
      slot and receives a <code>confirm</code> callback that opens the dialog. Supports an
      <code>adoptChildButton</code> mode that moves the trigger into the dialog footer as the OK button.
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
          <td><code>title</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Title displayed in the dialog header.</td>
        </tr>
        <tr>
          <td><code>message</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Plain-text message shown in the dialog body. Overridden by the <code>message</code> slot.</td>
        </tr>
        <tr>
          <td><code>adoptChildButton</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Move the trigger element into the dialog footer, replacing the default OK button.</td>
        </tr>
        <tr>
          <td><code>noCancel</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Hide the Cancel button in the footer.</td>
        </tr>
        <tr>
          <td><code>noCloseOnOk</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Prevent the dialog from closing when OK is clicked.</td>
        </tr>
        <tr>
          <td><code>okLabel</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Label for the OK button.</td>
        </tr>
        <tr>
          <td><code>okVariation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td>—</td>
          <td>Visual variation for the OK button.</td>
        </tr>
        <tr>
          <td><code>okColor</code></td>
          <td><code>ColorProp</code></td>
          <td>—</td>
          <td>Theme color for the OK button.</td>
        </tr>
        <tr>
          <td><code>cancelLabel</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Label for the Cancel button.</td>
        </tr>
        <tr>
          <td><code>cancelVariation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td><code>'soft'</code></td>
          <td>Visual variation for the Cancel button.</td>
        </tr>
        <tr>
          <td><code>cancelColor</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pencil'</code></td>
          <td>Theme color for the Cancel button.</td>
        </tr>
        <tr>
          <td><code>size</code></td>
          <td><code>'small' | 'medium' | 'large'</code></td>
          <td>—</td>
          <td>Dialog size preset controlling max width and height.</td>
        </tr>
        <tr>
          <td><code>closeOnBackdrop</code></td>
          <td><code>boolean</code></td>
          <td>—</td>
          <td>Allow closing the dialog by clicking the backdrop.</td>
        </tr>
        <tr>
          <td><code>closeOnEscape</code></td>
          <td><code>boolean</code></td>
          <td>—</td>
          <td>Allow closing the dialog by pressing Escape.</td>
        </tr>
        <tr>
          <td><code>appendToDom</code></td>
          <td><code>boolean</code></td>
          <td>—</td>
          <td>Move the dialog to the modal host element in the DOM to avoid stacking context issues.</td>
        </tr>
        <tr>
          <td><code>scrollable</code></td>
          <td><code>boolean</code></td>
          <td>—</td>
          <td>Enable scrolling in the dialog body area.</td>
        </tr>
        <tr>
          <td><code>fullscreenOnMobile</code></td>
          <td><code>boolean</code></td>
          <td>—</td>
          <td>Expand the dialog to fill the viewport on small screens.</td>
        </tr>
        <tr>
          <td><code>addHistory</code></td>
          <td><code>boolean</code></td>
          <td>—</td>
          <td>Push a browser history entry when opened, so the back button closes the dialog.</td>
        </tr>
        <tr>
          <td><code>blur</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Blur the page behind the backdrop. Level set by <code>--utensil-modal-backdrop-blur</code>.</td>
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
          <td><code>open</code></td>
          <td>—</td>
          <td>Fires when the confirmation dialog is opened via <code>confirm()</code>.</td>
        </tr>
        <tr>
          <td><code>ok</code></td>
          <td>—</td>
          <td>Fires when the OK button is clicked. Also invokes the callback passed to <code>confirm(ok)</code>.</td>
        </tr>
        <tr>
          <td><code>cancel</code></td>
          <td>—</td>
          <td>Fires when the Cancel button is clicked.</td>
        </tr>
        <tr>
          <td><code>opened</code></td>
          <td>—</td>
          <td>Fires after the dialog has been shown.</td>
        </tr>
        <tr>
          <td><code>closing</code></td>
          <td><code>Event</code></td>
          <td>Fires before closing. Call <code>event.preventDefault()</code> to cancel.</td>
        </tr>
        <tr>
          <td><code>closed</code></td>
          <td>—</td>
          <td>Fires after the dialog has fully closed and state is reset.</td>
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
          <td><code>{ confirm, isOpen }</code></td>
          <td>
            Trigger element. Call <code>confirm()</code> to open the dialog. Optionally pass a callback
            <code>confirm(onOk)</code> to run when OK is clicked.
          </td>
        </tr>
        <tr>
          <td><code>message</code></td>
          <td><code>{ ok, cancel, close }</code></td>
          <td>Custom dialog body content. Overrides the <code>message</code> prop.</td>
        </tr>
        <tr>
          <td><code>footer</code></td>
          <td><code>{ ok, cancel, close }</code></td>
          <td>Replaces the default footer. Only used when <code>adoptChildButton</code> is <code>false</code>.</td>
        </tr>
        <tr>
          <td><code>cancel</code></td>
          <td><code>{ ok, cancel, close }</code></td>
          <td>
            Replaces the cancel button when <code>adoptChildButton</code> is <code>true</code> and
            <code>noCancel</code> is <code>true</code>.
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
          <td><code>confirm()</code></td>
          <td><code>(ok?: () =&gt; void) =&gt; void</code></td>
          <td>Open the confirmation dialog programmatically. Optionally pass a callback invoked on OK.</td>
        </tr>
        <tr>
          <td><code>close()</code></td>
          <td><code>(force?: boolean) =&gt; void</code></td>
          <td>
            Close the dialog programmatically. Pass <code>true</code> to force close without triggering the closing
            event.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Confirmation</h3>
    <pre><code>&lt;UtensilConfirm
  title="Delete Item"
  message="Are you sure? This cannot be undone."
  ok-label="Delete"
  ok-color="error"
  @ok="handleDelete"
&gt;
  &lt;template #default="{ confirm }"&gt;
    &lt;UtensilButton color="error" @click="confirm()"&gt;Delete&lt;/UtensilButton&gt;
  &lt;/template&gt;
&lt;/UtensilConfirm&gt;</code></pre>

    <h3>Custom Message Content</h3>
    <pre><code>&lt;UtensilConfirm title="Save Changes" @ok="handleSave"&gt;
  &lt;template #default="{ confirm }"&gt;
    &lt;UtensilButton @click="confirm()"&gt;Save&lt;/UtensilButton&gt;
  &lt;/template&gt;
  &lt;template #message&gt;
    &lt;p&gt;Do you want to save your changes?&lt;/p&gt;
    &lt;p&gt;&lt;strong&gt;Unsaved changes will be lost.&lt;/strong&gt;&lt;/p&gt;
  &lt;/template&gt;
&lt;/UtensilConfirm&gt;</code></pre>

    <h3>Adopt Child Button</h3>
    <pre><code>&lt;UtensilConfirm
  title="Factory Reset"
  message="This will erase all settings."
  adopt-child-button
  ok-label="Reset"
  ok-variation="outline"
&gt;
  &lt;template #default="{ confirm }"&gt;
    &lt;UtensilButton variation="outline" @click="confirm"&gt;Factory Reset&lt;/UtensilButton&gt;
  &lt;/template&gt;
&lt;/UtensilConfirm&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
