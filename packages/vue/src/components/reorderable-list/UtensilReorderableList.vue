<template>
  <div
    ref="rootRef"
    class="utensil-reorderable-list"
    :class="{
      dragging,
      'touch-hold': touchHold,
      'no-grab-style': noGrabStyle,
      'target-placeholder': targetPlaceholder,
    }"
    role="group"
    aria-roledescription="reorderable list"
    :aria-describedby="hintId"
    @pointerdown="onPointerDown"
    @keydown="onKeydown"
    @dragstart="onDragStart"
  >
    <slot
      :state="stateOf"
      :target-before="targetBefore"
      :target-after="targetAfter"
      :target-over="targetOver"
      :target-home="homeTargeted"
      :grab="grab"
    />
    <span :id="hintId" class="screen-reader" data-reorderable-internal="">
      Use arrow keys to move the item, Enter or Space to drop it, Escape to cancel.
    </span>
    <span class="screen-reader" aria-live="polite" data-reorderable-internal="">{{ liveMessage }}</span>
    <div
      v-if="marker && !hideMarkers"
      class="marker"
      :class="marker.orientation"
      :style="markerStyle"
      data-reorderable-internal=""
      aria-hidden="true"
    ></div>
    <div
      v-if="homeRect && hasHomeSlot"
      class="home-placeholder"
      :style="homeStyle"
      data-reorderable-internal=""
      aria-hidden="true"
    >
      <slot name="home-placeholder" :targeted="homeTargeted" />
    </div>
    <!-- Target-placeholder mode: an in-flow, item-sized element moved to the insertion position -->
    <div
      v-if="flow"
      ref="flowRef"
      class="flow-placeholder"
      :class="{ animated: targetPlaceholder === 'animated' }"
      :style="flowStyle"
      data-reorderable-internal=""
      aria-hidden="true"
    >
      <slot name="home-placeholder" :targeted="homeTargeted" />
    </div>
    <!-- Top-layer ghost that follows the pointer -->
    <div
      ref="ghostRef"
      popover="manual"
      class="utensil-reorderable-ghost"
      :style="ghostStyle"
      data-reorderable-internal=""
      aria-hidden="true"
    >
      <slot v-if="ghostActive && !clone" name="moving-placeholder">
        <UtensilSkeleton class="ghost-skeleton" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, useSlots, type CSSProperties } from 'vue'
import UtensilSkeleton from '../skeleton/UtensilSkeleton.vue'
import { useLongPress } from '../../composables/use-long-press'
import {
  finalIndex,
  injectReorderableGroup,
  type ReorderableDrag,
  type ReorderableEvent,
  type ReorderableId,
  type ReorderableItemState,
  type ReorderableListHandle,
} from './utensil-reorderable-list'
import {
  fromFullInsertion,
  insertionIndex,
  itemIndexAt,
  markerLine,
  rowReversedAt,
  stepInsertion,
  toFullInsertion,
  type MarkerLine,
  type Point,
  type Rect,
  type ReorderableStep,
} from './reorderable-geometry'

interface Props {
  /** Hides the built-in drop markers; consumers can render their own via targetBefore/targetAfter */
  hideMarkers?: boolean
  /** Never mark the item's own slot; the home-placeholder slot's `targeted` scope signals it instead */
  noHomeMarkers?: boolean
  /**
   * Moves the home placeholder to the drop target instead of showing markers: the vacated space
   * collapses and an item-sized placeholder opens at the target. Set it on every list of a group —
   * each list renders its own home-placeholder slot for incoming drags. 'animated' makes the gaps
   * glide: the old space shrinks shut while the new one grows, so siblings part smoothly
   */
  targetPlaceholder?: boolean | 'animated'
  /**
   * Ghosts a clone of the grabbed item instead of the moving-placeholder slot. The clone is taken
   * after the moving state renders, so classes the consumer derives from state(id) — and the
   * data-reorderable-state="moving" attribute — are on it for styling the ghost
   */
  clone?: boolean
  /** Skips the built-in scale-down styling of the grabbed item */
  noGrabStyle?: boolean
  /** Cross-list key: lists in the same group with the same namespace accept each other's items */
  namespace?: string
  /** Grab a focused item on Enter/Space. Opt-in, as it takes those keys over from the item */
  keyboardGrab?: boolean
  /**
   * Keeps the drag on this list when the pointer leaves it — the nearest position is targeted
   * instead of the drag reading as invalid. For a list that is the only place to drop, such as a
   * single row the pointer can wander above or below
   */
  confined?: boolean
  /**
   * Targets whole items instead of the gaps between them: the item under the pointer takes the
   * drop wherever the pointer sits within it, and the grabbed item lands in its place. Pairs with
   * hideMarkers and the slot's targetOver for rows of tiles, where a line between items doesn't read
   */
  targetItems?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hideMarkers: false,
  noHomeMarkers: false,
  targetPlaceholder: false,
  clone: false,
  noGrabStyle: false,
  namespace: undefined,
  keyboardGrab: false,
  confined: false,
  targetItems: false,
})

