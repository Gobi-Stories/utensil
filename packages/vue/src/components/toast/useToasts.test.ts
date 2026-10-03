import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { useToasts } from './useToasts'

// The entry mounts hidden and shows on a deferred tick to catch its enter
// transition — settle that before exercising post-show behavior
async function shown() {
  await nextTick()
  await nextTick()
}

describe('useToasts', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('add creates a toast entry', () => {
    const toasts = useToasts()
    toasts.add('Hello')
    expect(toasts.toasts.value).toHaveLength(1)
    expect(toasts.toasts.value[0].message).toBe('Hello')
  })

  it('add creates a toast with leaving set to false', () => {
    const toasts = useToasts()
    toasts.add('Hello')
    expect(toasts.toasts.value[0].leaving).toBe(false)
  })

  it('dismiss marks a shown toast as leaving', async () => {
    const toasts = useToasts()
    toasts.add('Hello', { time: 0 })
    await shown()
    const id = toasts.toasts.value[0].id
    toasts.dismiss(id)
    expect(toasts.toasts.value).toHaveLength(1)
    expect(toasts.toasts.value[0].leaving).toBe(true)
  })

  it('removes a toast dismissed before it has shown', () => {
    const toasts = useToasts()
    const handle = toasts.add('Hello', { time: 0 })
    handle.dismiss()
    expect(toasts.toasts.value).toHaveLength(0)
  })

  it('does not resurrect a pre-show dismissal on the deferred show', async () => {
    const toasts = useToasts()
    const handle = toasts.add('Hello', { time: 0 })
    handle.dismiss()
    await shown()
    expect(toasts.toasts.value).toHaveLength(0)
  })

  it('remove deletes a toast from the list', () => {
    const toasts = useToasts()
    toasts.add('Hello', { time: 0 })
    const id = toasts.toasts.value[0].id
    toasts.remove(id)
    expect(toasts.toasts.value).toHaveLength(0)
  })

  it('handle.dismiss marks the shown toast as leaving', async () => {
    const toasts = useToasts()
    const handle = toasts.add('Hello', { time: 0 })
    await shown()
    handle.dismiss()
    expect(toasts.toasts.value).toHaveLength(1)
    expect(toasts.toasts.value[0].leaving).toBe(true)
  })

  it('dismiss by id removes toast from list after remove is called', async () => {
    const toasts = useToasts()
    toasts.add('First', { time: 0 })
    toasts.add('Second', { time: 0 })
    await shown()
    const id = toasts.toasts.value[0].id
    toasts.dismiss(id)
    expect(toasts.toasts.value).toHaveLength(2)
    toasts.remove(id)
    expect(toasts.toasts.value).toHaveLength(1)
    expect(toasts.toasts.value[0].message).toBe('Second')
  })

  it('auto-dismisses after default duration by marking as leaving', async () => {
    const toasts = useToasts(1000)
    toasts.add('Hello')
    await shown()
    expect(toasts.toasts.value).toHaveLength(1)
    vi.advanceTimersByTime(1000)
    expect(toasts.toasts.value[0].leaving).toBe(true)
  })

  it('does not auto-dismiss when progress is defined', () => {
    const toasts = useToasts(1000)
    toasts.add('Uploading', { progress: 0 })
    vi.advanceTimersByTime(5000)
    expect(toasts.toasts.value).toHaveLength(1)
    expect(toasts.toasts.value[0].leaving).toBe(false)
  })

  it('handle.update merges options into entry', () => {
    const toasts = useToasts()
    const handle = toasts.add('Uploading', { progress: 0 })
    handle.update({ color: 'pen', busy: true })
    expect(toasts.toasts.value[0].color).toBe('pen')
    expect(toasts.toasts.value[0].busy).toBe(true)
  })

  it('handle.presented is true while the toast is on screen', () => {
    const toasts = useToasts()
    const handle = toasts.add('Hello', { time: 0 })
    expect(handle.presented()).toBe(true)
  })

  it('handle.presented is false once the toast is dismissed', () => {
    const toasts = useToasts()
    const handle = toasts.add('Hello', { time: 0 })
    handle.dismiss()
    expect(handle.presented()).toBe(false)
  })

  it('handle.presented is false once the toast times out', () => {
    const toasts = useToasts(1000)
    const handle = toasts.add('Hello')
    expect(handle.presented()).toBe(true)
    vi.advanceTimersByTime(1000)
    expect(handle.presented()).toBe(false)
  })

  it('handle.presented is false after the toast is removed', () => {
    const toasts = useToasts()
    const handle = toasts.add('Hello', { time: 0 })
    toasts.remove(toasts.toasts.value[0].id)
    expect(handle.presented()).toBe(false)
  })

  it('supports multiple concurrent toasts', () => {
    const toasts = useToasts()
    toasts.add('First', { time: 0 })
    toasts.add('Second', { time: 0 })
    toasts.add('Third', { time: 0 })
    expect(toasts.toasts.value).toHaveLength(3)
  })

  it('each toast has a unique id', () => {
    const toasts = useToasts()
    toasts.add('First', { time: 0 })
    toasts.add('Second', { time: 0 })
    const ids = toasts.toasts.value.map((t) => t.id)
    expect(new Set(ids).size).toBe(2)
  })
})
