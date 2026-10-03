import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilDisclosure from './UtensilDisclosure.vue'

describe('UtensilDisclosure', () => {
  it('starts closed with the content unmounted', () => {
    const wrapper = mount(UtensilDisclosure, {
      props: { label: 'Theme' },
      slots: { default: '<p>content</p>' },
    })

    expect(wrapper.find('.disclosure-label').text()).toBe('Theme')
    expect(wrapper.find('.disclosure-content').exists()).toBe(false)
    expect(wrapper.find('.disclosure-toggle').attributes('aria-expanded')).toBe('false')
  })

  it('toggles open and closed uncontrolled', async () => {
    const wrapper = mount(UtensilDisclosure, {
      props: { label: 'Theme' },
      slots: { default: '<p>content</p>' },
    })

    await wrapper.find('.disclosure-toggle').trigger('click')

    expect(wrapper.find('.disclosure-content').text()).toBe('content')
    expect(wrapper.find('.disclosure-toggle').attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.utensil-disclosure').classes()).toContain('open')

    await wrapper.find('.disclosure-toggle').trigger('click')

    expect(wrapper.find('.disclosure-content').exists()).toBe(false)
  })

  it('starts open with defaultOpen', () => {
    const wrapper = mount(UtensilDisclosure, {
      props: { label: 'Theme', defaultOpen: true },
      slots: { default: '<p>content</p>' },
    })

    expect(wrapper.find('.disclosure-content').exists()).toBe(true)
  })

  it('follows and updates a bound open model', async () => {
    const wrapper = mount(UtensilDisclosure, {
      props: { label: 'Theme', open: false, 'onUpdate:open': (open: boolean) => wrapper.setProps({ open }) },
      slots: { default: '<p>content</p>' },
    })

    await wrapper.find('.disclosure-toggle').trigger('click')

    expect(wrapper.props('open')).toBe(true)
    expect(wrapper.find('.disclosure-content').exists()).toBe(true)

    await wrapper.setProps({ open: false })

    expect(wrapper.find('.disclosure-content').exists()).toBe(false)
  })

  it('links the toggle to the content for assistive technology', async () => {
    const wrapper = mount(UtensilDisclosure, {
      props: { label: 'Theme', defaultOpen: true },
      slots: { default: '<p>content</p>' },
    })

    const controls = wrapper.find('.disclosure-toggle').attributes('aria-controls')

    expect(controls).toBeTruthy()
    expect(wrapper.find('.disclosure-content').attributes('id')).toBe(controls)
  })

  it('renders custom label content through the label slot', () => {
    const wrapper = mount(UtensilDisclosure, {
      slots: { label: '<em>Fancy</em>', default: '<p>content</p>' },
    })

    expect(wrapper.find('.disclosure-label em').text()).toBe('Fancy')
  })
})
