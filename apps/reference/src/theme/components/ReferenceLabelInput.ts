import UtensilLabelInput, { type Label } from 'utensil-vue/components/label-input/UtensilLabelInput.vue'
import type { ReferenceThemeConfig as ThemeConfig } from '../reference-theme'

export type ReferenceLabel = Label<ThemeConfig>

export const ReferenceLabelInput = UtensilLabelInput<ThemeConfig>
