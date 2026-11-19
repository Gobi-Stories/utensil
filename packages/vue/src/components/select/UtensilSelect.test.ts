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

  it('never chooses a disabled option, though the pointer rests on it', async () => {
    const withDisabled: SelectOption[] = [...options, { value: 'durian', label: 'Durian', disabled: true }]
    const wrapper = mount(UtensilSelect, { props: { options: withDisabled }, attachTo: document.body })
    const button = trigger(wrapper)

    await button.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await nextTick()
    const apple = wrapper.findAll('[role="option"]')[0]
    await wrapper.findAll('[role="option"]')[3].trigger('mouseenter')
    expect(button.attributes('aria-activedescendant')).toBe(apple.attributes('id'))

    await button.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['apple'])
    wrapper.unmount()
  })

  it('draws chosen values as values, not the placeholder, in multiple mode', () => {
    const none = mount(UtensilSelect, { props: { options, multiple: true } })
    expect(trigger(none).classes()).not.toContain('has-value')

    const some = mount(UtensilSelect, { props: { options, multiple: true, selection: ['banana'] } })
    expect(trigger(some).classes()).toContain('has-value')
  })

  it('leaves aria-multiselectable off a single select', () => {
    const wrapper = mount(UtensilSelect, { props: { options } })
    expect(wrapper.find('[role="listbox"]').attributes('aria-multiselectable')).toBeUndefined()
  })

  it('describes the trigger with its description', () => {
    const wrapper = mount(UtensilSelect, { props: { options, label: 'Fruit', description: 'Ripe today' } })
    const description = wrapper.find('.utensil-select-description')

    expect(description.text()).toBe('Ripe today')
    expect(trigger(wrapper).attributes('aria-describedby')).toBe(description.attributes('id'))
  })

  it('holds an empty description line when asked to reserve one', () => {
    const plain = mount(UtensilSelect, { props: { options, label: 'Fruit' } })
    expect(plain.find('.utensil-select-description').exists()).toBe(false)

    const reserved = mount(UtensilSelect, { props: { options, label: 'Fruit', reserveDescription: true } })
    expect(reserved.find('.utensil-select-description').text()).toBe('')
    expect(trigger(reserved).attributes('aria-describedby')).toBeUndefined()
  })

  it('lets its list scroll past the maximum height by default', () => {
    const wrapper = mount(UtensilSelect, { props: { options } })

    expect(wrapper.find('.utensil-listbox').classes()).not.toContain('full')
  })

  it('shows every option when full', () => {
    const wrapper = mount(UtensilSelect, { props: { options, full: true } })

    expect(wrapper.find('.utensil-listbox').classes()).toContain('full')
  })

  it('sizes its trigger with every option label, hidden from assistive technology', () => {
    const wrapper = mount(UtensilSelect, { props: { options, modelValue: 'apple' } })

    const sizers = wrapper.findAll('.select-sizer')
    expect(sizers.map((sizer) => sizer.attributes('data-label'))).toEqual(['Apple', 'Banana', 'Cherry'])
    expect(wrapper.find('.utensil-select-trigger').text()).toBe('Apple')
    expect(sizers.every((sizer) => sizer.attributes('aria-hidden') === 'true')).toBe(true)
    expect(wrapper.find('.select-display').text()).toBe('Apple')
  })

  it('is rooted at .utensil-select', () => {
    const wrapper = mount(UtensilSelect, { props: { options } })
    expect(wrapper.classes()).toContain('utensil-select')
  })

  async function openWith(wrapper: ReturnType<typeof mount>, key = 'ArrowDown') {
    await trigger(wrapper).trigger('keydown', { key })
    await nextTick()
    await nextTick()
    await nextTick()
  }

  const activeLabel = (wrapper: ReturnType<typeof mount>) => {
    const id = trigger(wrapper).attributes('aria-activedescendant')
    return wrapper
      .findAll('[role="option"]')
      .find((option) => option.attributes('id') === id)
      ?.text()
  }

  it('chooses the focused option and closes on Tab, letting focus move on', async () => {
    const wrapper = mount(UtensilSelect, { props: { options }, attachTo: document.body })
    await openWith(wrapper)
    await trigger(wrapper).trigger('keydown', { key: 'ArrowDown' })

    const tab = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true })
    trigger(wrapper).element.dispatchEvent(tab)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['banana'])
    expect(trigger(wrapper).attributes('aria-expanded')).toBe('false')
    expect(tab.defaultPrevented).toBe(false)
    wrapper.unmount()
  })

  it('closes on Tab without choosing in multiple mode', async () => {
    const wrapper = mount(UtensilSelect, { props: { options, multiple: true }, attachTo: document.body })
    await openWith(wrapper)
    await trigger(wrapper).trigger('keydown', { key: 'Tab' })

    expect(wrapper.emitted('change')).toBeUndefined()
    expect(trigger(wrapper).attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('jumps to an option by typing the start of its text, opening the list', async () => {
    const wrapper = mount(UtensilSelect, { props: { options }, attachTo: document.body })
    await openWith(wrapper, 'c')
    expect(trigger(wrapper).attributes('aria-expanded')).toBe('true')
    expect(activeLabel(wrapper)).toBe('Cherry')

    // A pause ends the typed search, so the next character starts a new one
    await new Promise((resolve) => setTimeout(resolve, 550))
    await trigger(wrapper).trigger('keydown', { key: 'b' })
    expect(activeLabel(wrapper)).toBe('Banana')
    wrapper.unmount()
  })

  it('moves on through the options starting with a character typed again', async () => {
    const berries: SelectOption[] = [
      { value: 'apple', label: 'Apple' },
      { value: 'blackberry', label: 'Blackberry' },
      { value: 'blueberry', label: 'Blueberry' },
    ]
    const wrapper = mount(UtensilSelect, { props: { options: berries }, attachTo: document.body })
    await openWith(wrapper)
    await trigger(wrapper).trigger('keydown', { key: 'b' })
    expect(activeLabel(wrapper)).toBe('Blackberry')
    await trigger(wrapper).trigger('keydown', { key: 'b' })
    expect(activeLabel(wrapper)).toBe('Blueberry')
    wrapper.unmount()
  })

  it('shows its own icon on the trigger, in place of the chosen option icon', () => {
    const withIcons: SelectOption[] = [{ value: 'apple', label: 'Apple', icon: 'image' }]
    const own = mount(UtensilSelect, { props: { options: withIcons, modelValue: 'apple', icon: 'star' } })
    expect(own.findComponent({ name: 'UtensilIcon' }).props('icon')).toBe('star')

    const chosen = mount(UtensilSelect, { props: { options: withIcons, modelValue: 'apple' } })
    expect(chosen.findComponent({ name: 'UtensilIcon' }).props('icon')).toBe('image')
  })

  it('gives the prepend and append slots the selection and whether it is open', () => {
    const scopes: Record<string, unknown>[] = []
    mount(UtensilSelect, {
      props: { options, multiple: true, selection: ['apple'] },
      slots: {
        append: (scope: Record<string, unknown>) => {
          scopes.push(scope)
          return []
        },
      },
    })
    expect(scopes[0]).toMatchObject({ selection: ['apple'], isOpen: false })
  })
})
