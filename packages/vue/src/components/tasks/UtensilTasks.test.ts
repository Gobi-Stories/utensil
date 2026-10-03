import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import UtensilTasks from './UtensilTasks.vue'
import UtensilTask from './UtensilTask.vue'

function mountTasks(template: string, data: Record<string, unknown> = {}) {
  const Wrapper = defineComponent({
    components: { UtensilTasks, UtensilTask },
    setup() {
      return data
    },
    template,
  })
  return mount(Wrapper, { attachTo: document.body })
}

describe('UtensilTasks', () => {
  it('is not visible when count is zero', () => {
    const wrapper = mountTasks(`<UtensilTasks :count="0" />`)
    expect(wrapper.find('.utensil-tasks').classes()).not.toContain('visible')
    wrapper.unmount()
  })

  it('is visible when count is greater than zero', () => {
    const wrapper = mountTasks(`<UtensilTasks :count="1" :progress="30" />`)
    expect(wrapper.find('.utensil-tasks').classes()).toContain('visible')
    wrapper.unmount()
  })

  it('is visible when alwaysVisible even with zero tasks', () => {
    const wrapper = mountTasks(`<UtensilTasks :count="0" always-visible />`)
    expect(wrapper.find('.utensil-tasks').classes()).toContain('visible')
    wrapper.unmount()
  })

  it('does not open the popover when alwaysVisible and zero tasks', async () => {
    const wrapper = mountTasks(`<UtensilTasks :count="0" always-visible />`)
    const trigger = wrapper.find('.utensil-tasks-trigger')
    expect(trigger.classes()).toContain('empty')
    expect(trigger.attributes('aria-disabled')).toBe('true')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    await trigger.trigger('click')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('shows the count', () => {
    const wrapper = mountTasks(`<UtensilTasks :count="3" />`)
    expect(wrapper.find('.trigger-count').text()).toBe('3')
    wrapper.unmount()
  })

  it('renders label when provided', () => {
    const wrapper = mountTasks(`<UtensilTasks :count="1" label="Uploading file.mp4" />`)
    expect(wrapper.text()).toContain('Uploading file.mp4')
    wrapper.unmount()
  })

  it('omits label when not provided', () => {
    const wrapper = mountTasks(`<UtensilTasks :count="1" />`)
    expect(wrapper.find('.trigger-label').exists()).toBe(false)
    wrapper.unmount()
  })

  it('emits click with child payload via context', async () => {
    const wrapper = mountTasks(
      `<UtensilTasks :count="1">
        <UtensilTask title="task" :payload="payload" />
      </UtensilTasks>`,
      { payload: 'p1' },
    )
    await wrapper.find('.utensil-task').trigger('click')
    const tasks = wrapper.findComponent(UtensilTasks)
    expect(tasks.emitted('click')?.[0]).toEqual(['p1'])
    wrapper.unmount()
  })
})