const emit = defineEmits<{
  grabbed: [event: ReorderableEvent]
  moving: [event: ReorderableEvent]
  dropped: [event: ReorderableEvent]
  removed: [event: ReorderableEvent]
  added: [event: ReorderableEvent]
  canceled: [event: ReorderableEvent]
}>()

const MOUSE_THRESHOLD = 4
const MOVE_EPSILON = 3
const SCROLL_ZONE = 32
const SCROLL_MAX = 16

const rootRef = ref<HTMLElement>()
const ghostRef = ref<HTMLElement>()
const hintId = useId()
const slots = useSlots()
const hasHomeSlot = computed(() => Boolean(slots['home-placeholder']))
const group = injectReorderableGroup()

// A still touch arms a grab after the system long press; a moving one stays a pan
const longPress = useLongPress(onLongPress)
const touchHold = longPress.holding

const sessionId = ref<ReorderableId | null>(null)
const sessionState = ref<Exclude<ReorderableItemState, 'home'> | null>(null)
const marker = ref<MarkerLine | null>(null)
const markerIndex = ref<number | null>(null)
// Where the grabbed item would land, in this list's child space
const targetIndex = ref<number | null>(null)
const homeRect = ref<{ left: number; top: number; width: number; height: number } | null>(null)
const homeTargeted = ref(false)
const flow = ref<{
  width: number
  height: number
  collapsed: boolean
  axis: 'block' | 'inline'
  gap: number
} | null>(null)
const flowRef = ref<HTMLElement>()
const ghostActive = ref(false)
const ghostSize = ref<{ width: number; height: number } | null>(null)
const liveMessage = ref('')
const childrenVersion = ref(0)

const dragging = computed(() => sessionState.value === 'moving' || sessionState.value === 'invalid')

const markerStyle = computed<CSSProperties | undefined>(() => {
  const line = marker.value
  if (!line) return undefined
  return line.orientation === 'vertical'
    ? { left: `${line.left}px`, top: `${line.top}px`, height: `${line.length}px` }
    : { left: `${line.left}px`, top: `${line.top}px`, width: `${line.length}px` }
})

const homeStyle = computed<CSSProperties | undefined>(() => {
  const rect = homeRect.value
  if (!rect) return undefined
  return {
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  }
})

const ghostStyle = computed<CSSProperties | undefined>(() => {
  const size = ghostSize.value
  if (!size) return undefined
  return { width: `${size.width}px`, height: `${size.height}px` }
})

const flowStyle = computed<CSSProperties | undefined>(() => {
  const size = flow.value
  if (!size) return undefined
  const style: CSSProperties = {
    width: size.collapsed && size.axis === 'inline' ? '0px' : `${size.width}px`,
    height: size.collapsed && size.axis === 'block' ? '0px' : `${size.height}px`,
  }
  // Collapsed also cancels its flex-gap slot, so the net space animates all the way to zero
  if (size.collapsed && size.gap) {
    if (size.axis === 'block') style.marginBlockEnd = `-${size.gap}px`
    else style.marginInlineEnd = `-${size.gap}px`
  }
  return style
})

// -- Items ----------------------------------------------------------------------------------------

function itemElements(): HTMLElement[] {
  const root = rootRef.value
  if (!root) return []
  return Array.from(root.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement && !child.hasAttribute('data-reorderable-internal'),
  )
}

function itemId(element: HTMLElement, index: number): ReorderableId {
  return element.getAttribute('data-reorderable-id') ?? index
}

function itemIndexOf(id: ReorderableId): number {
  return itemElements().findIndex((element, index) => String(itemId(element, index)) === String(id))
}

