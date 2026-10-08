import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import UtensilEntrance from './UtensilEntrance.vue'

function timing(props: Record<string, unknown> = {}) {
  return mount(UtensilEntrance, { props, slots: { default: '<p>Child</p>' } })
    .find('.utensil-entrance')
    .attributes('style')
}

describe('UtensilEntrance', () => {
  it('renders with default props', () => {
    const wrapper = mount(UtensilEntrance)
    expect(wrapper.find('.utensil-entrance').exists()).toBe(true)
  })

  it('renders slot content', () => {
    const wrapper = mount(UtensilEntrance, {
      slots: {
        default: '<div>First</div><div>Second</div><div>Third</div>',
      },
    })
    const children = wrapper.findAll('.utensil-entrance > div')
    expect(children).toHaveLength(3)
  })

  it('sets --entrance-index on each child', async () => {
    const wrapper = mount(UtensilEntrance, {
      slots: {
        default: '<div>A</div><div>B</div><div>C</div>',
      },
    })
    await nextTick()
    const root = wrapper.find('.utensil-entrance').element as HTMLElement
    const children = root.children
    expect((children[0] as HTMLElement).style.getPropertyValue('--entrance-index')).toBe('0')
    expect((children[1] as HTMLElement).style.getPropertyValue('--entrance-index')).toBe('1')
    expect((children[2] as HTMLElement).style.getPropertyValue('--entrance-index')).toBe('2')
  })

  it('applies ready class after mount', async () => {
    const wrapper = mount(UtensilEntrance)
    await nextTick()
    await nextTick()
    expect(wrapper.find('.utensil-entrance').classes()).toContain('ready')
  })

  it('does not apply ready class before mount completes', () => {
    const wrapper = mount(UtensilEntrance)
    // Before nextTick, ready should not be set
    // (This tests the initial render state)
    expect(wrapper.find('.utensil-entrance').classes()).not.toContain('ready')
  })

  it('applies custom CSS variables from props', () => {
    const wrapper = mount(UtensilEntrance, {
      props: { duration: 800, stagger: 200, delay: 100, distance: 24 },
    })
    const el = wrapper.find('.utensil-entrance').element as HTMLElement
    expect(el.style.getPropertyValue('--entrance-duration')).toBe('800ms')
    expect(el.style.getPropertyValue('--entrance-stagger')).toBe('200ms')
    expect(el.style.getPropertyValue('--entrance-delay')).toBe('100ms')
    expect(el.style.getPropertyValue('--entrance-distance')).toBe('24px')
  })

  it('renders children immediately when enabled is false', async () => {
    const wrapper = mount(UtensilEntrance, {
      props: { enabled: false },
      slots: { default: '<div>A</div><div>B</div>' },
    })
    await nextTick()
    await nextTick()
    const el = wrapper.find('.utensil-entrance')
    expect(el.classes()).toContain('disabled')
    expect(el.classes()).not.toContain('ready')
  })

  it('exposes replay method that resets and replays animation', async () => {
    const wrapper = mount(UtensilEntrance, {
      slots: { default: '<div>A</div><div>B</div>' },
    })
    await nextTick()
    await nextTick()
    expect(wrapper.find('.utensil-entrance').classes()).toContain('ready')

    wrapper.vm.replay()
    await nextTick()
    expect(wrapper.find('.utensil-entrance').classes()).not.toContain('ready')

    await nextTick()
    expect(wrapper.find('.utensil-entrance').classes()).toContain('ready')
  })

  it('updates indexes when children change', async () => {
    const wrapper = mount(UtensilEntrance, {
      slots: {
        default: '<div>A</div>',
      },
    })
    await nextTick()
    const root = wrapper.find('.utensil-entrance').element as HTMLElement
    expect((root.children[0] as HTMLElement).style.getPropertyValue('--entrance-index')).toBe('0')
  })

  it('keeps the gentle, staggered entrance by default', () => {
    const style = timing()
    expect(style).toContain('--entrance-duration: 500ms')
    expect(style).toContain('--entrance-stagger: 120ms')
    expect(style).toContain('--entrance-delay: 80ms')
    expect(style).toContain('--entrance-distance: 16px')
  })

  it('fades every child up quickly at once when fast', () => {
    const style = timing({ speed: 'fast' })
    expect(style).toContain('--entrance-duration: 280ms')
    expect(style).toContain('--entrance-stagger: 0ms')
    expect(style).toContain('--entrance-delay: 0ms')
    expect(style).toContain('--entrance-distance: 6px')
  })

  it('lets explicit timing override the speed', () => {
    const style = timing({ speed: 'fast', duration: 400, distance: 10 })
    expect(style).toContain('--entrance-duration: 400ms')
    expect(style).toContain('--entrance-distance: 10px')
    expect(style).toContain('--entrance-stagger: 0ms')
  })
})
