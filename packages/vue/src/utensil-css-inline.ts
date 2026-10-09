import layers from '@gobistories/utensil-css/utensil-layers.css?inline'
import a from '@gobistories/utensil-css/theme/colors/gray.css?inline'
import b from '@gobistories/utensil-css/utensil-reset.css?inline'
import c from '@gobistories/utensil-css/theme/utensil-theme.css?inline'
import d from '@gobistories/utensil-css/theme/text-themes.css?inline'
import e from '@gobistories/utensil-css/utensil-utilities.css?inline'

// Layer order must be established before any CSS that mentions the layers
export default [layers, a, b, c, d, e].join('\n')