function itemRects() {
  return itemElements().map((element) => {
    const rect = element.getBoundingClientRect()
    return { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
  })
}

function directChildOf(target: EventTarget | null): HTMLElement | null {
  const root = rootRef.value
  if (!root || !(target instanceof Node)) return null
  let element = target instanceof HTMLElement ? target : target.parentElement
  while (element && element.parentElement !== root) element = element.parentElement
  if (!element || element.hasAttribute('data-reorderable-internal')) return null
  return element
}

function draggableChild(target: EventTarget | null): { element: HTMLElement; index: number } | null {
  const element = directChildOf(target)
  if (!element || element.getAttribute('draggable') === 'false') return null
  const index = itemElements().indexOf(element)
  return index < 0 ? null : { element, index }
}

// -- Slot scope -----------------------------------------------------------------------------------

function stateOf(id: ReorderableId): ReorderableItemState {
  if (sessionId.value !== null && String(sessionId.value) === String(id)) return sessionState.value ?? 'home'
  return 'home'
}

function targetBefore(id: ReorderableId): boolean {
  void childrenVersion.value
  return markerIndex.value !== null && itemIndexOf(id) === markerIndex.value
}

function targetAfter(id: ReorderableId): boolean {
  void childrenVersion.value
  return markerIndex.value !== null && itemIndexOf(id) === markerIndex.value - 1
}

/** Whether the drop would take this item's place — never the grabbed item's own. */
function targetOver(id: ReorderableId): boolean {
  void childrenVersion.value
  if (targetIndex.value === null || stateOf(id) !== 'home') return false
  return itemIndexOf(id) === targetIndex.value
}

// -- Target handle (used by whichever list runs the drag, including this one) ---------------------

function toContent(line: MarkerLine): MarkerLine {
  const root = rootRef.value as HTMLElement
  const rect = root.getBoundingClientRect()
  return {
    ...line,
    left: line.left - rect.left - root.clientLeft + root.scrollLeft,
    top: line.top - rect.top - root.clientTop + root.scrollTop,
  }
}

let lastMovingIndex: number | null = null
let lastFlowInsertion: number | null = null

// Geometry runs on visible rects: a collapsed in-flight item (target-placeholder mode) is excluded
// and insertion indices convert back to full child space
function dropGeometry(drag: ReorderableDrag): { rects: Rect[]; hidden: number } {
  const rects = itemRects()
  const hidden = drag.collapsedHome && drag.source === handle ? drag.homeIndex : -1
  if (hidden >= 0) rects.splice(hidden, 1)
  return { rects, hidden }
}

function moveFlowTo(insertion: number) {
  lastFlowInsertion = insertion
  void nextTick(() => {
    const element = flowRef.value
    const root = rootRef.value
    if (!element || !root || lastFlowInsertion === null) return
    root.insertBefore(element, itemElements()[lastFlowInsertion] ?? null)
    if (flow.value?.collapsed) {
      // Commit the collapsed size so the expansion below actually transitions
      void element.offsetHeight
      flow.value = { ...flow.value, collapsed: false }
    }
  })
}

/** The axis the gap opens along: between rows it grows in height, within a row in width. */
function flowAxis(drag: ReorderableDrag, insertion: number): 'block' | 'inline' {
  const { rects, hidden } = dropGeometry(drag)
  const line = markerLine(rects, hidden < 0 ? insertion : fromFullInsertion(insertion, hidden))
  return line?.orientation === 'vertical' ? 'inline' : 'block'
}

/** The container's flex/grid gap along the axis — the root element is the item container. */
function flowGap(axis: 'block' | 'inline'): number {
  const root = rootRef.value
  if (!root) return 0
  const style = getComputedStyle(root)
  const value = parseFloat(axis === 'block' ? style.rowGap : style.columnGap)
  return Number.isFinite(value) ? value : 0
}

/** Leaves a shrinking copy of the placeholder at its current position so the old space glides shut. */
function leaveCloneBehind() {
  const element = flowRef.value
  const root = rootRef.value
  if (!element || !root) return
  const rect = element.getBoundingClientRect()
  const clone = element.cloneNode(true) as HTMLElement
  clone.style.width = `${rect.width}px`
  clone.style.height = `${rect.height}px`
  root.insertBefore(clone, element)
  void clone.offsetHeight
  const axis = flow.value?.axis ?? 'block'
  const gap = flow.value?.gap ?? 0
  if (axis === 'inline') {
    clone.style.width = '0px'
    if (gap) clone.style.marginInlineEnd = `-${gap}px`
  } else {
    clone.style.height = '0px'
    if (gap) clone.style.marginBlockEnd = `-${gap}px`
  }
  // Reduced motion resolves to a zero-duration transition — drop the clone right away then
  if (getComputedStyle(clone).transitionDuration === '0s') clone.remove()
  else window.setTimeout(() => clone.remove(), 200)
}

function targetFlow(drag: ReorderableDrag, insertion: number, atHome: boolean) {
  const animated = props.targetPlaceholder === 'animated'
  if (!flow.value) {
    // At home the gap inherits the collapsed item's space seamlessly; elsewhere it grows open
    const collapsed = animated && !atHome
    const axis = flowAxis(drag, insertion)
    flow.value = { ...drag.size, collapsed, axis, gap: flowGap(axis) }
    moveFlowTo(insertion)
    return
  }
  if (lastFlowInsertion === insertion) return
  if (animated) leaveCloneBehind()
  const axis = flowAxis(drag, insertion)
  flow.value = { ...drag.size, collapsed: animated, axis, gap: flowGap(axis) }
  moveFlowTo(insertion)
}

const handle: ReorderableListHandle = {
  namespace: () => props.namespace,
  element: () => rootRef.value ?? null,
  itemCount: () => itemElements().length,
  targetAt(drag, point) {
    const { rects, hidden } = dropGeometry(drag)
    if (props.targetItems) {
      const over = itemIndexAt(rects, point)
      if (over < 0) return 0
      const item = hidden < 0 || over < hidden ? over : over + 1
      // The grabbed item takes the item's place: it goes after an item beyond home, before one ahead of it
      return drag.source === handle && item > drag.homeIndex ? item + 1 : item
    }
    const visible = insertionIndex(rects, point)
    return hidden < 0 ? visible : toFullInsertion(visible, hidden)
  },
  step(drag, current, direction) {
    const { rects, hidden } = dropGeometry(drag)
    const next = stepInsertion(rects, hidden < 0 ? current : fromFullInsertion(current, hidden), direction)
    if (next === null) return null
    return hidden < 0 ? next : toFullInsertion(next, hidden)
  },
  rowReversedAt(drag, insertion) {
    const { rects, hidden } = dropGeometry(drag)
    return rowReversedAt(rects, hidden < 0 ? insertion : fromFullInsertion(insertion, hidden))
  },
  setTarget(drag, insertion) {
    const final = finalIndex(drag, handle, insertion)
    const atHome = drag.source === handle && final === drag.homeIndex
    // Both insertion slots around home mean "stays"; pin to the before slot so the marker is stable
    if (atHome) insertion = drag.homeIndex
    drag.insertion = insertion
    homeTargeted.value = atHome
    if (props.targetPlaceholder) {
      marker.value = null
      markerIndex.value = null
      targetFlow(drag, insertion, atHome)
    } else if (atHome && (props.noHomeMarkers || !drag.markerShown)) {
      marker.value = null
      markerIndex.value = null
    } else {
      const line = markerLine(itemRects(), insertion)
      marker.value = line ? toContent(line) : null
      markerIndex.value = insertion
      if (!atHome) drag.markerShown = true
    }
    targetIndex.value = final
    if (lastMovingIndex !== final) {
      lastMovingIndex = final
      const total = handle.itemCount() + (drag.source === handle ? 0 : 1)
      liveMessage.value = `Position ${final + 1} of ${total}`
      emit('moving', { id: drag.id, index: final })
    }
  },
  clearTarget(drag, glide = false) {
    drag.insertion = null
    marker.value = null
    markerIndex.value = null
    homeTargeted.value = false
    // Mid-flight departures glide the space shut; at session end the item replaces it instantly
    if (glide && flow.value && props.targetPlaceholder === 'animated') leaveCloneBehind()
    flow.value = null
    lastFlowInsertion = null
    lastMovingIndex = null
    targetIndex.value = null
    liveMessage.value = ''
  },
  reveal(insertion) {
    const items = itemElements()
    const anchor = items[Math.min(insertion, items.length - 1)]
    anchor?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  },
  accept(drag, insertion) {
    emit('added', { id: drag.id, index: insertion })
  },
}

function compatibleLists(drag: ReorderableDrag): ReorderableListHandle[] {
  if (!group || !drag.explicitId || !props.namespace) return [handle]
  return group
    .members()
    .filter(
      (member) => member === handle || (member.namespace() !== undefined && member.namespace() === props.namespace),
    )
}

function listAt(drag: ReorderableDrag, point: Point): ReorderableListHandle | null {
  const hit = document.elementFromPoint?.(point.x, point.y)
  if (!hit) return null
  const candidates = compatibleLists(drag)
  let node: Element | null = hit
  while (node) {
    const found = candidates.find((candidate) => candidate.element() === node)
    if (found) return found
    node = node.parentElement
  }
  return null
}

// -- Session --------------------------------------------------------------------------------------

interface Session {
  drag: ReorderableDrag
  element: HTMLElement
  mode: 'pointer' | 'keyboard'
  pointerId: number | null
  grabOffset: Point
  grabPoint: Point
  targetList: ReorderableListHandle | null
  moved: boolean
  /** A touch hold, whose lift without a drag is a long press rather than a canceled drag */
  touch: boolean
  /** What had focus inside the item when it was grabbed, so a drop can hand it back */
  focused: HTMLElement | null
}

let session: Session | null = null
let ghostClone: HTMLElement | null = null
interface PointerPress {
  element: HTMLElement
  index: number
  point: Point
  pointerId: number
  touch: boolean
}

// A mouse press that has yet to travel the drag threshold
let pending: PointerPress | null = null
let pointerCleanups: Array<() => void> = []
let sessionCleanups: Array<() => void> = []
let frame = 0
let lastPoint: Point = { x: 0, y: 0 }
let pointDirty = false

function listenWindow<Kind extends keyof WindowEventMap>(
  cleanups: Array<() => void>,
  kind: Kind,
  handler: (event: WindowEventMap[Kind]) => void,
  options?: AddEventListenerOptions,
) {
  window.addEventListener(kind, handler, options)
  cleanups.push(() => window.removeEventListener(kind, handler, options))
}

function onPointerDown(event: PointerEvent) {
  if (session || pending || touchHold.value || event.button !== 0) return
  const item = draggableChild(event.target)
  if (!item) return
  if (event.pointerType === 'touch') {
    longPress.press(event)
    return
  }
  pending = {
    element: item.element,
    index: item.index,
    point: { x: event.clientX, y: event.clientY },
    pointerId: event.pointerId,
    touch: false,
  }
  listenPointer()
}

function listenPointer() {
  listenWindow(pointerCleanups, 'pointermove', onPointerMove)
  listenWindow(pointerCleanups, 'pointerup', onPointerUp)
  listenWindow(pointerCleanups, 'pointercancel', onPointerCancel)
}

function onLongPress(event: PointerEvent) {
  // The child is read again at arm time, as the list may have re-rendered under the finger
  const item = draggableChild(event.target)
  if (session || !item) {
    longPress.release()
    return
  }
  listenPointer()
  startPointerSession({
    element: item.element,
    index: item.index,
    point: { x: event.clientX, y: event.clientY },
    pointerId: event.pointerId,
    touch: true,
  })
}

function onPointerMove(event: PointerEvent) {
  const pointerId = session?.pointerId ?? pending?.pointerId
  if (event.pointerId !== pointerId) return
  const point = { x: event.clientX, y: event.clientY }
  if (!session && pending) {
    const distance = Math.hypot(point.x - pending.point.x, point.y - pending.point.y)
    if (distance > MOUSE_THRESHOLD) {
      startPointerSession(pending)
      beginMoving(point)
    }
    return
  }
  if (!session) return
  lastPoint = point
  pointDirty = true
  if (
    sessionState.value === 'grabbed' &&
    Math.hypot(point.x - session.grabPoint.x, point.y - session.grabPoint.y) > MOVE_EPSILON
  ) {
    beginMoving(point)
  }
}

function onPointerUp(event: PointerEvent) {
  if (session) {
    if (event.pointerId === session.pointerId) drop()
  } else if (pending && event.pointerId === pending.pointerId) {
    cleanupPointer()
  }
}

function onPointerCancel(event: PointerEvent) {
  if (session) {
    // The browser took the gesture over, so no click will follow — never leave a blocker armed
    if (event.pointerId === session.pointerId) cancelSession('none')
  } else if (pending && event.pointerId === pending.pointerId) {
    cleanupPointer()
  }
}

function onDragStart(event: DragEvent) {
  // Native drags (images, links) would fight the pointer session
  if (session || pending || touchHold.value) event.preventDefault()
}

function startPointerSession(press: PointerPress) {
  const rect = press.element.getBoundingClientRect()
  startSession(press.element, press.index, 'pointer', press.pointerId, {
    grabOffset: { x: press.point.x - rect.left, y: press.point.y - rect.top },
    grabPoint: press.point,
    touch: press.touch,
  })
  lastPoint = press.point
  const root = rootRef.value as HTMLElement
  if (typeof root.setPointerCapture === 'function') {
    try {
      root.setPointerCapture(press.pointerId)
    } catch {
      // The pointer may already be gone; the window listeners still cover the session
    }
  }
  pending = null
}

function startSession(
  element: HTMLElement,
  index: number,
  mode: Session['mode'],
  pointerId: number | null,
  points?: { grabOffset: Point; grabPoint: Point; touch: boolean },
) {
  const id = itemId(element, index)
  const focused = document.activeElement
  session = {
    drag: {
      id,
      homeIndex: index,
      explicitId: element.hasAttribute('data-reorderable-id'),
      source: handle,
      size: { width: element.offsetWidth, height: element.offsetHeight },
      markerShown: false,
      collapsedHome: false,
      insertion: null,
    },
    element,
    mode,
    pointerId,
    grabOffset: points?.grabOffset ?? { x: 0, y: 0 },
    grabPoint: points?.grabPoint ?? { x: 0, y: 0 },
    targetList: null,
    moved: false,
    touch: points?.touch ?? false,
    focused: focused instanceof HTMLElement && element.contains(focused) ? focused : null,
  }
  sessionId.value = id
  sessionState.value = 'grabbed'
  // Item state rides on an attribute, not classes — a consumer's reactive :class patch would wipe
  // imperatively added classes, but Vue leaves unmanaged attributes alone
  element.setAttribute('data-reorderable-state', 'grabbed')
  listenWindow(sessionCleanups, 'keydown', onSessionKeydown, { capture: true })
  if (mode === 'keyboard') listenWindow(sessionCleanups, 'focusin', onFocusChange)
  emit('grabbed', { id, index })
}

function beginMoving(point: Point) {
  const active = session as Session
  active.moved = true
  sessionState.value = 'moving'
  if (props.targetPlaceholder) {
    // The vacated space collapses; the flow placeholder takes it over in the same frame — both so
    // nothing jumps and so the held space keeps the first target stable (collapsing without it
    // slides the next item under the pointer, reading as an instant move-by-one)
    active.drag.collapsedHome = true
    active.targetList = handle
    lastMovingIndex = active.drag.homeIndex
    handle.setTarget(active.drag, active.drag.homeIndex)
  } else {
    homeRect.value = {
      left: active.element.offsetLeft,
      top: active.element.offsetTop,
      width: active.element.offsetWidth,
      height: active.element.offsetHeight,
    }
  }
  active.element.setAttribute('data-reorderable-state', 'moving')
  ghostSize.value = { ...active.drag.size }
  ghostActive.value = true
  const ghost = ghostRef.value
  if (ghost) {
    // Position before showing, or the popover flashes wherever the previous drag left it
    ghost.style.transform = `translate3d(${point.x - active.grabOffset.x}px, ${point.y - active.grabOffset.y}px, 0)`
    if (typeof ghost.showPopover === 'function') ghost.showPopover()
  }
  if (props.clone) {
    // Clone a tick later, after the consumer's reactive classes for the moving state have rendered,
    // so the copy carries them
    void nextTick(() => {
      const host = ghostRef.value
      if (session !== active || !ghostActive.value || !host) return
      ghostClone?.remove()
      ghostClone = active.element.cloneNode(true) as HTMLElement
      ghostClone.style.boxSizing = 'border-box'
      ghostClone.style.width = '100%'
      ghostClone.style.height = '100%'
      host.appendChild(ghostClone)
    })
  }
  lastPoint = point
  pointDirty = true
  frame = requestAnimationFrame(frameStep)
}

function frameStep() {
  const active = session
  if (!active) return
  const ghost = ghostRef.value
  if (ghost) {
    ghost.style.transform = `translate3d(${lastPoint.x - active.grabOffset.x}px, ${lastPoint.y - active.grabOffset.y}px, 0)`
  }
  const list = listAt(active.drag, lastPoint) ?? (props.confined ? handle : null)
  // Off every list the drag still scrolls what surrounds its own list
  const scrolled = autoScroll((list ?? handle).element(), lastPoint)
  if (pointDirty || scrolled) {
    pointDirty = false
    retarget(list)
  }
  frame = requestAnimationFrame(frameStep)
}

function retarget(list: ReorderableListHandle | null) {
  const active = session as Session
  if (list !== active.targetList) {
    active.targetList?.clearTarget(active.drag, true)
    active.targetList = list
  }
  if (!list) {
    sessionState.value = 'invalid'
    return
  }
  sessionState.value = 'moving'
  list.setTarget(active.drag, list.targetAt(active.drag, lastPoint))
}

const scrollContainers = new Map<HTMLElement, HTMLElement[]>()

/** The anchor's scroll containers, innermost first and the page last — cached for the session */
function scrollContainersOf(anchor: HTMLElement): HTMLElement[] {
  let containers = scrollContainers.get(anchor)
  if (containers) return containers
  containers = []
  for (let node: HTMLElement | null = anchor; node; node = node.parentElement) {
    const style = getComputedStyle(node)
    if (/auto|scroll|overlay/.test(style.overflowX + style.overflowY)) containers.push(node)
  }
  const page = document.scrollingElement
  if (page instanceof HTMLElement && !containers.includes(page)) containers.push(page)
  scrollContainers.set(anchor, containers)
  return containers
}

/** Scrolls the innermost container that can still move for a pointer in its edge zone. */
function autoScroll(anchor: HTMLElement | null, point: Point): boolean {
  if (!anchor) return false
  return scrollContainersOf(anchor).some((element) => scrollEdge(element, point))
}

function scrollEdge(element: HTMLElement, point: Point): boolean {
  const rect =
    element === document.scrollingElement
      ? { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }
      : element.getBoundingClientRect()
  const speed = (depth: number) => Math.min(SCROLL_MAX, 1 + depth / 4)
  let x = 0
  let y = 0
  if (element.scrollHeight > element.clientHeight) {
    if (point.y < rect.top + SCROLL_ZONE) y = -speed(rect.top + SCROLL_ZONE - point.y)
    else if (point.y > rect.bottom - SCROLL_ZONE) y = speed(point.y - (rect.bottom - SCROLL_ZONE))
  }
  if (element.scrollWidth > element.clientWidth) {
    if (point.x < rect.left + SCROLL_ZONE) x = -speed(rect.left + SCROLL_ZONE - point.x)
    else if (point.x > rect.right - SCROLL_ZONE) x = speed(point.x - (rect.right - SCROLL_ZONE))
  }
  if (!x && !y) return false
  const scrollTop = element.scrollTop
  const scrollLeft = element.scrollLeft
  element.scrollBy(x, y)
  return element.scrollTop !== scrollTop || element.scrollLeft !== scrollLeft
}

// -- Keyboard -------------------------------------------------------------------------------------

function grab(id: ReorderableId) {
  if (session || pending || touchHold.value) return
  const index = itemIndexOf(id)
  if (index < 0) return
  const element = itemElements()[index]
  if (element.getAttribute('draggable') === 'false') return
  startSession(element, index, 'keyboard', null)
}

function onKeydown(event: KeyboardEvent) {
  if (session || !props.keyboardGrab) return
  if (event.key !== 'Enter' && event.key !== ' ') return
  const item = draggableChild(event.target)
  if (!item) return
  event.preventDefault()
  grab(itemId(item.element, item.index))
}

const stepKeys: Record<string, ReorderableStep> = {
  ArrowLeft: 'previous',
  ArrowRight: 'next',
  ArrowUp: 'up',
  ArrowDown: 'down',
}

function onSessionKeydown(event: KeyboardEvent) {
  const active = session as Session
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    cancel()
    return
  }
  if (active.mode !== 'keyboard') return
  const step = stepKeys[event.key]
  if (step) {
    event.preventDefault()
    keyStep(step)
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    // Stops here, or the list's own keydown handler reads the same press as a fresh grab
    event.stopPropagation()
    drop()
  }
}

