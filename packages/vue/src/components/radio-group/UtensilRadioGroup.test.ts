import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import UtensilRadioGroup from './UtensilRadioGroup.vue'
import UtensilRadioGroupButton from './UtensilRadioGroupButton.vue'

function createGroup(
  options: {
    modelValue?: string
    disabled?: boolean
    variation?: string
    loop?: boolean
    frame?: 'plain' | 'segmented'
  } = {},
) {
  const TestWrapper = defineComponent({
    components: { UtensilRadioGroup, UtensilRadioGroupButton },
    setup() {
      const value = ref<string | undefined>(options.modelValue)
      return { value }
    },
    template: `
      <UtensilRadioGroup
        v-model="value"
        aria-label="Test group"
        ${options.disabled ? 'disabled' : ''}
        ${options.variation ? `variation="${options.variation}"` : ''}
        ${options.loop === false ? ':loop="false"' : ''}
        ${options.frame ? `frame="${options.frame}"` : ''}
      >
        <UtensilRadioGroupButton value="today" label="Today" />
        <UtensilRadioGroupButton value="7d" label="Last 7 days" />
        <UtensilRadioGroupButton value="30d" label="Last 30 days" />
      </UtensilRadioGroup>
    `,
  })

  return mount(TestWrapper, {
    attachTo: document.body,
  })
}

describe('UtensilRadioGroup', () => {
  it('renders a radiogroup with radio items', () => {
    const wrapper = createGroup()
    expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true)
    expect(wrapper.findAll('[role="radio"]')).toHaveLength(3)
    wrapper.unmount()
  })

  it('selects the initial value', () => {
    const wrapper = createGroup({ modelValue: '7d' })
    const radios = wrapper.findAll('[role="radio"]')
    expect(radios[1].attributes('aria-checked')).toBe('true')
    expect(radios[0].attributes('aria-checked')).toBe('false')
    expect(radios[2].attributes('aria-checked')).toBe('false')
    wrapper.unmount()
  })

  it('changes selection on click', async () => {
    const wrapper = createGroup({ modelValue: 'today' })
    const radios = wrapper.findAll('[role="radio"]')

    await radios[2].trigger('click')
    expect(wrapper.vm.value).toBe('30d')
    wrapper.unmount()
  })

  it('manages tabindex correctly - selected item is tabbable', () => {
    const wrapper = createGroup({ modelValue: '7d' })
    const radios = wrapper.findAll('[role="radio"]')

    expect(radios[0].attributes('tabindex')).toBe('-1')
    expect(radios[1].attributes('tabindex')).toBe('0')
    expect(radios[2].attributes('tabindex')).toBe('-1')
    wrapper.unmount()
  })

  it('navigates with arrow keys', async () => {
    const wrapper = createGroup({ modelValue: 'today' })
    const group = wrapper.find('[role="radiogroup"]')
    const radios = wrapper.findAll('[role="radio"]')

    ;(radios[0].element as HTMLElement).focus()

    await group.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.vm.value).toBe('7d')

    await group.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.vm.value).toBe('30d')
    wrapper.unmount()
  })

  it('loops navigation by default', async () => {
    const wrapper = createGroup({ modelValue: '30d' })
    const group = wrapper.find('[role="radiogroup"]')
    const radios = wrapper.findAll('[role="radio"]')

    ;(radios[2].element as HTMLElement).focus()

    await group.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.vm.value).toBe('today')
    wrapper.unmount()
  })

  it('does not change selection when disabled', () => {
    const wrapper = createGroup({ modelValue: 'today', disabled: true })
    expect(wrapper.find('.utensil-radio-group.disabled').exists()).toBe(true)
    wrapper.unmount()
  })

  it('has accessible aria-label', () => {
    const wrapper = createGroup()
    expect(wrapper.find('[role="radiogroup"]').attributes('aria-label')).toBe('Test group')
    wrapper.unmount()
  })

  it('displays label text in buttons', () => {
    const wrapper = createGroup()
    const radios = wrapper.findAll('[role="radio"]')
    expect(radios[0].text()).toBe('Today')
    expect(radios[1].text()).toBe('Last 7 days')
    expect(radios[2].text()).toBe('Last 30 days')
    wrapper.unmount()
  })

  it('uses flex-wrap layout', () => {
    const wrapper = createGroup()
    const group = wrapper.find('.utensil-radio-group')
    expect(group.exists()).toBe(true)
    wrapper.unmount()
  })

  it('does not add segmented class by default', () => {
    const wrapper = createGroup()
    expect(wrapper.find('.utensil-radio-group.segmented').exists()).toBe(false)
    wrapper.unmount()
  })

  it('adds segmented class when frame="segmented"', () => {
    const wrapper = createGroup({ frame: 'segmented' })
    expect(wrapper.find('.utensil-radio-group.segmented').exists()).toBe(true)
    wrapper.unmount()
  })
})

