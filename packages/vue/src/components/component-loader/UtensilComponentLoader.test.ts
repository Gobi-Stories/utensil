import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import UtensilComponentLoader from './UtensilComponentLoader.vue'

const DemoA = defineComponent({ template: '<div class="demo-a">Demo A</div>' })
const DemoB = defineComponent({ template: '<div class="demo-b">Demo B</div>' })

function createModules() {
  return {
    './DemoA.vue': () => Promise.resolve({ default: DemoA }),
    './DemoB.vue': () => Promise.resolve({ default: DemoB }),
  }
}

describe('UtensilComponentLoader', () => {
  it('loads and renders the component for the given path', async () => {
    const wrapper = mount(UtensilComponentLoader, {
      props: { path: './DemoA.vue', modules: createModules() },
    })

    await flushPromises()
    expect(wrapper.find('.demo-a').exists()).toBe(true)
    expect(wrapper.text()).toContain('Demo A')
  })

  it('switches component when path changes', async () => {
    const wrapper = mount(UtensilComponentLoader, {
      props: { path: './DemoA.vue', modules: createModules() },
    })

    await flushPromises()
    expect(wrapper.find('.demo-a').exists()).toBe(true)

    await wrapper.setProps({ path: './DemoB.vue' })
    await flushPromises()
    expect(wrapper.find('.demo-b').exists()).toBe(true)
    expect(wrapper.find('.demo-a').exists()).toBe(false)
  })

  it('renders nothing for an unknown path', async () => {
    const wrapper = mount(UtensilComponentLoader, {
      props: { path: './Unknown.vue', modules: createModules() },
    })

    await flushPromises()
    expect(wrapper.find('.demo-a').exists()).toBe(false)
    expect(wrapper.find('.demo-b').exists()).toBe(false)
  })

  it('calls the module loader only once per path', async () => {
    const loader = vi.fn(() => Promise.resolve({ default: DemoA }))
    const modules = { './DemoA.vue': loader }

    mount(UtensilComponentLoader, {
      props: { path: './DemoA.vue', modules },
    })

    await flushPromises()
    expect(loader).toHaveBeenCalledTimes(1)
  })

  it('renders default slot when path is undefined', async () => {
    const wrapper = mount(UtensilComponentLoader, {
      props: { modules: createModules() },
      slots: { default: '<div class="fallback">Default content</div>' },
    })

    await flushPromises()
    expect(wrapper.find('.fallback').exists()).toBe(true)
    expect(wrapper.text()).toContain('Default content')
  })

  it('replaces default slot with loaded component when path is set', async () => {
    const wrapper = mount(UtensilComponentLoader, {
      props: { modules: createModules() },
      slots: { default: '<div class="fallback">Default content</div>' },
    })

    await flushPromises()
    expect(wrapper.find('.fallback').exists()).toBe(true)

    await wrapper.setProps({ path: './DemoA.vue' })
    await flushPromises()
    expect(wrapper.find('.fallback').exists()).toBe(false)
    expect(wrapper.find('.demo-a').exists()).toBe(true)
  })

  it('shows default slot again when path is cleared', async () => {
    const wrapper = mount(UtensilComponentLoader, {
      props: { path: './DemoA.vue', modules: createModules() },
      slots: { default: '<div class="fallback">Default content</div>' },
    })

    await flushPromises()
    expect(wrapper.find('.demo-a').exists()).toBe(true)

    await wrapper.setProps({ path: undefined })
    await flushPromises()
    expect(wrapper.find('.demo-a').exists()).toBe(false)
    expect(wrapper.find('.fallback').exists()).toBe(true)
  })
})
