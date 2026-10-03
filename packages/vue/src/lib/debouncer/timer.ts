export class Timer {
  protected _isActive = true
  protected timer: NodeJS.Timeout

  get isActive() {
    return this._isActive
  }

  constructor(
    protected action: () => unknown,
    protected duration: number,
  ) {
    this.timer = setTimeout(() => {
      action()
      this._isActive = false
    }, duration)
  }

  cancel() {
    this._isActive = false
    clearTimeout(this.timer)
  }
}
