import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilInfoStrip from './UtensilInfoStrip.vue'

describe('UtensilInfoStrip', () => {
  it('renders as a definition list with the base class', () => {
    const wrapper = mount(UtensilInfoStrip)
    expect(wrapper.find('dl.utensil-info-strip').exists()).toBe(true)
  })

  it('applies default variation, orientation, alignment and label placement', () => {
    const wrapper = mount(UtensilInfoStrip)
    const classes = wrapper.find('.utensil-info-strip').classes()
    expect(classes).toContain('ui-surface')
    expect(classes).toContain('horizontal')
    expect(classes).toContain('align-center')
    expect(classes).toContain('label-top')
    // Neutral by default → pencil modifier present.
    expect(classes).toContain('pencil')
  })

  it('reflects layout props in classes', () => {
    const wrapper = mount(UtensilInfoStrip, {
      props: {
        variation: 'outline',
        orientation: 'vertical',
        align: 'start',
        labelPlacement: 'bottom',
        dividers: true,
      },
    })
    const classes = wrapper.find('.utensil-info-strip').classes()
    expect(classes).toContain('ui-outline')
    expect(classes).toContain('vertical')
    expect(classes).toContain('align-start')
    expect(classes).toContain('label-bottom')
    expect(classes).toContain('dividers')
  })

  it('drops the neutral pencil modifier when a colour is set', () => {
    const wrapper = mount(UtensilInfoStrip, { props: { color: 'pen' } })
    expect(wrapper.find('.utensil-info-strip').classes()).not.toContain('pencil')
  })

  it('renders item children in the default slot', () => {
    const wrapper = mount(UtensilInfoStrip, {
      slots: {
        default: '<div class="utensil-info-strip-item">a</div><div class="utensil-info-strip-item">b</div>',
      },
    })
    expect(wrapper.findAll('.utensil-info-strip-item')).toHaveLength(2)
  })
})
