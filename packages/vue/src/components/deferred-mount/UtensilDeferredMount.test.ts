import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import UtensilDeferredMount from './UtensilDeferredMount.vue'

let pendingFrames: Map<number, FrameRequestCallback>
let nextFrameId: number

async function flushFrame() {
  const callbacks = [...pendingFrames.values()]
  pendingFrames.clear()
  for (const callback of callbacks) {
    callback(performance.now())
  }
  await nextTick()
}

beforeEach(() => {
  pendingFrames = new Map()
  nextFrameId = 1
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    const id = nextFrameId++
    pendingFrames.set(id, callback)
    return id
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    pendingFrames.delete(id)
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('UtensilDeferredMount', () => {
  it('mounts the content after one painted frame by default', async () => {
    const wrapper = mount(UtensilDeferredMount, {
      slots: { default: '<div class="content">Heavy</div>' },
    })

    expect(wrapper.find('.content').exists()).toBe(false)
    await flushFrame()
    expect(wrapper.find('.content').exists()).toBe(false)
    await flushFrame()
    expect(wrapper.find('.content').exists()).toBe(true)
  })

  it('shows the placeholder until the content mounts', async () => {
    const wrapper = mount(UtensilDeferredMount, {
      slots: {
        default: '<div class="content">Heavy</div>',
        placeholder: '<div class="placeholder">Waiting</div>',
      },
    })

    expect(wrapper.find('.placeholder').exists()).toBe(true)
    await flushFrame()
    await flushFrame()
    expect(wrapper.find('.placeholder').exists()).toBe(false)
    expect(wrapper.find('.content').exists()).toBe(true)
  })

  it('waits the configured number of painted frames', async () => {
    const wrapper = mount(UtensilDeferredMount, {
      props: { frames: 2 },
      slots: { default: '<div class="content">Heavy</div>' },
    })

    await flushFrame()
    await flushFrame()
    expect(wrapper.find('.content').exists()).toBe(false)
    await flushFrame()
    expect(wrapper.find('.content').exists()).toBe(true)
  })

  it('stays unmounted while inactive and defers once activated', async () => {
    const wrapper = mount(UtensilDeferredMount, {
      props: { active: false },
      slots: { default: '<div class="content">Heavy</div>' },
    })

    await flushFrame()
    expect(wrapper.find('.content').exists()).toBe(false)
    expect(pendingFrames.size).toBe(0)

    await wrapper.setProps({ active: true })
    expect(wrapper.find('.content').exists()).toBe(false)
    await flushFrame()
    await flushFrame()
    expect(wrapper.find('.content').exists()).toBe(true)
  })

  it('unmounts immediately on deactivation and defers again on reactivation', async () => {
    const wrapper = mount(UtensilDeferredMount, {
      slots: { default: '<div class="content">Heavy</div>' },
    })
    await flushFrame()
    await flushFrame()
    expect(wrapper.find('.content').exists()).toBe(true)

    await wrapper.setProps({ active: false })
    expect(wrapper.find('.content').exists()).toBe(false)

    await wrapper.setProps({ active: true })
    expect(wrapper.find('.content').exists()).toBe(false)
    await flushFrame()
    await flushFrame()
    expect(wrapper.find('.content').exists()).toBe(true)
  })

  it('cancels the pending frame when deactivated mid-wait', async () => {
    const wrapper = mount(UtensilDeferredMount, {
      slots: { default: '<div class="content">Heavy</div>' },
    })
    await flushFrame()

    await wrapper.setProps({ active: false })
    expect(pendingFrames.size).toBe(0)
    await flushFrame()
    expect(wrapper.find('.content').exists()).toBe(false)
  })

  it('cancels the pending frame on unmount', async () => {
    const wrapper = mount(UtensilDeferredMount, {
      slots: { default: '<div class="content">Heavy</div>' },
    })
    await flushFrame()
    expect(pendingFrames.size).toBe(1)

    wrapper.unmount()
    expect(pendingFrames.size).toBe(0)
  })
})
