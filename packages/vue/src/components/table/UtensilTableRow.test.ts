import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilTableRow from './UtensilTableRow.vue'

describe('UtensilTableRow', () => {
  it('renders its cells as a row', () => {
    const wrapper = mount(UtensilTableRow, { slots: { default: '<span>Cell</span>' } })
    expect(wrapper.attributes('role')).toBe('row')
    expect(wrapper.text()).toBe('Cell')
  })

  it('emits click only when interactive', async () => {
    const plain = mount(UtensilTableRow)
    await plain.trigger('click')
    expect(plain.emitted('click')).toBeUndefined()

    const interactive = mount(UtensilTableRow, { props: { interactive: true } })
    await interactive.trigger('click')
    await interactive.trigger('keydown', { key: 'Enter' })
    expect(interactive.emitted('click')).toHaveLength(2)
  })

  it('is focusable only when interactive', () => {
    expect(mount(UtensilTableRow).attributes('tabindex')).toBe('-1')
    expect(mount(UtensilTableRow, { props: { interactive: true } }).attributes('tabindex')).toBe('0')
  })

  it('keeps a row link as a real link, untouched', () => {
    const wrapper = mount(UtensilTableRow, {
      slots: { default: '<a class="utensil-table-row-link" href="/stories/1">Story</a><span>12</span>' },
    })
    const link = wrapper.find('a.utensil-table-row-link')
    expect(link.attributes('href')).toBe('/stories/1')
    expect(wrapper.attributes('tabindex')).toBe('-1')
  })

  it('applies the variant class', () => {
    expect(mount(UtensilTableRow, { props: { variant: 'muted' } }).classes()).toContain('v-muted')
  })

  it("keeps Enter and Space from pressing what takes focus when it's chosen", () => {
    const wrapper = mount(UtensilTableRow, { props: { interactive: true } })
    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
    const space = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })

    wrapper.element.dispatchEvent(enter)
    wrapper.element.dispatchEvent(space)

    expect(enter.defaultPrevented).toBe(true)
    expect(space.defaultPrevented).toBe(true)
    expect(wrapper.emitted('click')).toHaveLength(2)
  })

  it('leaves Enter and Space to a link or control in the row', () => {
    const wrapper = mount(UtensilTableRow, {
      props: { interactive: true },
      slots: { default: '<a class="utensil-table-row-link" href="/stories/1">Story</a><button>Menu</button>' },
    })
    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
    const space = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })

    wrapper.find('a').element.dispatchEvent(enter)
    wrapper.find('button').element.dispatchEvent(space)

    expect(enter.defaultPrevented).toBe(false)
    expect(space.defaultPrevented).toBe(false)
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
