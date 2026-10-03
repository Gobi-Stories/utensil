import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilRangeSlider from './UtensilRangeSlider.vue'

describe('UtensilRangeSlider', () => {
  function mountSlider(props: Record<string, unknown> = {}) {
    return mount(UtensilRangeSlider, { props: { modelValue: 50, ...props } })
  }

  // jsdom has no PointerEvent — plain events carry the interaction lifecycle
  async function press(wrapper: ReturnType<typeof mountSlider>) {
    await wrapper.find('.slider-input').trigger('pointerdown')
  }

  async function release(wrapper: ReturnType<typeof mountSlider>, type: 'pointerup' | 'pointercancel' = 'pointerup') {
    window.dispatchEvent(new Event(type))
    await wrapper.vm.$nextTick()
  }

  it('marks the root interacting from press to release', async () => {
    const wrapper = mountSlider()
    expect(wrapper.classes()).not.toContain('interacting')

    await press(wrapper)
    expect(wrapper.classes()).toContain('interacting')

    await release(wrapper)
    expect(wrapper.classes()).not.toContain('interacting')
  })

  it('ends the interaction on a cancelled pointer', async () => {
    const wrapper = mountSlider()

    await press(wrapper)
    await release(wrapper, 'pointercancel')

    expect(wrapper.classes()).not.toContain('interacting')
  })

  it('carries the visibleWhileInteracting opt-in as a root class', () => {
    expect(mountSlider({ visibleWhileInteracting: true }).classes()).toContain('visible-while-interacting')
    expect(mountSlider().classes()).not.toContain('visible-while-interacting')
  })

  it('swaps the label for the value while interacting with showValuesInLabel', async () => {
    const wrapper = mountSlider({ label: 'Zoom', showValuesInLabel: true, unit: '%' })
    expect(wrapper.find('.utensil-range-slider-label').text()).toContain('Zoom')

    await press(wrapper)
    expect(wrapper.find('.utensil-range-slider-label').text()).toContain('50%')

    await release(wrapper)
    expect(wrapper.find('.utensil-range-slider-label').text()).toContain('Zoom')
  })

  it('keeps a plain label during interaction', async () => {
    const wrapper = mountSlider({ label: 'Zoom' })

    await press(wrapper)

    expect(wrapper.find('.utensil-range-slider-label').text()).toBe('Zoom')
  })
})
