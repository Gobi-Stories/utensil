import { describe, it, expect, vi, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { provideExclusiveView } from '../../composables/use-exclusive-view'
import UtensilDrawer from './UtensilDrawer.vue'

beforeAll(() => {
  // UtensilDrawer uses ResizeObserver to track container width reactively
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

function createContainer(width: number): HTMLElement {
  const container = document.createElement('div')
  vi.spyOn(container, 'clientWidth', 'get').mockReturnValue(width)
  return container
}

describe('UtensilDrawer', () => {
  it('renders slot content inside the drawer panel', () => {
    const wrapper = mount(UtensilDrawer, {
      slots: { default: '<div class="test-content">Hello</div>' },
    })

    expect(wrapper.find('.drawer-panel .test-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Hello')
  })

  it('applies position-start class by default', () => {
    const wrapper = mount(UtensilDrawer)

    expect(wrapper.find('.utensil-drawer').classes()).toContain('position-start')
  })

  it('applies position-end class when position is end', () => {
    const wrapper = mount(UtensilDrawer, {
      props: { position: 'end' },
    })

    expect(wrapper.find('.utensil-drawer').classes()).toContain('position-end')
  })

  it('applies aria-label attribute', () => {
    const wrapper = mount(UtensilDrawer, {
      props: { ariaLabel: 'Main navigation' },
    })

    expect(wrapper.find('.utensil-drawer').attributes('aria-label')).toBe('Main navigation')
  })

  it('sets CSS custom properties from width prop', () => {
    const wrapper = mount(UtensilDrawer, {
      props: { width: '300px' },
    })

    const style = wrapper.find('.utensil-drawer').attributes('style')
    expect(style).toContain('--utensil-drawer-width: 300px')
  })

  it('sets CSS custom properties from collapsedWidth prop', () => {
    const wrapper = mount(UtensilDrawer, {
      props: { collapsedWidth: '60px' },
    })

    const style = wrapper.find('.utensil-drawer').attributes('style')
    expect(style).toContain('--utensil-drawer-collapsed-width: 60px')
  })

  it('does not set CSS custom properties when width/collapsedWidth are not provided', () => {
    const wrapper = mount(UtensilDrawer)

    const style = wrapper.find('.utensil-drawer').attributes('style') ?? ''
    expect(style).not.toContain('--utensil-drawer-width')
    expect(style).not.toContain('--utensil-drawer-collapsed-width')
  })

  describe('state management', () => {
    it('initializes as responsive by default', async () => {
      const wrapper = mount(UtensilDrawer)

      await wrapper.vm.$nextTick()
      expect(wrapper.find('.utensil-drawer').classes()).toContain('responsive')
    })

    it('initializes as closed when startClosed prop is true', async () => {
      const wrapper = mount(UtensilDrawer, {
        props: { startClosed: true },
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.find('.utensil-drawer').classes()).toContain('closed')
    })
  })

  describe('toggle', () => {
    it('toggles between open and closed', async () => {
      const wrapper = mount(UtensilDrawer)

      wrapper.vm.open()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.utensil-drawer').classes()).toContain('open')

      wrapper.vm.toggle()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.utensil-drawer').classes()).toContain('closed')

      wrapper.vm.toggle()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.utensil-drawer').classes()).toContain('open')
    })

    it('opens when closed via startClosed', async () => {
      const wrapper = mount(UtensilDrawer, {
        props: { startClosed: true },
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.find('.utensil-drawer').classes()).toContain('closed')

      wrapper.vm.toggle()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.utensil-drawer').classes()).toContain('open')
    })

    it('opens from responsive at narrow viewport', async () => {
      const container = createContainer(600)
      const wrapper = mount(UtensilDrawer, {
        props: { container },
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.find('.utensil-drawer').classes()).toContain('responsive')

      wrapper.vm.toggle()
      await wrapper.vm.$nextTick()
      // Responsive at narrow viewport: toggle opens (overlay)
      expect(wrapper.find('.utensil-drawer').classes()).toContain('open')
    })

    it('closes from responsive at wide viewport', async () => {
      const container = createContainer(1000)
      const wrapper = mount(UtensilDrawer, {
        props: { container },
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.find('.utensil-drawer').classes()).toContain('responsive')

      wrapper.vm.toggle()
      await wrapper.vm.$nextTick()
      // Responsive at wide viewport: toggle closes (collapse)
      expect(wrapper.find('.utensil-drawer').classes()).toContain('closed')
    })
  })

  describe('open and close methods', () => {
    it('open sets mode to open', async () => {
      const wrapper = mount(UtensilDrawer)

      wrapper.vm.open()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.utensil-drawer').classes()).toContain('open')
    })

    it('close sets mode to closed at wide viewport', async () => {
      const container = createContainer(1000)
      const wrapper = mount(UtensilDrawer, {
        props: { container },
      })

      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      wrapper.vm.close()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.utensil-drawer').classes()).toContain('closed')
    })

    it('close sets mode to closed at narrow viewport', async () => {
      const container = createContainer(600)
      const wrapper = mount(UtensilDrawer, {
        props: { container },
      })

      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      wrapper.vm.close()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.utensil-drawer').classes()).toContain('closed')
    })

    it('close sticks across viewport widening', async () => {
      const container = createContainer(600)
      const wrapper = mount(UtensilDrawer, {
        props: { container },
      })

      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      wrapper.vm.close()
      await wrapper.vm.$nextTick()

      vi.spyOn(container, 'clientWidth', 'get').mockReturnValue(1000)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.utensil-drawer').classes()).toContain('closed')
    })
  })

  describe('exposed mode', () => {
    it('exposes mode as responsive by default', async () => {
      const wrapper = mount(UtensilDrawer)

      await wrapper.vm.$nextTick()
      expect(wrapper.vm.mode).toBe('responsive')
    })

    it('mode reflects state changes', async () => {
      const wrapper = mount(UtensilDrawer)

      wrapper.vm.open()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.mode).toBe('open')

      wrapper.vm.toggle()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.mode).toBe('closed')
    })
  })

  describe('open model', () => {
    it('follows the bound model', async () => {
      const wrapper = mount(UtensilDrawer, {
        props: { open: false },
      })

      expect(wrapper.find('.utensil-drawer').classes()).toContain('closed')

      await wrapper.setProps({ open: true })
      expect(wrapper.find('.utensil-drawer').classes()).toContain('open')

      await wrapper.setProps({ open: false })
      expect(wrapper.find('.utensil-drawer').classes()).toContain('closed')
    })

    it('starts open when the model is initially true', () => {
      const wrapper = mount(UtensilDrawer, {
        props: { open: true },
      })

      expect(wrapper.find('.utensil-drawer').classes()).toContain('open')
    })

    it('writes internal state changes back through the model', async () => {
      const wrapper = mount(UtensilDrawer, {
        props: { open: false },
      })

      wrapper.vm.open()
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('update:open')?.pop()).toEqual([true])

      wrapper.vm.close()
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('update:open')?.pop()).toEqual([false])
    })

    it('reports light dismiss through the model', async () => {
      const wrapper = mount(UtensilDrawer, {
        props: { overlay: 'always', open: true },
        attachTo: document.body,
      })

      const outside = document.createElement('button')
      document.body.appendChild(outside)
      outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true }))
      outside.remove()
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:open')?.pop()).toEqual([false])
      wrapper.unmount()
    })
  })

  describe('exclusive', () => {
    function mountExclusivePair() {
      const first = ref(false)
      const second = ref(false)
      const wrapper = mount(
        defineComponent({
          components: { UtensilDrawer },
          setup() {
            provideExclusiveView()
            return { first, second }
          },
          template: `
            <UtensilDrawer exclusive v-model:open="first" />
            <UtensilDrawer exclusive v-model:open="second" />
          `,
        }),
      )

      return { wrapper, first, second }
    }

    it('closes the other exclusive drawers when one opens', async () => {
      const { wrapper, first, second } = mountExclusivePair()

      first.value = true
      await wrapper.vm.$nextTick()
      expect(first.value).toBe(true)

      second.value = true
      await wrapper.vm.$nextTick()

      expect(first.value).toBe(false)
      expect(second.value).toBe(true)
    })

    it('leaves the opening drawer open', async () => {
      const { wrapper, first } = mountExclusivePair()

      first.value = true
      await wrapper.vm.$nextTick()
      first.value = true
      await wrapper.vm.$nextTick()

      expect(first.value).toBe(true)
    })
  })

  describe('layout variants', () => {
    it('applies the inline overlay class in place of the overlay mode', () => {
      const wrapper = mount(UtensilDrawer, {
        props: { inline: true, overlay: 'always' },
      })

      const classes = wrapper.find('.utensil-drawer').classes()
      expect(classes).toContain('overlay-inline')
      expect(classes).not.toContain('overlay-always')
    })

    it('applies mobile and full sheet classes for fullSheet', () => {
      const wrapper = mount(UtensilDrawer, {
        props: { fullSheet: true },
      })

      const classes = wrapper.find('.utensil-drawer').classes()
      expect(classes).toContain('mobile-sheet')
      expect(classes).toContain('full-sheet')
    })
  })

  describe('everOpened slot state', () => {
    it('stays false until the drawer first opens, then sticks through closes', async () => {
      const wrapper = mount(UtensilDrawer, {
        props: { startClosed: true },
        slots: {
          default: `<template #default="{ everOpened }"><div v-if="everOpened" class="lazy-content" /></template>`,
        },
      })

      expect(wrapper.find('.lazy-content').exists()).toBe(false)

      wrapper.vm.open()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.lazy-content').exists()).toBe(true)

      wrapper.vm.close()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.lazy-content').exists()).toBe(true)
    })
  })

  describe('light dismiss', () => {
    function pressOutside() {
      const outside = document.createElement('button')
      document.body.appendChild(outside)
      // MouseEvent stands in for PointerEvent, which the test DOM doesn't implement.
      outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true }))
      const click = new MouseEvent('click', { bubbles: true, cancelable: true })
      outside.dispatchEvent(click)
      outside.remove()
      return click
    }

    it('closes on an outside press and swallows the paired click', async () => {
      const wrapper = mount(UtensilDrawer, {
        props: { overlay: 'always' },
        attachTo: document.body,
      })
      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      const click = pressOutside()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.mode).toBe('closed')
      expect(click.defaultPrevented).toBe(true)
      wrapper.unmount()
    })

    it('does not swallow clicks once the drawer is closed', async () => {
      const wrapper = mount(UtensilDrawer, {
        props: { overlay: 'always' },
        attachTo: document.body,
      })
      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      pressOutside()
      await wrapper.vm.$nextTick()
      const secondClick = pressOutside()

      expect(secondClick.defaultPrevented).toBe(false)
      wrapper.unmount()
    })

    it('closes without swallowing the press when lightDismissThrough is set', async () => {
      const wrapper = mount(UtensilDrawer, {
        props: { overlay: 'always', lightDismissThrough: true },
        attachTo: document.body,
      })
      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      const click = pressOutside()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.mode).toBe('closed')
      expect(click.defaultPrevented).toBe(false)
      wrapper.unmount()
    })

    it('never dismisses when lightDismiss is never', async () => {
      const wrapper = mount(UtensilDrawer, {
        props: { overlay: 'always', lightDismiss: 'never' },
        attachTo: document.body,
      })
      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      const click = pressOutside()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.mode).toBe('open')
      expect(click.defaultPrevented).toBe(false)
      wrapper.unmount()
    })
  })

  describe('keyboard', () => {
    function pressEscape(target: Element) {
      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
      target.dispatchEvent(event)
      return event
    }

    it('takes a drawer closed out of sight out of reach, but leaves a collapsed strip usable', async () => {
      const overlaying = mount(UtensilDrawer, { props: { overlay: 'always', startClosed: true } })
      const collapsed = mount(UtensilDrawer, { props: { startClosed: true, collapsedWidth: '48px' } })

      expect(overlaying.find('.drawer-panel').attributes('inert')).toBeDefined()
      expect(collapsed.find('.drawer-panel').attributes('inert')).toBeUndefined()

      overlaying.vm.open()
      await overlaying.vm.$nextTick()

      expect(overlaying.find('.drawer-panel').attributes('inert')).toBeUndefined()
    })

    it('closes on Escape pressed within it, fields included, when closeOnEscape is set', async () => {
      const wrapper = mount(UtensilDrawer, {
        props: { overlay: 'always', closeOnEscape: true },
        slots: { default: '<input class="field" />' },
        attachTo: document.body,
      })
      wrapper.vm.open()
      await wrapper.vm.$nextTick()

      const event = pressEscape(wrapper.find('.field').element)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.mode).toBe('closed')
      expect(event.defaultPrevented).toBe(true)
      wrapper.unmount()
    })

    it('leaves Escape alone without closeOnEscape, or once an inner element has handled it', async () => {
      const plain = mount(UtensilDrawer, { props: { overlay: 'always' }, attachTo: document.body })
      const handled = mount(UtensilDrawer, {
        props: { overlay: 'always', closeOnEscape: true },
        slots: { default: '<button class="inner" @keydown.esc.prevent />' },
        attachTo: document.body,
      })
      plain.vm.open()
      handled.vm.open()
      await plain.vm.$nextTick()

      const event = pressEscape(plain.find('.drawer-panel').element)
      pressEscape(handled.find('.inner').element)
      await plain.vm.$nextTick()

      expect(plain.vm.mode).toBe('open')
      expect(event.defaultPrevented).toBe(false)
      expect(handled.vm.mode).toBe('open')
      plain.unmount()
      handled.unmount()
    })

    it('moves focus into itself on opening when focusOnOpen is set', async () => {
      const wrapper = mount(UtensilDrawer, {
        props: { overlay: 'always', startClosed: true, focusOnOpen: true },
        attachTo: document.body,
      })

      wrapper.vm.open()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      expect(document.activeElement).toBe(wrapper.find('.drawer-panel').element)
      wrapper.unmount()
    })
  })
})
