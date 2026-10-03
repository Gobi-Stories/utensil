import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilSearch from './UtensilSearch.vue'

describe('UtensilSearch', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('emits a typed term', async () => {
    const wrapper = mount(UtensilSearch)
    const input = wrapper.find('input')

    await input.setValue('stories')

    expect(wrapper.emitted('update:modelValue')).toEqual([['stories']])
  })

  it('clears a term passed in by the host', async () => {
    const wrapper = mount(UtensilSearch, { props: { modelValue: 'stories' } })
    const input = wrapper.find('input')

    await input.setValue('')

    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
  })

  it('emits nothing when an empty search stays empty', async () => {
    const wrapper = mount(UtensilSearch)
    const input = wrapper.find('input')

    await input.setValue('')
    await input.trigger('search')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
  it('clears at once from the native clear control, overtaking the debounced input', async () => {
    vi.useFakeTimers()
    const wrapper = mount(UtensilSearch, { props: { modelValue: 'stories', debounce: true } })
    const input = wrapper.find('input')

    // The clear control fires input, then search
    input.element.value = ''
    await input.trigger('input')
    await input.trigger('search')

    expect(wrapper.emitted('update:modelValue')).toEqual([['']])

    await vi.advanceTimersByTimeAsync(600)

    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
  })

  it('emits a debounced term once typing pauses', async () => {
    vi.useFakeTimers()
    const wrapper = mount(UtensilSearch, { props: { debounce: true } })
    const input = wrapper.find('input')

    input.element.value = 'sto'
    await input.trigger('input')
    input.element.value = 'stories'
    await input.trigger('input')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await vi.advanceTimersByTimeAsync(600)

    expect(wrapper.emitted('update:modelValue')).toEqual([['stories']])
  })
})
