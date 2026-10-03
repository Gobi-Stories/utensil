import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import UtensilMaximizer from './UtensilMaximizer.vue'

let observed: Element[]

beforeEach(() => {
  observed = []
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe(target: Element) {
        observed.push(target)
      }
      unobserve() {}
      disconnect() {}
    },
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function mountMaximizer(props: { disabled?: boolean } = {}) {
  return mount(UtensilMaximizer, {
    props,
    slots: {
      default: (scope: { disabled: boolean }) =>
        h('span', { class: 'content', 'data-disabled': String(scope.disabled) }, 'Content'),
    },
  })
}

describe('UtensilMaximizer', () => {
  it('observes its container and hides the child until it has a layout', () => {
    const wrapper = mountMaximizer()

    expect(wrapper.classes()).not.toContain('disabled')
    expect(observed).toContain(wrapper.element)
    expect(wrapper.find('.utensil-maximizer-child').attributes('style')).toContain('display: none')
    expect(wrapper.find('.content').attributes('data-disabled')).toBe('false')
  })

  it('is inert when disabled', () => {
    const wrapper = mountMaximizer({ disabled: true })

    expect(wrapper.classes()).toContain('disabled')
    expect(observed).not.toContain(wrapper.element)
    expect(wrapper.find('.utensil-maximizer-child').attributes('style') ?? '').not.toContain('display: none')
    expect(wrapper.find('.content').attributes('data-disabled')).toBe('true')
  })

  it('starts observing the container when re-enabled', async () => {
    const wrapper = mountMaximizer({ disabled: true })
    expect(observed).not.toContain(wrapper.element)

    await wrapper.setProps({ disabled: false })
    await nextTick()

    expect(wrapper.classes()).not.toContain('disabled')
    expect(observed).toContain(wrapper.element)
    expect(wrapper.find('.content').attributes('data-disabled')).toBe('false')
  })
})