function keyStep(direction: ReorderableStep) {
  const active = session as Session
  const list = active.targetList ?? handle
  let insertion = active.drag.insertion ?? active.drag.homeIndex
  if ((direction === 'previous' || direction === 'next') && list.rowReversedAt(active.drag, insertion)) {
    direction = direction === 'previous' ? 'next' : 'previous'
  }
  const current = active.targetList ? finalIndex(active.drag, list, insertion) : active.drag.homeIndex
  // A step can land on the far side of the item's own slot, which is no move at all — step through it
  for (let hop = 0; hop < 2; hop++) {
    const next = list.step(active.drag, insertion, direction)
    if (next === null) {
      crossStep(list, direction)
      return
    }
    insertion = next
    if (list !== active.drag.source || finalIndex(active.drag, list, insertion) !== current) break
  }
  moveTargetTo(list, insertion)
}

function crossStep(from: ReorderableListHandle, direction: ReorderableStep) {
  const active = session as Session
  const lists = compatibleLists(active.drag)
  const forward = direction === 'next' || direction === 'down'
  const neighbor = lists[lists.indexOf(from) + (forward ? 1 : -1)]
  if (!neighbor) return
  moveTargetTo(neighbor, forward ? 0 : neighbor.itemCount())
}

function moveTargetTo(list: ReorderableListHandle, insertion: number) {
  const active = session as Session
  if (list !== active.targetList) {
    active.targetList?.clearTarget(active.drag, true)
    active.targetList = list
  }
  sessionState.value = 'moving'
  active.moved = true
  list.setTarget(active.drag, insertion)
  list.reveal(insertion)
}

