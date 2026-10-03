import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilSpinnerOverlay from './UtensilSpinnerOverlay.vue'

describe('UtensilSpinnerOverlay', () => {
  it('covers the slotted content with a spinner while shown', () => {
    const wrapper = mount(UtensilSpinnerOverlay, {
      props: { show: true, delay: 0 },
      slots: { default: '<p>Content</p>' },
    })

    expect(wrapper.text()).toContain('Content')
    expect(wrapper.find('.overlay-container').exists()).toBe(true)
  })

  it('waits for the delay before showing the spinner', () => {
    const wrapper = mount(UtensilSpinnerOverlay, {
      props: { show: true, delay: 300 },
    })

    expect(wrapper.find('.overlay-container').exists()).toBe(false)
  })

  it('shows the title under the spinner when given', () => {
    const wrapper = mount(UtensilSpinnerOverlay, {
      props: { show: true, delay: 0, title: 'Transcribing subtitles' },
    })

    expect(wrapper.find('.overlay-title').text()).toBe('Transcribing subtitles')
  })

  it('has no title element without one', () => {
    const wrapper = mount(UtensilSpinnerOverlay, {
      props: { show: true, delay: 0 },
    })

    expect(wrapper.find('.overlay-title').exists()).toBe(false)
  })
})
