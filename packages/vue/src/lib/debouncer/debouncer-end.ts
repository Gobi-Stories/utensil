import type { Debouncer } from './debouncer'
import { Timer } from './timer'

export class DebouncerEnd implements Debouncer {
  protected timer: Timer | null = null
  protected promise: Promise<void> | null = null
  protected resolve: (() => void) | null = null

  constructor(protected duration: number) {}

  async run(action: () => Promise<void>): Promise<void> {
    if (!this.promise) {
      this.promise = new Promise((resolve) => (this.resolve = resolve))
    }

    if (this.timer && this.timer.isActive) {
      this.timer.cancel()
    }

    this.timer = new Timer(async () => {
      const resolve = this.resolve
      this.resolve = null
      this.promise = null

      await action()

      if (resolve) {
        resolve()
      }
    }, this.duration)

    return this.promise
  }

  cancel(): void {
    if (this.timer && this.timer) {
      this.timer.cancel()
    }
  }
}
