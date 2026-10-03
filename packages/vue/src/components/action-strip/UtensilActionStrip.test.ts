import { describe, it, expect, vi, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilActionStrip from './UtensilActionStrip.vue'

beforeAll(() => {
  // UtensilScroller uses IntersectionObserver for envelope indicators;
  // UtensilActionStrip uses ResizeObserver to track container width
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver

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

describe('UtensilActionStrip', () => {
  it('renders slotted items inside a labelled nav at wide widths', () => {
    const wrapper = mount(UtensilActionStrip, {
      props: { ariaLabel: 'Main navigation', container: createContainer(1000) },
      slots: { default: '<span class="probe">Item</span>' },
    })

    expect(wrapper.find('nav').attributes('aria-label')).toBe('Main navigation')
    expect(wrapper.find('.strip-items .probe').exists()).toBe(true)
    expect(wrapper.find('.sheet-form').exists()).toBe(false)
  })

  it('renders header and footer only when slotted', () => {
    const empty = mount(UtensilActionStrip, {
      props: { container: createContainer(1000) },
    })
    expect(empty.find('.strip-header').exists()).toBe(false)
    expect(empty.find('.strip-footer').exists()).toBe(false)

    const full = mount(UtensilActionStrip, {
      props: { container: createContainer(1000) },
      slots: { header: '<span class="logo-probe" />', footer: '<span class="footer-probe" />' },
    })
    expect(full.find('.strip-header .logo-probe').exists()).toBe(true)
    expect(full.find('.strip-footer .footer-probe').exists()).toBe(true)
  })

  it('hides the strip at sheet widths until opened', () => {
    const wrapper = mount(UtensilActionStrip, {
      props: { container: createContainer(400) },
      slots: { default: '<span class="probe">Item</span>' },
    })

    expect(wrapper.find('nav').exists()).toBe(false)
    expect(wrapper.find('.sheet-form').exists()).toBe(false)
  })

  it('presents the items as a sheet grid when open at sheet widths', () => {
    const wrapper = mount(UtensilActionStrip, {
      props: { container: createContainer(400), open: true, title: 'Actions', ariaLabel: 'Actions' },
      slots: { default: '<span class="probe">Item</span>', sheet: '<span class="sheet-probe" />' },
    })

    const sheet = wrapper.find('.sheet-form')
    expect(sheet.exists()).toBe(true)
    expect(sheet.attributes('role')).toBe('dialog')
    expect(sheet.find('.sheet-grid .probe').exists()).toBe(true)
    expect(sheet.find('.sheet-probe').exists()).toBe(true)
    expect(sheet.text()).toContain('Actions')
  })

  it('closes the sheet through the model from the close button', async () => {
    const wrapper = mount(UtensilActionStrip, {
      props: { container: createContainer(400), open: true },
    })

    await wrapper.find('.sheet-header button').trigger('click')

    expect(wrapper.emitted('update:open')?.pop()).toEqual([false])
  })

  it('closes a left-open sheet when leaving sheet widths', async () => {
    const wrapper = mount(UtensilActionStrip, {
      props: { container: createContainer(400), open: true },
    })

    expect(wrapper.find('.sheet-form').exists()).toBe(true)

    await wrapper.setProps({ container: createContainer(1000) })
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:open')?.pop()).toEqual([false])
  })
})