function onFocusChange() {
  const active = session as Session
  if (document.activeElement && !active.element.contains(document.activeElement)) cancel()
}

// -- Outcomes -------------------------------------------------------------------------------------

function drop() {
  const active = session as Session
  const { drag } = active
  const list = active.targetList
  let landing: ReorderableListHandle = handle
  if (list && drag.insertion !== null) {
    if (list === handle) {
      const final = finalIndex(drag, handle, drag.insertion)
      if (final !== drag.homeIndex) emit('dropped', { id: drag.id, index: final })
      else emit('canceled', { id: drag.id, index: drag.homeIndex })
    } else {
      emit('removed', { id: drag.id, index: drag.homeIndex })
      list.accept(drag, drag.insertion)
      landing = list
    }
  } else {
    emit('canceled', { id: drag.id, index: drag.homeIndex })
  }
  // A drag's release, and a long press's, must not land as a click on the item
  endSession(active.mode === 'pointer' && (active.moved || active.touch) ? 'immediate' : 'none')
  if (active.focused) followFocus(drag, landing, active.focused)
  if (active.touch && !active.moved) replayContextMenu(active.element, lastPoint)
}

/**
 * A touch held into a grab and lifted without dragging is the long press the browser wanted to
 * report; its contextmenu, held back during the hold, is replayed on the item at the finger
 */
