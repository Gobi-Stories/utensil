import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilHintLabel from './UtensilHintLabel.vue'

describe('UtensilHintLabel', () => {
  it('renders the label text', () => {
    const wrapper = mount(UtensilHintLabel, {
      props: { text: 'Active users', hint: 'People who opened the app this month.' },
    })
    expect(wrapper.find('.hint-text').text()).toBe('Active users')
  })

  it('passes the hint to the tooltip content', () => {
    const wrapper = mount(UtensilHintLabel, {
      props: { text: 'Active users', hint: 'People who opened the app this month.' },
    })
    expect(wrapper.find('.utensil-tooltip-content').text()).toBe('People who opened the app this month.')
    expect(wrapper.find('.utensil-tooltip-content').classes()).toContain('multiline')
  })

  it('truncates the label unless asked to wrap it', () => {
    const truncated = mount(UtensilHintLabel, {
      props: { text: 'Active users', hint: 'People who opened the app this month.' },
    })
    expect(truncated.find('.utensil-hint-label').classes()).not.toContain('wrap')

    const wrapped = mount(UtensilHintLabel, {
      props: { text: 'Active users', hint: 'People who opened the app this month.', wrap: true },
    })
    expect(wrapped.find('.utensil-hint-label').classes()).toContain('wrap')
  })

  it('is keyboard focusable', () => {
    const wrapper = mount(UtensilHintLabel, {
      props: { text: 'Active users', hint: 'People who opened the app this month.' },
    })
    expect(wrapper.find('.hint-text').attributes('tabindex')).toBe('0')
  })

  it('is described by its hint', () => {
    const wrapper = mount(UtensilHintLabel, {
      props: { text: 'Active users', hint: 'People who opened the app this month.' },
    })
    const content = wrapper.find('.utensil-tooltip-content')
    expect(wrapper.find('.hint-text').attributes('aria-describedby')).toBe(content.attributes('id'))
  })
})
