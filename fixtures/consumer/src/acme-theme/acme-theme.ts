import type {
  ThemeConfig,
  UtensilColors,
  UtensilTextThemes,
  UtensilVariants,
  VariantMap,
} from '@gobistories/utensil-vue/theme/utensil-theme'
import type { AcmeIcons } from './acme-icons'

interface AcmeColors extends UtensilColors {
  blue: true
}

interface AcmeVariants extends UtensilVariants {
  primary: true
}

export interface AcmeThemeConfig extends ThemeConfig {
  name: 'acme'
  color: AcmeColors
  variant: AcmeVariants
  text: UtensilTextThemes
  icon: AcmeIcons
}

export const acmeVariantMap: VariantMap<AcmeThemeConfig> = {
  primary: 'blue',
  success: 'gray',
  warning: 'gray',
  error: 'gray',
  disabled: 'gray',
}
