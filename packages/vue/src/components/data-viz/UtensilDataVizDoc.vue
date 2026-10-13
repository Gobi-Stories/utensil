<template>
  <article class="text-code utensil-api-doc">
    <div class="doc-header">
      <h1>UtensilDataViz</h1>
    </div>
    <p>
      An SVG chart component supporting 8 chart types with animated transitions, built-in legends, and screen reader
      descriptions. Delegates rendering to specialized sub-components per chart type.
    </p>
    <p>
      Line, area and bar charts (stacked and horizontal too) fill the box they're given and draw at their natural size,
      so text and strokes look the same in any layout: the plot widens or narrows with the box rather than scaling. In a
      box without a height they're 220px tall. Below 240px wide the drawing scales down instead, so its axes don't
      crowd.
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
          <td><code>type</code></td>
          <td>
            <code>'line' | 'bar' | 'area' | 'donut' | 'radar' | 'scatter' | 'stacked-bar' | 'horizontal-bar'</code>
          </td>
          <td><code>'line'</code></td>
          <td>Chart type to render.</td>
        </tr>
        <tr>
          <td><code>series</code></td>
          <td><code>DataSeries[]</code></td>
          <td>—</td>
          <td>
            Data series to display. Each series has a <code>label</code>, <code>values</code> array, and optional
            <code>xValues</code> array (used by scatter charts).
          </td>
        </tr>
        <tr>
          <td><code>labels</code></td>
          <td><code>string[]</code></td>
          <td>—</td>
          <td>Axis labels. Used by all chart types except donut.</td>
        </tr>
        <tr>
          <td><code>title</code></td>
          <td><code>string</code></td>
          <td>—</td>
          <td>Chart title displayed above the visualization.</td>
        </tr>
        <tr>
          <td><code>showLegend</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Show a color-coded legend below the chart.</td>
        </tr>
        <tr>
          <td><code>showGrid</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Show grid lines. Applies to line, bar, area, scatter, stacked-bar, and horizontal-bar types.</td>
        </tr>
        <tr>
          <td><code>showValues</code></td>
          <td><code>boolean</code></td>
          <td>—</td>
          <td>
            Display numeric values on data points. Applies to line, bar, area, stacked-bar, and horizontal-bar types.
          </td>
        </tr>
        <tr>
          <td><code>animate</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Enable entry animations for chart elements.</td>
        </tr>
        <tr>
          <td><code>ariaLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Data visualization'</code></td>
          <td>Accessible label for the chart's <code>figure</code> role container.</td>
        </tr>
        <tr>
          <td><code>interactive</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>
            Enables pointer interactivity on line and area charts: a crosshair, point highlights, and a per-point
            tooltip. The chart takes focus, the left and right arrow keys (and Home and End) step through its points,
            and each point's values are announced.
          </td>
        </tr>
        <tr>
          <td><code>referenceLines</code></td>
          <td><code>ReferenceLine[]</code></td>
          <td>—</td>
          <td>
            Dashed horizontal reference lines on line and area charts, e.g. a benchmark or target. Each line has a
            <code>value</code>, optional <code>label</code>, and optional CSS <code>color</code>. Reference values are
            included when scaling the y-axis.
          </td>
        </tr>
        <tr>
          <td><code>baseline</code></td>
          <td><code>number</code></td>
          <td><code>0</code></td>
          <td>
            The value line, area and bar charts measure from, e.g. a score that can be negative, or a target other than
            zero. Their value axis always includes it, and values below it extend the axis down; bars run from it (down,
            or leftward, for lower values) and an area fills to it. A dashed line marks it whenever the axis goes below
            it. Stacked bars stack from zero, negative values downward, and their axis includes the baseline.
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
          <td><code>hover</code></td>
          <td><code>number | null</code></td>
          <td>
            The hovered point index on interactive line and area charts, or <code>null</code> when the pointer or focus
            leaves the chart.
          </td>
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
          <td><code>tooltip</code></td>
          <td><code>{ index: number }</code></td>
          <td>
            Custom tooltip content for the hovered point on interactive line and area charts. Defaults to the point's
            label and each series value.
          </td>
        </tr>
      </tbody>
    </table>

    <h2>DataSeries Interface</h2>
    <table>
      <thead>
        <tr>
          <th>Property</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td>Display name shown in the legend.</td>
        </tr>
        <tr>
          <td><code>values</code></td>
          <td><code>number[]</code></td>
          <td>Data values. For scatter charts with <code>xValues</code>, these become y-coordinates.</td>
        </tr>
        <tr>
          <td><code>xValues</code></td>
          <td><code>number[]</code></td>
          <td>Optional x-axis values for scatter charts.</td>
        </tr>
        <tr>
          <td><code>lineStyle</code></td>
          <td><code>'solid' | 'dashed'</code></td>
          <td>Stroke style on line and area charts. Dashed series read as comparison overlays and get no area fill.</td>
        </tr>
        <tr>
          <td><code>color</code></td>
          <td><code>string</code></td>
          <td>CSS color overriding the default series color, e.g. <code>'var(--pencil-9)'</code>.</td>
        </tr>
      </tbody>
    </table>

    <h2>Chart Types</h2>
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Supports Grid</th>
          <th>Supports Values</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>line</code></td>
          <td>Yes</td>
          <td>Yes</td>
          <td>Connected data points with line paths.</td>
        </tr>
        <tr>
          <td><code>bar</code></td>
          <td>Yes</td>
          <td>Yes</td>
          <td>Vertical bar chart with grouped series.</td>
        </tr>
        <tr>
          <td><code>area</code></td>
          <td>Yes</td>
          <td>Yes</td>
          <td>Line chart with filled area beneath.</td>
        </tr>
        <tr>
          <td><code>donut</code></td>
          <td>No</td>
          <td>No</td>
          <td>
            Circular proportional chart. Ignores <code>labels</code>, <code>showGrid</code>, and
            <code>showValues</code>.
          </td>
        </tr>
        <tr>
          <td><code>radar</code></td>
          <td>No</td>
          <td>No</td>
          <td>Multi-axis polygon chart for comparing series across categories.</td>
        </tr>
        <tr>
          <td><code>scatter</code></td>
          <td>Yes</td>
          <td>No</td>
          <td>X/Y scatter plot. Use <code>xValues</code> in series data for positioning.</td>
        </tr>
        <tr>
          <td><code>stacked-bar</code></td>
          <td>Yes</td>
          <td>Yes</td>
          <td>Vertical bars with series stacked on top of each other.</td>
        </tr>
        <tr>
          <td><code>horizontal-bar</code></td>
          <td>Yes</td>
          <td>Yes</td>
          <td>Horizontal bar chart with grouped series.</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic Line Chart</h3>
    <pre><code>&lt;UtensilDataViz
  type="line"
  :series="[{ label: 'Revenue', values: [12, 19, 14, 25, 22, 30] }]"
  :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']"
  title="Monthly Revenue"
