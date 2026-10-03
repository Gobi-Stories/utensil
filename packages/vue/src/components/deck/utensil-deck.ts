import type { InjectionKey, Ref } from 'vue'

/**
 * Which transition identity plays. `enter` and `leave` name the forward animations; reversing swaps
 * which child plays which, so `transitions` selects the same identity in both directions.
 */
export type DeckTransitions = 'both' | 'enter' | 'leave'

export interface UtensilDeckContext {
  /** Play transitions backwards (rewind). Children default to this unless they set their own `reverse`. */
  reverse: Ref<boolean>
  /** Which transitions are active. Children default to this unless they set their own `transitions`. */
  transitions: Ref<DeckTransitions>
  /**
   * Report that a transition has finished. The deck implementation routes by `id` (`settle(id)`); a
   * transition child re-provides its own wrapper that ignores the `id` and reports its own instead.
   * This is how layers compose — a child calls the same callback whether it came from the deck or a
   * parent layer; it never knows which.
   */
  transitionEnd: (id?: string) => void
}

export const UtensilDeckContextKey: InjectionKey<UtensilDeckContext> = Symbol('UtensilDeckContext')
