import { defaultPaperOptions } from 'utensil-vue/colors/generate-colors'
import type { ThemePreset } from 'utensil-vue/theme-editor/ThemeEditor.vue'

export const DEFAULT_PEN_COLOR = '#0093ee'
export const DEFAULT_PENCIL_COLOR = '#6b7280'
// White paper with the default options yields the neutral mode-anchored pages
// (#fcfcfc light, #111 dark). Preset-specific papers can be designed later.
export const DEFAULT_PAPER_COLOR = '#ffffff'

export const referenceColorPresets: ThemePreset[] = [
  {
    name: 'Nova',
    pen: '#0093ee',
    pencil: '#6b7280',
    paper: '#ffffff',
    paperOptions: defaultPaperOptions,
    radiusScale: 'normal',
  },
  {
    name: 'Barbie',
    pen: '#e0218a',
    pencil: '#4a3544',
    paper: '#ffffff',
    paperOptions: defaultPaperOptions,
    radiusScale: 'pill',
  },
  {
    name: 'Bezon',
    pen: '#febd69',
    pencil: '#232f3e',
    paper: '#ffffff',
    paperOptions: defaultPaperOptions,
    radiusScale: 'subtle',
  },
  {
    name: 'Big Red',
    pen: '#f40009',
    pencil: '#4a3b3b',
    paper: '#ffffff',
    paperOptions: defaultPaperOptions,
    radiusScale: 'round',
  },
  {
    name: 'Boredroom',
    pen: '#406177',
    pencil: '#9a9c9e',
    paper: '#ffffff',
    paperOptions: defaultPaperOptions,
    radiusScale: 'sharp',
  },
  {
    name: 'Bru',
    pen: '#f08c00',
    pencil: '#2e3747',
    paper: '#ffffff',
    paperOptions: defaultPaperOptions,
    radiusScale: 'subtle',
  },
  {
    name: 'Corduroy',
    pen: '#a66a3f',
    pencil: '#78746c',
    paper: '#ffffff',
    paperOptions: defaultPaperOptions,
    radiusScale: 'pill',
  },
  {
    name: 'Cyber',
    pen: '#a22574',
    pencil: '#1a2438',
    paper: '#ffffff',
    paperOptions: defaultPaperOptions,
    radiusScale: 'square',
  },
  {
    name: 'Forest',
    pen: '#3ba662',
    pencil: '#4b5563',
    paper: '#ffffff',
    paperOptions: defaultPaperOptions,
    radiusScale: 'round',
  },
  {
    name: 'Lagoon',
    pen: '#1ea0b6',
    pencil: '#64748b',
    paper: '#ffffff',
    paperOptions: defaultPaperOptions,
    radiusScale: 'bubble',
  },
  {
    name: 'Gobi',
    pen: '#90d5a7',
    pencil: '#171c21',
    paper: '#ffffff',
    paperOptions: defaultPaperOptions,
    radiusScale: 'circle',
  },
  {
    name: 'Googly',
    pen: '#4285f4',
    pencil: '#2a3040',
    paper: '#ffffff',
    paperOptions: defaultPaperOptions,
    radiusScale: 'bubble',
  },
  {
    name: 'Grape',
    pen: '#a564e2',
    pencil: '#6b7280',
    paper: '#ffffff',
    paperOptions: defaultPaperOptions,
    radiusScale: 'bubble',
  },
  {
    name: 'Mars',
    pen: '#cb3838',
    pencil: '#454054',
    paper: '#ffffff',
    paperOptions: defaultPaperOptions,
    radiusScale: 'square',
  },
  {
    name: 'Pale Ale',
    pen: '#cfa04a',
    pencil: '#78716c',
    paper: '#ffffff',
    paperOptions: defaultPaperOptions,
    radiusScale: 'subtle',
  },
  {
    name: 'Peel',
    pen: '#c8ee81',
    pencil: '#171c21',
    paper: '#ffffff',
    paperOptions: defaultPaperOptions,
    radiusScale: 'subtle',
  },
  {
    name: 'Robin',
    pen: '#0abab5',
    pencil: '#3b4f4e',
    paper: '#ffffff',
    paperOptions: defaultPaperOptions,
    radiusScale: 'bubble',
  },
  {
    name: 'Sleet',
    pen: '#9ac8e5',
    pencil: '#6b7280',
    paper: '#ffffff',
    paperOptions: defaultPaperOptions,
    radiusScale: 'subtle',
  },
]

export const referencePrimaryColors = {
  red: '#dc3545',
  orange: '#f59e0b',
  pink: '#ec4899',
  blue: '#0093ee',
  green: '#22c55e',
}
