import { inject, provide, type InjectionKey } from 'vue'
import type { Point, ReorderableStep } from './reorderable-geometry'

export type ReorderableId = string | number

export type ReorderableItemState = 'home' | 'grabbed' | 'moving' | 'invalid'

export interface ReorderableEvent {
  id: ReorderableId
  index: number
}

/** Mutable state of one drag, shared between the source list and the list under the pointer. */
export interface ReorderableDrag {
  id: ReorderableId
  homeIndex: number
  /** Whether the item carries a data-reorderable-id — required for cross-list drags */
  explicitId: boolean
  source: ReorderableListHandle
  size: { width: number; height: number }
  /** A marker away from home has shown this flight (markers near home stay hidden until then) */
  markerShown: boolean
  /** The source collapsed the item out of its layout (target-placeholder mode) */
  collapsedHome: boolean
  /** Insertion index in the current target list, null while there is no valid target */
  insertion: number | null
}

/** Contract between the lists of a group. Implemented by UtensilReorderableList, never by consumers. */
export interface ReorderableListHandle {
  namespace(): string | undefined
  element(): HTMLElement | null
  itemCount(): number
  targetAt(drag: ReorderableDrag, point: Point): number
  step(drag: ReorderableDrag, current: number, direction: ReorderableStep): number | null
  rowReversedAt(drag: ReorderableDrag, insertion: number): boolean
  setTarget(drag: ReorderableDrag, insertion: number): void
  clearTarget(drag: ReorderableDrag, glide?: boolean): void
  reveal(insertion: number): void
  accept(drag: ReorderableDrag, insertion: number): void
}

/** The index the item would occupy after the drop, accounting for its removal from the same list. */
export function finalIndex(drag: ReorderableDrag, list: ReorderableListHandle, insertion: number): number {
  return list === drag.source && insertion > drag.homeIndex ? insertion - 1 : insertion
}

export interface ReorderableGroup {
  register(handle: ReorderableListHandle): () => void
  members(): ReorderableListHandle[]
}

export function createReorderableGroup(): ReorderableGroup {
  const handles: ReorderableListHandle[] = []
  return {
    register(handle) {
      handles.push(handle)
      return () => {
        const index = handles.indexOf(handle)
        if (index >= 0) handles.splice(index, 1)
      }
    },
    members: () => [...handles],
  }
}

const reorderableGroupKey: InjectionKey<ReorderableGroup> = Symbol('utensil-reorderable-group')

/**
 * Makes descendant UtensilReorderableLists with a matching namespace accept each other's items.
 * Call in a common ancestor, or use UtensilReorderableListGroup for the component form.
 */
export function provideReorderableGroup(): ReorderableGroup {
  const group = createReorderableGroup()
  provide(reorderableGroupKey, group)
  return group
}

export function injectReorderableGroup(): ReorderableGroup | undefined {
  return inject(reorderableGroupKey, undefined)
}
