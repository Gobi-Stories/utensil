import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilProgressBar from './UtensilProgressBar.vue'

describe('UtensilProgressBar', () => {
  it('fills to its value', () => {
    const wrapper = mount(UtensilProgressBar, { props: { value: 40 } })
    expect(wrapper.find('.fill').attributes('style')).toContain('width: 40%')
    expect(wrapper.attributes('aria-valuenow')).toBe('40')
    expect(wrapper.find('.fill.indeterminate').exists()).toBe(false)
  })

  it('pulses over a full fill while indeterminate', () => {
    const wrapper = mount(UtensilProgressBar, { props: { value: 40, indeterminate: true } })
    expect(wrapper.find('.fill.full').exists()).toBe(true)
    expect(wrapper.find('.fill.indeterminate').exists()).toBe(true)
    expect(wrapper.attributes('aria-valuenow')).toBeUndefined()
  })

  it('pulses over the empty track when its indeterminate fill is none', () => {
    const wrapper = mount(UtensilProgressBar, { props: { indeterminate: true, indeterminateFill: 'none' } })
    expect(wrapper.classes()).toContain('indeterminate-fill-none')
    expect(wrapper.find('.fill.full').exists()).toBe(false)
    expect(wrapper.find('.fill.indeterminate').exists()).toBe(true)
  })

  it('shows its value on a fresh fill when it leaves the indeterminate state', async () => {
    const wrapper = mount(UtensilProgressBar, { props: { value: 0, indeterminate: true } })
    const fullFill = wrapper.find('.fill.full').element

    await wrapper.setProps({ indeterminate: false })

    const fills = wrapper.findAll('.fill')
    expect(fills).toHaveLength(1)
    expect(fills[0].element).not.toBe(fullFill)
    expect(fills[0].attributes('style')).toContain('width: 0%')
  })

  it('clamps its value to 0 to 100, for the fill and aria-valuenow', async () => {
    const wrapper = mount(UtensilProgressBar, { props: { value: 140 } })
    expect(wrapper.find('.fill').attributes('style')).toContain('width: 100%')
    expect(wrapper.attributes('aria-valuenow')).toBe('100')

    await wrapper.setProps({ value: -5 })
    expect(wrapper.find('.fill').attributes('style')).toContain('width: 0%')
    expect(wrapper.attributes('aria-valuenow')).toBe('0')

    await wrapper.setProps({ value: Number.NaN })
    expect(wrapper.attributes('aria-valuenow')).toBe('0')
  })

  it('takes the theme rounded or squared corners', () => {
    expect(mount(UtensilProgressBar, { props: { rounded: true } }).classes()).toContain('rounded')
    expect(mount(UtensilProgressBar, { props: { squared: true } }).classes()).toContain('squared')
  })
})
