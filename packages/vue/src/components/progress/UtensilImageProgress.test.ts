import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilImageProgress from './UtensilImageProgress.vue'

describe('UtensilImageProgress', () => {
  function mountProgress(props: Record<string, unknown> = {}) {
    return mount(UtensilImageProgress, { props: { src: 'waveform.png', ...props } })
  }

  it('renders the image on both layers', () => {
    const wrapper = mountProgress()

    const layers = wrapper.findAll('.layer')
    expect(layers).toHaveLength(2)
    layers.forEach((layer) => {
      expect(layer.attributes('style')).toContain('background-image:')
      expect(layer.attributes('style')).toContain('waveform.png')
    })
  })

  it('clips the filtered layer to the incomplete portion', () => {
    const wrapper = mountProgress({ value: 40 })

    const remaining = wrapper.find('.remaining')
    expect(remaining.attributes('style')).toContain('clip-path: inset(0 0 0 40%)')
    expect(remaining.attributes('style')).toContain('filter: saturate(0.1) brightness(1.15)')
  })

  it('applies a custom remaining filter', () => {
    const wrapper = mountProgress({ remainingFilter: 'grayscale(1)' })

    expect(wrapper.find('.remaining').attributes('style')).toContain('filter: grayscale(1)')
  })

  it('leaves the full-color layer unfiltered', () => {
    const wrapper = mountProgress({ value: 40 })

    expect(wrapper.findAll('.layer')[0].attributes('style')).not.toContain('filter')
  })

  it('clamps the value into range', () => {
    const over = mountProgress({ value: 150 })
    expect(over.attributes('aria-valuenow')).toBe('100')
    expect(over.find('.remaining').attributes('style')).toContain('inset(0 0 0 100%)')

    const under = mountProgress({ value: -20 })
    expect(under.attributes('aria-valuenow')).toBe('0')
    expect(under.find('.remaining').attributes('style')).toContain('inset(0 0 0 0%)')
  })

  it('exposes progressbar semantics', () => {
    const wrapper = mountProgress({ value: 25, ariaLabel: 'Track playback' })

    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.attributes('aria-valuenow')).toBe('25')
    expect(wrapper.attributes('aria-valuemin')).toBe('0')
    expect(wrapper.attributes('aria-valuemax')).toBe('100')
    expect(wrapper.attributes('aria-label')).toBe('Track playback')
  })
})
