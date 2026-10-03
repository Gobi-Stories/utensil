import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import UtensilIoStrip from './UtensilIoStrip.vue'
import UtensilTheme from '../../theme/UtensilTheme.vue'

function fill(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('.fill')
}

describe('UtensilIoStrip', () => {
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

  it('is idle and hidden from assistive tech when not active', () => {
    const wrapper = mount(UtensilIoStrip)
    expect(fill(wrapper).classes()).not.toContain('active')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('starts in the active phase when mounted active', () => {
    const wrapper = mount(UtensilIoStrip, { props: { active: true } })
    expect(fill(wrapper).classes()).toContain('active')
    expect(wrapper.attributes('aria-hidden')).toBe('false')
  })

  it('enters the active phase when active becomes true', async () => {
    const wrapper = mount(UtensilIoStrip)
    await wrapper.setProps({ active: true })
    expect(fill(wrapper).classes()).toContain('active')
  })

  it('finishes then fades then idles when the io completes', async () => {
    const wrapper = mount(UtensilIoStrip, { props: { active: true } })

    await wrapper.setProps({ active: false })
    expect(fill(wrapper).classes()).toContain('finishing')

    await vi.advanceTimersByTimeAsync(250)
    expect(fill(wrapper).classes()).toContain('fading')

    await vi.advanceTimersByTimeAsync(200)
    expect(fill(wrapper).classes()).not.toContain('fading')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('restarts the grow phase when io begins again mid-finish', async () => {
    const wrapper = mount(UtensilIoStrip, { props: { active: true } })

    await wrapper.setProps({ active: false })
    await wrapper.setProps({ active: true })
    await vi.advanceTimersByTimeAsync(500)

    expect(fill(wrapper).classes()).toContain('active')
  })

  it('shows a full sweep when the io completes before the activation frame', async () => {
    // Deferred rAF: the io begins and ends before the activation frame lands
    const callbacks: (FrameRequestCallback | undefined)[] = []
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => callbacks.push(callback))
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      callbacks[id - 1] = undefined
    })

    const wrapper = mount(UtensilIoStrip)
    await wrapper.setProps({ active: true })
    await wrapper.setProps({ active: false })

    callbacks.forEach((callback) => callback?.(0))
    await wrapper.vm.$nextTick()

    expect(fill(wrapper).classes()).toContain('finishing')
  })

  it('holds the active phase through the settle window before finishing', async () => {
    const wrapper = mount(UtensilIoStrip, { props: { active: true, settleMs: 300 } })

    await wrapper.setProps({ active: false })
    expect(fill(wrapper).classes()).toContain('active')

    await vi.advanceTimersByTimeAsync(300)
    expect(fill(wrapper).classes()).toContain('finishing')
  })

  it('continues the animation when io resumes within the settle window', async () => {
    const wrapper = mount(UtensilIoStrip, { props: { active: true, settleMs: 300 } })

    await wrapper.setProps({ active: false })
    await vi.advanceTimersByTimeAsync(150)
    await wrapper.setProps({ active: true })
    await vi.advanceTimersByTimeAsync(1000)

    expect(fill(wrapper).classes()).toContain('active')
  })

  it('stays idle when active flips false without ever activating', async () => {
    const wrapper = mount(UtensilIoStrip)
    await wrapper.setProps({ active: false })
    expect(fill(wrapper).classes()).not.toContain('finishing')
  })

  it('follows a reported progress instead of creeping', () => {
    const wrapper = mount(UtensilIoStrip, { props: { active: true, progress: 0.4 } })

    expect(fill(wrapper).classes()).toContain('determinate')
    expect(fill(wrapper).attributes('style')).toContain('width: 40%')
    expect(wrapper.attributes('aria-valuenow')).toBe('40')
  })

  it('keeps the progress within the strip', () => {
    const wrapper = mount(UtensilIoStrip, { props: { active: true, progress: 1.5 } })
    expect(fill(wrapper).attributes('style')).toContain('width: 100%')
  })

  it('holds the last reported progress when the reports stop before the io ends', async () => {
    const wrapper = mount(UtensilIoStrip, { props: { active: true, progress: 0.4 } })

    await wrapper.setProps({ progress: 0.7 })
    await wrapper.setProps({ progress: undefined })

    expect(fill(wrapper).classes()).toContain('determinate')
    expect(fill(wrapper).attributes('style')).toContain('width: 70%')
  })

  it('creeps again when io without a progress starts afresh', async () => {
    const wrapper = mount(UtensilIoStrip, { props: { active: true, progress: 0.7 } })

    await wrapper.setProps({ progress: undefined })
    await wrapper.setProps({ active: false })
    await vi.advanceTimersByTimeAsync(450)
    await wrapper.setProps({ active: true })

    expect(fill(wrapper).classes()).toContain('active')
    expect(fill(wrapper).classes()).not.toContain('determinate')
  })

  it('labels itself as a progressbar', () => {
    const wrapper = mount(UtensilIoStrip, { props: { active: true, ariaLabel: 'Loading page' } })
    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.attributes('aria-label')).toBe('Loading page')
  })

  it('renders the revealed gradient by default with the end color in its own scope', () => {
    const wrapper = mount(UtensilIoStrip, { props: { active: true, endColor: 'pencil' } })
    expect(fill(wrapper).classes()).toContain('always')
    const endClasses = wrapper.find('.end-scope').classes()
    expect(endClasses.some((cssClass) => cssClass.endsWith('-pen'))).toBe(true)
    expect(wrapper.find('.end-scope').attributes('style')).toContain('var(--pen-9)')
  })

  it('marks the fill for progressive blending when gradientMode is progressive', () => {
    const wrapper = mount(UtensilIoStrip, {
      props: { active: true, endColor: 'pencil', gradientMode: 'progressive' },
    })
    expect(fill(wrapper).classes()).toContain('progressive')
  })

  it('falls back to the captured context pen when endColor matches the surrounding theme', () => {
    // Inside a theme context, default colors resolve to the surrounding pen: no pen class is
    // emitted, so the end scope must read the context color captured at the root rather than
    // inherit the start scope's pen.
    const wrapper = mount(UtensilTheme, {
      slots: { default: h(UtensilIoStrip, { active: true }) },
    })
    expect(wrapper.find('.end-scope').attributes('style')).toContain('var(--strip-color-context)')
  })
})
