import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilAudioEqualizer from './UtensilAudioEqualizer.vue'

describe('UtensilAudioEqualizer', () => {
  it('renders with default bands', () => {
    const wrapper = mount(UtensilAudioEqualizer, {
      props: { modelValue: [0, 0, 0, 0, 0] },
    })
    const el = wrapper.find('.utensil-audio-equalizer')
    expect(el.exists()).toBe(true)
    expect(el.attributes('role')).toBe('group')
  })

  it('renders the correct number of bands', () => {
    const wrapper = mount(UtensilAudioEqualizer, {
      props: { modelValue: [0, 0, 0, 0, 0] },
    })
    const bands = wrapper.findAll('.equalizer-band')
    expect(bands).toHaveLength(5)
  })

  it('renders custom bands', () => {
    const wrapper = mount(UtensilAudioEqualizer, {
      props: {
        modelValue: [50, 75, 60],
        bands: [{ label: 'Vol' }, { label: 'Bass' }, { label: 'Treble' }],
      },
    })
    const bands = wrapper.findAll('.equalizer-band')
    expect(bands).toHaveLength(3)
    expect(bands[0].find('.band-label').text()).toBe('Vol')
    expect(bands[1].find('.band-label').text()).toBe('Bass')
    expect(bands[2].find('.band-label').text()).toBe('Treble')
  })

  it('displays formatted values with sign', () => {
    const wrapper = mount(UtensilAudioEqualizer, {
      props: { modelValue: [5, -3, 0] },
    })
    const values = wrapper.findAll('.band-value')
    expect(values[0].text()).toBe('+5')
    expect(values[1].text()).toBe('-3')
    expect(values[2].text()).toBe('0')
  })

  it('uses custom formatValue function', () => {
    const wrapper = mount(UtensilAudioEqualizer, {
      props: {
        modelValue: [50, 75],
        bands: [{ label: 'A' }, { label: 'B' }],
        min: 0,
        max: 100,
        formatValue: (v: number) => `${v}%`,
      },
    })
    const values = wrapper.findAll('.band-value')
    expect(values[0].text()).toBe('50%')
    expect(values[1].text()).toBe('75%')
  })

  it('emits update:modelValue when a slider changes', async () => {
    const wrapper = mount(UtensilAudioEqualizer, {
      props: { modelValue: [0, 0, 0, 0, 0] },
    })
    const sliders = wrapper.findAll('.vertical-slider')
    await sliders[0].setValue('6')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emitted = wrapper.emitted('update:modelValue')![0][0] as number[]
    expect(emitted[0]).toBe(6)
    expect(emitted[1]).toBe(0)
  })

  it('applies disabled class when disabled', () => {
    const wrapper = mount(UtensilAudioEqualizer, {
      props: { modelValue: [0, 0, 0, 0, 0], disabled: true },
    })
    expect(wrapper.find('.utensil-audio-equalizer').classes()).toContain('disabled')
  })

  it('sets aria-label on the group', () => {
    const wrapper = mount(UtensilAudioEqualizer, {
      props: { modelValue: [0, 0, 0, 0, 0], ariaLabel: 'Custom equalizer' },
    })
    expect(wrapper.find('.utensil-audio-equalizer').attributes('aria-label')).toBe('Custom equalizer')
  })

  it('fills missing model values with zero', () => {
    const wrapper = mount(UtensilAudioEqualizer, {
      props: { modelValue: [5] },
    })
    const values = wrapper.findAll('.band-value')
    expect(values[0].text()).toBe('+5')
    expect(values[1].text()).toBe('0')
  })
})
