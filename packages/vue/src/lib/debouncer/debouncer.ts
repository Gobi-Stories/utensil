export interface Debouncer {
  run(action: () => unknown): Promise<void>
  cancel(): void
}
