<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilResourceLoader</h1>
    </div>
    <p>
      Displays loading, error, and content states for an asynchronous resource. Wraps content in a spinner overlay while
      loading, shows contextual error messages with optional retry, and fades content in once loaded.
    </p>

    <!-- Props -->
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
          <td><code>load</code></td>
          <td><code>() =&gt; void</code></td>
          <td>—</td>
          <td>Callback to trigger a load or retry attempt. Passed to the retry button in the error state.</td>
        </tr>
        <tr>
          <td><code>loaded</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Whether the resource has been successfully loaded. When <code>true</code>, the default slot content is
            rendered.
          </td>
        </tr>
        <tr>
          <td><code>syncing</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Whether a load or sync operation is in progress. Controls the spinner overlay visibility.</td>
        </tr>
        <tr>
          <td><code>hasError</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Whether loading has failed. When <code>true</code> and not loaded, the error state is shown.</td>
        </tr>
        <tr>
          <td><code>notFound</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Whether the requested resource was not found. When <code>true</code> and not loaded, a not found message is
            shown.
          </td>
        </tr>
        <tr>
          <td><code>mayRetry</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Shows a "Try Again" button in the default error state that calls <code>load</code>.</td>
        </tr>
        <tr>
          <td><code>error</code></td>
          <td><code>unknown</code></td>
          <td>—</td>
          <td>
            The error object. If <code>notFound</code> is true, a "not found" message is shown instead of the generic
            error.
          </td>
        </tr>
        <tr>
          <td><code>showSpinner</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Whether to show the spinner overlay while syncing and not yet loaded.</td>
        </tr>
        <tr>
          <td><code>showErrors</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Whether to show error messages when loading fails.</td>
        </tr>
        <tr>
          <td><code>loaderDelay</code></td>
          <td><code>number</code></td>
          <td><code>1750</code></td>
          <td>Milliseconds to wait before showing the spinner. Prevents flash on fast loads.</td>
        </tr>
        <tr>
          <td><code>spinnerScale</code></td>
          <td><code>number | UtensilSize</code></td>
          <td><code>1</code></td>
          <td>
            Scale of the spinner. Accepts a numeric factor or a named size (<code>'tiny'</code>, <code>'small'</code>,
            <code>'large'</code>, etc.).
          </td>
        </tr>
        <tr>
          <td><code>fadeSpinner</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            When <code>false</code>, the spinner vanishes instantly when loading completes. When <code>true</code>, it
            fades out.
          </td>
        </tr>
        <tr>
          <td><code>fadeContent</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Enables a fade-in transition when content appears after loading.</td>
        </tr>
        <tr>
          <td><code>fadeOut</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Enables a fade-out transition when content is hidden.</td>
        </tr>
        <tr>
          <td><code>liftUi</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Shifts the spinner and error states upward within the container for better visual balance.</td>
        </tr>
      </tbody>
    </table>

    <!-- Slots -->
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
          <td>The loaded content. Only rendered when <code>loaded</code> is <code>true</code>.</td>
        </tr>
        <tr>
          <td><code>error</code></td>
          <td>—</td>
          <td>Custom error UI. Replaces the built-in error and not-found messages.</td>
        </tr>
        <tr>
          <td><code>notFoundActions</code></td>
          <td>—</td>
          <td>Extra actions shown below the "not found" message (when <code>notFound</code> is true).</td>
        </tr>
        <tr>
          <td><code>errorActions</code></td>
          <td>—</td>
          <td>
            Extra actions shown below the generic error message and retry button (only in the default error slot).
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre v-pre><code>&lt;UtensilResourceLoader
  :load="item.refresh"
  :loaded="item.loaded.value"
  :syncing="item.syncing.value"
  :has-error="item.hasError.value"
  :not-found="item.notFound.value"
  :error="item.error.value"
  :may-retry="item.mayRetry.value"
&gt;
  &lt;div&gt;{{ item.resource.value?.title }}&lt;/div&gt;
&lt;/UtensilResourceLoader&gt;</code></pre>

    <h3>With Fade and Custom Delay</h3>
    <pre v-pre><code>&lt;UtensilResourceLoader
  :load="collection.refresh"
  :loaded="collection.loaded.value"
  :syncing="collection.syncing.value"
  :has-error="collection.hasError.value"
  :not-found="collection.notFound.value"
  :error="collection.error.value"
  :may-retry="true"
  :loader-delay="300"
  :fade-content="true"
  spinner-scale="large"
&gt;
  &lt;ul&gt;
    &lt;li v-for="item in collection.items.value" :key="item.id"&gt;
      {{ item.name }}
    &lt;/li&gt;
  &lt;/ul&gt;
&lt;/UtensilResourceLoader&gt;</code></pre>

    <h3>Custom Error Slot</h3>
    <pre v-pre><code>&lt;UtensilResourceLoader
  :load="refresh"
  :loaded="loaded"
  :syncing="syncing"
  :has-error="hasError"
  :not-found="notFound"
  :error="error"
&gt;
  &lt;div&gt;Content here&lt;/div&gt;

  &lt;template #error&gt;
    &lt;div class="custom-error"&gt;
      &lt;p&gt;Failed to load. Please check your connection.&lt;/p&gt;
      &lt;button @click="refresh"&gt;Retry&lt;/button&gt;
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/UtensilResourceLoader&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
