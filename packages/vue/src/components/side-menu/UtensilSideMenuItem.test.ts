import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import type { IconProp } from '../../theme/utensil-theme'
import { sideMenuContextKey, type SideMenuMode } from './side-menu-keys'
import UtensilSideMenuItem from '../side-menu/UtensilSideMenuItem.vue'

function provideSideMenuContext(
  collapsed: boolean,
  mode: SideMenuMode = 'responsive',
  closeOnClick = false,
  close: () => void = () => {},
) {
  return {
    global: {
      provide: {
        [sideMenuContextKey as symbol]: {
          mode: ref(mode),
          collapsed: ref(collapsed),
          closeOnClick: ref(closeOnClick),
          close,
        },
      },
    },
  }
}

describe('UtensilSideMenuItem', () => {
  const item = {
    title: 'Test Item',
    icon: 'check' as IconProp,
  }

  it('renders item correctly', () => {
    const wrapper = mount(UtensilSideMenuItem, {
      props: { ...item },
    })

    expect(wrapper.text()).toContain('Test Item')
    expect(wrapper.find('.item-icon').exists()).toBe(true)
  })

  it('applies selected state correctly', () => {
    const wrapper = mount(UtensilSideMenuItem, {
      props: {
        ...item,
        selected: true,
      },
    })

    expect(wrapper.find('.utensil-side-item').classes()).toContain('selected')
  })

  it('applies disabled state correctly', () => {
    const wrapper = mount(UtensilSideMenuItem, {
      props: {
        ...item,
        disabled: true,
      },
    })

    expect(wrapper.find('.utensil-side-item').classes()).toContain('disabled')
  })

  it('calls click handler when clicked', async () => {
    const onClick = vi.fn()
    const wrapper = mount(UtensilSideMenuItem, {
      props: item,
      attrs: { onClick },
    })

    await wrapper.find('.utensil-side-item').trigger('click')
    expect(onClick).toHaveBeenCalled()
  })

  it('triggers click on Enter keydown', async () => {
    const onClick = vi.fn()
    const wrapper = mount(UtensilSideMenuItem, {
      props: item,
      attrs: { onClick },
    })

    await wrapper.find('.utensil-side-item').trigger('keydown.enter')
    expect(onClick).toHaveBeenCalled()
  })

  it('triggers click on Space keydown', async () => {
    const onClick = vi.fn()
    const wrapper = mount(UtensilSideMenuItem, {
      props: item,
      attrs: { onClick },
    })

    await wrapper.find('.utensil-side-item').trigger('keydown.space')
    expect(onClick).toHaveBeenCalled()
  })

  it('does not trigger click on Enter when disabled', async () => {
    const onClick = vi.fn()
    const wrapper = mount(UtensilSideMenuItem, {
      props: { ...item, disabled: true },
      attrs: { onClick },
    })

    await wrapper.find('.utensil-side-item').trigger('keydown.enter')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('disables tooltips when menu is not collapsed', () => {
    const wrapper = mount(UtensilSideMenuItem, {
      props: item,
      ...provideSideMenuContext(false),
    })

    const tooltip = wrapper.findComponent({ name: 'UtensilTooltip' })
    expect(tooltip.props('disabled')).toBe(true)
  })

  it('enables tooltips when menu is collapsed', () => {
    const wrapper = mount(UtensilSideMenuItem, {
      props: item,
      ...provideSideMenuContext(true),
    })

    const tooltip = wrapper.findComponent({ name: 'UtensilTooltip' })
    expect(tooltip.props('disabled')).toBe(false)
  })

  it('disables tooltips by default when no side menu context is provided', () => {
    const wrapper = mount(UtensilSideMenuItem, {
      props: item,
    })

    const tooltip = wrapper.findComponent({ name: 'UtensilTooltip' })
    expect(tooltip.props('disabled')).toBe(true)
  })

  it('closes the menu on click when the menu defaults closeOnClick', async () => {
    const close = vi.fn()
    const wrapper = mount(UtensilSideMenuItem, {
      props: item,
      ...provideSideMenuContext(false, 'responsive', true, close),
    })

    await wrapper.find('.utensil-side-item').trigger('click')
    expect(close).toHaveBeenCalled()
  })

  it('does not close the menu when the item opts out of the menu default', async () => {
    const close = vi.fn()
    const wrapper = mount(UtensilSideMenuItem, {
      props: { ...item, closeOnClick: false },
      ...provideSideMenuContext(false, 'responsive', true, close),
    })

    await wrapper.find('.utensil-side-item').trigger('click')
    expect(close).not.toHaveBeenCalled()
  })

  it('closes the menu when the item opts in against the menu default', async () => {
    const close = vi.fn()
    const wrapper = mount(UtensilSideMenuItem, {
      props: { ...item, closeOnClick: true },
      ...provideSideMenuContext(false, 'responsive', false, close),
    })

    await wrapper.find('.utensil-side-item').trigger('click')
    expect(close).toHaveBeenCalled()
  })
})
