import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import UtensilFader from './UtensilFader.vue'

describe('UtensilFader', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  // The real Transition, not the test stub — hiding runs through it
  function mountFader(props: Record<string, unknown>) {
    return mount(UtensilFader, {
      props,
      slots: { default: '<p class="content">Content</p>' },
      global: { stubs: { transition: false } },
    })
  }

  it('shows the slotted content while shown', async () => {
    const wrapper = mountFader({ show: true })
    await nextTick()

    expect(wrapper.find('.content').exists()).toBe(true)
  })

  it('drops the content when hiding without a fade out', async () => {
    const wrapper = mountFader({ show: true, fadeOut: false })
    await nextTick()

    await wrapper.setProps({ show: false })

    expect(wrapper.find('.content').exists()).toBe(false)
  })

  it('drops the content when hiding while disabled', async () => {
    const wrapper = mountFader({ show: true, enabled: false })
    await nextTick()

    await wrapper.setProps({ show: false })

    expect(wrapper.find('.content').exists()).toBe(false)
  })

  it('holds the content for the out delay before hiding', async () => {
    vi.useFakeTimers()
    const wrapper = mountFader({ show: true, outDelay: 300 })
    await nextTick()

    await wrapper.setProps({ show: false })
    expect(wrapper.find('.content').exists()).toBe(true)

    vi.advanceTimersByTime(300)
    await nextTick()
    expect(wrapper.find('.content').exists()).toBe(false)
  })
})
