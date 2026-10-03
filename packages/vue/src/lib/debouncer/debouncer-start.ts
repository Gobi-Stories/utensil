import type { Debouncer } from './debouncer'
import { Timer } from './timer'

export class DebouncerStart implements Debouncer {
  protected timer: Timer | null = null
  protected promise: Promise<void> | null = null

  constructor(protected duration: number) {}

  async run(action: () => Promise<void>): Promise<void> {
    if (!this.timer || !this.timer.isActive) {
      this.promise = action()
      this.timer = new Timer(() => null, this.duration)
    }

    return this.promise ?? undefined
  }

  cancel(): void {
    if (this.timer && this.timer) {
      this.timer.cancel()
    }
  }
}
