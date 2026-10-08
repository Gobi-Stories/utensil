import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import UtensilCard from './UtensilCard.vue'

describe('UtensilCard', () => {
  it('is a surface box', () => {
    const wrapper = mount(UtensilCard)
    expect(wrapper.classes()).toContain('utensil-card')
    expect(wrapper.classes()).toContain('utensil-box')
    expect(wrapper.classes()).toContain('ui-surface')
  })

  it('passes box props through', () => {
    const wrapper = mount(UtensilCard, {
      props: { variation: 'soft', interactive: true, highlighted: true, as: 'button' },
    })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.classes()).toContain('ui-soft')
    expect(wrapper.classes()).toContain('interactive')
    expect(wrapper.classes()).not.toContain('pencil')
  })

  it('renders only the parts it is given', () => {
    const wrapper = mount(UtensilCard, { slots: { default: '<p>Content</p>' } })
    expect(wrapper.find('.utensil-card-content p').text()).toBe('Content')
    expect(wrapper.find('.utensil-card-header').exists()).toBe(false)
    expect(wrapper.find('.utensil-card-media').exists()).toBe(false)
    expect(wrapper.find('.utensil-card-footer').exists()).toBe(false)
  })

  it('renders a header from its title and description', () => {
    const wrapper = mount(UtensilCard, { props: { title: 'Title', description: 'Description' } })
    expect(wrapper.find('.utensil-card-title').text()).toBe('Title')
    expect(wrapper.find('.utensil-card-description').text()).toBe('Description')
    expect(wrapper.find('.utensil-card-icon').exists()).toBe(false)
  })

  it('replaces the header with the header slot, keeping header-end', () => {
    const wrapper = mount(UtensilCard, {
      props: { title: 'Title' },
      slots: { header: '<h2>Custom</h2>', 'header-end': '<button>Menu</button>' },
    })
    expect(wrapper.find('.utensil-card-header h2').text()).toBe('Custom')
    expect(wrapper.find('.utensil-card-title').exists()).toBe(false)
    expect(wrapper.find('.utensil-card-header-end button').text()).toBe('Menu')
  })

  it('renders media before the header', () => {
    const wrapper = mount(UtensilCard, { props: { title: 'Title' }, slots: { media: '<img alt="" />' } })
    const parts = wrapper.findAll('.utensil-card > div').map((part) => part.classes()[0])
    expect(parts).toEqual(['utensil-card-media', 'utensil-card-header'])
  })

  it('renders a footer for footer or actions', () => {
    const footer = mount(UtensilCard, { slots: { footer: '<span>Meta</span>' } })
    expect(footer.find('.utensil-card-footer-start span').text()).toBe('Meta')
    expect(footer.find('.utensil-card-actions').exists()).toBe(false)

    const actions = mount(UtensilCard, { slots: { actions: '<button>Save</button>' } })
    expect(actions.find('.utensil-card-actions button').text()).toBe('Save')
  })

  it('renders the header when a header slot arrives after mount', async () => {
    const withMenu = ref(false)
    const Host = defineComponent(
      () => () =>
        h(UtensilCard, null, {
          default: () => 'Content',
          ...(withMenu.value ? { 'header-end': () => h('button', 'Menu') } : {}),
        }),
    )
    const wrapper = mount(Host)
    expect(wrapper.find('.utensil-card-header').exists()).toBe(false)

    withMenu.value = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.utensil-card-header-end button').text()).toBe('Menu')
  })

  it('renders the title in the element that fits the outline', () => {
    expect(mount(UtensilCard, { props: { title: 'Title' } }).find('.utensil-card-title').element.tagName).toBe('DIV')
    const heading = mount(UtensilCard, { props: { title: 'Title', titleElement: 'h2' } })
    expect(heading.find('h2.utensil-card-title').text()).toBe('Title')
  })

  it('passes clickable, disabled and shadow to its box', () => {
    const wrapper = mount(UtensilCard, { props: { clickable: true, disabled: true, shadow: 2 } })
    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.classes()).toContain('shadowed')
  })

  it('passes elevation and selected to its box', () => {
    const wrapper = mount(UtensilCard, { props: { as: 'button', elevation: 3, selected: true } })
    expect(wrapper.classes()).toContain('elevated')
    expect(wrapper.classes()).toContain('selected')
    expect(wrapper.attributes('aria-pressed')).toBe('true')
  })

  it('renders the title slot in the title element, for a link or other markup', () => {
    const wrapper = mount(UtensilCard, {
      props: { titleElement: 'h3', description: 'Description' },
      slots: { title: '<a class="utensil-card-link" href="/report">Report</a>' },
    })
    expect(wrapper.find('h3.utensil-card-title a.utensil-card-link').text()).toBe('Report')
    expect(wrapper.find('.utensil-card-description').text()).toBe('Description')
  })

  it('bleeds media to the edges and divides the footer when asked', () => {
    const plain = mount(UtensilCard, { slots: { media: '<img alt="" />', footer: 'Meta' } })
    expect(plain.classes()).not.toContain('media-bleed')
    expect(plain.classes()).not.toContain('footer-divider')

    const wrapper = mount(UtensilCard, {
      props: { mediaBleed: true, footerDivider: true },
      slots: { media: '<img alt="" />', footer: 'Meta' },
    })
    expect(wrapper.classes()).toContain('media-bleed')
    expect(wrapper.classes()).toContain('footer-divider')
  })
})
