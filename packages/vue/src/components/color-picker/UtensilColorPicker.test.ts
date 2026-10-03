import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilColorPicker from './UtensilColorPicker.vue'

const colors = [{ value: '#2664eb', name: 'Primary' }, { value: '#10b981', name: 'Secondary' }, { value: '#ffffffa1' }]

describe('UtensilColorPicker', () => {
  it('renders the native swatch and hex input by default', () => {
    const wrapper = mount(UtensilColorPicker, {
      props: { modelValue: '#2664eb' },
    })
    expect(wrapper.find('input[type="color"]').exists()).toBe(true)
    expect(wrapper.find('.color-hex-input').exists()).toBe(true)
    expect(wrapper.find('.color-grid').exists()).toBe(false)
  })

  it('hides the hex input when showInput is false', () => {
    const wrapper = mount(UtensilColorPicker, {
      props: { modelValue: '#2664eb', showInput: false },
    })
    expect(wrapper.find('.color-hex-input').exists()).toBe(false)
  })

  it('emits the picked swatch color', async () => {
    const wrapper = mount(UtensilColorPicker, {
      props: { modelValue: '#2664eb' },
    })
    await wrapper.find('input[type="color"]').setValue('#123456')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#123456'])
  })

  it('carries an alpha pair across a native pick', async () => {
    const wrapper = mount(UtensilColorPicker, {
      props: { modelValue: '#ffffffa1' },
    })
    await wrapper.find('input[type="color"]').setValue('#000000')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#000000a1'])
  })

  it('renders a swatch grid instead of the hex input when colors are provided', () => {
    const wrapper = mount(UtensilColorPicker, {
      props: { modelValue: '#2664eb', colors },
    })
    expect(wrapper.find('.color-grid').exists()).toBe(true)
    expect(wrapper.findAll('.preset-swatch')).toHaveLength(3)
    expect(wrapper.find('.color-hex-input').exists()).toBe(false)
  })

  it('renders the browser picker last in the grid', () => {
    const wrapper = mount(UtensilColorPicker, {
      props: { modelValue: '#2664eb', colors },
    })
    const swatches = wrapper.findAll('.color-grid > *')
    expect(swatches[swatches.length - 1].classes()).toContain('custom-picker')
    expect(wrapper.find('.custom-picker input[type="color"]').exists()).toBe(true)
  })

  it('emits the preset value when a swatch is clicked', async () => {
    const wrapper = mount(UtensilColorPicker, {
      props: { modelValue: '#2664eb', colors },
    })
    await wrapper.findAll('.preset-swatch')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#ffffffa1'])
  })

  it('marks the matching preset selected, case-insensitively', () => {
    const wrapper = mount(UtensilColorPicker, {
      props: { modelValue: '#2664EB', colors },
    })
    const swatches = wrapper.findAll('.preset-swatch')
    expect(swatches[0].classes()).toContain('selected')
    expect(swatches[0].attributes('aria-pressed')).toBe('true')
    expect(swatches[1].classes()).not.toContain('selected')
  })

  it('labels swatches by name, falling back to the value', () => {
    const wrapper = mount(UtensilColorPicker, {
      props: { modelValue: '#2664eb', colors },
    })
    const swatches = wrapper.findAll('.preset-swatch')
    expect(swatches[0].attributes('aria-label')).toBe('Primary')
    expect(swatches[2].attributes('aria-label')).toBe('#ffffffa1')
  })

  it('shows the current value on a custom swatch when it is not a preset', () => {
    const wrapper = mount(UtensilColorPicker, {
      props: { modelValue: '#c0ffee', colors },
    })
    expect(wrapper.find('.custom-swatch').exists()).toBe(true)
  })

  it('shows no custom swatch when the current value is a preset', () => {
    const wrapper = mount(UtensilColorPicker, {
      props: { modelValue: '#10b981', colors },
    })
    expect(wrapper.find('.custom-swatch').exists()).toBe(false)
  })

  it('emits a pick from the grid browser picker', async () => {
    const wrapper = mount(UtensilColorPicker, {
      props: { modelValue: '#2664eb', colors },
    })
    await wrapper.find('.picker-input').setValue('#123456')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#123456'])
  })
})