function replayContextMenu(element: HTMLElement, point: Point) {
  const init = { bubbles: true, cancelable: true, composed: true, clientX: point.x, clientY: point.y }
  const event =
    typeof PointerEvent === 'function'
      ? new PointerEvent('contextmenu', { ...init, pointerType: 'touch' })
      : new MouseEvent('contextmenu', init)
  // On the element under the finger, as the browser would — a handler may sit on a descendant
  const under = document.elementFromPoint?.(point.x, point.y)
  const target = under && element.contains(under) ? under : element
  target.dispatchEvent(event)
}

/**
 * A grabbed item loses focus along the way — hidden while it moves, or moved or replaced by the
 * consumer's re-render on drop. Once the new DOM is in, focus goes back to the item, found by id
 * as its element may be a new one
 */
function followFocus(drag: ReorderableDrag, list: ReorderableListHandle, focused: HTMLElement) {
  if (!drag.explicitId) return
  void nextTick(() => {
    const item = Array.from(list.element()?.children ?? []).find(
      (child) => child.getAttribute('data-reorderable-id') === String(drag.id),
    )
    if (!(item instanceof HTMLElement)) return
    // A keyed re-render keeps the node, so whatever had focus inside the item takes it back
    const target = item.contains(focused) ? focused : item
    target.focus()
  })
}

