import { describe, it, expect, afterEach, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import UtensilReorderableList from './UtensilReorderableList.vue'
import { provideReorderableGroup, type ReorderableEvent } from './utensil-reorderable-list'

// jsdom has no layout, so every rect is zero-sized and the geometry sees a vertical list — enough
// to exercise the keyboard flow and the event contract end to end.

interface ListExposed {
  grab: (id: string | number) => void
  drop: () => void
  cancel: () => void
}

let wrapper: VueWrapper | null = null

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
})

function mountList(props: Record<string, unknown> = {}) {
  wrapper = mount(UtensilReorderableList, {
    props,
    slots: {
      default: `
        <template #default="{ state, targetBefore, targetAfter, targetOver, targetHome }">
          <div
            data-reorderable-id="a"
            :data-state="state('a')"
            :data-before="targetBefore('a')"
            :data-target-home="targetHome"
          >
            A
          </div>
          <div
            data-reorderable-id="b"
            :data-state="state('b')"
            :data-after="targetAfter('b')"
            :data-over="targetOver('b')"
          >
            B
          </div>
        </template>
      `,
    },
    attachTo: document.body,
  })
  return wrapper
}

function exposed(target: VueWrapper): ListExposed {
  return target.vm as unknown as ListExposed
}

function pressKey(key: string) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
}

// The test DOM has no PointerEvent: a MouseEvent carries the touch pointer fields it lacks
function touchEvent(type: string, x: number, y: number) {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX: x, clientY: y })
  Object.defineProperties(event, {
    pointerType: { value: 'touch' },
    pointerId: { value: 1 },
    isPrimary: { value: true },
  })
  return event
}

