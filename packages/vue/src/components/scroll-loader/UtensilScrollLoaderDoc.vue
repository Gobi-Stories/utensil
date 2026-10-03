<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilScrollLoader</h1>
    </div>
    <p>
      Infinite scroll container that automatically loads more content when the user scrolls near the edge. Includes
      built-in loading, error, and empty states. Supports both vertical and horizontal scrolling, and renders as a
      configurable container element.
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
          <td><code>items</code></td>
          <td><code>unknown[]</code></td>
          <td><code>[]</code></td>
          <td>
            The current array of loaded items. Used to detect when new items arrive and whether the list is empty.
          </td>
        </tr>
        <tr>
          <td><code>load</code></td>
          <td><code>() =&gt; Promise&lt;void&gt; | void</code></td>
          <td>—</td>
          <td>Required. Called when the scroll position nears the edge and more content should be fetched.</td>
        </tr>
        <tr>
          <td><code>done</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            When <code>true</code>, no further calls to <code>load</code> will be made and the <code>append</code> and
            <code>footer</code> slots become visible.
          </td>
        </tr>
        <tr>
          <td><code>hasError</code></td>
          <td><code>boolean</code></td>
          <td>—</td>
          <td>Required. When <code>true</code>, shows the error slot instead of the loading spinner.</td>
        </tr>
        <tr>
          <td><code>loading</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>External loading flag. When <code>true</code>, the loading slot is shown (unless there is an error).</td>
        </tr>
        <tr>
          <td><code>mayRetry</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Shows a retry button in the default error slot when <code>true</code>.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disables scroll detection. No new pages will be loaded while disabled.</td>
        </tr>
        <tr>
          <td><code>horizontal</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Switches to horizontal scroll detection instead of vertical.</td>
        </tr>
        <tr>
          <td><code>bufferLength</code></td>
          <td><code>number</code></td>
          <td><code>20</code></td>
          <td>Number of items from the scroll edge at which <code>load</code> is triggered.</td>
        </tr>
        <tr>
          <td><code>scrollContainer</code></td>
          <td><code>string | Component</code></td>
          <td><code>'div'</code></td>
          <td>The HTML tag or Vue component used as the root scrollable element.</td>
        </tr>
        <tr>
          <td><code>containerProps</code></td>
          <td><code>Record&lt;string, unknown&gt;</code></td>
          <td><code>{}</code></td>
          <td>Props or attributes forwarded to the scroll container element.</td>
        </tr>
        <tr>
          <td><code>scroller</code></td>
          <td><code>Element</code></td>
          <td>—</td>
          <td>External scroll element to observe. When omitted, the component's own root element is used.</td>
        </tr>
        <tr>
          <td><code>content</code></td>
          <td><code>Element</code></td>
          <td>—</td>
          <td>External content element for measuring scroll extent. When omitted, the root element is used.</td>
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
          <td><code>{ scrolled: boolean }</code></td>
          <td>
            Main content area for the loaded items. The <code>scrolled</code> flag indicates whether the user has
            scrolled from the initial position.
          </td>
        </tr>
        <tr>
          <td><code>prepend</code></td>
          <td>—</td>
          <td>Content rendered before the item list (always visible).</td>
        </tr>
        <tr>
          <td><code>empty</code></td>
          <td>—</td>
          <td>Shown when <code>items</code> is empty and <code>loading</code> is false.</td>
        </tr>
        <tr>
          <td><code>loading</code></td>
          <td>—</td>
          <td>Shown while loading and no error. Defaults to a centered <code>UtensilSpinner</code>.</td>
        </tr>
        <tr>
          <td><code>error</code></td>
          <td><code>{ retry: () =&gt; void }</code></td>
          <td>
            Shown when <code>hasError</code> is true. The <code>retry</code> function re-triggers the load. Defaults to
            an error message with an optional retry button.
          </td>
        </tr>
        <tr>
          <td><code>append</code></td>
          <td>—</td>
          <td>Content rendered after items when <code>done</code> is true.</td>
        </tr>
        <tr>
          <td><code>footer</code></td>
          <td>—</td>
          <td>Footer content rendered when <code>done</code> is true, after the append slot.</td>
        </tr>
      </tbody>
    </table>

    <!-- Examples -->
    <h2>Examples</h2>

    <h3>Basic Usage</h3>
    <pre v-pre><code>&lt;UtensilScrollLoader
  :items="users"
  :load="fetchNextPage"
  :done="allLoaded"
  :has-error="hasError"
  :loading="isLoading"
&gt;
  &lt;template #default&gt;
    &lt;div v-for="user in users" :key="user.id"&gt;
      {{ user.name }}
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/UtensilScrollLoader&gt;</code></pre>

    <h3>Horizontal Scrolling</h3>
    <pre v-pre><code>&lt;UtensilScrollLoader
  :items="products"
  :load="loadMore"
  :done="done"
  :has-error="error"
  :horizontal="true"
  scroll-container="div"
  :container-props="{ class: 'product-row' }"
&gt;
  &lt;template #default&gt;
    &lt;div v-for="p in products" :key="p.id" class="card"&gt;
      {{ p.name }}
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/UtensilScrollLoader&gt;</code></pre>

    <h3>Custom Error Handling</h3>
    <pre v-pre><code>&lt;UtensilScrollLoader
  :items="items"
  :load="loadItems"
  :done="done"
  :has-error="hasError"
  :may-retry="true"
&gt;
  &lt;template #default&gt;
    &lt;ItemCard v-for="item in items" :key="item.id" :item="item" /&gt;
  &lt;/template&gt;

  &lt;template #error="{ retry }"&gt;
    &lt;div class="custom-error"&gt;
      &lt;span&gt;Could not load more items.&lt;/span&gt;
      &lt;button @click="retry"&gt;Retry&lt;/button&gt;
    &lt;/div&gt;
  &lt;/template&gt;

  &lt;template #empty&gt;
    &lt;div&gt;No items found.&lt;/div&gt;
  &lt;/template&gt;
&lt;/UtensilScrollLoader&gt;</code></pre>

    <h3>Semantic Container</h3>
    <pre v-pre><code>&lt;UtensilScrollLoader
  scroll-container="section"
  :container-props="{ role: 'feed', 'aria-label': 'News articles' }"
  :items="articles"
  :load="fetchArticles"
  :done="noMore"
  :has-error="fetchError"
&gt;
  &lt;template #prepend&gt;
    &lt;header&gt;Latest News&lt;/header&gt;
  &lt;/template&gt;

  &lt;template #default&gt;
    &lt;article v-for="a in articles" :key="a.id"&gt;
      {{ a.title }}
    &lt;/article&gt;
  &lt;/template&gt;

  &lt;template #footer&gt;
    &lt;p&gt;You're all caught up.&lt;/p&gt;
  &lt;/template&gt;
&lt;/UtensilScrollLoader&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component — no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
