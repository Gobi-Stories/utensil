import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilSkeleton from './UtensilSkeleton.vue'

describe('UtensilSkeleton', () => {
  it('renders with default props', () => {
    const wrapper = mount(UtensilSkeleton)
    const el = wrapper.find('.utensil-skeleton')
    expect(el.exists()).toBe(true)
    expect(el.attributes('role')).toBe('status')
    expect(el.attributes('aria-busy')).toBe('true')
    expect(el.attributes('aria-label')).toBe('Loading...')
  })

  it('applies custom width and height', () => {
    const wrapper = mount(UtensilSkeleton, { props: { width: '200px', height: '20px' } })
    const el = wrapper.find('.utensil-skeleton')
    expect(el.attributes('style')).toContain('width: 200px')
    expect(el.attributes('style')).toContain('height: 20px')
  })

  it('applies circle class when circle prop is true', () => {
    const wrapper = mount(UtensilSkeleton, { props: { circle: true } })
    expect(wrapper.find('.utensil-skeleton').classes()).toContain('circle')
  })

  it('applies rounded class when rounded prop is true', () => {
    const wrapper = mount(UtensilSkeleton, { props: { rounded: true } })
    expect(wrapper.find('.utensil-skeleton').classes()).toContain('rounded')
  })

  it('accepts custom aria-label', () => {
    const wrapper = mount(UtensilSkeleton, { props: { ariaLabel: 'Loading content' } })
    expect(wrapper.find('.utensil-skeleton').attributes('aria-label')).toBe('Loading content')
  })

  it('renders shimmer element', () => {
    const wrapper = mount(UtensilSkeleton)
    expect(wrapper.find('.shimmer').exists()).toBe(true)
  })
})
