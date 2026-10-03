import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilFontText from './UtensilFontText.vue'

describe('UtensilFontText', () => {
  it('renders with the supplied font-family inline style', () => {
    const wrapper = mount(UtensilFontText, {
      props: { fontFamily: 'Merriweather', text: 'Hello' },
    })
    const el = wrapper.find('.utensil-font-text')
    expect(el.exists()).toBe(true)
    expect(el.attributes('style')).toContain('font-family: Merriweather')
  })

  it('renders the text prop as content', () => {
    const wrapper = mount(UtensilFontText, {
      props: { fontFamily: 'Inter', text: 'Sample' },
    })
    expect(wrapper.text()).toBe('Sample')
  })

  it('renders default slot content when slot is provided', () => {
    const wrapper = mount(UtensilFontText, {
      props: { fontFamily: 'Inter' },
      slots: { default: 'Slot content' },
    })
    expect(wrapper.text()).toBe('Slot content')
  })

  it('prefers slot content over the text prop when both are provided', () => {
    const wrapper = mount(UtensilFontText, {
      props: { fontFamily: 'Inter', text: 'Prop text' },
      slots: { default: 'Slot wins' },
    })
    expect(wrapper.text()).toBe('Slot wins')
  })

  it('renders empty when neither text nor slot is provided', () => {
    const wrapper = mount(UtensilFontText, {
      props: { fontFamily: 'Inter' },
    })
    expect(wrapper.text()).toBe('')
  })
})
