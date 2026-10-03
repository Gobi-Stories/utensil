import { describe, it, expect } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import UtensilDataList from './UtensilDataList.vue'
import UtensilDataListItem from './UtensilDataListItem.vue'

const DataListWithItem = defineComponent({
  components: { UtensilDataList, UtensilDataListItem },
  props: {
    orientation: { type: String, default: undefined },
    block: { type: Boolean, default: false },
  },
  template: `
    <UtensilDataList :orientation="orientation" :block="block">
      <UtensilDataListItem label="Key">Value</UtensilDataListItem>
    </UtensilDataList>
  `,
})

describe('UtensilDataList', () => {
  it('renders a dl element with horizontal class by default', () => {
    const wrapper = mount(UtensilDataList)
    const dl = wrapper.find('dl')
    expect(dl.exists()).toBe(true)
    expect(dl.classes()).toContain('utensil-data-list')
    expect(dl.classes()).toContain('horizontal')
  })

  it('applies vertical class when orientation is vertical', () => {
    const wrapper = mount(UtensilDataList, {
      props: { orientation: 'vertical' },
    })
    expect(wrapper.find('dl').classes()).toContain('vertical')
  })

  it('renders slot content', () => {
    const wrapper = mount(UtensilDataList, {
      slots: { default: '<div class="child">content</div>' },
    })
    expect(wrapper.find('.child').text()).toBe('content')
  })
})

describe('UtensilDataListItem', () => {
  it('renders dt and dd elements', () => {
    const wrapper = mount(UtensilDataListItem, {
      props: { label: 'Name' },
      slots: { default: 'John' },
    })
    expect(wrapper.find('dt').text()).toBe('Name')
    expect(wrapper.find('dd').text()).toBe('John')
  })

  it('uses #label slot over label prop', () => {
    const wrapper = mount(UtensilDataListItem, {
      props: { label: 'Fallback' },
      slots: {
        label: '<span class="custom-label">Custom</span>',
        default: 'Value',
      },
    })
    expect(wrapper.find('.custom-label').text()).toBe('Custom')
    expect(wrapper.find('dt').text()).toBe('Custom')
  })

  it('inherits horizontal orientation from parent UtensilDataList', () => {
    const wrapper = mount(DataListWithItem)
    const item = wrapper.find('.utensil-data-list-item')
    expect(item.classes()).toContain('horizontal')
  })

  it('inherits vertical orientation from parent UtensilDataList', () => {
    const wrapper = mount(DataListWithItem, {
      props: { orientation: 'vertical' },
    })
    const item = wrapper.find('.utensil-data-list-item')
    expect(item.classes()).toContain('vertical')
  })

  it('applies align class when align prop is set', () => {
    const wrapper = mount(UtensilDataListItem, {
      props: { label: 'Key', alignment: 'center' },
      slots: { default: 'Value' },
    })
    expect(wrapper.find('.utensil-data-list-item').classes()).toContain('align-center')
  })

  it('does not apply align class when align is not set', () => {
    const wrapper = mount(UtensilDataListItem, {
      props: { label: 'Key' },
      slots: { default: 'Value' },
    })
    const classes = wrapper.find('.utensil-data-list-item').classes()
    expect(classes.some((c) => c.startsWith('align-'))).toBe(false)
  })

  it('inherits block class from parent UtensilDataList', () => {
    const wrapper = mount(DataListWithItem, {
      props: { block: true },
    })
    const item = wrapper.find('.utensil-data-list-item')
    expect(item.classes()).toContain('block')
  })

  it('does not apply block class when parent block is false', () => {
    const wrapper = mount(DataListWithItem)
    const item = wrapper.find('.utensil-data-list-item')
    expect(item.classes()).not.toContain('block')
  })
})
