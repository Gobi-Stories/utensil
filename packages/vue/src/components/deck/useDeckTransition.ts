import { computed, inject, onMounted, provide, ref, watch } from 'vue'
import { UtensilDeckContextKey, type DeckTransitions } from './utensil-deck'

type Phase = 'enter' | 'leave'

export interface DeckChildOptions {
  /** Base transition class name, e.g. `utensil-deck-scale`. A `-rev` variant must exist unless symmetric. */
  base: string
  /** Whether the child is currently the active (current) one in the deck. */
  active: () => boolean
  /** Whether the entrance should animate the first time the child is shown. */
  appear: () => boolean
  /** The child's own `reverse` prop, if set; otherwise the deck context (then `false`) applies. */
  reverse?: () => boolean | undefined
  /** The child's own `transitions` prop, if set; otherwise the deck context (then `both`) applies. */
  transitions?: () => DeckTransitions | undefined
  /** Declares which phases the nested child animates, so this layer waits for it on a delegated phase. */
  childTransitions?: () => DeckTransitions | undefined
  /** This child's deck id. Only direct deck children need it; nested layers leave it undefined. */
  id?: () => string | undefined
  /** The animation looks the same played backwards (e.g. a crossfade), so it has no `-rev` variant. */
  symmetric?: boolean
}

/** Whether `transitions` animates `phase`, accounting for `reverse` (which swaps the identities). */
function animatesPhase(transitions: DeckTransitions, phase: Phase, reverse: boolean): boolean {
  if (transitions === 'both') return true
  const animated: Phase = transitions === 'enter' ? (reverse ? 'leave' : 'enter') : reverse ? 'enter' : 'leave'
  return phase === animated
}

/**
 * Shared logic for UtensilDeck transition children. The child wraps its content in a Vue `<Transition>`,
 * spreading the returned `transitionProps` and `on` handlers; this composable owns:
 *
 * - resolving `reverse` / `transitions` as own-prop → deck context → default;
 * - toggling the inner element on `active`;
 * - picking the `-rev` class variant when reversed (unless symmetric);
 * - suppressing the phase it does not animate via empty per-phase class props (no flash);
 * - **composition**: it reports completion through the injected `transitionEnd(id)` callback — the
 *   deck's (routing by id) for a direct child, or a parent layer's wrapper for a nested one; it can't
 *   tell which. It re-provides its own wrapper for its children. A phase settles by priority: its own
 *   transition gates it when it animates that phase; otherwise the child it declares via
 *   `childTransitions` does; otherwise it settles immediately. A layer that delegates its exit stays
 *   mounted, animation-free, until the child reports, then unmounts; a layer that animates its own
 *   exit hides at once and Vue keeps its content for the duration (a longer child is truncated — a
 *   composition mistake — never a stuck panel).
 *
 * Direction/suppression ride `<Transition>` props, not classes on the element, so the leaving child
 * stays correct (Vue snapshots it before the child re-renders).
 */
export function useDeckTransition(options: DeckChildOptions) {
  const parent = inject(UtensilDeckContextKey, null)

  const reverse = computed(() => options.reverse?.() ?? parent?.reverse.value ?? false)
  const transitions = computed(() => options.transitions?.() ?? parent?.transitions.value ?? 'both')

  const enterAnimates = computed(() => animatesPhase(transitions.value, 'enter', reverse.value))
  const leaveAnimates = computed(() => animatesPhase(transitions.value, 'leave', reverse.value))
  const childAnimates = (phase: Phase) => {
    const child = options.childTransitions?.()
    return child ? animatesPhase(child, phase, reverse.value) : false
  }

  const shown = ref(options.active())

  // Per-phase coordination, reset at the start of each phase.
  let ownEnded = false
  let childEnded = false
  let reported = false

  function settle() {
    if (reported) return
    const leaving = !options.active()
    const phase: Phase = leaving ? 'leave' : 'enter'
    // Priority: our own transition gates if we animate this phase; else the child we declare; else now.
    let done: boolean
    if (leaving ? leaveAnimates.value : enterAnimates.value) done = ownEnded
    else if (childAnimates(phase)) done = childEnded
    else done = true
    if (!done) return
    reported = true
    if (leaving) shown.value = false
    parent?.transitionEnd(options.id?.())
  }

  // Provide our own context for nested children: pass the deck's reverse/transitions through, and
  // swap in our wrapper as `transitionEnd` (it ignores the reported id — we report our own).
  provide(UtensilDeckContextKey, {
    reverse: parent?.reverse ?? ref(false),
    transitions: parent?.transitions ?? ref<DeckTransitions>('both'),
    transitionEnd: () => {
      childEnded = true
      settle()
    },
  })

  function resetPhase() {
    ownEnded = false
    childEnded = false
    reported = false
  }

  watch(options.active, (isActive) => {
    resetPhase()
    if (isActive) {
      shown.value = true
      return
    }
    // Hide now to play our own exit (Vue keeps the children mounted); otherwise stay mounted,
    // animation-free, and let settle() decide (wait for a delegated child, or report immediately).
    if (leaveAnimates.value) shown.value = false
    else settle()
  })

  onMounted(() => {
    // Active without an entrance animation settles immediately so the deck can emit `entered`.
    if (options.active() && !options.appear()) {
      ownEnded = true
      settle()
    }
  })

  function onOwnTransitionEnd() {
    ownEnded = true
    settle()
  }

  const name = computed(() => (!options.symmetric && reverse.value ? `${options.base}-rev` : options.base))

  // `''` suppresses a phase (no transition, no start-state flash). `undefined` falls back to the
  // name-derived class. Appear classes default to the enter classes, so they follow suit.
  const transitionProps = computed(() => {
    const suppressEnter = !enterAnimates.value
    const suppressLeave = !leaveAnimates.value
    return {
      name: name.value,
      enterFromClass: suppressEnter ? '' : undefined,
      enterActiveClass: suppressEnter ? '' : undefined,
      enterToClass: suppressEnter ? '' : undefined,
      leaveFromClass: suppressLeave ? '' : undefined,
      leaveActiveClass: suppressLeave ? '' : undefined,
      leaveToClass: suppressLeave ? '' : undefined,
    }
  })

  const on = {
    afterEnter: onOwnTransitionEnd,
    afterAppear: onOwnTransitionEnd,
    afterLeave: onOwnTransitionEnd,
  }

  return { shown, transitionProps, on }
}
