import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilUserProfileCard from './UtensilUserProfileCard.vue'

describe('UtensilUserProfileCard', () => {
  it('renders the name and email', () => {
    const wrapper = mount(UtensilUserProfileCard, {
      props: { name: 'Sofia Chen', email: 'sofia.chen@example.com' },
    })

    expect(wrapper.find('.profile-name').text()).toBe('Sofia Chen')
    expect(wrapper.find('.profile-email').text()).toBe('sofia.chen@example.com')
  })

  it('omits the email row when no email is given', () => {
    const wrapper = mount(UtensilUserProfileCard, { props: { name: 'Sofia Chen' } })

    expect(wrapper.find('.profile-email').exists()).toBe(false)
  })

  it('renders a surface card by default and unstyled without a border', async () => {
    const wrapper = mount(UtensilUserProfileCard, { props: { name: 'Sofia Chen' } })
    expect(wrapper.find('.utensil-card').classes()).toContain('ui-surface')

    await wrapper.setProps({ bordered: false })
    expect(wrapper.find('.utensil-card').classes()).toContain('ui-unstyled')
  })

  it('shows the avatar fallback initials', () => {
    const wrapper = mount(UtensilUserProfileCard, {
      props: { name: 'Sofia Chen', fallback: 'SC' },
    })

    expect(wrapper.find('.utensil-avatar-fallback').text()).toBe('SC')
  })

  it('labels the avatar with the name when no alt is given', () => {
    const wrapper = mount(UtensilUserProfileCard, {
      props: { name: 'Sofia Chen', fallback: 'SC' },
    })

    expect(wrapper.find('.utensil-avatar').attributes('aria-label')).toBe('Sofia Chen')
  })

  it('replaces the avatar via the avatar slot', () => {
    const wrapper = mount(UtensilUserProfileCard, {
      props: { name: 'Sofia Chen' },
      slots: { avatar: '<span class="custom-avatar">CA</span>' },
    })

    expect(wrapper.find('.custom-avatar').exists()).toBe(true)
    expect(wrapper.find('.utensil-avatar').exists()).toBe(false)
  })

  it('renders bottom content in the default slot', () => {
    const wrapper = mount(UtensilUserProfileCard, {
      props: { name: 'Sofia Chen' },
      slots: { default: '<span class="role-badge">Admin</span>' },
    })

    expect(wrapper.find('.profile-bottom .role-badge').text()).toBe('Admin')
  })
})
