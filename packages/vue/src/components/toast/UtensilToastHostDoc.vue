<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilToastHost</h1>
    </div>
    <p>
      Manages multiple concurrent toasts with animated enter/leave transitions. Each toast is rendered as a
      <code>UtensilToast</code> with <code>position="relative"</code>. Pair with the <code>useToasts</code> composable
      for reactive handles that support progress updates and programmatic dismissal.
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
          <td><code>toasts</code></td>
          <td><code>ToastEntry[]</code></td>
          <td>—</td>
          <td>Array of toast entries to render. Typically provided by <code>useToasts</code>.</td>
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
          <td><code>number</code> (toast id)</td>
          <td>
            Emitted when a toast's close button is clicked. Call <code>dismiss(id)</code> to start the leave animation.
          </td>
        </tr>
        <tr>
          <td><code>leave</code></td>
          <td><code>number</code> (toast id)</td>
          <td>
            Emitted when a toast's leave animation completes. Call <code>remove(id)</code> to remove it from the list.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>useToasts Composable</h2>
    <table>
      <thead>
        <tr>
          <th>Method / Property</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>toasts</code></td>
          <td><code>Ref&lt;ToastEntry[]&gt;</code></td>
          <td>Reactive array of active toast entries.</td>
        </tr>
        <tr>
          <td><code>add(message, options?)</code></td>
          <td><code>ToastHandle</code></td>
          <td>
            Adds a toast and returns a handle with <code>update()</code>, <code>dismiss()</code> and
            <code>presented()</code> — the latter reports whether the toast is still on screen. The entry's
            <code>onDismiss</code> option runs when the user dismisses the toast, not when it times out.
          </td>
        </tr>
        <tr>
          <td><code>dismiss(id)</code></td>
          <td><code>void</code></td>
          <td>
            Marks a toast as leaving, starting the collapse animation. A toast dismissed before its enter began is
            removed immediately.
          </td>
        </tr>
        <tr>
          <td><code>remove(id)</code></td>
          <td><code>void</code></td>
          <td>Removes a toast from the list. Call after the leave animation completes.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre><code>const toasts = useToasts()
toasts.add('File saved!')

&lt;UtensilToastHost :toasts="toasts.toasts.value" :dismiss="toasts.dismiss" :remove="toasts.remove" /&gt;</code></pre>

    <h3>Progress Toast</h3>
    <pre><code>const handle = toasts.add('Uploading...', { progress: 0 })
handle.update({ progress: 0.5 }) // 50%
handle.dismiss()</code></pre>
  </article>
</template>

<style src="../../utensil-docs.css"></style>
