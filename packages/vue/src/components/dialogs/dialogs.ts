// Dialog component types for Vue 3
export interface UtensilModalComponent {
  close: (force?: boolean) => void
}

export type UtensilDialogComponent = UtensilModalComponent

export interface UtensilConfirmComponent extends UtensilModalComponent {
  confirm: () => void
}
