import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilHeader from './UtensilHeader.vue'

describe('UtensilHeader', () => {
  it('renders with default h3 element', () => {
    const wrapper = mount(UtensilHeader, { props: { title: 'Test' } })
    expect(wrapper.find('h3.utensil-header').exists()).toBe(true)
    expect(wrapper.text()).toBe('Test')
  })

  it('renders the specified heading element', () => {
    const wrapper = mount(UtensilHeader, { props: { title: 'Title', element: 'h1' } })
    expect(wrapper.find('h1.utensil-header').exists()).toBe(true)
  })

  it('renders default slot content instead of title prop', () => {
    const wrapper = mount(UtensilHeader, {
      slots: { default: 'Custom Title' },
    })
    expect(wrapper.text()).toContain('Custom Title')
  })

  it('renders actions slot when provided', () => {
    const wrapper = mount(UtensilHeader, {
      props: { title: 'Title' },
      slots: { actions: '<button>Save</button>' },
    })
    expect(wrapper.find('.utensil-header-actions').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Save')
  })

  it('does not render actions container when no actions slot', () => {
    const wrapper = mount(UtensilHeader, { props: { title: 'Title' } })
    expect(wrapper.find('.utensil-header-actions').exists()).toBe(false)
  })
})
