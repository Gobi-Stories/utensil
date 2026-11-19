import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import UtensilHintLabel from './UtensilHintLabel.vue'

const props = { text: 'Active users', hint: 'People who opened the app this month.' }

describe('UtensilHintLabel', () => {
  it('renders the label as a button', () => {
    const wrapper = mount(UtensilHintLabel, { props })
    const button = wrapper.find('button.utensil-hint-label-text')
    expect(button.text()).toBe('Active users')
    expect(button.attributes('type')).toBe('button')
  })

  it('passes the hint to the tooltip content', () => {
    const wrapper = mount(UtensilHintLabel, { props })
    expect(wrapper.find('.utensil-tooltip-content').text()).toBe('People who opened the app this month.')
    expect(wrapper.find('.utensil-tooltip-content').classes()).toContain('multiline')
  })

  it('truncates the label unless asked to wrap it', () => {
    const truncated = mount(UtensilHintLabel, { props })
    expect(truncated.find('.utensil-hint-label').classes()).not.toContain('wrap')

    const wrapped = mount(UtensilHintLabel, { props: { ...props, wrap: true } })
    expect(wrapped.find('.utensil-hint-label').classes()).toContain('wrap')
  })

  it('is described by its hint', () => {
    const wrapper = mount(UtensilHintLabel, { props })
    const content = wrapper.find('.utensil-tooltip-content')
    expect(wrapper.find('button').attributes('aria-describedby')).toBe(content.attributes('id'))
  })

  it('is only the label, with no tab stop, without a hint', () => {
    const wrapper = mount(UtensilHintLabel, { props: { ...props, hint: '' } })
    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.find('[tabindex]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Active users')
  })

  it('places its tooltip above the label by default', () => {
    const wrapper = mount(UtensilHintLabel, { props })
    expect(wrapper.findComponent({ name: 'UtensilTooltip' }).props('placement')).toBe('top')
  })
})

describe('UtensilHintLabel pressed', () => {
  let wrapper: VueWrapper | undefined

  beforeAll(() => {
    HTMLElement.prototype.showPopover = function () {
      this.setAttribute('data-open', '')
    }
    HTMLElement.prototype.hidePopover = function () {
      this.removeAttribute('data-open')
    }
  })

  afterEach(() => {
    wrapper?.unmount()
    vi.useRealTimers()
  })

  it('shows its hint at once when pressed, where there may be no hover', async () => {
    vi.useFakeTimers()
    wrapper = mount(UtensilHintLabel, { props, attachTo: document.body })
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.utensil-popover-content').attributes('data-open')).toBeDefined()
  })
})
