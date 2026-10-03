import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilSideMenu from './UtensilSideMenu.vue'

beforeAll(() => {
  // UtensilScroller uses IntersectionObserver for envelope indicators
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver

  // UtensilSideMenu uses ResizeObserver to track container width
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

describe('UtensilSideMenu', () => {
  function mountMenu(props: Partial<InstanceType<typeof UtensilSideMenu>['$props']> = {}) {
    const container = document.createElement('div')
    Object.defineProperty(container, 'clientWidth', { value: 1024 })
    return mount(UtensilSideMenu, {
      props: { container, ...props },
      slots: {
        logo: '<span class="test-logo">Logo</span>',
        default: '<div class="test-content">Menu content</div>',
        footer: '<div class="test-footer">Footer</div>',
      },
    })
  }

  it('renders menu content', () => {
    const wrapper = mountMenu()

    expect(wrapper.find('.menu-content').exists()).toBe(true)
    expect(wrapper.find('.test-logo').exists()).toBe(true)
    expect(wrapper.find('.test-content').exists()).toBe(true)
    expect(wrapper.find('.test-footer').exists()).toBe(true)
  })

  it('applies aria-label to nav element', () => {
    const wrapper = mountMenu({ ariaLabel: 'Main navigation' })

    expect(wrapper.find('nav').attributes('aria-label')).toBe('Main navigation')
  })

  it('has a toggle button', () => {
    const wrapper = mountMenu()

    expect(wrapper.find('.menu-toggle').exists()).toBe(true)
  })

  it('exposes toggle, open, and close methods', () => {
    const wrapper = mountMenu()

    expect(typeof wrapper.vm.toggle).toBe('function')
    expect(typeof wrapper.vm.open).toBe('function')
    expect(typeof wrapper.vm.close).toBe('function')
  })
})
