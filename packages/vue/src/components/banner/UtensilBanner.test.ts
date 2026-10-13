import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, ref } from 'vue'
import UtensilTheme from '../../theme/UtensilTheme.vue'
import type { ThemeConfig, UtensilColors } from '../../theme/utensil-theme'
import UtensilBanner from './UtensilBanner.vue'

// Utensil's default theme maps every variant to gray; a theme with an orange warning tells the pens apart
interface TestThemeConfig extends ThemeConfig {
  color: UtensilColors & { orange: true }
}

const TestTheme = UtensilTheme<TestThemeConfig>

describe('UtensilBanner', () => {
  it('is a labelled region at the top, on a surface, by default', () => {
    const region = mount(UtensilBanner, { props: { label: 'Announcement' } }).find('.utensil-banner')
    expect(region.element.tagName).toBe('SECTION')
    expect(region.attributes('aria-label')).toBe('Announcement')
    expect(region.classes()).toContain('top')
    expect(region.find('.utensil-banner-body').classes()).toContain('ui-surface')
  })

  it('attaches to the bottom edge', () => {
    const region = mount(UtensilBanner, { props: { label: 'Announcement', position: 'bottom' } }).find(
      '.utensil-banner',
    )
    expect(region.classes()).toContain('bottom')
    expect(region.classes()).not.toContain('top')
  })

  it('applies its variation', () => {
    const wrapper = mount(UtensilBanner, { props: { label: 'Announcement', variation: 'soft' } })
    expect(wrapper.find('.utensil-banner-body').classes()).toContain('ui-soft')
  })

  it('takes its color as its pen', () => {
    const banner = (color?: 'warning') =>
      mount({
        setup: () => () =>
          h(TestTheme, { variants: { warning: 'orange' } }, () => h(UtensilBanner, { label: 'Announcement', color })),
      }).find('.utensil-banner')

    expect(banner('warning').classes()).not.toEqual(banner().classes())
  })

  it('keeps the classes and attributes its owner gives it on its region', () => {
    const region = mount(UtensilBanner, {
      props: { label: 'Announcement' },
      attrs: { class: 'page-banner', 'data-test': 'banner' },
    }).find('.utensil-banner')
    expect(region.classes()).toContain('page-banner')
    expect(region.attributes('data-test')).toBe('banner')
  })

  it('renders its content and actions', () => {
    const wrapper = mount(UtensilBanner, {
      props: { label: 'Announcement' },
      slots: { default: '<p>News</p>', actions: '<button>Read</button>' },
    })
    expect(wrapper.find('.utensil-banner-content p').text()).toBe('News')
    expect(wrapper.find('.utensil-banner-actions button').text()).toBe('Read')
  })

  it('renders only the parts it is given', () => {
    const wrapper = mount(UtensilBanner, { props: { label: 'Announcement' }, slots: { default: 'News' } })
    expect(wrapper.find('.utensil-banner-actions').exists()).toBe(false)
    expect(wrapper.find('.utensil-banner-icon').exists()).toBe(false)
    expect(wrapper.find('.utensil-banner-dismiss').exists()).toBe(false)
  })

  it('keeps its icon beside its content, wrapping together', () => {
    const wrapper = mount(UtensilBanner, {
      props: { label: 'Announcement', icon: 'exclamation-triangle' },
      slots: { default: 'News' },
    })
    const message = wrapper.find('.utensil-banner-message')
    expect(message.find('.utensil-banner-icon').exists()).toBe(true)
    expect(message.find('.utensil-banner-content').text()).toBe('News')
  })

  it('keeps its close button beside the message, outside the actions that wrap below it', () => {
    const wrapper = mount(UtensilBanner, {
      props: { label: 'Announcement', dismissible: true },
      slots: { default: 'News', actions: '<button>Read</button>' },
    })
    expect(wrapper.find('.utensil-banner-main .utensil-banner-actions').exists()).toBe(true)
    expect(wrapper.find('.utensil-banner-main .utensil-banner-dismiss').exists()).toBe(false)
    expect(wrapper.find('.utensil-banner-body > .utensil-banner-dismiss').exists()).toBe(true)
  })

  it('announces its content only when given a role, keeping its region', () => {
    const quiet = mount(UtensilBanner, { props: { label: 'Announcement' }, slots: { default: 'News' } })
    expect(quiet.find('.utensil-banner-content').attributes('role')).toBeUndefined()

    const alert = mount(UtensilBanner, {
      props: { label: 'Outage', role: 'alert' },
      slots: { default: 'Down' },
    }).find('.utensil-banner')
    expect(alert.attributes('role')).toBeUndefined()
    expect(alert.attributes('aria-label')).toBe('Outage')
    expect(alert.find('.utensil-banner-content').attributes('role')).toBe('alert')
  })

  it('closes itself and emits dismiss from its labelled close button', async () => {
    const wrapper = mount(UtensilBanner, {
      props: { label: 'Announcement', dismissible: true, dismissLabel: 'Not now' },
    })
    const dismiss = wrapper.find('.utensil-banner-dismiss')
    expect(dismiss.text()).toBe('Not now')

    await dismiss.trigger('click')

    expect(wrapper.emitted('dismiss')).toHaveLength(1)
    expect(wrapper.emitted('update:open')).toEqual([[false]])
    expect(wrapper.find('.utensil-banner').exists()).toBe(false)
  })

  it('follows v-model:open', async () => {
    const open = ref(true)
    const wrapper = mount({
      setup: () => () =>
        h(UtensilBanner, {
          label: 'Announcement',
          dismissible: true,
          open: open.value,
          'onUpdate:open': (value: boolean) => (open.value = value),
        }),
    })

    await wrapper.find('.utensil-banner-dismiss').trigger('click')
    expect(open.value).toBe(false)
    expect(wrapper.find('.utensil-banner').exists()).toBe(false)

    open.value = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.utensil-banner').exists()).toBe(true)
  })

  it('stays open while its owner holds it open', async () => {
    const wrapper = mount(UtensilBanner, { props: { label: 'Announcement', dismissible: true, open: true } })

    await wrapper.find('.utensil-banner-dismiss').trigger('click')

    expect(wrapper.emitted('dismiss')).toHaveLength(1)
    expect(wrapper.find('.utensil-banner').exists()).toBe(true)
  })

  it('never takes focus when it appears', () => {
    const wrapper = mount(UtensilBanner, {
      props: { label: 'Announcement', dismissible: true },
      slots: { actions: '<button>Read</button>' },
      attachTo: document.body,
    })
    expect(wrapper.element.contains(document.activeElement)).toBe(false)
    wrapper.unmount()
  })

  it('lays its parts out in one row unless centered, when the content sits between its edges', () => {
    const plain = mount(UtensilBanner, {
      props: { label: 'Announcement', dismissible: true },
      slots: { default: 'News' },
    })
    expect(plain.find('.utensil-banner-body').classes()).not.toContain('centered')

    const centered = mount(UtensilBanner, {
      props: { label: 'Announcement', dismissible: true, centered: true },
      slots: { default: 'News', actions: '<button>Read</button>' },
    })
    expect(centered.find('.utensil-banner-body').classes()).toContain('centered')
    expect(centered.find('.utensil-banner-end .utensil-banner-actions').exists()).toBe(true)
    expect(centered.find('.utensil-banner-body > .utensil-banner-dismiss').exists()).toBe(true)
  })
})
