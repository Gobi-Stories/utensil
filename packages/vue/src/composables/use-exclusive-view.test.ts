import { describe, expect, it, vi } from 'vitest'
import type { Component } from 'vue'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { type ExclusiveView, provideExclusiveView, useExclusiveView } from './use-exclusive-view'

function viewComponent(register: (view: ExclusiveView) => void, source: Partial<ExclusiveView> = {}) {
  return defineComponent({
    setup() {
      register(useExclusiveView(source))
      return () => h('div')
    },
  })
}

function mountViews(...children: Component[]) {
  return mount(
    defineComponent({
      setup() {
        provideExclusiveView()
        return () => children.map((child) => h(child))
      },
    }),
  )
}

describe('useExclusiveView', () => {
  it('closes the other views when one opens', () => {
    const views: ExclusiveView[] = []
    const register = (view: ExclusiveView) => views.push(view)
    mountViews(viewComponent(register), viewComponent(register), viewComponent(register))

    views[0].open()
    views[2].open()

    expect(views[0].opened.value).toBe(false)
    expect(views[1].opened.value).toBe(false)
    expect(views[2].opened.value).toBe(true)
  })

  it('calls through to the given open and close functions', () => {
    const views: ExclusiveView[] = []
    const register = (view: ExclusiveView) => views.push(view)
    const open = vi.fn()
    const close = vi.fn()
    mountViews(viewComponent(register, { open, close }), viewComponent(register))

    views[0].open()

    expect(open).toHaveBeenCalledOnce()
    expect(close).not.toHaveBeenCalled()
    expect(views[0].opened.value).toBe(true)

    views[1].open()

    expect(close).toHaveBeenCalledOnce()
    expect(views[0].opened.value).toBe(false)
  })

  it('closes the others when a given open state is set directly', () => {
    const views: ExclusiveView[] = []
    const register = (view: ExclusiveView) => views.push(view)
    const state = ref(false)
    mountViews(viewComponent(register, { opened: state }), viewComponent(register))

    views[1].open()
    state.value = true

    expect(views[0].opened.value).toBe(true)
    expect(views[1].opened.value).toBe(false)
  })

  it('scopes exclusivity to the nearest provided context', () => {
    const outer: ExclusiveView[] = []
    const inner: ExclusiveView[] = []
    const innerContext = defineComponent({
      setup() {
        provideExclusiveView()
        const children = [viewComponent((view) => inner.push(view)), viewComponent((view) => inner.push(view))]
        return () => children.map((child) => h(child))
      },
    })
    mountViews(
      viewComponent((view) => outer.push(view)),
      innerContext,
    )

    outer[0].open()
    inner[0].open()

    expect(outer[0].opened.value).toBe(true)

    inner[1].open()

    expect(inner[0].opened.value).toBe(false)
    expect(inner[1].opened.value).toBe(true)
    expect(outer[0].opened.value).toBe(true)
  })

  it('unregisters a view when it unmounts', async () => {
    const views: ExclusiveView[] = []
    const close = vi.fn()
    const showFirst = ref(true)
    mount(
      defineComponent({
        setup() {
          provideExclusiveView()
          const first = viewComponent((view) => views.push(view), { close })
          const second = viewComponent((view) => views.push(view))
          return () => [showFirst.value ? h(first) : null, h(second)]
        },
      }),
    )

    showFirst.value = false
    await nextTick()

    views[1].open()

    expect(close).not.toHaveBeenCalled()
  })

  it('throws when no context is provided', () => {
    expect(() => mount(viewComponent(() => {}))).toThrow('provideExclusiveView')
  })
})
