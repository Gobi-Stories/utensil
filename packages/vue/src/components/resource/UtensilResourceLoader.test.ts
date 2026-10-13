import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import UtensilResourceLoader from './UtensilResourceLoader.vue'

function loader(props: Record<string, unknown> = {}) {
  return mount(UtensilResourceLoader, {
    props: { loaderDelay: 300, loaderMinimum: 1000, ...props },
    slots: { default: '<p class="content">Loaded</p>' },
  })
}

const spinnerShown = (wrapper: ReturnType<typeof loader>) => wrapper.find('.overlay-container').exists()
const contentShown = (wrapper: ReturnType<typeof loader>) => wrapper.find('.content').exists()

async function advance(ms: number) {
  vi.advanceTimersByTime(ms)
  await nextTick()
}

describe('UtensilResourceLoader', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows nothing until the delay passes, then the spinner', async () => {
    const wrapper = loader({ syncing: true })

    await advance(299)
    expect(spinnerShown(wrapper)).toBe(false)
    expect(contentShown(wrapper)).toBe(false)

    await advance(1)
    expect(spinnerShown(wrapper)).toBe(true)
  })

  it('shows the content at once when it loads before the delay passes', async () => {
    const wrapper = loader({ syncing: true })

    await advance(200)
    await wrapper.setProps({ syncing: false, loaded: true })

    expect(spinnerShown(wrapper)).toBe(false)
    expect(contentShown(wrapper)).toBe(true)
  })

  it('keeps a spinner that appeared for the minimum, holding the content back until it goes', async () => {
    const wrapper = loader({ syncing: true })
    await advance(300)

    await advance(100)
    await wrapper.setProps({ syncing: false, loaded: true })
    expect(spinnerShown(wrapper)).toBe(true)
    expect(contentShown(wrapper)).toBe(false)

    await advance(899)
    expect(contentShown(wrapper)).toBe(false)

    await advance(1)
    expect(spinnerShown(wrapper)).toBe(false)
    expect(contentShown(wrapper)).toBe(true)
  })

  it('lets a spinner that has stayed the minimum go when the load ends', async () => {
    const wrapper = loader({ syncing: true })
    await advance(1500)

    await wrapper.setProps({ syncing: false, loaded: true })

    expect(spinnerShown(wrapper)).toBe(false)
    expect(contentShown(wrapper)).toBe(true)
  })

  it('holds an error back until the spinner has stayed the minimum', async () => {
    const wrapper = loader({ syncing: true })
    await advance(300)

    await wrapper.setProps({ syncing: false, hasError: true })
    expect(wrapper.find('.resource-error').exists()).toBe(false)

    await advance(1000)
    expect(wrapper.find('.resource-error').exists()).toBe(true)
  })
})