function cancel() {
  if (!session) {
    cleanupPointer()
    return
  }
  // A canceled pointer drag still has the button down; suppress the click its release will fire
  cancelSession(session.mode === 'pointer' && session.moved ? 'release' : 'none')
}

function cancelSession(suppress: ClickSuppression) {
  const active = session as Session
  emit('canceled', { id: active.drag.id, index: active.drag.homeIndex })
  endSession(suppress)
}

function cleanupPointer() {
  pointerCleanups.forEach((cleanup) => cleanup())
  pointerCleanups = []
  pending = null
  longPress.release()
}

type ClickSuppression = 'immediate' | 'release' | 'none'

function endSession(suppress: ClickSuppression = 'none') {
  const active = session as Session
  cancelAnimationFrame(frame)
  active.targetList?.clearTarget(active.drag)
  const root = rootRef.value
  if (active.pointerId !== null && root && typeof root.releasePointerCapture === 'function') {
    try {
      root.releasePointerCapture(active.pointerId)
    } catch {
      // Already released with the pointer
    }
  }
  const element = active.element
  // Release keeps the transition so the scale animates back; the guard leaves a new grab untouched
  element.setAttribute('data-reorderable-state', 'release')
  window.setTimeout(() => {
    if (element.getAttribute('data-reorderable-state') === 'release') {
      element.removeAttribute('data-reorderable-state')
    }
  }, 200)
  const ghost = ghostRef.value
  if (ghost && typeof ghost.hidePopover === 'function' && ghost.matches(':popover-open')) ghost.hidePopover()
  ghostClone?.remove()
  ghostClone = null
  ghostActive.value = false
  ghostSize.value = null
  homeRect.value = null
  scrollContainers.clear()
  if (suppress !== 'none') suppressNextClick(suppress)
  sessionCleanups.forEach((cleanup) => cleanup())
  sessionCleanups = []
  session = null
  sessionId.value = null
  sessionState.value = null
  cleanupPointer()
}

