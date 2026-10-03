import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UtensilFontPreview from './UtensilFontPreview.vue'
import UtensilFontText from './UtensilFontText.vue'
import UtensilFader from '../fader/UtensilFader.vue'

interface FontFaceSetStub {
  check: (spec: string) => boolean
  load: (spec: string) => Promise<FontFace[]>
}

function stubFontFaceSet(stub: FontFaceSetStub) {
  Object.defineProperty(document, 'fonts', { configurable: true, value: stub })
}

describe('UtensilFontPreview', () => {
  beforeEach(() => {
    stubFontFaceSet({ check: () => true, load: () => Promise.resolve([]) })
  })

  it('composes UtensilFontText with the supplied font-family', async () => {
    const wrapper = mount(UtensilFontPreview, {
      props: { fontFamily: 'Merriweather', text: 'Hello' },
    })
    await flushPromises()
    const fontText = wrapper.findComponent(UtensilFontText)
    expect(fontText.exists()).toBe(true)
    expect(fontText.props('fontFamily')).toBe('Merriweather')
  })

  it('renders the text prop once the font is loaded', async () => {
    const wrapper = mount(UtensilFontPreview, {
      props: { fontFamily: 'Inter', text: 'Sample' },
    })
    await flushPromises()
    expect(wrapper.text()).toBe('Sample')
  })

  it("falls back to 'Aa' when no text or slot is provided", async () => {
    const wrapper = mount(UtensilFontPreview, {
      props: { fontFamily: 'Inter' },
    })
    await flushPromises()
    expect(wrapper.text()).toBe('Aa')
  })

  it('renders default slot content when provided', async () => {
    const wrapper = mount(UtensilFontPreview, {
      props: { fontFamily: 'Inter' },
      slots: { default: 'Custom' },
    })
    await flushPromises()
    expect(wrapper.text()).toBe('Custom')
  })

  it('roots to .utensil-font-preview', () => {
    const wrapper = mount(UtensilFontPreview, {
      props: { fontFamily: 'Inter' },
    })
    expect(wrapper.find('.utensil-font-preview').exists()).toBe(true)
  })

  it('skips the fade-in when the font is already loaded', async () => {
    const wrapper = mount(UtensilFontPreview, {
      props: { fontFamily: 'Cached', text: 'Hello' },
    })
    await flushPromises()
    const fader = wrapper.findComponent(UtensilFader)
    expect(fader.props('show')).toBe(true)
    expect(fader.props('fadeIn')).toBe(false)
  })

  it('hides then fades in once a pending font has loaded', async () => {
    let resolveLoad: (value: FontFace[]) => void = () => {}
    stubFontFaceSet({
      check: () => false,
      load: () =>
        new Promise<FontFace[]>((resolve) => {
          resolveLoad = resolve
        }),
    })

    const wrapper = mount(UtensilFontPreview, {
      props: { fontFamily: 'Pending', text: 'Hello' },
    })
    await flushPromises()
    const fader = wrapper.findComponent(UtensilFader)
    expect(fader.props('show')).toBe(false)
    expect(fader.props('fadeIn')).toBe(true)

    resolveLoad([])
    await flushPromises()
    expect(fader.props('show')).toBe(true)
    expect(fader.props('fadeIn')).toBe(true)
  })
})
