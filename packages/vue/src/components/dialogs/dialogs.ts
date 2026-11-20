// Dialog component types for Vue 3
export interface UtensilModalComponent {
  close: (force?: boolean) => void
}

/** Size preset of a modal, dialog or confirm: `full` takes the whole viewport but a margin */
export type UtensilModalSize = 'small' | 'medium' | 'large' | 'full'

export type UtensilDialogComponent = UtensilModalComponent

export interface UtensilConfirmComponent extends UtensilModalComponent {
  confirm: () => void
}
