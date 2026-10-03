import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilDataViz from './UtensilDataViz.vue'
import type { DataSeries } from './utensil-data-viz'

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
})
