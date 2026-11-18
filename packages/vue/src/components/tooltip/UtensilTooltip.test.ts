import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilTooltip from './UtensilTooltip.vue'

describe('UtensilTooltip', () => {
  it('renders the trigger slot', () => {
    const wrapper = mount(UtensilTooltip, {
      props: { text: 'Helpful hint' },
      slots: { default: '<button>Trigger</button>' },
    })
    expect(wrapper.find('button').text()).toBe('Trigger')
  })

  it('renders the tooltip text content', () => {
    const wrapper = mount(UtensilTooltip, { props: { text: 'Helpful hint' } })
    expect(wrapper.find('.utensil-tooltip-content').text()).toBe('Helpful hint')
  })

  it('is inverted by default', () => {
    const wrapper = mount(UtensilTooltip, { props: { text: 'Helpful hint' } })
    expect(wrapper.find('.utensil-tooltip-content').classes()).toContain('inverted')
  })

  it('applies the overlay variation when requested', () => {
    const wrapper = mount(UtensilTooltip, { props: { text: 'Full title', variation: 'overlay' } })
    const classes = wrapper.find('.utensil-tooltip-content').classes()
    expect(classes).toContain('overlay')
    expect(classes).not.toContain('inverted')
  })

  it('is single line by default', () => {
    const wrapper = mount(UtensilTooltip, { props: { text: 'Helpful hint' } })
    expect(wrapper.find('.utensil-tooltip-content').classes()).not.toContain('multiline')
  })

  it('applies the multiline class when requested', () => {
    const wrapper = mount(UtensilTooltip, { props: { text: 'A longer explanation', multiline: true } })
    expect(wrapper.find('.utensil-tooltip-content').classes()).toContain('multiline')
  })

  it('is a tooltip whose id the trigger can be described by', () => {
    const wrapper = mount(UtensilTooltip, {
      props: { text: 'Only owners can delete a story.' },
      slots: {
        default: `<template #default="{ tooltipId }"><button :aria-describedby="tooltipId">Delete</button></template>`,
      },
    })
    const content = wrapper.find('.utensil-tooltip-content')
    expect(content.attributes('role')).toBe('tooltip')
    expect(wrapper.find('button').attributes('aria-describedby')).toBe(content.attributes('id'))
  })
})