function suppressNextClick(until: Exclude<ClickSuppression, 'none'>) {
  const block = (event: Event) => {
    event.preventDefault()
    event.stopPropagation()
  }
  window.addEventListener('click', block, { capture: true })
  const disarm = () => window.setTimeout(() => window.removeEventListener('click', block, { capture: true }), 0)
  // 'release' means the button is still down (Escape-cancel) — hold the blocker until it comes up
  if (until === 'release') window.addEventListener('pointerup', disarm, { once: true })
  else disarm()
}

// -- Lifecycle ------------------------------------------------------------------------------------

let unregister: (() => void) | null = null
let observer: MutationObserver | null = null

onMounted(() => {
  unregister = group?.register(handle) ?? null
  observer = new MutationObserver(() => {
    childrenVersion.value++
  })
  observer.observe(rootRef.value as HTMLElement, { childList: true })
})

onBeforeUnmount(() => {
  if (session) endSession()
  cleanupPointer()
  observer?.disconnect()
  unregister?.()
})

defineExpose({ grab, drop: () => (session ? drop() : undefined), cancel })
</script>

<style scoped>
.utensil-reorderable-list {
  position: relative;
}

.utensil-reorderable-list.dragging {
  cursor: grabbing;
}

.marker {
  --marker-size: var(--utensil-reorderable-marker-size, 2px);
  position: absolute;
  background: var(--pen-indicator);
  border-radius: var(--radius-full);
  pointer-events: none;
}

/* The style coordinates are the insertion line; the thickness centers on it */
.marker.vertical {
  width: var(--marker-size);
  translate: calc(var(--marker-size) / -2) 0;
}

.marker.horizontal {
  height: var(--marker-size);
  translate: 0 calc(var(--marker-size) / -2);
}

.utensil-high-contrast .marker {
  --marker-size: var(--utensil-reorderable-marker-size, 3px);
}

.home-placeholder {
  position: absolute;
  pointer-events: none;
}

.flow-placeholder {
  flex: none;
  box-sizing: border-box;
  pointer-events: none;
}

.flow-placeholder.animated {
  overflow: hidden;
  transition:
    width 150ms ease,
    height 150ms ease,
    margin 150ms ease;
}

.utensil-reduced-motion .flow-placeholder.animated {
  transition: none;
}

.utensil-reorderable-ghost {
  position: fixed;
  inset: auto;
  left: 0;
  top: 0;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  overflow: visible;
  pointer-events: none;
  will-change: transform;
  /* The popover keeps its DOM position so theme variables inherit into the top layer, but the UA
     popover stylesheet resets color */
  color: inherit;
}

.ghost-skeleton {
  width: 100%;
  height: 100%;
}
</style>

<style>
/* Items are the consumer's elements, so their drag states are styled unscoped, contained by the
   list class */
.utensil-reorderable-list:not(.no-grab-style) > [data-reorderable-state='grabbed'],
.utensil-reorderable-list:not(.no-grab-style) > [data-reorderable-state='release'] {
  transition: transform 150ms ease;
}

.utensil-reorderable-list:not(.no-grab-style) > [data-reorderable-state='grabbed'] {
  transform: scale(0.96);
}

.utensil-reorderable-list > [data-reorderable-state='moving'] {
  visibility: hidden;
}

/* Target-placeholder mode: the vacated space collapses instead of holding open */
.utensil-reorderable-list.target-placeholder > [data-reorderable-state='moving'] {
  display: none;
}

/* A held touch or an active drag must not start text selection or the iOS callout */
.utensil-reorderable-list.touch-hold > *,
.utensil-reorderable-list.dragging > * {
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

.utensil-reduced-motion .utensil-reorderable-list > [data-reorderable-state='grabbed'],
.utensil-reduced-motion .utensil-reorderable-list > [data-reorderable-state='release'] {
  transition: none;
}
</style>
