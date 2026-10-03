import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilPageIndicator from './UtensilPageIndicator.vue'

describe('UtensilPageIndicator', () => {
  it('renders one marker per page', () => {
    const wrapper = mount(UtensilPageIndicator, { props: { count: 4 } })
    expect(wrapper.findAll('.page')).toHaveLength(4)
  })

  it('marks the first page as current by default', () => {
    const wrapper = mount(UtensilPageIndicator, { props: { count: 3 } })
    const pages = wrapper.findAll('.page')
    expect(pages[0].classes()).toContain('current')
    expect(pages[0].attributes('aria-current')).toBe('true')
    expect(pages[1].attributes('aria-current')).toBeUndefined()
  })

  it('marks the modelled page as current', () => {
    const wrapper = mount(UtensilPageIndicator, { props: { count: 3, modelValue: 2 } })
    const pages = wrapper.findAll('.page')
    expect(pages[2].classes()).toContain('current')
    expect(pages[0].classes()).not.toContain('current')
  })

  it('emits the clicked page', async () => {
    const wrapper = mount(UtensilPageIndicator, { props: { count: 3 } })
    await wrapper.findAll('.page')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
  })

  it('names each marker by its position', () => {
    const wrapper = mount(UtensilPageIndicator, { props: { count: 3 } })
    expect(wrapper.findAll('.page')[1].attributes('aria-label')).toBe('Page 2 of 3')
  })

  it('uses the given page name and group label', () => {
    const wrapper = mount(UtensilPageIndicator, {
      props: { count: 2, pageName: 'Screen', ariaLabel: 'Welcome screens' },
    })
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Welcome screens')
    expect(wrapper.findAll('.page')[0].attributes('aria-label')).toBe('Screen 1 of 2')
  })

  it('disables every marker when disabled', () => {
    const wrapper = mount(UtensilPageIndicator, { props: { count: 2, disabled: true } })
    expect(wrapper.classes()).toContain('disabled')
    expect(wrapper.findAll('.page').every((page) => page.attributes('disabled') !== undefined)).toBe(true)
  })
})
