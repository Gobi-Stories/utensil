import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import UtensilDataViz from './UtensilDataViz.vue'
import { formatValue, type ChartType, type DataSeries } from './utensil-data-viz'

const singleSeries: DataSeries[] = [{ label: 'Revenue', values: [10, 20, 30] }]
const multiSeries: DataSeries[] = [
  { label: 'Revenue', values: [10, 20, 30] },
  { label: 'Expenses', values: [5, 15, 25] },
]
const donutSeries: DataSeries[] = [
  { label: 'A', values: [40] },
  { label: 'B', values: [60] },
]
const radarSeries: DataSeries[] = [
  { label: 'Speed', values: [80, 60, 90, 70, 85] },
  { label: 'Power', values: [60, 80, 70, 90, 75] },
]
const scatterSeries: DataSeries[] = [
  { label: 'Group A', values: [10, 20, 30], xValues: [5, 15, 25] },
  { label: 'Group B', values: [15, 25, 35], xValues: [10, 20, 30] },
]

describe('UtensilDataViz', () => {
  it('renders with default props', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: singleSeries } })
    const el = wrapper.find('.utensil-data-viz')
    expect(el.exists()).toBe(true)
    expect(el.attributes('role')).toBe('figure')
  })

  it('renders a title when provided', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: singleSeries, title: 'My Chart' } })
    expect(wrapper.find('.chart-title').text()).toBe('My Chart')
  })

  it('does not render a title when not provided', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: singleSeries } })
    expect(wrapper.find('.chart-title').exists()).toBe(false)
  })

  it('renders line chart by default', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: singleSeries } })
    expect(wrapper.find('.lines').exists()).toBe(true)
    expect(wrapper.find('.bars').exists()).toBe(false)
  })

  it('renders bar chart when type is bar', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: singleSeries, type: 'bar' } })
    expect(wrapper.find('.bars').exists()).toBe(true)
    expect(wrapper.find('.lines').exists()).toBe(false)
  })

  it('renders area chart with path and line', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: singleSeries, type: 'area' } })
    expect(wrapper.find('.areas').exists()).toBe(true)
    const paths = wrapper.findAll('.areas path')
    expect(paths.length).toBe(2) // area fill + line stroke
  })

  it('renders donut chart with segments', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: donutSeries, type: 'donut' } })
    expect(wrapper.find('.donut-svg').exists()).toBe(true)
    const segments = wrapper.findAll('.donut-segment')
    expect(segments.length).toBe(2)
  })

  it('renders legend by default', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: multiSeries } })
    const legendItems = wrapper.findAll('.legend-item')
    expect(legendItems.length).toBe(2)
    expect(legendItems[0].find('.legend-label').text()).toBe('Revenue')
    expect(legendItems[1].find('.legend-label').text()).toBe('Expenses')
  })

  it('hides legend when showLegend is false', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: singleSeries, showLegend: false } })
    expect(wrapper.find('.chart-legend').exists()).toBe(false)
  })

  it('shows grid lines by default', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: singleSeries } })
    expect(wrapper.find('.grid-lines').exists()).toBe(true)
  })

  it('hides grid lines when showGrid is false', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: singleSeries, showGrid: false } })
    expect(wrapper.find('.grid-lines').exists()).toBe(false)
  })

  it('renders x-axis labels when provided', () => {
    const wrapper = mount(UtensilDataViz, {
      props: { series: singleSeries, labels: ['Jan', 'Feb', 'Mar'] },
    })
    const labels = wrapper.findAll('.x-axis-labels text')
    expect(labels.length).toBe(3)
    expect(labels[0].text()).toBe('Jan')
  })

  it('renders value labels when showValues is true', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: singleSeries, showValues: true } })
    expect(wrapper.find('.value-labels').exists()).toBe(true)
    const labels = wrapper.findAll('.value-labels text')
    expect(labels.length).toBe(3)
  })

  it('provides screen reader description', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: singleSeries } })
    const srText = wrapper.find('.screen-reader').text()
    expect(srText).toContain('line chart')
    expect(srText).toContain('Revenue')
  })

  it('accepts custom aria-label', () => {
    const wrapper = mount(UtensilDataViz, {
      props: { series: singleSeries, ariaLabel: 'Sales data' },
    })
    expect(wrapper.find('.utensil-data-viz').attributes('aria-label')).toBe('Sales data')
  })

  it('renders donut center total', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: donutSeries, type: 'donut' } })
    expect(wrapper.find('.donut-center-text').text()).toBe('100')
  })

  it('renders multiple bar series side by side', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: multiSeries, type: 'bar' } })
    const rects = wrapper.findAll('.bars rect')
    expect(rects.length).toBe(6) // 2 series x 3 values
  })

  it('renders radar chart with polygons and spokes', () => {
    const wrapper = mount(UtensilDataViz, {
      props: { series: radarSeries, type: 'radar', labels: ['A', 'B', 'C', 'D', 'E'] },
    })
    expect(wrapper.find('.radar-svg').exists()).toBe(true)
    const polygons = wrapper.findAll('.radar-svg polygon:not(.radar-ring)')
    expect(polygons.length).toBe(2) // 2 series polygons
    const labels = wrapper.findAll('.radar-label')
    expect(labels.length).toBe(5)
  })

  it('renders scatter chart with points', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: scatterSeries, type: 'scatter' } })
    expect(wrapper.find('.scatter-points').exists()).toBe(true)
    const circles = wrapper.findAll('.scatter-points circle')
    expect(circles.length).toBe(6) // 2 series x 3 points
  })

  it('renders stacked bar chart', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: multiSeries, type: 'stacked-bar' } })
    expect(wrapper.find('.stacked-bars').exists()).toBe(true)
    const rects = wrapper.findAll('.stacked-bars rect')
    expect(rects.length).toBe(6) // 2 series x 3 values stacked
  })

  it('renders horizontal bar chart', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: multiSeries, type: 'horizontal-bar' } })
    expect(wrapper.find('.horizontal-bars').exists()).toBe(true)
    const rects = wrapper.findAll('.horizontal-bars rect')
    expect(rects.length).toBe(6) // 2 series x 3 values
  })

  it('screen reader description includes chart type', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: radarSeries, type: 'radar' } })
    expect(wrapper.find('.screen-reader').text()).toContain('radar chart')
  })

  it('renders dashed stroke for a dashed series', () => {
    const wrapper = mount(UtensilDataViz, {
      props: { series: [{ label: 'Compare', values: [1, 2, 3], lineStyle: 'dashed' as const }] },
    })
    const path = wrapper.find('.lines path')
    expect(path.attributes('stroke-dasharray')).toBe('6 5')
  })

  it('uses a custom series color for line and legend', () => {
    const wrapper = mount(UtensilDataViz, {
      props: { series: [{ label: 'Custom', values: [1, 2, 3], color: 'var(--pencil-9)' }] },
    })
    expect(wrapper.find('.lines path').attributes('stroke')).toBe('var(--pencil-9)')
    expect(wrapper.find('.legend-swatch').attributes('style')).toContain('var(--pencil-9)')
  })

  it('renders reference lines with labels', () => {
    const wrapper = mount(UtensilDataViz, {
      props: { series: singleSeries, referenceLines: [{ value: 25, label: 'Benchmark' }] },
    })
    expect(wrapper.find('.reference-lines line').exists()).toBe(true)
    expect(wrapper.find('.reference-label').text()).toBe('Benchmark')
  })

  it('renders no interactivity markup by default', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: singleSeries } })
    expect(wrapper.find('.hover-columns').exists()).toBe(false)
    expect(wrapper.find('.chart-tooltip').exists()).toBe(false)
  })

  it('emits hover and shows the tooltip when a column is entered', async () => {
    const wrapper = mount(UtensilDataViz, {
      props: { series: singleSeries, interactive: true, labels: ['Jan', 'Feb', 'Mar'] },
    })

    const columns = wrapper.findAll('.hover-columns rect')
    expect(columns.length).toBe(3)

    await columns[1].trigger('pointerenter')

    expect(wrapper.emitted('hover')?.[0]).toEqual([1])
    const tooltip = wrapper.find('.chart-tooltip')
    expect(tooltip.exists()).toBe(true)
    expect(tooltip.text()).toContain('Feb')
    expect(tooltip.text()).toContain('Revenue: 20')
    expect(wrapper.find('.hover-markers .crosshair').exists()).toBe(true)
  })

  it('clears the hover state when the pointer leaves the chart', async () => {
    const wrapper = mount(UtensilDataViz, { props: { series: singleSeries, interactive: true } })

    await wrapper.findAll('.hover-columns rect')[0].trigger('pointerenter')
    await wrapper.find('.chart-svg').trigger('pointerleave')

    expect(wrapper.emitted('hover')?.[1]).toEqual([null])
    expect(wrapper.find('.chart-tooltip').exists()).toBe(false)
  })

  it('steps through the points from the keyboard, and clears them when focus leaves', async () => {
    const wrapper = mount(UtensilDataViz, {
      props: { series: singleSeries, interactive: true, labels: ['Jan', 'Feb', 'Mar'] },
    })
    const svg = wrapper.find('.chart-svg')
    expect(svg.attributes('tabindex')).toBe('0')

    await svg.trigger('keydown', { key: 'ArrowRight' })
    await svg.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.find('.chart-tooltip').text()).toContain('Feb')
    expect(wrapper.find('[aria-live]').text()).toBe('Feb, Revenue: 20')

    await svg.trigger('keydown', { key: 'End' })
    await svg.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.find('.chart-tooltip').text()).toContain('Mar')

    await svg.trigger('keydown', { key: 'Home' })
    expect(wrapper.find('.chart-tooltip').text()).toContain('Jan')

    await svg.trigger('blur')
    expect(wrapper.find('.chart-tooltip').exists()).toBe(false)
  })

  it('takes no focus unless interactive', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: singleSeries } })
    expect(wrapper.find('.chart-svg').attributes('tabindex')).toBeUndefined()
  })

  it('leaves a series out of the tooltip where it has no value', async () => {
    const wrapper = mount(UtensilDataViz, {
      props: {
        series: [
          { label: 'Revenue', values: [10, 20, 30] },
          { label: 'Forecast', values: [12] },
        ],
        interactive: true,
      },
    })

    await wrapper.findAll('.hover-columns rect')[2].trigger('pointerenter')

    expect(wrapper.find('.chart-tooltip').text()).toContain('Revenue: 30')
    expect(wrapper.find('.chart-tooltip').text()).not.toContain('Forecast')
  })

  it('renders a custom tooltip slot with the hovered index', async () => {
    const wrapper = mount(UtensilDataViz, {
      props: { series: singleSeries, type: 'area', interactive: true },
      slots: { tooltip: `<template #tooltip="{ index }">Point {{ index }}</template>` },
    })

    await wrapper.findAll('.hover-columns rect')[2].trigger('pointerenter')

    expect(wrapper.find('.chart-tooltip').text()).toBe('Point 2')
  })

  it('omits the area fill for dashed comparison series', () => {
    const wrapper = mount(UtensilDataViz, {
      props: {
        series: [
          { label: 'Current', values: [1, 2, 3] },
          { label: 'Compare', values: [1, 2, 3], lineStyle: 'dashed' as const },
        ],
        type: 'area',
      },
    })

    // 1 fill (solid series only) + 2 stroke lines
    expect(wrapper.findAll('.areas path').length).toBe(3)
  })

  it('measures a solid line against the dash that draws it in, however long the line', () => {
    const wrapper = mount(UtensilDataViz, {
      props: { series: [{ label: 'Satisfied', values: [0, 100, 0, 100, 0, 100, 0, 100] }] },
    })

    expect(wrapper.find('.lines path').attributes('pathLength')).toBe('1000')
  })

  it("leaves a dashed series' pattern in its own units", () => {
    const wrapper = mount(UtensilDataViz, {
      props: { series: [{ label: 'Previous', values: [1, 2, 3], lineStyle: 'dashed' }] },
    })

    expect(wrapper.find('.lines path').attributes('pathLength')).toBeUndefined()
  })

  describe('baseline', () => {
    const yLabels = (wrapper: ReturnType<typeof mount>) =>
      wrapper.findAll('.y-axis-labels text').map((label) => label.text())

    it('draws no baseline and starts the axis at zero while nothing falls below it', () => {
      const wrapper = mount(UtensilDataViz, { props: { series: singleSeries } })

      expect(wrapper.find('.baseline').exists()).toBe(false)
      expect(yLabels(wrapper)).toEqual(['50', '37.5', '25', '12.5', '0'])
    })

    it('extends the axis below zero in steps that keep zero on a gridline, dashed along it', () => {
      const wrapper = mount(UtensilDataViz, {
        props: { series: [{ label: 'NPS', values: [24, -32, 18] }] },
      })

      const labels = yLabels(wrapper)
      expect(labels).toEqual(['40', '20', '0', '-20', '-40'])
      const zero = wrapper.findAll('.y-axis-labels text')[labels.indexOf('0')]
      const baseline = wrapper.find('.baseline')
      expect(baseline.exists()).toBe(true)
      expect(Number(baseline.attributes('y1')) + 4).toBe(Number(zero.attributes('y')))
    })

    it('draws a baseline other than zero, which the axis always includes', () => {
      const wrapper = mount(UtensilDataViz, { props: { series: singleSeries, baseline: 80 } })

      expect(wrapper.find('.baseline').exists()).toBe(true)
      expect(yLabels(wrapper)[0]).toBe('100')
    })

    it('fills an area to the baseline', () => {
      const wrapper = mount(UtensilDataViz, {
        props: { series: [{ label: 'NPS', values: [20, -10] }], type: 'area' },
      })

      const foot = wrapper.find('.baseline').attributes('y1')
      expect(wrapper.find('.areas path').attributes('d')).toMatch(new RegExp(` ${foot} L [\\d.]+ ${foot} Z$`))
    })
  })

  describe('fitting its box', () => {
    afterEach(() => {
      vi.unstubAllGlobals()
    })

    // Mounts a chart and reports its box as the size given
    async function fitted(type: ChartType, width: number, height: number, interactive = false) {
      let resize: ResizeObserverCallback = () => {}
      vi.stubGlobal(
        'ResizeObserver',
        class {
          constructor(callback: ResizeObserverCallback) {
            resize = callback
          }
          observe() {}
          disconnect() {}
        },
      )
      const wrapper = mount(UtensilDataViz, {
        props: { type, interactive, series: singleSeries, labels: ['a', 'b', 'c'] },
      })
      await nextTick()
      resize([{ contentRect: { width, height } } as ResizeObserverEntry], {} as ResizeObserver)
      await nextTick()
      return wrapper
    }

    it.each(['line', 'area', 'bar', 'stacked-bar', 'horizontal-bar'] as const)(
      'widens a %s chart to fill a wide box at its natural height',
      async (type) => {
        expect((await fitted(type, 880, 440)).find('svg').attributes('viewBox')).toBe('0 0 440 220')
      },
    )

    it('draws a narrow box at its natural size, down to a width it scales below', async () => {
      expect((await fitted('bar', 300, 220)).find('svg').attributes('viewBox')).toBe('0 0 300 220')
      expect((await fitted('bar', 200, 220)).find('svg').attributes('viewBox')).toBe('0 0 240 220')
    })

    it('spreads its bars over the width it fills', async () => {
      const bars = (await fitted('bar', 1200, 220)).findAll('.bars rect')
      expect(Number(bars[bars.length - 1].attributes('x'))).toBeGreaterThan(800)
    })

    it('places the tooltip on the drawing where a narrow box letterboxes it', async () => {
      // 120 × 220 draws the 240-wide drawing at half size, 55px down a box it fills only the middle half of
      const wrapper = await fitted('line', 120, 220, true)

      await wrapper.findAll('.hover-columns rect')[0].trigger('pointerenter')

      const style = wrapper.find('.chart-tooltip').attributes('style')
      expect(style).toContain(`left: ${((44 * 0.5) / 120) * 100}%`)
      expect(style).toContain(`top: ${((55 + 16 * 0.5) / 220) * 100}%`)
    })
  })

  describe('baseline on bar charts', () => {
    const negative: DataSeries[] = [{ label: 'Change', values: [30, -20, 10] }]

    it('draws bars from the baseline, below it for lower values', () => {
      const wrapper = mount(UtensilDataViz, { props: { type: 'bar', series: negative } })

      const [rising, falling] = wrapper.findAll('.bars rect')
      const foot = Number(wrapper.find('.baseline').attributes('y1'))
      expect(Number(rising.attributes('y')) + Number(rising.attributes('height'))).toBeCloseTo(foot)
      expect(Number(falling.attributes('y'))).toBeCloseTo(foot)
      expect(falling.classes()).toContain('below')
    })

    it('measures bars from a baseline other than zero', () => {
      const wrapper = mount(UtensilDataViz, {
        props: { type: 'bar', series: [{ label: 'Score', values: [80, 40] }], baseline: 50 },
      })

      const [above, below] = wrapper.findAll('.bars rect')
      expect(above.classes()).not.toContain('below')
      expect(below.classes()).toContain('below')
      expect(Number(below.attributes('y'))).toBeCloseTo(Number(wrapper.find('.baseline').attributes('y1')))
    })

    it('stacks negative values down from zero on a stacked bar chart, its axis below zero', () => {
      const wrapper = mount(UtensilDataViz, {
        props: {
          type: 'stacked-bar',
          series: [
            { label: 'In', values: [20, 10] },
            { label: 'Out', values: [-15, -5] },
          ],
        },
      })

      const labels = wrapper.findAll('.y-axis-labels text').map((label) => label.text())
      expect(labels[labels.length - 1].startsWith('-')).toBe(true)
      const [inRect, outRect] = wrapper.findAll('.stacked-bars g')[0].findAll('rect')
      expect(Number(inRect.attributes('y')) + Number(inRect.attributes('height'))).toBeCloseTo(
        Number(outRect.attributes('y')),
      )
    })

    it('gives each stacked bar chart its own clip paths', () => {
      const chart = () => h(UtensilDataViz, { type: 'stacked-bar', series: multiSeries })
      const wrapper = mount(() => h('div', [chart(), chart()]))

      const [first, second] = wrapper.findAll('.stacked-bars')
      const firstId = wrapper.findAll('clipPath')[0].attributes('id')
      expect(first.find('g').attributes('clip-path')).toBe(`url(#${firstId})`)
      expect(second.find('g').attributes('clip-path')).not.toBe(`url(#${firstId})`)
    })

    it('runs horizontal bars from the baseline, leftward for lower values', () => {
      const wrapper = mount(UtensilDataViz, { props: { type: 'horizontal-bar', series: negative } })

      const [rising, falling] = wrapper.findAll('.horizontal-bars rect')
      const foot = Number(wrapper.find('.baseline').attributes('x1'))
      expect(Number(rising.attributes('x'))).toBeCloseTo(foot)
      expect(Number(falling.attributes('x')) + Number(falling.attributes('width'))).toBeCloseTo(foot)
      expect(falling.classes()).toContain('below')
    })
  })

  it('measures donut segments in hundredths of the ring, which their draw-in covers', () => {
    const wrapper = mount(UtensilDataViz, { props: { series: donutSeries, type: 'donut' } })

    const segments = wrapper.findAll('.donut-segment')
    expect(segments[0].attributes('pathLength')).toBe('100')
    const [dash, space] = (segments[0].attributes('stroke-dasharray') ?? '').split(' ').map(Number)
    expect(dash + space).toBeCloseTo(100)
    expect(dash).toBeLessThan(40)
  })

  it('formats negative thousands and millions', () => {
    expect(formatValue(-1500)).toBe('-1.5K')
    expect(formatValue(-2500000)).toBe('-2.5M')
  })
})
