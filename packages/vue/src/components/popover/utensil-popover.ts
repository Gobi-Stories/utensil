/**
 * Placement options for the popover relative to its anchor.
 * Uses CSS anchor positioning terminology.
 */
export type PopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

/**
 * Maps placement values to CSS anchor positioning position-area values.
 * The position-area property defines where the popover is positioned relative to the anchor.
 */
export const placementToInsetArea: Record<PopoverPlacement, string> = {
  // Top placements (use explicit 'center' for centered variants to work in scrollable containers)
  top: 'top center',
  'top-start': 'top span-right',
  'top-end': 'top span-left',

  // Bottom placements
  bottom: 'bottom center',
  'bottom-start': 'bottom span-right',
  'bottom-end': 'bottom span-left',

  // Left placements
  left: 'center left',
  'left-start': 'left span-bottom',
  'left-end': 'left span-top',

  // Right placements
  right: 'center right',
  'right-start': 'right span-bottom',
  'right-end': 'right span-top',
}

/**
 * Maps placement values to their flipped counterparts for viewport boundary handling.
 */
export const flipPlacement: Record<PopoverPlacement, PopoverPlacement> = {
  top: 'bottom',
  'top-start': 'bottom-start',
  'top-end': 'bottom-end',
  bottom: 'top',
  'bottom-start': 'top-start',
  'bottom-end': 'top-end',
  left: 'right',
  'left-start': 'right-start',
  'left-end': 'right-end',
  right: 'left',
  'right-start': 'left-start',
  'right-end': 'left-end',
}

/**
 * Determines if the placement is on the block axis (top/bottom).
 */
export function isBlockPlacement(placement: PopoverPlacement): boolean {
  return placement.startsWith('top') || placement.startsWith('bottom')
}

/**
 * Determines if the placement is on the inline axis (left/right).
 */
export function isInlinePlacement(placement: PopoverPlacement): boolean {
  return placement.startsWith('left') || placement.startsWith('right')
}
