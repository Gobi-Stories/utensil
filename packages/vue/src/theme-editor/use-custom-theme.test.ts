import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { getPaperPageColors } from '@gobistories/utensil-css/colors/generate-colors'
import { useCustomTheme } from './use-custom-theme'

describe('useCustomTheme', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    document.head.innerHTML = ''
  })

  it('anchors the pen and pencil scales to the paper and records it', () => {
    const theme = useCustomTheme('#8fd5a6', '#404040', '#001c38', 1, { persist: false })
    const pages = getPaperPageColors('#001c38')

    for (const css of [theme.penCss.value, theme.pencilCss.value]) {
      expect(css).toContain(' * paper-color #001c38\n')
      expect(css).toContain(` * light-background ${pages.light}\n`)
    }
  })

  it('re-anchors the pen scale when the paper changes', async () => {
    const theme = useCustomTheme('#8fd5a6', '#404040', '#001c38', 1, { persist: false })

    theme.paper.value = '#2c0014'
    await nextTick()
    await vi.runAllTimersAsync()

    expect(theme.penCss.value).toContain(' * paper-color #2c0014\n')
    expect(theme.penCss.value).toContain(` * light-background ${getPaperPageColors('#2c0014').light}\n`)
  })

  it('re-anchors the pen scale and records the knobs when the paper options change', async () => {
    const theme = useCustomTheme('#8fd5a6', '#404040', '#001c38', 1, { persist: false })

    theme.paperOptions.value = { ...theme.paperOptions.value, tint: 2 }
    await nextTick()

    expect(theme.penCss.value).toContain(' * paper-tint 2\n')
    expect(theme.penCss.value).toContain(` * light-background ${getPaperPageColors('#001c38', { tint: 2 }).light}\n`)
  })
})