/&gt;</code></pre>

    <h3>Donut Chart</h3>
    <pre><code>&lt;UtensilDataViz
  type="donut"
  :series="[
    { label: 'Direct', values: [42] },
    { label: 'Organic', values: [28] },
    { label: 'Referral', values: [18] },
  ]"
  title="Traffic Sources"
/&gt;</code></pre>

    <h3>Scatter Chart with X Values</h3>
    <pre><code>&lt;UtensilDataViz
  type="scatter"
  :series="[{
    label: 'Group A',
    values: [15, 28, 42, 35],
    xValues: [10, 25, 35, 40],
  }]"
  title="Correlation"
/&gt;</code></pre>

    <h3>Interactive Chart with Comparison and Benchmark</h3>
    <pre v-pre><code>&lt;UtensilDataViz
  type="area"
  interactive
  :series="[
    { label: 'This quarter', values: [820, 940, 1010, 1150] },
    { label: 'Last quarter', values: [610, 650, 700, 760], lineStyle: 'dashed', color: 'var(--pencil-9)' },
  ]"
  :labels="['W1', 'W2', 'W3', 'W4']"
  :reference-lines="[{ value: 1050, label: 'Benchmark' }]"
  @hover="onHover"
&gt;
  &lt;template #tooltip="{ index }"&gt;Week {{ index + 1 }}&lt;/template&gt;
&lt;/UtensilDataViz&gt;</code></pre>

    <h3>Values Below a Baseline</h3>
    <p>
      The y-axis extends below the baseline for the values under it, and a dashed line marks the baseline. It's zero
      unless given.
    </p>
    <pre><code>&lt;UtensilDataViz
  type="line"
  :series="[{ label: 'NPS', values: [24, 8, -15, -32, 5, 18] }]"
  :labels="['W1', 'W2', 'W3', 'W4', 'W5', 'W6']"
/&gt;</code></pre>

    <h3>Bars Around a Baseline</h3>
    <pre><code>&lt;UtensilDataViz
  type="bar"
  :series="[{ label: 'Change', values: [12, -8, 5, -14] }]"
  :labels="['Q1', 'Q2', 'Q3', 'Q4']"
/&gt;</code></pre>

    <h3>Minimal Configuration</h3>
    <pre><code>&lt;UtensilDataViz
  type="bar"
  :series="data"
  :labels="labels"
  :show-grid="false"
  :show-legend="false"
  :animate="false"
  show-values
/&gt;</code></pre>
  </article>
</template>

<script setup lang="ts">
// Pure documentation component - no logic needed.
</script>

<style src="../../utensil-docs.css"></style>
