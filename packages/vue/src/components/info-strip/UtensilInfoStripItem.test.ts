import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilInfoStripItem from './UtensilInfoStripItem.vue'

describe('UtensilInfoStripItem', () => {
  it('renders the label prop in the dt and the slot value in the dd', () => {
    const wrapper = mount(UtensilInfoStripItem, {
      props: { label: 'Stories' },
      slots: { default: '5' },
    })
    expect(wrapper.find('dt.utensil-info-strip-label').text()).toBe('Stories')
    expect(wrapper.find('dd.utensil-info-strip-value').text()).toBe('5')
  })

  it('supports a label slot that overrides the prop', () => {
    const wrapper = mount(UtensilInfoStripItem, {
      props: { label: 'ignored' },
      slots: { label: '<span class="custom">Custom</span>', default: '42' },
    })
    expect(wrapper.find('dt .custom').exists()).toBe(true)
    expect(wrapper.find('dt').text()).toBe('Custom')
  })
})
