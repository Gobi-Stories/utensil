import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import UtensilIoStatusStrip from './UtensilIoStatusStrip.vue'

describe('UtensilIoStatusStrip', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0)
      return 0
    })
    vi.stubGlobal('cancelAnimationFrame', () => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('is idle while neither loading nor saving', () => {
    const wrapper = mount(UtensilIoStatusStrip)
    expect(wrapper.findComponent({ name: 'UtensilIoStrip' }).props('active')).toBe(false)
  })

  it('activates with the loading color and label while loading', () => {
    const wrapper = mount(UtensilIoStatusStrip, {
      props: { loading: true, loadingColor: 'pen', savingColor: 'pencil' },
    })

    expect(wrapper.findComponent({ name: 'UtensilIoStrip' }).props('active')).toBe(true)
    expect(wrapper.findComponent({ name: 'UtensilIoStrip' }).props('color')).toBe('pen')
    expect(wrapper.findComponent({ name: 'UtensilIoStrip' }).props('ariaLabel')).toBe('Loading')
  })

  it('saving wins the color and label when loading and saving overlap', () => {
    const wrapper = mount(UtensilIoStatusStrip, {
      props: { loading: true, saving: true, loadingColor: 'pen', savingColor: 'pencil' },
    })

    expect(wrapper.findComponent({ name: 'UtensilIoStrip' }).props('color')).toBe('pencil')
    expect(wrapper.findComponent({ name: 'UtensilIoStrip' }).props('ariaLabel')).toBe('Saving changes')
  })

  it('an error overrides whichever color is showing', async () => {
    const wrapper = mount(UtensilIoStatusStrip, {
      props: { loading: false, saving: true, savingColor: 'pen', errorColor: 'pencil' },
    })

    await wrapper.setProps({ error: true })

    expect(wrapper.findComponent({ name: 'UtensilIoStrip' }).props('color')).toBe('pencil')
  })

  it('falls back to the loading color when saving and error colors are not set', async () => {
    const wrapper = mount(UtensilIoStatusStrip, {
      props: { loading: false, saving: true, loadingColor: 'pencil' },
    })

    await wrapper.setProps({ error: true })

    expect(wrapper.findComponent({ name: 'UtensilIoStrip' }).props('color')).toBe('pencil')
  })

  it('keeps the saving color through the finish sweep after the save completes', async () => {
    const wrapper = mount(UtensilIoStatusStrip, {
      props: { loading: false, saving: true, loadingColor: 'pen', savingColor: 'pencil' },
    })

    await wrapper.setProps({ saving: false })

    expect(wrapper.findComponent({ name: 'UtensilIoStrip' }).props('color')).toBe('pencil')
  })

  it('forwards the loading gradient only while loading is showing', async () => {
    const wrapper = mount(UtensilIoStatusStrip, {
      props: { loading: true, loadingColor: 'pen', loadingEndColor: 'pencil' },
    })

    expect(wrapper.findComponent({ name: 'UtensilIoStrip' }).props('endColor')).toBe('pencil')

    await wrapper.setProps({ saving: true })

    expect(wrapper.findComponent({ name: 'UtensilIoStrip' }).props('endColor')).toBeUndefined()
  })

  it('forwards a reported progress to the strip', () => {
    const wrapper = mount(UtensilIoStatusStrip, { props: { saving: true, progress: 0.25 } })
    expect(wrapper.findComponent({ name: 'UtensilIoStrip' }).props('progress')).toBe(0.25)
  })

  it('settles between bursts by default rather than finishing immediately', async () => {
    const wrapper = mount(UtensilIoStatusStrip, { props: { saving: true } })

    await wrapper.setProps({ saving: false })
    expect(wrapper.find('.fill').classes()).toContain('active')

    await vi.advanceTimersByTimeAsync(300)
    expect(wrapper.find('.fill').classes()).toContain('finishing')
  })
})
