import { describe, it, expect, vi, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import UtensilSelect from './UtensilSelect.vue'
import type { SelectOption } from './utensil-select'

const options: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

beforeAll(() => {
  // jsdom lacks the Popover API, ResizeObserver and scrollIntoView
  HTMLElement.prototype.showPopover = vi.fn()
  HTMLElement.prototype.hidePopover = vi.fn()
  HTMLElement.prototype.scrollIntoView = vi.fn()
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    },
  )
})

function trigger(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('.utensil-select-trigger')
}

describe('UtensilSelect', () => {
  it('renders the trigger as a select-only combobox controlling its listbox', () => {
    const wrapper = mount(UtensilSelect, { props: { options } })
    const button = trigger(wrapper)
    expect(button.attributes('role')).toBe('combobox')
    expect(button.attributes('aria-haspopup')).toBe('listbox')
    expect(button.attributes('aria-expanded')).toBe('false')
    const listbox = wrapper.find('[role="listbox"]')
    expect(button.attributes('aria-controls')).toBe(listbox.attributes('id'))
  })

  it('is named by its visible label, leaving the chosen option as its text', () => {
    const wrapper = mount(UtensilSelect, {
      props: { options, label: 'Fruit', ariaLabel: 'Ignored', modelValue: 'banana' },
    })
    const label = wrapper.find('.utensil-select-label')
    const button = trigger(wrapper)
    expect(button.attributes('aria-labelledby')).toBe(label.attributes('id'))
    expect(button.attributes('aria-label')).toBeUndefined()
    expect(button.find('.select-value').text()).toBe('Banana')
    expect(wrapper.find('[role="listbox"]').attributes('aria-labelledby')).toBe(label.attributes('id'))
  })

  it('falls back to ariaLabel without a visible label', () => {
    const wrapper = mount(UtensilSelect, { props: { options, ariaLabel: 'Fruit' } })
    expect(trigger(wrapper).attributes('aria-label')).toBe('Fruit')
    expect(trigger(wrapper).attributes('aria-labelledby')).toBeUndefined()
    expect(wrapper.find('[role="listbox"]').attributes('aria-label')).toBe('Fruit')
  })

  it('gives every option an id, keeps it focusable for the accessibility tree and marks the chosen one', () => {
    const wrapper = mount(UtensilSelect, { props: { options, modelValue: 'cherry' } })
    const rendered = wrapper.findAll('[role="option"]')
    expect(rendered).toHaveLength(3)
    const ids = rendered.map((option) => option.attributes('id'))
    expect(new Set(ids).size).toBe(3)
    expect(rendered.map((option) => option.attributes('tabindex'))).toEqual(['-1', '-1', '-1'])
    expect(rendered.map((option) => option.attributes('aria-selected'))).toEqual(['false', 'false', 'true'])
  })

  it('keeps DOM focus on the trigger when an option is pressed', () => {
    const wrapper = mount(UtensilSelect, { props: { options } })
    const event = new MouseEvent('mousedown', { cancelable: true, bubbles: true })
    wrapper.find('[role="option"]').element.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
  })

  it('points aria-activedescendant at the focused option while open', async () => {
    const wrapper = mount(UtensilSelect, { props: { options, modelValue: 'banana' }, attachTo: document.body })
    const button = trigger(wrapper)
    expect(button.attributes('aria-activedescendant')).toBeUndefined()

    await button.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await nextTick()
    const banana = wrapper.findAll('[role="option"]')[1]
    expect(button.attributes('aria-expanded')).toBe('true')
    expect(button.attributes('aria-activedescendant')).toBe(banana.attributes('id'))

    await button.trigger('keydown', { key: 'ArrowDown' })
    const cherry = wrapper.findAll('[role="option"]')[2]
    expect(button.attributes('aria-activedescendant')).toBe(cherry.attributes('id'))

    await button.trigger('keydown', { key: 'Escape' })
    expect(button.attributes('aria-activedescendant')).toBeUndefined()
    wrapper.unmount()
  })

  it('selects an option pressed by its node', async () => {
    const wrapper = mount(UtensilSelect, { props: { options } })
    await wrapper.findAll('[role="option"]')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['cherry'])
  })

  it('marks the listbox multiselectable and every chosen option in multiple mode', async () => {
    const wrapper = mount(UtensilSelect, {
      props: { options, multiple: true, selection: ['apple', 'cherry'] },
    })
    expect(wrapper.find('[role="listbox"]').attributes('aria-multiselectable')).toBe('true')
    const selected = wrapper.findAll('[role="option"]').map((option) => option.attributes('aria-selected'))
    expect(selected).toEqual(['true', 'false', 'true'])
    expect(trigger(wrapper).find('.select-value').text()).toBe('Apple, Cherry')
  })

  it('leaves aria-multiselectable off a single select', () => {
    const wrapper = mount(UtensilSelect, { props: { options } })
    expect(wrapper.find('[role="listbox"]').attributes('aria-multiselectable')).toBeUndefined()
  })
})
