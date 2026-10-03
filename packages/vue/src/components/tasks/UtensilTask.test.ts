import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, provide } from 'vue'
import UtensilTask from './UtensilTask.vue'
import { provideUtensilTasksContextKey, type UtensilTasksContext } from './utensil-tasks'

describe('UtensilTask', () => {
  it('renders title and state', () => {
    const wrapper = mount(UtensilTask, {
      props: { title: 'Upload: file.mp4', state: 'Uploading...' },
    })
    expect(wrapper.text()).toContain('Upload: file.mp4')
    expect(wrapper.text()).toContain('Uploading...')
  })

  it('omits state when not provided', () => {
    const wrapper = mount(UtensilTask, { props: { title: 'task' } })
    expect(wrapper.find('.task-state').exists()).toBe(false)
  })

  it('shows progress bar when progress provided and not errored', () => {
    const wrapper = mount(UtensilTask, { props: { title: 'task', progress: 50 } })
    expect(wrapper.find('.utensil-progress-bar').exists()).toBe(true)
  })

  it('omits progress bar when progress is undefined', () => {
    const wrapper = mount(UtensilTask, { props: { title: 'task', errored: true } })
    expect(wrapper.find('.utensil-progress-bar').exists()).toBe(false)
  })

  it('emits click with payload', async () => {
    const payload = { id: 'a' }
    const wrapper = mount(UtensilTask, { props: { title: 'task', payload } })
    await wrapper.find('.utensil-task').trigger('click')
    expect(wrapper.emitted('click')?.[0]).toEqual([payload])
  })

  it('calls context.emitClick with payload when injected', async () => {
    const emitClick = vi.fn()
    const Wrapper = defineComponent({
      setup() {
        const context: UtensilTasksContext = { emitClick }
        provide(provideUtensilTasksContextKey(), context)
        return () => h(UtensilTask, { title: 'task', payload: 'p1' })
      },
    })
    const wrapper = mount(Wrapper)
    await wrapper.find('.utensil-task').trigger('click')
    expect(emitClick).toHaveBeenCalledWith('p1')
  })

  it('renders an icon when icon prop is provided', () => {
    const wrapper = mount(UtensilTask, { props: { title: 'task', icon: 'image' } })
    const icon = wrapper.findComponent({ name: 'UtensilIcon' })
    expect(icon.exists()).toBe(true)
    expect(icon.props('icon')).toBe('image')
  })

  it('omits the icon when no icon prop is provided', () => {
    const wrapper = mount(UtensilTask, { props: { title: 'task' } })
    expect(wrapper.find('.task-icon').exists()).toBe(false)
  })

  it('renders actions slot', () => {
    const wrapper = mount(UtensilTask, {
      props: { title: 'task' },
      slots: { actions: '<button class="retry-btn">Retry</button>' },
    })
    expect(wrapper.find('.retry-btn').exists()).toBe(true)
  })

  it('does not bubble row click when action is clicked', async () => {
    const wrapper = mount(UtensilTask, {
      props: { title: 'task', payload: 'p' },
      slots: { actions: '<button class="retry-btn">Retry</button>' },
    })
    await wrapper.find('.retry-btn').trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('activates on Enter key', async () => {
    const wrapper = mount(UtensilTask, { props: { title: 'task', payload: 'p' } })
    await wrapper.find('.utensil-task').trigger('keydown.enter')
    expect(wrapper.emitted('click')?.[0]).toEqual(['p'])
  })
})
