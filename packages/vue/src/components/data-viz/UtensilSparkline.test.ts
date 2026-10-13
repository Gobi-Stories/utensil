import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import UtensilTheme from '../../theme/UtensilTheme.vue'
import type { ThemeConfig, UtensilColors } from '../../theme/utensil-theme'
import UtensilSparkline from './UtensilSparkline.vue'

// Utensil's default theme maps every variant to gray; a theme with an orange warning tells the pens apart
interface TestThemeConfig extends ThemeConfig {
  color: UtensilColors & { orange: true }
}

const TestTheme = UtensilTheme<TestThemeConfig>

// The y of each point on the line
function pointYs(wrapper: ReturnType<typeof mount>): number[] {
  const d = wrapper.find('.utensil-sparkline-line').attributes('d') ?? ''
  return [...d.matchAll(/[ML] [\d.]+ ([\d.]+)/g)].map((match) => Number(match[1]))
}

describe('UtensilSparkline', () => {
  it('draws a line through the values', () => {
    const wrapper = mount(UtensilSparkline, { props: { values: [1, 5, 3] } })

    expect(wrapper.find('.utensil-sparkline-line').attributes('d')).toMatch(/^M /)
    expect(pointYs(wrapper)).toHaveLength(3)
  })

  it('draws nothing without values', () => {
    const wrapper = mount(UtensilSparkline, { props: { values: [] } })
    expect(wrapper.find('.utensil-sparkline-line').attributes('d')).toBe('')
  })

  it('fills under the line only when asked', () => {
    expect(
      mount(UtensilSparkline, { props: { values: [1, 2, 3] } })
        .find('.utensil-sparkline-fill')
        .exists(),
    ).toBe(false)

    const fill = mount(UtensilSparkline, { props: { values: [1, 2, 3], fill: true } }).find('.utensil-sparkline-fill')
    expect(fill.attributes('d')).toMatch(/Z$/)
  })

  it('keeps an eighth of its height clear above the highest point and below the lowest', () => {
    const wrapper = mount(UtensilSparkline, { props: { values: [0, 10], height: 40 } })
    expect(pointYs(wrapper)).toEqual([35, 5])
  })

  it('runs a flat series through the middle', () => {
    const wrapper = mount(UtensilSparkline, { props: { values: [5, 5, 5], height: 36 } })
    expect(pointYs(wrapper)).toEqual([18, 18, 18])
  })

  it('takes a theme color as its pen', () => {
    const wrapper = mount(() =>
      h(TestTheme, { variants: { warning: 'orange' } }, () => [
        h(UtensilSparkline, { values: [1, 2] }),
        h(UtensilSparkline, { values: [1, 2], color: 'warning' }),
      ]),
    )

    const [plain, warning] = wrapper.findAll('.utensil-sparkline')
    expect(warning.classes().filter((name) => !plain.classes().includes(name))).not.toHaveLength(0)
  })

  it('is an image with an accessible label', () => {
    const wrapper = mount(UtensilSparkline, { props: { values: [1, 2], ariaLabel: 'Views trend' } })
    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe('Views trend')
  })
})
