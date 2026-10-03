import { describe, it, expect, vi, afterEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { provideKeyScope, useKeyScope } from './use-key-scope'
import { useKeys } from './use-keys'

let wrappers: VueWrapper[] = []

afterEach(() => {
  wrappers.forEach((wrapper) => wrapper.unmount())
  wrappers = []
})

describe('useKeyScope', () => {
  it("attaches a descendant's keys to the scope, so they work from anywhere inside it", async () => {
    const space = vi.fn()
    const Panel = defineComponent({
      setup() {
        useKeys({ Space: space }, { target: useKeyScope() })
      },
      template: `<div class="panel" />`,
    })
    const Region = defineComponent({
      components: { Panel },
      setup() {
        const region = ref<HTMLElement | null>(null)
        provideKeyScope(region)
        return { region }
      },
      template: `<div ref="region" class="region" tabindex="-1"><div class="elsewhere" /><Panel /></div>`,
    })
    const wrapper = mount(Region, { attachTo: document.body })
    wrappers.push(wrapper)
    await nextTick()

    wrapper.find('.elsewhere').element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))

    expect(space).toHaveBeenCalledOnce()
  })

  it('throws outside a scope', () => {
    const Orphan = defineComponent({
      setup() {
        useKeyScope()
      },
      template: `<div />`,
    })

    expect(() => mount(Orphan)).toThrow('Key scope not provided')
  })
})