describe('UtensilRadioGroup multiple', () => {
  function createMultiGroup(initial: string[] = []) {
    const TestWrapper = defineComponent({
      components: { UtensilRadioGroup, UtensilRadioGroupButton },
      setup() {
        const selection = ref<string[]>(initial)
        return { selection }
      },
      template: `
        <UtensilRadioGroup v-model:selection="selection" multiple aria-label="Test group">
          <UtensilRadioGroupButton value="today" label="Today" />
          <UtensilRadioGroupButton value="7d" label="Last 7 days" />
          <UtensilRadioGroupButton value="30d" label="Last 30 days" />
        </UtensilRadioGroup>
      `,
    })

    return mount(TestWrapper, { attachTo: document.body })
  }

  it('renders a group of checkboxes', () => {
    const wrapper = createMultiGroup()
    expect(wrapper.find('[role="group"]').exists()).toBe(true)
    expect(wrapper.findAll('[role="checkbox"]')).toHaveLength(3)
    wrapper.unmount()
  })

  it('toggles values in and out of the selection', async () => {
    const wrapper = createMultiGroup(['today'])
    const checkboxes = wrapper.findAll('[role="checkbox"]')

    await checkboxes[1].trigger('click')
    expect(wrapper.vm.selection).toEqual(['today', '7d'])

    await checkboxes[0].trigger('click')
    expect(wrapper.vm.selection).toEqual(['7d'])
    wrapper.unmount()
  })

  it('marks the selected values as checked', () => {
    const wrapper = createMultiGroup(['7d'])
    const checkboxes = wrapper.findAll('[role="checkbox"]')
    expect(checkboxes[1].attributes('aria-checked')).toBe('true')
    expect(checkboxes[0].attributes('aria-checked')).toBe('false')
    wrapper.unmount()
  })
})

describe('UtensilRadioGroup on and off styling', () => {
  function createStyledGroup(groupAttributes: string, firstButtonAttributes = '') {
    const TestWrapper = defineComponent({
      components: { UtensilRadioGroup, UtensilRadioGroupButton },
      setup() {
        const value = ref('today')
        return { value }
      },
      template: `
        <UtensilRadioGroup v-model="value" aria-label="Test group" ${groupAttributes}>
          <UtensilRadioGroupButton value="today" label="Today" ${firstButtonAttributes} />
          <UtensilRadioGroupButton value="7d" label="Last 7 days" />
        </UtensilRadioGroup>
      `,
    })

    return mount(TestWrapper, { attachTo: document.body })
  }

  it('applies the group on and off variations by selection', () => {
    const wrapper = createStyledGroup('variation="soft" on-variation="solid" off-variation="outline"')
    const radios = wrapper.findAll('[role="radio"]')
    expect(radios[0].classes()).toContain('ui-solid')
    expect(radios[1].classes()).toContain('ui-outline')
    wrapper.unmount()
  })

  it('falls back to the group variation without on and off variations', () => {
    const wrapper = createStyledGroup('variation="outline"')
    const radios = wrapper.findAll('[role="radio"]')
    expect(radios[0].classes()).toContain('ui-outline')
    expect(radios[1].classes()).toContain('ui-outline')
    wrapper.unmount()
  })

  it('applies the group on and off colors by selection', () => {
    const wrapper = createStyledGroup('on-color="success" off-color="pencil"')
    const buttons = wrapper.findAllComponents({ name: 'UtensilButton' })
    expect(buttons[0].props('color')).toBe('success')
    expect(buttons[1].props('color')).toBe('pencil')
    wrapper.unmount()
  })

  it('falls back to pen without on and off colors', () => {
    const wrapper = createStyledGroup('')
    const buttons = wrapper.findAllComponents({ name: 'UtensilButton' })
    expect(buttons[0].props('color')).toBe('pen')
    expect(buttons[1].props('color')).toBe('pen')
    wrapper.unmount()
  })

  it('lets a button override the group on and off styling', () => {
    const wrapper = createStyledGroup(
      'on-variation="solid" on-color="success"',
      'on-variation="surface" on-color="error"',
    )
    expect(wrapper.findAll('[role="radio"]')[0].classes()).toContain('ui-surface')
    expect(wrapper.findAllComponents({ name: 'UtensilButton' })[0].props('color')).toBe('error')
    wrapper.unmount()
  })

  it('restyles buttons as the selection moves', async () => {
    const wrapper = createStyledGroup('on-variation="solid" off-variation="outline"')
    const radios = wrapper.findAll('[role="radio"]')
    await radios[1].trigger('click')
    expect(radios[0].classes()).toContain('ui-outline')
    expect(radios[1].classes()).toContain('ui-solid')
    wrapper.unmount()
  })
})