describe('UtensilReorderableList', () => {
  it('reports home state for idle items', () => {
    const list = mountList()
    expect(list.find('[data-reorderable-id="a"]').attributes('data-state')).toBe('home')
  })

  it('grabs an item and emits grabbed with its id and index', async () => {
    const list = mountList()
    exposed(list).grab('a')
    await list.vm.$nextTick()
    expect(list.emitted('grabbed')).toEqual([[{ id: 'a', index: 0 }]])
    expect(list.find('[data-reorderable-id="a"]').attributes('data-state')).toBe('grabbed')
    // The state attribute survives the consumer's reactive :class re-render (classes would not)
    expect(list.find('[data-reorderable-id="a"]').attributes('data-reorderable-state')).toBe('grabbed')
  })

  it('falls back to the child index when no id attribute is present', async () => {
    wrapper = mount(UtensilReorderableList, {
      slots: { default: '<div>A</div><div>B</div>' },
      attachTo: document.body,
    })
    exposed(wrapper).grab(1)
    expect(wrapper.emitted('grabbed')).toEqual([[{ id: 1, index: 1 }]])
  })

  it('ignores grabs on draggable="false" items', () => {
    wrapper = mount(UtensilReorderableList, {
      slots: { default: '<div data-reorderable-id="a" draggable="false">A</div>' },
      attachTo: document.body,
    })
    exposed(wrapper).grab('a')
    expect(wrapper.emitted('grabbed')).toBeUndefined()
  })

  it('moves the target with arrows, skipping the no-op slot beside home', async () => {
    const list = mountList()
    exposed(list).grab('a')
    pressKey('ArrowDown')
    await list.vm.$nextTick()
    expect(list.emitted('moving')).toEqual([[{ id: 'a', index: 1 }]])
    expect(list.find('[data-reorderable-id="a"]').attributes('data-state')).toBe('moving')
    expect(list.find('[data-reorderable-id="b"]').attributes('data-after')).toBe('true')
  })

  it('reports the item whose place the drop would take, never the grabbed one', async () => {
    const list = mountList()
    const over = (id: string) => list.find(`[data-reorderable-id="${id}"]`).attributes('data-over')
    exposed(list).grab('a')
    pressKey('ArrowDown')
    await list.vm.$nextTick()
    expect(over('b')).toBe('true')
    pressKey('ArrowUp')
    await list.vm.$nextTick()
    // Back home the drop lands on the grabbed item's own place, which is nobody's to take
    expect(over('b')).toBe('false')
    pressKey('Escape')
    await list.vm.$nextTick()
    expect(over('b')).toBe('false')
  })

  it('reports when the target is back home', async () => {
    const list = mountList()
    const item = () => list.find('[data-reorderable-id="a"]')
    exposed(list).grab('a')
    await list.vm.$nextTick()
    expect(item().attributes('data-target-home')).toBe('false')
    pressKey('ArrowDown')
    await list.vm.$nextTick()
    expect(item().attributes('data-target-home')).toBe('false')
    pressKey('ArrowUp')
    await list.vm.$nextTick()
    expect(item().attributes('data-target-home')).toBe('true')
    pressKey('Escape')
  })

  it('pins the marker to the before slot when the target returns home', async () => {
    const list = mountList()
    exposed(list).grab('a')
    pressKey('ArrowDown')
    pressKey('ArrowUp')
    await list.vm.$nextTick()
    expect(list.emitted('moving')).toEqual([[{ id: 'a', index: 1 }], [{ id: 'a', index: 0 }]])
    expect(list.find('[data-reorderable-id="a"]').attributes('data-before')).toBe('true')
    pressKey('Escape')
  })

  it('never marks the home slot with noHomeMarkers, while moving still reports it', async () => {
    const list = mountList({ noHomeMarkers: true })
    exposed(list).grab('a')
    pressKey('ArrowDown')
    pressKey('ArrowUp')
    await list.vm.$nextTick()
    expect(list.emitted('moving')).toEqual([[{ id: 'a', index: 1 }], [{ id: 'a', index: 0 }]])
    expect(list.find('[data-reorderable-id="a"]').attributes('data-before')).toBe('false')
    pressKey('Escape')
  })

  it('shows a flow placeholder at the target instead of markers in targetPlaceholder mode', async () => {
    const list = mountList({ targetPlaceholder: true })
    exposed(list).grab('a')
    pressKey('ArrowDown')
    await list.vm.$nextTick()
    expect(list.emitted('moving')).toEqual([[{ id: 'a', index: 1 }]])
    expect(list.find('.flow-placeholder').exists()).toBe(true)
    expect(list.find('[data-reorderable-id="a"]').attributes('data-before')).toBe('false')

    pressKey('Escape')
    await list.vm.$nextTick()
    expect(list.find('.flow-placeholder').exists()).toBe(false)
  })

  it('settles the animated flow placeholder open at the target', async () => {
    const list = mountList({ targetPlaceholder: 'animated' })
    // jsdom has no layout — give the item a size so collapsed (0px) and open are distinguishable
    const item = list.find('[data-reorderable-id="a"]').element
    Object.defineProperty(item, 'offsetWidth', { value: 100 })
    Object.defineProperty(item, 'offsetHeight', { value: 20 })
    exposed(list).grab('a')
    pressKey('ArrowDown')
    await list.vm.$nextTick()
    await list.vm.$nextTick()
    const placeholder = list.find('.flow-placeholder')
    expect(placeholder.exists()).toBe(true)
    // The collapsed entry size must settle to the item's full size
    expect(placeholder.attributes('style')).toContain('height: 20px')

    pressKey('Escape')
    await list.vm.$nextTick()
    expect(list.find('.flow-placeholder').exists()).toBe(false)
  })

  it('holds the home space with the placeholder the moment the item leaves', async () => {
    document.elementFromPoint = () => null
    try {
      const list = mountList({ targetPlaceholder: 'animated' })
      const item = list.find('[data-reorderable-id="a"]').element
      Object.defineProperty(item, 'offsetWidth', { value: 100 })
      Object.defineProperty(item, 'offsetHeight', { value: 20 })
      item.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, button: 0, clientX: 10, clientY: 10 }))
      window.dispatchEvent(new MouseEvent('pointermove', { clientX: 10, clientY: 60 }))
      await list.vm.$nextTick()
      await list.vm.$nextTick()
      const flow = list.find('.flow-placeholder')
      expect(flow.exists()).toBe(true)
      // Full size at the item's own position, and silent — no moving event for the home target
      expect(flow.attributes('style')).toContain('height: 20px')
      expect(flow.element.nextElementSibling).toBe(item)
      expect(list.emitted('moving')).toBeUndefined()

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      window.dispatchEvent(new MouseEvent('pointerup'))
      expect(list.emitted('canceled')).toEqual([[{ id: 'a', index: 0 }]])
    } finally {
      Reflect.deleteProperty(document, 'elementFromPoint')
    }
  })

  it('ghosts a clone of the item carrying its moving class instead of the moving-placeholder slot', async () => {
    document.elementFromPoint = () => null
    try {
      wrapper = mount(UtensilReorderableList, {
        props: { clone: true },
        slots: {
          default: `
            <template #default="{ state }">
              <div data-reorderable-id="a" :class="{ 'is-moving': state('a') === 'moving' }">A</div>
            </template>
          `,
          'moving-placeholder': '<div class="custom-ghost">custom</div>',
        },
        attachTo: document.body,
      })
      const item = wrapper.find('[data-reorderable-id="a"]').element
      item.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, button: 0, clientX: 10, clientY: 10 }))
      window.dispatchEvent(new MouseEvent('pointermove', { clientX: 10, clientY: 60 }))
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      const ghost = wrapper.find('.utensil-reorderable-ghost')
      expect(ghost.find('.custom-ghost').exists()).toBe(false)
      const clone = ghost.element.firstElementChild as HTMLElement
      expect(clone.getAttribute('data-reorderable-id')).toBe('a')
      // The clone is taken after the moving state renders, so the consumer's reactive class is on it
      expect(clone.classList.contains('is-moving')).toBe(true)
      expect(clone.getAttribute('data-reorderable-state')).toBe('moving')

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      window.dispatchEvent(new MouseEvent('pointerup'))
      expect(ghost.element.children.length).toBe(0)
    } finally {
      Reflect.deleteProperty(document, 'elementFromPoint')
    }
  })

  it('auto-scrolls a scrollable ancestor while a pointer drag holds near its edge', async () => {
    document.elementFromPoint = () => null
    try {
      const strip = defineComponent({
        components: { UtensilReorderableList },
        template: `
          <div class="scroller" style="overflow-x: auto">
            <UtensilReorderableList>
              <div data-reorderable-id="a">A</div>
              <div data-reorderable-id="b">B</div>
            </UtensilReorderableList>
          </div>
        `,
      })
      wrapper = mount(strip, { attachTo: document.body })
      const scroller = wrapper.find<HTMLElement>('.scroller').element
      // No layout in jsdom: give the scroller overflowing content and a 300px viewport box
      Object.defineProperty(scroller, 'scrollWidth', { value: 1000 })
      Object.defineProperty(scroller, 'clientWidth', { value: 300 })
      scroller.getBoundingClientRect = () => DOMRect.fromRect({ x: 0, y: 0, width: 300, height: 100 })
      const scrolls: number[] = []
      scroller.scrollBy = ((x: number) => {
        scrolls.push(x)
      }) as typeof scroller.scrollBy
      const item = wrapper.find('[data-reorderable-id="a"]').element
      item.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, button: 0, clientX: 150, clientY: 50 }))
      window.dispatchEvent(new MouseEvent('pointermove', { clientX: 290, clientY: 50 }))
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      expect(scrolls.length).toBeGreaterThan(0)
      expect(scrolls[0]).toBeGreaterThan(0)

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      window.dispatchEvent(new MouseEvent('pointerup'))
    } finally {
      Reflect.deleteProperty(document, 'elementFromPoint')
    }
  })

  it('arms a held touch into a grab after the system hold, while a moving touch stays a pan', async () => {
    vi.useFakeTimers()
    try {
      const list = mountList()
      const item = list.find('[data-reorderable-id="a"]').element
      item.dispatchEvent(touchEvent('pointerdown', 10, 10))
      await list.vm.$nextTick()
      expect(list.classes()).toContain('touch-hold')
      vi.advanceTimersByTime(499)
      expect(list.emitted('grabbed')).toBeUndefined()
      vi.advanceTimersByTime(1)
      expect(list.emitted('grabbed')).toEqual([[{ id: 'a', index: 0 }]])
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      window.dispatchEvent(touchEvent('pointerup', 10, 10))
      await list.vm.$nextTick()
      expect(list.classes()).not.toContain('touch-hold')

      item.dispatchEvent(touchEvent('pointerdown', 10, 10))
      window.dispatchEvent(touchEvent('pointermove', 10, 30))
      vi.advanceTimersByTime(500)
      expect(list.emitted('grabbed')).toHaveLength(1)
      await list.vm.$nextTick()
      expect(list.classes()).not.toContain('touch-hold')
    } finally {
      vi.useRealTimers()
    }
  })

  it('replays contextmenu on the item when a held touch is lifted without dragging', () => {
    vi.useFakeTimers()
    try {
      const list = mountList()
      const item = list.find('[data-reorderable-id="a"]').element
      // The finger rests on a descendant of the item, where the browser would have raised it
      const inner = document.createElement('span')
      item.appendChild(inner)
      document.elementFromPoint = () => inner
      const contextmenu = vi.fn()
      item.addEventListener('contextmenu', contextmenu)
      item.dispatchEvent(touchEvent('pointerdown', 10, 10))
      // The browser's own contextmenu, either side of the hold time, never reaches the item
      item.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
      vi.advanceTimersByTime(500)
      item.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
      expect(contextmenu).not.toHaveBeenCalled()

      window.dispatchEvent(touchEvent('pointerup', 10, 10))
      expect(list.emitted('canceled')).toEqual([[{ id: 'a', index: 0 }]])
      expect(contextmenu).toHaveBeenCalledOnce()
      const replayed = contextmenu.mock.calls[0][0] as MouseEvent
      expect([replayed.clientX, replayed.clientY]).toEqual([10, 10])
      expect(replayed.target).toBe(inner)
      // The release's click belongs to the long press, not to a tap on the item
      const click = new MouseEvent('click', { bubbles: true, cancelable: true })
      item.dispatchEvent(click)
      expect(click.defaultPrevented).toBe(true)
    } finally {
      vi.useRealTimers()
      Reflect.deleteProperty(document, 'elementFromPoint')
    }
  })

  it('keeps targeting a confined list while the pointer is off every list', async () => {
    document.elementFromPoint = () => null
    try {
      const list = mountList({ confined: true })
      const item = list.find('[data-reorderable-id="a"]').element
      item.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, button: 0, clientX: 10, clientY: 10 }))
      window.dispatchEvent(new MouseEvent('pointermove', { clientX: 10, clientY: 60 }))
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      await list.vm.$nextTick()
      expect(list.find('[data-reorderable-id="a"]').attributes('data-state')).toBe('moving')
      expect(list.emitted('moving')).toBeTruthy()

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      window.dispatchEvent(new MouseEvent('pointerup'))
    } finally {
      Reflect.deleteProperty(document, 'elementFromPoint')
    }
  })

  it('drops to the new index and only then', async () => {
    const list = mountList()
    exposed(list).grab('a')
    pressKey('ArrowDown')
    pressKey('Enter')
    await list.vm.$nextTick()
    expect(list.emitted('dropped')).toEqual([[{ id: 'a', index: 1 }]])
    expect(list.emitted('canceled')).toBeUndefined()
    expect(list.find('[data-reorderable-id="a"]').attributes('data-state')).toBe('home')
  })

  it('cancels a drop that never left home', () => {
    const list = mountList()
    exposed(list).grab('a')
    pressKey('Enter')
    expect(list.emitted('dropped')).toBeUndefined()
    expect(list.emitted('canceled')).toEqual([[{ id: 'a', index: 0 }]])
  })

  it('cancels on Escape', () => {
    const list = mountList()
    exposed(list).grab('a')
    pressKey('ArrowDown')
    pressKey('Escape')
    expect(list.emitted('dropped')).toBeUndefined()
    expect(list.emitted('canceled')).toEqual([[{ id: 'a', index: 0 }]])
  })

  it('grabs the focused item on Enter only when keyboardGrab is set', async () => {
    const list = mountList()
    await list.find('[data-reorderable-id="a"]').trigger('keydown', { key: 'Enter' })
    expect(list.emitted('grabbed')).toBeUndefined()

    await list.setProps({ keyboardGrab: true })
    await list.find('[data-reorderable-id="a"]').trigger('keydown', { key: 'Enter' })
    expect(list.emitted('grabbed')).toEqual([[{ id: 'a', index: 0 }]])
    pressKey('Escape')
  })

  it('drops on Enter without the same press grabbing the item again', async () => {
    const list = mountList({ keyboardGrab: true })
    const item = list.find('[data-reorderable-id="a"]')
    await item.trigger('keydown', { key: 'Enter' })
    pressKey('ArrowDown')
    await item.trigger('keydown', { key: 'Enter' })
    expect(list.emitted('dropped')).toEqual([[{ id: 'a', index: 1 }]])
    expect(list.emitted('grabbed')).toHaveLength(1)
    expect(item.attributes('data-state')).toBe('home')
  })

  it('keeps focus on the item after a keyboard drop re-renders the list', async () => {
    const list = defineComponent({
      components: { UtensilReorderableList },
      setup: () => {
        const items = ref(['a', 'b'])
        function reorder(event: ReorderableEvent) {
          const [moved] = items.value.splice(items.value.indexOf(String(event.id)), 1)
          items.value.splice(event.index, 0, moved)
          // jsdom keeps focus on a node the re-render moves, so the consumer stands in for the browser
          ;(document.activeElement as HTMLElement | null)?.blur()
        }
        return { items, reorder }
      },
      template: `
        <UtensilReorderableList keyboard-grab @dropped="reorder">
          <div v-for="item in items" :key="item" :data-reorderable-id="item" tabindex="0">{{ item }}</div>
        </UtensilReorderableList>
      `,
    })
    wrapper = mount(list, { attachTo: document.body })
    const item = wrapper.find<HTMLElement>('[data-reorderable-id="a"]')
    item.element.focus()
    await item.trigger('keydown', { key: 'Enter' })
    pressKey('ArrowDown')
    await item.trigger('keydown', { key: 'Enter' })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('[data-reorderable-id]').map((child) => child.text())).toEqual(['b', 'a'])
    expect(document.activeElement).toBe(wrapper.find('[data-reorderable-id="a"]').element)
  })

  it('moves focus to the item in the destination list after a cross-list drop', async () => {
    const kanban = defineComponent({
      components: { UtensilReorderableList },
      setup: () => {
        provideReorderableGroup()
        const source = ref(['x'])
        const destination = ref(['y'])
        let moved: string | null = null
        function remove(event: ReorderableEvent) {
          moved = source.value.splice(source.value.indexOf(String(event.id)), 1)[0]
        }
        function add(event: ReorderableEvent) {
          if (moved) destination.value.splice(event.index, 0, moved)
          moved = null
        }
        return { source, destination, remove, add }
      },
      template: `
        <UtensilReorderableList namespace="cards" class="source" @removed="remove">
          <div v-for="item in source" :key="item" :data-reorderable-id="item" tabindex="0">{{ item }}</div>
        </UtensilReorderableList>
        <UtensilReorderableList namespace="cards" class="destination" @added="add">
          <div v-for="item in destination" :key="item" :data-reorderable-id="item" tabindex="0">{{ item }}</div>
        </UtensilReorderableList>
      `,
    })
    wrapper = mount(kanban, { attachTo: document.body })
    wrapper.find<HTMLElement>('[data-reorderable-id="x"]').element.focus()
    const [source] = wrapper.findAllComponents(UtensilReorderableList)
    exposed(source as VueWrapper).grab('x')
    pressKey('ArrowDown')
    await wrapper.vm.$nextTick()
    pressKey('Enter')
    await wrapper.vm.$nextTick()
    const landed = wrapper.find('.destination [data-reorderable-id="x"]')
    expect(landed.exists()).toBe(true)
    expect(document.activeElement).toBe(landed.element)
  })

  it('moves items between namespaced lists in a group', async () => {
    const kanban = defineComponent({
      components: { UtensilReorderableList },
      setup: () => {
        provideReorderableGroup()
      },
      template: `
        <UtensilReorderableList namespace="cards" class="source">
          <div data-reorderable-id="x">X</div>
        </UtensilReorderableList>
        <UtensilReorderableList namespace="cards" class="destination">
          <div data-reorderable-id="y">Y</div>
        </UtensilReorderableList>
      `,
    })
    wrapper = mount(kanban, { attachTo: document.body })
    const [source, destination] = wrapper.findAllComponents(UtensilReorderableList)
    exposed(source as VueWrapper).grab('x')
    pressKey('ArrowDown')
    await wrapper.vm.$nextTick()
    expect(destination.emitted('moving')).toEqual([[{ id: 'x', index: 0 }]])

    pressKey('Enter')
    expect(source.emitted('removed')).toEqual([[{ id: 'x', index: 0 }]])
    expect(destination.emitted('added')).toEqual([[{ id: 'x', index: 0 }]])
    expect(source.emitted('dropped')).toBeUndefined()
  })

  it('keeps index-identified items within their own list', () => {
    const kanban = defineComponent({
      components: { UtensilReorderableList },
      setup: () => {
        provideReorderableGroup()
      },
      template: `
        <UtensilReorderableList namespace="cards" class="source">
          <div>X</div>
        </UtensilReorderableList>
        <UtensilReorderableList namespace="cards" class="destination">
          <div data-reorderable-id="y">Y</div>
        </UtensilReorderableList>
      `,
    })
    wrapper = mount(kanban, { attachTo: document.body })
    const [source, destination] = wrapper.findAllComponents(UtensilReorderableList)
    exposed(source as VueWrapper).grab(0)
    pressKey('ArrowDown')
    expect(destination.emitted('moving')).toBeUndefined()
    pressKey('Escape')
  })
})
