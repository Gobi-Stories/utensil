import type { ColorProp, IconProp, ScaleProp, ThemeConfig } from '../../theme/utensil-theme'

export interface ToastAction {
  label: string
  onAction: () => void
}

export interface ToastOptions<Theme extends ThemeConfig = ThemeConfig> {
  message?: string
  color?: ColorProp<Theme>
  scale?: ScaleProp
  time?: number
  busy?: boolean
  progress?: number
  dismissible?: boolean
  // Called when the user dismisses the toast, not when it times out
  onDismiss?: () => void
  // Makes the toast body a button, called when it is activated
  onClick?: () => void
  icon?: IconProp<Theme>
  action?: ToastAction
}
