<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilDialog</h1>
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
      A structured dialog built on top of UtensilModal, providing a header with title and close button, a scrollable
      body area, and a footer with configurable OK/Cancel buttons. Supports async loading states and custom footer
      content.
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
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Controls dialog visibility (v-model binding).</td>
        </tr>
        <tr>
          <td><code>title</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Title displayed in the dialog header.</td>
        </tr>
        <tr>
          <td><code>showCloseButton</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Show a close button in the header.</td>
        </tr>
        <tr>
          <td><code>closeButtonDescription</code></td>
          <td><code>string</code></td>
          <td><code>'Close'</code></td>
          <td>Accessible label for the close button.</td>
        </tr>
        <tr>
          <td><code>noFooter</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Hide the entire footer section.</td>
        </tr>
        <tr>
          <td><code>noCancel</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Hide the Cancel button in the footer.</td>
        </tr>
        <tr>
          <td><code>okLabel</code></td>
          <td><code>string</code></td>
          <td><code>'OK'</code></td>
          <td>Label for the OK button.</td>
        </tr>
        <tr>
          <td><code>okVariation</code></td>
          <td><code>UtensilUIVariation</code></td>
          <td><code>'solid'</code></td>
          <td>Visual variation for the OK button.</td>
        </tr>
        <tr>
          <td><code>okColor</code></td>
          <td><code>ColorProp</code></td>
          <td><code>'pen'</code></td>
          <td>Theme color for the OK button.</td>
        </tr>
        <tr>
          <td><code>cancelLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Cancel'</code></td>
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
          <td><code>okLoading</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Show a loading spinner on the OK button.</td>
        </tr>
        <tr>
          <td><code>okDisabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disable the OK button.</td>
        </tr>
        <tr>
          <td><code>noCloseOnOk</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Prevent the dialog from closing when OK is clicked. Useful for async operations.</td>
        </tr>
        <tr>
          <td><code>scrollable</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Enable scrolling in the body area. Also sets <code>expand</code> on the underlying modal.</td>
        </tr>
        <tr>
          <td><code>closeOnBackdrop</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Allow closing the dialog by clicking the backdrop.</td>
        </tr>
        <tr>
          <td><code>closeOnEscape</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Allow closing the dialog by pressing Escape.</td>
        </tr>
        <tr>
          <td><code>appendToDom</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Move the dialog to the modal host element in the DOM to avoid stacking context issues.</td>
        </tr>
        <tr>
          <td><code>fullscreenOnMobile</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Expand the dialog to fill the viewport on small screens.</td>
        </tr>
        <tr>
          <td><code>size</code></td>
          <td><code>'small' | 'medium' | 'large'</code></td>
          <td><code>'medium'</code></td>
          <td>Dialog size preset controlling max width and height.</td>
        </tr>
        <tr>
          <td><code>expand</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Expand the modal container to its maximum height.</td>
        </tr>
        <tr>
          <td><code>addHistory</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
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
          <td><code>update:modelValue</code></td>
          <td><code>boolean</code></td>
          <td>Fires when the dialog opens or closes (v-model binding).</td>
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
          <td>Fires after the dialog has fully closed.</td>
        </tr>
        <tr>
          <td><code>ok</code></td>
          <td>—</td>
          <td>Fires when the OK button is clicked.</td>
        </tr>
        <tr>
          <td><code>cancel</code></td>
          <td>—</td>
          <td>Fires when the Cancel button is clicked.</td>
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
          <td><code>{ ok, cancel, close }</code></td>
          <td>Dialog body content.</td>
        </tr>
        <tr>
          <td><code>actions</code></td>
          <td><code>{ ok, cancel, close }</code></td>
          <td>Additional action buttons displayed in the header, before the close button.</td>
        </tr>
        <tr>
          <td><code>footer</code></td>
          <td><code>{ ok, cancel, close }</code></td>
          <td>Replaces the default OK/Cancel footer with custom content.</td>
        </tr>
        <tr>
          <td><code>message</code></td>
          <td>—</td>
          <td>
            Rendered at the start of the footer, before the buttons: a status or error message that stays in view while
            the dialog is held open with <code>noCloseOnOk</code>. It wraps onto its own line when the footer is narrow.
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

    <h3>Basic Usage</h3>
    <pre><code>&lt;UtensilDialog v-model="showDialog" title="Confirm Action"&gt;
  &lt;p&gt;Are you ready to proceed?&lt;/p&gt;
&lt;/UtensilDialog&gt;</code></pre>

    <h3>Async Operation with Loading State</h3>
    <pre><code>&lt;UtensilDialog
  v-model="showDialog"
  title="Processing"
  ok-label="Submit"
  :ok-loading="isSubmitting"
  :no-close-on-ok="true"
  @ok="handleSubmit"
&gt;
  &lt;p&gt;Click Submit to start the operation.&lt;/p&gt;
&lt;/UtensilDialog&gt;</code></pre>

    <h3>Custom Footer</h3>
    <pre><code>&lt;UtensilDialog v-model="showDialog" title="Edit Item"&gt;
  &lt;p&gt;Make your changes below.&lt;/p&gt;

  &lt;template #footer="{ close }"&gt;
    &lt;UtensilButton variation="outline" @click="close()"&gt;Discard&lt;/UtensilButton&gt;
    &lt;UtensilButton color="success" @click="save()"&gt;Save&lt;/UtensilButton&gt;
    &lt;UtensilButton color="error" @click="remove()"&gt;Delete&lt;/UtensilButton&gt;
  &lt;/template&gt;
&lt;/UtensilDialog&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
import UtensilBadge from '../badge/UtensilBadge.vue'
import UtensilPopoverPanel from '../popover/UtensilPopoverPanel.vue'
</script>

<style src="../../utensil-docs.css"></style>
